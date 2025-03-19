import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

console.log('Starting application...');

const rootElement = document.getElementById("root");
if (!rootElement) {
    console.error("Failed to find the root element");
    throw new Error("Failed to find the root element");
}

try {
    console.log('Creating root...');
    const root = ReactDOM.createRoot(rootElement);
    console.log('Rendering app...');
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
    console.log('Application rendered successfully');
} catch (error) {
    console.error("Error rendering the app:", error);
    throw error;
}
