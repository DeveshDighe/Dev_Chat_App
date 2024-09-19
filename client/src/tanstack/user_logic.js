import axios from "axios"
import baseURL, { api } from "../constants/config"
import { useMutation, useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { addUser, removeUser } from "../redux/reducers/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const getUserFunc = async() => {
  try {
    const response = await api.get(`/user/get-user`);
    console.log(response , 'This is response from get User data');
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
  console.log('uiuiuiu', userData);
  
  try {
    const response = await api.post('/user', userData)
    console.log(response , 'This is response from the login func');
    return response.data
  } catch (error) {
    throw error;
  }
}

export const loginUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: handleLoginFunc, // `handleLoginFunc` expects `userData` as an argument
    onSuccess: (data) => {
      console.log('Login successful:', data);

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
  console.log(formdata , 'laalalal54545454');

  for (let [key, value] of formdata.entries()) {
    console.log(key, value);
  }
  
  try {
    const response = await api.post('user/create', formdata,{
      headers: {
        'Content-Type': 'multipart/form-data',
      }});
    console.log(response , 'This is response of register function');
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
      console.log('success register', data);
      toast.success(data.message);
      navigate('/login');
    },
    onError : (error) => {
      console.log(error , 'This is error of register');
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
      console.log(data, 'User logout data');
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
  console.log(searchData , 'This is search Data');
  
  return useQuery({
    queryKey : ['search-chats'],
    queryFn : () => getSearchDataFunc(),
    staleTime: 200000,
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    onSuccess : (data) => {
      console.log(data, 'This is data');
      
    },
    onError : (err) => {
      
    }
  })
}