import axios from "axios";
// import { del, get, post, put } from "./api_helper";
import * as url from "./url_helper";
import { postNew, getNew } from "./api_helper_rs";
// Gets the logged in user data from local session
const getLoggedInUser = () => {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};

//is user is logged in
const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};

const postJwtRegisterNew = (data) => {
  return postNew(url.REGISTER, data)
};

const postGoogleLogin = (data) => {
  return postNew(url.GOOGLE_LOGIN, data)
};

const postJwtLoginNew = (data, config) => {
  return postNew(url.LOGIN, data, config)
};

const postJwtForgetPwdNew = (data) => {
  return postNew(url.FORGET_PASSWORD, data)
};

export {
  getLoggedInUser,
  isUserAuthenticated,
  postJwtLoginNew,
  postJwtRegisterNew,
  postJwtForgetPwdNew,
  postGoogleLogin
};
