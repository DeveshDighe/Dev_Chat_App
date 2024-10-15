import * as yup from 'yup';

export const RegisterSchema = yup.object({
  name: yup
    .string()
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .min(2)
    .max(20)
    .required('Please enter your name'),
  
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password cannot be more than 50 characters')
    .matches(/\d/, 'Password must have at least one number')
    .matches(/[@$!%*?&#]/, 'Password must have at least one special character (@$!%*?&#)')
    .required('Please enter your password'),

    bio : yup
    .string()
    .min(6)
    .max(100)
    .required('Please enter your bio'),

    email : yup
    .string()
    .email()
    .required('Please enter your email')


});


export const loginSchema = yup.object({
  name: yup
    .string()
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .min(2)
    .max(20)
    .required('Please enter your name'),
  
  // password: yup
  //   .string()
  //   .min(8, 'Password must be at least 8 characters')
  //   .max(20, 'Password cannot be more than 50 characters')
  //   .matches(/[A-Z]/, 'Password must have at least one uppercase letter')
  //   .matches(/[a-z]/, 'Password must have at least one lowercase letter')
  //   .matches(/\d/, 'Password must have at least one number')
  //   .matches(/[@$!%*?&#]/, 'Password must have at least one special character (@$!%*?&#)')
  //   .required('Please enter your password'),

});
