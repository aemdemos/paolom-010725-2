/* global WebImporter */
export default function parse(element, { document }) {
  // Header row (single column, per example)
  const cells = [['Cards (cards1)']];

  // Each card is a direct child div
  const cardRoots = Array.from(element.querySelectorAll(':scope > div'));
  cardRoots.forEach(cardRoot => {
    // LEFT CELL: avatar image
    let avatarImg = cardRoot.querySelector('[data-isimage="true"] img');

    // RIGHT CELL: stars, testimonial, name, and role
    const rightCellContent = [];

    // Star images
    const starImgs = Array.from(cardRoot.querySelectorAll('img[src$=".svg"]'));
    if (starImgs.length) {
      const starsSpan = document.createElement('span');
      starImgs.forEach(img => starsSpan.appendChild(img));
      rightCellContent.push(starsSpan);
    }

    // Testimonial text
    const testimonial = cardRoot.querySelector('.css-hfcmt4 p');
    if (testimonial) {
      rightCellContent.push(testimonial);
    }

    // Name (bold)
    const name = cardRoot.querySelector('.css-r1whug p');
    if (name) {
      const strong = document.createElement('strong');
      strong.textContent = name.textContent;
      rightCellContent.push(strong);
    }

    // Role/Company
    const role = cardRoot.querySelector('.css-us51lk p');
    if (role) {
      const div = document.createElement('div');
      div.textContent = role.textContent;
      rightCellContent.push(div);
    }

    // Push the two-column row representing the card
    cells.push([
      avatarImg || '',
      rightCellContent.length ? rightCellContent : '',
    ]);
  });

  // Create and replace with block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
