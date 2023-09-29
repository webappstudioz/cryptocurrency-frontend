import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap"
import SimpleBar from "simplebar-react"

//Import images
import avatar3 from "../../../assets/images/users/avatar-3.jpg"
import avatar4 from "../../../assets/images/users/avatar-4.jpg"
import invoicenotification from "../../../assets/images/invoicenotification.svg"

import note from "../../../assets/images/note.svg"
import notei from "../../../assets/images/notei.svg"
import notered from "../../../assets/images/note-red.svg"
import noteired from "../../../assets/images/notei-red.svg"
//i18n
import { withTranslation } from "react-i18next"
import { markAllRead } from "../../../pages/Authentication/store/apiServices"
import { getHoursAgo } from "../../../helpers/api_helper_rs"
import { useDispatch } from "react-redux"
import { notificationUpdatedSuccess, isNotificationUpdated } from "../../../store/auth/notification/action"
import { SETTINGS } from "../../../constants/api/api_path"
import ShoppinBasket from "../../../assets/images/shopping-basket.svg"
const NotificationDropdown = props => {
  // Declare a new state variable, which we'll call "menu"
  const dispatch = useDispatch()
  const [menu, setMenu] = useState(false)
  const [notifications, setNotifications] = useState()

  const markAllAsRead = async () => {
    try {
      let res = await markAllRead()
      if(res){
        setMenu(!menu)
        setNotifications()
        props?.setNotificationData()
        dispatch(notificationUpdatedSuccess())
        localStorage.setItem(SETTINGS?.NOTIFICATION_KEY,"")
      }
    } catch (error) {}
  }

  useEffect(() =>{
    setNotifications(props?.notificationData)
  },[props?.notificationData])

  const markNotificationread = async(id) => {
    try{
      let data = new URLSearchParams({
        notification_id:id
      })
      let res = await markAllRead(data)
      if(res){
        dispatch(isNotificationUpdated("unread"))
      }
    }catch(error){  }
  }
  return (
    <>
      <Dropdown
        isOpen={menu}
        toggle={() => {
          setMenu(!menu)
        }}
        className="dropdown d-inline-block"
        tag="li"
      >
        <DropdownToggle
          className="btn header-item noti-icon waves-effect notification"
          tag="button"
          id="page-header-notifications-dropdown"
        >
          {notifications?.total_records > 0? <span><img className="bell-icon"  src={notered} /> <sup className="bell-sup" >{notifications?.total_records}</sup></span>  : <img className="bell-icon"  src={note} />}
          {/* <span className="badge bg-danger rounded-pill">
            <img className="bell-icon" src={notei} />{notifications?.total_records > 0?<sup className="bell-sup">{notifications?.total_records} </sup> : ""}
          </span> */}
        </DropdownToggle>

        <DropdownMenu
          className="dropdown-menu-lg dropdown-menu-end p-0"
          style={{ margin: 0 }}
        >
          <div className="p-3 notification-header">
            <Row className="align-items-center">
              <Col>
                <h6 className="m-0 font-size-16">
                  {" "}
                  {props.t("Notifications")}{" "}
                </h6>
              </Col>
              <div className="col-auto">
                <a
                  onClick={markAllAsRead}
                  className="small"
                  style={{ cursor: "pointer" }}
                >
                  {" "}
                  Mark all as read
                </a>
              </div>
            </Row>
          </div>

          <SimpleBar className="notification-dropdown-list"> 
            {/* style={{ height: "230px" }} */}
            {notifications?.notifications?.length? notifications?.notifications?.map((notification, index) => {
                let time = getHoursAgo(notification?.time, notification?.currentTime)
                let path = ""
                if(notification?.rel === "serviceid") {
                  path = `/dashboard`
                    if(notification?.relid){
                      path = `/server-management/${notification?.relid}`
                    }
                }else if(notification?.rel === "invoiceid" && notification?.relid) {
                  path = `/invoice-detail/${notification?.relid}`
                } else {
                  path = `/invoice`
                }
                return (
                  <Link
                    to={path}
                    className="text-reset notification-item"
                    key={index}
                    onClick={() => {markNotificationread(notification?.id)}}
                  >
                    <div className="d-flex align-items-start">
                      <div className="avatar-xs me-3">
                        <span className="avatar-title bg-primary rounded-circle font-size-16">
                          {/* <i className="uil-shopping-basket"></i> */}
                          {notification?.rel === "serviceid"? 
                          <img src={ShoppinBasket} alt="" style={{width: "100%"}}/> : <img className="test-img" src={invoicenotification} alt="" />
}
                        </span>
                      </div>
                      <div className="flex-1 notification-content">
                        <h6 className="mt-0 mb-1">{notification?.subject}</h6>
                        <div className="font-size-12 text-muted">
                          <p className="mb-1">
                            {notification?.description?.length > 55
                              ? `${notification?.description.substring(
                                  0,
                                  55
                                )}.....`
                              : notification?.description}
                          </p>
                          <p className="mb-0">
                            <i className="mdi mdi-clock-outline"></i> {time} ago{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
            }) : 
                <div className="d-flex align-items-start justify-content-center" >
                  <div className="flex-1 ">
                    <div className="font-size-12 text-muted">
                      <p className="my-3 no-notification">
                        There is no notifications.
                      </p>
                    </div>
                  </div>
                </div>
              }
            
            {/* <Link to={{dssd:"dsa"}} className="text-reset notification-item">
              <div className="d-flex align-items-start">
                <img
                  src={avatar3}
                  className="me-3 rounded-circle avatar-xs"
                  alt="user-pic"
                />
                <div className="flex-1">
                  <h6 className="mt-0 mb-1">James Lemire</h6>
                  <div className="font-size-12 text-muted">
                    <p className="mb-1">
                      {props.t("It will seem like simplified English") + "."}
                    </p>
                    <p className="mb-0">
                      <i className="mdi mdi-clock-outline"/>
                      {props.t("1 hours ago")}{" "}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
            <Link to={{dssd:"dsa"}} className="text-reset notification-item">
              <div className="d-flex align-items-start">
                <div className="avatar-xs me-3">
                  <span className="avatar-title bg-success rounded-circle font-size-16">
                    <i className="bx bx-badge-check"/>
                  </span>
                </div>
                <div className="flex-1">
                  <h6 className="mt-0 mb-1">
                    {props.t("Your item is shipped")}
                  </h6>
                  <div className="font-size-12 text-muted">
                    <p className="mb-1">
                      {props.t("If several languages coalesce the grammar")}
                    </p>
                    <p className="mb-0">
                      <i className="mdi mdi-clock-outline"/>{" "}
                      {props.t("3 min ago")}
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link to={{dssd:"dsa"}} className="text-reset notification-item"> 
              <div className="d-flex align-items-start">
                <img
                  src={avatar4}
                  className="me-3 rounded-circle avatar-xs"
                  alt="user-pic"
                />
                <div className="flex-1">
                  <h6 className="mt-0 mb-1">Salena Layfield</h6>
                  <div className="font-size-12 text-muted">
                    <p className="mb-1">
                      {props.t(
                        "As a skeptical Cambridge friend of mine occidental"
                      ) + "."}
                    </p>
                    <p className="mb-0">
                      <i className="mdi mdi-clock-outline"/>
                      {props.t("1 hours ago")}{" "}
                    </p>
                  </div>
                </div>
              </div>
            </Link>*/}
          </SimpleBar>
          <div className="p-2 border-top d-grid">
            <Link
              className="btn btn-sm btn-link font-size-14 text-center"
              to="/notification"
            >
              <i className="uil-arrow-circle-right me-1"></i>{" "}
              {props.t("View all")}{" "}
            </Link>
          </div>
        </DropdownMenu>
      </Dropdown>
    </>
  )
}

export default withTranslation()(NotificationDropdown)

NotificationDropdown.propTypes = {
  t: PropTypes.any,
}
