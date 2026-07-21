"use client";

import dynamic from 'next/dynamic';

const ProductViewer = dynamic(() => import('@/components/ProductViewer'), { ssr: false });

export default function ViewerClient({ url, format }: { url: string; format: 'stl' | 'glb' }) {
  return <ProductViewer url={url} format={format} />;
}
