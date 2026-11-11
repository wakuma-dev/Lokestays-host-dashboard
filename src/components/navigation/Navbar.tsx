import ThemeToggle from "./ThemeToggle";

export default function Navbar(){
    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-6">
            <div>
                <p className="text-sm font-medium text-muted-foreground">Lokestays Host</p>
                <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
            <ThemeToggle />
        </header>
    );
}