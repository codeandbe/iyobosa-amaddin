"use client";

import Image, { ImageProps } from 'next/image';
import React from 'react';
import { resolveImageUrl } from '@/lib/utils/image-url';

type Props = Omit<ImageProps, 'src'> & {
  src?: string | null;
  imageId?: string | null;
  bucket?: string;
  fallback?: string;
};

export const OptimizedImage: React.FC<Props> = ({ src, imageId, bucket, fallback = 'https://picsum.photos/seed/default/600/400', alt = '', ...rest }) => {
  const resolved = resolveImageUrl(src ?? null, imageId ?? null, bucket);
  const finalSrc = resolved ?? fallback;

  return <Image src={finalSrc} alt={alt as string} {...(rest as ImageProps)} />;
};

export default OptimizedImage;
