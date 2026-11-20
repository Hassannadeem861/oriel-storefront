"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

/** next/image with a soft loading state and a graceful fallback if the file fails. */
export default function ProductImage({ src, alt, className, imgClassName, sizes, priority, fill = true }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-sand", !loaded && !failed && "animate-pulse", className)}>
      {failed || !src ? (
        <div className="absolute inset-0 grid place-items-center text-muted-foreground" role="img" aria-label={alt}>
          <ImageOff className="size-6" aria-hidden="true" />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          sizes={sizes}
          priority={priority}
          quality={75}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn("object-cover transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0", imgClassName)}
        />
      )}
    </div>
  );
}
