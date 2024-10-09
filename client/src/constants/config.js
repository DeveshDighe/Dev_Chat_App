import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem('User-Token');

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
    "Authorization" : `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
})


api.interceptors.request.use((req) => {
  const jwt = localStorage.getItem('User-Token');

  req.headers.Authorization = jwt ? `Bearer ${jwt}` : null

  return req
})

export default api;