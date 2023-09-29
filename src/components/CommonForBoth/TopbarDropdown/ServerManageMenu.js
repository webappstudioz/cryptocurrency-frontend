import React, { useState, useEffect } from "react"
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  Row,
  Col,
} from "reactstrap"
import { useHistory } from "react-router-dom"

import { Link, useParams } from "react-router-dom"
import { ManageI } from "../../Common/CommonSvg"

import manage2 from ".././../../assets/images/manage2.png"
import manage3 from ".././../../assets/images/manage3.png"
import iconssh from ".././../../assets/images/iconssh.png"
import reboot from ".././../../assets/images/reboot.png"
import rescue from ".././../../assets/images/rescue.png"
import circle from ".././../../assets/images/x-circle.png"
import * as url from "../../../helpers/url_helper"
import {
  deviceDetails,
} from "../../../pages/Authentication/store/apiServices"
import { toast } from "react-toastify"

const ServerManageMenu = ({ toggleModal, toggleModalCancel, setLoading, easyServerStatus, ospending, rescuePending, fullRes } = props) => {
  const params = useParams()
  // const { toggleModal, toggleModalCancel } = props
  const [menu, setMenu] = useState(false)
  const [inlineLoader, setinlineLoader] = useState(false)
  const [actionModal, setActionModal] = useState(false)
  const [action, setAction] = useState({ label: "", action: "", message: "" })
  // const [permissions, setPemissions] = useState()
  let navigate = useHistory()
  // useEffect(() =>{
  //   setPemissions(permissions)
  // },[permissions])

  function tog_backdrop() {
    fullRes?.product?.status == "Active" && toggleModal()
  }

  function tog_backdrop_cancel() {
    toggleModalCancel != "no" && fullRes?.product?.status == "Active"
      ? toggleModalCancel()
      : toggleModalCancel != "no" && fullRes?.product?.status == "Suspended"
      ? toggleModalCancel()
      : ""
  }

  const ActionHandler = async type => {
    setActionModal(false)
    if (fullRes?.product?.status == "Active") {
      try {
        let param = new URLSearchParams({
          service_id:
            params?.id,
          action: type,
        })
        setinlineLoader(true)
        setLoading(true)
        let res = await deviceDetails(param)
        if (res) {
          let data = res?.data?.data
          data?.data?.panel_login? window.open(data?.data?.panel_login, "_blank", "noreferrer") : null
          data?.data?.console_login? window.open(data?.data?.console_login, "_blank", "noreferrer") : null
          
          !data?.data?.panel_login && !data?.data?.console_login
            ? toast.success(res.data?.message, {
                position: toast.POSITION.TOP_RIGHT,
              })
            : null

          setinlineLoader(false)
          setLoading(false)
          fullRes?.product?.servername == "EasyDCIM" &&
            easyServerStatus()
        }
      } catch (error) {
        toast.error(error?.response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        setinlineLoader(false)
        setLoading(false)
      }
    }
  }

  const handleKVMJAVA = async () => {
    let service_id =
      params?.id
    window.location.assign(process.env.REACT_APP_API_HOST + url.DOWNLOAD_KVM + service_id)
  }

  const checkPermission = (action) => {
    if(action === "reboot") {
      fullRes?.product_reboot?  setActionModal(true) : permissionDeniedFunc() 
    } else if(action === "rescue_mode") {
      fullRes?.product_rescueMode? (!rescuePending && tog_backdrop()) : permissionDeniedFunc()
    } else if(action === "os_reinstall") {
      fullRes?.product_osReinstall? (fullRes?.product?.status == "Active" && !ospending && navigate.push({
        pathname:`/reinstall-wizard-1`, 
        state:{
          serverid: params?.id,
          wizard1Info:{
            serverDetail:fullRes
          }
        }})) : permissionDeniedFunc()
    } else if(action === "cancel_server"){
      fullRes?.product_cancelServer? tog_backdrop_cancel() : permissionDeniedFunc()
    }
  }

  const permissionDeniedFunc = () => {
    toast.error("Permission Denied", {
      position: toast.POSITION.TOP_RIGHT,
    })
  }


  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() =>
          fullRes?.product?.status == "Active" && !inlineLoader
            ? setMenu(!menu)
            : setMenu(false)
        }
        className="d-inline-block"
      >
        <DropdownToggle
          style={{
            cursor: fullRes?.product?.status != "Active" ? "not-allowed" : "pointer",
          }}
          className="btn header-item waves-effect btn-manage "
          id="page-header-user-dropdown"
          tag="button"
        >
          <span className="d-none d-xl-inline-block ms-1 fw-medium font-size-15 manageloader">
            {!inlineLoader ? (
              <span>
                <ManageI />
                manage
              </span>
            ) : (
              <div className="ui segment">
                <p></p>
                <div className="ui active dimmer">
                  <div className="ui loader"></div>
                </div>
              </div>
            )}
          </span>
        </DropdownToggle>
        {fullRes?.product?.servername == "EasyDCIM" ? (
          <DropdownMenu className="dropdown-menu-end" style={{ margin: 15 }}>
            {/* <DropdownItem
              tag="a"
              onClick={() => ActionHandler("boot")}
              style={{
                cursor: status != "Active" ? "not-allowed" : "pointer",
              }}
            >
              <button
                className="p-0"
                style={{
                  cursor: status != "Active" ? "not-allowed" : "pointer",
                }}
              >
                <img src={boot} alt="" />
                Boot
              </button>
            </DropdownItem> */}
            <DropdownItem
              style={{
                cursor: fullRes?.product?.status != "Active" ? "not-allowed" : "pointer",
              }}
              tag="button"
              href=""
              // onClick={() => ActionHandler("reboot")}
              onClick={() => {
                setAction({ label: "Reboot", action: "reboot", message: "Would you like to initiate a server reboot?" })
                setActionModal(true)
              }}
            >
              <img src={reboot} alt="" />
              Reboot
            </DropdownItem>
            {/* <DropdownItem
              tag="a"
              style={{
                cursor: status != "Active" ? "not-allowed" : "pointer",
              }}
              onClick={() => ActionHandler("shutdown")}
            >
              <button
                className="p-0"
                style={{
                  cursor: status != "Active" ? "not-allowed" : "pointer",
                }}
              >
                <img src={shutdown} alt="" />
                Shutdown
              </button>
            </DropdownItem> */}
            {/* <DropdownItem
              tag="a"
              style={{
                cursor: status != "Active" ? "not-allowed" : "pointer",
              }}
              onClick={() => ActionHandler("reset-cold")}
            >
              <button
                className="p-0"
                style={{
                  cursor: status != "Active" ? "not-allowed" : "pointer",
                }}
              >
                <img src={reboot} alt="" />
                BMC Cold Reset
              </button>
            </DropdownItem> */}
            <DropdownItem
              tag="a"
              style={{
                cursor: fullRes?.product?.status != "Active" ? "not-allowed" : "pointer",
              }}
              onClick={() => {
                // tog_backdrop()
                setAction({
                  label: "Enable Rescue Mode",
                  action: "os-rescue-enable",
                })
                setActionModal(true)
                // ActionHandler("os-rescue-enable")
              }}
            >
              <button
                type="button"
                className="p-0"
                data-toggle="modal"
                style={{
                  cursor: fullRes?.product?.status != "Active" ? "not-allowed" : "pointer",
                }}
              >
                <img src={rescue} alt="" />
                Enable Rescue Mode
              </button>
            </DropdownItem>
            {/* <DropdownItem
              tag="a"
              style={{
                cursor: status != "Active" ? "not-allowed" : "pointer",
              }}
              onClick={() => {
                ActionHandler("loginPanel")
              }}
            >
              <button
                className="p-0"
                style={{
                  cursor: status != "Active" ? "not-allowed" : "pointer",
                }}
              >
                <img src={controlpanel} alt="" />
                Log in to panel
              </button>
            </DropdownItem> */}
            <DropdownItem
              tag="a"
              style={{
                cursor: fullRes?.product?.status != "Active" ? "not-allowed" : "pointer",
              }}
            >
              <button
                className="p-0"
                onClick={handleKVMJAVA}
                style={{
                  cursor: fullRes?.product?.status != "Active" ? "not-allowed" : "pointer",
                }}
              >
                {/* <img src={FileDownload} alt="" /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-download"
                  viewBox="0 0 16 16"
                >
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                </svg>
                Download KVM Java Console
              </button>
            </DropdownItem>
            <DropdownItem
              tag="a"
              style={{
                cursor: fullRes?.product?.status != "Active" ? "not-allowed" : "pointer",
              }}
              onClick={() => {
                // ActionHandler("getNoVNCConsole")
                setAction({
                  label: "noVNC KVM console",
                  action: "getNoVNCConsole",
                })
                setActionModal(true)
              }}
            >
              <button
                className="p-0"
                style={{
                  cursor: fullRes?.product?.status != "Active" ? "not-allowed" : "pointer",
                }}
              >
                <img src={iconssh} alt="" />
                noVNC KVM console
              </button>
            </DropdownItem>
            <Link
              style={{
                cursor: fullRes?.product?.status != "Active" ? "not-allowed" : "pointer",
              }}
              to={
                // fullRes?.product?.status == "Active" && `/reinstall-wizard-1/${params.id}`
                `#`
              }
              className="dropdown-item"
            >
              <img src={manage2} alt="" />
              OS Reinstall
            </Link>
            {fullRes?.product?.status != "Active" && "suspended" ? (
              ""
            ) : (
              <DropdownItem
                tag="a"
                // style={{
                //   cursor:
                //     fullRes?.product?.status != "Active" && "suspended"
                //       ? "not-allowed"
                //       : toggleModalCancel == "no"
                //       ? "not-allowed"
                //       : "pointer",
                // }}
              >
                <button
                  // style={{
                  //   cursor:
                  //     fullRes?.product?.status != "Active" && "suspended"
                  //       ? "not-allowed"
                  //       : toggleModalCancel == "no"
                  //       ? "not-allowed"
                  //       : "pointer",
                  // }}
                  type="button"
                  className="p-0"
                  onClick={() => {
                    tog_backdrop_cancel()
                  }}
                  data-toggle="modal"
                >
                  <img src={circle} alt="" />
                  Cancel Server
                </button>
              </DropdownItem>
            )}
          </DropdownMenu>
        ) : fullRes?.product?.servername == "Leaseweb" ? (
          <DropdownMenu className="dropdown-menu-end">
            <DropdownItem
              tag="a"
              style={{
                cursor: fullRes?.product?.status != "Active" ? "not-allowed" : "pointer",
              }}
            >
              <button
                style={{
                  cursor: fullRes?.product?.status != "Active" ? "not-allowed" : "pointer",
                }}
                type="button"
                className="p-0"
                onClick={() => {
                  // tog_backdrop()
                  // ActionHandler("powerCycle")
                  setAction({ label: "Reboot", action: "powerCycle", message: "Would you like to initiate a server reboot?"})
                  // setActionModal(true)
                  checkPermission("reboot")
                }}
                data-toggle="modal"
              >
                <img src={reboot} alt="" />
                Reboot 
              </button>
            </DropdownItem>
            <DropdownItem tag="a">
              <button
                type="button"
                className="p-0"
                  onClick={() => {
                    checkPermission("rescue_mode")
                  // !rescuePending &&
                  // tog_backdrop()
                }}
                  data-toggle="modal"
                  style={{cursor:rescuePending &&"not-allowed"}}
              >
                <img src={manage3} alt="" />
                Rescue Mode
              </button>
            </DropdownItem>
            {/* <DropdownItem
              tag="a"
              style={{
                cursor: fullRes?.product?.status != "Active" ? "not-allowed" : "pointer",
              }}
            >
              <button
                style={{
                  cursor: fullRes?.product?.status != "Active" ? "not-allowed" : "pointer",
                }}
                type="button"
                className="p-0"
                onClick={() => {
                  // tog_backdrop()
                  ActionHandler("powerOn")
                }}
                data-toggle="modal"
              >
                <img src={boot} alt="" />
                Power on
              </button>
            </DropdownItem> */}
            {/* <DropdownItem
              tag="a"
              style={{
                cursor: fullRes?.product?.status != "Active" ? "not-allowed" : "pointer",
              }}
            >
              <button
                style={{
                  cursor: fullRes?.product?.status != "Active" ? "not-allowed" : "pointer",
                }}
                type="button"
                className="p-0"
                onClick={() => {
                  // tog_backdrop()
                  ActionHandler("powerOff")
                }}
                data-toggle="modal"
              >
                <img src={shutdown} alt="" />
                Power off
              </button>
            </DropdownItem> */}

            {/* <Link
              style={{
                cursor: fullRes?.product?.status != "Active" || ospending ? "not-allowed" : "pointer",
              }}
              to={
                fullRes?.product?.status == "Active" && !ospending && `/reinstall-wizard-1/${params.id}`
              }
              className="dropdown-item"
            >
              <img src={manage2} alt="" />
              OS Reinstall
            </Link> */}

            <a
              style={{
                cursor: fullRes?.product?.status != "Active" || ospending ? "not-allowed" : "pointer",
              }}
              onClick={() =>{ checkPermission("os_reinstall")}}
              // to={
              //   fullRes?.product?.status == "Active" && !ospending && `/reinstall-wizard-1/${params.id}`
              // }
              className="dropdown-item"
            >
              <img src={manage2} alt="" />
              OS Reinstall
            </a>
            {/* <DropdownItem
              tag="a"
              style={{
                cursor: fullRes?.product?.status != "Active" ? "not-allowed" : "pointer",
              }}
            >
              <button
                style={{
                  cursor: fullRes?.product?.status != "Active" ? "not-allowed" : "pointer",
                }}
                type="button"
                className="p-0"
                onClick={() => {
                  // tog_backdrop()
                  ActionHandler("ipmiReset")
                }}
                data-toggle="modal"
              >
                <img src={reboot} alt="" />
                Launch IPMI reset
              </button>
            </DropdownItem> */}
            {fullRes?.product?.status != "Active" && "suspended" ? (
              ""
            ) : (
              <DropdownItem
                tag="a"
                // style={{
                //   cursor:
                //     fullRes?.product?.status != "Active" && "suspended"
                //       ? "not-allowed"
                //       : toggleModalCancel == "no"
                //       ? "not-allowed"
                //       : "pointer",
                // }}
              >
                <button
                  // style={{
                  //   cursor:
                  //     fullRes?.product?.status != "Active" && "suspended"
                  //       ? "not-allowed"
                  //       : toggleModalCancel == "no"
                  //       ? "not-allowed"
                  //       : "pointer",
                  // }}
                  type="button"
                      className="p-0"
                      style={{cursor:toggleModalCancel=="no"&& "not-allowed"}}
                  onClick={() => {
                    checkPermission("cancel_server")
                  }}
                  data-toggle="modal"
                >
                  <img src={circle} alt="" />
                  Cancel Server
                </button>
              </DropdownItem>
            )}
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownItem
              tag="a"
              style={{
                cursor:
                fullRes?.product?.status != "Active" && "suspended"
                    ? "not-allowed"
                    : toggleModalCancel == "no"
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              <button
                style={{
                  cursor:
                  fullRes?.product?.status != "Active" && "suspended"
                      ? "not-allowed"
                      : toggleModalCancel == "no"
                      ? "not-allowed"
                      : "pointer",
                }}
                type="button"
                className="p-0"
                onClick={() => {
                  tog_backdrop_cancel()
                }}
                data-toggle="modal"
              >
                <img src={circle} alt="" />
                Cancel Server
              </button>
            </DropdownItem>
          </DropdownMenu>
        )}
      </Dropdown>
      <Modal isOpen={actionModal} centered={true} modalClassName="manage-modal">
        <div className="modal-header">
          <Row className="w-100">
            <Col xs="11">
              <h5 className="modal-title mt-0">{action.label}</h5>
            </Col>
            <Col xs="1">
              <button
                type="button"
                onClick={() => {
                  setActionModal(false)
                  // setLoader(false)
                }}
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">
                  {" "}
                  {/* <img src={close} alt="" /> 1 */}
                </span>
              </button>
            </Col>
          </Row>
        </div>
        <div className="modal-body p-0 two-factor verify">
          {/* <div className="img_block text-center">
            <img src={Warning} alt="" />
          </div> */}
          <h6 className="font-bold text-blue text-center">
            {action?.message? action.message : `Do you want to ${action?.label?.toLowerCase()}.`}
          </h6>
          <div className="factor-disable-btn">
            <button
              className="btn btn-danger waves-effect waves-light btn-green"
              type="button"
              onClick={() => {
                ActionHandler(action?.action)
                // setLoader(true)
                // setLoading(100)
              }}
              data-dismiss="modal"
              aria-label="Close"
            >
              Yes
            </button>
            <button
              className="btn btn-danger waves-effect waves-light btn-disable"
              type="button"
              onClick={() => {
                setActionModal(false)
                // setLoader(false)
              }}
              data-dismiss="modal"
              aria-label="Close"
            >
              No
            </button>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  )
}

export default React.memo(ServerManageMenu);
