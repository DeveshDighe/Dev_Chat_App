import React, { memo, useState } from 'react';
import { Avatar, Box, Button, Container, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import { FaRegUser } from "react-icons/fa";
import { CameraAlt } from '@mui/icons-material';
import { VisuallyHiddenInput } from '../components/styles/StyledComponent';
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { MdOutlineEmail, MdOutlineDescription } from "react-icons/md";
import { useFormik } from 'formik';
import { loginSchema, RegisterSchema } from '../utils/yup';
import { registerFormik } from '../lib/formikLogic';
import { Navigate, useNavigate } from 'react-router-dom';
import { registerUser } from '../tanstack/user_logic';
import ClipLoader from 'react-spinners/ClipLoader';

const Register = ({user}) => {
  const [showPass, setShowPass] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [creatingUser, setCreatingUser] = useState(false);
  const [file, setFile] = useState(null);


  const navigate = useNavigate();

  const {mutate} = registerUser();

  if (user) {
    return <Navigate to={'/'} />
    
  }

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '20px',
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderWidth: '2px',
        borderColor: 'RGB(81 81 81)',
      },
      '& input': {
        padding: '11px 40px 11px 11px',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'RGB(81 81 81)',
      fontSize: '15px',
      marginBottom: '10px',
      top: '-12%',
      '&.Mui-focused': {
        color: 'RGB(81 81 81)',
      },
    },
    '& .MuiOutlinedInput-input': {
      fontSize: '16px',
    },
  };


  const { errors, values, handleSubmit, handleChange, touched, setFieldValue } = useFormik({
    initialValues : {name : '', email : '',username : '', bio : '', password : '', avatar : ''},
    // validationSchema : RegisterSchema,
    onSubmit : (value, action) => {
      setCreatingUser(true);
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('name', value.name);
      formData.append('bio', value.bio);
      formData.append('username', value.username);
      formData.append('password', value.password);

      mutate(formData);
      
    }
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFieldValue('avatar', imageUrl);
      setFile(file);
    }
  };



  const toggleLogin = () => setIsLogin(toggle => !toggle);

  return (
    <Container component={'main'} maxWidth='false' sx={{
      height: '100vh',
      paddingTop: '110px',
      width: '100%',
      background: 'linear-gradient(51deg, rgba(137,117,240,0.8127626050420168) 0%, rgba(124,208,249,0.8295693277310925) 100%)',
    }}>
      <Paper
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: 'rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px, rgba(17, 17, 26, 0.1) 0px 24px 80px;',
          maxWidth: '450px',
          margin: 'auto',
          borderRadius: '20px',
        }}
      >
        <>
          <Typography sx={{ fontSize: '32px' }}>Register</Typography>
          <form style={{ width: '100%' }} onSubmit={handleSubmit}>
            <Stack position={'relative'} width={'10rem'} margin={'auto'} marginY={'20px'}>
              <Avatar sx={{
                width: '10rem',
                height: '10rem',
                objectFit: 'contain'
              }}
                src={values.avatar}
              />
              <IconButton component='label' sx={{
                position: "absolute",
                bottom: "0",
                right: "0",
                color: "white",
                bgcolor: "rgba(0,0,0,0.5)",
                ":hover": {
                  bgcolor: "rgba(0,0,0,0.7)",
                },
              }}>
                <>
                  <CameraAlt />
                  <VisuallyHiddenInput type='file' name='avatar' accept='image/*' onChange={handleFileChange} />
                </>
              </IconButton>
            </Stack>

            <Box display="flex" flexDirection="column" width="100%" position="relative">
              <TextField
                fullWidth
                label="Name"
                margin="normal"
                variant="outlined"
                name='name'
                value={values.name}
                onChange={handleChange}
                sx={inputStyle}
              />
              <Box sx={{ position: 'absolute', top: '29px', right: '15px', opacity: 0.6, zIndex: 10, marginLeft: '20px', cursor: 'pointer' }}>
                <FaRegUser size={17} />
              </Box>
            </Box>
            {touched.name && errors.name && (<p className='feildWarnings'>{errors.name}</p>)}
            <Box display="flex" flexDirection="column" width="100%" position="relative">
              <TextField
                fullWidth
                label="User-Name"
                margin="normal"
                variant="outlined"
                name='username'
                value={values.username}
                onChange={handleChange}
                sx={inputStyle}
              />
              <Box sx={{ position: 'absolute', top: '29px', right: '15px', opacity: 0.6, zIndex: 10, marginLeft: '20px', cursor: 'pointer' }}>
                <FaRegUser size={17} />
              </Box>
            </Box>
            {touched.name && errors.name && (<p className='feildWarnings'>{errors.name}</p>)}

            <Box display="flex" flexDirection="column" width="100%" position="relative">
              <TextField
                fullWidth
                label="Email"
                margin="normal"
                variant="outlined"
                name='email'
                value={values.email}
                onChange={handleChange}
                sx={inputStyle}
              />
              <Box sx={{ position: 'absolute', top: '29px', right: '15px', opacity: 0.6, zIndex: 10, marginLeft: '20px', cursor: 'pointer' }}>
                <MdOutlineEmail size={17} />
              </Box>
            </Box>
            {touched.email && errors.email && (<p className='feildWarnings'>{errors.email}</p>)}

            <Box display="flex" flexDirection="column" width="100%" position="relative">
              <TextField
                fullWidth
                label="Bio"
                name='bio'
                value={values.bio}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                sx={inputStyle}
              />
              <Box sx={{ position: 'absolute', top: '29px', right: '15px', opacity: 0.6, zIndex: 10, marginLeft: '20px', cursor: 'pointer' }}>
                <MdOutlineDescription size={17} />
              </Box>
            </Box>
            {touched.bio && errors.bio && (<p className='feildWarnings'>{errors.bio}</p>)}

            <Box display="flex" flexDirection="column" width="100%" position="relative">
              <TextField
                fullWidth
                type={showPass ? 'text' : 'password'}
                label="Password"
                name='password'
                value={values.password}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                sx={inputStyle}
              />
              <Box sx={{ position: 'absolute', top: '29px', right: '15px', opacity: 0.6, zIndex: 10, marginLeft: '20px', cursor: 'pointer' }}>
                {showPass ?
                  <IoMdEyeOff onClick={() => setShowPass(toggle => !toggle)} size={17} />
                  :
                  <FaEye onClick={() => setShowPass(toggle => !toggle)} size={17} />
                }
              </Box>
            </Box>
            {touched.password && errors.password && (<p className='feildWarnings'>{errors.password}</p>)}

            <Container sx={{ display: 'flex', justifyContent: 'center', padding: '20px 0px' }}>
              <Button variant='contained' type='submit' sx={{ background: '#8975f0', ':hover': { background: '#8F3EFF', } }}>
                Register
              </Button>
            </Container>

            <Typography sx={{ textAlign: 'center' }}>
              Already have an account ?
              <Button
                variant='text'
                onClick={() => navigate('/login')}
                sx={{ textTransform: 'none', paddingBottom: '10px' }}
              >
                Login
              </Button>
            </Typography>
          </form>
        </>
      </Paper>
          {creatingUser &&
            <div className='absolute left-[45%] top-10 z-30 text-center self-center flex items-center gap-x-2 py-2 px-3 bg-white px-3 rounded-md'>
              <ClipLoader
                color="#00b2ff"
                size={20}
                speedMultiplier={2}
              />
              <p className=' text-[16px]'>User creating...</p>
            </div>}
    </Container>
  )
}

export default memo(Register);
