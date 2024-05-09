import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import { loginData } from "../../pages/Authentication/store/apiServices";
import { SETTINGS } from "../../constants/api/api_path";
import { authRoutes } from "../allRoutes";
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
      let unProtectedRoutes = authRoutes?.map((route) => {
        return route.path.replace("/", "")
      })

      unProtectedRoutes?.splice(0, 1)

      let info = loginData()
      if (!localStorage.getItem("authUser")) {

        let url = window.location.pathname
        url = url.split('/')
        pathname = url[1]
      }

      if (localStorage.getItem(SETTINGS.AUTHTOKEN) && info?.role === "User" && unProtectedRoutes.includes(pathname)) {
        return (
          <Redirect
            to={{ pathname: "/dashboard" }}
          />
        );
      } else if (localStorage.getItem(SETTINGS.AUTHTOKEN) && info?.role === "Admin" && unProtectedRoutes.includes(pathname)) {
        return (
          <Redirect
            to={{ pathname: "/admin/results" }}
          />
        );
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
