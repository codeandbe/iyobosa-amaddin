import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("font-headline font-bold text-2xl tracking-wider", className)}>
      Code<span className="text-primary">AndBe</span>
    </div>
  );
};

export default Logo;
