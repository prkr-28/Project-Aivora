
import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
const Card = React.forwardRef(
  ({ className, animated = true, tilt = false, children, ...props }, ref) => {
    const [mousePosition, setMousePosition] = React.useState({
      x: 0,
      y: 0,
    });
    const cardRef = React.useRef(null);
    const handleMouseMove = (e) => {
      if (!tilt || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({
        x,
        y,
      });
    };
    const handleMouseLeave = () => {
      setMousePosition({
        x: 0.5,
        y: 0.5,
      });
    };
    const tiltX = tilt ? (mousePosition.y - 0.5) * 10 : 0;
    const tiltY = tilt ? -(mousePosition.x - 0.5) * 10 : 0;

    // Filter out props that conflict with framer-motion
    const { onDrag, onDragStart, onDragEnd, ...filteredProps } = props;
    if (animated) {
      return (
        <motion.div
          ref={(node) => {
            // @ts-ignore
            cardRef.current = node;
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{
            y: -5,
            transition: {
              duration: 0.2,
            },
          }}
          style={{
            transform: tilt
              ? `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
              : undefined,
            transition: "transform 0.1s ease-out",
          }}
          className={cn(
            "rounded-2xl border bg-card text-card-foreground shadow-lg hover:shadow-xl transition-all",
            className,
          )}
          {...filteredProps}
        >
          {children}
        </motion.div>
      );
    }
    return (
      <div
        className={cn(
          "rounded-2xl border bg-card text-card-foreground shadow",
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
