"use client";

import { useState } from "react";
import Image from "next/image";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  fallback?: React.ReactNode;
  fill?: boolean;
  width?: number;
  height?: number;
}

export default function SafeImage({
  src,
  alt,
  className = "",
  containerClassName = "",
  fallback,
  fill = false,
  width,
  height,
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <>{fallback}</>;
  }

  return (
    <div className={containerClassName}>
      <Image
        src={src}
        alt={alt}
        className={className}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
