import React, { useState, useEffect } from "react"
// import { Row, Col, Card, CardBody, Input, FormFeedback, Form, Button } from "reactstrap"
// Formik Validation
// import * as Yup from "yup"
// import { useFormik } from "formik"
//redux
import { useDispatch } from "react-redux"
import { withRouter } from "react-router-dom"
import { isUserUpdated } from "../../store/auth/userdetails/actions"
// import rederror from "../../assets/images/redvalidationicon/rederror.jpg"
import {
  // getCountryList,
  // postClientProfileDetails,
  // postCountry,
  // getClientInfo,
  // userRole,
  storeUserData,
  loginData,
  // updateProfileSilent,
  getUserDetail,
} from "../../pages/Authentication/store/apiServices"
// import { Dropdown } from "semantic-ui-react"
import TextLoader from "../../components/textLoader"
// import { toast } from "react-toastify"
// import PermissionDenied from "./PermissionDenied"
import { setPageTitle } from "../../helpers/api_helper_rs"
// import { FocusError } from 'focus-formik-error'
import { FormatDate } from "../../helpers/api_helper_rs"
import logoGreen from "../../assets/images/c2c/logoGreen.jpg"
import { Link, useHistory } from "react-router-dom"

const AdminMyAccount = props => {
  const IMAGE_URL = process.env.REACT_APP_IMAGE_HOST
  const dispatch = useDispatch()
  // const navigate = useHistory()
  // const [userData, setUserData] = useState()
  // const [domain, setdomain] = useState()
  // const [product, setproduct] = useState()
  // const [invoice, setinvoice] = useState()
  // const [general, setgeneral] = useState()
  // const [support, setsupport] = useState()
  // const [countryList, setcountryList] = useState()
  // const [stateList, setstateList] = useState()
  // const [selectedCountry, setselectedCountry] = useState()
  // const [selectedState, setselectedState] = useState()
  // const [countryError, setcountryError] = useState(true)
  // const [stateError, setstateError] = useState(false)
  const [loader, setLoader] = useState(true)
  // const [role, setRole] = useState()
  // const [permissionDen, setPermissionDen] = useState(false)
  // const [inlineLoader, setinlineLoader] = useState(false)
  // const [countryname, setcountryname] = useState("")
  // const [statename, setstatename] = useState("")
  const [userInfo, setUserInfo] = useState("")

  useEffect(() => {
    setPageTitle("My Account")
    const logInfo = loginData()
    handleUserDetails(logInfo?.id)
  }, [])

  const handleUserDetails = async (userId) => {
    try {
      const result = await getUserDetail(userId)
      const info = result?.data?.data
      setUserInfo(info)
      dispatch(isUserUpdated(info))
      storeUserData(info)
      setLoader(false)
    } catch (error) {
      setLoader(false)
    }
  }

  // const validation = useFormik({
  //   // enableReinitialize : use this flag when initial values needs to be changed
  //   enableReinitialize: true,
  //   initialValues: {
  //     firstName: userData?.first_name || "",
  //     lastName: userData?.last_name || "",
  //     email: userData?.email || "",
  //     // companyName: userData?.company_name || "",
  //     phoneNumber: userData?.phone_number || "",
  //     // addressOne: userData?.address_one || "",
  //     // addressTwo: userData?.address_two || "",
  //     city: userData?.city || "",
  //     cryptoId: userData?.city || "",
  //     bankName: "",
  //     accountNumber: "",
  //     ifscCode: "",
  //     accountName: "",
  //     upiId: "",
  //     // zipCode: userData?.zip_code || "",
  //     // TaxId: userData?.tax_id || "",
  //   },
  //   validationSchema: Yup.object({
  //     firstName: Yup.string()
  //       // .required("First name required.")
  //       .matches(/^[A-Za-z]+$/, "Only albhabets are allowed."),
  //     lastName: Yup.string()
  //       // .required("Last name required.")
  //       .matches(/^[A-Za-z]+$/, "Only albhabets are allowed"),
  //     // companyName: Yup.string(),
  //     phoneNumber: Yup.string()
  //       .matches(/^([+]\d{2})?\d{10}$/, "Please enter valid Phone number."),
  //     // .required("Phone number is required."),
  //     // TaxId: Yup.string(),
  //     // addressOne: Yup.string().required("Address 1 is required."),
  //     city: Yup.string(),
  //     cryptoId: Yup.string(),
  //     bankName: Yup.string(),
  //     accountNumber: Yup.string(),
  //     accountName: Yup.string(),
  //     ifscCode: Yup.string(),
  //     upiId: Yup.string(),
  //     // .required("City is required."),
  //     // zipCode: Yup.string().required("Zip code is required."),
  //   }),
  //   onSubmit: async values => {
  //     return
  //     if (selectedCountry != undefined && selectedCountry != null && selectedCountry.length > 1) {
  //       // setcountryError(false)
  //     } else {
  //       // setcountryError(true)
  //     }
  //     // if (selectedState != undefined && selectedState != null && selectedState.length > 1) {
  //     // } else {   }

  //     let data = new URLSearchParams({
  //       first_name: values.firstName,
  //       last_name: values.lastName,
  //       company_name: values.companyName,
  //       phone_number: values.phoneNumber,
  //       address_one: values.addressOne,
  //       address_two: values.addressTwo,
  //       city: values.city,
  //       state_id: selectedState,
  //       zip_code: values.zipCode,
  //       country_id: selectedCountry,
  //       general: general,
  //       invoice: invoice,
  //       support: support,
  //       product: product,
  //       domain: true,
  //       tax_id: values.TaxId,
  //     })

  //     if (!stateError) {
  //       try {
  //         setloader(true)
  //         let res = await postClientProfileDetails(data)
  //         if (res) {
  //           handleClientInfo()
  //           setloader(false)
  //           toast.success(res.data?.message, {
  //             position: toast.POSITION.TOP_RIGHT,
  //           })

  //           let data = loginData()
  //           data.address_one = values.addressOne
  //           data.address_two = values.addressTwo
  //           data.city = values.city
  //           data.zip_code = values.zipCode
  //           data.state = statename
  //           data.country = countryname
  //           storeUserData(data)
  //           updateProfileSilent()
  //         }

  //       } catch (error) {
  //         setloader(false)
  //         toast.error(error?.response?.data?.message, {
  //           position: toast.POSITION.TOP_RIGHT,
  //         })
  //       }
  //     }
  //   },
  // })

  // const getcountry = async () => {
  //   try {
  //     let res = await getCountryList()
  //     let all = []
  //     res.data.data.map(ele => {
  //       all.push({
  //         value: ele.name,
  //         flag: (
  //           <img value={ele.id} height={15} width={15} src={ele.country_flag} />
  //         ),
  //         text: ele.name,
  //         value: ele.id,
  //       })
  //     })
  //     setcountryList(all)
  //   } catch (error) {

  //   }
  // }

  // const country = async (event, maindata) => {
  //   try {
  //     setinlineLoader(true)
  //     let data = new URLSearchParams({
  //       country_id: maindata.value,
  //     })
  //     let res = await postCountry(data)
  //     let all = []
  //     if (res) {
  //       setinlineLoader(false)

  //       res.data.data.map(ele => {
  //         all.push({ text: ele.name, value: ele.id })
  //       })
  //       setstateList(all)
  //       setselectedCountry(maindata.value)
  //       setcountryError(false)
  //     }
  //   } catch (error) {
  //     setinlineLoader(false)
  //   }
  // }

  // const state = (event, maindata) => {
  //   setselectedState(maindata.value)
  // }

  // useEffect(async () => {
  //   getcountry()
  //   if (role) {
  //     try {
  //       setloader(true)
  //       let userInfo = await handleClientInfo()
  //       let user = userInfo
  //       if (user) {
  //         setloader(false)
  //         setPermissionDen(false)
  //         setgeneral(user.general)
  //         setinvoice(user.invoice)
  //         setdomain(user.domain)
  //         setproduct(user.product)
  //         setsupport(user.support)
  //         if (user?.state_id != null && (user?.state_id).length > 0) {
  //           setselectedState(user?.state_id)
  //         } else {
  //           setselectedState("n")
  //         }
  //         if (user?.country_id != null && (user?.country_id).length > 0) {
  //           try {
  //             setcountryError(false)
  //             setselectedCountry(user.country_id)
  //             let data = new URLSearchParams({
  //               country_id: user.country_id,
  //             })
  //             let res = await postCountry(data)
  //             let all = []
  //             res.data.data.map(ele => {
  //               all.push({ text: ele.name, value: ele.id })
  //             })
  //             setstateList(all)
  //           } catch (error) { }
  //         } else {
  //           setselectedCountry("n")
  //         }
  //       }
  //     } catch (err) {
  //       setloader(false)
  //       if (err?.response?.data?.status_code == 403) {
  //         setPermissionDen(true)
  //       }
  //       if (err?.response?.data?.status_code != 401) {
  //         setPermissionDen(true)
  //         toast.error(err?.response?.data?.message, {
  //           position: toast.POSITION.TOP_RIGHT,
  //         })
  //       }
  //     }
  //   }
  // }, [role])

  // const setEmailprefrence = (name, event) => {
  //   if (name == "invoice") {
  //     setinvoice(!invoice)
  //   } else if (name == "general") {
  //     setgeneral(!general)
  //   } else if (name == "support") {
  //     setsupport(!support)
  //   } else if (name == "product") {
  //     setproduct(!product)
  //   } else if (name == "domain") {
  //     setdomain(!domain)
  //   }
  // }

  // const handleClientInfo = async () => {
  //   try {
  //     let res = await getClientInfo()
  //     if (role == "client") {
  //       dispatch(isUserUpdated(res?.data?.data))
  //       storeUserData(res?.data?.data)
  //     }
  //     setUserData(res?.data?.data)
  //     setPermissionDen(false)
  //     setloader(false)
  //     return res?.data?.data
  //   } catch (error) {
  //     setloader(false)
  //     if (error?.response?.data?.status_code == 403) {
  //       setPermissionDen(true)
  //     }
  //     toast.error(error?.response?.data?.message, {
  //       position: toast.POSITION.TOP_RIGHT,
  //     })
  //   }
  // }

  return (
    <React.Fragment>
      <div
        className={
          loader
            ? "page-content my-account overlayerloader"
            : "page-content my-account"
        }
      >

        <div className="my-account-header">
          <h5 className="info_heding">Personal Details</h5>
          <Link to={{
            pathname: "/admin/update",
            state: {
              userInfo: userInfo
            }
          }} className="btn btn-primary">Edit Profile</Link>
        </div>
        <div>
          <div className="row">
            <div className="col-md-12">
              <div className="tab_content tab-data-table">
                <div className="row">
                  <div className="col-md-6">
                    <table className="w-100">
                      <tbody>
                        <tr>
                          <th>Member Id</th>
                          <React.Fragment>
                            <td className="text-right">
                              {userInfo?.user_name}
                            </td>
                          </React.Fragment>
                          <><td></td><td></td><td></td></>
                        </tr>

                        <tr></tr>
                        <tr>
                          <th>Mobile</th>
                          <React.Fragment>
                            <td className="text-right">
                              {userInfo?.country_code}{" "}
                              {userInfo?.phone_number}
                            </td>
                          </React.Fragment>
                          <><td></td><td></td><td></td></>
                        </tr>
                        <tr></tr>
                        {/* <tr>
                          <th>Date of Joining</th>
                          <React.Fragment>
                            <td className="text-right">
                              {FormatDate(userInfo?.joining_date)}
                            </td>
                          </React.Fragment>
                          <><td></td><td></td><td></td></>
                        </tr> */}
                        {/* <tr></tr> */}

                        <tr>
                          <th>Address</th>
                          <React.Fragment>
                            <td className="text-right">
                              {userInfo?.address}
                            </td>
                          </React.Fragment>
                          <><td></td><td></td><td></td></>
                        </tr>
                        <tr></tr>
                        <tr>
                          <th>Zip Code</th>
                          <React.Fragment>
                            <td className="text-right">
                              {userInfo?.zip_code}
                            </td>
                          </React.Fragment>
                          <><td></td><td></td><td></td></>
                        </tr>
                        <tr></tr>
                        {/* <tr>
                          <th>Account Type</th>
                          <React.Fragment>
                            <td className="text-right">
                              Registeration
                            </td>
                          </React.Fragment>
                          <><td></td><td></td><td></td></>
                        </tr> */}
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <table className="w-100">
                      <tbody>
                        <tr>
                          <th>Member Name</th>
                          <React.Fragment>
                            <td className="text-right">
                              {userInfo?.first_name} {userInfo?.last_name}
                            </td>
                          </React.Fragment>
                          <><td></td><td></td><td></td></>
                        </tr>
                        <tr></tr>
                        <tr>
                          <th>Email</th>
                          <React.Fragment>
                            <td className="text-right">
                              {userInfo?.email}
                            </td>
                          </React.Fragment>
                          <><td></td><td></td><td></td></>
                        </tr>
                        <tr></tr>
                        {/* <tr>
                          <th>Account Status</th>
                          <React.Fragment>
                            <td className="text-right">

                            </td>
                          </React.Fragment>
                          <><td></td><td></td><td></td></>
                        </tr>
                        <tr></tr> */}
                        <tr>
                          <th>City</th>
                          <React.Fragment>
                            <td className="text-right">
                              {userInfo?.city}
                            </td>
                          </React.Fragment>
                          <><td></td><td></td><td></td></>
                        </tr>
                        <tr></tr>
                        <tr>
                          <th>Country</th>
                          <React.Fragment>
                            <td className="text-right">
                              {userInfo?.country_name}
                            </td>
                          </React.Fragment>
                          <><td></td><td></td><td></td></>
                        </tr>
                        <tr></tr>

                        {/* <tr>
                          <th>Sponser</th>
                          <React.Fragment>
                            <td className="text-right">
                              Registeration
                            </td>
                          </React.Fragment>
                          <><td></td><td></td><td></td></>
                        </tr> */}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <div>
          <div className="row">
            <div className="col-md-12">
              <h5 className="info_heding">Bank Details</h5>
              <div className="tab_content tab-data-table">
                <div className="row">
                  <div className="col-md-6">
                    <table className="w-100">
                      <tbody>
                        <img src={userInfo?.account_image ? (IMAGE_URL + userInfo?.account_image) : logoGreen} style={{ height: "100%", width: "100%" }} />
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <table className="w-100">
                      <tbody>
                        <tr>
                          <th>Bank Name</th>
                          <React.Fragment>
                            <td className="text-right">
                              {userInfo?.bank_name}
                            </td>
                            <td></td>
                            <td></td>
                            <td>
                              <svg
                                onClick={() => {
                                  copy(userInfo?.bank_name);
                                  toast("Bank name has been copied.", {
                                    autoClose: 1000,
                                  });
                                }}
                                className="pw-icon-pass"
                                width="13"
                                height="17"
                                viewBox="0 0 15 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M2.02526 16.4685C1.8004 16.4153 1.58059 16.3427 1.36827 16.2515C1.07612 16.1087 0.830075 15.8867 0.65819 15.6106C0.486306 15.3346 0.395472 15.0156 0.396227 14.6905C0.379227 14.1735 0.396227 13.6564 0.396227 13.1394C0.396227 10.6354 0.396227 8.13178 0.396227 5.62845C0.405174 5.19207 0.572476 4.77374 0.866808 4.45144C1.16114 4.12915 1.56255 3.9249 1.99633 3.87649C2.45233 3.84249 2.91227 3.87039 3.38927 3.87039V4.00247C3.38927 6.21447 3.37827 8.42646 3.39427 10.6385C3.37907 11.1864 3.52846 11.7263 3.82311 12.1885C4.11775 12.6507 4.54409 13.014 5.04723 13.2315C5.42622 13.4071 5.84075 13.4926 6.25829 13.4815H12.3423C12.3423 13.8745 12.3483 14.2545 12.3423 14.6345C12.3431 14.7976 12.3219 14.96 12.2793 15.1175C12.1904 15.4667 11.9978 15.781 11.7268 16.0186C11.4558 16.2562 11.1191 16.4061 10.7612 16.4485C10.7428 16.453 10.725 16.4597 10.7082 16.4685H2.02526Z"
                                  fill="#9F9EB2"
                                />
                                <path
                                  d="M4.37758 6.50446C4.37758 5.13246 4.37758 3.76019 4.37758 2.38752C4.37009 2.09061 4.43648 1.79651 4.57069 1.53156C4.70491 1.26662 4.9028 1.03905 5.14662 0.869455C5.43858 0.650757 5.79381 0.533193 6.15858 0.534494C8.51192 0.530494 10.8646 0.530494 13.2166 0.534494C13.6825 0.543533 14.1271 0.731573 14.4583 1.0594C14.7894 1.38722 14.9818 1.8297 14.9956 2.29548C15.0056 3.36048 14.9956 4.42568 14.9956 5.49568C14.9956 7.20634 14.9956 8.91685 14.9956 10.6275C15.0066 11.0475 14.8709 11.4583 14.612 11.7891C14.353 12.12 13.9869 12.3502 13.5766 12.4405C13.4481 12.4706 13.3165 12.4854 13.1846 12.4844C10.8513 12.4844 8.51792 12.4844 6.18459 12.4844C5.70827 12.4847 5.25107 12.297 4.91249 11.962C4.57391 11.627 4.38135 11.1719 4.3766 10.6956C4.3686 9.29563 4.3766 7.90461 4.3766 6.50862L4.37758 6.50446Z"
                                  fill="#9F9EB2"
                                />
                              </svg>
                            </td>
                          </React.Fragment>
                          {/* <><td></td><td></td><td></td></> */}
                        </tr>
                        <tr></tr>
                        <tr>
                          <th>Account Number</th>
                          <React.Fragment>
                            <td className="text-right">
                              {userInfo?.account_number}
                            </td>
                            <td></td>
                            <td></td>
                            <td>
                              <svg
                                onClick={() => {
                                  copy(userInfo?.account_number);
                                  toast("Account number has been copied.", {
                                    autoClose: 1000,
                                  });
                                }}
                                className="pw-icon-pass"
                                width="13"
                                height="17"
                                viewBox="0 0 15 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M2.02526 16.4685C1.8004 16.4153 1.58059 16.3427 1.36827 16.2515C1.07612 16.1087 0.830075 15.8867 0.65819 15.6106C0.486306 15.3346 0.395472 15.0156 0.396227 14.6905C0.379227 14.1735 0.396227 13.6564 0.396227 13.1394C0.396227 10.6354 0.396227 8.13178 0.396227 5.62845C0.405174 5.19207 0.572476 4.77374 0.866808 4.45144C1.16114 4.12915 1.56255 3.9249 1.99633 3.87649C2.45233 3.84249 2.91227 3.87039 3.38927 3.87039V4.00247C3.38927 6.21447 3.37827 8.42646 3.39427 10.6385C3.37907 11.1864 3.52846 11.7263 3.82311 12.1885C4.11775 12.6507 4.54409 13.014 5.04723 13.2315C5.42622 13.4071 5.84075 13.4926 6.25829 13.4815H12.3423C12.3423 13.8745 12.3483 14.2545 12.3423 14.6345C12.3431 14.7976 12.3219 14.96 12.2793 15.1175C12.1904 15.4667 11.9978 15.781 11.7268 16.0186C11.4558 16.2562 11.1191 16.4061 10.7612 16.4485C10.7428 16.453 10.725 16.4597 10.7082 16.4685H2.02526Z"
                                  fill="#9F9EB2"
                                />
                                <path
                                  d="M4.37758 6.50446C4.37758 5.13246 4.37758 3.76019 4.37758 2.38752C4.37009 2.09061 4.43648 1.79651 4.57069 1.53156C4.70491 1.26662 4.9028 1.03905 5.14662 0.869455C5.43858 0.650757 5.79381 0.533193 6.15858 0.534494C8.51192 0.530494 10.8646 0.530494 13.2166 0.534494C13.6825 0.543533 14.1271 0.731573 14.4583 1.0594C14.7894 1.38722 14.9818 1.8297 14.9956 2.29548C15.0056 3.36048 14.9956 4.42568 14.9956 5.49568C14.9956 7.20634 14.9956 8.91685 14.9956 10.6275C15.0066 11.0475 14.8709 11.4583 14.612 11.7891C14.353 12.12 13.9869 12.3502 13.5766 12.4405C13.4481 12.4706 13.3165 12.4854 13.1846 12.4844C10.8513 12.4844 8.51792 12.4844 6.18459 12.4844C5.70827 12.4847 5.25107 12.297 4.91249 11.962C4.57391 11.627 4.38135 11.1719 4.3766 10.6956C4.3686 9.29563 4.3766 7.90461 4.3766 6.50862L4.37758 6.50446Z"
                                  fill="#9F9EB2"
                                />
                              </svg>
                            </td>
                          </React.Fragment>
                          {/* <><td></td><td></td><td></td></> */}
                        </tr>
                        <tr></tr>
                        <tr>
                          <th>{"Account Holder's Name"}</th>
                          <React.Fragment>
                            <td className="text-right">
                              {userInfo?.account_holder_name}
                            </td>
                            <td></td>
                            <td></td>
                            <td>
                              <svg
                                onClick={() => {
                                  copy(userInfo?.account_holder_name);
                                  toast("Account holder's name has been copied.", {
                                    autoClose: 1000,
                                  });
                                }}
                                className="pw-icon-pass"
                                width="13"
                                height="17"
                                viewBox="0 0 15 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M2.02526 16.4685C1.8004 16.4153 1.58059 16.3427 1.36827 16.2515C1.07612 16.1087 0.830075 15.8867 0.65819 15.6106C0.486306 15.3346 0.395472 15.0156 0.396227 14.6905C0.379227 14.1735 0.396227 13.6564 0.396227 13.1394C0.396227 10.6354 0.396227 8.13178 0.396227 5.62845C0.405174 5.19207 0.572476 4.77374 0.866808 4.45144C1.16114 4.12915 1.56255 3.9249 1.99633 3.87649C2.45233 3.84249 2.91227 3.87039 3.38927 3.87039V4.00247C3.38927 6.21447 3.37827 8.42646 3.39427 10.6385C3.37907 11.1864 3.52846 11.7263 3.82311 12.1885C4.11775 12.6507 4.54409 13.014 5.04723 13.2315C5.42622 13.4071 5.84075 13.4926 6.25829 13.4815H12.3423C12.3423 13.8745 12.3483 14.2545 12.3423 14.6345C12.3431 14.7976 12.3219 14.96 12.2793 15.1175C12.1904 15.4667 11.9978 15.781 11.7268 16.0186C11.4558 16.2562 11.1191 16.4061 10.7612 16.4485C10.7428 16.453 10.725 16.4597 10.7082 16.4685H2.02526Z"
                                  fill="#9F9EB2"
                                />
                                <path
                                  d="M4.37758 6.50446C4.37758 5.13246 4.37758 3.76019 4.37758 2.38752C4.37009 2.09061 4.43648 1.79651 4.57069 1.53156C4.70491 1.26662 4.9028 1.03905 5.14662 0.869455C5.43858 0.650757 5.79381 0.533193 6.15858 0.534494C8.51192 0.530494 10.8646 0.530494 13.2166 0.534494C13.6825 0.543533 14.1271 0.731573 14.4583 1.0594C14.7894 1.38722 14.9818 1.8297 14.9956 2.29548C15.0056 3.36048 14.9956 4.42568 14.9956 5.49568C14.9956 7.20634 14.9956 8.91685 14.9956 10.6275C15.0066 11.0475 14.8709 11.4583 14.612 11.7891C14.353 12.12 13.9869 12.3502 13.5766 12.4405C13.4481 12.4706 13.3165 12.4854 13.1846 12.4844C10.8513 12.4844 8.51792 12.4844 6.18459 12.4844C5.70827 12.4847 5.25107 12.297 4.91249 11.962C4.57391 11.627 4.38135 11.1719 4.3766 10.6956C4.3686 9.29563 4.3766 7.90461 4.3766 6.50862L4.37758 6.50446Z"
                                  fill="#9F9EB2"
                                />
                              </svg>
                            </td>
                          </React.Fragment>
                          {/* <><td></td><td></td><td></td></> */}
                        </tr>
                        <tr></tr>
                        <tr>
                          <th>IFSC Code</th>
                          <React.Fragment>
                            <td className="text-right">
                              {userInfo?.ifsc_code}
                            </td>
                            <td></td>
                            <td></td>
                            <td>
                              <svg
                                onClick={() => {
                                  copy(userInfo?.ifsc_code);
                                  toast("IFSC code has been copied.", {
                                    autoClose: 1000,
                                  });
                                }}
                                className="pw-icon-pass"
                                width="13"
                                height="17"
                                viewBox="0 0 15 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M2.02526 16.4685C1.8004 16.4153 1.58059 16.3427 1.36827 16.2515C1.07612 16.1087 0.830075 15.8867 0.65819 15.6106C0.486306 15.3346 0.395472 15.0156 0.396227 14.6905C0.379227 14.1735 0.396227 13.6564 0.396227 13.1394C0.396227 10.6354 0.396227 8.13178 0.396227 5.62845C0.405174 5.19207 0.572476 4.77374 0.866808 4.45144C1.16114 4.12915 1.56255 3.9249 1.99633 3.87649C2.45233 3.84249 2.91227 3.87039 3.38927 3.87039V4.00247C3.38927 6.21447 3.37827 8.42646 3.39427 10.6385C3.37907 11.1864 3.52846 11.7263 3.82311 12.1885C4.11775 12.6507 4.54409 13.014 5.04723 13.2315C5.42622 13.4071 5.84075 13.4926 6.25829 13.4815H12.3423C12.3423 13.8745 12.3483 14.2545 12.3423 14.6345C12.3431 14.7976 12.3219 14.96 12.2793 15.1175C12.1904 15.4667 11.9978 15.781 11.7268 16.0186C11.4558 16.2562 11.1191 16.4061 10.7612 16.4485C10.7428 16.453 10.725 16.4597 10.7082 16.4685H2.02526Z"
                                  fill="#9F9EB2"
                                />
                                <path
                                  d="M4.37758 6.50446C4.37758 5.13246 4.37758 3.76019 4.37758 2.38752C4.37009 2.09061 4.43648 1.79651 4.57069 1.53156C4.70491 1.26662 4.9028 1.03905 5.14662 0.869455C5.43858 0.650757 5.79381 0.533193 6.15858 0.534494C8.51192 0.530494 10.8646 0.530494 13.2166 0.534494C13.6825 0.543533 14.1271 0.731573 14.4583 1.0594C14.7894 1.38722 14.9818 1.8297 14.9956 2.29548C15.0056 3.36048 14.9956 4.42568 14.9956 5.49568C14.9956 7.20634 14.9956 8.91685 14.9956 10.6275C15.0066 11.0475 14.8709 11.4583 14.612 11.7891C14.353 12.12 13.9869 12.3502 13.5766 12.4405C13.4481 12.4706 13.3165 12.4854 13.1846 12.4844C10.8513 12.4844 8.51792 12.4844 6.18459 12.4844C5.70827 12.4847 5.25107 12.297 4.91249 11.962C4.57391 11.627 4.38135 11.1719 4.3766 10.6956C4.3686 9.29563 4.3766 7.90461 4.3766 6.50862L4.37758 6.50446Z"
                                  fill="#9F9EB2"
                                />
                              </svg>
                            </td>
                          </React.Fragment>
                          {/* <><td></td><td></td><td></td></> */}
                        </tr>
                        <tr></tr>
                        <tr>
                          <th>UPI ID</th>
                          <React.Fragment>
                            <td className="text-right">
                              {userInfo?.upi_id}
                            </td>
                            <td></td>
                            <td></td>
                            <td>
                              <svg
                                onClick={() => {
                                  copy(userInfo?.upi_id);
                                  toast("UPI ID has been copied.", {
                                    autoClose: 1000,
                                  });
                                }}
                                className="pw-icon-pass"
                                width="13"
                                height="17"
                                viewBox="0 0 15 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M2.02526 16.4685C1.8004 16.4153 1.58059 16.3427 1.36827 16.2515C1.07612 16.1087 0.830075 15.8867 0.65819 15.6106C0.486306 15.3346 0.395472 15.0156 0.396227 14.6905C0.379227 14.1735 0.396227 13.6564 0.396227 13.1394C0.396227 10.6354 0.396227 8.13178 0.396227 5.62845C0.405174 5.19207 0.572476 4.77374 0.866808 4.45144C1.16114 4.12915 1.56255 3.9249 1.99633 3.87649C2.45233 3.84249 2.91227 3.87039 3.38927 3.87039V4.00247C3.38927 6.21447 3.37827 8.42646 3.39427 10.6385C3.37907 11.1864 3.52846 11.7263 3.82311 12.1885C4.11775 12.6507 4.54409 13.014 5.04723 13.2315C5.42622 13.4071 5.84075 13.4926 6.25829 13.4815H12.3423C12.3423 13.8745 12.3483 14.2545 12.3423 14.6345C12.3431 14.7976 12.3219 14.96 12.2793 15.1175C12.1904 15.4667 11.9978 15.781 11.7268 16.0186C11.4558 16.2562 11.1191 16.4061 10.7612 16.4485C10.7428 16.453 10.725 16.4597 10.7082 16.4685H2.02526Z"
                                  fill="#9F9EB2"
                                />
                                <path
                                  d="M4.37758 6.50446C4.37758 5.13246 4.37758 3.76019 4.37758 2.38752C4.37009 2.09061 4.43648 1.79651 4.57069 1.53156C4.70491 1.26662 4.9028 1.03905 5.14662 0.869455C5.43858 0.650757 5.79381 0.533193 6.15858 0.534494C8.51192 0.530494 10.8646 0.530494 13.2166 0.534494C13.6825 0.543533 14.1271 0.731573 14.4583 1.0594C14.7894 1.38722 14.9818 1.8297 14.9956 2.29548C15.0056 3.36048 14.9956 4.42568 14.9956 5.49568C14.9956 7.20634 14.9956 8.91685 14.9956 10.6275C15.0066 11.0475 14.8709 11.4583 14.612 11.7891C14.353 12.12 13.9869 12.3502 13.5766 12.4405C13.4481 12.4706 13.3165 12.4854 13.1846 12.4844C10.8513 12.4844 8.51792 12.4844 6.18459 12.4844C5.70827 12.4847 5.25107 12.297 4.91249 11.962C4.57391 11.627 4.38135 11.1719 4.3766 10.6956C4.3686 9.29563 4.3766 7.90461 4.3766 6.50862L4.37758 6.50446Z"
                                  fill="#9F9EB2"
                                />
                              </svg>
                            </td>
                          </React.Fragment>
                          {/* <><td></td><td></td><td></td></> */}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <br />
              </div>
            </div>
          </div>
        </div>
        <br />
        <div>
          <div className="row">
            <div className="col-md-12">
              <h5 className="info_heding">Crypto Details</h5>
              <div className="tab_content tab-data-table">
                <div className="row">
                  <div className="col-md-6">
                    <table className="w-100">
                      <tbody>
                        <img src={userInfo?.crypto_image ? (IMAGE_URL + userInfo?.crypto_image) : logoGreen} style={{ height: "100%", width: "100%" }} />
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <table className="w-100">
                      <tbody>
                        <tr>
                          <th>Crypto Address</th>
                          <React.Fragment>
                            <td className="text-right">
                              {userInfo?.crypto_id}
                            </td>
                            <td></td>
                            <td></td>
                            <td>
                              <svg
                                onClick={() => {
                                  copy(userInfo?.crypto_id);
                                  toast("Crypto Address has been copied.", {
                                    autoClose: 1000,
                                  });
                                }}
                                className="pw-icon-pass"
                                width="13"
                                height="17"
                                viewBox="0 0 15 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M2.02526 16.4685C1.8004 16.4153 1.58059 16.3427 1.36827 16.2515C1.07612 16.1087 0.830075 15.8867 0.65819 15.6106C0.486306 15.3346 0.395472 15.0156 0.396227 14.6905C0.379227 14.1735 0.396227 13.6564 0.396227 13.1394C0.396227 10.6354 0.396227 8.13178 0.396227 5.62845C0.405174 5.19207 0.572476 4.77374 0.866808 4.45144C1.16114 4.12915 1.56255 3.9249 1.99633 3.87649C2.45233 3.84249 2.91227 3.87039 3.38927 3.87039V4.00247C3.38927 6.21447 3.37827 8.42646 3.39427 10.6385C3.37907 11.1864 3.52846 11.7263 3.82311 12.1885C4.11775 12.6507 4.54409 13.014 5.04723 13.2315C5.42622 13.4071 5.84075 13.4926 6.25829 13.4815H12.3423C12.3423 13.8745 12.3483 14.2545 12.3423 14.6345C12.3431 14.7976 12.3219 14.96 12.2793 15.1175C12.1904 15.4667 11.9978 15.781 11.7268 16.0186C11.4558 16.2562 11.1191 16.4061 10.7612 16.4485C10.7428 16.453 10.725 16.4597 10.7082 16.4685H2.02526Z"
                                  fill="#9F9EB2"
                                />
                                <path
                                  d="M4.37758 6.50446C4.37758 5.13246 4.37758 3.76019 4.37758 2.38752C4.37009 2.09061 4.43648 1.79651 4.57069 1.53156C4.70491 1.26662 4.9028 1.03905 5.14662 0.869455C5.43858 0.650757 5.79381 0.533193 6.15858 0.534494C8.51192 0.530494 10.8646 0.530494 13.2166 0.534494C13.6825 0.543533 14.1271 0.731573 14.4583 1.0594C14.7894 1.38722 14.9818 1.8297 14.9956 2.29548C15.0056 3.36048 14.9956 4.42568 14.9956 5.49568C14.9956 7.20634 14.9956 8.91685 14.9956 10.6275C15.0066 11.0475 14.8709 11.4583 14.612 11.7891C14.353 12.12 13.9869 12.3502 13.5766 12.4405C13.4481 12.4706 13.3165 12.4854 13.1846 12.4844C10.8513 12.4844 8.51792 12.4844 6.18459 12.4844C5.70827 12.4847 5.25107 12.297 4.91249 11.962C4.57391 11.627 4.38135 11.1719 4.3766 10.6956C4.3686 9.29563 4.3766 7.90461 4.3766 6.50862L4.37758 6.50446Z"
                                  fill="#9F9EB2"
                                />
                              </svg>
                            </td>
                          </React.Fragment>
                          {/* <><td></td><td></td><td></td></> */}
                        </tr>
                        <tr></tr>
                        {/* <tr>
                          <th>Account Number</th>
                          <React.Fragment>
                            <td className="text-right">
                              {userInfo?.account_number}
                            </td>
                          </React.Fragment>
                          <><td></td><td></td><td></td></>
                        </tr>
                        <tr></tr>
                        <tr>
                          <th>{"Account Holder's Name"}</th>
                          <React.Fragment>
                            <td className="text-right">
                              {FormatDate(userInfo?.account_holder_name)}
                            </td>
                          </React.Fragment>
                          <><td></td><td></td><td></td></>
                        </tr>
                        <tr></tr>
                        <tr>
                          <th>IFSC Code</th>
                          <React.Fragment>
                            <td className="text-right">
                              {userInfo?.ifsc_code}
                            </td>
                          </React.Fragment>
                          <><td></td><td></td><td></td></>
                        </tr>
                        <tr></tr>
                        <tr>
                          <th>UPI ID</th>
                          <React.Fragment>
                            <td className="text-right">
                              {userInfo?.upi_id}
                            </td>
                          </React.Fragment>
                          <><td></td><td></td><td></td></>
                        </tr> */}
                      </tbody>
                    </table>
                  </div>
                </div>
                <br />
              </div>
            </div>
          </div>
        </div>
        <TextLoader loading={loader} loader={loader} />
      </div>
    </React.Fragment>
  )
}

export default withRouter(AdminMyAccount)
