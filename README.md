# Stocker - Advanced Trading Dashboard (Frontend Version)

**Built with ❤️ by Supriya**

Stocker is a state-of-the-art, real-time stock trading dashboard designed to provide institutional-grade analytics to retail investors. This project has been converted to a **Frontend-Only** architecture, simulating real-time data and full-stack features directly in the client.

![Stocker Dashboard](public/images/bg-login.png)

## 🚀 Key Features

*   **Real-Time Market Data**: Live stock price updates simulated on the client (No backend required).
*   **Interactive Dashboard**: Dynamic charts, drag-and-drop widget grid, and subscription management.
*   **Premium UI/UX**:
    *   **Glassmorphism Design**: Modern, translucent card effects and subtle glows.
    *   **Dark/Light Mode**: Fully responsive theming engine.
    *   **Fluid Animations**: Smooth page transitions, hover effects, and parallax backgrounds.
*   **User Personalization**:
    *   **Persistence**: Uses `localStorage` to save User Sessions, Subscriptions, and Theme preferences.
*   **Mock Functionality**:
    *   **Login**: Accepts any email for simulation (e.g., `user@example.com`).
    *   **Subscriptions**: Add/Remove stocks just like a real app.

## 🛠️ Technology Stack

This project is built with pure web technologies:

*   **HTML5**: Semantic structure.
*   **CSS3**: Variables, Flexbox/Grid, Glassmorphism, Animations.
*   **Vanilla JavaScript (ES6+)**:
    *   **Modules**: ESM for code organization.
    *   **State Management**: `localStorage` based persistence service.
    *   **Mock Services**: Custom services to simulate WebSocket streams and API calls.

## 📦 How to Run

### Method 1: The Easiest Way (Browser)
1.  **Open `public/login.html`** directly in your browser.
    *   *Note: If you run into any loading issues, try Method 2.*

### Method 2: Command Line (Recommended)
This requires Node.js installed on your machine.
1.  Open your terminal in the project folder.
2.  Run the command:
    ```bash
    npm start
    ```
    *(This runs `npx serve public` to start a local static server)*
3.  Open the link shown in the terminal (usually `http://localhost:3000`).

## 🌐 Deployment Instructions

You can deploy this project for **FREE** in seconds.

### **Option 1: Netlify (Recommended)**
1.  Go to [Netlify Drop](https://app.netlify.com/drop).
2.  Drag and drop the `public` folder into the upload area.
3.  Your site will be live instantly!

### **Option 2: Vercel**
1.  Install Vercel CLI: `npm i -g vercel`
2.  Run `vercel` inside the `public` folder.
3  Follow the prompts.

### **Option 3: GitHub Pages**
1.  Push the project to a GitHub repository.
2.  Go to Settings -> Pages.
3.  Select the `public` folder (or root if you move files up) as the source.

---

### Login Instructions (Simulation)
*   **Email**: Enter ANY email (e.g., `sap@example.com`) to login.
*   **Password**: Not required for this demo version.

---
*Copyright © 2025 Supriya. All Rights Reserved.*
