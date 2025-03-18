import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Starting application...');

const rootElement = document.getElementById("root");
if (!rootElement) {
    console.error("Failed to find the root element");
    throw new Error("Failed to find the root element");
}

try {
    console.log('Creating root...');
    const root = createRoot(rootElement);
    console.log('Rendering app...');
    root.render(<App />);
    console.log('Application rendered successfully');
} catch (error) {
    console.error("Error rendering the app:", error);
    throw error;
}
