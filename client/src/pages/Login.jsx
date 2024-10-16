
import React, { memo, useState } from 'react';
import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import { FaRegUser } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { loginFormik } from '../lib/formikLogic';
import { Navigate, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { loginSchema } from '../utils/yup';
import { loginUser } from '../tanstack/user_logic';


const Login = ({ user, token }) => {
  const [showPass, setShowPass] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const navigate = useNavigate()

  const { errors, values, handleSubmit, handleChange, touched } = useFormik({
    initialValues: { name: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: (value, action) => {
      mutate(value);
      // action.resetForm();
    }
  });


  const { mutate } = loginUser();


  if (token) {
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
          paddingY: 4, // Set consistent vertical padding (or adjust if needed)
          paddingX: { xs: 1, md: 4 }, // Less paddingX (1) on extra-small screens, more (4) on small and larger
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
          <Typography variant='h4'>Login</Typography>
          <form style={{ width: '90%', marginTop: '20px' }} onSubmit={handleSubmit} >
            <Box display="flex" flexDirection="column" width="100%" position="relative">
              <TextField
                fullWidth
                label="Username"
                margin="normal"
                variant="outlined"
                name='name'
                value={values.name}
                onChange={handleChange}
                sx={inputStyle}
                autoComplete="off"
              />
              <Box sx={{ position: 'absolute', top: '29px', right: '15px', opacity: 0.6, zIndex: 10, marginLeft: '20px', cursor: 'pointer' }}>
                <FaRegUser size={17} />
              </Box>
            </Box>
            {touched.name && errors.name && <p className='feildWarnings'>{errors.name}</p>}
            <Box display="flex" flexDirection="column" width="100%" position="relative">
              <TextField
                fullWidth
                type={showPass ? 'text' : 'password'}
                label="Password"
                name="password"
                margin="normal"
                variant="outlined"
                value={values.password}
                onChange={handleChange}
                sx={inputStyle}
                autoComplete="password"
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
              <Button variant='contained' color='primary' type='submit' sx={{ background: '#8975f0', ':hover': { background: '#8F3EFF', } }}>
                Login
              </Button>
            </Container>

            <Typography sx={{ textAlign: 'center' }}>
              Create an account ?
              <Button
                variant='text'
                onClick={() => navigate('/register')}
                sx={{ textTransform: 'none', paddingBottom: '10px' }}
              >
                Register
              </Button>
            </Typography>
          </form>
        </>

      </Paper>
    </Container>
  )
}

export default memo(Login);

