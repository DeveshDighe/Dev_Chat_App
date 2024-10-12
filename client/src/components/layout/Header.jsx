import { AppBar, Avatar, Box, Grow, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import React, { memo } from 'react';
import { gray } from '../../constants/color';
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';
import AlbumOutlinedIcon from '@mui/icons-material/AlbumOutlined';
import StreamOutlinedIcon from '@mui/icons-material/StreamOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import IconButtons from '../../lib/helper_components/IconButtons';
import IconButtonsComp from '../../lib/helper_components/IconButtons';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import { logOutUser } from '../../tanstack/user_logic';
import { useDispatch, useSelector } from 'react-redux';
import { removeUser } from '../../redux/reducers/auth';
import { setChatClicked, setCreateGroupClicked, setNewUserSearch, setNotification, setProfileClicked, setSearch } from '../../redux/reducers/random';

const Header = () => {

  const { user } = useSelector((state) => state.authReducer);
  const { profileClicked, chatClicked, search, newUserSearch, notification , createGroup} = useSelector((state) => state.randomReducer);


  const dispatch = useDispatch();

  // const {mutate} = logOutUser();

  const handleChatClick = () => {
    dispatch(setChatClicked(true));
    if (profileClicked) {
      dispatch(setProfileClicked(false));
    } 
    if (newUserSearch) {
      dispatch(setNewUserSearch(false));
    }
    if (createGroup) {
      dispatch(setCreateGroupClicked(false));
    }
  }
  const handleStoriesClick = () => {
    console.log('Stories has been clicked');
  }
  const handlePostsClick = () => {
    console.log('Posts has been clicked');
  }

  const handleProfileClick = () => {
    dispatch(setProfileClicked(true));

    if (chatClicked) {
      dispatch(setChatClicked(false));
    }

    if (newUserSearch) {
      dispatch(setNewUserSearch(false));
    }

    if (createGroup) {
      dispatch(setCreateGroupClicked(false));
    }
  };

  const handleAddUserClick = () => {
    if (newUserSearch) {
      dispatch(setNewUserSearch(false));
    }

    if (search) {
      dispatch(setSearch(false));
    }
    if (notification) {
      dispatch(setNotification(false));
    }
    if (profileClicked) {
      dispatch(setProfileClicked(false));
    }
    if (chatClicked) {
      dispatch(setChatClicked(false));
    }
    if (createGroup) {
      dispatch(setCreateGroupClicked(false));
    }

    dispatch(setNewUserSearch(true));

  }


  const handleCreateGroupClick = () => {
    dispatch(setProfileClicked(false));
    dispatch(setChatClicked(false));
    dispatch(setNewUserSearch(false));
    dispatch(setCreateGroupClicked(true))
  }

  return (
    <>
      <Box sx={{ flexGrow: 1, bgcolor: 'grey' }} height={'100%'} >
        <AppBar position="static" sx={{ bgcolor: gray, height: '100%' }}>
          <Toolbar sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', marginTop: '5px', height: '100%', marginBottom: '10px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', }}>

              <Tooltip
                title="Chats"
                placement="right"
                arrow
                aria-label="chats"
                TransitionComponent={Grow}
              >
                <IconButton onClick={() => handleChatClick()} sx={{ backgroundColor: chatClicked ? '#dddddd' : 'initial' }}>
                  <CommentRoundedIcon />
                </IconButton>
              </Tooltip>

              <Tooltip
                title="Add Friends"
                placement="right"
                arrow
                aria-label="add friends"
                TransitionComponent={Grow}
              >
                <IconButton onClick={() => handleAddUserClick()} sx={{ backgroundColor: newUserSearch ? '#dddddd' : 'initial' }}>
                  <GroupAddOutlinedIcon />
                </IconButton>
              </Tooltip>

              <Tooltip
                title="Create Group"
                placement="right"
                arrow
                aria-label="create group"
                TransitionComponent={Grow}
              >
                <IconButton onClick={() => handleCreateGroupClick()} sx={{ backgroundColor: createGroup ? '#dddddd' : 'initial' }}>
                  <Diversity3Icon />
                </IconButton>
              </Tooltip>

              {/* <IconButtonsComp onClick={handleStoriesClick} title='Stories' Iccon={AlbumOutlinedIcon} />
              <IconButtonsComp onClick={handlePostsClick} title='Posts' Iccon={StreamOutlinedIcon} /> */}

            </Box>

            <Box>
              <Tooltip
                title="Profile"
                placement="right"
                arrow
                aria-label="profile"
                TransitionComponent={Grow}
              >
                <IconButton onClick={() => handleProfileClick()} sx={{ backgroundColor: profileClicked ? '#dddddd' : 'initial' }}>
                  <Avatar sx={{
                    width: '1.6rem',
                    height: '1.6rem',
                    objectFit: 'contain',

                  }}
                    src={user?.avatar?.url}
                  />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default memo(Header);
