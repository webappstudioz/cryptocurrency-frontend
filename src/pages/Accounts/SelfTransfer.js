import React, { useState, useEffect } from "react"
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Label,
    Input,
    Form,
    FormFeedback
} from "reactstrap"

// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"
import { withRouter } from "react-router-dom"
import LogoGreen from "../../assets/images/c2c/logoGreen.jpg"
//Import Breadcrumb

import Breadcrumb from "../../components/Common/Breadcrumb"
import { setPageTitle } from "../../helpers/api_helper_rs"
import rederror from "../../assets/images/redvalidationicon/rederror.jpg"
import { customRegex } from "../../helpers/validation_helpers"
import { toast } from "react-toastify"
import TextLoader from "../../components/textLoader"
import PaymentModal from "../../components/Common/PaymentModal"
import BankLogo from "../../assets/images/c2c/banklogo.png"
import EthereumLogo from "../../assets/images/c2c/ethereum.png"
import BitcoinLogo from "../../assets/images/c2c/bitcoinlogo.png"
import TetherLogo from "../../assets/images/c2c/tetherlogo.png"
import file from "../../assets/images/file.png";
import { adminAccountsDetails, handlePayents } from "../Authentication/store/apiServices"
import { useHistory } from "react-router-dom"
import { FocusError } from 'focus-formik-error'
import { Dropdown } from "semantic-ui-react"

const AccountOptions = [
    { text: "C2C Wallet", value: "c2c_wallet" },
    { text: "Fixed Wallet", value: "fixed_wallet" },
    { text: "Monthly Return", value: "monthly_return" },
    { text: "Comision Income", value: "comision_income" },
]

const SelfTransfer = props => {
    let navigate = useHistory()
    const IMAGE_URL = process.env.REACT_APP_IMAGE_HOST
    const [loader, setLoader] = useState(true)
    const [custompay, setcustompay] = useState()
    const [selectedMethod, setSelectedMethod] = useState("bank")
    const [spinner, setSpinner] = useState(false)
    const [loading, setLoading] = useState("")
    const [openModal, setOpenModal] = useState(false)
    const [selectedFile, setSelectedFile] = useState([]);
    const [inputKey, setInputKey] = useState(0);
    const [errorMsg, setErrorMsg] = useState("");
    const [adminInfo, setAdminInfo] = useState("")

    useEffect(() => {
        setPageTitle("Deposite Funds")
        getAdminAccountsDetails()
    }, [])

    const getAdminAccountsDetails = async () => {
        try {
            let result = await adminAccountsDetails()
            // const info = result?.data?.data
            setAdminInfo(result?.data?.data)
            setLoader(false)
        } catch (error) {
            setLoader(false)
        }
    }

    const DepositForm = useFormik({
        enableReinitialize: true,

        initialValues: {
            customAmount: "",
            paymentId: "",
        },

        validationSchema: Yup.object({
            customAmount: Yup.string()
                .required("Please enter amount.")
                .matches(customRegex?.amount, "Please valid amount"),
            paymentId: Yup.string()
                .required("Please enter payment id"),
        }),

        onSubmit: async (values) => {
            let data = new FormData()
            data.append('image', selectedFile);
            data.append('payment_id', values?.paymentId);
            data.append('payment_type', "deposit");
            data.append('method_type', selectedMethod);
            data.append('amount', values?.customAmount);
            if (!errorMsg) {
                setLoader(true)
                try {
                    const result = await handlePayents(data)
                    setLoader(false)
                    navigate.push("/dashboard")
                    toast.success(result?.data?.message, {
                        position: toast.POSITION.TOP_RIGHT,
                    })
                } catch (error) {
                    toast.error(error?.response?.data?.message, {
                        position: toast.POSITION.TOP_RIGHT,
                    })
                    setLoader(false)
                }
            }
            // return
            // let amount = ""
            // values?.customAmount ? amount = values?.customAmount : amount = selectedAmount
            // if (selectedMethod == "stripe" && amount) {
            //   if (values?.customAmount) {
            //     setstripecondition(true)
            //     setSpinner(true)
            //     setLoading(true)
            //     setOpenModal(true)
            //   } else if (selectedAmount != "custom") {
            //     setstripecondition(true)
            //     setSpinner(true)
            //     setLoading(true)
            //     setOpenModal(true)
            //   }
            // } else {
            //   if (values?.customAmount) {
            //     HandleAddWalletAmount(values?.customAmount)
            //   } else if (selectedAmount != "custom") {
            //     HandleAddWalletAmount(selectedAmount)
            //   }
            // }

            // if (!values?.customAmount && selectedAmount === "custom") {
            //   toast.error("Please select or enter an amount to wallet", {
            //     position: toast.POSITION.TOP_RIGHT,
            //   })
            // }
        },
    })

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileSize = file.size / 1024 / 1024; // in MB
            const fileType = file.type.split("/")[1]; // get file extension

            // Validate file size (10MB max)
            if (fileSize > 20) {
                setErrorMsg("File size should be less than 20 MB");
            } else {
                // Validate file extension
                if (
                    fileType === "jpg" ||
                    fileType === "jpeg" ||
                    fileType === "png" ||
                    fileType === "pdf" ||
                    fileType === "doc"
                    // fileType === "xls" ||
                    // fileType === "zip"
                ) {
                    // setSelectedFile([...selectedFile, file]);
                    setSelectedFile(file)
                    setErrorMsg("");
                } else {
                    setErrorMsg(
                        "Only JPG, PNG, PDF, and DOC files are allowed"
                    );
                }
            }
        }
    };

    return (
        <React.Fragment>
            <div
                className={
                    loader
                        ? "page-content payment  overlayerloader"
                        : "page-content payment"
                }
            >
                <Container fluid>
                    <Breadcrumb title="Minible" breadcrumbItem="Self Transfer" />

                    <Form
                        className="form-horizontal user-management"
                        onSubmit={e => {
                            e.preventDefault()
                            DepositForm.handleSubmit(selectedFile.length === 0 && setErrorMsg("Payment's Screen shot is required1"))
                            return false
                        }}
                    >
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col lg="6">
                                        <Label>Send From</Label>
                                        {/* {selectedCountry && ( */}
                                        <Dropdown
                                            placeholder="Select Country"
                                            fluid
                                            search
                                            className="country-Drop input-outline"
                                            // value={selectedCountry}
                                            // onChange={handleCountryChange}
                                            options={AccountOptions}
                                        />
                                        {/* )} */}
                                        {/* {countryError && ( */}
                                        <div style={{ display: "flex" }}>
                                            <img
                                                className="form-error-icon"
                                                src={rederror}
                                                alt=""
                                                height={15}
                                            />
                                            <span style={{ color: "red", marginLeft: "3px" }}>
                                                Country required
                                            </span>
                                        </div>
                                        {/* )} */}
                                    </Col>
                                    <Col lg="6">
                                        <Label>Send To</Label>
                                        <Dropdown
                                            placeholder="Select Country"
                                            fluid
                                            search
                                            className="country-Drop input-outline"
                                            options={AccountOptions}

                                        // value={selectedCountry}
                                        // onChange={handleCountryChange}
                                        // options={countryList}
                                        />
                                        {/* )} */}
                                        {/* {countryError && ( */}
                                        <div style={{ display: "flex" }}>
                                            <img
                                                className="form-error-icon"
                                                src={rederror}
                                                alt=""
                                                height={15}
                                            />
                                            <span style={{ color: "red", marginLeft: "3px" }}>
                                                Country required
                                            </span>
                                        </div>
                                        {/* )} */}
                                    </Col>
                                    {/* </Row>
                                <Row> */}
                                    <Col lg="6">
                                        <Label>Amount</Label>
                                        <div className="test form-check form-check-inline mt-20 ">
                                            {/* <span className="prefix">{currency?.prefix}$</span> */}
                                            <div className="inner-input-box">
                                                <Input
                                                    className="chose-payment"
                                                    value={DepositForm.values.customAmount || ""}
                                                    placeholder="5000"
                                                    max="5000"
                                                    min="50"
                                                    onChange={e => {
                                                        DepositForm.handleChange(e)
                                                        setcustompay(e.target.value)
                                                    }}
                                                    onBlur={(e) => {
                                                        DepositForm.handleBlur,
                                                            custompay > 5000 ? DepositForm.values.customAmount = 5000 : custompay < 50 ? DepositForm.values.customAmount = 50 : null
                                                    }}
                                                    invalid={
                                                        DepositForm.touched.customAmount &&
                                                            DepositForm.errors.customAmount
                                                            ? true
                                                            : false
                                                    }
                                                    type="number"
                                                    name="customAmount"

                                                    disabled={spinner}
                                                />

                                                {DepositForm.touched.customAmount &&
                                                    DepositForm.errors.customAmount ? (
                                                    <>
                                                        <FormFeedback type="invalid">
                                                            <img
                                                                className="form-error-icon"
                                                                src={rederror}
                                                                alt=""
                                                                height={15}
                                                            />
                                                            {DepositForm.errors.customAmount}
                                                        </FormFeedback>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <span className="billing-max-amt">*Maximum amount: 5000</span>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                        <div className="btn-group mt-30">
                            {/* <button
                                className="btn btn-primary w-100 waves-effect waves-light btn-cancel m-0"
                                type="button"
                                onClick={() => { validation.resetForm({ values: "" }), navigate.push("/my-profile") }}
                            >
                                Cancel
                            </button> */}
                            <button
                                className="btn btn-primary w-100 waves-effect waves-light btn-save m-0"
                                type="submit"
                            >
                                Transfer
                            </button>
                        </div>
                    </Form>
                </Container>
            </div >
            <TextLoader loading={loading} loader={loader} />
            <PaymentModal openModal={openModal} message={"Payment"} />
        </React.Fragment >
    )
}

export default withRouter(SelfTransfer)
