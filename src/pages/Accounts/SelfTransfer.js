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
    FormFeedback,
    DropdownMenu, DropdownItem, Dropdown
} from "reactstrap"

// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"
import { withRouter } from "react-router-dom"
//Import Breadcrumb

import Breadcrumb from "../../components/Common/Breadcrumb"
import { setPageTitle } from "../../helpers/api_helper_rs"
import rederror from "../../assets/images/redvalidationicon/rederror.jpg"
import { customRegex } from "../../helpers/validation_helpers"
import { toast } from "react-toastify"
import TextLoader from "../../components/textLoader"
import PaymentModal from "../../components/Common/PaymentModal"

import { adminAccountsDetails, handlePayents } from "../Authentication/store/apiServices"
import { useHistory } from "react-router-dom"

const SelfTransfer = props => {
    let navigate = useHistory()
    const [loader, setLoader] = useState(false)
    const [custompay, setcustompay] = useState()
    const [spinner, setSpinner] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [errorMsg, setErrorMsg] = useState("");
    const [sendTo, setSendTo] = useState({ name: "C2C Wallet", value: "c2c_wallet" })
    const [sendFrom, setSendFrom] = useState({ name: "Fixed Wallet", value: "fixed_wallet" })
    const [isSendFrom, setIsSendFrom] = useState(false)
    const [isSendTo, setIsSendTo] = useState(false)

    useEffect(() => {
        setPageTitle("Self Transfer")
    }, [])

    const SelfTransferForm = useFormik({
        enableReinitialize: true,

        initialValues: {
            customAmount: "",
            paymentId: "",
        },

        validationSchema: Yup.object({
            customAmount: Yup.string()
                .required("Please enter amount.")
                .matches(customRegex?.amount, "Please valid amount"),
        }),

        onSubmit: async (values) => {
            let data = new FormData()
            data.append('send-from', sendFrom?.value);
            data.append('send-to', sendTo?.value);
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

        },
    })

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
                            SelfTransferForm.handleSubmit()
                            return false
                        }}
                    >
                        <Card>
                            <CardBody>  
                                <Row >
                                    <Col lg="4">
                                        <Label>Send From</Label>
                                        <Dropdown
                                            isOpen={isSendFrom}
                                            toggle={() => setIsSendFrom(!isSendFrom)}
                                        >
                                            <button
                                                className="dropdown-toggle wallet-dropdown-toggle"
                                                type="button"
                                                data-toggle="dropdown"
                                                onClick={() => setIsSendFrom(!isSendFrom)}
                                            >
                                                <span className="firstLettercapital">{sendFrom?.name}</span>
                                                <span className="caret" />
                                            </button>
                                            <DropdownMenu className="outerdiv">
                                                <>
                                                    {sendTo?.value !== "c2c_wallet" && <>
                                                        <li disabled onClick={() => setSendFrom({ name: "C2C Wallet", value: "c2c_wallet" })}>
                                                            <div className="form-check custom-checkbox">
                                                                <label className="form-check-label" htmlFor="c2c_wallet">
                                                                    C2C Wallet
                                                                </label>
                                                            </div>
                                                        </li>
                                                        <DropdownItem divider />
                                                    </>}
                                                    {sendTo?.value !== "fixed_wallet" && <>
                                                        <li onClick={() => setSendFrom({ name: "Fixed Wallet", value: "fixed_wallet" })}>
                                                            <div className="form-check custom-checkbox">
                                                                <label
                                                                    className="form-check-label"
                                                                    htmlFor="fixed_wallet"
                                                                >
                                                                    Fixed Wallet
                                                                </label>
                                                            </div>
                                                        </li>
                                                        <DropdownItem divider />
                                                    </>}
                                                    {sendTo?.value !== "monthly_return" && <>
                                                        <li onClick={() => setSendFrom({ name: "Monthly Return", value: "monthly_return" })}>
                                                            <div className="form-check custom-checkbox">
                                                                <label
                                                                    className="form-check-label"
                                                                    htmlFor="monthly_return"
                                                                >
                                                                    Monthly Return
                                                                </label>
                                                            </div>
                                                        </li>
                                                        <DropdownItem divider />
                                                    </>}
                                                    {sendTo?.value !== "comision_income" && <>
                                                        <li onClick={() => setSendFrom({ name: "Comision Income", value: "comision_income" })}>
                                                            <div className="form-check custom-checkbox">
                                                                <label
                                                                    className="form-check-label"
                                                                    htmlFor="comision_income"
                                                                >
                                                                    Comision Income
                                                                </label>
                                                            </div>
                                                        </li>
                                                        <DropdownItem divider />
                                                    </>}
                                                </>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </Col>
                                    <Col lg="4">
                                        <Label>Send To</Label>
                                        <Dropdown
                                            isOpen={isSendTo}
                                            toggle={() => setIsSendTo(!isSendTo)}
                                        >
                                            <button
                                                className="dropdown-toggle wallet-dropdown-toggle"
                                                type="button"
                                                data-toggle="dropdown"
                                                onClick={() => setIsSendTo(!isSendTo)}
                                            >
                                                <span className="firstLettercapital">{sendTo?.name}</span>
                                                <span className="caret" />
                                            </button>
                                            <DropdownMenu className="outerdiv">
                                                <>
                                                    {sendFrom?.value !== "c2c_wallet" && <>
                                                        <li onClick={() => setSendTo({ name: "C2C Wallet", value: "c2c_wallet" })}>
                                                            <div className="form-check custom-checkbox">
                                                                <label className="form-check-label" htmlFor="c2c_wallet">
                                                                    C2C Wallet
                                                                </label>
                                                            </div>
                                                        </li>
                                                        <DropdownItem divider />
                                                    </>}
                                                    {sendFrom?.value !== "fixed_wallet" && <>
                                                        <li onClick={() => setSendTo({ name: "Fixed Wallet", value: "fixed_wallet" })}>
                                                            <div className="form-check custom-checkbox">
                                                                <label className="form-check-label"
                                                                    htmlFor="fixed_wallet"
                                                                >
                                                                    Fixed Wallet
                                                                </label>
                                                            </div>
                                                        </li>
                                                        <DropdownItem divider />
                                                    </>}
                                                    {sendFrom?.value !== "monthly_return" && <>
                                                        <li onClick={() => setSendTo({ name: "Monthly Return", value: "monthly_return" })}>
                                                            <div className="form-check custom-checkbox">
                                                                <label
                                                                    className="form-check-label"
                                                                    htmlFor="monthly_return"
                                                                >
                                                                    Monthly Return
                                                                </label>
                                                            </div>
                                                        </li>
                                                        <DropdownItem divider />
                                                    </>}
                                                    {sendFrom?.value !== "comision_income" && <>
                                                        <li onClick={() => setSendTo({ name: "Comision Income", value: "comision_income" })}>
                                                            <div className="form-check custom-checkbox">
                                                                <label
                                                                    className="form-check-label"
                                                                    htmlFor="comision_income"
                                                                >
                                                                    Comision Income
                                                                </label>
                                                            </div>
                                                        </li>
                                                        <DropdownItem divider />
                                                    </>}
                                                </>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </Col>
                                    <Col lg="4">
                                        <Label>Send To</Label>
                                        <Dropdown
                                            isOpen={isSendTo}
                                            toggle={() => setIsSendTo(!isSendTo)}
                                        >
                                            <button
                                                className="dropdown-toggle wallet-dropdown-toggle"
                                                type="button"
                                                data-toggle="dropdown"
                                                onClick={() => setIsSendTo(!isSendTo)}
                                            >
                                                <span className="firstLettercapital">{sendTo?.name}</span>
                                                <span className="caret" />
                                            </button>
                                            <DropdownMenu className="outerdiv">
                                                <>
                                                    {sendFrom?.value !== "c2c_wallet" && <>
                                                        <li onClick={() => setSendTo({ name: "C2C Wallet", value: "c2c_wallet" })}>
                                                            <div className="form-check custom-checkbox">
                                                                <label className="form-check-label" htmlFor="c2c_wallet">
                                                                    C2C Wallet
                                                                </label>
                                                            </div>
                                                        </li>
                                                        <DropdownItem divider />
                                                    </>}
                                                    {sendFrom?.value !== "fixed_wallet" && <>
                                                        <li onClick={() => setSendTo({ name: "Fixed Wallet", value: "fixed_wallet" })}>
                                                            <div className="form-check custom-checkbox">
                                                                <label className="form-check-label"
                                                                    htmlFor="fixed_wallet"
                                                                >
                                                                    Fixed Wallet
                                                                </label>
                                                            </div>
                                                        </li>
                                                        <DropdownItem divider />
                                                    </>}
                                                    {sendFrom?.value !== "monthly_return" && <>
                                                        <li onClick={() => setSendTo({ name: "Monthly Return", value: "monthly_return" })}>
                                                            <div className="form-check custom-checkbox">
                                                                <label
                                                                    className="form-check-label"
                                                                    htmlFor="monthly_return"
                                                                >
                                                                    Monthly Return
                                                                </label>
                                                            </div>
                                                        </li>
                                                        <DropdownItem divider />
                                                    </>}
                                                    {sendFrom?.value !== "comision_income" && <>
                                                        <li onClick={() => setSendTo({ name: "Comision Income", value: "comision_income" })}>
                                                            <div className="form-check custom-checkbox">
                                                                <label
                                                                    className="form-check-label"
                                                                    htmlFor="comision_income"
                                                                >
                                                                    Comision Income
                                                                </label>
                                                            </div>
                                                        </li>
                                                        <DropdownItem divider />
                                                    </>}
                                                </>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </Col>
                                    <Col lg="6">
                                        <Label>Amount</Label>
                                        <div className="test form-check form-check-inline mt-20 ">
                                            {/* <span className="prefix">{currency?.prefix}$</span> */}
                                            <div className="inner-input-box">
                                                <Input
                                                    className="chose-payment"
                                                    value={SelfTransferForm.values.customAmount || ""}
                                                    placeholder="5000"
                                                    max="5000"
                                                    min="50"
                                                    onChange={e => {
                                                        SelfTransferForm.handleChange(e)
                                                        setcustompay(e.target.value)
                                                    }}
                                                    onBlur={(e) => {
                                                        SelfTransferForm.handleBlur,
                                                            custompay > 5000 ? SelfTransferForm.values.customAmount = 5000 : custompay < 50 ? SelfTransferForm.values.customAmount = 50 : null
                                                    }}
                                                    invalid={
                                                        SelfTransferForm.touched.customAmount &&
                                                            SelfTransferForm.errors.customAmount
                                                            ? true
                                                            : false
                                                    }
                                                    type="number"
                                                    name="customAmount"

                                                    disabled={spinner}
                                                />

                                                {SelfTransferForm.touched.customAmount &&
                                                    SelfTransferForm.errors.customAmount ? (
                                                    <>
                                                        <FormFeedback type="invalid">
                                                            <img
                                                                className="form-error-icon"
                                                                src={rederror}
                                                                alt=""
                                                                height={15}
                                                            />
                                                            {SelfTransferForm.errors.customAmount}
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
            {/* <TextLoader loading={loading} loader={loader} /> */}
            < PaymentModal openModal={openModal} message={"Payment"} />
        </React.Fragment >
    )
}

export default withRouter(SelfTransfer)
