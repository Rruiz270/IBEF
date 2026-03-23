'use client';

import React, { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
            <span className="text-red-400 text-xl font-bold">!</span>
          </div>
          <h2 className="text-lg font-semibold text-white/90">
            Algo deu errado
          </h2>
          <p className="text-sm text-white/50 max-w-md">
            {this.state.error.message || 'Erro inesperado na aplicação.'}
          </p>
          <button
            onClick={this.handleReload}
            className="mt-2 px-4 py-2 rounded-lg bg-[#0A2463] text-white text-sm font-medium hover:bg-[#0A2463]/80 transition-colors"
          >
            Recarregar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
