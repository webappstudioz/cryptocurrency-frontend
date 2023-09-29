import React, { useEffect, useMemo, useState } from "react";
import { useParams} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
 
import check from "../../assets/images/check-green.svg";
import install from "../../assets/images/install.svg";
 
import { Checkwizard } from "../../components/Common/CommonSvg";
import { WidAppServer, WidIpAddress, WidLocation, WidStatus } from "../../components/Common/Widgets";

  
import header from "../../assets/images/header.svg"
import Line from "../../assets/images/Line.png"

import {
  Col,
  Card,
  Row, 
  CardBody,
} from "reactstrap";

 

function ReinstallWizard4v2() {
  const params = useParams();

  return (
    <React.Fragment>
      <div className="page-content admin-pg wiz">
        <div className="container-fluid">
          <div className="page-header d-flex align-items-center">
            <img src={header} alt="" /> <h3 className="mb-0">rsx3462.redswitches.com</h3>
          </div>
          <div className="server_info">
            <h5 className="info_heding">Server Information: </h5>
            <div className="row">
              <div className="col">
                <WidAppServer></WidAppServer>
              </div>
              <div className="col">
                <WidIpAddress></WidIpAddress>
              </div>
              <div className="col">
                <WidLocation></WidLocation>
              </div>
              <div className="col">
                <WidStatus></WidStatus>
              </div>
            </div>

          </div>
          <div className="wizard-step">
            <Card>
              <CardBody>
                <Row className="header">
                  <Col>
                    <div className="card-header p-0 d-flex align-items-center align-items-center justify-content-center">
                      <div className="header-count orenge-count bg-v2">
                        <Checkwizard />
                      </div>
                      <h6 className="text-blue font-14  font-semibold">Operating System</h6>
                    </div>
                  </Col>
                  <Col className="mx-1">  <span className="line border"></span></Col>
                  <Col>
                    <div className="card-header p-0 d-flex align-items-center align-items-center justify-content-center">
                      <div className="header-count orenge-count bg-v2">
                      <Checkwizard />
                      </div>
                      <h6 className="text-blue font-14  font-semibold">Disk & Raid</h6>
                    </div>
                  </Col>
                  <Col className="mx-1">  <span className="line border"></span></Col>
                  <Col>
                    <div className="card-header p-0 d-flex align-items-center align-items-center justify-content-center">
                      <div className="header-count orenge-count bg-v2">
                      <Checkwizard />
                      </div>
                      <h6 className="text-color font-14  font-semibold">Hostname</h6>
                    </div>
                  </Col>
                  <Col className="mx-1">  <span className="line border"></span></Col>
                  <Col>
                    <div className="card-header p-0 d-flex align-items-center align-items-center justify-content-center">
                      <div className="header-count bg-yellow">
                        <p className="text-white">4</p>
                      </div>
                      <h6 className="text-color font-14  font-semibold">Confirmation</h6>
                      <img className="w-100" src={Line} alt="" />
                    </div>
                  </Col>
                </Row>
                <Row className="wiz-4-content-block">
                  <Col md={4}>
                    <div className="flex-content d-flex align-items-center">
                      <p className="font-16 text-color-v1 font-semibold">Operating System</p>
                      <span className="text-blue font-16 font-normal mx-3">-</span>
                      <p className="font-16 text-color font-normal">Ubuntu 20.04</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="flex-content d-flex align-items-center">
                      <p className="font-16 text-color-v1 font-semibold">Storage</p>
                      <span className="text-blue font-16 font-normal mx-3">-</span>
                      <p className="font-16 text-color font-normal">sx346.redswitches.com  </p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="flex-content d-flex align-items-center">
                      <p className="font-16 text-color-v1 font-semibold">Time Zone</p>
                      <span className="text-blue font-16 font-normal mx-3">-</span>
                      <p className="font-16 text-color font-normal">UTC  </p>
                    </div>
                  </Col>
                </Row>  
                <div className="disk">
                  <p className="text-color-v1 font-16 font-semibold">Disk Partitions:</p>
                    <Row>
                   
                    <Col md={5}>
                    <div className="basic-table">
                      <table className="w-100">
                        <tbody>
                          <tr>
                            <th>Partition Mode</th>
                            <td>Default</td>
                          </tr>
                          <tr>
                            <th>Software Raid Level</th>
                            <td>Raid 0</td>
                          </tr>
                          <tr>
                            <th>Device</th>
                            <td>4x12 TB HDD</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>                      
                    </Col> 
                    <Col md={7}>
                    <div className="basic-table">
                      <table className="w-100">
                        <tbody>
                          <tr>
                            <th>Mount Point</th>
                            <td>/boot</td>
                            <td>/null</td>
                            <td>/temp</td>
                            <td>/</td>
                          </tr>
                          <tr>
                            <th>Type</th>
                            <td>ext4</td>
                            <td>swap</td>
                            <td>ext4</td>
                            <td>ext4</td>
                          </tr>
                          <tr>
                            <th>Size MB</th>
                            <td>1024</td>
                            <td>4096</td>
                            <td>4096</td>
                            <td>*</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>                      
                    </Col>                                   
                    </Row>
                    <Row>
                      <Col md={3}>
                          <div className="footer-label d-flex align-items-center">
                            <p className="mb-0">Power Cycle</p>
                            <img src={check}  alt="" className="d-block" />                     
                            <p className="mb-0 font-normal">Yes</p>
                          </div>
                      </Col>
                      <Col md={3}>
                          <div className="footer-label d-flex align-items-center">
                            <p className="mb-0">Send Email</p>
                            <img src={check}  alt="" className="d-block" />                     
                            <p className="mb-0 font-normal">Yes</p>
                          </div>
                      </Col>
                      <Col md={3}>
                          <div className="footer-label d-flex align-items-center">
                            <p className="mb-0">Bootable</p>
                            <img src={check}  alt="" className="d-block" />                     
                            <p className="mb-0 font-normal">Yes</p>
                          </div>
                      </Col>
                    </Row>
                    <button className="btn btn-primary waves-effect waves-light btn-save font-normal btnv1 btnv2" type="submit"><img  src={install} /> Install </button>
                </div>              
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
export default ReinstallWizard4v2;
