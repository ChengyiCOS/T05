import Papa from 'https://cdn.jsdelivr.net/npm/papaparse@5.5.3/+esm';

export async function loadData(fileName, columnHeading) {
  const requiredColumns = Array.isArray(columnHeading) ? columnHeading : [columnHeading];
  const dataUrl = new URL(`../data/${encodeURIComponent(fileName)}`, import.meta.url);
  const response = await fetch(dataUrl);

  if (!response.ok) {
    throw new Error(`Could not load ${fileName} (${response.status}).`);
  }

  const csvText = await response.text();
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (header) => header.replace(/^\uFEFF/, '').trim(),
  });

  if (result.errors.length > 0) {
    const firstError = result.errors[0];
    throw new Error(`${fileName}: ${firstError.message} near row ${firstError.row + 1}.`);
  }

  const missingColumns = requiredColumns.filter((heading) => !result.meta.fields.includes(heading));
  if (missingColumns.length > 0) {
    throw new Error(`${fileName} is missing column${missingColumns.length === 1 ? '' : 's'}: ${missingColumns.join(', ')}.`);
  }

  return result.data;
}

export function toNumber(value) {
  if (value === null || value === undefined || String(value).trim() === '') {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}
