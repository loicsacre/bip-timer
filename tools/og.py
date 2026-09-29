# Draws the link-preview images, one per language, from icons/logo.svg and the site's fonts.
# Needs Pillow: python3 tools/og.py
import re
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / 'fonts'

BACKGROUND = '#0E0D0B'
INK = '#F2EFE8'
TEXT_SECONDARY = '#B4AEA3'
PHASES = {'prep': '#D9A227', 'effort': '#F5F2EA', 'recovery': '#4FA37A'}

W, H = 1200, 630
S = 3  # the whole card is drawn three times larger, then reduced

IMAGES = {
    'og-image.png': ('MINUTEUR D’INTERVALLES', 'Réglé en dix secondes,\nlancé en un tap.'),
    'og-image-en.png': ('INTERVAL TIMER', 'Set in ten seconds,\nstarted in one tap.'),
    'og-image-nl.png': ('INTERVALTIMER', 'Ingesteld in tien seconden,\ngestart met één tik.'),
}


def subpaths(d):
    """Flattens the path's M/L/C/Z commands, absolute or relative, into closed point lists."""
    tokens = re.findall(r'[MmLlCcZz]|-?\d*\.?\d+', d)
    shapes, points = [], []
    x = y = 0.0
    command = None
    i = 0

    def number():
        nonlocal i
        i += 1
        return float(tokens[i - 1])

    while i < len(tokens):
        if tokens[i].isalpha():
            command = tokens[i]
            i += 1
            if command in 'Zz':
                shapes.append(points)
                points = []
                continue
        relative = command.islower()
        kind = command.upper()
        if kind == 'M':
            dx, dy = number(), number()
            x, y = (x + dx, y + dy) if relative else (dx, dy)
            if points:
                shapes.append(points)
            points = [(x, y)]
            command = 'l' if relative else 'L'
        elif kind == 'L':
            dx, dy = number(), number()
            x, y = (x + dx, y + dy) if relative else (dx, dy)
            points.append((x, y))
        elif kind == 'C':
            c = [number() for _ in range(6)]
            if relative:
                c = [c[k] + (x if k % 2 == 0 else y) for k in range(6)]
            x0, y0 = x, y
            for step in range(1, 25):
                t = step / 24
                u = 1 - t
                px = u**3 * x0 + 3 * u * u * t * c[0] + 3 * u * t * t * c[2] + t**3 * c[4]
                py = u**3 * y0 + 3 * u * u * t * c[1] + 3 * u * t * t * c[3] + t**3 * c[5]
                points.append((px, py))
            x, y = c[4], c[5]
    if points:
        shapes.append(points)
    return shapes


def logo_mask(height):
    svg = (ROOT / 'icons' / 'logo.svg').read_text()
    view_w, view_h = map(float, re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', svg).groups())
    tx, ty, sx, sy = map(float, re.search(r'translate\(([-\d.]+),([-\d.]+)\) scale\(([-\d.]+),([-\d.]+)\)', svg).groups())
    d = re.search(r'<path [^>]*d="([^"]+)"', svg).group(1)

    scale = height * 4 / view_h
    size = (round(view_w * scale), round(view_h * scale))
    mask = Image.new('L', size, 0)

    # Each contour flips what it covers, so the runner's shape stays a hole inside the letter.
    for points in subpaths(d):
        layer = Image.new('L', size, 0)
        ImageDraw.Draw(layer).polygon([((tx + sx * px) * scale, (ty + sy * py) * scale) for px, py in points], fill=255)
        mask = ImageChops.logical_xor(mask.convert('1'), layer.convert('1')).convert('L')

    draw = ImageDraw.Draw(mask)
    for cx, cy, r in re.findall(r'<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"', svg):
        cx, cy, r = float(cx) * scale, float(cy) * scale, float(r) * scale
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=0)
    for rx, ry, rw, rh, radius in re.findall(r'<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)" rx="([\d.]+)"', svg):
        rx, ry, rw, rh, radius = (float(v) * scale for v in (rx, ry, rw, rh, radius))
        draw.rounded_rectangle([rx, ry, rx + rw, ry + rh], radius=radius, fill=0)

    return mask.resize((round(size[0] / 4), height), Image.LANCZOS)


def card(eyebrow, tagline, mask):
    canvas = Image.new('RGB', (W * S, H * S), BACKGROUND)
    draw = ImageDraw.Draw(canvas)

    mark_x, mark_y = 96 * S, (H * S - mask.height) // 2 - 16 * S
    canvas.paste(Image.new('RGB', mask.size, INK), (mark_x, mark_y), mask)

    display = ImageFont.truetype(str(FONTS / 'SairaCondensed-Bold.woff2'), 150 * S)
    mono = ImageFont.truetype(str(FONTS / 'IBMPlexMono-Medium.woff2'), 24 * S)
    body = ImageFont.truetype(str(FONTS / 'Archivo-Medium.woff2'), 34 * S)
    x = mark_x + mask.width + 72 * S

    cursor = x
    for character in eyebrow:
        draw.text((cursor, 138 * S), character, font=mono, fill=TEXT_SECONDARY)
        cursor += draw.textlength(character, font=mono) + 4 * S
    draw.text((x, 160 * S), 'BIP TIMER', font=display, fill=INK)
    draw.multiline_text((x, 362 * S), tagline, font=body, fill=TEXT_SECONDARY, spacing=10 * S)

    # The run preview from the app: a circuit of 4 exercises × 3 rounds, each step as wide as it lasts.
    steps = [('prep', 10)]
    for round_ in range(3):
        for exercise in range(4):
            steps.append(('effort', 40))
            if exercise < 3:
                steps.append(('recovery', 20))
        if round_ < 2:
            steps.append(('recovery', 60))

    left, right, gap = x, (W - 96) * S, 3 * S
    total = sum(seconds for _, seconds in steps)
    usable = right - left - gap * (len(steps) - 1)
    for phase, seconds in steps:
        width = usable * seconds / total
        draw.rectangle([left, 470 * S, left + width, 488 * S], fill=PHASES[phase])
        left += width + gap

    return canvas.resize((W, H), Image.LANCZOS)


if __name__ == '__main__':
    mask = logo_mask(400 * S)
    for name, (eyebrow, tagline) in IMAGES.items():
        card(eyebrow, tagline, mask).save(ROOT / name, optimize=True)
