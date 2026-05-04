'use client';

import React from 'react';
import PatisserieSelectedContext, {
  PatisserieSelectedContextValue,
} from './PatisserieSelectedContext';

function usePatisserieSelected(): PatisserieSelectedContextValue {
  const ctx = React.useContext(PatisserieSelectedContext);
  if (!ctx) {
    throw new Error(
      'usePatisserieSelected must be used within a PatisserieSelectedProvider'
    );
  }
  return ctx;
}

export default usePatisserieSelected;
