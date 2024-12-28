import Header from '@core/components/ui/header';
import React from 'react';

function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

export default layout;
