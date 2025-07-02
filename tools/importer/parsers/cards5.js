/* global WebImporter */
export default function parse(element, { document }) {
  // Header row from example
  const headerRow = ['Cards (cards5)'];
  const rows = [headerRow];

  // Find all card wrappers (immediate children of outer .css-y39ecu)
  const outer = element.querySelector(':scope > .css-y39ecu');
  if (!outer) return;
  const cardContainers = Array.from(outer.querySelectorAll(':scope > .css-i5gobc'));

  cardContainers.forEach((container) => {
    // LEFT CELL: Find image (the profile picture)
    let img = container.querySelector('img');
    let leftCell = img || document.createTextNode('');

    // RIGHT CELL: Build text content with
    // - Name (bold)
    // - Role (below name)
    // - Description (below role)
    // - Social links (Twitter, Dribbble, Linkedin)
    let name = container.querySelector('.css-lpnecz .css-ydwetc, .css-lpnecz .css-88ht7e, .css-lpnecz .css-r1whug p');
    if (!name) name = container.querySelector('.css-lpnecz p');
    let role = container.querySelector('.css-lpnecz .css-xcgr3e p');
    let desc = container.querySelector('.css-cjsrtu .textContents p');
    let socialsContainer = container.querySelector('.css-fcm5jq');
    let socialLinks = [];
    if (socialsContainer) {
      // Try to find real <a> tags in the future; for now, fallback to text as shown
      socialLinks = Array.from(socialsContainer.querySelectorAll('p')).map((p, idx, arr) => {
        // Try to extract the social type from text
        const text = p.textContent?.trim() || '';
        // Use <span> for layout (no links in HTML)
        const span = document.createElement('span');
        span.textContent = text;
        if (idx < arr.length - 1) {
          span.style.marginRight = '16px';
        }
        return span;
      });
    }

    // Compose right cell
    const frag = document.createElement('div');
    if (name) {
      const strong = document.createElement('strong');
      strong.textContent = name.textContent;
      frag.appendChild(strong);
      frag.appendChild(document.createElement('br'));
    }
    if (role) {
      const span = document.createElement('span');
      span.textContent = role.textContent;
      frag.appendChild(span);
      frag.appendChild(document.createElement('br'));
    }
    if (desc) {
      frag.appendChild(desc);
      frag.appendChild(document.createElement('br'));
    }
    if (socialLinks.length) {
      socialLinks.forEach(link => frag.appendChild(link));
    }

    rows.push([leftCell, frag]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
