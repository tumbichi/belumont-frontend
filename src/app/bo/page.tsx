import React from 'react';
import { InstagramRepository } from '@core/data/instagram/instagram.repository';
import MediaGrid from './components/MediaGrid';

async function BackofficePage() {
  const igMedia = await InstagramRepository().getMeMedia();

  return <MediaGrid data={igMedia.data} />;
}

export default BackofficePage;
