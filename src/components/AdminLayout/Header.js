import PropTypes from "prop-types"
import React, { useEffect, useState, useRef } from "react"

import { connect } from "react-redux"
import { Link, useHistory } from "react-router-dom"

// Import menuDropdown
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown"

import logoSm from "../../assets/images/logo-sm.png"
import logoDark from "../../assets/images/logo-dark.png"
import logoLight from "../../assets/images/logo-light.png"

// import images
import top from "../../assets/images/top-btn.png"
import add from "../../assets/images/add.png"

//i18n
import { withTranslation } from "react-i18next"

import ProfileMenuHeader from "../CommonForBoth/TopbarDropdown/ProfileMenuHeader"
import { useSelector, useDispatch } from "react-redux"
import { toast } from "react-toastify"

// Redux Store
import {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
} from "../../store/actions"
import { debounce } from "lodash"

import {
  // checkUser,
  // syncInvoices,
  searchProducts,
  // syncUserJob,
} from "../../pages/Authentication/store/apiServices"
import { isNotificationUpdated } from "../../store/auth/notification/action"
import { SETTINGS } from "../../constants/api/api_path"
import { decrypt, clearCookiesAndStorage, checkSessionExpire} from "../../helpers/api_helper_rs"
import { getCards } from "../../store/savedcards/action"
import { allServicesSync, isServicesFetched } from "../../store/services/actions"
import TextLoader from "../textLoader"
import ProgressBar from "../progressBar"
import { syncAllServices } from "../../pages/Service/store/apiService"
const Header = props => {
  let navigate = useHistory()
  const serviceData = useSelector(state => state?.services)
  const notificationInfo = useSelector(state => state?.notificationUpdate)
  const supportPermission = useSelector(state => state?.supportTickets?.tickets?.tickets_view)
  const registerUser = useSelector(state => state?.Account?.user)
  const [search, setsearch] = useState("")
  const path = window.location.pathname;
  const [notificationData, setNotificationData] = useState()
  const [loader, setLoader] = useState(false)
  const [loading, setLoading] = useState("")
  const dispatch = useDispatch()

  useEffect(() => {
    checkSessionExpire();
  },[])
  
  // function toggleFullscreen() {
  //   if (
  //     !document.fullscreenElement &&
  //     /* alternative standard method */ !document.mozFullScreenElement &&
  //     !document.webkitFullscreenElement
  //     ) {
  //       // current working methods
  //       if (document.documentElement.requestFullscreen) {
  //         document.documentElement.requestFullscreen()
  //       } else if (document.documentElement.mozRequestFullScreen) {
  //         document.documentElement.mozRequestFullScreen()
  //       } else if (document.documentElement.webkitRequestFullscreen) {
  //         document.documentElement.webkitRequestFullscreen(
  //         Element.ALLOW_KEYBOARD_INPUT
  //         )
  //       }
  //   } else {
  //     if (document.cancelFullScreen) {
  //       document.cancelFullScreen()
  //     } else if (document.mozCancelFullScreen) {
  //       document.mozCancelFullScreen()
  //     } else if (document.webkitCancelFullScreen) {
  //       document.webkitCancelFullScreen()
  //     }
  //   }
  // }
      
  function tToggle() {
    var body = document.body
    body.classList.toggle("vertical-collpsed")
    body.classList.toggle("sidebar-enable")
  }

  const handleDebounceVal = (search) => {
    makeApiRequestDebounced.current(search);
  }
      
  const handleSearchProducts = async search => {
    setLoader(true)
    setLoading(true)
    try {
      let result = await searchProducts(search)
      let list = result?.data?.data?.products
      dispatch(isServicesFetched(list, 1,))
      setLoader(false)
      setLoading(false)
    } catch (error) {
      setLoader(false)
      setLoading(false)
    }
  }

  const makeApiRequestDebounced = useRef(debounce(handleSearchProducts, 1000));

  useEffect(() => {
    let notiInfo = localStorage.getItem(SETTINGS?.NOTIFICATION_KEY)
    if (notiInfo) {
      notiInfo = JSON.parse(decrypt(notiInfo))
      setNotificationData(notiInfo)
    } else if (notificationInfo?.notifications?.notifications) {
      setNotificationData(notificationInfo?.notifications?.notifications)
    }
  }, [notificationInfo])

  // useEffect(() => {
  //   if (serviceData?.services) {
  //     let checkuser = localStorage.getItem("checkuserstatus")
  //     if (checkuser == undefined) {
  //       // dispatch(isNotificationUpdated("unread")) //2
  //       // syncInvoices() //1
  //       checkUserStatus()
  //     }
  //   }
  // }, [serviceData])

  // const checkUserStatus = async () => {
  //   localStorage.setItem("checkuserstatus", "done")
  //   if(!registerUser){
  //     try {
  //       let res = await checkUser()
  //       // syncAllServices()
  //       dispatch(allServicesSync())
  //       asyncData()
  //       syncLWUserJob()
  //     } catch (error) {
  //       toast.error(error?.response?.data?.message, {
  //         position: toast.POSITION.TOP_RIGHT,
  //       })
  //       clearCookiesAndStorage()
  //       navigate.push(["/login"]);
  //     }
  //   }else{
  //     asyncData()
  //   }
  // }

  // useEffect(async() => {
  //   if (notificationInfo?.updated) {
  //     let savedCards = localStorage.getItem(SETTINGS?.SAVEDCARDS)
  //     !savedCards ? await dispatch(getCards()) : ""
  //   }
  // }, [notificationInfo?.updated])

  // const asyncData = () => {
    // dispatch(isNotificationUpdated("unread")) 
    // syncInvoices()
  // }


  // const syncLWUserJob = async() => {
  //   try{
  //     // await syncUserJob()
  //   }catch(error) {
  //   }
  // }

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div
          className={loader ? "navbar-header overlayerloader" : "navbar-header"}
        >
          <div className="navbar-brand-box">
            <Link to="/" className="logo logo-dark">
              <span className="logo-sm">
                <img src={logoSm} alt="" height="22" />
              </span>
              <span className="logo-lg">
                <img src={logoDark} alt="" height="20" />
              </span>
            </Link>

            <Link to="/" className="logo logo-light">
              <span className="logo-sm">
                <img src={logoSm} alt="" height="22" />
              </span>
              <span className="logo-lg">
                <img src={logoLight} alt="" height="20" />
              </span>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => {
              tToggle()
            }}
            className="btn btn-sm px-3 font-size-16 header-item waves-effect vertical-menu-btn"
            id="vertical-menu-btn"
          >
            <i className="fa fa-fw fa-bars" />
          </button>

          <div className="top-right-content d-flex ml-lg-3">
            <div className="user-content d-flex align-items-center">
              <ProfileMenuHeader />
            </div>
            {path == "/dashboard" || path == "/services" ? (
              <div className="top-center search">
                <div className="app-search d-none d-lg-block p-0">
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control"
                      value={search}
                      placeholder={props.t("Search")}
                      onChange={e => {
                        // handleSearch(e?.target?.value)
                        setsearch(e?.target?.value)
                        handleDebounceVal(e?.target?.value)
                      }}
                    />
                    {!search ? (
                      <span className={"uil-search"}></span>
                    ) : (
                      <span
                        className={"uil-times"}
                        style={{ cursor: "pointer" }}
                        onClick={e => {
                          // handleSearch()
                          handleDebounceVal("")
                          // dashBoardCall0(0)
                          setsearch("")
                        }}
                      ></span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            <div className="d-flex align-items-center">
              <NotificationDropdown
                notificationData={notificationData}
                setNotificationData={setNotificationData}
              />
              {window.location.pathname == "/support" ? (
               supportPermission && <Link
                  className="top-btn new-ticket-services"
                  to={"/support-ticket/1"}
                >
                  <img src={add} />
                  New Ticket
                </Link>
              ) : window.location.pathname.includes("/ticket-view") ? (
                ""
              ) : (
                <Link className="top-btn btn-for-hover" to={"/productslist"}>
                  <img src={top} />
                  Add Service
                </Link>
              )}
            </div>
          </div>
        </div>
          <TextLoader  loader={loader}/>
      </header>
      <ProgressBar loading={loading}/>
    </React.Fragment>
  )
}

Header.propTypes = {
  changeSidebarType: PropTypes.func,
  leftMenu: PropTypes.any,
  leftSideBarType: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  searchData: PropTypes.any,
  toggleLeftmenu: PropTypes.func,
}

const mapStatetoProps = state => {
  const { layoutType, showRightSidebar, leftMenu, leftSideBarType } =
    state.Layout
  return { layoutType, showRightSidebar, leftMenu, leftSideBarType }
}

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
})(withTranslation()(Header))
