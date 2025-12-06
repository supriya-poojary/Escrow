/**
 * Generates an SVG sparkline path with straight lines for fintech look
 */
function createSparkline(data, width = 120, height = 40, isPositive = true) {
    if (!data || data.length < 2) return '';

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * height; // Invert Y
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const strokeColor = isPositive ? 'var(--success)' : 'var(--danger)';

    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" style="overflow: visible;">
        <defs>
            <linearGradient id="grad-${isPositive}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:${strokeColor};stop-opacity:0.2" />
                <stop offset="100%" style="stop-color:${strokeColor};stop-opacity:0" />
            </linearGradient>
        </defs>
        <path d="M0,${height} L${points.join(' L')} L${width},${height} Z" fill="url(#grad-${isPositive})" stroke="none" />
        <polyline points="${points.join(' ')}" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="${points[points.length - 1].split(',')[0]}" cy="${points[points.length - 1].split(',')[1]}" r="3" fill="${strokeColor}" />
      </svg>
    `;
}

/**
 * Enhanced Stock Card
 */
export function StockCard(stock, index = 0) {
    const { ticker, price, change, history } = stock;
    const isPositive = change >= 0;
    const colorClass = isPositive ? 'text-success' : 'text-danger';
    const arrow = isPositive ? '▲' : '▼';

    // Stagger delay based on index
    const delayClass = `delay-${Math.min(index + 1, 5)}`;

    return `
      <div id="card-${ticker}" class="glass-panel p-md flex flex-col justify-between draggable animate-enter ${delayClass}" 
           style="min-height: 180px; position: relative; overflow: hidden; border-radius: var(--radius-lg); transition: transform 0.2s, box-shadow 0.2s;"
           draggable="true"
           data-ticker="${ticker}">
        
        <div class="flex justify-between items-start">
            <div class="flex items-center gap-sm">
                <span class="drag-handle" title="Drag to reorder">⋮⋮</span>
                <div class="icon-box">
                    <!-- Placeholder Icon based on first letter -->
                    <span class="font-bold text-lg">${ticker[0]}</span>
                </div>
                <div>
                   <h3 class="font-bold text-lg leading-tight">${ticker}</h3>
                   <span class="text-xs text-muted">NASQ</span>
                </div>
            </div>
            <div class="text-right">
                <div class="price font-heading text-2xl font-bold" style="font-feature-settings: 'tnum';">$${price.toFixed(2)}</div>
                <div class="change text-sm font-bold ${colorClass} flex items-center justify-end gap-xs">
                    <span>${arrow}</span>
                    <span>${Math.abs(change).toFixed(2)}%</span>
                </div>
            </div>
        </div>
        
        <div class="sparkline-container" style="margin-top: auto; padding-top: var(--space-md);">
           ${createSparkline(history, 280, 50, isPositive)}
        </div>
        
        <!-- Hover actions -->
        <div class="card-actions" style="position: absolute; top: 10px; right: 10px; opacity: 0; transition: opacity 0.2s;">
            <button class="btn-icon" onclick="openDetail('${ticker}')">🔍</button>
        </div>
      </div>
    `;
}

// Re-export specific helpers if needed, or keep internal.
export { createSparkline };

/**
 * Toast Notification
 */
export function Notification(message, type = 'info') {
    const div = document.createElement('div');
    div.className = `glass-panel p-md flex items-center gap-sm`;
    div.style.borderLeft = `4px solid var(--${type === 'error' ? 'danger' : 'success'})`;
    div.style.minWidth = '300px';
    div.style.animation = 'slideUpFade 0.4s ease forwards';
    div.style.marginBottom = '10px';
    div.innerHTML = `
        <span class="text-sm font-bold">${message}</span>
    `;

    setTimeout(() => {
        div.style.opacity = '0';
        div.style.transform = 'translateY(10px)';
        setTimeout(() => div.remove(), 300);
    }, 4000);

    return div;
}

/**
 * Subscription Item
 */
export function SubscriptionItem(ticker, isSubscribed) {
    return `
        <div class="flex justify-between items-center p-md" style="background: rgba(255,255,255,0.03); border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
            <div class="flex items-center gap-md">
                <div class="icon-box" style="width: 32px; height: 32px;">${ticker[0]}</div>
                <span class="font-bold">${ticker}</span>
            </div>
            <button class="btn ${isSubscribed ? 'btn-secondary' : 'btn-primary'} text-sm" 
                    data-action="toggle-sub" 
                    data-ticker="${ticker}">
                ${isSubscribed ? 'Unsubscribe' : 'Subscribe'}
            </button>
        </div>
    `;
}
