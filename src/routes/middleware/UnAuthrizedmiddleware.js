import React from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";

const UnAuthrizedmiddleware = ({
  component: Component,
  layout: UnAuthLayout,
  isAuthProtected,
  ...rest
}) => (

  <Route
    {...rest}
    render={props => {
      return (
          <UnAuthLayout>
              <Component {...props} />
          </UnAuthLayout>
      );
    }}
  />
);

UnAuthrizedmiddleware.propTypes = {
  isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
};

export default UnAuthrizedmiddleware;
