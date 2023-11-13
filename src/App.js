import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import { Switch, Route, BrowserRouter as Router } from "react-router-dom"
// import { useHistory } from "react-router-dom"

import { connect, useDispatch, useSelector } from "react-redux"

// Import Routes all
import { userRoutes, authRoutes, userVerifyRoutes, unAuthrizedRoutes, adminRoutes } from "./routes/allRoutes"

// Import all middleware
import Authmiddleware from "./routes/middleware/Authmiddleware"
import VerificationMiddleware from "./routes/middleware/VerificationMiddleware"

// layouts Format
import VerticalLayout from "./components/VerticalLayout/"
import HorizontalLayout from "./components/HorizontalLayout/"
import NonAuthLayout from "./components/NonAuthLayout"
import UnAuthVerticalLayout from "./components/UnAuthVerticalLayout"
import AdminLayout from "./components/AdminLayout"
// Import scss
import "./assets/scss/theme.scss"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import PageNotFound from "./pages/Authentication/PageNotFound"
import UnAuthrizedmiddleware from "./routes/middleware/UnAuthrizedmiddleware"
import { checkSessionExpire, decrypt, storeLoginTime } from "./helpers/api_helper_rs"
import { CONFIGURATIONS } from "./constants/api/api_path"
import { getListOsInstallServers, productDetails } from "./pages/Authentication/store/apiServices"
import { getOsInstallationInfo } from "../src/pages/Authentication/store/apiServices"
import { update } from "lodash"
import { osListFetched } from "./store/osInstallList/action"
import Adminmiddleware from "./routes/middleware/Adminmiddleware"
const App = props => {
  const dispatch = useDispatch()
  const hit = useSelector(state => state?.OSInstallationList?.hit)
  const [getJobTimer, setGetJobTimer] = useState(10000)
  useEffect(() => {
    //check user active or in-active
      const interval = setInterval(() => {
        checkSessionExpire()
      }, 1000);

      return () => {
        clearInterval(interval);
      };
  }, []);

  // useEffect(() => {
  //   if(hit){
  //     fetchdetails()
  //   }
  // },[hit])

  // useEffect(() =>{
  //   const interval = setInterval(() => {
  //     fetchdetails()
  //     changeServiceStatus()
  //     // removeService()
  //   }, 10000)

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [])

  // /**
  //  * step 1.
  //  * here we fetch list of servers which is installing servers.
  //  */
  // const fetchdetails =async() =>{
  //   try{
  //     let res = await getListOsInstallServers()
  //     let list = res?.data?.data
  //     dispatch(osListFetched())
  //     if(list?.length > 0){
  //       list?.map((arrList) => {
  //         if(arrList?.status === "ACTIVE"){
  //           storeArrayFuc(arrList?.service_id, arrList?.uuid, arrList?.status, arrList?.percentage, arrList?.event)
  //         }
  //       })
  //     }
  //   }catch(error){  }
  // } 

  // /**
  //  * step 2
  //  * here we store array in localstorage.
  // */
  // const storeArrayFuc = (serverid, uuid, status, percentage, event) => {
  //   const storedArray = JSON.parse(localStorage.getItem(CONFIGURATIONS?.SERVER_INSTALL_ARRAY)) || [];
  //   const newArray = {serverId:serverid, jobId:uuid, status:status, percentage:percentage, event:event}
  //   let isItemAlreadyExist = storedArray?.find((item) => item?.serverId === newArray?.serverId)
  //   if(!isItemAlreadyExist){
  //     storedArray?.push(newArray)
  //     localStorage.setItem(CONFIGURATIONS?.SERVER_INSTALL_ARRAY, JSON.stringify(storedArray));
  //   }else{
  //     let existingObject = storedArray?.find((item) => item?.serverId === newArray?.serverId)
  //     if(existingObject?.status != "FINISHED" && existingObject?.status != "CANCELED"){
  //       let myObject = {serverId: serverid, jobId: uuid, status: status, percentage: percentage || existingObject?.percentage, event:event};
  //       pushLatestStatus(myObject)
  //     }
  //   }
  // }

  // /**
  //  * step 3
  //  * Set up a timer that starts at 10 seconds and doubles after each run,
  //  * but doesn't exceed 2 minutes.
  //  */
  // useEffect(() => {
  //   const timeInterval = setInterval(() => {
  //     let newTime = getJobTimer * 2
  //     if(newTime > 120000){
  //       newTime = 120000
  //     }
  //     setGetJobTimer(newTime)
  //     getStoredServersList()
  //   },getJobTimer)

  //   return () => {
  //     clearInterval(timeInterval)
  //   }
  // },[getJobTimer])

  // /**
  //  * step4
  //  * here we are fetching stored array and hit the function to get status or percentage of operating system installation. 
  //  */
  // const getStoredServersList = () => {
  //   let res = JSON.parse(localStorage.getItem(CONFIGURATIONS?.SERVER_INSTALL_ARRAY))
  //   if(res){
  //     res?.map((list)=> {
  //       if(list?.status === "ACTIVE"){
  //         syncInstallationStatus(list?.serverId, list?.jobId, list?.event)
  //       }
  //     })
  //   }
  // }

  //  /**
  //  * step5
  //  * here we are getting the status or percentage of operating system installation. 
  //  */
  // const syncInstallationStatus = async(serverid, jobid, event) => {
  //   try{
  //     let data = new URLSearchParams({
  //       service_id: serverid,
  //       job_id: jobid
  //     })
  //     let res = await getOsInstallationInfo(data)
  //     let info = res?.data?.data
  //     if(info){
  //       let myObject = {serverId: info?.service_id, jobId: info?.uuid, status: info?.status, percentage: info?.percentage, event: event};
  //       pushLatestStatus(myObject)
  //     }
  //   }catch(error){  }
  // }

  // /** 
  //  * step6
  //  * here we store the updated array
  // */
  // const pushLatestStatus = (myObject) => {
  //   const storedArray = JSON.parse(localStorage.getItem(CONFIGURATIONS?.SERVER_INSTALL_ARRAY))
  //   const indexToUpdate = storedArray?.findIndex(obj=> obj?.serverId === myObject?.serverId)
  //   if(indexToUpdate !== -1){
  //     storedArray[indexToUpdate] = myObject
  //   }else {
  //     storedArray?.push(myObject)
  //   }
  //   localStorage.setItem(CONFIGURATIONS?.SERVER_INSTALL_ARRAY, JSON.stringify(storedArray));
  // }

  // /**
  //  * step 7 
  //  * Here, we are changing service status from FINSIHED to FINIALIZING and it into localStorage.
  //  */
  // const changeServiceStatus = () => {
  //   const storedArray = JSON.parse(localStorage.getItem(CONFIGURATIONS?.SERVER_INSTALL_ARRAY))
  //   if(storedArray){
  //     const updatedArray = storedArray?.map((service) => {
  //       if(service?.status === "FINISHED"){
  //         finalizingService(service?.serverId)
  //         return { ...service, status:"FINALIZING"}
  //       }
  //       return service
  //     })
  //     localStorage.setItem(CONFIGURATIONS?.SERVER_INSTALL_ARRAY, JSON.stringify(updatedArray))
  //   }
  // }

  // /**
  //  * 8
  //  * Here, we are finalizing the service.
  //  */
  // const finalizingService = async(serviceId) => {
  //   try{
  //     let res = await productDetails(serviceId,1)
  //     removeService(serviceId)
  //   }catch(error){
  //     removeService(serviceId)
  //   }
  // }

  // /**
  //  * step 9 
  //  * Here, we are removing services from localStorage.
  //  */
  // const removeService = (serviceId) => {
  //   const storedArray = JSON.parse(localStorage.getItem(CONFIGURATIONS?.SERVER_INSTALL_ARRAY))
  //   let indexToRemove = storedArray?.findIndex((item) => item?.serverId === serviceId)
  //   if(indexToRemove !== -1){
  //     storedArray?.splice(indexToRemove, 1);
  //     localStorage.setItem(CONFIGURATIONS?.SERVER_INSTALL_ARRAY, JSON.stringify(storedArray));
  //   }
  // }
  
  useEffect(() => {
    window?.addEventListener('mousemove', handleUserActivity);
    window?.addEventListener('keypress', handleUserActivity);
    window?.addEventListener('touchstart', handleUserActivity);
  },[])

  const handleUserActivity = () => {
    let auth = localStorage.getItem("authToken")
    auth? storeLoginTime() : null
  }

  function getLayout() {
    let layoutCls = VerticalLayout

    switch (props?.layout?.layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout
        break
      default:
        layoutCls = VerticalLayout
        break
    }
    return layoutCls
  }

  function getUnAuthLayout() {
    let layoutCls = UnAuthVerticalLayout
    switch (props?.layout?.layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout
        break
      default:
        layoutCls = UnAuthVerticalLayout
        break
    }
    return layoutCls
  }

  function getAdminLayout() {
    let layoutCls = AdminLayout
    switch (props?.layout?.layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout
        break
      default:
        layoutCls = AdminLayout
        break
    }
    return layoutCls
  }

  const Layout = getLayout()
  const UnAuthLayout = getUnAuthLayout()
  const AdminsLayout = getAdminLayout()
  return (
    <React.Fragment>
      <Router>
        <Switch>
          {authRoutes?.map((route, idx) => (
            <Authmiddleware
              path={route?.path}
              layout={NonAuthLayout}
              component={route?.component}
              key={idx}
              isAuthProtected={false}
            />
          ))}
          {unAuthrizedRoutes?.map((route, idx) =>(
            <UnAuthrizedmiddleware 
              exact={true}
              path={route?.path}
              layout={UnAuthLayout}
              component={route?.component}
              key={idx}
              isAuthProtected={false}
            />
          ))}
          {userRoutes?.map((route, idx) => (
            <Authmiddleware
              path={route?.path}
              layout={Layout}
              component={route?.component}
              key={idx}
              isAuthProtected={true}
              exact={true}
            />
          ))}

          {userVerifyRoutes?.map((route, idx) => (
            <VerificationMiddleware
              path={route?.path}
              // layout={Layout}
              component={route?.component}
              key={idx}
              // isAuthProtected={true}
              isAuthProtected={false}
              exact={true}
            />
          ))}

          {adminRoutes?.map((route, idx) => (
            <Adminmiddleware 
              path={route?.path}
              layout={AdminsLayout}
              component={route?.component}
              key={idx}
              isAuthProtected={true}
              exact={true}
            />
          ))}
          <Route component={PageNotFound} />
        </Switch>
        <ToastContainer closeButton={false} position="bottom-right" />
      </Router>
    </React.Fragment>
  )
}

App.propTypes = {
  layout: PropTypes.any,
}

const mapStateToProps = state => {
  return {
    layout: state.Layout,
  }
}

export default connect(mapStateToProps, null)(App)
