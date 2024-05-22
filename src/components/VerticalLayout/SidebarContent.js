import PropTypes from "prop-types"
import React, { useCallback, useEffect, useRef } from "react"

// //Import Scrollbar
import SimpleBar from "simplebar-react"

// MetisMenu
import MetisMenu from "metismenujs"
import { withRouter } from "react-router-dom"
import { Link } from "react-router-dom"

//i18n
import { withTranslation } from "react-i18next"
import overview from "../../assets/images/overview.svg"
import invoice from "../../assets/images/invoice.svg"
import billing from "../../assets/images/billing.svg"
import Announcements from "../../assets/images/Announcements.svg"
import support from "../../assets/images/support.svg"
import sidebar from "../../assets/images/sidebar.svg"
import settings from "../../assets/images/settings.png"
import cloud from "../../assets/images/cloud.png"
import server from "../../assets/images/server.png"
const SidebarContent = props => {
  const ref = useRef()
  
  const activateParentDropdown = useCallback(item => {
    item.classList.add("active")
    const parent = item.parentElement
    const parent2El = parent.childNodes[1]
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show")
    }

    if (parent) {
      parent.classList.add("mm-active")
      const parent2 = parent.parentElement

      if (parent2) {
        parent2.classList.add("mm-show") // ul tag

        const parent3 = parent2.parentElement // li tag

        if (parent3) {
          parent3.classList.add("mm-active") // li
          parent3.childNodes[0].classList.add("mm-active") //a
          const parent4 = parent3.parentElement // ul
          if (parent4) {
            parent4.classList.add("mm-show") // ul
            const parent5 = parent4.parentElement
            if (parent5) {
              parent5.classList.add("mm-show") // li
              parent5.childNodes[0].classList.add("mm-active") // a tag
            }
          }
        }
      }
      scrollElement(item)
      return false
    }
    scrollElement(item)
    return false
  }, [])

  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    const pathName = props.location.pathname

    new MetisMenu("#side-menu")
    let matchingMenuItem = null
    const ul = document.getElementById("side-menu")
    const items = ul.getElementsByTagName("a")
    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i]
        break
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem)
    }
  }, [props.location.pathname, activateParentDropdown])

  useEffect(() => {
    ref.current.recalculate()
  })

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300
      }
    }
  }

  return (
    <React.Fragment>
      <SimpleBar style={{ height: "100%" }} ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li>
              <Link to="/my-account" className="waves-effect">
                <img src={overview} alt="" />
                <span>My Profile</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="waves-effect">
                <img src={overview} alt="" />
                <span>Dashboard</span>
              </Link>
            </li>

            <li>
              <Link to="/playandwin" className="waves-effect">
                <img src={overview} alt="" />
                <span>Play & Win</span>
              </Link>
            </li>
            {/* <li className="menu-title s-title sidebar-title-v2">
              {props.t("Accounts")}
            </li> */}
            <li>
              <Link to="/deposite-funds" className="waves-effect">
                <img src={overview} alt="" />
                <span>Deposit</span>
              </Link>
            </li>
            <li>
              <Link to="/witdraw-funds" className="waves-effect">
                <img src={overview} alt="" />
                <span>Withdraw</span>
              </Link>
            </li>
            <li>
              <Link to="/transfer-funds" className="waves-effect">
                <img src={overview} alt="" />
                <span>Transfer</span>
              </Link>
            </li>
            <li>
              <Link to="/payment-history" className="waves-effect">
                <img src={overview} alt="" />
                <span>Payment History</span>
              </Link>
            </li>
            {/* <li>
              <Link to="/billing" className="waves-effect">
                <img src={billing} alt="" />
                <span>{props.t("Add Funds")}</span>
              </Link>
            </li> */}
            {/* <li>
              <Link to="/" className="waves-effect">
                <img src={invoice} alt="" />
                <span>{props.t("Invite User")}</span>
              </Link>
            </li> */}
            {/* <li className="menu-title s-title sidebar-title-v2">
              {props.t("Partner")}
            </li> */}
            <li>
              <Link to="#" className="waves-effect">
                <img src={overview} alt="" />
                <span>My Team</span>
              </Link>
            </li> 
            {/* <li className="menu-title s-title sidebar-title-v2">
              {props.t("HELP")}
            </li>  */}

            {/* <li>
              <Link to="/announcment" className=" waves-effect">
                <img src={Announcements} alt="" />
                <span>{props.t("Announcements")}</span>
              </Link>
            </li>
            <li>
              <Link to="/security-settings" className=" waves-effect">
                <img src={settings} alt="" />
                <span>{props.t("Settings")}</span>
              </Link>
            </li> */}
            {/* <li>
              <Link to={"/support"} className=" waves-effect">
                <img src={support} alt="" />
                <span>{props.t("Supports")}</span>
              </Link>
            </li> */}
          </ul>
          {/* <div className="sidebar_footer px-3">
            <img src={sidebar} className="w-100" alt="" />
            <div className="footer_content text-center mt-3">
              <p className="text-center">
                {" "}
                RedSwitches Pvt Ltd. Made With <br />{" "}
                <i className="mdi mdi-heart text-danger"></i> In Melbourne
              </p>
            </div>
          </div> */}
        </div>
      </SimpleBar>
    </React.Fragment>
  )
}

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
}

export default withRouter(withTranslation()(SidebarContent))
