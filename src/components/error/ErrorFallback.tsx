interface ErrorFallbackProps {
    error: unknown;
    reset: () => void;
}
function getErrorMessage(error: unknown): string {
    if(error instanceof Error) return error.message;
    if(typeof error === "string") return error;
    return "An unknown error occurred";
}
export function ErrorFallback({error, reset}: ErrorFallbackProps){
    const showDetails = import.meta.env.VITE_SHOW_ERROR_DETAIL === "true";
    const message = showDetails ? getErrorMessage(error) : "We couldn't load the page. Please try again later"
   return(
    <main 
     role="alert"
     className="flex flex-col items-start justify-start
      min-h-screen p-6 text-center gap-4">
        <p className="text-muted-foreground font-normal tracking-normal">{message}</p>
        <button 
          type="button"
          onClick={reset}
          className="rounded-md px-4 py-2 border transition-colors hover:bg-accent">
            Try again
          </button>
      </main>
   )
}