
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 text-center">
          <div className="max-w-md">
            <h1 className="font-serif text-4xl mb-4 text-accent">Ceva nu a mers bine.</h1>
            <p className="text-muted mb-8">A apărut o eroare neprevăzută. Vă rugăm să reîncărcați pagina.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-accent text-white uppercase tracking-widest font-bold text-xs"
            >
              Reîncarcă Pagina
            </button>
          </div>
        </div>
      );
    }

    // Fix: Access children from props
    return this.props.children;
  }
}
