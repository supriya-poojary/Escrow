# Stocker - Advanced Trading Dashboard

**Built with ❤️ by Supriya**

Stocker is a state-of-the-art, real-time stock trading dashboard designed to provide institutional-grade analytics to retail investors. This project demonstrates a full-stack implementation of a modern fintech application with a focus on performance, aesthetics, and user experience.

![Stocker Dashboard](public/images/bg-login.png)

## 🚀 Key Features

*   **Real-Time Market Data**: Live stock price updates pushed via WebSockets.
*   **Interactive Dashboard**: dynamic charts (simulated), drag-and-drop widget grid, and subscription management.
*   **Premium UI/UX**:
    *   **Glassmorphism Design**: Modern, translucent card effects and subtle glows.
    *   **Dark/Light Mode**: Fully responsive theming engine.
    *   **Fluid Animations**: Smooth page transitions, hover effects, and parallax backgrounds.
*   **User Personalization**:
    *   Custom welcome greetings.
    *   Dynamic avatars based on user initials.
    *   Persisted layout preferences.
*   **Secure Authentication**: Simulated secure login flow with token-based session management.
*   **Data-Rich Information**: Dedicated pages for company info, careers, and support.

## 🛠️ Technology Stack

This project was built from scratch without heavy frameworks, showcasing deep understanding of core web technologies.

### **Frontend**
*   **HTML5**: Semantic structure for accessibility and SEO.
*   **CSS3**:
    *   **CSS Variables**: For robust theming (Dark/Light modes).
    *   **Flexbox & Grid**: For responsive, complex layouts.
    *   **Keyframe Animations**: For high-performance UI motion.
    *   **Glassmorphism**: Backdrop filters and gradient overlays.
*   **Vanilla JavaScript (ES6+)**:
    *   No frameworks (React/Vue/Angular) - pure, efficient DOM manipulation.
    *   **Modules**: ESM for code organization (`import`/`export`).
    *   **WebSocket Client**: Native `WebSocket` API for real-time data.
    *   **LocalStorage**: For persisting user state and preferences.

### **Backend**
*   **Node.js**: Asynchronous event-driven runtime.
*   **Express.js**: Fast, unopinionated web framework for API routes (`/api/login`, `/api/subscribe`).
*   **WS (WebSocket)**: High-performance WebSocket server library for broadcasting live stock ticks.

## 📦 How to Run

Follow these steps to deploy the application on your local machine:

### Prerequisites
*   Node.js installed (v14+ recommended).

### Installation

1.  **Open your terminal** (Command Prompt, PowerShell, or VS Code Terminal).
2.  **Navigate to the project directory**:
    ```bash
    cd "path/to/project_folder"
    ```
    *(If you are already in the folder, skip this step)*
3.  **Install Dependencies**:
    ```bash
    npm install
    ```
    *This downloads the required backend libraries (`express`, `ws`, `nodemon`).*

### Running the Server

1.  **Start the Application**:
    ```bash
    node server/server.js
    ```
    *You should see a message saying:* `Server started on http://localhost:3000`

2.  **Access the App**:
    *   Open your web browser (Chrome, Edge, etc.).
    *   Go to: **[http://localhost:3000](http://localhost:3000)**

### Login Credentials (Simulation)
You can use any email to "simulate" a login, but here are the demo users configured:
*   **Email**: `sap@example.com` (password: `password`)
*   **Email**: `suppi@example.com` (password: `password`)

## 📂 Project Structure

```
├── public/                 # Frontend Assets
│   ├── css/               # Stylesheets (style.css, variables.css, animations.css)
│   ├── js/                # Client-side Logic (app.js, DragDrop.js, etc.)
│   ├── images/            # Images and Backgrounds
│   ├── dashboard.html     # Main Application Interface
│   ├── login.html         # Authentication Interface
│   └── info.html          # Dynamic Information Page
├── server/                 # Backend
│   └── server.js          # Node.js + Express + WebSocket Server
├── package.json            # Project Metadata & Dependencies
└── README.md               # You are reading this!
```

---
*Copyright © 2025 Supriya. All Rights Reserved.*
