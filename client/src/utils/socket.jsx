import { useMemo } from 'react';
import { useContext } from 'react';
import { createContext } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {

  const socket = useMemo(() => 
    io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
    })
  ,[]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

export {SocketProvider, getSocket}