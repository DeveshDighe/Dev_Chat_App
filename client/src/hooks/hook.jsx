import { useEffect } from "react"



const useSocketEvents = (socket, handlers) => {
  console.log(handlers , 'handleres');
  
  useEffect(()=>{
    Object.entries(handlers).forEach(([event, handler])=>{
      socket.on(event , handler);
    });



    return () => {
      Object.entries(handlers).forEach(([event, handler])=>{
        socket.off(event , handler);
      });
    }
  },[socket, handlers])
}


export {useSocketEvents}