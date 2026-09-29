// The how-to, as HTML: shown by the help screen and written into each language's page so search
// engines read it without running the app. `level` is the heading level of each section.
export function guideSections(t, level = 2) {
  const heading = (text) => `<h${level} class="mono">${text}</h${level}>`;
  const swatches = [
    ['--phase-prep', t.swatchPrep],
    ['--phase-effort', t.swatchEffort],
    ['--phase-recovery', t.swatchRecovery],
  ]
    .map(([color, label]) => `<div class="swatch"><i style="background: var(${color})"></i>${label}</div>`)
    .join('');

  const sections = t.helpSections.map(([title, paragraphs, after]) => {
    const body = paragraphs ? paragraphs.map((text) => `<p>${text}</p>`).join('') : `<div class="stack">${swatches}</div>`;

    return `<section>${heading(title)}${body}${after ? `<p>${after}</p>` : ''}</section>`;
  });

  const questions = t.faq.map(([question, answer]) => `<h${level + 1} class="question">${question}</h${level + 1}><p>${answer}</p>`).join('');

  return [...sections, `<section class="faq">${heading(t.faqTitle)}${questions}</section>`].join('');
}
