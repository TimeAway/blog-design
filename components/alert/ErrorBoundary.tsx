import React from 'react';
import Alert from '.';

interface ErrorBoundaryProps {
  message?: React.ReactNode;
  description?: React.ReactNode;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  {
    error?: Error | null;
    info: {
      componentStack?: string;
    };
  }
> {
  state = {
    error: undefined,
    info: {
      componentStack: '',
    },
  };

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      info: errorInfo,
    });
  }

  render() {
    const { message, description, children } = this.props;
    const { error, info: { componentStack = null } = {} } = this.state;
    const errorMessage = typeof message === 'undefined' ? (error || '').toString() : message;
    const errorDescription = typeof description === 'undefined' ? componentStack : description;
    if (error) {
      return (
        <Alert type="error" message={errorMessage} description={<pre>{errorDescription}</pre>} />
      );
    }
    return children;
  }
}
