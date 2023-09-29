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

// Register Method
// const postFakeRegister = (data) => post(url.POST_FAKE_REGISTER, data);

// // Login Method
// const postFakeLogin = (data) => post(url.POST_FAKE_LOGIN, data);

// // postForgetPwd
// const postFakeForgetPwd = (data) => post(url.POST_FAKE_PASSWORD_FORGET, data);

// Edit profile
// const postJwtProfile = (data) => post(url.POST_EDIT_JWT_PROFILE, data);

// const postFakeProfile = (data) => post(url.POST_EDIT_PROFILE, data);

// // Register Method
// const postJwtRegister = (url, data) => {
//   return post(url, data)
//     .then((response) => {
//       // if (response.status >= 200 || response.status <= 299)
//       //   return response.data;
//       // throw response.data;
//       return response;
//     })
//     .catch((err) => {
//       var message;
//       // if (err.response && err.response.status) {
//       //   switch (err.response.status) {
//       //     case 404:
//       //       message = "Sorry! the page you are looking for could not be found";
//       //       break;
//       //     case 500:
//       //       message =
//       //         "Sorry! something went wrong, please contact our support team";
//       //       break;
//       //     case 401:
//       //       message = "Invalid credentials";
//       //       break;
//       //     default:
//       //       message = err[1];
//       //       break;
//       //   }
//       // }
//       // throw message;
//       throw "error in register"
//     });
// };

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

// // postForgetPwd
// const postJwtForgetPwd = (data) =>
//   post(url.POST_FAKE_JWT_PASSWORD_FORGET, data);

 
// get Products
// export const getProducts = () => get(url.GET_PRODUCTS);

// get Product detail
// export const getProductDetail = (id) =>
//   get(`${url.GET_PRODUCTS_DETAIL}/${id}`, { params: { id } });

// get Events
// export const getEvents = () => get(url.GET_EVENTS);

// add Events
// export const addNewEvent = (event) => post(url.ADD_NEW_EVENT, event);

// // update Event
// export const updateEvent = (event) => put(url.UPDATE_EVENT, event);

// // delete Event
// export const deleteEvent = (event) =>
//   del(url.DELETE_EVENT, { headers: { event } });

// get Categories
// export const getCategories = () => get(url.GET_CATEGORIES);

// // get chats
// export const getChats = () => get(url.GET_CHATS);

// // get groups
// export const getGroups = () => get(url.GET_GROUPS);

// // get Contacts
// export const getContacts = () => get(url.GET_CONTACTS);

// // get messages
// export const getMessages = (roomId = "") =>
//   get(`${url.GET_MESSAGES}/${roomId}`, { params: { roomId } });

// post messages
// export const addMessage = (message) => post(url.ADD_MESSAGE, message);

// // get orders
// // export const getOrders = () => get(url.GET_ORDERS);

// // add order
// export const addNewOrder = (order) => post(url.ADD_NEW_ORDER, order);

// // update order
// export const updateOrder = (order) => put(url.UPDATE_ORDER, order);

// // delete order
// export const deleteOrder = (order) =>
//   del(url.DELETE_ORDER, { headers: { order } });

// get cart data
// export const getCartData = () => get(url.GET_CART_DATA);

// // get customers
// export const getCustomers = () => get(url.GET_CUSTOMERS);

// // add CUSTOMER
// export const addNewCustomer = (customer) =>
//   post(url.ADD_NEW_CUSTOMER, customer);

// // update CUSTOMER
// export const updateCustomer = (customer) => put(url.UPDATE_CUSTOMER, customer);

// // delete CUSTOMER
// export const deleteCustomer = (customer) =>
//   del(url.DELETE_CUSTOMER, { headers: { customer } });

// get shops
// export const getShops = () => get(url.GET_SHOPS);

// // get wallet
// export const getWallet = () => get(url.GET_WALLET);

// // get crypto order
// export const getCryptoOrder = () => get(url.GET_CRYPTO_ORDERS);

// get invoices
// export const getInvoices = () => get(url.GET_INVOICES);

// add invoices
// export const addNewInvoice = (invoice) =>
// post(url.ADD_NEW_INVOICE, invoice);

//update invoices
// export const updateInvoice = (invoice) => put(url.UPDATE_INVOICE, invoice);

// //delete invoice
// export const deleteInvoice = (invoice) =>
// del(url.DELETE_INVOICE, {headers: {invoice}})

// get invoice details
// export const getInvoiceDetail = (id) =>
//   get(`${url.GET_INVOICE_DETAIL}/${id}`, { params: { id } });

// // get project
// export const getProjects = () => get(url.GET_PROJECTS);

// // get project details
// export const getProjectsDetails = (id) =>
//   get(`${url.GET_PROJECT_DETAIL}/${id}`, { params: { id } });

// // get tasks
// export const getTasks = () => get(url.GET_TASKS);

// // get contacts
// export const getUsers = () => get(url.GET_USERS);

// // add user
// export const addNewUser = (user) => post(url.ADD_NEW_USER, user);

// // update user
// export const updateUser = (user) => put(url.UPDATE_USER, user);

// delete user
// export const deleteUser = (user) => del(url.DELETE_USER, { headers: { user } });

/** PROJECT */
// // add user
// export const addNewProject = (project) => post(url.ADD_NEW_PROJECT, project);

// // update user
// export const updateProject = (project) => put(url.UPDATE_PROJECT, project);

// // delete user
// export const deleteProject = (project) =>
//   del(url.DELETE_PROJECT, { headers: { project } });

// export const getUserProfile = () => get(url.GET_USER_PROFILE);

// for live project get services
// export const getServices = (config) => getNew(url.GET_SERVICES, config);

// export const getServiceDetail = (params) => getNew(`${url.GET_SERVICES_DETAIL}`, params);
// export const getHardwareDetail = (params) => getNew(`${url.GET_SERVICES_DETAIL}`, params);
// export const getIPList = (params) => getNew(`${url.GET_IP_LIST}`, params);

// export const getCards = (config) => getNew(url.GET_CARDS, config);

// get invoices
// export const getInvoicesList = (config) => getNew(url.GET_INVOICES_LIST, config);

// get ticket list
// export const getTicketList = (config) => getNew(url.GET_TICKET_LIST, config);

// get clients list
// export const getClients = (config) => getNew(url.GET_CLIENTS, config);
export {
  getLoggedInUser,
  isUserAuthenticated,
  postJwtLoginNew,
  postJwtRegisterNew,
  postJwtForgetPwdNew,
  postGoogleLogin
};
