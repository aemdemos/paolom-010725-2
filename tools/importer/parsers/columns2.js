/* global WebImporter */
export default function parse(element, { document }) {
  // Find the stat columns (each immediate child of the inner flex container)
  const statCols = Array.from(element.querySelectorAll(':scope > div > div'));
  if (!statCols.length) return;

  // The header row must be a SINGLE cell, regardless of column count
  const cells = [['Columns (columns2)']];

  // The content row: one cell for each stat column, referencing the main content block in each
  const contentRow = statCols.map((statCol) => statCol);

  cells.push(contentRow);

  // Create and replace with the correct table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
