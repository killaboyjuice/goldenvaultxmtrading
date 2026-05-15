import { RouterProvider } from '@tanstack/react-router';
import { createRouter } from './router';
import ReactDOM from 'react-dom/client';
import React from 'react';

const router = createRouter();

const rootElement = document.getElementById('root');

if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
