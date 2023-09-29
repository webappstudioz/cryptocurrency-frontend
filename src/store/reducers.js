import { combineReducers } from "redux"

// Front
import Layout from "./layout/reducer"
import Login from "./auth/login/reducer"
import Account from "./auth/register/reducer"
import search from "./auth/search/reducer"
import userupdate from "./auth/userdetails/reducer"
import ForgetPassword from "../pages/Authentication/store/auth/forgetpwd/reducer"
import notificationUpdate from "./auth/notification/reducer" 
import services from "./services/reducer"
import products from "./products/reducer"
import savedCards from "./savedcards/reducer"
import supportTickets from "./supportTickets/reducer"
import fetchServices from "./syncedServices/reducer"
import Widgets from "./widgets/reducer"
import OSInstallationList from "./osInstallList/reducer"
// Authentication
// import Login from "./auth/login/reducer"
// import Account from "./auth/register/reducer"
// import ForgetPassword from "./auth/forgetpwd/reducer"
// import Profile from "./auth/profile/reducer"
// import search from  "../store/auth/search/reducer"
// import Login from "../pages/Authentication/store/auth/login/reducer"
// import Account from "../pages/Authentication/store/auth/register/reducer"

// import search from "../pages/Authentication/store/auth/search/reducer"
// import Invoices from "./invoices/reducer"

//E-commerce
// import ecommerce from "./e-commerce/reducer"
 
 
//service
//  import service from "../pages/Service/store/reducer"
//osreinstall
import {
  SelectedOs,
  SelectedCp,
  SelectedService,
  SelectedPartion,
} from "./osreinstall/reducer"
import SelectedServiceProduct from "./selectedservice/reducer"
const rootReducer = combineReducers({
  Layout,
  Login,
  Account,
  ForgetPassword,
  search,
  SelectedOs,
  SelectedCp,
  SelectedService,
  SelectedPartion,
  userupdate,
  notificationUpdate,
  services,
  savedCards,
  products,
  supportTickets,
  SelectedServiceProduct,
  fetchServices,
  Widgets,
  OSInstallationList
   // public,
  // ecommerce,
  // service,
  // Invoices,
})

export default rootReducer
