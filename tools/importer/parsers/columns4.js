/* global WebImporter */
export default function parse(element, { document }) {
  // Get all first-level children
  const topChildren = Array.from(element.children);
  if (topChildren.length < 2) {
    // Not a columns block
    return;
  }
  // Left column: first major child (logo + title)
  const leftCol = topChildren[0];
  // All actions (Contact, Get Started, Get Started with icon) are found via [role="link"] from the element
  const links = Array.from(element.querySelectorAll('[role="link"]'));
  // Defensive: if fewer than 3 links, fill with empty divs
  const col2 = links[0] || document.createElement('div');
  const col3 = links[1] || document.createElement('div');
  const col4 = links[2] || document.createElement('div');

  // Create the table
  const table = document.createElement('table');
  // Header row with one <th> spanning all 4 columns
  const thead = document.createElement('thead');
  const headerTr = document.createElement('tr');
  const headerTh = document.createElement('th');
  headerTh.textContent = 'Columns (columns4)';
  headerTh.setAttribute('colspan', '4');
  headerTr.appendChild(headerTh);
  thead.appendChild(headerTr);
  table.appendChild(thead);
  // Data row
  const tbody = document.createElement('tbody');
  const dataTr = document.createElement('tr');
  [leftCol, col2, col3, col4].forEach(cellContent => {
    const td = document.createElement('td');
    td.append(cellContent);
    dataTr.appendChild(td);
  });
  tbody.appendChild(dataTr);
  table.appendChild(tbody);

  element.replaceWith(table);
}
