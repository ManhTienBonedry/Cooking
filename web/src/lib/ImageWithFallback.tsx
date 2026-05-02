import React, { useEffect, useState } from 'react';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallback?: string;
};

export default function ImageWithFallback({ src, alt, fallback = '/assets/images/vietnam1.jpg', ...rest }: Props) {
  const [current, setCurrent] = useState<string>(src ? String(src) : fallback);

  useEffect(() => {
    setCurrent(src ? String(src) : fallback);
  }, [src, fallback]);

  return (
    <img
      src={current}
      alt={alt}
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
      {...rest}
    />
  );
}
