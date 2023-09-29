import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
// const logout = async () =>{
//      axios.defaults.baseURL = process.env.REACT_APP_API_LOCAL_KEY;
//       await axios.post("/logout",{
//         token: localStorage.getItem("loginToken")
//        })
//         localStorage.removeItem("loginToken");
//         localStorage.removeItem("library_data");
//         localStorage.removeItem("date");
//         localStorage.removeItem("token-id");
//         localStorage.removeItem("user_detail");
//         localStorage.removeItem("username");
// }
// For GET requests
const requestHelper = axios.create({
  baseURL: process.env.REACT_APP_API_LOCAL_KEY,
  headers: {
    "Content-Type": "application/json",
  },
});

requestHelper.interceptors.request.use(
  (req) => {
    // const authUser = localStorage.getItem("authUser");

    // req.headers["Authorization"] = `Bearer ${authUser.jwt}`
    return req;
  },
  (err) => {
    return Promise.reject(err);
  }
);
// For POST requests
requestHelper.interceptors.response.use(
  (res) => {
    if (res.status === 201 || res.status === 200) {
    }
    return res;
  },
  (err) => {
     toast.error(err?.message, {
      position: toast.POSITION.TOP_RIGHT
    });
    // switch (err?.response?.status) {
    //   case 401:
    //     // logout() 
    //     // window.location.href = "/login";
    //     break;
    //   default:
    //     break;
    // }
    return Promise.reject(err);
  }
);

export default requestHelper;
