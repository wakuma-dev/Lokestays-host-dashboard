import { type ReactNode,type  ErrorInfo, Component} from "react";
import { ErrorFallback } from "./ErrorFallback";
interface ErrorFallbackRenderProps {
   error: Error;
   reset: () => void;
}
interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: (props: ErrorFallbackRenderProps) => ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo ) => void;
}
interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState>{
  public constructor(props: ErrorBoundaryProps){
    super(props);
    this.state = {hasError: false , error: null}
  }
  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }
    public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
       console.error("Uncaught error:", error, errorInfo);
       this.props.onError?.(error, errorInfo);
    }
    private resetErrorBoundary = (): void => {
        this.setState({hasError: false, error: null});

    }
    public override render(): ReactNode {
        if(!this.state.hasError){
            return this.props.children;
        }
        const error = this.state.error;
        if(error === null){
            return(
                <main 
                 role="alert"
                 className="flex items-center justify-center min-h-screen">
                    <p className="font-normal text-base">Something went wrong.</p>
                </main>
            )
        }
        if(this.props.fallback){
            return this.props.fallback({
                error,
                reset: this.resetErrorBoundary
            });
        }
        return (
            <ErrorFallback 
              error={error}
              reset={this.resetErrorBoundary}
               />
        )
    }
}
