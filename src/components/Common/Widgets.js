import React, { useState } from "react"
import { Row, Col } from "reactstrap"
import { ServerIcon3 } from "./CommonSvg"
import { ServerIcon4 } from "./CommonSvg"
import { ServerIcon2 } from "./CommonSvg"
import { Invoice, Ticket, Balance } from "./CommonSvg"
import ip from "../../assets/images/base.png"
import edit from "../../assets/images/table-edit.svg"
import { useFormik } from "formik"
import { customRegex } from "../../helpers/validation_helpers"
import { Form, FormFeedback, Input } from "reactstrap"
import * as Yup from "yup"
import rederror from "../../assets/images/redvalidationicon/rederror.jpg"
import { toast } from "react-toastify"

export function WidAppServer(props) {
  const { domain = null, model } = props
  const [editHostname, setEditHostname] = useState(false)
  const [hostname, setHostName] = useState("RSX.1235")
  
  const hostNameEdit = useFormik(({
    enableReinitialize: true,

    initialValues: {
      hostName: hostname || ""
    },

    validationSchema: () => {
       let schema = Yup.object().shape({
        hostName: Yup.string()
          // .required("Please enter hostname")
          .matches(customRegex.hostNameRegex1, "invalid hostname.")
          .max(10,"The Hostname can't be longer than 10 characters.")
      })
      return schema
    },
    onSubmit: async(values) => {
      setHostName(values.hostName || hostname)
      setEditHostname(false)
      // try{
      //   let data = new URLSearchParams({
      //     hostname: ""
      //   })
      //   let res = await ""
      //   if(res){
      //     toast.success("message",{position: toast.POSITION.TOP_RIGHT})
      //   }
      // }catch(error){
      //   console.log("error", error)
      //   toast.error("message", {position: toast.POSITION.TOP_RIGHT,})
      // }
    }
  }))

  return (
    <>
      <div className="info_block mb-4 mb-lg-0">
        <div className="icon_img">
          <ServerIcon2 />
        </div>
        <div className="info_content">
          <div className="info_flex">
            <Row className="align-items-center">
              <Col md="12">
                {/* <p>Application Server</p> */}
                <p>Hostname</p>
              </Col>
            </Row>
          </div>
          <div className="block-content">
            {!editHostname? 
              <h6>{model ? model.toLowerCase() : hostname.toLowerCase()}.redswitches.net </h6> : 
              <Form
                onSubmit={(e) =>{
                  e.preventDefault()
                  hostNameEdit.handleSubmit()
                  return false
                }}>
                <Input 
                  name="hostName" 
                  type="text"
                  placeholder="rsx.1235.redswitches.net"
                  onChange={hostNameEdit.handleChange}
                  onBlur={() => {!hostNameEdit.errors.hostName && hostNameEdit.handleSubmit()}}
                  value={hostNameEdit.values.hostName || ""}
                  invalid={
                    // hostNameEdit.touched.hostName &&
                      hostNameEdit.errors.hostName
                      ? true
                      : false
                  }
                /> <h6>.redswitches.net</h6>
                {
                // hostNameEdit.touched.hostName &&
											hostNameEdit.errors.hostName ? (
											<>
												<FormFeedback type="invalid" className="info-modal">
													<img
														className="form-error-icon"
														src={rederror}
														alt=""
														height={15}
													/>
													{hostNameEdit.errors.hostName}
												</FormFeedback>
											</>
										) : null}
              </Form>}
            {/* <img src={edit} /> */}
            <span >
              {!editHostname? 
                <img src={edit} onClick={() => {hostNameEdit.resetForm(),setEditHostname(!editHostname)}}/> 
                : null
                // <button onClick={() => {!hostNameEdit.errors.hostName && hostNameEdit.handleSubmit()}}>save</button>
              }
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export function WidServer(props) {
  const { servers } = props
  return (
    <>
      <div className="info_block mb-4 mb-lg-0">
        <div className="icon_img">
          <ServerIcon2 />
        </div>
        <div className="info_content">
          <div className="info_flex">
            <Row className="align-items-center">
              <Col md="12">
                <p>Servers</p>
              </Col>
            </Row>
          </div>
          <h6>{servers ? servers : 0}</h6>
        </div>
      </div>
    </>
  )
}

export function WidIpAddress(props) {
  const { ipAddress } = props
  return (
    <>
      <div className="info_block mb-4 mb-lg-0">
        <div className="icon_img">
          <img src={ip} alt="" />
        </div>
        <div className="info_content">
          <p>IP Address</p>
          <h6>{ipAddress ? ipAddress : "-"} </h6>
        </div>
      </div>
    </>
  )
}

export function WidLocation(props) {
  const { location } = props
  return (
    <>
      <div className="info_block mb-4 mb-lg-0">
        <div className="icon_img">
          <ServerIcon3 />
        </div>
        <div className="info_content">
          <p>Location</p>
          <h6>{location ? location : "-"}</h6>
        </div>
      </div>
    </>
  )
}

export function WidStatus(props) {
  const { status } = props
  return (
    <>
      <div className="server_info">
        <div className="info_block mb-4 mb-lg-0">
          <div className="icon_img">
            <ServerIcon4 />
          </div>
          <div className="info_content">
            <p>Status</p>
            <h6>{status ? status : "-"}</h6>
          </div>
        </div>
      </div>
    </>
  )
}

export function WidInvoice(props) {
  const { invoices } = props
  return (
    <>
      <div className="info_block mb-4 mb-lg-0">
        <div className="icon_img">
          <Invoice />
        </div>
        <div className="info_content">
          <div className="info_flex">
            <Row className="align-items-center">
              <Col md="12">
                <p>Invoices</p>
              </Col>
            </Row>
          </div>
          <h6>{invoices ? invoices : 0} </h6>
        </div>
      </div>
    </>
  )
}

export function WidTicket(props) {
  const { tickets } = props
  return (
    <>
      <div className="info_block mb-4 mb-lg-0">
        <div className="icon_img">
          <Ticket />
        </div>
        <div className="info_content">
          <div className="info_flex">
            <Row className="align-items-center">
              <Col md="12">
                <p>Tickets</p>
              </Col>
            </Row>
          </div>
          <h6>{tickets ? tickets : 0} </h6>
        </div>
      </div>
    </>
  )
}

export function WidBalance(props) {
  const { balance } = props
  const { currency } = props
  return (
    <>
      <div className="info_block mb-4 mb-lg-0">
        <div className="icon_img">
          <Balance />
        </div>
        <div className="info_content">
          <div className="info_flex">
            <Row className="align-items-center">
              <Col md="12">
                <p>Current Balance</p>
              </Col>
            </Row>
          </div>
          <h6>
            {currency?.prefix}
            {balance || "$0.00 USD"} {currency?.suffix}
          </h6>
        </div>
      </div>
    </>
  )
}

export function C2CWallet(props) {
  const { balance } = props
  const { currency } = props
  return (
    <>
      <div className="info_block mb-4 mb-lg-0">
        <div className="icon_img">
          <Balance />
        </div>
        <div className="info_content">
          <div className="info_flex">
            <Row className="align-items-center">
              <Col md="12">
                <p>C2C Wallet</p>
              </Col>
            </Row>
          </div>
          <h6>
            {currency?.prefix}
            {balance || "$0.00 USD"} {currency?.suffix}
          </h6>
        </div>
      </div>
    </>
  )
}
