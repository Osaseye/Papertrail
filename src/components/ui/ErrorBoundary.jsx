import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 font-sans">
          <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="bg-red-50 dark:bg-red-900/20 p-6 flex justify-center border-b border-red-100 dark:border-red-900/30">
              <div className="p-3 bg-red-100 dark:bg-red-800/30 rounded-full">
                <AlertCircle size={48} className="text-red-600 dark:text-red-400" />
              </div>
            </div>
            
            <div className="p-6 md:p-8 text-center space-y-4">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Something went wrong</h1>
              <p className="text-slate-600 dark:text-slate-300">
                app ran into an unexpected issue. We've logged this error and are working to fix it.
              </p>
              
              {/* Dev-only error details */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-950 rounded-lg text-left overflow-auto max-h-32 text-xs font-mono text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                  {this.state.error.toString()}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button 
                  onClick={this.handleReload}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors font-medium"
                >
                  <RefreshCw size={18} />
                  <span>Reload Page</span>
                </button>
                <button 
                  onClick={this.handleGoHome}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
                >
                  <Home size={18} />
                  <span>Go Home</span>
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

export default ErrorBoundary;
