import Chart from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.9/auto/+esm';
import { loadData, toNumber } from './csv-loader.js';

const colors = ['#2469a6', '#32a3bb', '#17456f', '#6479bd', '#71a8d0', '#318b83'];

export async function renderTvScatter(canvas) {
  const rows = await loadData('Ex5_TV_energy.csv', [
    'brand',
    'screen_tech',
    'screensize',
    'energy_consumpt',
    'count',
  ]);
  const technologies = [...new Set(rows.map((row) => row.screen_tech).filter(Boolean))].sort();
  const datasets = technologies.map((technology, index) => ({
    label: technology,
    data: rows
      .filter((row) => row.screen_tech === technology)
      .map((row) => ({
        x: toNumber(row.screensize),
        y: toNumber(row.energy_consumpt),
        brand: row.brand,
        count: toNumber(row.count) ?? 1,
      }))
      .filter((point) => point.x !== null && point.y !== null),
    backgroundColor: colors[index % colors.length],
    borderColor: colors[index % colors.length],
    pointRadius: (context) => Math.max(2, Math.min(6, Math.sqrt(context.raw.count))),
    pointHoverRadius: 7,
  }));

  new Chart(canvas, {
    type: 'scatter',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'nearest', intersect: true },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { usePointStyle: true, boxWidth: 7, boxHeight: 7, padding: 12, color: '#62798e', font: { family: 'DM Sans', size: 9 } },
        },
        tooltip: {
          callbacks: {
            title: (items) => items[0].raw.brand,
            label: (item) => `${item.dataset.label} · ${item.raw.x} in · ${item.raw.y} kWh/year`,
          },
        },
      },
      scales: {
        x: {
          type: 'linear',
          title: { display: true, text: 'Screen size (inches)', color: '#70869a', font: { family: 'DM Sans', size: 10 } },
          grid: { color: '#e7eef4' },
          ticks: { color: '#7c90a2', font: { family: 'DM Sans', size: 9 } },
        },
        y: {
          title: { display: true, text: 'Energy use (kWh/year)', color: '#70869a', font: { family: 'DM Sans', size: 10 } },
          grid: { color: '#e7eef4' },
          ticks: { color: '#7c90a2', font: { family: 'DM Sans', size: 9 } },
        },
      },
    },
  });
}
