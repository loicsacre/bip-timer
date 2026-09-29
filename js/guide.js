// The how-to, as HTML: shown by the help screen and written into each language's page so search
// engines read it without running the app.
export function guideSections(t) {
  const swatches = [
    ['--phase-prep', t.swatchPrep],
    ['--phase-effort', t.swatchEffort],
    ['--phase-recovery', t.swatchRecovery],
  ]
    .map(([color, label]) => `<div class="swatch"><i style="background: var(${color})"></i>${label}</div>`)
    .join('');

  return t.helpSections
    .map(([title, paragraphs, after]) => {
      const body = paragraphs ? paragraphs.map((text) => `<p>${text}</p>`).join('') : `<div class="stack">${swatches}</div>`;

      return `<section><h2 class="mono">${title}</h2>${body}${after ? `<p>${after}</p>` : ''}</section>`;
    })
    .join('');
}
