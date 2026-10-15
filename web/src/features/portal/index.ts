import { lazy } from 'react';
export const PublicHomePage = lazy(() =>
  import('./pages/PublicHomePage').then((module) => ({ default: module.PublicHomePage })),
);
