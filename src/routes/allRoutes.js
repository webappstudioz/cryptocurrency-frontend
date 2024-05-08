import React from "react"
import { Redirect } from "react-router-dom"
// Dashboard
import Product from "../pages/Dashboard/Product"
import Notification from "../pages/Dashboard/Notification"
import Pages from "../pages/Dashboard/Pages"
import ProductListing from "../pages/Service/ProductListing"
import ServerManagement from "../pages/Service/ServerManagement"
import ReinstallWizard1 from "../pages/OS_Reinstall/ReinstallWizard1"
import ReinstallWizard2 from "../pages/OS_Reinstall/ReinstallWizard2"
import ReinstallWizard3 from "../pages/OS_Reinstall/ReinstallWizard3"
import ReinstallWizard4 from "../pages/OS_Reinstall/ReinstallWizard4"
import ReinstallWizard4v2 from "../pages/OS_Reinstall/ReinstallWizard4v2"

// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"
import Emailverification from "../pages/Authentication/Emailverification"
import ResetPassword from "../pages/Authentication/ResetPassword"
import LoginSuspended from "../pages/Authentication/LoginSuspended"
import StepVerification from "../pages/Authentication/StepVerification"

// Profile
import UserProfile from "../pages/Authentication/user-profile"
import ChangePassword from "../pages/Authentication/ChangePassword"
import MyAccount from "../pages/Authentication/MyAccount"
import UserAccountDetail from "../pages/Authentication/UserAccountDetail"
import UserManagement from "../pages/Authentication/UserManagement"
import UserManagementv2 from "../pages/Authentication/UserManagementv2"
import Billing from "../pages/Authentication/Billing"
import Payment from "../pages/Authentication/Payment"
import SecuritySettings from "../pages/Authentication/SecuritySettings"

// Service
import ServiceList from "../pages/Service/ServiceList"
import Invoice from "../pages/Invoices/Invoice"
import TwoFAVerification from "../pages/Authentication/TwoFAVerification"
import BuyProduct from "../pages/Service/BuyProduct"
import AddToCart1 from "../pages/Service/AddToCart1"
import ProductConfig from "../pages/Service/ProductConfig"
import ProductCheckout from "../pages/Service/ProductCheckout"
import Confirmation from "../pages/Service/Confirmation"
import AnnouncmentsList from "../pages/Service/AnnouncmentsList"
import AnnouncmentDetail from "../pages/Service/AnnouncmentDetail"
import Support from "../pages/Service/Support "
import SupportRequest from "../pages/Service/SupportRequest"
import CartReview from "../pages/Service/CartReview"
import TicketView from "../pages/Service/TicketView"
import InvoiceDetail from "../pages/Invoices/InvoiceDetail"
import TicketSuccess from "../pages/Service/TicketSuccess"
import InvoiceCheckout from "../pages/Invoices/InvoiceCheckout"
import DepositFunds from "../pages/Accounts/depositFunds"
import WithdrawFunds from "../pages/Accounts/withdrawFunds"
import TransferFunds from "../pages/Accounts/transferFunds"
import PaymentHistory from "../pages/Accounts/paymentHistory"
import Dashboard from "../pages/Authentication/Dashboard"
import PlayAndWin from "../pages/Authentication/PlayAndWin"
import AdminRegister from "../pages/Admin/AdminRegister"
import AdminLogin from "../pages/Admin/AdminLogin"
import UsersList from "../pages/Admin/UsersList"
import AddAccount from "../pages/Admin/AddAccount"
import AdminMyAccount from "../pages/Admin/AdminMyAccount"
import AdminChangePassword from "../pages/Admin/AdminChangePassword"
import StoreResulst from "../pages/Admin/StoreResulst"

const unAuthrizedRoutes = [
  { path: "/announcments", component: AnnouncmentsList},
  { path: "/announcmentDetail/:id", component: AnnouncmentDetail },
  { path: "/productlist", component: ProductListing },
  { path: "/product-config/:id", component: ProductConfig },
  { path: "/cart-review", component: CartReview },
  { path: "/product-checkout", component: ProductCheckout },
]

const userRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/services", component: ServiceList },
  { path: "/server-management/:id", component: ServerManagement },
  { path: "/invoice-detail/:id", component: InvoiceDetail },
  { path: "/invoice-detail/:id/:mode", component: InvoiceDetail },
  { path: "/invoice-checkout", component: InvoiceCheckout },
  { path: "/invoice", component: Invoice },
  { path: "/reinstall-wizard-1", component: ReinstallWizard1 },
  { path: "/reinstall-wizard-2", component: ReinstallWizard2 },
  { path: "/reinstall-wizard-3", component: ReinstallWizard3 },
  { path: "/reinstall-wizard-4", component: ReinstallWizard4 },
  // { path: "/reinstall-wizard-1/:id", component: ReinstallWizard1 },
  // { path: "/reinstall-wizard-2/:id", component: ReinstallWizard2 },
  // { path: "/reinstall-wizard-3/:id", component: ReinstallWizard3 },
  // { path: "/reinstall-wizard-4/:id", component: ReinstallWizard4 },
  { path: "/reinstall-wizard-4/v2", component: ReinstallWizard4v2 },
  { path: "/pages", component: Pages },
  { path: "/product", component: Product },
  { path: "/notification", component: Notification },
  { path: "/profile", component: UserProfile },
  { path: "/change-password", component: ChangePassword },
  { path: "/my-account", component: MyAccount },
  { path: "/user-account-detail", component: UserAccountDetail },
  { path: "/user-management", component: UserManagementv2 },
  { path: "/user-management/v2", component: UserManagement },
  { path: "/billing", component: Billing },
  { path: "/payment", component: Payment },
  { path: "/security-settings", component: SecuritySettings },
  { path: "/buy-product", component: BuyProduct },
  { path: "/add-to-cart1", component: AddToCart1 },
  { path: "/support", component: Support },
  { path: "/support-ticket/:id", component: SupportRequest },
  { path: "/ticket-view", component: TicketView },
  { path: "/ticket-success", component: TicketSuccess },
  { path: "/announcment", component: AnnouncmentsList},
  { path: "/productslist", component: ProductListing },
  { path: "/confirm/:oid", component: Confirmation },
  { path: "/confirmation", component: Confirmation },
  //accounts
  { path: "/deposite-funds", component: DepositFunds },
  { path: "/witdraw-funds", component: WithdrawFunds },
  { path: "/transfer-funds", component: TransferFunds },
  { path: "/payment-history", component: PaymentHistory },
  // { path: "/playandwin", component: PlayAndWin },
  // { path: "/users-list", component: UsersList },

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: () => <Redirect to="/login" /> },
  // { path: "**", component: ServiceList}
]

const adminRoutes = [
  { path: "/playandwin", component: PlayAndWin },
  { path: "/users-list", component: UsersList },
  { path: "/add-accounts", component: AddAccount },
  { path: "/my-profile", component: AdminMyAccount },
  { path: "/changepassword", component: AdminChangePassword },
  { path: "/admin-payment-history", component: PaymentHistory },
  { path: "/admin/results", component: StoreResulst },
]

const authRoutes = [
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/register", component: Register },
  { path: "/email-verify", component: Emailverification },
  { path: "/reset-password/:token", component: ResetPassword },
  { path: "/login-suspended", component: LoginSuspended },
  { path: "/admin/register", component: AdminRegister },
  { path: "/admin/login", component: AdminLogin },
  
  // { path: "**", component: Login},
]

const userVerifyRoutes = [
  { path: "/Verification", component: StepVerification },
  { path: "/two-fa", component: TwoFAVerification}
  // { path: "**", component: Login},
]


export { userRoutes, authRoutes, userVerifyRoutes, unAuthrizedRoutes, adminRoutes }