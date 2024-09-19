import { useMutation, useQuery, useQueryClient } from "react-query"
import api from "../constants/config"
import { useDispatch } from "react-redux";
import { addChatDetail, addChatsList, addMessageCountAndAleartFromLocal } from "../redux/reducers/chats";
import toast from "react-hot-toast";
import { setAllMessages, setHasMoreData, setNotificationsList } from "../redux/reducers/usefull";
import { setUploadingLoader } from "../redux/reducers/random";



const getChatsListFunc = async (data, filter) => {
  console.log('get chat list called with', data, filter);
  
  try {
    const response = await api.get(`/chat/get-my-chat?search=${data}&filter=${filter}`);
    // console.log(response , 'This is response of getChat');
    return response.data;
  } catch (error) {

  }
}



export const getChatsList = (data, filter) => {
  console.log(data, 'data data daata data');


  const dispatch = useDispatch();
  return useQuery({
    queryKey: ['Chats-list'],
    queryFn: () => getChatsListFunc(data, filter),
    staleTime: 200000,
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      dispatch(addChatsList(data.chats));
      dispatch(addMessageCountAndAleartFromLocal());
    },
    onError: (err) => {

    }
  })
}


const sendRequestFunc = async (userID) => {
  const data = { userID };
  try {
    const response = await api.put('/user/send-request', data);
    return response.data;
  } catch (error) {
    console.log(error, 'aata');
    throw error;
  }
}

export const sendFriendRequest = () => {
  return useMutation({
    mutationFn: sendRequestFunc,
    onSuccess: (data) => {
      // console.log(data, 'success');
      toast.success(data.message);
    },
    onError: (err) => {
      console.log(err, 'error');
      toast.error(err.response.data.message);
    }
  })
}


const getNotificationFunc = async () => {
  try {
    const response = await api.get('/user/get-all-requests');
    // console.log(response , "this is response");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getNotification = () => {

  const dispatch = useDispatch();
  return useQuery({
    queryKey: ['notification'],
    queryFn: () => getNotificationFunc(),
    staleTime: 200000,
    retry: 1,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      console.log('Success of fetched notification : ', data);
      dispatch(setNotificationsList(data.data));
    },
    onError: (err) => {
      console.log(err, "This is error of notification fetching");

    }
  })
}


const acceptRequestFunc = async (data) => {
  try {
    const response = await api.put('/user/accept-request', data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const acceptFriendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptRequestFunc,
    onSuccess: (data) => {
      // console.log(data, 'This is data');
      toast.success(data.message);
      queryClient.invalidateQueries(['notification']);
      queryClient.invalidateQueries(['Chats-list']);

      //use socket
    },
    onError: (error) => {
      console.log(error, 'This is error');
      // toast.error(err.response.data.message);
    }
  })
}

const fetchChatDetailFunc = async (chatID, populate) => {
  try {
    const response = await api.get(`/chat/${chatID}?populate=${populate}`);
    return response.data
  } catch (error) {
    throw error;
  }
}

export const getChatDetail = (chatID, populate = false) => {
  const dispatch = useDispatch();
  return useQuery({
    queryKey: ['Chat-details'],
    queryFn: () => fetchChatDetailFunc(chatID, populate),
    retry: 1,
    refetchOnWindowFocus: false,
    // staleTime : 30000,
    // enabled : false,
    onSuccess: (data) => {
      console.log(data, 'data of chat detailllllllllllpopopopoop');
      dispatch(addChatDetail(data.data));
    },
    onError: (err) => {
      console.log(err, 'error ');

    }
  })
}


export const getAllMessagesFunc = async (chatID, page) => {
  console.log('getAllMessages is calld');

  try {
    const response = await api.get(`chat/message/${chatID}?page=${page}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}


export const getMessages = (chatID, page) => {
  console.log('called and page is ', page);

  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['all-messages', page],
    queryFn: () => getAllMessagesFunc(chatID, page),
    staleTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      console.log(data, 'data of all messages', data.hasMore);
      dispatch(setAllMessages(data.messages));
      dispatch(setHasMoreData(data.hasMore));
    },
    onError: (err) => {
      console.log(err, 'error ');

    }
  })
}

const sendAttachmentFunc = async (file) => {
  // const data = {chatID , content}
  console.log(file, "tthis ieieieieiei");

  try {
    const response = await api.post('chat/message', file,
      {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure the content type is set for FormData
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const sendAttachment = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: sendAttachmentFunc,
    onSuccess: (data) => {
      console.log(data, 'This is data after sending attachment');
      dispatch(setUploadingLoader(false));

    },
    onError: (err) => {
      console.log('This is err of sendAttachment');

    }
  })
}