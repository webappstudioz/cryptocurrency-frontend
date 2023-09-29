import React, { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Label,
  Input,
  FormFeedback,
  Form,
  Modal,
} from "reactstrap"
// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"
//redux
import { withRouter, useHistory } from "react-router-dom"
//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb"

// actions
import { getClientInfo, userRole } from "./store/apiServices"
import time from "../../assets/images/time.svg"
import { customRegex } from "../../helpers/validation_helpers"
import rederror from "../../assets/images/redvalidationicon/rederror.jpg"
import {
  sendInvite,
  getInviteList,
  resendInvitation,
  cancelInvitations,
  removeAccess,
  updatePermissions,
} from "../../pages/Authentication/store/apiServices"
import { toast } from "react-toastify"
import TextLoader from "../../components/textLoader"
import { setPageTitle, getHoursAgo } from "../../helpers/api_helper_rs"

const UserManagementv2 = props => {
  const [UserData, setUserData] = useState()
  const [showPermissions, setShowPermissions] = useState(false)
  const [managePermissions, setManagePermissions] = useState([])
  const [invitedUserList, setInvitedUserList] = useState()
  const [loader, setLoader] = useState(false)
  const [loading, setLoading] = useState("")
  const [userID, setUserID] = useState({ id: "", index: "" })
  const [actionModal, setActionModal] = useState({ open: false, id: "" })
  const [removeModal, setRemoveModal] = useState({ open: false, id: "" })
  const [assignedPermissions, setAssignedPermissions] = useState([])
  const [unSelectedPerm, setUnselectedPerm] = useState([])
  const [lastLogin, setLastLogin] = useState()
  const [spinner, setSpinner] = useState({
    id:"",
    sendInvite:false, 
    resendInvite:false, 
    cancelInvite:false, 
    updatePerm:false,
    removeAccess: false, 
    managePerm:false
  })

  let navigate = useHistory()
  let permissionsArray = [
    "domains",
    "profile",
    "reboot",
    "rescueMode",
    "osReinstall",
    "cancelServer",
    // "contacts",
    "products",
    // "productsso",
    "invoices",
    "tickets",
    // "affiliates",
    // "emails",
    "orders",
    "IPv4Management",
    "usage",
    "overview",
  ]

  const success = false
  const error = false

  useEffect(() => {
    if (UserData?.last_login) {
      let logintime = getHoursAgo(UserData?.last_login)
      setLastLogin(logintime)
    }
  }, [UserData])

  useEffect(async () => {
    setPageTitle("User Management")
    let role = userRole()
    if (role === "client") {
      handleClientInfo()
      
    } else {
      navigate.push("/dashboard")
    }
  }, [])

  const handleClientInfo = async() => {
    setLoader(true)
    setLoading(true)
    try{
      let user = await getClientInfo()
      setUserData(user?.data?.data)
      
      getInvitationList()
    }catch(error){
      setLoader(false)
      setLoading(false)
    }
  }

  const getInvitationList = async () => {
    try {
      let list = await getInviteList()
      if (list?.data) {
        setLoader(false)
        setLoading(false)
        setInvitedUserList(list?.data?.data)
        let permissionArr = []
        list?.data?.data?.map(() => {
          permissionArr.push(false)
        })
        setManagePermissions(permissionArr)
      }
    } catch (error) {
      setLoader(false)
      setLoading(false)
    }
  }

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Please enter your email address")
        .matches(customRegex.email, "Please enter a valid email address"),
    }),

    onSubmit: async (values, { resetForm }) => {
      let permissions = []
      if (showPermissions) {
        values.permissions
          ? (permissions = values.permissions)
          : (permissions = ["domains"])
      } else {
        permissions = permissionsArray
      }
      let data = new URLSearchParams({
        email: values.email,
        "permissions[]": permissions,
      })
      try {
        setLoading(true)
        setSpinner({sendInvite:true})
        // setDisableBtn({sendInvite:true, resendInvite:true, cancelInvite:true, updatePerm:true, managePerm: true, removeAccess: true})
        let res = await sendInvite(data)
        if (res) {
          resetForm()
          // setShowPermissions(false)
          toast.success(res?.data?.message, {
            position: toast.POSITION.TOP_RIGHT,
          })
          let allcheck = document.getElementsByClassName("check-permission")
          for (let i = 0; i < allcheck.length; i++) {
            allcheck[i].checked = false
          }
          getInvitationList()
          setShowPermissions(false)
          setSpinner({sendInvite:false})
          setLoading(false)
          // setDisableBtn({sendInvite:false, resendInvite:false, cancelInvite:false, updatePerm:false, managePerm: false, removeAccess: false})
          
        }
      } catch (error) {
        toast.error(error?.response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        setSpinner({sendInvite:false})
        // setDisableBtn({sendInvite:false, resendInvite:false, cancelInvite:false, updatePerm:false, managePerm: false, removeAccess: false})
        setLoading(false)
      }
    },
  })

  const managePermissionForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: userID.id || "",
    },

    onSubmit: async values => {
      setSpinner({updatePerm:true})
      setLoading(true)
      // setDisableBtn({sendInvite:true, resendInvite:true, cancelInvite:true, updatePerm:true, managePerm: true, removeAccess: true})
      try {
        let perm = []
        invitedUserList[userID.index].permissions.length
          ? (perm = invitedUserList[userID.index].permissions)
          : (perm = [""])
        let data = new URLSearchParams({
          id: values.id,
          "permissions[]": perm,
        })

        let result = await updatePermissions(data)
        if (result) {
          setAssignedPermissions([])
          setUnselectedPerm([])
          toast.success(result?.data?.message, {
            position: toast.POSITION.TOP_RIGHT,
          })
          setSpinner({updatePerm:false})
          setLoading(false)
          // setDisableBtn({sendInvite:false, resendInvite:false, cancelInvite:false, updatePerm:false, managePerm: false, removeAccess: false})
          getInvitationList()
        }
      } catch (error) {
        toast.error(error?.response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        setSpinner({updatePerm:false})
        setLoading(false)
        // setDisableBtn({sendInvite:false, resendInvite:false, cancelInvite:false, updatePerm:false, managePerm: false, removeAccess: false})
        getInvitationList()
      }
    },
  })

  // const handleInputChange = event => {
  //   managePermissionForm.handleChange(event)
  //   if (event?.target?.checked === false) {
  //     let unSelected = [...unSelectedPerm]
  //     unSelected.push(event?.target?.value)
  //     setUnselectedPerm(unSelected)
  //   } else if (event?.target?.checked === true) {
  //     let arr = [...unSelectedPerm]
  //     arr.pop(event?.target?.value)
  //     setUnselectedPerm(arr)
  //   }
  // }

  const handleManagePermission = async index => {
    let assignedPerm = invitedUserList[index]?.permissions
    setAssignedPermissions(assignedPerm)
    let arr = [...managePermissions]
    for (let i = 0; i < arr.length; i++) {
      i == index ? (arr[i] = !arr[i]) : (arr[i] = false)
    }
    setManagePermissions(arr)
  }

  const handleResendInvite = async id => {
    setSpinner({id:id,resendInvite:true})
    setLoading(true)
    // setDisableBtn({id:id, sendInvite:true, resendInvite:true, cancelInvite:true, updatePerm:true, managePerm: true, removeAccess: true})
    try {
      let data = new URLSearchParams({ id: id })
      let result = await resendInvitation(data)
      setSpinner({id:id, resendInvite:false})
      setLoading(false)
      // setDisableBtn({id:id,sendInvite:false, resendInvite:false, cancelInvite:false, updatePerm:false, managePerm: false, removeAccess: false})
      toast.success(result?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      })
    } catch (error) {
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      })
      setSpinner({resendInvite:false})
      setLoading(false)
      // setDisableBtn({id:id,sendInvite:false, resendInvite:false, cancelInvite:false, updatePerm:false, managePerm: false, removeAccess: false})
    }
  }

  const HandleCancelInvite = async id => {
    setActionModal({ open: false })
    setSpinner({id:id, cancelInvite:true})
    setLoading(true)
    // setDisableBtn({id:id,sendInvite:true, resendInvite:true, cancelInvite:true, updatePerm:true, managePerm: true, removeAccess: true})
    try {
      let data = new URLSearchParams({ id: id })
      let result = await cancelInvitations(data)
      if (result) {
        setSpinner({id:id, resendInvite:false})
        setLoading(false)
        // setDisableBtn({id:id,sendInvite:false, resendInvite:false, cancelInvite:false, updatePerm:false, managePerm: false, removeAccess: false})
        
        toast.success(result?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        getInvitationList()
      }
    } catch (error) {
      setSpinner({id:id, resendInvite:false})
      setLoading(false)
      // setDisableBtn({id:id,sendInvite:false, resendInvite:false, cancelInvite:false, updatePerm:false, managePerm: false, removeAccess: false})
     
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  }

  const handleRemoveAccess = async id => {
    setLoader(true)
    setLoading(true)
    setRemoveModal(false)
    try {
      let data = new URLSearchParams({ id: id })
      let result = await removeAccess(data)
      if (result) {
        setLoader(false)
        setLoading(false)
        toast.success(result?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        getInvitationList()
      }
    } catch (error) {
      setLoader(false)
      setLoading(false)
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  }

  const handleSelectAll = (e, index) => {
    let invitedUserList1 = [...invitedUserList]
    if (e?.target?.checked === true) {
      invitedUserList1[index].permissions = []
      invitedUserList1[index].permissions.push(
        "domains",
        "profile",
        "reboot",
        "rescueMode",
        "osReinstall",
        "cancelServer",
        // "contacts",
        "products",
        // "productsso",
        "invoices",
        "tickets",
        // "affiliates",
        // "emails",
        "orders",
        "IPv4Management",
        "usage",
        "overview"
      )
      setInvitedUserList([])
      setInvitedUserList(invitedUserList1)
    } else if (e?.target?.checked === false) {
      invitedUserList1[index].permissions = []
      setInvitedUserList([])
      setInvitedUserList(invitedUserList1)
    }
  }
  
  const handleSingleInput = (e, index) => {
    let invitedUserList1 = [...invitedUserList]
    if (invitedUserList1[index].permissions.includes(e.target.value)) {
      var id = invitedUserList1[index].permissions.indexOf(e.target.value)
      if (id !== -1) {
        invitedUserList1[index].permissions.splice(id, 1)
        setInvitedUserList(invitedUserList1)
      }
    } else {
      invitedUserList1[index].permissions.push(e.target.value)
      setInvitedUserList(invitedUserList1)
    }
  }

  return (
    <React.Fragment>
      <div
        className={loader ? "page-content overlayerloader" : "page-content "}
      >
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumb title="Minible" breadcrumbItem="User Management" />

          <Row>
            <Col lg="12">
              {/* {error && error ? <Alert color="danger">{error}</Alert> : null}
              {success ? <Alert color="success">{success}</Alert> : null} */}
              <Card>
                <CardBody>
                  <div className="inner-content user">
                    <h4 className="font-bold text-blue">{UserData?.email}</h4>{" "}
                    <p className="owner-text">Owner</p>
                    <p className="text-primary d-flex align-items-center font-semi">
                      <img className="mr-3" src={time} /> Last Login:{" "}
                      {lastLogin? `${lastLogin} ago` : "N/A"}
                    </p>
                    <div className="grp-btn d-inline-flex">
                      <button
                        className="btn btn-border waves-effect waves-light"
                        type="submit"
                        disabled
                      >
                        Manage Permissions
                      </button>
                      <button
                        className="btn btn-danger waves-effect waves-light mx-4 btn-remove text-white"
                        type="submit"
                        disabled
                      >
                        Remove Access
                      </button>
                    </div>
                  </div>
                </CardBody>
              </Card>
              {invitedUserList?.map((list, index) => {
                let lastlogin = getHoursAgo(list?.last_login, list?.currentTime)
                return (
                  <div key={index}>
                    <Card>
                      <CardBody>
                        <div className="inner-content user">
                          <h4 className="font-bold text-blue">{list?.email}</h4>
                          <p
                            className={
                              list?.accepted ? "accepted-text" : "pending-text"
                            }
                          >
                            {list?.accepted ? "Accepted" : "Pending"}
                          </p>

                          <p className="text-primary d-flex align-items-center font-semi">
                            <img className="mr-3" src={time} /> Last Login:{" "}
                            {lastlogin? `${lastlogin} ago` : "N/A" }
                          </p>

                          <div className="grp-btn d-inline-flex">
                            {list?.accepted ? (
                              <>
                                <button
                                  className="btn btn-border waves-effect waves-light invitation-btn"
                                  onClick={() => handleManagePermission(index)}
                                  // disabled={disableBtn?.managePerm}
                                  disabled={loading}
                                >
                                  {spinner?.managePerm? <div className="ui active inline loader small-spinner"></div> : "Manage Permissions"}
                                </button>
                                <button
                                  className="btn btn-danger waves-effect waves-light mx-4 btn-remove text-white invitation-btn"
                                  onClick={() =>
                                    setRemoveModal({ open: true, id: list?.id })
                                  }
                                  // disabled={disableBtn?.removeAccess}
                                  disabled={loading}
                                >
                                  {spinner?.removeAccess? <div className="ui active inline loader small-spinner"></div> : "Remove Access"}
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="btn btn-border waves-effect waves-light invitation-btn"
                                  onClick={() => handleResendInvite(list?.id)}
                                  // disabled={(list?.id != spinner?.id && disableBtn?.resendInvite)}
                                  disabled={loading}
                                >
                                  {(list?.id === spinner?.id && spinner?.resendInvite)? <div className="ui active inline loader small-spinner blue-spinner"></div> : "Resend Invite"}
                                </button>
                                <button
                                  className="btn btn-danger waves-effect waves-light mx-4 btn-remove text-white invitation-btn"
                                  onClick={() =>
                                    setActionModal({ open: true, id: list?.id })
                                  }
                                  // disabled={(list?.id != spinner?.id && disableBtn?.cancelInvite)}
                                  disabled={loading}
                                >
                                  {(list?.id === spinner?.id && spinner?.cancelInvite)? <div className="ui active inline loader small-spinner"></div> : "Cancel Invite"}
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {
                          <Form
                            className="form-horizontal user-management"
                            onSubmit={e => {
                              e.preventDefault()
                              managePermissionForm.handleSubmit()
                              setUserID({ id: list?.id, index: index })
                              return false
                            }}
                            // key={index}
                          >
                            <div className="user-management-permissions">
                              <div className="slidepermissionscontainer">
                                <div
                                  className="check-group group-server slidepermissions"
                                  style={{
                                    height: managePermissions[index]
                                      ? "500px"
                                      : 0,
                                  }}
                                >
                                  <div className="form-check d-flex align-items-center ">
                                    <input
                                    disabled={loading}
                                      type="checkbox"
                                      className="form-check-input"
                                      id={`"selectAll${index}"`}
                                      name="selectAll"
                                      onChange={e => handleSelectAll(e, index)}
                                      value="selectAll"
                                      defaultChecked={false}
                                    />
                                    <label
                                      className="form-check-label d-flex align-items-center"
                                      htmlFor={`"selectAll${index}"`}
                                    >
                                      <p className="text-color-v1 text-color-v1 font-small">
                                        Select All
                                      </p>
                                    </label>
                                  </div>
                                  <div className="form-check d-flex align-items-center ">
                                    <input
                                    disabled={loading}
                                      type="checkbox"
                                      className="form-check-input"
                                      id={`"customControlInline1${index}"`}
                                      name="permissions"
                                      onChange={() => {}}
                                      onClick={e => handleSingleInput(e, index)}
                                      value="profile"
                                      checked={list.permissions.includes(
                                        "profile"
                                      )}
                                    />
                                    <label
                                      className="form-check-label d-flex align-items-center"
                                      htmlFor={`"customControlInline1${index}"`}
                                    >
                                      <p className="text-color-v1 text-color-v1 font-small">
                                        Modify Master Account Profile
                                      </p>
                                      <b>-</b>
                                      <span>
                                        Access and modify the client profile
                                        information
                                      </span>
                                    </label>
                                  </div>
                                  {/* <div className="form-check d-flex align-items-center">
                                    <input
                                    disabled={loading}
                                      type="checkbox"
                                      className="form-check-input"
                                      id={`"customControlInline2${index}"`}
                                      name="permissions"
                                      onChange={() => {}}
                                      onClick={e => handleSingleInput(e, index)}
                                      value="contacts"
                                      checked={list.permissions.includes(
                                        "contacts"
                                      )}
                                    />
                                    <label
                                      className="form-check-label d-flex align-items-center"
                                      htmlFor={`"customControlInline2${index}"`}
                                    >
                                      <p className="text-color-v1 text-color-v1 font-small">
                                        Invite team members
                                      </p>
                                      <b>-</b>
                                      <span>Access and manage contacts</span>
                                    </label>
                                  </div> */}
                                  <div className="form-check d-flex align-items-center">
                                    <input
                                    disabled={loading}
                                      type="checkbox"
                                      className="form-check-input"
                                      id={`"customControlInline3${index}"`}
                                      name="permissions"
                                      onChange={() => {}}
                                      onClick={e => handleSingleInput(e, index)}
                                      value="products"
                                      checked={list.permissions.includes(
                                        "products"
                                      )}
                                    />
                                    <label
                                      className="form-check-label d-flex align-items-center"
                                      htmlFor={`"customControlInline3${index}"`}
                                    >
                                      <p className="text-color-v1 text-color-v1 font-small">
                                        View Products & Services
                                      </p>
                                      <b>-</b>
                                      <span>
                                        View access to products,services and
                                        addons
                                      </span>
                                    </label>
                                  </div>

                                  {/* <div className="form-check d-flex align-items-center">
                                  <input
                                  disabled={loading}
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`"customControlInline4${index}"`}
                                    name="permissions"
                                    onChange={() => {}}
                                    onClick={e => handleSingleInput(e, index)}
                                    value="manageproducts"
                                    checked={list.permissions.includes(
                                      "manageproducts"
                                    )}
                                  />
                                  <label
                                    className="form-check-label d-flex align-items-center"
                                    htmlFor={`"customControlInline4${index}"`}
                                  >
                                    <p className="text-color-v1 text-color-v1 font-small">
                                      View & Modify Product Passwords
                                    </p>
                                    <b>-</b>
                                    <span>
                                      Allow passsword resets and other actions
                                    </span>
                                  </label>
                                </div> */}
                                  {/* <div className="form-check d-flex align-items-center">
                                    <input
                                    disabled={loading}
                                      type="checkbox"
                                      className="form-check-input"
                                      id={`"customControlInline5${index}"`}
                                      name="permissions"
                                      onChange={() => {}}
                                      onClick={e => handleSingleInput(e, index)}
                                      value="productsso"
                                      checked={list.permissions.includes(
                                        "productsso"
                                      )}
                                    />
                                    <label
                                      className="form-check-label d-flex align-items-center"
                                      htmlFor={`"customControlInline5${index}"`}
                                    >
                                      <p className="text-color-v1 text-color-v1 font-small">
                                        Perform Single Sign-On
                                      </p>
                                      <b>-</b>
                                      <span>
                                        Allow single sign-on into services
                                      </span>
                                    </label>
                                  </div> */}
                                  {/* <div className="form-check d-flex align-items-center">
                                  <input
                                  disabled={loading}
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`"customControlInline6${index}"`}
                                    name="permissions"
                                    onChange={() => {}}
                                    onClick={e => handleSingleInput(e, index)}
                                    value="domains"
                                    checked={list.permissions.includes(
                                      "domains"
                                    )}
                                  />
                                  <label
                                    className="form-check-label d-flex align-items-center"
                                    htmlFor={`"customControlInline6${index}"`}
                                  >
                                    <p className="text-color-v1 text-color-v1 font-small">
                                      View Domains
                                    </p>
                                    <b>-</b>
                                    <span>
                                      View access to domain registrations
                                    </span>
                                  </label>
                                </div> */}
                                  {/* <div className="form-check d-flex align-items-center">
                                  <input
                                  disabled={loading}
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`"customControlInline7${index}"`}
                                    name="permissions"
                                    onChange={() => {}}
                                    onClick={e => handleSingleInput(e, index)}
                                    value="managedomains"
                                    checked={list.permissions.includes(
                                      "managedomains"
                                    )}
                                  />
                                  <label
                                    className="form-check-label d-flex align-items-center"
                                    htmlFor={`"customControlInline7${index}"`}
                                  >
                                    <p className="text-color-v1 text-color-v1 font-small">
                                      Manage Domain Settings
                                    </p>
                                    <b>-</b>
                                    <span>
                                      Allow domain management eg.
                                      nameservers/whois/transfers
                                    </span>
                                  </label>
                                </div> */}
                                  <div className="form-check d-flex align-items-center">
                                    <input
                                    disabled={loading}
                                      type="checkbox"
                                      className="form-check-input"
                                      id={`"customControlInline8${index}"`}
                                      name="permissions"
                                      onChange={() => {}}
                                      onClick={e => handleSingleInput(e, index)}
                                      value="invoices"
                                      checked={list.permissions.includes(
                                        "invoices"
                                      )}
                                    />
                                    <label
                                      className="form-check-label d-flex align-items-center"
                                      htmlFor={`"customControlInline8${index}"`}
                                    >
                                      <p className="text-color-v1 text-color-v1 font-small">
                                        View & Pay Invoices
                                      </p>
                                      <b>-</b>
                                      <span>
                                        View and payment access to invoices
                                      </span>
                                    </label>
                                  </div>
                                  {/* <div className="form-check d-flex align-items-center">
                                  <input
                                  disabled={loading}
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`"customControlInline9${index}"`}
                                    name="permissions"
                                    onChange={() => {}}
                                    onClick={e => handleSingleInput(e, index)}
                                    value="quotes"
                                    checked={list.permissions.includes(
                                      "quotes"
                                    )}
                                  />
                                  <label
                                    className="form-check-label d-flex align-items-center"
                                    htmlFor={`"customControlInline9${index}"`}
                                  >
                                    <p className="text-color-v1 text-color-v1 font-small">
                                      View & Accept Quotes
                                    </p>
                                    <b>-</b>
                                    <span>
                                      View and acceptance permissions for quotes
                                    </span>
                                  </label>
                                </div> */}
                                  <div className="form-check d-flex align-items-center">
                                    <input
                                    disabled={loading}
                                      type="checkbox"
                                      className="form-check-input"
                                      id={`"customControlInline10${index}"`}
                                      name="permissions"
                                      onChange={() => {}}
                                      onClick={e => handleSingleInput(e, index)}
                                      value="tickets"
                                      checked={list.permissions.includes(
                                        "tickets"
                                      )}
                                    />
                                    <label
                                      className="form-check-label d-flex align-items-center"
                                      htmlFor={`"customControlInline10${index}"`}
                                    >
                                      <p className="text-color-v1 text-color-v1 font-small">
                                        View & Open Support Tickets
                                      </p>
                                      <b>-</b>
                                      <span>
                                        Access to open,respond and manage
                                        support tickets
                                      </span>
                                    </label>
                                  </div>
                                  {/* <div className="form-check d-flex align-items-center">
                                    <input
                                    disabled={loading}
                                      type="checkbox"
                                      className="form-check-input"
                                      id={`"customControlInline11${index}"`}
                                      name="permissions"
                                      onChange={() => {}}
                                      onClick={e => handleSingleInput(e, index)}
                                      value="affiliates"
                                      checked={list.permissions.includes(
                                        "affiliates"
                                      )}
                                    />
                                    <label
                                      className="form-check-label d-flex align-items-center"
                                      htmlFor={`"customControlInline11${index}"`}
                                    >
                                      <p className="text-color-v1 text-color-v1 font-small">
                                        View & Manage Affiliate Accounts
                                      </p>
                                      <b>-</b>
                                      <span>
                                        Access to view and request withdrawals{" "}
                                      </span>
                                    </label>
                                  </div> */}
                                  {/* <div className="form-check d-flex align-items-center">
                                    <input
                                    disabled={loading}
                                      type="checkbox"
                                      className="form-check-input"
                                      id={`"customControlInline12${index}"`}
                                      name="permissions"
                                      onChange={() => {}}
                                      onClick={e => handleSingleInput(e, index)}
                                      value="emails"
                                      checked={list.permissions.includes(
                                        "emails"
                                      )}
                                    />
                                    <label
                                      className="form-check-label d-flex align-items-center"
                                      htmlFor={`"customControlInline12${index}"`}
                                    >
                                      <p className="text-color-v1 text-color-v1 font-small">
                                        View Emails
                                      </p>
                                      <b>-</b>
                                      <span>
                                        Access to view account email history{" "}
                                      </span>
                                    </label>
                                  </div> */}
                                  <div className="form-check d-flex align-items-center">
                                    <input
                                    disabled={loading}
                                      type="checkbox"
                                      className="form-check-input"
                                      id={`"customControlInline13${index}"`}
                                      name="permissions"
                                      onChange={() => {}}
                                      onClick={e => handleSingleInput(e, index)}
                                      value="orders"
                                      checked={list.permissions.includes(
                                        "orders"
                                      )}
                                    />
                                    <label
                                      className="form-check-label d-flex align-items-center"
                                      htmlFor={`"customControlInline13${index}"`}
                                    >
                                      <p className="text-color-v1 text-color-v1 font-small">
                                        Place New Orders/Upgrades/Cancellations
                                      </p>
                                      <b>-</b>
                                      <span>Allow placing of new orders </span>
                                    </label>
                                  </div>

                                  {/* <div className="btn-group mt-30">
                                  <button
                                    className="btn btn-primary w-100 waves-effect waves-light btn-save font-normal btnv1"
                                    type="submit"
                                  >
                                    Update Permissions
                                  </button>
                                </div> */}
                                  <div className="form-check d-flex align-items-center">
                                    <input
                                    disabled={loading}
                                      type="checkbox"
                                      className="form-check-input check-permission"
                                      id={`"customControlInline14${index}"`}
                                      name="permissions"
                                      onChange={() => {}}
                                      onClick={e => handleSingleInput(e, index)}
                                      value="reboot"
                                      checked={list.permissions.includes(
                                        "reboot"
                                      )}
                                    />
                                    <label
                                      className="form-check-label d-flex align-items-center"
                                      htmlFor={`"customControlInline14${index}"`}
                                    >
                                      <p className="text-color-v1 text-color-v1 font-small">
                                        Reboot
                                      </p>
                                      <b>-</b>
                                      <span>Allow Reboot Server</span>
                                    </label>
                                  </div>
                                </div>
                              </div>

                              <div className="slidepermissionscontainer">
                                <div
                                  className="check-group group-server slidepermissions"
                                  style={{
                                    height: managePermissions[index]
                                      ? "500px"
                                      : 0,
                                  }}
                                >
                                  <div className="form-check d-flex align-items-center ">
                                    {/* <input
                                    disabled={loading}
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`"selectAll${index}"`}
                                    name="selectAll"
                                    onChange={() => {}}
                                    onChange={e => handleSelectAll(e, index)}
                                    value="selectAll"
                                    defaultChecked={false}
                                  />
                                  <label
                                    className="form-check-label d-flex align-items-center"
                                    htmlFor={`"selectAll${index}"`}
                                  >
                                    <p className="text-color-v1 text-color-v1 font-small">
                                      Select All
                                    </p>
                                  </label> */}
                                  </div>

                                  <div className="form-check d-flex align-items-center">
                                    <input
                                    disabled={loading}
                                      type="checkbox"
                                      className="form-check-input check-permission"
                                      id={`"customControlInline15${index}"`}
                                      name="permissions"
                                      onChange={() => {}}
                                      onClick={e => handleSingleInput(e, index)}
                                      value="rescueMode"
                                      checked={list.permissions.includes(
                                        "rescueMode"
                                      )}
                                    />
                                    <label
                                      className="form-check-label d-flex align-items-center"
                                      htmlFor={`"customControlInline15${index}"`}
                                    >
                                      <p className="text-color-v1 text-color-v1 font-small">
                                        Rescue Mode
                                      </p>
                                      <b>-</b>
                                      <span>
                                        Allow Install Server in Rescue mode
                                      </span>
                                    </label>
                                  </div>
                                  <div className="form-check d-flex align-items-center">
                                    <input
                                    disabled={loading}
                                      type="checkbox"
                                      className="form-check-input check-permission"
                                      id={`"customControlInline16${index}"`}
                                      name="permissions"
                                      onChange={() => {}}
                                      onClick={e => handleSingleInput(e, index)}
                                      value="osReinstall"
                                      checked={list.permissions.includes(
                                        "osReinstall"
                                      )}
                                    />
                                    <label
                                      className="form-check-label d-flex align-items-center"
                                      htmlFor={`"customControlInline16${index}"`}
                                    >
                                      <p className="text-color-v1 text-color-v1 font-small">
                                        Os Reinstall
                                      </p>
                                      <b>-</b>
                                      <span>Allow OS Reinstall on Server</span>
                                    </label>
                                  </div>
                                  <div className="form-check d-flex align-items-center">
                                    <input
                                    disabled={loading}
                                      type="checkbox"
                                      className="form-check-input check-permission"
                                      id={`"customControlInline17${index}"`}
                                      name="permissions"
                                      onChange={() => {}}
                                      onClick={e => handleSingleInput(e, index)}
                                      value="cancelServer"
                                      checked={list.permissions.includes(
                                        "cancelServer"
                                      )}
                                    />
                                    <label
                                      className="form-check-label d-flex align-items-center"
                                      htmlFor={`"customControlInline17${index}"`}
                                    >
                                      <p className="text-color-v1 text-color-v1 font-small">
                                        Cancel Server
                                      </p>
                                      <b>-</b>
                                      <span>Allow Reboot Server</span>
                                    </label>
                                  </div>
                                  <div className="form-check d-flex align-items-center">
                                    <input
                                    disabled={loading}
                                      type="checkbox"
                                      className="form-check-input check-permission"
                                      id={`"customControlInline18${index}"`}
                                      name="permissions"
                                      onChange={() => {}}
                                      onClick={e => handleSingleInput(e, index)}
                                      value="overview"
                                      checked={list.permissions.includes(
                                        "overview"
                                      )}
                                    />
                                    <label
                                      className="form-check-label d-flex align-items-center"
                                      htmlFor={`"customControlInline18${index}"`}
                                    >
                                      <p className="text-color-v1 text-color-v1 font-small">
                                        Overview
                                      </p>
                                      <b>-</b>
                                      <span>Overview</span>
                                    </label>
                                  </div>
                                  <div className="form-check d-flex align-items-center">
                                    <input
                                    disabled={loading}
                                      type="checkbox"
                                      className="form-check-input check-permission"
                                      id={`"customControlInline19${index}"`}
                                      name="permissions"
                                      onChange={() => {}}
                                      onClick={e => handleSingleInput(e, index)}
                                      value="usage"
                                      checked={list.permissions.includes(
                                        "usage"
                                      )}
                                    />
                                    <label
                                      className="form-check-label d-flex align-items-center"
                                      htmlFor={`"customControlInline19${index}"`}
                                    >
                                      <p className="text-color-v1 text-color-v1 font-small">
                                        Usage
                                      </p>
                                      <b>-</b>
                                      <span>Usage</span>
                                    </label>
                                  </div>
                                  <div className="form-check d-flex align-items-center">
                                    <input
                                      disabled={loading}
                                      type="checkbox"
                                      className="form-check-input check-permission"
                                      id={`"customControlInline20${index}"`}
                                      name="permissions"
                                      onChange={() => {}}
                                      onClick={e => handleSingleInput(e, index)}
                                      value="IPv4Management"
                                      checked={list.permissions.includes(
                                        "IPv4Management"
                                      )}
                                    />
                                    <label
                                      className="form-check-label d-flex align-items-center"
                                      htmlFor={`"customControlInline20${index}"`}
                                    >
                                      <p className="text-color-v1 text-color-v1 font-small">
                                        IPv4 Management
                                      </p>
                                      <b>-</b>
                                      <span>IPv4 Management </span>
                                    </label>
                                  </div>
                                </div>
                                {managePermissions[index] && (
                                  <div className="btn-group mt-30">
                                    <button
                                      className="btn btn-primary w-100 waves-effect waves-light btn-save font-normal btnv1"
                                      type="submit"
                                      // disabled={disableBtn?.updatePerm}
                                      disabled={loading}
                                    >
                                      {spinner?.updatePerm? <div className="ui active inline loader"></div> : "Update Permissions"}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Form>
                        }
                      </CardBody>
                    </Card>
                  </div>
                )
              })}
              <Form
                className="form-horizontal user-management"
                onSubmit={e => {
                  e.preventDefault()
                  validation.handleSubmit()
                  return false
                }}
              >
                <Card className="m-0">
                  <CardBody>
                    <div className="inner-content invite-user">
                      <h6 className="font16  font-semibold">Invite New User</h6>

                      <div className="mb-3 form-g position-relative">
                        <Input
                          disabled={loading}
                          name="email"
                          className="form-control bg-input"
                          type="email"
                          placeholder="redswitches@gmail.com"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email
                              ? true
                              : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <>
                            <FormFeedback type="invalid">
                              <img
                                className="form-error-icon"
                                src={rederror}
                                alt=""
                                height={15}
                              />
                              {validation.errors.email}
                            </FormFeedback>
                          </>
                        ) : null}
                      </div>
                      <div className="radio-btn radio-server-group">
                        <div className="form-check form-check-inline">
                          <Input
                            disabled={loading}
                            type="radio"
                            id="customRadioInline1"
                            name="customRadioInline1"
                            className="form-check-input"
                            onClick={() => setShowPermissions(false)}
                            checked={!showPermissions}
                            onChange={() => {}} //to remove warning message
                          />
                          <Label
                            className="form-check-label"
                            htmlFor="customRadioInline1"
                          >
                            All permissions
                          </Label>
                        </div>
                        &nbsp;
                        <div className="form-check form-check-inline">
                          <Input
                            disabled={loading}
                            type="radio"
                            id="customRadioInline2"
                            name="customRadioInline1"
                            className="form-check-input"
                            onClick={() => {
                              setShowPermissions(true)
                            }}
                            checked={showPermissions}
                            onChange={() => {}} //to remove warning message
                          />
                          <Label
                            className="form-check-label"
                            htmlFor="customRadioInline2"
                          >
                            Choose permissions
                          </Label>
                        </div>
                      </div>
                      {
                        <div className="user-management-permissions">
                          <div className="slidepermissionscontainer">
                            <div
                              className="check-group group-server slidepermissions"
                              style={{ height: showPermissions ? "435PX" : 0 }}
                            >
                              <div className="form-check d-flex align-items-center ">
                                <input
                                  disabled={loading}
                                  type="checkbox"
                                  className="form-check-input check-permission"
                                  id="customControlInline1"
                                  name="permissions"
                                  onChange={validation.handleChange}
                                  value="profile"
                                />
                                <label
                                  className="form-check-label d-flex align-items-center"
                                  htmlFor="customControlInline1"
                                >
                                  <p className="text-color-v1 text-color-v1 font-small">
                                    Modify Master Account Profile
                                  </p>
                                  <b>-</b>
                                  <span>
                                    Access and modify the client profile
                                    information
                                  </span>
                                </label>
                              </div>
                              {/* <div className="form-check d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-check-input check-permission"
                                  id="customControlInline2"
                                  name="permissions"
                                  onChange={validation.handleChange}
                                  value="contacts"
                                />
                                <label
                                  className="form-check-label d-flex align-items-center"
                                  htmlFor="customControlInline2"
                                >
                                  <p className="text-color-v1 text-color-v1 font-small">
                                    Invite team members
                                  </p>
                                  <b>-</b>
                                  <span>Access and manage contacts</span>
                                </label>
                              </div> */}
                              <div className="form-check d-flex align-items-center">
                                <input
                                  disabled={loading}
                                  type="checkbox"
                                  className="form-check-input check-permission"
                                  id="customControlInline3"
                                  name="permissions"
                                  onChange={validation.handleChange}
                                  value="products"
                                />
                                <label
                                  className="form-check-label d-flex align-items-center"
                                  htmlFor="customControlInline3"
                                >
                                  <p className="text-color-v1 text-color-v1 font-small">
                                    View Products & Services
                                  </p>
                                  <b>-</b>
                                  <span>
                                    View access to products,services and addons
                                  </span>
                                </label>
                              </div>

                              {/* <div className="form-check d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-check-input check-permission"
                                  id="customControlInline4"
                                  name="permissions"
                                  onChange={validation.handleChange}
                                  value="manageproducts"
                                />
                                <label
                                  className="form-check-label d-flex align-items-center"
                                  htmlFor="customControlInline4"
                                >
                                  <p className="text-color-v1 text-color-v1 font-small">
                                    View & Modify Product Passwords
                                  </p>
                                  <b>-</b>
                                  <span>
                                    Allow passsword resets and other actions
                                  </span>
                                </label>
                              </div> */}
                              {/* <div className="form-check d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-check-input check-permission"
                                  id="customControlInline5"
                                  name="permissions"
                                  onChange={validation.handleChange}
                                  value="productsso"
                                />
                                <label
                                  className="form-check-label d-flex align-items-center"
                                  htmlFor="customControlInline5"
                                >
                                  <p className="text-color-v1 text-color-v1 font-small">
                                    Perform Single Sign-On
                                  </p>
                                  <b>-</b>
                                  <span>
                                    Allow single sign-on into services
                                  </span>
                                </label>
                              </div> */}
                              {/* <div className="form-check d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-check-input check-permission"
                                  id="customControlInline6"
                                  name="permissions"
                                  onChange={validation.handleChange}
                                  value="domains"
                                />
                                <label
                                  className="form-check-label d-flex align-items-center"
                                  htmlFor="customControlInline6"
                                >
                                  <p className="text-color-v1 text-color-v1 font-small">
                                    View Domains
                                  </p>
                                  <b>-</b>
                                  <span>
                                    View access to domain registrations
                                  </span>
                                </label>
                              </div> */}
                              {/* <div className="form-check d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-check-input check-permission"
                                  id="customControlInline7"
                                  name="permissions"
                                  onChange={validation.handleChange}
                                  value="managedomains"
                                />
                                <label
                                  className="form-check-label d-flex align-items-center"
                                  htmlFor="customControlInline7"
                                >
                                  <p className="text-color-v1 text-color-v1 font-small">
                                    Manage Domain Settings
                                  </p>
                                  <b>-</b>
                                  <span>
                                    Allow domain management eg.
                                    nameservers/whois/transfers
                                  </span>
                                </label>
                              </div> */}
                              <div className="form-check d-flex align-items-center">
                                <input
                                  disabled={loading}
                                  type="checkbox"
                                  className="form-check-input check-permission"
                                  id="customControlInline8"
                                  name="permissions"
                                  onChange={validation.handleChange}
                                  value="invoices"
                                />
                                <label
                                  className="form-check-label d-flex align-items-center"
                                  htmlFor="customControlInline8"
                                >
                                  <p className="text-color-v1 text-color-v1 font-small">
                                    View & Pay Invoices
                                  </p>
                                  <b>-</b>
                                  <span>
                                    View and payment access to invoices
                                  </span>
                                </label>
                              </div>
                              {/* <div className="form-check d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-check-input check-permission"
                                  id="customControlInline9"
                                  name="permissions"
                                  onChange={validation.handleChange}
                                  value="quotes"
                                />
                                <label
                                  className="form-check-label d-flex align-items-center"
                                  htmlFor="customControlInline9"
                                >
                                  <p className="text-color-v1 text-color-v1 font-small">
                                    View & Accept Quotes
                                  </p>
                                  <b>-</b>
                                  <span>
                                    View and acceptance permissions for quotes
                                  </span>
                                </label>
                              </div> */}
                              <div className="form-check d-flex align-items-center">
                                <input
                                  disabled={loading}
                                  type="checkbox"
                                  className="form-check-input check-permission"
                                  id="customControlInline10"
                                  name="permissions"
                                  onChange={validation.handleChange}
                                  value="tickets"
                                />
                                <label
                                  className="form-check-label d-flex align-items-center"
                                  htmlFor="customControlInline10"
                                >
                                  <p className="text-color-v1 text-color-v1 font-small">
                                    View & Open Support Tickets
                                  </p>
                                  <b>-</b>
                                  <span>
                                    Access to open,respond and manage support
                                    tickets
                                  </span>
                                </label>
                              </div>
                              {/* <div className="form-check d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-check-input check-permission"
                                  id="customControlInline11"
                                  name="permissions"
                                  onChange={validation.handleChange}
                                  value="affiliates"
                                />
                                <label
                                  className="form-check-label d-flex align-items-center"
                                  htmlFor="customControlInline11"
                                >
                                  <p className="text-color-v1 text-color-v1 font-small">
                                    View & Manage Affiliate Accounts
                                  </p>
                                  <b>-</b>
                                  <span>
                                    Access to view and request withdrawals{" "}
                                  </span>
                                </label>
                              </div> */}
                              {/* <div className="form-check d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-check-input check-permission"
                                  id="customControlInline12"
                                  name="permissions"
                                  onChange={validation.handleChange}
                                  value="emails"
                                />
                                <label
                                  className="form-check-label d-flex align-items-center"
                                  htmlFor="customControlInline12"
                                >
                                  <p className="text-color-v1 text-color-v1 font-small">
                                    View Emails
                                  </p>
                                  <b>-</b>
                                  <span>
                                    Access to view account email history{" "}
                                  </span>
                                </label>
                              </div> */}
                              <div className="form-check d-flex align-items-center">
                                <input
                                  disabled={loading}
                                  type="checkbox"
                                  className="form-check-input check-permission"
                                  id="customControlInline13"
                                  name="permissions"
                                  onChange={validation.handleChange}
                                  value="orders"
                                />
                                <label
                                  className="form-check-label d-flex align-items-center"
                                  htmlFor="customControlInline13"
                                >
                                  <p className="text-color-v1 text-color-v1 font-small">
                                    Place New Orders/Upgrades/Cancellations
                                  </p>
                                  <b>-</b>
                                  <span>Allow placing of new orders </span>
                                </label>
                              </div>
                              <div className="form-check d-flex align-items-center">
                                <input
                                  disabled={loading}
                                  type="checkbox"
                                  className="form-check-input check-permission"
                                  id="customControlInline14"
                                  name="permissions"
                                  onChange={validation.handleChange}
                                  value="reboot"
                                />
                                <label
                                  className="form-check-label d-flex align-items-center"
                                  htmlFor="customControlInline14"
                                >
                                  <p className="text-color-v1 text-color-v1 font-small">
                                    Reboot
                                  </p>
                                  <b>-</b>
                                  <span>Allow Reboot Server</span>
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="slidepermissionscontainer">
                            <div
                              className="check-group group-server slidepermissions"
                              style={{ height: showPermissions ? "435PX" : 0 }}
                            >
                              <div className="form-check d-flex align-items-center">
                                <input
                                  disabled={loading}
                                  type="checkbox"
                                  className="form-check-input check-permission"
                                  id="customControlInline15"
                                  name="permissions"
                                  onChange={validation.handleChange}
                                  value="rescueMode"
                                />
                                <label
                                  className="form-check-label d-flex align-items-center"
                                  htmlFor="customControlInline15"
                                >
                                  <p className="text-color-v1 text-color-v1 font-small">
                                    Rescue Mode
                                  </p>
                                  <b>-</b>
                                  <span>
                                    Allow Install Server in Rescue mode
                                  </span>
                                </label>
                              </div>
                              <div className="form-check d-flex align-items-center">
                                <input
                                  disabled={loading}
                                  type="checkbox"
                                  className="form-check-input check-permission"
                                  id="customControlInline16"
                                  name="permissions"
                                  onChange={validation.handleChange}
                                  value="osReinstall"
                                />
                                <label
                                  className="form-check-label d-flex align-items-center"
                                  htmlFor="customControlInline16"
                                >
                                  <p className="text-color-v1 text-color-v1 font-small">
                                    Os Reinstall
                                  </p>
                                  <b>-</b>
                                  <span>Allow OS Reinstall on Server</span>
                                </label>
                              </div>
                              <div className="form-check d-flex align-items-center">
                                <input
                                  disabled={loading}
                                  type="checkbox"
                                  className="form-check-input check-permission"
                                  id="customControlInline17"
                                  name="permissions"
                                  onChange={validation.handleChange}
                                  value="cancelServer"
                                />
                                <label
                                  className="form-check-label d-flex align-items-center"
                                  htmlFor="customControlInline17"
                                >
                                  <p className="text-color-v1 text-color-v1 font-small">
                                    Cancel Server
                                  </p>
                                  <b>-</b>
                                  <span>Allow Reboot Server</span>
                                </label>
                              </div>
                              <div className="form-check d-flex align-items-center">
                                <input
                                  disabled={loading}
                                  type="checkbox"
                                  className="form-check-input check-permission"
                                  id="customControlInline18"
                                  name="permissions"
                                  onChange={validation.handleChange}
                                  value="overview"
                                />
                                <label
                                  className="form-check-label d-flex align-items-center"
                                  htmlFor="customControlInline18"
                                >
                                  <p className="text-color-v1 text-color-v1 font-small">
                                    Overview
                                  </p>
                                  <b>-</b>
                                  <span>Overview</span>
                                </label>
                              </div>
                              <div className="form-check d-flex align-items-center">
                                <input
                                  disabled={loading}
                                  type="checkbox"
                                  className="form-check-input check-permission"
                                  id="customControlInline19"
                                  name="permissions"
                                  onChange={validation.handleChange}
                                  value="usage"
                                />
                                <label
                                  className="form-check-label d-flex align-items-center"
                                  htmlFor="customControlInline19"
                                >
                                  <p className="text-color-v1 text-color-v1 font-small">
                                    Usage
                                  </p>
                                  <b>-</b>
                                  <span>Usage</span>
                                </label>
                              </div>
                              <div className="form-check d-flex align-items-center">
                                <input
                                  disabled={loading}
                                  type="checkbox"
                                  className="form-check-input check-permission"
                                  id="customControlInline20"
                                  name="permissions"
                                  onChange={validation.handleChange}
                                  value="IPv4Management"
                                />
                                <label
                                  className="form-check-label d-flex align-items-center"
                                  htmlFor="customControlInline20"
                                >
                                  <p className="text-color-v1 text-color-v1 font-small">
                                    IPv4 Management
                                  </p>
                                  <b>-</b>
                                  <span>IPv4 Management </span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                  </CardBody>
                </Card>
                <div className="btn-group mt-30">
                  <button
                    className="btn btn-primary w-100 waves-effect waves-light btn-save font-normal btnv1"
                    type="submit"
                    disabled={loading}
                  >
                    {spinner?.sendInvite? <div className="ui active inline loader"></div> : "Send Invite"}
                  </button>
                </div>
              </Form>
            </Col>
          </Row>
          <Modal
            isOpen={actionModal?.open}
            centered={true}
            modalClassName="manage-modal cancel-invite"
          >
            <div className="modal-header">
              <Row className="w-100">
                <Col xs="11">
                  <h5 className="modal-title mt-0">Cancel Invitation</h5>
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
                      {/* <img src={close} alt="" /> */}
                    </span>
                  </button>
                </Col>
              </Row>
            </div>
            <div className="modal-body p-0 two-factor verify">
              <h6 className="font-bold text-blue text-center">
                Do you want to cancel invitation.
              </h6>
              <div className="factor-disable-btn">
                <button
                  className="btn btn-danger waves-effect waves-light btn-green"
                  type="button"
                  onClick={() => {
                    HandleCancelInvite(actionModal?.id)
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
                  }}
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  No
                </button>
              </div>
            </div>
          </Modal>
          <Modal
            isOpen={removeModal?.open}
            centered={true}
            modalClassName="manage-modal cancel-invite"
          >
            <div className="modal-header">
              <Row className="w-100">
                <Col xs="11">
                  <h5 className="modal-title mt-0">Remove Access</h5>
                </Col>
                <Col xs="1">
                  <button
                    type="button"
                    onClick={() => {
                      setRemoveModal(false)
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
            <div className="modal-body p-0 two-factor verify">
              <h6 className="font-bold text-blue text-center">
                Do you want to remove access.
              </h6>
              <div className="factor-disable-btn">
                <button
                  className="btn btn-danger waves-effect waves-light btn-green"
                  type="button"
                  onClick={() => {
                    handleRemoveAccess(removeModal?.id)
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
                    setRemoveModal(false)
                  }}
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  No
                </button>
              </div>
            </div>
          </Modal>
        </Container>
        <TextLoader loader={loader} loading={loading}/>
      </div>
    </React.Fragment>
  )
}

export default withRouter(UserManagementv2)
