import { type ImgHTMLAttributes, type CSSProperties } from "react";

interface ImgProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "width" | "height"> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
  style?: CSSProperties;
}

export function Img({
  src,
  alt,
  width,
  height,
  fill,
  priority,
  sizes,
  className,
  style,
  loading,
  decoding,
  ...rest
}: ImgProps) {
  if (fill) {
    const fillStyle: CSSProperties = {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      ...style,
    };
    return (
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        loading={priority ? (loading ?? "eager") : (loading ?? "lazy")}
        decoding={decoding ?? "async"}
        fetchPriority={priority ? "high" : undefined}
        className={className}
        style={fillStyle}
        {...rest}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      loading={priority ? (loading ?? "eager") : (loading ?? "lazy")}
      decoding={decoding ?? "async"}
      fetchPriority={priority ? "high" : undefined}
      className={className}
      style={style}
      {...rest}
    />
  );
}
