const fs = require('fs');
const path = require('path');
const { DATA_DIR } = require('../config/constants');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

class JsonModel {
    constructor(filename, initialData = {}) {
        this.filePath = path.join(DATA_DIR, filename);
        this.initialData = initialData;
        this.init();
    }

    init() {
        if (!fs.existsSync(this.filePath)) {
            this.write(this.initialData);
        }
    }

    read() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`Error reading ${this.filePath}:`, error);
            return this.initialData;
        }
    }

    write(data) {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            console.error(`Error writing to ${this.filePath}:`, error);
            return false;
        }
    }
}

module.exports = JsonModel;
