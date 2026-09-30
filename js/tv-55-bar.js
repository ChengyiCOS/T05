import Chart from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.9/auto/+esm';
import { loadData, toNumber } from './csv-loader.js';

const meanColumn = 'Mean(Labelled energy consumption (kWh/year))';

export async function renderTv55Bar(canvas) {
  const rows = await loadData('Ex5_TV_energy_55inchtv_byScreenType.csv', [
    'Screen_Tech',
    meanColumn,
  ]);
  const labels = rows.map((row) => row.Screen_Tech);
  const values = rows.map((row) => toNumber(row[meanColumn]));

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Mean energy use',
        data: values,
        backgroundColor: ['#2469a6', '#32a3bb', '#6479bd'],
        borderRadius: 4,
        maxBarThickness: 72,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => `${item.formattedValue} kWh/year`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#62798e', font: { family: 'DM Sans', size: 10 } },
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Mean energy use (kWh/year)', color: '#70869a', font: { family: 'DM Sans', size: 10 } },
          grid: { color: '#e7eef4' },
          ticks: { color: '#7c90a2', font: { family: 'DM Sans', size: 9 } },
        },
      },
    },
  });
}
