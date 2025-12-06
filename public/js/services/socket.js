export class SocketService {
    constructor(url, email, onMessage) {
        this.url = url;
        this.email = email;
        this.onMessage = onMessage;
        this.ws = null;
        this.reconnectInterval = 3000;
    }

    connect() {
        if (!this.email) {
            console.error('No email provided for WebSocket connection');
            return;
        }

        const wsUrl = `${this.url}?email=${encodeURIComponent(this.email)}`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log('Connected to WebSocket');
            this.reconnectInterval = 3000; // Reset
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.onMessage(data);
            } catch (e) {
                console.error('Error parsing WS message', e);
            }
        };

        this.ws.onclose = () => {
            console.log('WebSocket disconnected. Reconnecting...');
            setTimeout(() => this.connect(), this.reconnectInterval);
            this.reconnectInterval = Math.min(this.reconnectInterval * 1.5, 30000);
        };

        this.ws.onerror = (err) => {
            console.error('WebSocket Error:', err);
            this.ws.close();
        };
    }

    close() {
        if (this.ws) {
            this.ws.onclose = null; // Prevent reconnect
            this.ws.close();
        }
    }
}
