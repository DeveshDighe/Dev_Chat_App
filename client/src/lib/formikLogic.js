import { useFormik } from "formik";
import { loginSchema, RegisterSchema } from "../utils/yup";
import { useNavigate } from "react-router-dom";


export const loginFormik= () => {
  const navigate = useNavigate();
  return useFormik({
    initialValues : { name: '', password: '' },
    validationSchema : loginSchema,
    onSubmit: (value) => {
      console.log(value, 'This is val bro');
      navigate('/admin/dashboard')
    }
  });
}


export const registerFormik= () => {
  return useFormik({
    initialValues : { name: '', password: '', email: '', bio: '', avatar : '' },
    validationSchema : RegisterSchema,
    onSubmit: (value) => {
      console.log(value, 'This is val bro');
    }
  });
}