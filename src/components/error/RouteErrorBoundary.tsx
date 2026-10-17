import { useRouter } from "@tanstack/react-router"
import { ErrorFallback } from "./ErrorFallback"
interface RouteErrorBoundaryProps {
    error: unknown;
    reset: () => void;
}
export function RouteErrorBoundary({error, reset} : RouteErrorBoundaryProps){
 const router = useRouter();
 const handleReset = () => {
    reset();
    void router.invalidate();
 }
 return (
 <ErrorFallback error={error} reset={handleReset} />
 );
}