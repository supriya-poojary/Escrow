# Aether Full Stack Project with Node.js Backend

Build with❤️by Supriya (India)

## About the Project
This project is a stock market dashboard application ("Aether") initially built as a frontend project. It has noted been enhanced with a robust Node.js + Express backend to handle dynamic data serving, user subscriptions, and newsletter signups. The backend simulates real-time stock price variations and persists data in local JSON files.

## Quick Start: Running the Application
Follow these steps to get the full application running locally.

### 1. Start the Backend
The backend handles data and API requests.
1. Open a terminal.
2. Navigate to the backend folder: `cd backend`
3. Install dependencies (first time only): `npm install`
4. Start the server: `npm start`
   - You should see: `Server running on http://localhost:5000`
   - Keep this terminal window **OPEN**.

### 2. Run the Frontend
1. Open the `public/index.html` file in your browser.
2. **Recommended**: If using VS Code, right-click `public/index.html` and select "Open with Live Server" for the best experience.
3. The frontend will now connect to your running backend (once integrated).

---

## Project Structure
```
/
├── backend/                # [NEW] Node.js Backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Business logic
│   ├── data/               # JSON storage (stocks, subs, etc.)
│   ├── models/             # Data access helpers
│   ├── routes/             # API definitions
│   └── server.js           # Server entry point
├── public/                 # Existing Frontend (Unchanged)
│   ├── css/
│   ├── images/
│   ├── js/
│   ├── index.html          # Login Page
│   └── dashboard.html      # Main Dashboard
└── README.md               # This documentation
```

---

## Backend Setup Instructions (Detailed)

### 1. Prerequisites
- Node.js installed on your machine.

### 2. Installation
Open your terminal in the project root and navigate to the `backend` folder:
```bash
cd backend
npm install
```
This will install `express`, `cors`, and other dependencies.

### 3. Running the Backend
Start the server:
```bash
npm start
```
The server will run at `http://localhost:5000`.

---

## API Documentation

### Base URL: `http://localhost:5000/api`

### 1. Get Live Stock Prices
- **Endpoint**: `GET /stocks`
- **Description**: Returns current prices for all stocks with simulated variations.
- **Variation Logic**: Every time this endpoint is called, prices move up or down by a random percentage (-0.6% to +0.6%) to simulate market volatility.
- **Response**:
```json
{
  "GOOG": 2855.12,
  "TSLA": 742.30,
  ...
}
```

### 2. Get Stock History (Graph Data)
- **Endpoint**: `GET /stocks/history` or `GET /stocks/history/:ticker`
- **Description**: Returns array of recent price points for graphing.
- **Response**:
```json
{
  "GOOG": [2845.32, 2850.10, 2855.12, ...],
  ...
}
```

### 3. User Subscriptions
- **Endpoint**: `GET /subscriptions?user=email@example.com`
- **Description**: Get list of stocks a user is subscribed to.
- **Endpoint**: `POST /subscriptions`
- **Body**: `{ "user": "email@example.com", "ticker": "GOOG", "action": "add" }` (or "remove")

### 4. Newsletter
- **Endpoint**: `POST /newsletter`
- **Body**: `{ "email": "user@example.com" }`
- **Description**: Saves email to `backend/data/newsletter.json`.

---

## Frontend Integration Guide

Since the frontend files were kept untouched, here is how you can connect them to the new backend.
You need to replace the mock service logic with `fetch()` calls.

### 1. Fetching Stock Prices
Replace the logic in `public/js/services/mockPriceService.js` (or in `app.js` update loop) with:

```javascript
/* In app.js or a new service */
async function fetchStockPrices() {
    try {
        const response = await fetch('http://localhost:5000/api/stocks');
        const prices = await response.json();
        
        // Update your frontend state with these real prices
        Object.keys(prices).forEach(ticker => {
            updateTicker(ticker, prices[ticker]); // Your existing update function
        });
    } catch (error) {
        console.error('Error fetching stocks:', error);
    }
}

// Call this every 2.5 seconds instead of the mock interval
setInterval(fetchStockPrices, 2500);
```

### 2. Connecting the Subscription Modal
Update `toggleSubscription` in `public/js/app.js`:

```javascript
async function toggleSubscription(ticker) {
    const user = localStorage.getItem('aether_user');
    const isSubscribed = state.subscriptions.includes(ticker);
    const action = isSubscribed ? 'remove' : 'add';

    try {
        const response = await fetch('http://localhost:5000/api/subscriptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user, ticker, action })
        });
        
        const updatedSubs = await response.json();
        state.subscriptions = updatedSubs; // Update local state
        
        // Update UI
        renderSubscriptionModal();
        // Trigger UI updates for added/removed cards...
    } catch (error) {
        console.error('Subscription error:', error);
    }
}
```

### 3. Newsletter Form
Update the newsletter form submit handler in `public/js/app.js`:

```javascript
newsletterForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input').value;

    try {
        await fetch('http://localhost:5000/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        // Show success popup (existing code)
        newsletterPopup.classList.remove('hidden');
        newsletterForm.reset();
    } catch (error) {
        console.error('Newsletter error:', error);
    }
};
```

---

## Deployment Steps

### Backend Deployment (Render or Railway)
1.  **Push to GitHub**: Push this entire project to a GitHub repository.
2.  **Create Service**: Go to Render.com or Railway.app and create a new Web Service.
3.  **Root Directory**: Set the "Root Directory" to `backend`.
4.  **Build Command**: `npm install`
5.  **Start Command**: `node server.js`
6.  **Environment**: The service will provide you a URL (e.g., `https://my-backend.onrender.com`).
    *   *Note*: You will need to update your frontend `fetch` calls to use this new URL instead of `localhost:5000`.

### Frontend Deployment (Netlify)
1.  **Create Site**: Go to Netlify.com and "Import from GitHub".
2.  **Build Settings**:
    *   **Publish directory**: `public`
3.  **Deploy**: Netlify will host your `index.html` and static assets.

---

## Contact
**Email**: supriyaspoojary26@gmail.com
**Developer**: Supriya (India)
