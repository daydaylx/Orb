import React, { Component, type ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode | ((props: { reset: () => void; error: Error | null }) => React.ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Log to localStorage for debugging persistence
    try {
        const errors = JSON.parse(localStorage.getItem('orb_errors') || '[]');
        errors.push({
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString()
        });
        // Keep last 50 errors
        localStorage.setItem('orb_errors', JSON.stringify(errors.slice(-50)));
    } catch (e) {
        console.warn('Failed to log error to localStorage', e);
    }

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
            return (this.props.fallback as any)({
                reset: this.handleReset,
                error: this.state.error
            });
        }
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-900 text-white rounded-lg border border-red-500/30 m-4">
          <h2 className="text-xl font-bold text-red-400 mb-2">Something went wrong</h2>
          <p className="text-gray-300 mb-4 text-center max-w-md">
            The application encountered an unexpected error.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <div className="bg-black/50 p-4 rounded text-sm font-mono text-red-200 mb-4 w-full max-w-2xl overflow-auto max-h-48">
              {this.state.error.toString()}
            </div>
          )}
          <button
            onClick={this.handleReset}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
