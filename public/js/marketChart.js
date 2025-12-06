
// Market chart update functions
function updateMarketChart(ticker, price) {
    // Initialize price history if needed
    if (!marketChartState.priceHistory[ticker]) {
        marketChartState.priceHistory[ticker] = [];
    }

    // Add new price
    marketChartState.priceHistory[ticker].push(price);
    if (marketChartState.priceHistory[ticker].length > marketChartState.maxHistory) {
        marketChartState.priceHistory[ticker].shift();
    }

    // Update chart if it exists
    if (window.marketChart) {
        updateChartData();
    }
}

function updateChartData() {
    if (!window.marketChart) return;

    // Update datasets for each stock
    state.allStocks.forEach((ticker, index) => {
        const prices = marketChartState.priceHistory[ticker] || [];
        if (window.marketChart.data.datasets[index]) {
            window.marketChart.data.datasets[index].data = prices;
        }
    });

    // Update labels based on data points
    const maxLength = Math.max(...state.allStocks.map(t => marketChartState.priceHistory[t]?.length || 0));
    window.marketChart.data.labels = Array.from({ length: maxLength }, (_, i) => i + 1);

    window.marketChart.update('none'); // Update without animation for smooth real-time updates
}

window.updateMarketChart = updateMarketChart;
window.marketChartState = marketChartState;
