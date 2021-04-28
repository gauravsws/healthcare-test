import axios from 'axios';
import { getToken, setToken } from 'classimize-utils/Service.js';
const AuthInstance = axios.create();
AuthInstance.interceptors.response.use(function (response) {
  if(response.headers) {
    localStorage.setItem('api_token', response.headers.api_token);
  }
  return response;
}, function (error) {
   return error;
});

AuthInstance.interceptors.request.use(function (config) {
    const token = getToken();
    if(token) {
      config.headers.Authorization =  'Bearer '+token;
    }

    return config;
});

const apiUrl = process.env.REACT_APP_CLASSIMIZE_API;

export const loginUser = async (formData) => {
	try{
	  let response = await AuthInstance.post(apiUrl+'/admin/login', formData);	  
	  return response.data;
	} catch(error) {
	  return error.response.data;
	}
};

export const logoutUser = async () => {
	try{
	  let response = await AuthInstance.get(apiUrl+'/admin/logout');	  
	  return response.data;
	} catch(error) {
	  return error.response.data;
	}
};