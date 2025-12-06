export class DragDropManager {
    constructor(gridElement, saveCallback) {
        this.grid = gridElement;
        this.saveCallback = saveCallback;
        this.dragSrcEl = null;

        this.init();
    }

    init() {
        // Event delegation or attachment on existing items is handled by app logic
        // but we can set up the container listeners here for drop zones
    }

    addListeners(item) {
        item.addEventListener('dragstart', this.handleDragStart.bind(this));
        item.addEventListener('dragenter', this.handleDragEnter.bind(this));
        item.addEventListener('dragover', this.handleDragOver.bind(this));
        item.addEventListener('dragleave', this.handleDragLeave.bind(this));
        item.addEventListener('drop', this.handleDrop.bind(this));
        item.addEventListener('dragend', this.handleDragEnd.bind(this));
    }

    handleDragStart(e) {
        this.dragSrcEl = e.target.closest('.draggable');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', this.dragSrcEl.dataset.ticker);
        this.dragSrcEl.classList.add('dragging');
    }

    handleDragEnter(e) {
        e.target.closest('.draggable')?.classList.add('over');
    }

    handleDragOver(e) {
        if (e.preventDefault) e.preventDefault();
        return false;
    }

    handleDragLeave(e) {
        e.target.closest('.draggable')?.classList.remove('over');
    }

    handleDrop(e) {
        if (e.stopPropagation) e.stopPropagation();

        const dropTarget = e.target.closest('.draggable');

        if (this.dragSrcEl !== dropTarget && dropTarget) {
            // Swap DOM elements
            // We actually want to swap the order in the storage/logic array too.
            // For visual swap:
            const allItems = [...this.grid.children];
            const srcIndex = allItems.indexOf(this.dragSrcEl);
            const targetIndex = allItems.indexOf(dropTarget);

            if (srcIndex < targetIndex) {
                dropTarget.after(this.dragSrcEl);
            } else {
                dropTarget.before(this.dragSrcEl);
            }

            if (this.saveCallback) this.saveCallback();
        }

        return false;
    }

    handleDragEnd(e) {
        this.dragSrcEl.classList.remove('dragging');
        [...this.grid.children].forEach(item => item.classList.remove('over'));
    }
}
