import { useMemo, useContext, useEffect } from 'react';
import { createContext } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

const SocketContext = createContext();

// Hook to get socket-related functions
const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {

  const { user } = useSelector((state) => state.authReducer);

  // Initialize the socket connection with memoization
  const socket = useMemo(() => {
    
    return io(import.meta.env.VITE_SOCKET_URL, {
      query: {
        userToken: localStorage.getItem('User-Token'),
      },
      withCredentials: true,
      autoConnect: false, // Disable auto-connect
    })
  }
  ,[user]);

  // Function to connect the socket
  const connectSocket = () => {
    if (!socket.connected) {  
      socket.connect();
      // socket.emit(USER_OFFLINE, user);
      console.log('Socket connected');
    }
  };

  useEffect(() => {
    if (user) {
      connectSocket();
    }
  }, [user])
  
  // Function to disconnect the socket
  const disconnectSocket = () => {
    if (socket.connected) {
      socket.disconnect();
      console.log('Socket disconnected');
    }
  };

  return (
    <SocketContext.Provider value={{ socket, disconnectSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, getSocket };
