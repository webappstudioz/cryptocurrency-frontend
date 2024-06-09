import axios from "axios"
import qs from "qs"
import { DateFormat, SETTINGS, TimeFormat } from "../constants/api/api_path"
import { toast } from "react-toastify"
import { delete_cookie } from "sfcookies"
import VisaLogo from "../assets/images/visa-card-logo.png"
import AmericanLogo from "../assets/images/american-card-logo.png"
import DiscoverLogo from "../assets/images/discover-card-logo.png"
import MasterCardLogo from "../assets/images/master-card-logo.png"
import CreditCardLogo from "../assets/images/credit-card-logo.jpg"
import { CONFIGURATIONS } from "../constants/api/api_path"
//pass new generated access token here

//apply base url for axios
// const API_URL = "https://reqres.in/"
// const API_URL = "https://dev30.modulesgarden-demo.com/client/redswitches_backend/api.php"
// const API_URL = "http://192.168.0.48:8001/v1"
const API_URL = process.env.REACT_APP_API_HOST

const axiosApi = axios.create({
  baseURL: API_URL,
})
axiosApi.defaults.withCredentials = true
// axiosApi.defaults.headers.common["Authorization"] = token
// axiosApi.defaults.headers.common["Content-Type"] = "application/x-www-form-urlencoded";
// axiosApi.defaults.headers.common["Cookie"] = "WHMCSejRPihBBu1GH=momj7cjd62k5s1nr9a85ivt5vh";

axios.interceptors.request.use(function (config) {
  // let authUser = JSON.parse(localStorage.getItem("authUser"))
  // if (authUser) {
  //   let decrypted = CryptoJS.AES.decrypt(authUser, SETTINGS.ENC_KEY)
  //   let newInfo = decrypted.toString(CryptoJS.enc.Utf8)
  //   let user = JSON.parse(newInfo)
  //   let token = ""
  //   user?.token ? (token = user?.token) : (token = user)
  //   if (token) {
  //     config["headers"]["common"]["Authorization"] = `Bearer ${token}`
  //   }
  //   // config['headers']['common']['Authorization'] = `Bearer ${authUser.token}`
  // }
  // return config

  let token = localStorage.getItem(SETTINGS.AUTHTOKEN)
  if (token) {
    config["headers"]["common"]["Authorization"] = `Bearer ${token}`
  }
  return config
})

axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

// export async function get(url, config = {}) {
//   return await axiosApi.get(url, { ...config }).then(response => response.data)
// }
export const sessionExpired = message => {
  toast.error(message ? message : "Login session expired", {
    position: toast.POSITION.TOP_RIGHT,
  })

  setTimeout(() => {
    window.location.href = "/login"
    clearCookiesAndStorage()
  }, 500)
}

export const clearCookiesAndStorage = () => {
  delete_cookie(SETTINGS.TOKENKEY)
  delete_cookie(SETTINGS.GUESTTOKEN)
  delete_cookie(SETTINGS.CURRENCY)
  localStorage.clear()
}

export async function getNew(url, config = {}) {
  // let authUser = JSON.parse(localStorage.getItem('authUser'));
  var config = {
    method: "GET",
    url: `${API_URL}${url}`,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
    params: {
      ...config?.params,
    },
  }
  // return axios(config);
  return axios(config).catch(error => {
    if (error?.response?.status === 401 || error?.response?.status === 500) {
      if (error?.response?.status === 401) {
        toast.error("Login session expired", {
          position: toast.POSITION.TOP_RIGHT,
        })
        window.location.href = "/login"
        localStorage.clear()
        sessionExpired()
      }
      throw error
    }
  })
}

export async function postNew(url, data, config = {}) {
  // let navigate = useHistory()

  var config = {
    method: "POST",
    url: `${API_URL}${url}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
    },
    data: data,
    params: {
      ...config?.params,
    },
  }
  // return axios(config);
  return axios(config).catch(error => {
    // if (error?.response?.status === 401 || error?.response?.status === 500) {
    // if (error?.response?.status === 401) {
    // sessionExpired()
    // }
    throw error
  })
}

export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then(response => response.data)
}

export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then(response => response.data)
}

export function encrypt(values) {
  if (values) {
    let encrypted = CryptoJS.AES.encrypt(values, SETTINGS.ENC_KEY).toString()
    return encrypted
  }
}

export function decrypt(values) {
  if (values) {
    let decrypted = CryptoJS.AES.decrypt(values, SETTINGS.ENC_KEY)
    return decrypted.toString(CryptoJS.enc.Utf8)
  }
}

//check valid json
export function isValidJson(jsonString) {
  try {
    JSON.parse(jsonString)
    return true
  } catch (e) {
    return false
  }
}

//set page title
export const setPageTitle = title => {
  document.title = `C2C - ${title}`
  return title
}

export const getHoursAgo = (time, currentTime) => {
  if (time != null && time != "NA") {
    const lastLogin = new Date(time)
    // Get the current time as a Date object
    let now = ""
    currentTime ? (now = new Date(currentTime)) : (now = new Date())
    // Calculate the time difference in milliseconds
    const diff = now.getTime() - lastLogin.getTime()
    // Convert the time difference to hours, minutes, and seconds
    // calculate the total number of seconds from the epoch to the current time
    const totalSeconds = Math.floor(diff / 1000)
    const years = Math.floor(totalSeconds / (60 * 60 * 24 * 365.25))
    const months = Math.floor(totalSeconds / (60 * 60 * 24 * 30.44)) % 12
    const days = Math.floor(totalSeconds / (60 * 60 * 24)) % 30.44
    const hours = Math.floor(totalSeconds / (60 * 60)) % 24
    const minutes = Math.floor(totalSeconds / 60) % 60
    const seconds = totalSeconds % 60

    // Format the output as needed
    let output = ""
    if (years > 0) {
      output = `${years} years`
    } else if (months > 0) {
      output = `${months} months`
    } else if (days > 0) {
      output = `${days} days`
    } else if (hours > 0) {
      output = `${hours} hours`
    } else if (minutes > 0) {
      output = `${minutes} minutes`
    } else if (seconds > 0) {
      output = `${seconds} seconds`
    }
    return output
  }
}

export const storeLoginTime = () => {
  const currTime = new Date().toLocaleString()
  let time = encrypt(currTime)
  localStorage.setItem(SETTINGS.LOGIN_TIME, time)
}

export const checkSessionExpire = () => {
  let auth = localStorage.getItem("authToken")
  if (auth) {
    let loginTime = localStorage.getItem(SETTINGS.LOGIN_TIME)
    loginTime = decrypt(loginTime)
    let currentTime = new Date().toLocaleString()
    const startTime = new Date(loginTime)
    const endTime = new Date(currentTime)

    const diffInMilliseconds = Math.abs(endTime - startTime)
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60))
    // session expired after 60 minutes
    if (diffInMinutes >= 60) {
      sessionExpired("Your session is expired")
    }
  }
}

export const getFormatedDate = date => {
  const dateInfo = new Date(date)
  const formattedDate = dateInfo.toLocaleString("en-IN", DateFormat)
  return formattedDate
}

export const getFormatedTime = time => {
  const timeInfo = new Date(time)
  const formatedTime = timeInfo.toLocaleString("en-IN", TimeFormat)
  return formatedTime
}

export const storeNotifications = data => {
  let encInfo = encrypt(JSON.stringify(data))
  localStorage.setItem(SETTINGS?.NOTIFICATION_KEY, encInfo)
}

export const FormatDate = (
  date,
  clientformat = "",
  client = "",
  time = "",
  zerodateval = ""
) => {
  let year = date?.substring(0, 4)
  let month = date?.substring(5, 7)
  let day = date?.substring(8, 10)
  let hours = date?.substring(11, 13)
  let minutes = date?.substring(14, 16)
  let seconds = date?.substring(17, 19)

  clientformat = "DD/MM/YYYY"
  if (date?.substring(0, 10) === "0000-00-00" && zerodateval) {
    return zerodateval
  }
  let formattedDate

  if (clientformat && year > 0 && month > 0 && day > 0) {
    if (clientformat === "full") {
      formattedDate = new Date(year, month - 1, day)
      formattedDate = formattedDate?.toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    } else if (clientformat === "shortmonth") {
      formattedDate = new Date(year, month - 1, day)
      formattedDate = formattedDate?.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    } else if (clientformat === "fullday") {
      formattedDate = new Date(year, month - 1, day)
      formattedDate = formattedDate?.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    } else if (clientformat === "DD/MM/YYYY") {
      formattedDate = new Date(year, month - 1, day)
      formattedDate = formattedDate?.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      })
    }

    if (time) {
      formattedDate += " (" + hours + ":" + minutes + ")"
    }
  } else {
    formattedDate = date
    formattedDate = formattedDate?.replace("YYYY", year)
    formattedDate = formattedDate?.replace("MM", month)
    formattedDate = formattedDate?.replace("DD", day)

    if (time) {
      formattedDate += " " + hours + ":" + minutes
    }
  }
  return formattedDate
}

//this function return credit card logos
export const selectCardLogo = cardType => {
  let logosrc = ""
  if (cardType == "Visa") {
    return (logosrc = VisaLogo)
  } else if (cardType == "American") {
    return (logosrc = AmericanLogo)
  } else if (cardType == "Discover") {
    return (logosrc = DiscoverLogo)
  } else if (cardType == "Mastercard") {
    return (logosrc = MasterCardLogo)
  } else {
    return (logosrc = CreditCardLogo)
  }
}

export const storeCards = data => {
  let encInfo = encrypt(JSON.stringify(data))
  localStorage.setItem(SETTINGS?.SAVEDCARDS, encInfo)
}

export const getStoredCards = () => {
  let storedCards = localStorage.getItem(SETTINGS?.SAVEDCARDS)
  if (storedCards) {
    storedCards = JSON.parse(decrypt(storedCards))
    return storedCards
  }
}

/**
  * step 2
  * here we store array in localstorage.
 */

export const storeArrayFuc = (serverid, uuid, status, percentage) => {
  let storedArray = JSON.parse(localStorage.getItem(CONFIGURATIONS?.SERVER_INSTALL_ARRAY)) || [];
  let newArray = { serverId: serverid, jobId: uuid, status: status, percentage: percentage }
  let isItemAlreadyExist = storedArray.some((item) => item.serverId === newArray.serverId)
  if (!isItemAlreadyExist) {
    storedArray.push(newArray)
    localStorage.setItem(CONFIGURATIONS?.SERVER_INSTALL_ARRAY, JSON.stringify(storedArray));
  } else {
    let existingObject = storedArray.find((item) => item.serverId === newArray.serverId)
    if (existingObject?.status != "FINISHED" && existingObject?.status != "CANCELED") {
      let myObject = { serverId: serverid, jobId: uuid, status: status, percentage: percentage || existingObject?.percentage };
      pushLatestStatus(myObject)
    }
  }
}

/** 
   * step6
   * here we store the updated array
  */
export const pushLatestStatus = (myObject) => {
  const storedArray = JSON.parse(localStorage.getItem(CONFIGURATIONS?.SERVER_INSTALL_ARRAY))
  const indexToUpdate = storedArray.findIndex(obj => obj?.serverId === myObject?.serverId)
  if (indexToUpdate !== -1) {
    storedArray[indexToUpdate] = myObject
  } else {
    storedArray.push(myObject)
  }
  localStorage.setItem(CONFIGURATIONS?.SERVER_INSTALL_ARRAY, JSON.stringify(storedArray));
}

export const findRange = (count, size) => {
  for (let i = 0; i < size.length - 1; i++) {
    if (count > size[i] && count <= size[i + 1]) {
      return size[i + 1]
    } else if (count <= size[i]) {
      return size[i]
    }
  }
}

// For GET requests
const requestHelper = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

requestHelper.interceptors.request.use(
  req => {
    const token = localStorage.getItem("authUser")
    req.headers["Authorization"] = token
    return req
  },
  err => {
    return Promise.reject(err)
  }
)
// For POST requests
requestHelper.interceptors.response.use(
  res => {
    if (res.status === 201 || res.status === 200) {
    }
    return res
  },
  err => {
    return Promise.reject(err)
  }
)

export default requestHelper
