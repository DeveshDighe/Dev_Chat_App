import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { CssBaseline } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'
import { SocketProvider } from './utils/socket.jsx';


const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
      <SocketProvider>
        {/* <ReactQueryDevtools initialIsOpen={true} position='bottom-left'/> */}
        <HelmetProvider>
          <CssBaseline />
          <App />
        </HelmetProvider>
        </SocketProvider>
      </QueryClientProvider>
    </Provider>
  // </React.StrictMode>
)
