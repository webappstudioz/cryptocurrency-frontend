import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import { loginData } from "../../pages/Authentication/store/apiServices";
import { SETTINGS } from "../../constants/api/api_path";

const Adminmiddleware = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  ...rest
}) => (
<Route
    {...rest}
    render={props => {
      // console.log("authtoken",localStorage.getItem(SETTINGS.AUTHTOKEN))
    // if(localStorage.getItem("clientAuth")){
      if(localStorage.getItem(SETTINGS.AUTHTOKEN)){
        return (
            <Layout>
                <Component {...props} />
            </Layout>
        );
    // }else if(localStorage.getItem("authUser")){
    //     return (
    //         <Redirect
    //         to={{ pathname: "/productlist"}}
    //         />
    //     );
    }else{
        return (
            <Redirect
            to={{ pathname: "/login"}}
            />
        );
    }
    }}
  />
);

Adminmiddleware.propTypes = {
  isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
};

export default Adminmiddleware;
