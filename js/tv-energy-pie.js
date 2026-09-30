import Chart from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.9/auto/+esm';
import { loadData, toNumber } from './csv-loader.js';

const meanColumn = 'Mean(Labelled energy consumption (kWh/year))';

export async function renderTvEnergyPie(canvas) {
  const rows = await loadData('Ex5_TV_energy_Allsizes_byScreenType.csv', [
    'Screen_Tech',
    meanColumn,
  ]);
  const labels = rows.map((row) => row.Screen_Tech);
  const values = rows.map((row) => toNumber(row[meanColumn]));

  new Chart(canvas, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: ['#2469a6', '#32a3bb', '#17456f'],
        borderColor: '#f8fbfe',
        borderWidth: 3,
        hoverOffset: 7,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: 8 },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { usePointStyle: true, boxWidth: 8, boxHeight: 8, padding: 18, color: '#62798e', font: { family: 'DM Sans', size: 10 } },
        },
        tooltip: {
          callbacks: {
            label: (item) => `${item.label}: ${Number(item.raw).toFixed(1)} kWh/year mean`,
          },
        },
      },
    },
  });
}
