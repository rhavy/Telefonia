
import { Skeleton } from "@/components/ui/skeleton";
export function SkeletonPage() {
    return (
        <div className="flex flex-col gap-4 p-4 max-w-sm w-full">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        </div>
    );
}
export function LoadingPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-3">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Carregando sua sessão...</p>
        </div>
    );
}