import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Header } from './Header';
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div>
          <Header/>
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              Try again
            </button>
            <div>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              Back to Home
            </button>
          </div>
          </div>
        </div>
        </div>
      );
    }

    return this.props.children;
  }
}