import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import { loginData } from "../../pages/Authentication/store/apiServices";
import { SETTINGS } from "../../constants/api/api_path";
import { adminRoutes, authRoutes } from "../allRoutes";
import { clearCookiesAndStorage } from "../../helpers/api_helper_rs";
const Authmiddleware = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {
      const info = loginData()
      const authToken = localStorage.getItem(SETTINGS?.AUTHTOKEN)
     
      // if (localStorage.getItem(SETTINGS.AUTHTOKEN) && info?.role === "User" && unProtectedRoutes.includes(pathname)) {
      if (isAuthProtected && !authToken) {
        return (
          <Redirect
            to={{ pathname: "/login" }}
          />
        );
      } else if (!isAuthProtected && authToken && info?.role === "User") {
        return (
          <Redirect
            to={{ pathname: "/dashboard" }}
          />
        );
      } else if (isAuthProtected && authToken && info?.role === "Admin") {

        return (
          <Redirect
            to={{ pathname: "/admin/results" }}
          />
        );
      } else if (isAuthProtected && !info) {
        clearCookiesAndStorage()

        return (
          <Redirect
            to={{ pathname: "/login" }}
          />
        )
      }

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
