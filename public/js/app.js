import { SocketService } from './services/socket.js';
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

// Redirect if not logged in
if (!state.user || !state.token) {
    window.location.href = 'login.html';
}

userEmailDisplay.textContent = state.user;

// WebSocket Setup
const socket = new SocketService(
    `ws://${window.location.host}`,
    state.user,
    handleSocketMessage
);

function handleSocketMessage(msg) {
    if (msg.type === 'WELCOME' || msg.type === 'UPDATE') {
        const data = msg.data;
        Object.keys(data).forEach(ticker => {
            updateTicker(ticker, data[ticker]);
        });

        // Update Connection UI
        connectionStatus.className = 'w-2 h-2 rounded-full bg-green-500 animate-pulse';
        connectionText.textContent = 'Live Feed Active';
    }
}


function updateTicker(ticker, price) {
    state.prices[ticker] = price;

    // If the card doesn't exist, create it (only if we think we should have it)
    // NOTE: The server sends updates for subscribed stocks. 
    // If we receive an update, it means we are subscribed.
    if (!state.elements[ticker]) {
        createCard(ticker, price);
    } else {
        state.elements[ticker].update(price);
    }
}

function createCard(ticker, price) {
    const card = new StockCard(ticker, price);
    state.elements[ticker] = card;
    grid.appendChild(card.element);
}

// Subscription Management
async function fetchSubscriptions() {
    try {
        const res = await fetch(`/api/subscriptions?email=${state.user}`);
        const data = await res.json();
        state.subscriptions = data.subscriptions;

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
    const endpoint = isSubscribed ? '/api/unsubscribe' : '/api/subscribe';

    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: state.user, ticker })
        });

        const data = await res.json();
        // Server returns updated list
        state.subscriptions = data.subscriptions;

        if (isSubscribed) {
            // Unsubscribed
            if (state.elements[ticker]) {
                state.elements[ticker].element.remove();
                delete state.elements[ticker];
            }
        }
        // If subscribed, we will wait for next WS update to create card OR we can ask for current price.
        // For simplicity, we can just fetch stocks or wait for next tick (max 1s).
        // Let's speed it up by asking server or just waiting. Waiting is smoother.

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
socket.connect();
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
document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.onclick = (e) => {
        const theme = e.target.dataset.setTheme;
        document.body.className = `${theme} transition-colors duration-500`;
        localStorage.setItem('aether_theme', theme);
    }
});

// Load saved theme
const savedTheme = localStorage.getItem('aether_theme');
if (savedTheme) document.body.className = `${savedTheme} transition-colors duration-500`;
