import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null, 
      errorInfo: null,
      isMobile: window.innerWidth <= 768,
      isTelegram: window.isTelegramBrowser || navigator.userAgent.indexOf('Telegram') !== -1
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // If in Telegram browser, reload the page after a short delay
    if (this.state.isTelegram) {
      console.log('Error in Telegram browser - will attempt to reload');
      // For Telegram, we'll just reload the page instead of showing error UI
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }

  // Attempt to recover by refreshing the page
  handleRefresh = () => {
    window.location.reload();
  }

  render() {
    const { hasError, isMobile, isTelegram } = this.state;

    if (hasError) {
      // For Telegram, show a very simple error message
      if (isTelegram) {
        return (
          <div className="telegram-error" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'white',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            flexDirection: 'column',
            padding: '20px'
          }}>
            <h3 style={{color: 'red'}}>Loading Error</h3>
            <p>Please open this site in Chrome or Safari for the best experience.</p>
            <button 
              onClick={this.handleRefresh}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: 'green',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            >
              Try Again
            </button>
          </div>
        );
      }
      
      // For mobile devices
      if (isMobile) {
        return (
          <div className="error-container mobile">
            <div className="error-content">
              <h2>Something went wrong</h2>
              <p>The page encountered a problem while loading.</p>
              <button 
                onClick={this.handleRefresh}
                className="refresh-button"
              >
                Refresh Page
              </button>
            </div>
          </div>
        );
      }
      
      // For desktop
      return (
        <div className="error-container">
          <div className="error-content">
            <h2>Something went wrong</h2>
            <p>An error occurred while loading this part of the page.</p>
            <button 
              onClick={this.handleRefresh}
              className="refresh-button"
            >
              Refresh Page
            </button>
            <details style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
              <summary>Error Details (for developers)</summary>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </details>
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary; 