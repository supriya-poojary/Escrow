import { formatCurrency } from '../utils/formatters.js';

export class StockCard {
    constructor(ticker, price) {
        this.ticker = ticker;
        this.price = price;
        this.prevPrice = price;
        this.element = this.create();
    }

    create() {
        const div = document.createElement('div');
        div.className = 'card stock-card draggable animate-fade-in';
        div.dataset.ticker = this.ticker;
        div.draggable = true;

        div.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <div class="flex items-center gap-sm">
                    <span class="icon-bg p-2 rounded-full bg-white/5">
                         <!-- Simple SVG Icon placeholder that is distinct per stock could go here -->
                        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-xs font-bold text-white">
                            ${this.ticker[0]}
                        </div>
                    </span>
                    <h3 class="font-bold text-lg">${this.ticker}</h3>
                </div>
                <button class="text-xs text-muted hover:text-danger unsubscribe-btn" title="Unsubscribe">×</button>
            </div>
            
            <div class="flex flex-col items-end">
                <div class="stock-price text-3xl transition-colors duration-300" id="price-${this.ticker}">
                    ${formatCurrency(this.price)}
                </div>
                <div class="text-sm flex items-center gap-xs" id="delta-${this.ticker}">
                    <span class="indicator"></span>
                    <span class="delta-value text-muted">0.00%</span>
                </div>
            </div>
            
            <!-- Sparkline placeholder -->
            <div class="mt-4 h-8 w-full bg-white/5 rounded overflow-hidden relative">
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
            // Return to main color or keep distinct? Usually return to main for cleanliness
        }, 1000);
    }
}
