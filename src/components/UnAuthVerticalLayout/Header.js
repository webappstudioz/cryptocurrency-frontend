import PropTypes from "prop-types"
import React, { useState } from "react"

import { connect } from "react-redux"
import { Link } from "react-router-dom"

// Import menuDropdown
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown"

import logoSm from "../../assets/images/logo-sm.png"
import logoDark from "../../assets/images/logo-dark.png"
import logoLight from "../../assets/images/logo-light.png"

//i18n
import { withTranslation } from "react-i18next"
// Redux Store
import {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
} from "../../store/actions"

const Header = props => {
  const [notificationData, setNotificationData] = useState()
  const [loader, setLoader] = useState(false)

  function tToggle() {
    var body = document.body
    body.classList.toggle("vertical-collpsed")
    body.classList.toggle("sidebar-enable")
  }

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

          <div className="user-content d-flex align-items-center signin-button">
            <Link className="top-btn" to={"/login"}>
              Signin
            </Link>
            <Link className="top-btn" to={"/register"}>
              Signup
            </Link>
          </div>
          <div className="d-none">
          <NotificationDropdown
            notificationData={notificationData}
            setNotificationData={setNotificationData}
          /></div>
        </div>
      </header>
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
