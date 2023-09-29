import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap"

//i18n
import { withTranslation } from "react-i18next"
// Redux
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import { ManageI } from "../../Common/CommonSvg"
import manage1 from ".././../../assets/images/manage1.png"
import manage2 from ".././../../assets/images/manage2.png"
import manage4 from ".././../../assets/images/manage4.png"

const ProfileMenu = props => {
  // Declare a new state variable, which we'll call "menu"
  const { toggleModal } = props
  const [menu, setMenu] = useState(false)

  const [username, setusername] = useState("manage")

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        const obj = JSON.parse(localStorage.getItem("authUser"))
        setusername(obj.displayName)
      } else if (
        process.env.REACT_APP_DEFAULTAUTH === "fake" ||
        process.env.REACT_APP_DEFAULTAUTH === "jwt"
      ) {
        const obj = JSON.parse(localStorage.getItem("authUser"))
        if (obj.username) {
          setusername(obj.username)
        } else {
          setusername(obj.name)
        }
      }
    }
  }, [props.success])

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ]

  const [modal_backdrop, setmodal_backdrop] = useState(false)

  function tog_backdrop() {
    // setmodal_backdrop(!modal_backdrop)
    // removeBodyCss()
    toggleModal()
  }

  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item waves-effect btn-manage"
          id="page-header-user-dropdown"
          tag="button"
        >
          <ManageI />
          <span className="d-none d-xl-inline-block ms-1 fw-medium font-size-15">
            manage
          </span>{" "}
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag="a" href="/profile">
            {" "}
            <img src={manage1} alt="" />
            {props.t("Reboot")}{" "}
          </DropdownItem>
          <DropdownItem tag="a" href="/">
            <img src={manage2} alt="" />
            {props.t("OS Reinstall")}
          </DropdownItem>
          <DropdownItem tag="a" href="#">
            <button
              type="button"
              className="btn btn-primary waves-effect waves-light"
              onClick={() => {
                tog_backdrop()
              }}
              data-toggle="modal"
            >
              Static backdrop modal sdvasv
            </button>
          </DropdownItem>
          <DropdownItem tag="a" href="auth-lock-screen">
            <img src={manage4} alt="" />
            {props.t("Cancel Server")}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  )
}

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any,
}

const mapStatetoProps = state => {
  const { error, success } = state.Profile
  return { error, success }
}

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
)
