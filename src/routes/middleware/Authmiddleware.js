import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import { loginData } from "../../pages/Authentication/store/apiServices";

const Authmiddleware = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {
      let pathname = "";
      let id = "";
      let info = loginData()
     if(!localStorage.getItem("authUser")){

     let url = window.location.pathname
      url = url.split('/')
       pathname = url[1]
       id = url[2]
     }

      
      // if(pathname === 'invoice-detail' && id && !localStorage.getItem("authUser")){
      //   return (
      //     <Redirect to={{
      //       pathname: "/login",
      //       state: {
      //         invoiceid: id
      //       }
      //     }}/>
      //   )
      // } else if (isAuthProtected && !localStorage.getItem("authUser")) {
      //   return (
      //     <Redirect
      //       to={{ pathname: "/productlist", state: { from: props.location } }}
      //     />
      //   );
      // } else if(localStorage.getItem("authUser") && props?.location.pathname == "/login" ){
      //   return (
      //     <Redirect
      //       to={{ pathname: "/dashboard"}}
      //     />
      //   );
      // } else if(localStorage.getItem("authUser") && props?.location.pathname != "/dashboard" && info?.profile_completed === 0 && props?.location.pathname !="/product-checkout"){
      //   return (
      //     <Redirect
      //       to={{ pathname: "/dashboard"}}
      //     />
      //   );
      // }
   
      return (
        <Layout>
          <Component {...props} />
        </Layout>
      );
    }}
  />
);

Authmiddleware.propTypes = {
  isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
};

export default Authmiddleware;
