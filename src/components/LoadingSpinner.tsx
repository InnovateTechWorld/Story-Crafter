
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  text?: string;
}

const LoadingSpinner = ({ className, text }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <LoaderCircle className={cn("animate-spin text-primary", className)} size={48} />
      {text && <p className="text-lg text-muted-foreground animate-pulse">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
