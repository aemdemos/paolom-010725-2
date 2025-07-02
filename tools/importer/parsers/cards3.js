/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as required
  const cells = [['Cards (cards3)']];

  // Find all .css-i5gobc elements that contain a .css-932eil block (card content root)
  // This ensures no CTA-only or empty cards are included
  const allCardRoots = Array.from(element.querySelectorAll('.css-i5gobc'))
    .filter(card => card.querySelector('.css-932eil'));

  // Use a Set to guarantee deduplication by a key of (heading|description), only keep cards with both image and text
  const dedup = new Set();
  const cards = [];
  for (const card of allCardRoots) {
    // Find heading and description for deduplication key
    const heading = card.querySelector('p.css-ydwetc, p.css-329o6o, p.css-z6m7gn, p');
    let desc = null;
    const ps = card.querySelectorAll('p');
    if (ps.length > 1) desc = ps[1];
    else desc = card.querySelector('p.css-ydwgaq');
    // Find image/icon
    let imageCell = null;
    const iconGroup = card.querySelector('.css-8kkpf5');
    if (iconGroup) imageCell = iconGroup;
    else {
      const img = card.querySelector('img');
      if (img) imageCell = img;
      else {
        const svg = card.querySelector('svg');
        if (svg) imageCell = svg;
      }
    }
    // Only include if heading & description with (optionally) image/icon (per spec, image is mandatory)
    if (!heading || !desc || !imageCell) continue;
    const key = heading.textContent.trim() + '|' + desc.textContent.trim();
    if (dedup.has(key)) continue;
    dedup.add(key);
    // --- TEXT/CTA CELL ---
    const textCell = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = heading.textContent;
    textCell.appendChild(strong);
    textCell.appendChild(document.createElement('br'));
    const descDiv = document.createElement('div');
    descDiv.textContent = desc.textContent;
    textCell.appendChild(descDiv);
    // CTA: .css-pygv96 as nextElementSibling or descendant (inside card)
    let ctaRoot = null;
    if (card.nextElementSibling && card.nextElementSibling.matches('.css-pygv96')) {
      ctaRoot = card.nextElementSibling;
    } else {
      ctaRoot = card.querySelector('.css-pygv96');
    }
    if (ctaRoot) {
      const ctaText = ctaRoot.querySelector('p') || ctaRoot;
      const link = document.createElement('a');
      link.href = '#';
      link.textContent = ctaText.textContent.trim();
      link.style.display = 'inline-block';
      link.style.marginTop = '0.7em';
      textCell.appendChild(link);
    }
    cards.push([imageCell, textCell]);
    if (cards.length === 3) break; // Only the first 3 unique full cards, as per example
  }

  // Insert only the three deduped, valid rows
  cards.forEach(row => cells.push(row));

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
