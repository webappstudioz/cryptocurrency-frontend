import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import { loginData } from "../../pages/Authentication/store/apiServices";
import { SETTINGS } from "../../constants/api/api_path";
import { authRoutes } from "../allRoutes";
const Adminmiddleware = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {
      // let pathname = "";
      // let unProtectedRoutes = authRoutes?.map((route) => {
      //   return route.path.replace("/", "")
      // })

      // unProtectedRoutes?.splice(0, 1)

      const info = loginData()
      const authToken = localStorage.getItem(SETTINGS?.AUTHTOKEN)
      // if (!authToken) {

      //   let url = window.location.pathname
      //   url = url.split('/')
      //   pathname = url[1]
      // }

      if (isAuthProtected && !authToken) {
        return (
          <Redirect
            to={{ pathname: "/login" }}
          />
        );
      }else if (authToken && info?.role !== "Admin") {
        return (
          <Redirect
            to={{ pathname: "/dashboard" }}
          />
        );
      }
      //  else if (localStorage.getItem(SETTINGS.AUTHTOKEN) && info?.role === "Admin" && unProtectedRoutes.includes(pathname)) {
      //   return (
      //     <Redirect
      //       to={{ pathname: "/admin/results" }}
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

Adminmiddleware.propTypes = {
  isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
};

export default Adminmiddleware;
