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
// import withdrow from "../../assets/images/withdraw.svg"
// import user2 from "../../assets/images/group1.svg"
import invoice from "../../assets/images/invoice.svg"
import billing from "../../assets/images/billing.svg"
import Announcements from "../../assets/images/Announcements.svg"
import support from "../../assets/images/support.svg"
import sidebar from "../../assets/images/sidebar.svg"
import settings from "../../assets/images/settings.png"
import cloud from "../../assets/images/cloud.png"
import server from "../../assets/images/server.png"

const dashboardRoutes = ["server-management", "reinstall-wizard-1", "reinstall-wizard-2", "reinstall-wizard-3", "reinstall-wizard-4"]
const productslistRoutes = ["product-config", "cart-review", "product-checkout"]
const invoiceRoutes = ["invoice-detail", "invoice-checkout"]
const announcmentRoutes = ["announcmentDetail"]
const supportRoutes = ["ticket-view", "support-ticket"]
const SidebarContent = (props) => {
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
    let newPath = pathName.split("/")
    newPath = newPath[1]
    new MetisMenu("#side-menu")
    let matchingMenuItem = null
    const ul = document.getElementById("side-menu")
    const items = ul.getElementsByTagName("a")
    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
          matchingMenuItem = items[i]
          break
      } else if(dashboardRoutes.find((item) => item === newPath)){
          if(items[i].pathname === "/dashboard"){
            matchingMenuItem = items[i]
          }
      } else if(productslistRoutes.find((item) => item === newPath)){
         if(items[i].pathname === "/productslist"){
            matchingMenuItem = items[i]
          }
      } else if(invoiceRoutes.find((item) => item === newPath)){
          if(items[i].pathname === "/invoice"){
            matchingMenuItem = items[i]
          }
      } else if(announcmentRoutes.find((item) => item === newPath)){
          if(items[i].pathname === "/announcments"){
            matchingMenuItem = items[i]
          }
      } else if(supportRoutes.find((item) => item === newPath)){
        if(items[i].pathname === "/support"){
          matchingMenuItem = items[i]
        }
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
          {/* <li className="menu-title s-title sidebar-title-v2">
              {props.t("Pages")}
            </li> */}
             <li>
              <Link to="/admin/results" className="waves-effect">
                {/* <img src={withdrow} alt="" /> */}
                <span>Store Results</span>
              </Link>
            </li>
             <li>
              <Link to="/add-accounts" className="waves-effect">
                {/* <img src={withdrow} alt="" /> */}
                <span>Add Accounts</span>
              </Link>
            </li>
            <li>
              <Link to="/users-list" className="waves-effect">
                <img src={server} alt="" />
                <span>Users List</span>
              </Link>
            </li>
            <li>
              <Link to="/add-accounts" className="waves-effect">
                <img src={server} alt="" />
                <span>Add Accounts</span>
              </Link>
            </li>
            <li>
              <Link to="/payment-history" className="waves-effect">
                <img src={server} alt="" />
                <span>Payment History</span>
              </Link>
            </li>
            {/* <li>
              <Link to={{ oj: "l" }} className="waves-effect">
                <img src={cloud} alt="" />
                <span>Cloud Servers</span>
              </Link>
            </li> */}
            {/* <li>
              <Link to="/invoice" className="waves-effect">
                <img src={invoice} alt="" />
                <span>{props.t("Invoices")}</span>
              </Link>
            </li> */}
            {/* <li>
              <Link to="/billing" className="waves-effect">
                <img src={billing} alt="" />
                <span>{props.t("Billing")}</span>
              </Link>
            </li> */}
            {/* <li className="menu-title s-title sidebar-title-v2">
              {props.t("HELP")}
            </li> */}
            {/* <li>
              <Link to="/announcments" className=" waves-effect">
                <img src={Announcements} alt="" />
                <span>{props.t("Announcements")}</span>
              </Link>
            </li> */}
            {/* <li>
              <Link to="/security-settings" className=" waves-effect">
                <img src={settings} alt="" />
                <span>{props.t("Settings")}</span>
              </Link>
            </li> */}
            {/* <li>
              <Link to={"/support"} className=" waves-effect">
                <img src={support} alt="" />
                <span>{props.t("Support")}</span>
              </Link>
            </li> */}
          </ul>
          {/* <div className="sidebar_footer px-3">
            <img src={sidebar} className="w-100" alt="" />
            <div className="footer_content text-center mt-3">
              <p className="text-center">
                {" "}
                RedSwitches Pvt Ltd.<br /> Made With {" "}
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
