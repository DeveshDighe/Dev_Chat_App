import axios from "axios"
import baseURL, { api } from "../constants/config"
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { addUser, removeUser } from "../redux/reducers/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getSocket } from "../utils/socket";


const getUserFunc = async() => {
  try {
    const response = await api.get(`/user/get-user`);
      return response.data
  } catch (error) {
    throw error;
  }
}

export const getUserData = async () => {
  
  const dispatch = useDispatch();
  return useQuery({
    queryKey : ['user-data'],
    queryFn : () => getUserFunc(),
    staleTime: 200000,
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    onSuccess : (data) => {
      dispatch(addUser(data.user));
    },
    onError : (err) => {
      dispatch(removeUser());
    }
  }) 
}


const handleLoginFunc = async (userData) => {
  try {
    const response = await api.post('/user', userData)
    return response.data
  } catch (error) {
    throw error;
  }
}

export const loginUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: handleLoginFunc, // `handleLoginFunc` expects `userData` as an argument
    onSuccess: (data) => {
      queryClient.invalidateQueries(['user-data']);
      
      localStorage.setItem('User-Token', data.token);
      dispatch(addUser(data.user));
      toast.success(data.message);
      navigate('/');
    },
    onError: (error) => {
      console.error('Login failed:', error);
      alert(error.response.data.message);
    }
  });
}


const handleRegisterFunc =async (formdata) => {
  // for (let [key, value] of formdata.entries()) {
  //   console.log(key, value);
  // }
  
  try {
    const response = await api.post('user/create', formdata,{
      headers: {
        'Content-Type': 'multipart/form-data',
      }});
    return response.data;
  } catch (error) {
    throw error
  }
}


export const registerUser = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn : handleRegisterFunc,
    onSuccess : (data) => {
      toast.success(data.message);
      navigate('/login');
    },
    onError : (error) => {
      toast.error(error.response.data.message);
    }
  })
}

const handleLogout = async () => {
  try {
    const response = await api.get('user/logout')
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const logOutUser = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn : handleLogout,
    onSuccess : (data) => {
      dispatch(removeUser());
      toast.success(data.message);
    },
    onError : (err) => {
      toast.error(err.response.data.message);
    }
  })
}


const getSearchDataFunc = async () => {
  try {
    const response = await api('user/search-users');
    return response.data;
  } catch (error) {
    
  }
}

export const getSerchData = (searchData) => {
  
  return useQuery({
    queryKey : ['search-chats'],
    queryFn : () => getSearchDataFunc(),
    staleTime: 200000,
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    onSuccess : (data) => { 
    },
    onError : (err) => {
      
    }
  })
}



const getAllUsersFunc = async (name) => {
  try {
    const response = await api.get(`user/all-users?name=${name}`);
    return response.data;
  } catch (error) {
    
  }
}

export const getAllUsers = () => {
  return useMutation({
    mutationFn : getAllUsersFunc,
    onSuccess : (data) => {

    },
    onError : (err) => {
      
    },
  })
}