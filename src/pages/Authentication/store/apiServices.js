import {
  postNew,
  getNew,
  decrypt,
  encrypt,
  sessionExpired
} from "../../../helpers/api_helper_rs"
import * as url from "../../../helpers/url_helper"

const API_URL = process.env.REACT_APP_API_HOST

export const registerConfirm = data => {
  return postNew(url.VERIFICATION, data)
}

export const registerSilent = async() => {
  try{
    return await postNew(url.SIGNUP_SILENT)
  }catch(error){
    sessionExpired(error?.response?.data?.message)
  }
}

export const resendOtp = token => {
  return getNew(url.RESEND + token)
}

export const resetPassword = async data => {
  return await postNew(url.RESET_PASSWORD, data)
}

export const resendPassLink = async data => {
  return await getNew(url.RESEND_PASS_LINK + data)
}

export const checkUser = async() => {
  let user = await getNew(url.CHECKUSER)
  if(user.status === 200){
    return user
  } else {
    sessionExpired(user?.data?.message)
  }
}
export const getWidgetsDetail = data => {
  return getNew(url.WEDGITSINFO + `?call=${data}`)
}

export const changePassword = async data => {
  return await postNew(url.CHANGE_PASSWORD, data)
}

export const searchProducts = search => {
  let res = getNew(url.SEARCH_PROD + search)
  return res
}

export const getCountryList = async () => {
  return await getNew(url.GET_COUNTRY)
}

export const getGstCountries = async() => {
  return await getNew(url.GST_COUNTRIES)
}

export const postCountry = async data => {
  return await postNew(url.POST_COUNTRY, data)
}

export const postClientProfileDetails = async data => {
  return await postNew(url.POST_CLIENT_INFO, data)
}

export const postUserProfileDetails = async data => {
  return await postNew(url.POST_USER_INFO, data)
}

export const getQRCode = async () => {
  return await getNew(url.GETQRCODE)
}

export const verify2FCode = async data => {
  return await postNew(url.VERIFY2FCODE, data)
}

export const disable2FAAuth = async () => {
  return await postNew(url.DISABLE2FA)
}

export const verfiy2FALoginOtp = async data => {
  return await postNew(url.VERIFIY2FAOTP, data)
}

export const userRole = () => {
  let auth = localStorage.getItem("authUser")
  if (auth) {
    let res = decrypt(JSON.parse(auth))
    if (res) {
      let info = JSON.parse(res)
      return info?.role
    }
  }
}

export const loginData = () => {
  let auth = localStorage.getItem("authUser")
  if (auth) {
    // let res = decrypt(JSON.parse(auth))
    let res = auth
    if (res) {
      let info = JSON.parse(res)
      return info
    }
  }
}

export const getClientInfo = async () => {
  return await getNew(url.GET_CLIENT_INFO)
}

//not in use
export const clientInfo = () => {
  let info = localStorage.getItem("cltdrtil")
  let userInfo = decrypt(JSON.parse(info))
  if (userInfo) {
    let data = JSON.parse(userInfo)
    return data
  }
}

export const getUserInfo = async () => {
  return await getNew(url.GET_USER_INFO)
}

export const userInfo = () => {
  let info = localStorage.getItem("usdrtil")
  let userInfo = decrypt(JSON.parse(info))
  if (userInfo) {
    let data = JSON.parse(userInfo)
    return data
  }
}

export const productDetails = async (data, call) => {
  return await getNew(url.GET_PRODUCTS_DETAIL + data + `?call=${call}`)
}

export const deviceDetails = async data => {
  return await postNew(url.GET_DEVICE_DETAILS, data)
}

export const rebootService = async () => {
  return await postNew(url.REBOOT)
}

export const getInvoice = async (data) => {
  return await postNew(url.GET_INVOICES, data)
}

export const getDatatraffic = async () => {
  return await postNew(url.DATA_TRAFFIC)
}

export const cancelServer = async data => {
  return await postNew(url.CANCEL_SERVER, data)
}

export const sendInvite = async data => {
  return await postNew(url.SEND_INVITE, data)
}

export const verifyUserInvite = async userToken => {
  return await postNew(url.VERIFY_INVITE, userToken)
}

export const getInviteList = async () => {
  return await getNew(url.INVITE_LIST)
}

export const invoiceDetail = async id => {
  return await getNew(url.GET_INVOICE_DETAIL + "/" + id)
}

export const syncInvoice = async(id,action) => {
  return await postNew(url.GET_INVOICE_DETAIL + "/" + id +  "/" + action)
}

export const resendInvitation = async id => {
  return await postNew(url.RESEND_INVITATION, id)
}

export const cancelInvitations = async id => {
  return await postNew(url.CANCEL_INVITATION, id)
}

export const removeAccess = async id => {
  return await postNew(url.REMOVE_ACCESS, id)
}

export const updatePermissions = async data => {
  return await postNew(url.UPDATE_PERMISSIONS, data)
}

export const downloadInvoice = async id => {
  let res = await getNew(url.GET_INVOICE_PREVIEW + "/" + id)
  if (res?.data?.data?.invoiceid) {
    let uid = res?.data?.data?.invoiceid
    window.location.assign(`${API_URL + url.GET_INVOICE_DOWNLOAD + "/" + uid}`)
    return "Invoice download initiated."
  } else return "Something went wrong"
}

export const getAnnouncements = async () => {
  return await getNew(url.Announcements)
}

export const getAnnouncementsDetail = async data => {
  return await postNew(url.AnnouncementDetail, data)
}

export const getSupportDepartment = async () => {
  return await getNew(url.SupportDepartment)
}

export const getTicketListing = async () => {
  return await getNew(url.createTicket)
}

export const createTicket = async data => {
  return await postNew(url.createTicket, data)
}

export const ticketView = async id => {
  return await getNew(url.createTicket + "/" + id)
}

export const replyTicket = async (id, data) => {
  return await postNew(url.createTicket + "/" + id + "/" + "reply", data)
}

export const CloseTicket = async data => {
  return await postNew(url.createTicket + "/" + "close", data)
}

export const getIplist = async () => {
  return await getNew(url.ipList)
}

export const downloadInvoiceInstant = async (id) => {
  window.location.assign(`${API_URL + url.GET_INVOICE_DOWNLOAD + "/" + id}`)
  return "Invoice download initiated."
}

export const confirmPageDetail = async(data) => {
  return await postNew(url.CONFIRM_PAGE_DETAIL, data)
}

export const getPaymentMethodList = async(data) => {
  if(data){
    return await postNew(url.PAYMENTMETHOD_LIST, data)
  }else {
    return await postNew(url.PAYMENTMETHOD_LIST)
  }
}

export const addWalletAmount = async(data) => {
  return await postNew(url.ADD_WALLET_AMOUNT, data)
}

export const applyCredit = async(data) => {
  return await postNew(url.APPLY_CREDIT,data)
}

export const getSupportPin = async() => {
  return await getNew(url.SUPPORT_PIN)
}

export const storeUserData = (data) => {
  let encInfo = encrypt(JSON.stringify(data))
  localStorage.setItem("authUser", JSON.stringify(encInfo))
  return true
}

export const storeAuthToken = (data) => {
  localStorage.setItem("authToken",data)
  return true
}

export const notificationList = async(data) => {
  return await postNew(url.NOTIFICATION_LIST, data)
}

export const markAllRead = async(data) => {
  if(data){
    return await postNew(url.MARK_ALL_READ, data)
  }else{
    return await postNew(url.MARK_ALL_READ)
  }
}

export const syncInvoices = async() => {
  return await getNew(url.SYNC_INVOICES)
}

export const getPaymentForms = async (data) => {
  return await postNew(url.PAYMENT_FORMS,data)
}

export const sendInvoiceMail = async(invoiceid) => {
  try{
     let data = new URLSearchParams({
      invoiceid:invoiceid
    })
    return await postNew(url.SEND_INVOICE_MAIL + `/${invoiceid}`, data)
  }catch(error){
  }
}

export const getDataTrafficDetails = async(data) => {
  return await postNew(url.GET_DATA_TRAFFIC, data)
}

export const getBandwidthDetails = async(data) => {
  return await postNew(url.GET_DATA_BANDWIDTH, data)
}

export const getOSList = async(data) => {
  return await postNew(url.GET_OS_LIST,data)
}

export const getOSConfig = async(data) => {
  return await postNew(url.GET_OS_CONFIG, data)
}

/**
 * get installation percenteage and status of operating system of single server
 */
export const getOsInstallationInfo = async(data) => {
  return await postNew(url.GET_OSINSTALLATION_INFO,data)
}

/**
 * get list of all servers wich is installing opertaing systems
 */
export const getListOsInstallServers = async() => {
  return await postNew(url.ALL_OS_INSTALL_SERVERS)
}

export const cancelOsInstallation = async(data) => {
  return await postNew(url.CACEL_INSTALLATION, data)
} 

export const completeProfile = async(data) => {
  return await postNew(url.COMPLETE_PROFILE, data)
}

export const updateProfileSilent = async() => {
  return await postNew(url.UPDATE_PROFILE_SILENT)
}

//operating system installation for leaseweb
export const installOperatingSystem = async(data) => {
  return await postNew(url.OS_INSTALL,data)
}