import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
 
 

import {
  Col,
  Row,
  Card,
  CardBody,
} from "reactstrap";




function Pages() {
  return (
    <React.Fragment>
      <div className="page-content ">
        <div className="container-fluid">
          <Card>
            <CardBody>
              <Row>
                <Col md="3">
                  <Link target="_blank" to="/dashboard" className="page_link w-100 mb-4">Dashboard-Home Page</Link>
                </Col>
                <Col md="3">
                  <Link target="_blank" to="/product" className="page_link w-100 mb-4">Product/Service List Page</Link>
                </Col>
                <Col md="3">
                  <Link target="_blank" to="/server-management" className="page_link w-100 mb-4">Server Management</Link>
                </Col>
                <Col md="3">
                  <Link target="_blank" to="/invoice" className="page_link w-100 mb-4">Invoice</Link>
                </Col>
                <Col md="3">
                  <Link target="_blank" to="/reinstall-wizard-1" className="page_link w-100 mb-4">Reinstall Wizard_1</Link>
                </Col>
                <Col md="3">
                  <Link target="_blank" to="/reinstall-wizard-2" className="page_link w-100 mb-4">Reinstall Wizard_2</Link>
                </Col>
                <Col md="3">
                  <Link target="_blank" to="/reinstall-wizard-3" className="page_link w-100 mb-4">Reinstall Wizard_3</Link>
                </Col>
                <Col md="3">
                  <Link target="_blank" to="/reinstall-wizard-4" className="page_link w-100 mb-4">Reinstall Wizard_4</Link>
                </Col>
                <Col md="3">
                  <Link target="_blank" to="/reinstall-wizard-4/v2" className="page_link w-100 mb-4">Reinstall Wizard_4/V2</Link>
                </Col>
                <Col md="3">
                  <Link target="_blank" to="/user-account-detail" className="page_link w-100 mb-4">User Account Details</Link>
                </Col>
                <Col md="3">
                  <Link target="_blank" to="/payment" className="page_link w-100 mb-4">Payment</Link>
                </Col>
              </Row>

            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Row>
                <Col md="3">
                  <Link target="_blank" to="/register" className="page_link w-100 mb-4">Signup</Link>
                </Col>
                <Col md="3">
                  <Link target="_blank" to="/email-verify" className="page_link w-100 mb-4">Email verification</Link>
                </Col>
                <Col md="3">
                  <Link target="_blank" to="/login" className="page_link w-100 mb-4">Signin</Link>
                </Col>
                <Col md="3">
                  <Link target="_blank" to="/forgot-password" className="page_link w-100 mb-4">Forgot Password</Link>
                </Col>
                <Col md="3">
                  <Link target="_blank" to="/reset-password" className="page_link w-100 mb-4">Password Reset Confirmation</Link>
                </Col>
                <Col md="3">
                  <Link target="_blank" to="/login-suspended" className="page_link w-100 mb-4">Account Suspended</Link>
                </Col>
                <Col md="3">
                  <Link target="_blank" to="/Verification" className="page_link w-100 mb-4">2 - Step Verification</Link>
                </Col>
                <Col md="3">
                  <Link target="_blank" to="/change-password" className="page_link w-100 mb-4">Change Password</Link>
                </Col>
                <Col md="3">
                  <Link target="_blank" to="/my-account" className="page_link w-100 mb-4">My Account</Link>
                </Col>
                <Col md="3">
                  <Link target="_blank" to="/user-management" className="page_link w-100 mb-4">User management</Link>
                </Col>
                <Col md="3">
                  <Link target="_blank" to="/user-management/v2" className="page_link w-100 mb-4">User management 2</Link>
                </Col>
                <Col md="3">
                  <Link target="_blank" to="/billing" className="page_link w-100 mb-4"> Billings</Link>
                </Col>
                <Col md="3">
                  <Link target="_blank" to="/notification" className="page_link w-100 mb-4">Notifications</Link>
                </Col>
                <Col md="3">
                  <Link target="_blank" to="/security-settings" className="page_link w-100 mb-4">Security settings</Link>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </div>
      </div>

    </React.Fragment>
  );
}
Pages.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default Pages;
