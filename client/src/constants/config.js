import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_URL;


// export const api = axios.create({
//   baseURL : baseURL,
//   headers : {
//     "Authorization" : 
//   }
// })

export const api = axios.create({
  baseURL : baseURL,
  withCredentials : true,
  headers : {
    'Content-Type': 'application/json',
  }
})


export default api;