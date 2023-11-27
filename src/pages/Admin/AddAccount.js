import React, { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Label,
  CardBody,
  Input,
  FormFeedback,
  Form,
} from "reactstrap"
import file from "../../assets/images/file.png";

// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"

//redux
import { useDispatch } from "react-redux"
import { withRouter } from "react-router-dom"

//actions
import { isUserUpdated } from "../../store/auth/userdetails/actions"

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb"
import {
  userInfo, //check this funtion
  postUserProfileDetails,
  getUserInfo,
  storeUserData,
  loginData,
} from "../Authentication/store/apiServices"
import { customRegex } from "../../helpers/validation_helpers"
import rederror from "../../assets/images/redvalidationicon/rederror.jpg"
import TextLoader from "../../components/textLoader"
import { toast } from "react-toastify"
import del from "../../assets/images/Delete.svg";

const AddAccount = props => {
  const dispatch = useDispatch()
  const [userDetail, setUserDetail] = useState("")
  const [loader, setloader] = useState("")
  const [bankScanner, setBankScanner] = useState([]);
  const [cryptoScanner, setCryptoScanner] = useState([]);
  const [spinner, setSpinner] = useState(false)
  const [errorMsg, setErrorMsg] = useState("");

  const success = false
  const error = false

//   useEffect(async () => {
//     getUsersInfo()
//   }, [])


//   const getUsersInfo = async() => {
//     try{
//       setloader(true)
//       let info = await userInfo()
//       if(info){
//         setloader(false)
//         setUserDetail(info)
//       }else {
//         handleuserInfo()
//       }
//     }catch(error){
//       setloader(false)
//     }
//   }

const handleBankScanner = (event) => {
  const file = event.target.files[0];
  if (file) {
    const fileSize = file.size / 1024 / 1024; // in MB
    const fileType = file.type.split("/")[1]; // get file extension

    // Validate file size (10MB max)
    if (fileSize > 20) {
      setErrorMsg("File size should be less than 20 MB");
    } else {
      // Validate file extension
      if (fileType === "jpg" || fileType === "jpeg" || fileType === "png" ) {
        setBankScanner(file);
        setErrorMsg("");
      } else {
        setErrorMsg(
          "Only JPG, PNG and JPEG files are allowed"
        );
      }
    }
  }
};

const handleCryptoScanner = (event) => {
  const file = event.target.files[0];
  if (file) {
    const fileSize = file.size / 1024 / 1024; // in MB
    const fileType = file.type.split("/")[1]; // get file extension

    // Validate file size (10MB max)
    if (fileSize > 20) {
      setErrorMsg("File size should be less than 20 MB");
    } else {
      // Validate file extension
      if (fileType === "jpg" || fileType === "jpeg" || fileType === "png" ) {
        setCryptoScanner(file);
        setErrorMsg("");
      } else {
        setErrorMsg(
          "Only JPG, PNG and JPEG files are allowed"
        );
      }
    }
  }
};

  const bankForm = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      bankName: "",
      accountHolder: "",
      accountNumber: "",
      ifscCode: "",
    },
    validationSchema: Yup.object({
        bankName: Yup.string()
            .required("Please enter your bank name.")
            .matches(customRegex.userName, "Only albhabets are allowed.")
            .min(3, "Bank name must be minimum 3 characters long.")
            .max(50, "Bank name must be maximum 50 characters long."),
        accountHolder: Yup.string()
            .required("Please enter your account holder's name.")
            .matches(customRegex.userName, "Only albhabets are allowed.")
            .min(3, "Account holder's name must be minimum 3 characters long")
            .max(50, "Account holder's name must be maximum 50 characters long"),
        accountNumber: Yup.string()
            .required("Please enter your account number.")
            .matches(customRegex.accountNumberRegex, "Please enter valid account number"),
        ifscCode: Yup.string()
            .required("Please enter ifsc code.")
            .matches(customRegex.ifscRegex, "Please enter valid ifsc code"),
    }),
    onSubmit: async values => {
      console.log("values", values)
      return
      // setloader(true)
      try {
        let data = new URLSearchParams({
          bankName: values?.bankName,
          accountHolder: values?.accountHolder,
          accountNumber: values?.accountNumber,
          ifscCode: values?.ifscCode,
        })
        if(bankScanner){
          data.append("bankScanner", bankScanner);
        }
        let result = await postUserProfileDetails(data)
        if (result) {
          toast.success(result.data?.message, {
            position: toast.POSITION.TOP_RIGHT,
          })
        }
        setloader(false)
        handleuserInfo()
        // dispatch(isUserUpdated(values))
      } catch (error) {
        setloader(false)
        setloading(false)
        toast.error(error?.response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      }
    },
  })

  const cryptoForm = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      cryptoAddress: "",
      cryptoId: "",
    },
    validationSchema: Yup.object({
      cryptoAddress: Yup.string()
          .required("Please enter your bank name.")
          .matches(customRegex.userName, "Only albhabets are allowed.")
          .min(3, "Bank name must be minimum 3 characters long.")
          .max(50, "Bank name must be maximum 50 characters long."),
      cryptoId: Yup.string()
          .required("Please enter your account holder's name.")
          .matches(customRegex.userName, "Only albhabets are allowed.")
          .min(3, "Account holder's name must be minimum 3 characters long")
          .max(50, "Account holder's name must be maximum 50 characters long"),
    }),
    onSubmit: async values => {
      console.log("values", values)
      return
      setloader(true)
      try {
        let data = new URLSearchParams({
          cryptoAddress: values?.cryptoAddress,
          cryptoId: values?.cryptoId,
        })

        if(cryptoScanner){
          data.append("bankScanner", cryptoScanner);
        }
        let result = await postUserProfileDetails(data)
        if (result) {
          toast.success(result.data?.message, {
            position: toast.POSITION.TOP_RIGHT,
          })
        }
        setloader(false)
        handleuserInfo()
        // dispatch(isUserUpdated(values))
      } catch (error) {
        setloader(false)
        setloading(false)
        toast.error(error?.response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      }
    },
  })

//   const handleuserInfo = async() => {
//     try{
//       let res = await getUserInfo()
//       if(res){
//         let info = res?.data?.data
//         setUserDetail(info)
//         setloader(false)
//         let data = loginData()
//         data.first_name = info?.first_name
//         data.last_name = info?.last_name
//         storeUserData(data)
//         dispatch(isUserUpdated(data))
//       }
//     }catch(error) {
//       setloader(false)
//      }
//   }

  return (
    <React.Fragment>
      <div className={loader ? "page-content overlayerloader" : "page-content"}>
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumb title="Minible" breadcrumbItem="User account details" />

          <Row>
            <Col lg="12">
              {/* {error && error ? <Alert color="danger">{error}</Alert> : null}
              {success ? <Alert color="success">{success}</Alert> : null} */}
              <Form
                className="form-horizontal floating-form my-account"
                onSubmit={(e) => {
                  e.preventDefault()
                  bankForm.handleSubmit()
                  return false
                }}
              >
                <Card>
                  <CardBody>
                    <div className="my-account-header">
                      <h6 className="font16  font-semibold">Add Bank Account</h6>
                    </div>
                    <Row>
                        <Col lg="6">
                        <Label >Bank Name</Label>
                            <Input
                            name="bankName"
                            // className="mt-3"
                            placeholder="Bank Name"
                            type="text"
                            onChange={bankForm.handleChange}
                            onBlur={bankForm.handleBlur}
                            value={bankForm.values.bankName || ""}
                            invalid={
                                bankForm.touched.bankName &&
                                bankForm.errors.bankName
                                ? true
                                : false
                            }
                            />
                            {bankForm.touched.bankName &&
                            bankForm.errors.bankName ? (
                            <>
                                <FormFeedback type="invalid">
                                <img
                                    className="form-error-icon"
                                    src={rederror}
                                    alt=""
                                    height={15}
                                />
                                {bankForm.errors.bankName}
                                </FormFeedback>
                            </>
                            ) : null}
                        </Col>
                      <Col lg="6">
                      <Label >{"Account Holder's Name"}</Label>
                        <Input
                          name="accountHolder"
                        //   className="mt-3"
                          placeholder={"Account Holder's Name"}
                          type="text"
                          onChange={bankForm.handleChange}
                          onBlur={bankForm.handleBlur}
                          value={bankForm.values.accountHolder || ""}
                          invalid={
                            bankForm.touched.accountHolder &&
                            bankForm.errors.accountHolder
                              ? true
                              : false
                          }
                        />
                        {bankForm.touched.accountHolder &&
                        bankForm.errors.accountHolder ? (
                          <>
                            <FormFeedback type="invalid">
                              <img
                                className="form-error-icon"
                                src={rederror}
                                alt=""
                                height={15}
                              />
                              {bankForm.errors.accountHolder}
                            </FormFeedback>
                          </>
                        ) : null}
                      </Col>
                      <Col lg="6">
                        <Label >Account Number</Label>
                        <Input
                          name="accountNumber"
                          // className="mt-3"
                          placeholder="Account Number"
                          type="text"
                          onChange={bankForm.handleChange}
                          onBlur={bankForm.handleBlur}
                          value={bankForm.values.accountNumber || ""}
                          invalid={
                            bankForm.touched.accountNumber &&
                            bankForm.errors.accountNumber
                              ? true
                              : false
                          }
                        />
                        {bankForm.touched.accountNumber &&
                        bankForm.errors.accountNumber ? (
                          <>
                            <FormFeedback type="invalid">
                              <img
                                className="form-error-icon"
                                src={rederror}
                                alt=""
                                height={15}
                              />
                              {bankForm.errors.accountNumber}
                            </FormFeedback>
                          </>
                        ) : null}
                      </Col>
                      <Col lg="6">
                      <Label >IFSC Code</Label>
                        <Input
                          name="ifscCode"
                          // className="mt-3"
                          placeholder="IFSC Code"
                          type="text"
                          onChange={bankForm.handleChange}
                          onBlur={bankForm.handleBlur}
                          value={bankForm.values.ifscCode || ""}
                          invalid={
                            bankForm.touched.ifscCode &&
                            bankForm.errors.ifscCode
                              ? true
                              : false
                          }
                        />
                        {bankForm.touched.ifscCode &&
                        bankForm.errors.ifscCode ? (
                          <>
                            <FormFeedback type="invalid">
                              <img
                                className="form-error-icon"
                                src={rederror}
                                alt=""
                                height={15}
                              />
                              {bankForm.errors.ifscCode}
                            </FormFeedback>
                          </>
                        ) : null}
                      </Col>
                       {/* <Col lg="6"> */}
                       <div className="col-lg-6 form-group mb-4">
                          <p className="place-holder">Upload your scanner</p>
                          <label
                            htmlFor="file-upload"
                            className="custom-file-upload form-control"
                          >
                            <img src={file} alt="Upload file icon" />
                            <input
                              disabled={spinner}
                              id="file-upload"
                              type="file"
                              // accept=".jpg,.jpeg,.png,.pdf,.doc,.xls,.zip"
                              accept=".jpg,.jpeg,.png"
                              onChange={handleBankScanner}
                              onClick={(event) => {
                                if (
                                  event.target.files.length === 1 &&
                                  event.target.files[0].name ===
                                  bankScanner[bankScanner.length - 1]
                                      ?.name
                                ) {
                                  event.target.value = null;
                                }
                              }}
                              multiple
                            />
                            {/* <button>Add more +</button> */}
                          </label>
                          <span className="file-formats">
                            Please select files to attach (20 MB max, .jpg, .jpeg, .png,)
                          </span>
                          {/* {
                            <div><strong>Selected File : </strong> {selectedFile ? selectedFile.name : "none"} <span onClick={() => { setSelectedFile(""); setInputKey((prevKey) => prevKey + 1);}} style={{ color: "red",cursor:"pointer" }}>{selectedFile && "X"}</span></div>
                          } */}
                          {/* {selectedFile?.length > 0 && (
                            <div>
                              <h5>Selected files:</h5>
                              <ul>
                                {selectedFile?.map((file, index) => (
                                  <li className="upload-list" key={index}>
                                    {file?.name}
                                    <img
                                      src={del}
                                      style={{ cursor: "pointer" }}
                                      onClick={() => delImage(index)}
                                    />
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )} */}
                          {/* {errorMsg && (
                            <div className="text-danger">{errorMsg}</div>
                          )} */}
                          {errorMsg && (
                            <span className="ticket-validaton-error">
                              {" "}
                              <img
                                className="form-error-icon"
                                src={rederror}
                                alt=""
                                height={15}
                              />
                              {errorMsg}
                            </span>
                          )}
                        </div>
                      {/* </Col>  */}
                    </Row>
                    <div className="btn-group">
                      <button
                        className="btn btn-primary w-100 waves-effect waves-light btn-cancel"
                        type="button"
                        onClick={() => bankForm.resetForm({ values: "" })}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary w-100 waves-effect waves-light btn-save"
                        type="submit"
                      >
                        Add Account
                      </button>
                    </div>
                  </CardBody>
                </Card>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col lg="12">
              {/* {error && error ? <Alert color="danger">{error}</Alert> : null}
              {success ? <Alert color="success">{success}</Alert> : null} */}
              <Form
                className="form-horizontal floating-form my-account"
                onSubmit={(e) => {
                  e.preventDefault()
                  cryptoForm.handleSubmit()
                  return false
                }}
              >
                <Card>
                  <CardBody>
                    <div className="my-account-header">
                      <h6 className="font16  font-semibold">Add Crypt Account</h6>
                    </div>
                    <Row>                      
                      <Col lg="6">
                        <Label >Crypto Address</Label>
                        <Input
                          name="cryptoAddress"
                          // className="mt-3"
                          placeholder="Crypto Address"
                          type="text"
                          onChange={cryptoForm.handleChange}
                          onBlur={cryptoForm.handleBlur}
                          value={cryptoForm.values.cryptoAddress || ""}
                          invalid={
                            cryptoForm.touched.cryptoAddress &&
                            cryptoForm.errors.cryptoAddress
                              ? true
                              : false
                          }
                        />
                        {cryptoForm.touched.cryptoAddress &&
                        cryptoForm.errors.cryptoAddress ? (
                          <>
                            <FormFeedback type="invalid">
                              <img
                                className="form-error-icon"
                                src={rederror}
                                alt=""
                                height={15}
                              />
                              {cryptoForm.errors.cryptoAddress}
                            </FormFeedback>
                          </>
                        ) : null}
                      </Col>
                      <Col lg="6">
                      <Label >Crypto Id</Label>
                        <Input
                          name="cryptoId"
                          // className="mt-3"
                          placeholder="Crypt Id"
                          type="text"
                          onChange={cryptoForm.handleChange}
                          onBlur={cryptoForm.handleBlur}
                          value={cryptoForm.values.cryptoId || ""}
                          invalid={
                            cryptoForm.touched.cryptoId &&
                            cryptoForm.errors.cryptoId
                              ? true
                              : false
                          }
                        />
                        {cryptoForm.touched.cryptoId &&
                        cryptoForm.errors.cryptoId ? (
                          <>
                            <FormFeedback type="invalid">
                              <img
                                className="form-error-icon"
                                src={rederror}
                                alt=""
                                height={15}
                              />
                              {cryptoForm.errors.cryptoId}
                            </FormFeedback>
                          </>
                        ) : null}
                      </Col>
                       {/* <Col lg="6"> */}
                       <div className="col-lg-6 form-group mb-4">
                          <p className="place-holder">Upload your scanner</p>
                          <label
                            htmlFor="file-upload"
                            className="custom-file-upload form-control"
                          >
                              <img src={file} alt="Upload file icon" />
                            <input
                              disabled={spinner}
                              id="file-upload"
                              type="file"
                              accept=".jpg,.jpeg,.png"
                              onChange={handleCryptoScanner}
                              onClick={(event) => {
                                if (
                                  event.target.files.length === 1 &&
                                  event.target.files[0].name ===
                                    cryptoScanner[cryptoScanner.length - 1]
                                      ?.name
                                ) {
                                  event.target.value = null;
                                }
                              }}
                            />
                            {/* <button>Add more +</button> */}
                          </label>
                          <span className="file-formats">
                            Please select files to attach (20 MB max, .jpg, .jpeg, .png)
                          </span>
                          {/* {
                            <div><strong>Selected File : </strong> {selectedFile ? selectedFile.name : "none"} <span onClick={() => { setSelectedFile(""); setInputKey((prevKey) => prevKey + 1);}} style={{ color: "red",cursor:"pointer" }}>{selectedFile && "X"}</span></div>
                          } */}
                          {/* {selectedFile?.length > 0 && (
                            <div>
                              <h5>Selected files:</h5>
                              <ul>
                                {selectedFile?.map((file, index) => (
                                  <li className="upload-list" key={index}>
                                    {file?.name}
                                    <img
                                      src={del}
                                      style={{ cursor: "pointer" }}
                                      onClick={() => delImage(index)}
                                    />
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )} */}
                          {/* {errorMsg && (
                            <div className="text-danger">{errorMsg}</div>
                          )} */}
                          {errorMsg && (
                            <span className="ticket-validaton-error">
                              {" "}
                              <img
                                className="form-error-icon"
                                src={rederror}
                                alt=""
                                height={15}
                              />
                              {errorMsg}
                            </span>
                          )}
                        </div>
                      {/* </Col>  */}
                    </Row>
                    <div className="btn-group">
                      <button
                        className="btn btn-primary w-100 waves-effect waves-light btn-cancel"
                        type="button"
                        onClick={() => cryptoForm.resetForm({ values: "" })}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary w-100 waves-effect waves-light btn-save"
                        type="submit"
                      >
                        Add Account
                      </button>
                    </div>
                  </CardBody>
                </Card>
              </Form>
            </Col>
          </Row>
          <TextLoader loading={loader} loader={loader}/>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withRouter(AddAccount)
