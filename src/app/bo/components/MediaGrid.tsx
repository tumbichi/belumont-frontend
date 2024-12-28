'use client';

import React from 'react';
import { InstagramMedia } from '@core/data/instagram/instagram.repository';
import MediaCard from './MediaCard';

interface MediaGridProps {
  data: InstagramMedia[];
}

function MediaGrid({ data }: MediaGridProps) {
  return (
    <div className="flex flex-col items-center py-6">
      <h1 className="text-3xl font-semibold">
        Mis ultimas publicaciones de Instagram
      </h1>
      <div className="flex flex-wrap content-stretch items-stretch gap-6 p-6 mx-auto max-w-6xl">
        {data.map((media) => (
          <div key={media.id} className="h-fit w-[350px] ">
            <MediaCard media={media} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MediaGrid;
