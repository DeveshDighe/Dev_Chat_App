import { AppBar, Avatar, Box, Grow, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { gray } from '../../constants/color';
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';
import AlbumOutlinedIcon from '@mui/icons-material/AlbumOutlined';
import StreamOutlinedIcon from '@mui/icons-material/StreamOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import IconButtons from '../../lib/helper_components/IconButtons';
import IconButtonsComp from '../../lib/helper_components/IconButtons';
import { logOutUser } from '../../tanstack/user_logic';
import { useDispatch } from 'react-redux';

const Header = () => {

  const {mutate} = logOutUser();

  const handleChatClick = () => {
    console.log('Chat has been clicked');
  }
  const handleStoriesClick = () => {
    console.log('Stories has been clicked');
  }
  const handlePostsClick = () => {
    console.log('Posts has been clicked');
  }
  const handleSettingClick = () => {
    console.log('Settings has been clicked');
  }
  const handleProfileClick = () => {
    console.log('Profile has been clicked');
    mutate();

  }
  return (
    <>
      <Box sx={{ flexGrow: 1, bgcolor:'grey'}} height={'100%'} >
        <AppBar position="static" sx={{ bgcolor: gray, height: '100%' }}>
          <Toolbar sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', marginTop: '5px', height: '100%', marginBottom: '10px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', }}>

              <IconButtonsComp onClick={handleChatClick} title='Chats' Iccon={CommentRoundedIcon} />
              <IconButtonsComp onClick={handleStoriesClick} title='Stories' Iccon={AlbumOutlinedIcon} />
              <IconButtonsComp onClick={handlePostsClick} title='Posts' Iccon={StreamOutlinedIcon} />

            </Box>

            <Box>
              <IconButtonsComp onClick={()=>handleSettingClick()} title='Settings' Iccon={SettingsOutlinedIcon} />
              <Tooltip
                title="Profile"
                placement="right"
                arrow
                aria-label="profile"
                TransitionComponent={Grow}
              >
                <IconButton onClick={()=>handleProfileClick()}>
                  <Avatar sx={{
                    width: '1.4rem',
                    height: '1.4rem',
                    objectFit: 'contain'
                  }}
                    src={'https://media.istockphoto.com/id/1327592506/vector/default-avatar-photo-placeholder-icon-grey-profile-picture-business-man.jpg?s=612x612&w=0&k=20&c=BpR0FVaEa5F24GIw7K8nMWiiGmbb8qmhfkpXcp1dhQg='}
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

export default Header;
