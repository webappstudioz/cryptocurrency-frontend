import React, { useState, useEffect, useRef } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Label,
  Input,
  Form,
} from "reactstrap"

// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"
import { withRouter } from "react-router-dom"

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb"
import paypal from "../../assets/images/paypal.svg"
import razor from "../../assets/images/razor.svg"
// import stripe from "../../assets/images/stripe.svg"
import cardLogo from "../../assets/images/ccard-logos-set.png"
import usd from "../../assets/images/usd.svg"
import wise from "../../assets/images/wise.svg"
import { setPageTitle } from "../../helpers/api_helper_rs"
import {
  getPaymentMethodList,
  loginData,
  addWalletAmount,
  sendInvoiceMail,
} from "../Authentication/store/apiServices"
// import rederror from "../../assets/images/redvalidationicon/rederror.jpg"
import { customRegex } from "../../helpers/validation_helpers"
import { toast } from "react-toastify"
import { SETTINGS } from "../../constants/api/api_path"
// import { Elements } from "@stripe/react-stripe-js"
// import { loadStripe } from "@stripe/stripe-js/pure"
// import CheckoutForm from "../Stripe/CheckoutForm"
import { useHistory } from "react-router-dom"
// import { sendStripeDetailsBack, getSavedCards } from "../Service/store/apiService"
import TextLoader from "../../components/textLoader"
import RazorPayForm from "../Razorpay/RazorpayForm"
import useRazorpay from "react-razorpay"
// import { selectCardLogo } from "../../helpers/api_helper_rs"
// import CreditCardLogo from "../../assets/images/credit-card-logo.jpg";
import CreditCard from "../Stripe/CreditCard"
import { getStoredCards } from "../../helpers/api_helper_rs"
import PaymentModal from "../../components/Common/PaymentModal"
import { useSelector } from "react-redux"
const Billing = props => {
  // const options = {
  //   mode: "payment",
  //   amount: 1099,
  //   currency: "usd",
  //   paymentMethodCreation: "manual",
  //   // Fully customizable with appearance API.
  //   appearance: {
  //     /*...*/
  //   },
  // }
  const navigate = useHistory()
  const formRef = useRef(null)
  const Razorpay = useRazorpay()
  const [paymentMethods, setPaymentMethods] = useState()
  const [currency, setCurrency] = useState()
  const [selectedMethod, setSelectedMethod] = useState()
  const [selectedAmount, setSelectedAmount] = useState(100)
  const [paypalBasicFormData, setPaypalBasicFormData] = useState()
  // const [stripeInstances, setStripeInstances] = useState([])
  // const [loadstripe, setloadstripe] = useState("")
  // const [intentkey, setintentkey] = useState("")
  // const [actionNeeded, setactionNeeded] = useState(false)
  // const [returnURL, setreturnURL] = useState("")
  const [stripecondition, setstripecondition] = useState(false)
  const [loader, setLoader] = useState(false)
  const [loading, setLoading] = useState("")
  const [custompay, setcustompay] = useState("")
  const HOST_URL = process.env.REACT_APP_HOST
  const [invoiceId, setInvoiceId] = useState()
  const [razorpayFormInfo, setRazorpayFormInfo] = useState()
  const [submitRazorPayForm, setSubmitRazorPayForm] = useState(false)
  const [spinner, setSpinner] = useState(false)
  const [selectedCard, setSelectedCard] = useState("")
  // const [creditCardArray, setCreditCardArray] = useState("")
  // const [savedCardId, setSavedCardId] = useState("")
  //these states used in child component don't remove
  const [openModal, setOpenModal] = useState(false)
  const [stripeCardHeight, setStripeCardHeight] = useState(0)
  const reduxCurrency = useSelector((state) => state?.Widgets?.currency)
  useEffect(() => {
    let cards = getStoredCards()
    if(selectedMethod === "stripe") {
      const uniqueArray = cards?.reduce((accumulator, current) => {
        const existingEntry = accumulator.find(item => item.pm_id === current.pm_id);
        if (!existingEntry) {
          accumulator.push(current);
        }
        return accumulator;
      }, []);
      cards = uniqueArray;
      if(cards){
       if(cards?.length > 3 && selectedCard != "add_new"){
         setStripeCardHeight("450px")
        } else if(cards?.length > 2 && selectedCard != "add_new"){
          setStripeCardHeight("435px")
        } else if(cards?.length > 1 && selectedCard != "add_new"){
            setStripeCardHeight("370px")
        } else if(cards?.length > 1 && selectedCard == "add_new"){
            setStripeCardHeight("auto")
        } else if(cards?.length == 1 && selectedCard == "add_new"){
          setStripeCardHeight("auto")
        } else if(cards?.length == 0){
            setStripeCardHeight("400px")
        } else {
            setStripeCardHeight("300px")
        }
      } else {
        setStripeCardHeight("400px")
      }
    } else{
        setStripeCardHeight(0)
    }
  },[selectedMethod, selectedCard])
  
  // useEffect(() => {
  //   const fetchStripeInstances = async () => {
  //     if (paymentMethods) {
  //       // Add a check for paymentGateways
  //       const instances = await Promise.all(
  //         paymentMethods.map(async paymentMethod => {
  //           if (paymentMethod?.value === "stripe") {
  //             setloadstripe(loadStripe(paymentMethod?.config?.publishableKey))
  //             return loadStripe(paymentMethod?.config?.publishableKey)
  //           }
  //         })
  //       )
  //       setStripeInstances(instances)
  //     }
  //   }

  //   fetchStripeInstances()
  // }, [paymentMethods])

  useEffect(() => {
    let data = loginData()
    reduxCurrency? setCurrency(reduxCurrency) : setCurrency(data?.currency)
  },[reduxCurrency])

  useEffect(() => {
    setPageTitle("Billing")
    // getPaymentGateways()
    // getStoredCards()
  }, [])

  const getPaymentGateways = async () => {
    try {
      setLoader(true)
      setLoading(true)
      let info = await getPaymentMethodList()
      setLoader(false)
      setLoading(false)
      let data = info?.data?.data
      setPaymentMethods(data)

      let defaultMethod = ""
      data?.map((method, index) => {
        !defaultMethod ? (defaultMethod = method?.value) : ""
      })
      setSelectedMethod(defaultMethod)
      // savedCards()
    } catch (error) {
      setLoader(false)
      setLoading(false)
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  }

  const validation = useFormik({
    //   // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      customAmount: "",
    },
    validationSchema: Yup.object({
      customAmount: Yup.string()
      .matches(customRegex?.amount, "Please valid amount"),
    }),

    onSubmit: values => {
      return
      let amount = ""
      values?.customAmount? amount = values?.customAmount : amount = selectedAmount
      if (selectedMethod == "stripe" && amount) {
        if (values?.customAmount) {
          setstripecondition(true)
          setSpinner(true)
          setLoading(true)
          setOpenModal(true)
        } else if (selectedAmount != "custom") {
          setstripecondition(true)
          setSpinner(true)
          setLoading(true)
          setOpenModal(true)
        }
      } else {
        if (values?.customAmount) {
          HandleAddWalletAmount(values?.customAmount)
        } else if (selectedAmount != "custom") {
          HandleAddWalletAmount(selectedAmount)
        }
      }

      if (!values?.customAmount && selectedAmount === "custom") {
        toast.error("Please select or enter an amount to wallet", {
          position: toast.POSITION.TOP_RIGHT,
        })
      }
    },
  })

  const HandleAddWalletAmount = async amount => {
    setOpenModal(true)
    setSpinner(true)
    setLoading(true)
    try {
      let data = new URLSearchParams({
        paymentmethod: selectedMethod,
        amount: amount,
      })
      
      let res = await addWalletAmount(data)
      let info = res?.data?.data
      sendInvoiceMail(info?.invoiceId)
      setInvoiceId(info?.invoiceId)
      if (info?.payment_method === "paypal") {
        setPaypalBasicFormData(info.payment_button)
      }

      if (selectedMethod === "banktransfer" && info?.invoiceId) {
        setSpinner(false)
        setLoading(false)
        navigate.push(`/invoice-detail/${info?.invoiceId}`)
      } else if(info?.payment_method === "razorpay") {
        setSpinner(false)
        setLoading(false)
        setRazorpayFormInfo(info?.payment_button)
        setSubmitRazorPayForm(true)
      }
      toast.success(res?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      })
    } catch (error) {
      setOpenModal(false)
      setSpinner(false)
      setLoading(false)
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  }

  useEffect(() => {
    if (paypalBasicFormData) {
      handlePayPalForm()
    }
  }, [paypalBasicFormData])

  const handlePayPalForm = () => {
    let submit = document.getElementsByName("submit")
    if (submit && submit.length) {
      const e = submit[0]
      e.style.width = "auto"
      e.style.height = "auto"
    }

    let return_url = document.getElementsByName("return")
    let cancel_url = document.getElementsByName("cancel_return")

    if (return_url && return_url.length) {
      let url = return_url[0]
      url.value = `${HOST_URL}/invoice-detail/${invoiceId}/${SETTINGS.successKey}`
    }

    if (cancel_url && cancel_url.length) {
      let url = cancel_url[0]
      url.value = `${HOST_URL}/invoice-detail/${invoiceId}/${SETTINGS.cancelkey}`
    }

    if (selectedMethod === "paypal") {
      paypalFormSubmit()
    }
  }

  const paypalFormSubmit = () => {
    let handlesubmit = document.getElementsByName("submit")
    if (handlesubmit && handlesubmit.length) {
      const e = handlesubmit[0]
      e.click()
    }
  }

  // const stripepayment = async res => {
  //   // setLoader(true)
  //   // setLoading(0)
  //   setSpinner(true)
  //   if (res.status == "error") {
  //     toast.error(res.data, {
  //       position: toast.POSITION.TOP_RIGHT,
  //     })
  //     // setLoader(false)
  //     setSpinner(false)
  //   }
  //   if (res.status == "data") {
  //     // setLoader(true)
  //     // setLoading(0)
  //   setSpinner(true)
  //     let paramss = new URLSearchParams({
  //       paymentmethod: selectedMethod,
  //       amount: selectedAmount == "custom" ? custompay : selectedAmount,
  //     })
  //     try {
  //       let APIres = await addWalletAmount(paramss)
  //       if (APIres) {
  //         let info = APIres?.data?.data
  //         if (info) {
  //           toast.success(APIres?.data?.message, {
  //             position: toast.POSITION.TOP_RIGHT,
  //           })
  //           let params = new URLSearchParams({
  //             stripe_pm: res?.data?.id,
  //             invoiceId: info?.invoiceId,
  //           })
  //           try {
  //             // setLoader(true)
  //             setSpinner(true)
  //             let res = await sendStripeDetailsBack(params)
  //             if (res) {
  //               setSpinner(false)
  //               // setLoader(false)
  //               if (res?.data?.data?.paymentStatus?.status == "captured") {
  //                 navigate.push(`/invoice-detail/${info?.invoiceId}`)
  //               } else {
  //                 setintentkey(res?.data?.data?.paymentStatus?.client_secret)
  //                 setreturnURL(`/invoice-detail/${info?.invoiceId}`)

  //                 setactionNeeded(true)
  //               }
  //             }
  //           } catch (err) {
  //             // setLoader(false)
  //             setSpinner(false)

  //             toast.error(err?.response?.data?.message, {
  //               position: toast.POSITION.TOP_RIGHT,
  //             })

  //             setstripecondition(false)
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       // setLoader(false)
  //       // setLoading(100)
  //       setSpinner(false)
  //       toast.error(error?.response?.data?.message, {
  //         position: toast.POSITION.TOP_RIGHT,
  //       })
  //       setstripecondition(false)
  //     }
  //   }
  // }

  // const handleSelectedCard = (id) => {
  //   setSelectedCard(id)
  // }

  // const savedCards = async() => {
  //   try{
  //     let res = await getSavedCards()
  //     setCreditCardArray(res?.data?.data)
  //     res?.data?.data?.map((card) => {
  //       if(card?.order_preference === 0){
  //         setSelectedCard(card?.pm_id)
  //       }
  //     })
  //   }catch(error) {  }
  // }

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
          {/* Render Breadcrumb */}
          <Breadcrumb title="Minible" breadcrumbItem="Add Funds" />

          <Row>
            <Col lg="12">
              {/* {error && error ? <Alert color="danger">{error}</Alert> : null} */}
              {/* {success ? <Alert color="success">{success}</Alert> : null} */}
              <Form
                className="form-horizontal user-management"
                onSubmit={e => {
                  e.preventDefault()
                  validation.handleSubmit()
                  return false
                }}
              >
               {/* <Card>
                  <CardBody>
                    <div className="inner-content invite-user rd-group">
                       <h6 className="font16  font-semibold">
                        Select a Payment Method
                      </h6> 
                      <div className="radio-btn">
                        <Row>*/}
                          {/* {paymentMethods?.map((method, index) => { */}
                           { // if (method?.value === "paypal") {
                            //   return (
                            //     <Col key={index}>
                            //       <div className="form-check form-check-inline mt-20">
                            //         <Input
                            //           type="radio"
                            //           id="customRadioInline1"
                            //           name="customRadioInline1"
                            //           className="form-check-input"
                            //           value={method?.value}
                            //           checked={method?.value === selectedMethod}
                            //           onChange={() => {}}
                            //           onClick={() => {
                            //             setSelectedMethod(method?.value)
                            //           }}
                            //           disabled={spinner}
                            //         />
                            //         <Label
                            //           className="form-check-label"
                            //           htmlFor="customRadioInline1"
                            //         >
                            //           <img src={paypal} />
                            //           <p className="font-normal">Paypal</p>
                            //         </Label>
                            //       </div>

                            //     </Col>
                            //   )
                            // }

                            // if (method?.value === "stripe") {
                            //   return (
                            //     <Col key={index}>
                            //       <div className="form-check form-check-inline mt-20">
                            //         <Input
                            //           type="radio"
                            //           id="customRadioInline2"
                            //           name="customRadioInline1"
                            //           className="form-check-input"
                            //           value={method?.value}
                            //           checked={method?.value === selectedMethod}
                            //           onChange={() => {}}
                            //           onClick={() => {
                            //             setSelectedMethod(method?.value)
                            //           }}
                            //           disabled={spinner}
                            //         />
                            //         <Label
                            //           className="form-check-label"
                            //           htmlFor="customRadioInline2"
                            //         >
                            //           {/* <img src={stripe} /> */}
                            //           <img className="credit-card"  src={cardLogo} />
                            //           <p className="font-normal">Credit card </p>
                            //         </Label>
                            //       </div>
                            //     </Col>
                            //   )
                            // }

                            // if (method?.value === "banktransfer") {
                            //   return (
                            //     <Col key={index}>
                            //       <div className="form-check form-check-inline mt-20">
                            //         <Input
                            //           type="radio"
                            //           id="customRadioInline5"
                            //           name="customRadioInline1"
                            //           className="form-check-input"
                            //           value={method?.value}
                            //           checked={method?.value === selectedMethod}
                            //           onChange={() => {}}
                            //           onClick={() => {
                            //             setSelectedMethod(method?.value)
                            //           }}
                            //           disabled={spinner}
                            //         />
                            //         <Label
                            //           className="form-check-label"
                            //           htmlFor="customRadioInline5"
                            //         >
                            //           <img src={wise} />
                            //           <p className="font-normal">
                            //             {" "}
                            //             BankTransfer{" "}
                            //           </p>
                            //         </Label>
                            //       </div>
                            //     </Col>
                            //   )
                            // }

                            // if (method?.value === "crypto") {
                            //   return (
                            //     <Col key={index}>
                            //       <div className="form-check form-check-inline mt-20">
                            //         <Input
                            //           type="radio"
                            //           id="customRadioInline3"
                            //           name="customRadioInline1"
                            //           className="form-check-input"
                            //           value={method?.value}
                            //           checked={method?.value === selectedMethod}
                            //           onChange={() => {}}
                            //           onClick={() => {
                            //             setSelectedMethod(method?.value)
                            //           }}
                            //         />
                            //         <Label
                            //           className="form-check-label"
                            //           htmlFor="customRadioInline3"
                            //         >
                            //           <img src={usd} />
                            //           <p className="font-normal">Crypto</p>
                            //         </Label>
                            //       </div>
                            //     </Col>
                            //   )
                            // }

                            // if (method?.value === "razorpay") {
                            //   return (
                            //     <Col key={index}>
                            //       <div className="form-check form-check-inline mt-20">
                            //         {razorpayFormInfo? <RazorPayForm 
                            //             razorpayFormInfo={razorpayFormInfo} 
                            //             submitRazorPayForm={submitRazorPayForm} 
                            //             Razorpay={Razorpay} 
                            //             setSubmitRazorPayForm={setSubmitRazorPayForm}
                            //             invoiceId={invoiceId}
                            //             setSpinner={setSpinner}
                            //             setLoading={setLoading}
                            //             setOpenModal={setOpenModal} 
                            //           /> : ""}
                            //         <Input
                            //           type="radio"
                            //           id="customRadioInline4"
                            //           name="customRadioInline1"
                            //           className="form-check-input"
                            //           value={method?.value}
                            //           checked={method?.value === selectedMethod}
                            //           onChange={() => {}}
                            //           onClick={() => {
                            //             setSelectedMethod(method?.value)
                            //           }}
                            //           disabled={spinner}
                            //         />
                            //         <Label
                            //           className="form-check-label"
                            //           htmlFor="customRadioInline4"
                            //         >
                            //           <img src={razor} />
                            //           <p className="font-normal">
                            //             {" "}
                            //             UPI/NEFT/IMPS{" "}
                            //           </p>
                            //         </Label>
                            //       </div>
                            //     </Col>
                            //   )
                            // }
                          // })}
}
                        {/* </Row>
                      </div>
                    </div>
                  </CardBody>
                </Card> */}
                <div
                  className="slide"
                  // style={{ maxHeight: selectedMethod === "stripe" ? '500px' : '0px', overflow: 'hidden', transition: 'max-height 0.3s ease' }}
                  style={{
                    // height: selectedMethod === "stripe" ? selectedCard === "add_new"? "auto" : "450px" : "0px",
                    height: stripeCardHeight,
                    overflow: "hidden",
                    maxHeight: "450px",
                    transition: "height 0.6s ease 0s",
                    opacity: selectedMethod === "stripe" ? 1 : 0,
                  }}
                >
                  <Card className="m-10 stripe-form">
                      <CardBody
                      className="credit-card-scroll"
                        style={{
                          backgroundColor: "#fafafb",
                          margin: "20px auto",
                          overflowY: "auto" ,
                          borderRadius: "12px",
                          maxHeight: "400px",
                        }}
                      >
                        {selectedMethod === "stripe" && <CreditCard 
                          paymentMethods={paymentMethods}
                          stripecondition={stripecondition}
                          setstripecondition={setstripecondition}
                          setSpinner={setSpinner}
                          spinner={spinner}
                          selectedMethod={selectedMethod}
                          selectedAmount={selectedAmount}
                          custompay={custompay}
                          setOpenModal={setOpenModal}
                          paymentId={""}
                          setSelectedCard={setSelectedCard}
                          page={"billing"}
                          setLoading={setLoading}
                        />}
                  {/* {selectedMethod === "stripe" ? 
                    creditCardArray?.length > 0 && creditCardArray?.map((card, index) => {
                      let logo = selectCardLogo(card?.card_type)
                      return (
                      <div className="row" key={index}>
                        <div className="credit-card-option" 
                          onClick={() => {handleSelectedCard(card?.id)}} 
                          style={{cursor:"pointer"}} 
                        >
                          <input 
                            className="form-check-input me-2"
                            type="radio" 
                            name="card-group" 
                            value={card?.id} 
                            checked={selectedCard === card?.id} 
                            onChange={() => {}}
                          />{" "}
                          <span><img width="45px" height="27px" src={logo} /></span>&nbsp; &nbsp;
                          <span>{card?.card_last_four}</span>&nbsp;
                           //<span>{card?.cardLabel}</span>&nbsp; 
                          <span className="ms-auto">{card?.expiry_date}</span>
                        </div>
                      </div>)
                    }) 
                    : 
                  ""} */}
                  {/* {selectedMethod === "stripe"? 
                   creditCardArray?.length > 0 ? ( 
                    <div className="row">
                       <div className="credit-card-option" 
                          onClick={() => {handleSelectedCard("add_new")}} 
                          style={{cursor:"pointer"}} 
                        >
                          <input 
                            className="form-check-input me-2"
                            type="radio" 
                            name="card-group" 
                            value="add_new" 
                            checked={selectedCard === "add_new"} 
                            onChange={() => {}}
                          />
                          <span><img width="45px" height="27px" src={CreditCardLogo} /></span>&nbsp; &nbsp;
                          <span>Add new card</span>
                        </div>
                    </div>
                  ) : <div className="row">
                  <Elements stripe={loadstripe} options={options}>
                    <CheckoutForm
                      payment={stripepayment}
                      condition={stripecondition}
                      setcondition={setstripecondition}
                      Ikey={intentkey}
                      action={actionNeeded}
                      load={setSpinner}
                      url={returnURL}
                      setDisablePayBtn={setDisablePayBtn}
                    />
                  </Elements>
                </div> : ""}
                  {selectedMethod === "stripe" && selectedCard === "add_new" && (
                    <div className="row">
                      <Elements stripe={loadstripe} options={options}>
                        <CheckoutForm
                          payment={stripepayment}
                          condition={stripecondition}
                          setcondition={setstripecondition}
                          Ikey={intentkey}
                          action={actionNeeded}
                          load={setSpinner}
                          url={returnURL}
                          setDisablePayBtn={setDisablePayBtn}
                        />
                      </Elements>
                    </div>
                  )} */}
                   </CardBody>
                    </Card>
                </div>
                <div
                  className="slide"
                  // style={{ maxHeight: selectedMethod === "stripe" ? '500px' : '0px', overflow: 'hidden', transition: 'max-height 0.3s ease' }}
                  style={{
                    height: selectedMethod === "banktransfer" ? "258px" : "0px",
                    overflow: "hidden",
                    transition: "height 0.3s ease",
                    opacity: selectedMethod === "banktransfer" ? 1 : 0,
                  }}
                >

                  {selectedMethod === "banktransfer" && (
                    <Card className="m-10 stripe-form">
                      <CardBody
                        style={{
                          backgroundColor: "#fafafb",
                          margin: "20px auto",
                          borderRadius: "12px",
                        }}
                      >
                        <div className="row" style={{textAlign: "center"}}>
                            <h3>
                              Bank Details
                            </h3>
                            {paymentMethods?.map((method, index) => {
                              if(method?.value === "banktransfer") {
                                return(
                                method?.config?.map((obj, index) => 
                                  Object.entries(obj).map(([key, value]) => (
                                    <div key={key}>
                                      <strong className="bank-details">
                                        {key}:{" "}
                                      </strong>
                                      <span>{value}</span>
                                    </div>
                                      
                                  ))
                                )
                                )
                              }
                            })}
                        </div>              
                      </CardBody>
                    </Card>
                  )}
                </div>
                <Card className="m-0  ">
                  <CardBody>
                    <div className="inner-content invite-user rd-group">
                      <h6 className="font16  font-semibold">
                        Choose Payment Amount
                      </h6>
                      <div className="radio-btn amount">
                        <Row>
                          <Col>
                            <div className="form-check form-check-inline mt-20">
                              <Input
                                type="radio"
                                id="customRadioInline6"
                                name="customRadioInline2"
                                className="form-check-input"
                                value="100"
                                checked={selectedAmount === 100}
                                onClick={() => {
                                  validation.resetForm({ values: "" }),
                                    setSelectedAmount(100)
                                }}
                                onChange={() => {}}
                                disabled={spinner}
                              />
                              <Label
                                className="form-check-label"
                                htmlFor="customRadioInline6"
                              >
                                <p className="font-normal">
                                  {currency?.prefix}$100 USD {currency?.suffix}
                                </p>
                              </Label>
                            </div>
                          </Col>
                          <Col>
                            <div className="form-check form-check-inline mt-20">
                              <Input
                                type="radio"
                                id="customRadioInline7"
                                name="customRadioInline2"
                                className="form-check-input"
                                value="250"
                                checked={selectedAmount === 250}
                                onClick={() => {
                                  validation.resetForm({ values: "" }),
                                    setSelectedAmount(250)
                                }}
                                onChange={() => {}}
                                disabled={spinner}
                              />
                              <Label
                                className="form-check-label"
                                htmlFor="customRadioInline7"
                              >
                                <p className="font-normal">
                                  {currency?.prefix}$250 USD{currency?.suffix}{" "}
                                </p>
                              </Label>
                            </div>
                          </Col>
                          <Col>
                            <div className="form-check form-check-inline mt-20">
                              <Input
                                type="radio"
                                id="customRadioInline8"
                                name="customRadioInline2"
                                className="form-check-input"
                                value="500"
                                checked={selectedAmount === 500}
                                onClick={() => {
                                  validation.resetForm({ values: "" }),
                                    setSelectedAmount(500)
                                }}
                                onChange={() => {}}
                                disabled={spinner}
                              />
                              <Label
                                className="form-check-label"
                                htmlFor="customRadioInline8"
                              >
                                <p className="font-normal">
                                  {currency?.prefix}$500 USD {currency?.suffix}
                                </p>
                              </Label>
                            </div>
                          </Col>
                          <Col>
                            <div className="form-check form-check-inline mt-20">
                              <Input
                                type="radio"
                                id="customRadioInline9"
                                name="customRadioInline2"
                                className="form-check-input"
                                value="1000"
                                checked={selectedAmount === 1000}
                                onClick={() => {
                                  validation.resetForm({ values: "" }),
                                    setSelectedAmount(1000)
                                }}
                                onChange={() => {}}
                                disabled={spinner}
                              />
                              <Label
                                className="form-check-label"
                                htmlFor="customRadioInline9"
                              >
                                <p className="font-normal">
                                  {" "}
                                  {currency?.prefix}$1000 USD {currency?.suffix}{" "}
                                </p>
                              </Label>
                            </div>
                          </Col>
                          <Col>
                            <div className="test form-check form-check-inline mt-20 ">
                              <span className="prefix">{currency?.prefix}$</span>
                              {/* <div className="inner-input-box"> */}
                              <Input
                                className="chose-payment"
                                value={validation.values.customAmount || ""}
                                placeholder="5000"
                                max="5000"
                                min="1"
                                onChange={e => {
                                  validation.handleChange(e)
                                  setcustompay(e.target.value)
                                }}
                                onBlur={(e) => {validation.handleBlur, custompay > 5000? validation.values.customAmount = 5000 :""}}
                                invalid={
                                  validation.touched.customAmount &&
                                  validation.errors.customAmount
                                    ? true
                                    : false
                                }
                                type="number"
                                name="customAmount"
                                onClick={() => {
                                  setSelectedAmount("custom")
                                }}
                                disabled={spinner}
                              />
                              {/* </div> */}
                              <span className="suffix">
                                {/* {" "} */}
                                {currency?.suffix}USD
                              </span>
                              {/* {validation.touched.customAmount &&
                                validation.errors.customAmount ? (
                                  <>
                                    <FormFeedback type="invalid">
                                      <img
                                        className="form-error-icon"
                                        src={rederror}
                                        alt=""
                                        height={15}
                                      />
                                      {validation.errors.customAmount}
                                    </FormFeedback>
                                  </>
                                ) : null} */}
                            </div>
                            <span className="billing-max-amt">*Maximum amount: 5000</span>
                            {/* <div className="form-check form-check-inline mt-20">
                                <span className="dollor">{currency?.prefix}</span>
                                <div className="inner-input-box">
                                  <Input
                                  className="custom-width"
                                  value={validation.values.customAmount || ""}
                                  // placeholder="$0.00 USD"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  invalid={
                                    validation.touched.customAmount &&
                                    validation.errors.customAmount
                                      ? true
                                      : false
                                  }
                                  type="text"
                                  name="customAmount"
                                  onClick={() => {
                                    setSelectedAmount("custom")
                                  }}
                                /></div>
                                <span className="usd"> {currency?.suffix}</span>
                                {validation.touched.customAmount &&
                                validation.errors.customAmount ? (
                                  <>
                                    <FormFeedback type="invalid">
                                      <img
                                        className="form-error-icon"
                                        src={rederror}
                                        alt=""
                                        height={15}
                                      />
                                      {validation.errors.customAmount}
                                    </FormFeedback>
                                  </>
                                ) : null}
                                {/* <Input
                                  type="radio"
                                  id="customRadioInline2"
                                  name="customRadioInline1"
                                  className="form-check-input"
                                />
                                <Label
                                  className="form-check-label"
                                  htmlFor="customRadioInline10"
                                >
                                  <p className="font-normal"> Custom </p>
                                </Label> //
                              </div> */}
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </CardBody>
                </Card>
                <div className="btn-group mt-30">
                  <button
                    className="btn btn-primary w-100 waves-effect waves-light btn-save font-normal btnv1"
                    type="submit"
                    disabled={spinner}
                  >
                    {spinner? <div className="ui active inline loader"></div> : "Add Fund"}
                  </button>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
        <div
          style={{ display: "none" }}
          dangerouslySetInnerHTML={{ __html: paypalBasicFormData }}
        ></div>
      </div>
      <TextLoader loading={loading} loader={loader}/>
      <PaymentModal openModal={openModal} message={"Payment"}/>
    </React.Fragment>
  )
}

export default withRouter(Billing)
