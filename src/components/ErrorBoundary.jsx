import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center p-6 text-slate-900">
          <div className="paper-card-elevated max-w-md w-full p-6 rounded-3xl text-center space-y-4 bg-white">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-[20px] font-semibold text-slate-900">Something paused this view</h2>
            <p className="text-[14px] text-slate-500 font-normal">
              {this.state.error?.message || "An unexpected error occurred while rendering this stall type."}
            </p>
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 min-h-[48px] rounded-xl bg-[#062E38] hover:bg-[#0A3B46] text-white font-semibold text-[16px] flex items-center justify-center gap-2 mx-auto shadow transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
