/*
 * Table Block
 * Recreate a table
 * https://www.hlx.live/developer/block-collection/table
 */

const CHECKMARK_SVG = `<svg class="table-checkmark" width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="checkmark"><path fill-rule="evenodd" clip-rule="evenodd" d="M24 2.24316C11.9621 2.24316 2.24316 11.8038 2.24316 23.5532C2.24316 35.3025 11.9621 44.8632 24 44.8632C29.492 44.8632 34.5022 42.8722 38.3272 39.5931C38.7975 39.19 39.5056 39.2444 39.9087 39.7147C40.3119 40.185 40.2574 40.893 39.7872 41.2962C35.5675 44.9136 30.043 47.1063 24 47.1063C10.7652 47.1063 0 36.5829 0 23.5532C0 10.5234 10.7652 0 24 0C37.2348 0 48 10.5234 48 23.5532C48 29.4358 45.8012 34.8192 42.1709 38.9426C41.7616 39.4076 41.0529 39.4526 40.5879 39.0433C40.123 38.634 40.0779 37.9253 40.4873 37.4604C43.7737 33.7275 45.7568 28.8654 45.7568 23.5532C45.7568 11.8038 36.0379 2.24316 24 2.24316Z" fill="#ED8B00"/><path d="M9.87402 25.7692L12.0535 23.5324L19.6241 30.9883L35.2816 15.3882L37.5184 17.625L19.6241 35.4619L9.87402 25.7692Z" fill="#ED8B00"/></svg>`;

function buildCell(rowIndex) {
  const cell = rowIndex ? document.createElement('td') : document.createElement('th');
  if (!rowIndex) cell.setAttribute('scope', 'col');
  return cell;
}

export default async function decorate(block) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  const header = !block.classList.contains('no-header');
  if (header) table.append(thead);
  table.append(tbody);

  [...block.children].forEach((child, i) => {
    const row = document.createElement('tr');
    if (header && i === 0) thead.append(row);
    else tbody.append(row);
    [...child.children].forEach((col) => {
      const cell = buildCell(header ? i : i + 1);
      const align = col.getAttribute('data-align');
      const valign = col.getAttribute('data-valign');
      if (align) cell.style.textAlign = align;
      if (valign) cell.style.verticalAlign = valign;
      cell.innerHTML = col.innerHTML;
      if (cell.textContent.trim() === '✓') {
        cell.innerHTML = CHECKMARK_SVG;
        cell.classList.add('table-cell-check');
      }
      row.append(cell);
    });
  });
  block.innerHTML = '';
  block.append(table);
}