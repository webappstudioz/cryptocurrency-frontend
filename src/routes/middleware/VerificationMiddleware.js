import React, { useEffect }  from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

const Authmiddleware = ({
  component: Component,
  isAuthProtected,
  ...rest
}) => (

  <Route
    {...rest}
    render={props => {
      // if (isAuthProtected && !localStorage.getItem("jwt")) {
        if (isAuthProtected) {
        return (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        );
      } 
      return (
          <Component {...props} />
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
