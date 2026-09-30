import Chart from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.9/auto/+esm';
import { loadData, toNumber } from './csv-loader.js';

const series = [
  { heading: 'Queensland ($ per megawatt hour)', label: 'Queensland', color: '#2469a6' },
  { heading: 'New South Wales ($ per megawatt hour)', label: 'New South Wales', color: '#32a3bb' },
  { heading: 'Victoria ($ per megawatt hour)', label: 'Victoria', color: '#17456f' },
  { heading: 'South Australia ($ per megawatt hour)', label: 'South Australia', color: '#6479bd' },
  { heading: 'Tasmania ($ per megawatt hour)', label: 'Tasmania', color: '#71a8d0' },
  { heading: 'Snowy ($ per megawatt hour)', label: 'Snowy', color: '#318b83' },
  { heading: 'Average Price (notTas-Snowy)', label: 'Average', color: '#203c58', dash: [5, 4] },
];

export async function renderSpotPrices(canvas) {
  const rows = await loadData('Ex5_ARE_Spot_Prices.csv', [
    'Year',
    ...series.map((item) => item.heading),
  ]);
  const datasets = series
    .map((item) => ({
      label: item.label,
      data: rows.map((row) => toNumber(row[item.heading])),
      borderColor: item.color,
      backgroundColor: item.color,
      borderDash: item.dash ?? [],
      borderWidth: item.label === 'Average' ? 2.5 : 1.6,
      pointRadius: 0,
      pointHoverRadius: 4,
      tension: 0.24,
      spanGaps: false,
    }))
    .filter((dataset) => dataset.data.some((value) => value !== null));

  new Chart(canvas, {
    type: 'line',
    data: { labels: rows.map((row) => row.Year), datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { usePointStyle: true, boxWidth: 7, boxHeight: 7, padding: 11, color: '#62798e', font: { family: 'DM Sans', size: 9 } },
        },
        tooltip: {
          callbacks: {
            label: (item) => `${item.dataset.label}: ${item.formattedValue} $/MWh`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { maxTicksLimit: 9, maxRotation: 0, color: '#7c90a2', font: { family: 'DM Sans', size: 9 } },
        },
        y: {
          title: { display: true, text: '$ per megawatt hour', color: '#70869a', font: { family: 'DM Sans', size: 10 } },
          grid: { color: '#e7eef4' },
          ticks: { color: '#7c90a2', font: { family: 'DM Sans', size: 9 } },
        },
      },
    },
  });
}
