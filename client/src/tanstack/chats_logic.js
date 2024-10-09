import { useMutation, useQuery, useQueryClient } from "react-query"
import api from "../constants/config"
import { useDispatch, useSelector } from "react-redux";
import { addChatDetail, addChatsList, addMessageCountAndAleartFromLocal } from "../redux/reducers/chats";
import toast from "react-hot-toast";
import { setAllMessages, setHasMoreData, setNotificationsList } from "../redux/reducers/usefull";
import { setChatClicked, setCreateGroupClicked, setUploadingLoader } from "../redux/reducers/random";
import { useNavigate } from "react-router-dom";



const getChatsListFunc = async (data, filter) => {
console.log('getChatsListFunc');

  try {
    const response = await api.get(`/chat/get-my-chat?search=${data}&filter=${filter}`);
    return response.data;
  } catch (error) {

  }
}



export const getChatsList = (data, filter) => {

  const dispatch = useDispatch();
  return useQuery({
    queryKey: ['Chats-list'],
    queryFn: () => getChatsListFunc(data, filter),
    staleTime: 200000,
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      console.log('getChatsList', data);
      dispatch(addChatsList(data.chats));
      dispatch(addMessageCountAndAleartFromLocal());
    },
    onError: (err) => {

    }
  })
}


const sendRequestFunc = async (userID) => {
  console.log('sendRequestFunc');

  const data = { userID };
  try {
    const response = await api.put('/user/send-request', data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const sendFriendRequest = () => {

  return useMutation({
    mutationFn: sendRequestFunc,
    onSuccess: (data) => {
  console.log('sendFriendRequest', data);

      toast.success(data.message);
    },
    onError: (err) => {
      toast.error(err.response.data.message);
    }
  })
}


const getNotificationFunc = async () => {
  console.log('getNotificationFunc');
  try {
    const response = await api.get('/user/get-all-requests');
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
      console.log('getNotification', data);
      
      dispatch(setNotificationsList(data.data));
    },
    onError: (err) => {
      console.log(err, "This is error of notification fetching");

    }
  })
}


const acceptRequestFunc = async (data) => {
  console.log('acceptRequestFunc');
  
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
      toast.success(data.message);
      queryClient.invalidateQueries(['notification']);
      queryClient.invalidateQueries(['Chats-list']);
      console.log('acceptFriendRequest', data);
      
      //use socket
    },
    onError: (error) => {
      console.log(error, 'This is error');
      // toast.error(err.response.data.message);
    }
  })
}

const fetchChatDetailFunc = async (chatID, populate) => {
  console.log('fetchChatDetailFunc func');
  try {
    const response = await api.get(`/chat/${chatID}?populate=${populate}`);
    return response.data
  } catch (error) {
    throw error;
  }
}

export const getChatDetail = (chatID, populate = false) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer);

  return useQuery({
    queryKey: ['Chat-details', chatID],
    queryFn: () => fetchChatDetailFunc(chatID, populate),
    retry: 1,
    refetchOnWindowFocus: false,
    // staleTime : 30000,
    // enabled : false,
    onSuccess: (data) => {
      console.log(data.data, 'This is chatDetail data');
      if (!data.data.groupChat) {
        const chattingWith = data.data?.members?.filter((member) => member._id !== user._id);
        dispatch(addChatDetail(chattingWith));
      } else {
        dispatch(addChatDetail(data.data));
      }
    },
    onError: (err) => {
      console.log(err, 'error ');

    }
  })
}


const fetchChatDetailEditFunc = async (chatID, populate) => {
  console.log('getChatDetailEdit func called');
  try {
    const response = await api.get(`/chat/edit/${chatID}?populate=${populate}`);
    return response.data
  } catch (error) {
    throw error;
  }
}


export const getChatDetailEdit = (chatID, populate = false) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer);

  return useQuery({
    queryKey: ['Chat-details-Edit'],
    queryFn: () => fetchChatDetailEditFunc(chatID, populate),
    retry: 1,
    refetchOnWindowFocus: false,
    // staleTime : 30000,
    // enabled : false,
    onSuccess: (data) => {
      console.log(data.data, 'This is chatDetail data');
      if (!data.data.groupChat) {
        const chattingWith = data.data?.members?.filter((member) => member._id !== user._id);
        dispatch(addChatDetail(chattingWith));
      } else {
        dispatch(addChatDetail(data.data));
      }
    },
    onError: (err) => {
      console.log(err, 'error ');

    }
  })
}


export const getAllMessagesFunc = async (chatID, page) => {
  console.log('getAllMessagesFunc func');
  try {
    const response = await api.get(`chat/message/${chatID}?page=${page}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}


export const getMessages = (chatID, page) => {

  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['all-messages', page],
    queryFn: () => getAllMessagesFunc(chatID, page),
    staleTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      dispatch(setAllMessages(data.messages));
      dispatch(setHasMoreData(data.hasMore));
      console.log('getMessages data', data);
    },
    onError: (err) => {
      console.log(err, 'error ');

    }
  })
}

const sendAttachmentFunc = async (file) => {
  // const data = {chatID , content}
  console.log('sendAttachment func');
  
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
      dispatch(setUploadingLoader(false));
      console.log('sendAttachment data', data);
      
    },
    onError: (err) => {
      console.log('This is err of sendAttachment');

    }
  })
}

const removeMemberFunc = async (data) => {
  try {
    const response = await api.put('chat/remove-member', data);
    console.log(response , 'This is response removeMemberFunc');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const removeMemberMutate = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeMemberFunc,
    onSuccess: (data, variables) => {
      console.log('removeMember', data);
      console.log('variables', variables);
      queryClient.invalidateQueries(['Chat-details-Edit'])
      queryClient.invalidateQueries(['Group-non-members', variables.chatID])
      toast.success(data.message)
    },
    onError: (err) => {
      toast.error(err.response.data.error)
      console.log('This is err of removeMember', err);

    }
  })
}
const addMemberFunc = async (data) => {
  console.log(data , 'drete');
  
  try {
    const response = await api.put('chat/add-members' , data);
    console.log(response , 'This is response addMemberFunc');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const addMemberMutate = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addMemberFunc,
    onSuccess: (data, variables) => {
      console.log('addMember', data);
      console.log('variables', variables);
      queryClient.invalidateQueries(['Chat-details-Edit'])
      queryClient.invalidateQueries(['Group-non-members', variables.chatID])
      toast.success(data.message)
    },
    onError: (err) => {
      toast.error(err.response.data.error)
      console.log('This is err of addMember', err);

    }
  })
}



const leaveGroupFunc = async (groupID) => {
  try {
    const response = await api.delete(`chat/leave-group/${groupID}`);
    console.log(response , 'This is response leaveGroupFunc');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const leaveGroup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: leaveGroupFunc,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['Chats-list']);
      navigate('/')
      // queryClient.invalidateQueries(['Group-non-members', variables.chatID])
      toast.success(data.message)
    },
    onError: (err) => {
      toast.error(err.response.data.error)
      console.log('This is err of removeMember', err);

    }
  })
}
const createGroupFunc = async (formData) => {
  try {
    const response = await api.post(`chat/new-group`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }}
    );
    console.log(response , 'This is response createGroupFunc');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const createGroup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGroupFunc,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['Chats-list']);
      navigate('/')
      // queryClient.invalidateQueries(['Group-non-members', variables.chatID])
      toast.success(data.message);
      dispatch(setCreateGroupClicked(false))
      dispatch(setChatClicked(true))
    },
    onError: (err) => {
      toast.error(err.response.data.error)
      console.log('This is err of createGroup', err);

    }
  })
}
const makeAdminFunc = async (groupIDandUserID) => {
  const {groupID, userID} = groupIDandUserID;
  console.log(groupID, userID, 'groupID, userID');
  try {
    const response = await api.post(`chat/make-admin?groupID=${groupID}&userID=${userID}`);
    console.log(response , 'This is response makeAdminFunc');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const makeAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: makeAdminFunc,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['Chat-details-Edit']);
      // queryClient.invalidateQueries(['Group-non-members', variables.chatID])
      toast.success(data.message);
    },
    onError: (err) => {
      toast.error(err.response.data.error)
      console.log('This is err of makeAdmin', err);

    }
  })
}
const removeAdminFunc = async (groupIDandUserID) => {
  const {groupID, userID} = groupIDandUserID;
  console.log(groupID, userID, 'groupID, userID');
  try {
    const response = await api.post(`chat/remove-admin?groupID=${groupID}&userID=${userID}`);
    console.log(response , 'This is response removeAdminFunc');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const removeAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeAdminFunc,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['Chat-details-Edit']);
      // queryClient.invalidateQueries(['Group-non-members', variables.chatID])
      toast.success(data.message);
    },
    onError: (err) => {
      toast.error(err.response.data.error)
      console.log('This is err of removeAdmin', err);

    }
  })
}