// import { SocketService } from './services/socket.js'; // Removed for static version
import { StockCard } from './components/StockCard.js';
import { DragDropManager } from './dragDrop.js';
import { formatCurrency } from './utils/formatters.js';

// App State
const state = {
    user: localStorage.getItem('aether_user'),
    token: localStorage.getItem('aether_token'),
    subscriptions: [], // List of tickers
    prices: {}, // { Ticker: Price }
    elements: {}, // { Ticker: StockCardInstance }
    // In a real app, this list might come from an API
    allStocks: ["GOOG", "TSLA", "AMZN", "META", "NVDA"]
};

// UI Refs
const grid = document.getElementById('tickerGrid');
const connectionStatus = document.getElementById('connectionStatus');
const connectionText = document.getElementById('connectionText');
const userEmailDisplay = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');
const refreshSubs = document.getElementById('refreshSubsBtn');
const subsModal = document.getElementById('subsModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const availableStocksList = document.getElementById('availableStocksList');
const liveVariations = document.getElementById('liveVariations');

// Market chart state
const marketChartState = {
    priceHistory: {}, // { ticker: [prices] }
    maxHistory: 20,
    chart: null
};

// Redirect if not logged in
if (!state.user || !state.token) {
    window.location.href = 'login.html';
}

// Display user name and first initial
if (state.user) {
    let name = state.user.split('@')[0];
    let displayName = name.charAt(0).toUpperCase() + name.slice(1);

    // Update Welcome Text
    const nameDisplay = document.getElementById('userEmail');
    if (nameDisplay) {
        nameDisplay.innerHTML = `Welcome, <span class="text-success">${displayName}</span>`;
    }

    // Update Avatar Letter
    const avatarEl = document.getElementById('userAvatarTitle');
    if (avatarEl) {
        avatarEl.textContent = displayName.charAt(0);
    }
}

// WebSocket Setup
// WebSocket Setup
const socket = new window.MockSocketService(state.user);

// Start Price Simulation
if (window.mockPriceService) {
    window.mockPriceService.start();
}

function handleSocketMessage(msg) {
    if (msg.type === 'WELCOME' || msg.type === 'UPDATE') {
        const data = msg.data;
        Object.keys(data).forEach(ticker => {
            updateTicker(ticker, data[ticker]);
        });

        // Initialize sidebar on first connection
        if (msg.type === 'WELCOME') {
            setTimeout(initializeSidebar, 100);
        }

        // Update Connection UI
        connectionStatus.className = 'w-2 h-2 rounded-full bg-green-500 animate-pulse';
        connectionText.textContent = 'Live Feed Active';
    }
}


function updateTicker(ticker, price) {
    state.prices[ticker] = price;

    // Update main card
    if (!state.elements[ticker]) {
        createCard(ticker, price);
    } else {
        state.elements[ticker].update(price);
    }

    // Update market chart
    updateMarketChart(ticker, price);
}

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
            window.marketChart.data.datasets[index].data = [...prices];
        }
    });

    // Update labels based on data points
    const maxLength = Math.max(...state.allStocks.map(t => marketChartState.priceHistory[t]?.length || 0));
    window.marketChart.data.labels = Array.from({ length: maxLength }, (_, i) => i + 1);

    // Update legend with live prices
    window.marketChart.update('none');
}

// Expose state to window for chart legend
window.state = state;

function updateSidebarItem(ticker, price) {
    // Initialize price history if needed
    if (!sidebarState.priceHistory[ticker]) {
        sidebarState.priceHistory[ticker] = [];
    }

    // Add new price
    sidebarState.priceHistory[ticker].push(price);
    if (sidebarState.priceHistory[ticker].length > sidebarState.maxHistory) {
        sidebarState.priceHistory[ticker].shift();
    }

    // Find or create sidebar item
    let item = document.getElementById(`sidebar-${ticker}`);
    if (!item) {
        item = createSidebarItem(ticker, price);
        liveVariations.appendChild(item);
    }

    // Update price
    const priceEl = item.querySelector('.sidebar-price');
    if (priceEl) {
        priceEl.textContent = formatCurrency(price);
    }

    // Update mini chart
    updateSidebarChart(ticker);
}

function createSidebarItem(ticker, price) {
    const div = document.createElement('div');
    div.id = `sidebar-${ticker}`;
    div.className = 'bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors';

    div.innerHTML = `
        <div class="flex justify-between items-center mb-2">
            <span class="font-bold text-white">${ticker}</span>
            <span class="sidebar-price text-sm font-mono text-teal-400">${formatCurrency(price)}</span>
        </div>
        <svg class="w-full h-12 sidebar-chart-${ticker}" preserveAspectRatio="none">
            <path class="sidebar-path" fill="none" stroke="#10b981" stroke-width="2"></path>
        </svg>
    `;

    return div;
}

function updateSidebarChart(ticker) {
    const prices = sidebarState.priceHistory[ticker];
    if (!prices || prices.length < 2) return;

    const svg = document.querySelector(`.sidebar-chart-${ticker}`);
    const path = svg?.querySelector('.sidebar-path');
    if (!path) return;

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;

    const width = 100;
    const height = 100;
    const padding = 5;

    const points = prices.map((price, index) => {
        const x = (index / (prices.length - 1)) * width;
        const y = height - (((price - minPrice) / priceRange) * (height - 2 * padding)) - padding;
        return { x, y };
    });

    // Create area path (filled region)
    const pathPoints = points.map(p => `${p.x},${p.y}`).join(' L ');
    const areaPath = `M 0,${height} L ${pathPoints} L ${width},${height} Z`;

    path.setAttribute('d', areaPath);
    path.setAttribute('vector-effect', 'non-scaling-stroke');

    // Color based on trend with semi-transparent fill
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const isUp = lastPrice >= firstPrice;
    const strokeColor = isUp ? '#10b981' : '#ef4444';
    const fillColor = isUp ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)';

    path.setAttribute('stroke', strokeColor);
    path.setAttribute('fill', fillColor);
    path.setAttribute('stroke-width', '2');
}

// Initialize sidebar with all stocks
function initializeSidebar() {
    state.allStocks.forEach(ticker => {
        const price = state.prices[ticker] || 0;
        if (price > 0) {
            updateSidebarItem(ticker, price);
        }
    });
}

function createCard(ticker, price) {
    const card = new StockCard(ticker, price);
    state.elements[ticker] = card;
    grid.appendChild(card.element);
}

// Subscription Management
// Subscription Management
async function fetchSubscriptions() {
    try {
        state.subscriptions = window.storageService.getSubscriptions(state.user);

        // Remove locally if server says we aren't subscribed (sync)
        Object.keys(state.elements).forEach(ticker => {
            if (!state.subscriptions.includes(ticker)) {
                state.elements[ticker].element.remove();
                delete state.elements[ticker];
            }
        });

        renderSubscriptionModal();
    } catch (e) {
        console.error(e);
    }
}

async function toggleSubscription(ticker) {
    const isSubscribed = state.subscriptions.includes(ticker);

    try {
        if (isSubscribed) {
            state.subscriptions = window.storageService.removeSubscription(state.user, ticker);
            // Unsubscribed UI update
            if (state.elements[ticker]) {
                state.elements[ticker].element.remove();
                delete state.elements[ticker];
            }
        } else {
            state.subscriptions = window.storageService.addSubscription(state.user, ticker);
        }

        renderSubscriptionModal();
    } catch (e) {
        console.error(e);
    }
}

function renderSubscriptionModal() {
    availableStocksList.innerHTML = '';
    state.allStocks.forEach(ticker => {
        const isSub = state.subscriptions.includes(ticker);
        const item = document.createElement('div');
        item.className = 'flex justify-between items-center p-3 bg-white/5 rounded border border-white/5 hover:bg-white/10 transition-colors cursor-pointer';
        item.innerHTML = `
            <span class="font-bold">${ticker}</span>
            <div class="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center ${isSub ? 'bg-teal-500 border-teal-500' : ''}">
                ${isSub ? '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10 3L4.5 8.5L2 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
            </div>
        `;
        item.onclick = () => toggleSubscription(ticker);
        availableStocksList.appendChild(item);
    });
}

// Initial Load
socket.connect(handleSocketMessage);
fetchSubscriptions();

// Drag & Drop
const dnd = new DragDropManager(grid, () => {
    // Optional: Save order to localstorage
    const order = [...grid.children].map(c => c.dataset.ticker);
    localStorage.setItem('aether_layout', JSON.stringify(order));
});

// Event Listeners
logoutBtn.onclick = () => {
    localStorage.removeItem('aether_token');
    window.location.href = 'login.html';
};

refreshSubs.onclick = () => {
    fetchSubscriptions();
    subsModal.classList.remove('hidden');
};

closeModalBtn.onclick = () => subsModal.classList.add('hidden');
document.getElementById('saveSubsBtn').onclick = () => subsModal.classList.add('hidden');

document.addEventListener('unsubscribe', (e) => {
    toggleSubscription(e.detail.ticker);
});

// Theme Switching
const themeToggleBtn = document.getElementById('themeToggle');
const iconSun = document.getElementById('iconSun');
const iconMoon = document.getElementById('iconMoon');
const htmlEl = document.documentElement;

function setTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('aether_theme', theme);

    // Icon toggle
    if (theme === 'dark') {
        iconSun.classList.remove('hidden');
        iconMoon.classList.add('hidden');
    } else {
        iconSun.classList.add('hidden');
        iconMoon.classList.remove('hidden');
    }
}

// Initial Load
const savedTheme = localStorage.getItem('aether_theme') || 'light';
setTheme(savedTheme);

themeToggleBtn.onclick = () => {
    const current = htmlEl.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
};

// Newsletter Form
const newsletterForm = document.getElementById('newsletterForm');
const newsletterPopup = document.getElementById('newsletterPopup');
const closeNewsletterPopup = document.getElementById('closeNewsletterPopup');

if (newsletterForm) {
    newsletterForm.onsubmit = (e) => {
        e.preventDefault();
        newsletterPopup.classList.remove('hidden');
        newsletterForm.reset();
    };
}

if (closeNewsletterPopup) {
    closeNewsletterPopup.onclick = () => {
        newsletterPopup.classList.add('hidden');
    };
}
