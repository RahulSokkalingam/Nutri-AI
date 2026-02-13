import React from 'react';
import Chat from './components/Chat';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Nutri AI</h1>
        <p>Your Personal Health Assistant</p>
      </header>
      <main className="main-content">
        <ErrorBoundary>
          <Chat />
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;
