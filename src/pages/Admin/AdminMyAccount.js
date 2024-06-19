import React, { useState, useEffect } from "react"
import { Row, Col, Card, CardBody, Input, FormFeedback, Form, Button } from "reactstrap"
// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"
//redux
import { useDispatch } from "react-redux"
import { withRouter } from "react-router-dom"
import { isUserUpdated } from "../../store/auth/userdetails/actions"
import rederror from "../../assets/images/redvalidationicon/rederror.jpg"
import {
  getCountryList,
  postClientProfileDetails,
  postCountry,
  getClientInfo,
  userRole,
  storeUserData,
  loginData,
  updateProfileSilent,
  getUserDetail,
} from "../../pages/Authentication/store/apiServices"
import { Dropdown } from "semantic-ui-react"
import TextLoader from "../../components/textLoader"
import { toast } from "react-toastify"
// import PermissionDenied from "./PermissionDenied"
import { setPageTitle } from "../../helpers/api_helper_rs"
import { FocusError } from 'focus-formik-error'
import { FormatDate } from "../../helpers/api_helper_rs"
import logoGreen from "../../assets/images/c2c/logoGreen.jpg"
import { Link, useHistory } from "react-router-dom"

const AdminMyAccount = props => {
  const dispatch = useDispatch()
  const navigate = useHistory()
  const [userData, setUserData] = useState()
  const [domain, setdomain] = useState()
  const [product, setproduct] = useState()
  const [invoice, setinvoice] = useState()
  const [general, setgeneral] = useState()
  const [support, setsupport] = useState()
  const [countryList, setcountryList] = useState()
  const [stateList, setstateList] = useState()
  const [selectedCountry, setselectedCountry] = useState()
  const [selectedState, setselectedState] = useState()
  const [countryError, setcountryError] = useState(true)
  const [stateError, setstateError] = useState(false)
  const [loader, setLoader] = useState(true)
  const [role, setRole] = useState()
  const [permissionDen, setPermissionDen] = useState(false)
  const [inlineLoader, setinlineLoader] = useState(false)
  const [countryname, setcountryname] = useState("")
  const [statename, setstatename] = useState("")
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
                        <img src={logoGreen} style={{ height: "100%", width: "100%" }} />
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
                          </React.Fragment>
                          <><td></td><td></td><td></td></>
                        </tr>
                        <tr></tr>
                        <tr>
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
                        <img src={logoGreen} style={{ height: "100%", width: "100%" }} />
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
                          </React.Fragment>
                          <><td></td><td></td><td></td></>
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
