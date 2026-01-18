import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * ErrorBoundary component to catch rendering errors in the component tree.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render(): ReactNode {
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

    return this.props.children;
  }
}