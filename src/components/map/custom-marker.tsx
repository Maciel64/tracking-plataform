"use client";

import { useState, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomMarkerProps {
  active?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
}

const CustomMarker = forwardRef<HTMLDivElement, CustomMarkerProps>(
  ({ active = false, className, size = "md", pulse = true }, ref) => {
    const [isHovered, setIsHovered] = useState(false);

    const sizes = {
      sm: "h-6 w-6",
      md: "h-8 w-8",
      lg: "h-10 w-10",
    };

    return (
      <div
        ref={ref}
        className={cn("relative flex items-center justify-center", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {pulse && (
          <motion.div
            className="absolute rounded-full bg-blue-200 opacity-40"
            initial={{ width: 0, height: 0 }}
            animate={{
              width: active || isHovered ? 40 : 30,
              height: active || isHovered ? 40 : 30,
            }}
            transition={{
              duration: 0.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        )}

        <motion.div
          className={cn(
            "flex items-center justify-center rounded-full bg-white shadow-md",
            sizes[size]
          )}
          initial={{ y: -5 }}
          animate={{
            y: active || isHovered ? -10 : -5,
            scale: active || isHovered ? 1.1 : 1,
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <MapPin
            className={cn(
              "text-blue-600",
              size === "sm" ? "h-4 w-4" : size === "md" ? "h-5 w-5" : "h-6 w-6"
            )}
            strokeWidth={active || isHovered ? 3 : 2}
          />
        </motion.div>

        <AnimatePresence>
          {(active || isHovered) && (
            <motion.div
              className="absolute -bottom-1 h-1 w-1 rounded-full bg-blue-600"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }
);

CustomMarker.displayName = "CustomMarker";

export { CustomMarker };
