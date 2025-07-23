import React from 'react';
import { InstagramRepository } from '@core/data/instagram/instagram.repository';
import MediaCard from './components/MediaCard';

async function BackofficePage() {
  const igMedia = await InstagramRepository().getMeMedia();

  if (!igMedia) {
    return {
      notFound: true,
    };
  }

  return (
    <div className="flex flex-col items-center py-6">
      <h1 className="text-3xl font-semibold">
        Mis ultimas publicaciones de Instagram
      </h1>
      {igMedia && (
        <div className="flex flex-wrap content-stretch items-stretch gap-6 p-6 mx-auto max-w-6xl">
          {igMedia.data.map((media) => (
            <div key={media.id} className="h-fit w-[350px] ">
              <MediaCard media={media} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BackofficePage;
