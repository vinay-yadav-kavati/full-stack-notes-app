import { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorState } from './common/ErrorState';

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
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch() {
    // Error logged or sent to monitoring service if available
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorState
          type="network"
          fullScreen
          heading="Something went wrong"
          description="Unable to load your notes."
          onRetry={() => window.location.reload()}
          onGoHome={() => {
            window.location.href = '/dashboard';
          }}
        />
      );
    }

    return this.props.children;
  }
}
