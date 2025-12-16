
import * as React from "react";
import { cn } from "@/lib/utils";

export const Container = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("container px-4 mx-auto", className)}
        {...props}
      />
    );
  }
);

Container.displayName = "Container";