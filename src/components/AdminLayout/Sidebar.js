import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";
import SidebarContent from "./SidebarContent";

import logoSm from "../../assets/images/logo-sm.svg";
import logoDark from "../../assets/images/Logo.svg";
import logoLight from "../../assets/images/logo-light.png";
import BillingAddressModal from "../Common/billingAdressModal";
import ProgressBar from "../progressBar";
import { loginData } from "../../pages/Authentication/store/apiServices";
import { storeUserData } from "../../pages/Authentication/store/apiServices";
const Sidebar = props => {
  const [loading, setLoading] = useState("")
  const [openModal, setOpenModal] = useState(false)
  const [role, setRole] = useState()
  useEffect(() => {
    let info = loginData()
    // console.log("role", info?.role)
    setRole("Admin")
    if(info?.role === "client"){
      info?.profile_completed === 0? setOpenModal(true) : setOpenModal(false)
    }
  },[])

  // useEffect(()=>{
  //   // console.log(info)
  //   let data = loginData()
  //   data.profile_completed = 1
  //   storeUserData(data)
  // })

  function tToggle() {
    var body = document.body;
    body.classList.toggle("vertical-collpsed");
    body.classList.toggle("sidebar-enable");
  }

  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div className="navbar-brand-box">
          <Link to="/dashboard" className="logo logo-dark">
            <span className="logo-sm">
              <img src={logoSm} alt="" height="22" />
            </span>
            <span className="logo-lg">
              <img src={logoDark} alt="" height="35" />
            </span>
          </Link>

          <Link to="/" className="logo logo-light">
            <span className="logo-sm">
              <img src={logoSm} alt="" height="22" />
            </span>
            <span className="logo-lg">
              <img src={logoDark} alt="" height="35" />
            </span>
          </Link>
        </div>
        <button
          onClick={() => {
            tToggle();
          }}
          type="button" className="btn btn-sm px-3 font-size-16 header-item waves-effect vertical-menu-btn">
          <i className="fa fa-fw fa-bars"></i>
        </button>
        <div className="sidebar-menu-scroll">
        <SidebarContent role={role}/> 
         {openModal && <BillingAddressModal setLoading={setLoading} openModal={openModal} setOpenModal={setOpenModal}/>}
          {/* {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />} */}
        </div>
      </div>
      <ProgressBar loading={loading}/>
    </React.Fragment>
  );
};

Sidebar.propTypes = {
  type: PropTypes.string,
};

const mapStatetoProps = state => {
  return {
    layout: state.Layout,
  };
};
export default connect(
  mapStatetoProps,
  {}
)(withRouter(withTranslation()(Sidebar)));