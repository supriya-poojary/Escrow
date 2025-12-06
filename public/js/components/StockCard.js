import { formatCurrency } from '../utils/formatters.js';

export class StockCard {
    constructor(ticker, price) {
        this.ticker = ticker;
        this.price = price;
        this.prevPrice = price;
        this.priceHistory = [price]; // Track last 20 prices for sparkline
        this.maxHistoryLength = 20;
        this.element = this.create();
        this.updateSparkline();
    }

    create() {
        const div = document.createElement('div');
        div.className = 'card stock-card draggable animate-fade-in relative overflow-hidden';
        div.dataset.ticker = this.ticker;
        div.draggable = true;

        // Different light gradient colors for each stock
        const gradients = {
            'GOOG': 'from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20',
            'TSLA': 'from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20',
            'AMZN': 'from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20',
            'META': 'from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20',
            'NVDA': 'from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20'
        };
        const bgGradient = gradients[this.ticker] || 'from-gray-100 to-gray-50 dark:from-gray-800/30 dark:to-gray-700/20';

        div.innerHTML = `
            <!-- Light gradient background with 3D effect -->
            <div class="absolute inset-0 bg-gradient-to-br ${bgGradient}"></div>
            
            <!-- 3D highlight effect -->
            <div class="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/10 dark:to-transparent"></div>
            
            <div class="relative z-10 flex justify-between items-center mb-3">
                <div class="flex items-center gap-2">
                    <span class="icon-bg p-1.5 rounded-full bg-white/80 dark:bg-white/20 backdrop-blur-sm shadow-md">
                        <div class="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                            ${this.ticker[0]}
                        </div>
                    </span>
                    <h3 class="font-bold text-lg text-gray-900 dark:text-white" style="text-shadow: 0 1px 2px rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.1);">${this.ticker}</h3>
                </div>
                <button class="text-xs text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 unsubscribe-btn bg-white/80 dark:bg-black/40 p-1.5 rounded-full px-2.5 font-bold hover:bg-white dark:hover:bg-black/60 transition-colors shadow-md" title="Unsubscribe">×</button>
            </div>
            
            <div class="relative z-10 flex flex-col items-end mb-2">
                <div class="stock-price text-3xl font-bold transition-colors duration-300 text-gray-900 dark:text-white leading-tight" id="price-${this.ticker}" style="text-shadow: 0 2px 3px rgba(255,255,255,0.9), 0 3px 6px rgba(0,0,0,0.15);">
                    ${formatCurrency(this.price)}
                </div>
                <div class="text-sm flex items-center gap-1 font-semibold mt-1" id="delta-${this.ticker}">
                    <span class="indicator"></span>
                    <span class="delta-value text-gray-800 dark:text-gray-200 bg-white/70 dark:bg-black/50 px-2 py-0.5 rounded shadow-md" style="text-shadow: 0 1px 2px rgba(255,255,255,0.5);">0.00%</span>
                </div>
            </div>
            
            <!-- Sparkline placeholder -->
            <div class="relative z-10 h-8 w-full bg-white/50 dark:bg-black/30 rounded overflow-hidden backdrop-blur-sm shadow-inner">
                 <svg class="w-full h-full sparkline" preserveAspectRatio="none">
                    <path d="" fill="none" stroke="var(--color-brand-teal)" stroke-width="2" class="spark-path"></path>
                 </svg>
            </div>
        `;

        // Bind events
        div.querySelector('.unsubscribe-btn').onclick = (e) => {
            e.stopPropagation(); // Prevent drag
            div.dispatchEvent(new CustomEvent('unsubscribe', { bubbles: true, detail: { ticker: this.ticker } }));
        };

        return div;
    }

    update(newPrice) {
        if (newPrice === this.price) return;

        this.prevPrice = this.price;
        this.price = newPrice;

        // Add to price history
        this.priceHistory.push(newPrice);
        if (this.priceHistory.length > this.maxHistoryLength) {
            this.priceHistory.shift(); // Remove oldest
        }

        const priceEl = this.element.querySelector(`#price-${this.ticker}`);
        const deltaEl = this.element.querySelector(`#delta-${this.ticker}`);

        // Calculate change
        const diff = newPrice - this.prevPrice;
        const percent = (diff / this.prevPrice) * 100;

        // Animate
        const direction = diff >= 0 ? 'up' : 'down';
        const colorClass = direction === 'up' ? 'text-success' : 'text-danger';
        const bgFlash = direction === 'up' ? 'flash-up' : 'flash-down';

        // Update Text
        priceEl.textContent = formatCurrency(newPrice);

        // Update Delta
        const sign = diff >= 0 ? '+' : '';
        deltaEl.innerHTML = `
            <span class="${colorClass}">${sign}${percent.toFixed(2)}%</span>
        `;

        // Apply visual flash
        this.element.classList.remove('flash-up', 'flash-down');
        void this.element.offsetWidth; // Trigger reflow
        this.element.classList.add(bgFlash);

        // Price text color flash
        priceEl.classList.remove('text-main', 'text-success', 'text-danger');
        priceEl.classList.add(colorClass);
        setTimeout(() => {
            priceEl.classList.remove(colorClass);
        }, 1000);

        // Update sparkline chart
        this.updateSparkline();
    }

    updateSparkline() {
        const sparkPath = this.element.querySelector('.spark-path');
        if (!sparkPath || this.priceHistory.length < 2) return;

        const prices = this.priceHistory;
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const priceRange = maxPrice - minPrice || 1; // Avoid division by zero

        // SVG dimensions (matches the container)
        const width = 100; // Percentage-based, will scale
        const height = 100;
        const padding = 5;

        // Generate path points
        const points = prices.map((price, index) => {
            const x = (index / (prices.length - 1)) * width;
            const y = height - (((price - minPrice) / priceRange) * (height - 2 * padding)) - padding;
            return `${x},${y}`;
        });

        // Create SVG path
        const pathData = `M ${points.join(' L ')}`;
        sparkPath.setAttribute('d', pathData);
        sparkPath.setAttribute('vector-effect', 'non-scaling-stroke');

        // Color based on overall trend
        const firstPrice = prices[0];
        const lastPrice = prices[prices.length - 1];
        const trendColor = lastPrice >= firstPrice ? '#10b981' : '#ef4444'; // green or red
        sparkPath.setAttribute('stroke', trendColor);
    }
}
