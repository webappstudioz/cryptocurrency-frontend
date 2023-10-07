import React, { useState, useEffect } from "react"
import OtpInput from "react-otp-input"
import { Container, Row, Col, Card, CardBody, Modal, Form } from "reactstrap"

// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"

//redux
import { withRouter } from "react-router-dom"

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb"

import close from "../../assets/images/close-fill.svg"
import insurance from "../../assets/images/insurance.svg"
import {
  getQRCode,
  getUserInfo,
  getClientInfo,
  userRole,
} from "./store/apiServices"
import { verify2FCode, disable2FAAuth } from "./store/apiServices"
import { toast } from "react-toastify"
import TextLoader from "../../components/textLoader"
import Warning from "../../assets/images/warning.png"
import { setPageTitle } from "../../helpers/api_helper_rs"

const SecuritySettings = props => {
  const [modal_center, setmodal_center] = useState(false)
  const [modal_verified, setmodal_verified] = useState(false)
  const [disableModal, setDisableModal] = useState(false)
  const [qr, setQr] = useState()
  const [seceretId, setSecretId] = useState()
  const [code, setCode] = useState("")
  const [loader, setLoader] = useState(true)
  const [loading, setLoading] = useState(0)
  const [disableButton, setDisableButton] = useState()
  const [role, setRole] = useState()
  const [spinner, setSpinner] = useState({enable:false, next:false, disable:false})
  const [action, setAction] = useState(true)
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {},
    validationSchema: Yup.object({}),

    onSubmit: async () => {
      setSpinner({next:true})
      setAction(true)
      try {
        let data = new URLSearchParams({
          two_factor_code: code,
        })
        let res = await verify2FCode(data)
        toast.success(res?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        setSpinner({next:false})
        setAction(false)
        setDisableButton(true)
        setCode("")
        setmodal_center(!modal_center)
        setmodal_verified(!modal_verified)
        handleClientInfo()
      } catch (error) {
        toast.error(error?.response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        setSpinner({next:false})
        setCode("")
        setAction(false)
      }
    },
  })

  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }

  const tog_center = async () => {
    setSpinner({enable:true})
    setAction(true)
    try {
      let res = await getQRCode()
      setSecretId(res?.data?.data?.secret)
      setQr(res?.data?.data?.qr)
      setSpinner({enable:false})
      setAction(false)
    } catch (error) {
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      })
      setSpinner({enable:false})
      setAction(false)
    }
    setmodal_center(!modal_center)
    removeBodyCss()
  }

  function tog_verified() {
    setmodal_verified(!modal_verified)
    removeBodyCss()
  }

  const handleChange = code => {
    setCode(code)
  }

  const disableTwoFA = async () => {
    setAction(true)
    try {
      let res = await disable2FAAuth()
      setDisableModal(false)
      setDisableButton(false)
      setSpinner({disable:false})
      setAction(false)
      toast.success(res?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      })
      let user = ""
      role === "client"
        ? (user = await handleClientInfo())
        : (user = await handleuserInfo())
    } catch (error) {
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      })
      setDisableModal(false)
      setSpinner({disable:false})
      setAction(false)
    }
  }

  useEffect(async () => {
    setPageTitle("Security Settings")
    disableModal ? setSpinner(false) : ""
    let user = ""
    let roleinfo = userRole()
    setRole(roleinfo)
    roleinfo === "client"? (user = await handleClientInfo()) : (user = await handleuserInfo())
    user?.two_factor? (setDisableButton(true), setLoader(false), setAction(false)) : (setDisableButton(false), setLoader(false), setAction(false))
  }, [disableModal])

  const handleuserInfo = async () => {
    try {
      let res = await getUserInfo()
      return res?.data?.data
    } catch (error) {}
  }

  const handleClientInfo = async() => {
    try{
      let res = await getClientInfo()
      return res?.data?.data
    } catch(error){}
  }

  return (
    <React.Fragment>
      <div
        className={loader ? "account-pages overlayerloader" : "page-content"}
      >
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumb title="Minible" breadcrumbItem="Security Settings" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <div className="security_content">
                    <div className="header mb-20">
                      <h6 className="font-16 font-semibold">
                        Two- Factor Authentication
                      </h6>
                      <p className="font-small">
                        We recommend enabling Two-Factor authentication to
                        provide an extra layer of security to your account.
                      </p>
                    </div>
                    <div className="other-content">
                      <p className="font-small">
                        Two-Factor Authentication is currently{" "}
                        <span className="font-semibold">
                          {disableButton ? "Enabled" : "Disabled"}
                        </span>
                        .
                      </p>
                      {disableButton ? (
                        <button
                          disabled={action}
                          type="button"
                          className="btn btn-danger waves-effect waves-light btn-disable"
                          onClick={() => {
                            setDisableModal(true), setSpinner({disable:true})
                          }}
                          data-toggle="modal"
                          data-target=".bs-example-modal-center"
                        >
                          Click here to Disable
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-danger waves-effect waves-light btn-green enable-two-factor"
                          onClick={() => {
                            tog_center()
                          }}
                          data-toggle="modal"
                          data-target=".bs-example-modal-center"
                          disabled={action}
                        >
                         {spinner?.enable?(
                            <div className="ui active inline loader"></div>
                          ): "Click here to Enable"} 
                        </button>
                      )}
                      <Modal
                        isOpen={modal_center}
                        toggle={() => {
                          tog_center()
                        }}
                        centered={true}
                      >
                        <div className="modal-header">
                          <Row className="w-100">
                            <Col xs="11">
                              <h5 className="modal-title mt-0">
                                Two-Factor Authentication
                              </h5>
                            </Col>
                            <Col xs="1">
                              <button
                                type="button"
                                onClick={() => {
                                  setmodal_center(false)
                                  setCode("")
                                }}
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                              >
                                <span aria-hidden="true">
                                  {" "}
                                  <img src={close} alt="" />
                                </span>
                              </button>
                            </Col>
                          </Row>
                        </div>
                        <div className="modal-body two-factor">
                          <div className="inner-content">
                            <h6 className="text-black-v1 font-16  font-semibold">
                              Set up two-factor authentication
                            </h6>
                            <p className="text-black-v2 font-small font-normal center-content">
                              Scan this QR code with your Google, Microsoft or
                              any Authenticator App and enter the verification
                              code below.
                            </p>
                          </div>
                          <p className="text-black-v2 font-small font-normal">
                            Having trouble scanning the code? Please enter the
                            code manually:{" "}
                            <span className="text-blue font-semibold">
                              {seceretId}
                            </span>
                          </p>
                          <div className="qr-code text-center">
                            <img src={qr} alt="" />
                          </div>
                          <div className="form-content">
                            <p className="font-16 text-blue font-semibold">
                              Verification Code
                            </p>
                            <Form
                              className="form-horizontal digit-form"
                              onSubmit={e => {
                                e.preventDefault()
                                validation.handleSubmit()
                                return false
                              }}
                            >
                              <div className=" form-g position-relative w-100 input-group d-flex align-items-center two-factor-form">
                                <OtpInput
                                  value={code}
                                  onChange={handleChange}
                                  numInputs={6}
                                  separator={
                                    <span style={{ width: "8px" }}></span>
                                  }
                                  isInputNum={true}
                                  shouldAutoFocus={true}
                                  inputStyle={{
                                    border: "1px solid #EFEFF2",
                                    borderRadius: "12px",
                                    width: "55px",
                                    height: "55px",
                                    fontSize: "20px",
                                    color: "#000",
                                    fontWeight: "600",
                                    caretColor: "#3F3D65",
                                  }}
                                  focusStyle={{
                                    border: "1px solid #285a3d",
                                    outline: "none",
                                    boxShadow: "0px 12px 16px #285a3d0f",
                                    borderRadius: "12px",
                                  }}
                                ></OtpInput>
                              </div>
                            
                              <button
                                className="btn btn-primary w-100 waves-effect waves-light d-flex justify-content-center align-items-center"
                                type="submit"
                                disabled={
                                  code == "" || code.length != 6 ? true : false || action
                                }
                              >
                                {spinner?.next?(
                                  <div className="ui active inline loader"></div>
                               ): "Next"}
                              </button>
                            </Form>
                          </div>
                        </div>
                      </Modal>
                      <Modal
                        isOpen={modal_verified}
                        toggle={() => {
                          tog_verified()
                        }}
                        centered={true}
                      >
                        <div className="modal-header">
                          <Row className="w-100">
                            <Col xs="11">
                              <h5 className="modal-title mt-0">
                                Two-Factor Authentication
                              </h5>
                            </Col>
                            <Col xs="1">
                              <button
                                type="button"
                                onClick={() => {
                                  setmodal_verified(false)
                                }}
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                              >
                                <span aria-hidden="true">
                                  {" "}
                                  <img src={close} alt="" />
                                </span>
                              </button>
                            </Col>
                          </Row>
                        </div>
                        <div className="modal-body two-factor verify">
                          <div className="img_block text-center">
                            <img src={insurance} alt="" />
                          </div>
                          <h6 className="font-bold text-blue text-center">
                            Two-Factor Authentication Verified
                          </h6>
                          <button
                            className="btn btn-primary w-100 waves-effect waves-light d-flex justify-content-center align-items-center"
                            type="button"
                            onClick={() => {
                              setmodal_verified(false)
                            }}
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            Close
                          </button>
                        </div>
                      </Modal>
                      <Modal isOpen={disableModal} centered={true}>
                        <div className="modal-header">
                          <Row className="w-100">
                            <Col xs="11">
                              <h5 className="modal-title mt-0">
                                Two-Factor Authentication
                              </h5>
                            </Col>
                            <Col xs="1">
                              <button
                                disabled={action}
                                type="button"
                                onClick={() => {
                                  setDisableModal(false)
                                }}
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                              >
                                <span aria-hidden="true">
                                  {" "}
                                  <img src={close} alt="" />
                                </span>
                              </button>
                            </Col>
                          </Row>
                        </div>
                        <div className="modal-body two-factor verify">
                          <div className="img_block text-center">
                            <img src={Warning} alt="" />
                          </div>
                          <h6 className="font-bold text-blue text-center">
                            Are you sure to disable Two-Factor Authentication
                          </h6>
                          <div className="factor-disable-btn">
                            <button
                              disabled={action}
                              className="btn btn-danger waves-effect waves-light btn-green"
                              type="button"
                              onClick={() => {
                                disableTwoFA()
                                setSpinner({disable:true})
                              }}
                              data-dismiss="modal"
                              aria-label="Close"
                            >
                              {spinner?.disable?(
                                  <div className="ui active inline loader"></div>
                               ): "Disable"}
                            </button>
                            <button
                              disabled={action}
                              className="btn btn-danger waves-effect waves-light btn-disable"
                              type="button"
                              onClick={() => {
                                setDisableModal(false)
                              }}
                              data-dismiss="modal"
                              aria-label="Close"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </Modal>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <TextLoader loader={loader} loading={action}/>
      </div>
    </React.Fragment>
  )
}

export default withRouter(SecuritySettings)
