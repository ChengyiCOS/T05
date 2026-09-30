import { renderSpotPrices } from './spot-prices.js';
import { renderTvScatter } from './tv-scatter.js';
import { renderTv55Bar } from './tv-55-bar.js';
import { renderTvEnergyPie } from './tv-energy-pie.js';

const charts = [
  ['scatter-chart', renderTvScatter],
  ['line-chart', renderSpotPrices],
  ['bar-chart', renderTv55Bar],
  ['pie-chart', renderTvEnergyPie],
];

await Promise.all(charts.map(async ([canvasId, renderChart]) => {
  const canvas = document.getElementById(canvasId);
  const status = canvas.parentElement.querySelector('.chart-state');

  try {
    await renderChart(canvas);
    status.remove();
  } catch (error) {
    console.error(`Unable to render ${canvasId}:`, error);
    status.classList.add('is-error');
    status.textContent = error.message || 'Unable to load this chart.';
  }
}));
