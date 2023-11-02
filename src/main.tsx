import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from "@/components/theme-provider";
import './main.css'
import { RouterProvider } from 'react-router-dom';
import { _router } from './app/_router.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={_router} />
    </ThemeProvider>
  </React.StrictMode>,
)
