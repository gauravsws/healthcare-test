import axios from 'axios';
import moment from 'moment';

export const apiDateFormat = date => {
  return moment(date).format("YYYY-MM-DD");
};

export function isLoggedIn() {
  return localStorage.getItem('isLoggedIn');
}
export function handleInvalidToken() {
  //clearToken();
  clearUserData();
  window.location.href = "/login";
}

export function clearUserData() {
  localStorage.removeItem('userData');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('api_token');
  localStorage.removeItem('leftSection');
}

export function getUser() {
  return localStorage.getItem('userData');
}

export function setToken(access_token) {

}

export function getToken() {
  let token = localStorage.getItem('api_token')
  if(token) {
    return token;
  }
  return false;
}
export function logoutCompletely() {
  clearUserData()  
}
