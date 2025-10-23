import React, { ReactNode, ErrorInfo, Component } from 'react';
import { useLocalization } from '../hooks/useLocalization';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

const FallbackUI: React.FC = () => {
    const { t } = useLocalization();
    return (
        <div className="text-center p-8 m-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800">
          <h1 className="text-xl font-bold">{t('error.boundary.title')}</h1>
          <p className="mt-2">{t('error.boundary.message')}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
          >
            {t('error.boundary.refresh')}
          </button>
        </div>
    )
}


class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In a real app, you would log this to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    // If an error was caught, render the fallback UI.
    if (this.state.hasError) {
      return this.props.fallback || <FallbackUI />;
    }

    // Otherwise, render the children as normal.
    return this.props.children;
  }
}

export default ErrorBoundary;