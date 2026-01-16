
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * ErrorBoundary component to catch rendering errors in the component tree.
 */
// Fixed: Explicitly extended React.Component with <Props, State> generics to ensure this.state and this.props are recognized
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // Initializing state
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    // Fixed: Properly accessing this.state on class component
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 text-center bg-background">
          <div className="max-w-md p-10 bg-surface border border-border shadow-2xl">
            <h1 className="font-serif text-4xl mb-4 text-accent">Eroare Sistem</h1>
            <p className="text-muted mb-8 text-sm uppercase tracking-widest font-bold">A apărut o problemă la procesarea datelor locale.</p>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="px-8 py-3 bg-accent text-white uppercase tracking-widest font-bold text-[10px] hover:opacity-90"
            >
              Resetare & Reîncărcare
            </button>
          </div>
        </div>
      );
    }

    // Fixed: Properly accessing this.props on class component
    return this.props.children;
  }
}
