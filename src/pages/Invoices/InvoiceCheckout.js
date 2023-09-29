import React, { useEffect, useState } from "react"
import { withRouter, Link, useParams, useHistory, useLocation } from "react-router-dom"
// import { Elements } from "@stripe/react-stripe-js"
import razor from "../../assets/images/razor.png"
import paypal from "../../assets/images/paypal.png"
// import stripe from "../../assets/images/stripe.png"
import cardLogo from "../../assets/images/ccard-logos-set.png"

import crypto from "../../assets/images/crypto.png"
import wise from "../../assets/images/wise.png"
import { setPageTitle } from "../../helpers/api_helper_rs"
import TextLoader from "../../components/textLoader"
import { checkUser, getPaymentForms } from "../Authentication/store/apiServices"
// import CheckoutForm from "../Stripe/CheckoutForm"
import { loginData } from "../Authentication/store/apiServices"
import { 
  InvoicePay, 
  // sendStripeDetailsBack, 
  // getSavedCards 
} from "../Service/store/apiService"
import { SETTINGS } from "../../constants/api/api_path"
import { toast } from "react-toastify"
import {
  invoiceDetail,
  getPaymentMethodList,
  applyCredit,
} from "../Authentication/store/apiServices"
// import { loadStripe } from "@stripe/stripe-js/pure"
import useRazorpay from "react-razorpay"
import RazorPayForm from "../Razorpay/RazorpayForm"
// import { selectCardLogo } from "../../helpers/api_helper_rs"
import CreditCard from "../Stripe/CreditCard"
import PaymentModal from "../../components/Common/PaymentModal"
const InvoiceCheckout = props => {
  const Razorpay = useRazorpay()
  const params = useParams()
  const navigate = useHistory()
  const location = useLocation()
  const [paymentType, setPaymentType] = useState("paypal")
  const [userData, setUserData] = useState()
  const [loader, setLoader] = useState(true)
  const [loading, setLoading] = useState(true)
  const [currency, setCurrency] = useState()
  const [paymentGateways, setPaymentGateways] = useState()
  const HOST_URL = process.env.REACT_APP_HOST
  // const [stripeInstances, setStripeInstances] = useState([])
  const [stripeKey, setstripeKey] = useState("")
  const [stripecondition, setstripecondition] = useState(false)
  const [invoiceData, setInvoiceData] = useState()
  // const [intentkey, setintentkey] = useState("")
  // const [actionNeeded, setactionNeeded] = useState(false)
  // const [returnURL, setreturnURL] = useState("")
  const [payPalForm, setPaypalForm] = useState()
  const [razorpayFormInfo, setRazorpayFormInfo] = useState()
  const [paypalSpinner, setPaypalSpinner] = useState(true)
  const [submitRazorPayForm, setSubmitRazorPayForm] = useState(false)
  const invoiceId = location?.state?.invoiceId
  const [spinner, setSpinner] = useState({ applycredit: false, pay: false })
  const [openModal, setOpenModal] = useState(false)
  const [selectedCard, setSelectedCard] = useState("")
  const [pay, setPay] = useState(false)
  const [payButtonReady, setPayButtonReady] = useState(false)
  // const [creditCardArray, setCreditCardArray] = useState("")

  useEffect(() => {
    setPageTitle("Invoice Checkout")
    let loginDetail = loginData()
    setUserData(loginDetail)
    // getInvoiceDetail()
    getPaymentGateways()
    setCurrency(location?.state?.invoiceDetail?.currency)
    setInvoiceData(location?.state?.invoiceDetail)
  }, [location])
  
  useEffect(() => {
    let isMounted = true;

    const getPaymentFormsInfo = async (id) => {
      try{
        let data = new URLSearchParams({
          invoiceid: id
        })
        let res = await getPaymentForms(data)
        if (isMounted) {
          let info = res?.data?.data?.paymentDetails
          setRazorpayFormInfo(info?.razorpay)
          setPaypalForm(info?.paypalhtml)
        }
      }catch(error) {
        toast.error(error?.response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        navigate.push({
          pathname:`/invoice-detail/${invoiceId}`,
          state:{
            action:true
          }
        })
      }
    }

    getPaymentFormsInfo(invoiceId)

    return () => {
      isMounted = false; // Update the flag when the component is unmounted
    };
  }, [invoiceId])

  const handlePaymentType = type => {
    setPaymentType(type)
  }

  const getInvoiceDetail = async () => {
    try {
      setLoader(true)
      setLoading(true)
      let res = await invoiceDetail(invoiceId)
      if (res) {
        let info = res?.data?.data
        setInvoiceData(info)
        setCurrency(info?.currency)
      }
      setLoader(false)
      setLoading(false)
    } catch (err) {
      setLoader(false)
      setLoading(false)
      toast.error(err?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  }

  const getPaymentGateways = async () => {
    try {
      let data = new URLSearchParams({
        invoiceid: invoiceId
      })
      let info = await getPaymentMethodList(data)
      if(info){
        setLoader(false)
        setLoading(false)
        let data = info?.data?.data
        setPaymentGateways(data)
        data?.map((el, index) => {
          if (index == 0) {
            setPaymentType(el.value)
          }
          if (el.value == "stripe") {
            setstripeKey(el?.config?.publishableKey)
          }
        })
        // setSelectedMethod(defaultMethod)
        // savedCards()
      }
    } catch (error) {}
  }
  
  useEffect(() => {
    if(pay && paymentType === "paypal" && payPalForm && payButtonReady){
      paypalFormSubmit()
    }else if(pay && paymentType === "razorpay" && razorpayFormInfo && payButtonReady){
      setSubmitRazorPayForm(true)
      setOpenModal(false)
    }
  },[razorpayFormInfo, payPalForm, pay, paymentType, payButtonReady])

  const handlePayButton = async () => {
    if (paymentType === "paypal") {
      setSpinner({ pay: true })
      setLoading(true)
      setPay(true)
      setOpenModal(true)
    } else if (paymentType === "razorpay") {
      setSpinner({ pay: true })
      setLoading(true)
      setPay(true)
      setOpenModal(true)
    } else {
      try {
        let data = new URLSearchParams({
          payment_method: paymentType,
          invoiceid: invoiceId,
        })
        let result = await InvoicePay(data)
        let info = result?.data?.data

        toast.success(result?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        if (info?.redirect === false && info?.invoiceId) {
          setSpinner({ pay: false })
          setLoading(false)
          navigate.push({
            pathname: `/confirmation`,
            state: { 
              invoiceId: info?.invoiceId
            },
          });
        } else if (info?.redirect === false) {
          setSpinner({ pay: false })
          setLoading(false)
          navigate.push(`/confirm`)
        }
      } catch (error) {
        setSpinner({ pay: false })
        setOpenModal(false)
        toast.error(error?.response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      }
    }
  }

  useEffect(() => {
    let isMounted = true; // Add a boolean flag to track component mount status

    const handlePayPalForm = () => {
      setTimeout(() => {
        let return_url = document.getElementsByName("return")
        let cancel_url = document.getElementsByName("cancel_return")
        
        if (return_url && return_url.length == 1) {
          let url = return_url[0]
          url.value = `${HOST_URL}/invoice-detail/${invoiceId}/${SETTINGS.successKey}`
        }else if(return_url && return_url.length > 1) {
          let url1 = return_url[0]
          let url2 = return_url[1]
          url1.value = `${HOST_URL}/invoice-detail/${invoiceId}/${SETTINGS.successKey}`
          url2.value = `${HOST_URL}/invoice-detail/${invoiceId}/${SETTINGS.successKey}`
        }
  
        if (cancel_url && cancel_url.length == 1) {
          let url = cancel_url[0]
          url.value = `${HOST_URL}/invoice-detail/${invoiceId}/${SETTINGS.cancelkey}`
        }else if(cancel_url && cancel_url.length > 1){
          let url1 = cancel_url[0]
          let url2 = cancel_url[1]
          url1.value = `${HOST_URL}/invoice-detail/${invoiceId}/${SETTINGS.cancelkey}`
          url2.value = `${HOST_URL}/invoice-detail/${invoiceId}/${SETTINGS.cancelkey}`
        }
      }, 2000)

      if(isMounted){
        setPayButtonReady(true)
      }
    }

    if (payPalForm) {
      setTimeout(() => {
        setPaypalSpinner(false)
      }, 400)

      if(isMounted){
        let submit = document.getElementsByName("submit")
        if (submit && submit.length) {
          const e = submit[0]
          e.style.width = "auto"
          e.style.height = "auto"
        }
        handlePayPalForm()
      }
    }

    return () => {
      isMounted = false; // Update the flag when the component is unmounted
    };
  }, [payPalForm])

 

  const paypalFormSubmit = () => {
    setTimeout(() => {
      let handlesubmit = document.getElementsByName("submit")
      if (handlesubmit && handlesubmit.length) {
        const e = handlesubmit[0]
        setSpinner({pay:false})
        setLoading(false)
        e.click()
      }
    },5000)
    
  }

  // const stripepayment = async res => {
  //   // setLoader(true)
  //   // setLoading(0)
  //   setSpinner({ pay: true })
  //   setDisablePayBtn(true)
  //   if (res.status == "error") {
  //     toast.error(res.data, {
  //       position: toast.POSITION.TOP_RIGHT,
  //     })
  //     // setLoader(false)
  //     setSpinner({ pay: false })
  //     setDisablePayBtn(false)
  //   }
  //   if (res.status == "data") {
  //     // setLoader(true)
  //     // setLoading(0)
  //     setSpinner({ pay: true })
  //     setDisablePayBtn(false)
  //     let param = new URLSearchParams({
  //       stripe_pm: res?.data?.id,
  //       invoiceId: invoiceId,
  //     })
  //     try {
  //       setSpinner({ pay: true })
  //       setDisablePayBtn(true)
  //       // setLoader(true)
  //       let res = await sendStripeDetailsBack(param)
  //       if (res) {
  //         setSpinner({ pay: false })
  //         setDisablePayBtn(false)
  //         // setLoader(false)
  //         if (res?.data?.data?.paymentStatus?.status == "captured") {
  //           navigate.push(`/invoice-detail/${invoiceId}`)
  //         } else {
  //           setintentkey(res?.data?.data?.paymentStatus?.client_secret)
  //           setreturnURL(`/invoice-detail/${invoiceId}`)

  //           setactionNeeded(true)
  //         }
  //       }
  //     } catch (err) {
  //       setSpinner({ pay: false })
  //       // setLoader(false)
  //       setDisablePayBtn(false)
  //       toast.error(err?.response?.data?.message, {
  //         position: toast.POSITION.TOP_RIGHT,
  //       })
  //     }
  //   }
  // }

  // const handleServerResponse = response => {
  //   // Handle the response from the child component
  //   const { error, paymentIntent } = response
  //   // ... do something with error and paymentIntent
  // }

  const handleApplyCredit = async () => {
    setSpinner({ applycredit: true })
    setLoading(true)
    setOpenModal(true)
    try {
      navigate.push(`/invoice-detail/${invoiceId}/${SETTINGS?.processKey}`)
      let data = new URLSearchParams({
        invoiceid: invoiceId,
      })
      let result = await applyCredit(data)
      let info = result?.data?.data
      if (info?.creditApplied === "error") {
        toast.error("error", {
          position: toast.POSITION.TOP_RIGHT,
        })
      } else {
        let res = checkUser()
        toast.success(result?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      }

      if (info?.amount > 0) {
        getInvoiceDetail()
      } else {
        navigate.push(`/invoice-detail/${invoiceId}`)
      }
      setSpinner({ applycredit: false })
      setLoading(false)
      setOpenModal(false)
    } catch (error) {
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      })
      setOpenModal(false)
      setLoading(false)
      setSpinner({ applycredit: false })
    }
  }

  return (
    <div>
      <section className="rs-payment-section rs-product-section">
        <div
          className={
            loader ? "rs-product-left  overlayerloader" : "rs-product-left"
          }
        >
          <div className="rs-product-left-title">
            <div className="rs-product-left-link">
              <Link
                to={`/invoice-detail/${invoiceId}`}
                className="rs-product-left-link-confirm"
              >
                <i className="feather icon-arrow-left" />
                Back
              </Link>
            </div>
          </div>
          <div className="rs-product-left-contentbar">
            <div className="row">
              <div className="col-lg-7">
                <div style={{ padding: "20px 0 20px 0" }}>
                  <h2 className="payment-heading">Payment Methods✨</h2>
                </div>
                {paymentGateways?.map((paymentMethod, index) => {
                  if (paymentMethod?.value === "paypal") {
                    return (
                      <div
                        className="rs-product-left-box rs-product-left-download"
                        key={index}
                      >
                        <h5>{paymentMethod?.name}</h5>
                        <div className="form-check"
                         onClick={(e) => {
                          (spinner?.applycredit || spinner?.pay)? e?.preventDefault() : handlePaymentType(paymentMethod?.value)
                        }}
                        >
                          {payPalForm ? (
                            paypalSpinner ? (
                              <div className="paypal-load ui active centered inline loader payapalloader"></div>
                            ) : (
                              <div
                                dangerouslySetInnerHTML={{ __html: payPalForm }}
                              ></div>
                            )
                          ) : (
                            <img src={paypal} />
                          )}
                          <input
                            className="form-check-input"
                            type="radio"
                            name="radio-group"
                            onClick={e => {
                              (spinner?.applycredit || spinner?.pay)? e?.preventDefault() : handlePaymentType(e.target.value)
                            }}
                            id="paypal"
                            value={paymentMethod?.value}
                            checked={paymentType === paymentMethod?.value}
                            onChange={() => {}}
                          />
                        </div>
                      </div>
                    )
                  }

                  if (paymentMethod?.value === "paypalcheckout") {
                    return (
                      <div
                        className="rs-product-left-box rs-product-left-download"
                        key={index}
                      >
                        <h5>{paymentMethod?.name}</h5>
                        <div
                          className="form-check"
                          onClick={(e) => {
                            (spinner?.applycredit || spinner?.pay)? e?.preventDefault() : handlePaymentType(paymentMethod?.value)
                          }}
                        >
                          <img src={paypal} />
                          <input
                            className="form-check-input"
                            type="radio"
                            name="radio-group"
                            onClick={e => {
                              (spinner?.applycredit || spinner?.pay)? e?.preventDefault() : handlePaymentType(e.target.value)
                            }}
                            id="paypalcheckout"
                            value={paymentMethod?.value}
                            checked={paymentType === paymentMethod?.value}
                            onChange={() => {}}
                          />
                        </div>
                      </div>
                    )
                  }

                  if (paymentMethod?.value === "crypto") {
                    return (
                      <div
                        className="rs-product-left-box rs-product-left-download"
                        key={index}
                      >
                        <h5>Credit/Debit Card</h5>
                        <div
                          className="form-check"
                          onClick={(e) => {
                            (spinner?.applycredit || spinner?.pay)? e?.preventDefault() : handlePaymentType(paymentMethod?.value)
                          }}
                        >
                          <img src={crypto} />
                          <input
                            className="form-check-input"
                            type="radio"
                            name="radio-group"
                            onClick={e => {
                              (spinner?.applycredit || spinner?.pay)? e?.preventDefault() : handlePaymentType(e.target.value)
                            }}
                            id="crypto"
                            value="crypto"
                            checked={paymentType == "crypto"}
                            onChange={() => {}}
                          />
                        </div>
                      </div>
                    )
                  }

                  if (paymentMethod?.value === "razorpay") {
                    return (
                      <div
                        className="rs-product-left-box rs-product-left-download"
                        key={index}
                      >
                        <h5>UPI / NEFT / IMPS</h5>
                        <div
                          className="form-check"
                          onClick={(e) => {
                            (spinner?.applycredit || spinner?.pay)? e?.preventDefault() : handlePaymentType(paymentMethod?.value)
                          }}
                        >
                          <img src={razor} />
                         <RazorPayForm
                            razorpayFormInfo={razorpayFormInfo}
                            submitRazorPayForm={submitRazorPayForm}
                            Razorpay={Razorpay}
                            setSubmitRazorPayForm={setSubmitRazorPayForm}
                            invoiceId={invoiceId}
                            setSpinner={setSpinner}
                            setLoading={setLoading}
                            setOpenModal={setOpenModal}
                          /> 
                          <input
                            className="form-check-input"
                            type="radio"
                            name="radio-group"
                            onClick={e => {
                              (spinner?.applycredit || spinner?.pay)? e?.preventDefault() : handlePaymentType(e.target.value)
                            }}
                            // defaultValue
                            id="razorpay"
                            value={paymentMethod?.value}
                            checked={paymentType == paymentMethod?.value}
                            onChange={() => {}}
                          />
                        </div>
                      </div>
                    )
                  }

                  if (paymentMethod?.value === "banktransfer") {
                    return (
                      <div
                        className="rs-product-left-box rs-product-left-download"
                        key={index}
                      >
                        <h5>{paymentMethod?.name}</h5>
                        <div
                          className="form-check"
                          onClick={(e) => {
                            (spinner?.applycredit || spinner?.pay)? e?.preventDefault() : handlePaymentType(paymentMethod?.value)
                          }}
                        >
                          <img src={wise} />
                          <input
                            className="form-check-input"
                            type="radio"
                            name="radio-group"
                            onClick={e => {
                              (spinner?.applycredit || spinner?.pay)? e?.preventDefault() : handlePaymentType(e.target.value)
                            }}
                            id="banktransfer"
                            value={paymentMethod?.value}
                            checked={paymentType == paymentMethod?.value}
                            onChange={() => {}}
                          />
                        </div>
                        {paymentType === "banktransfer" ? (
                          <div
                            className="row"
                            style={{ paddingTop: "10px" }}
                            key={index}
                          >
                            <h3 style={{ paddingBottom: "10px" }}>
                              Bank Details
                            </h3>
                            {paymentMethod?.config?.map((obj, index) =>
                              Object.entries(obj)?.map(([key, value]) => (
                                <div key={key}>
                                  <strong className="bank-details">
                                    {key}:{" "}
                                  </strong>
                                  <span>{value}</span>
                                </div>
                              ))
                            )}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    )
                  }

                  if (paymentMethod?.value === "stripe") {
                    return (
                      <div
                        className="rs-product-left-box rs-product-left-download invoice-checkout-scroll"
                        key={index}
                      >
                        <h5>{paymentGateways[index]?.name}</h5>
                        <div
                          className="form-check"
                          onClick={(e) => {
                            (spinner?.applycredit || spinner?.pay)? e?.preventDefault() : handlePaymentType(paymentGateways[index]?.value)
                          }}
                        >
                          {/* <img className="credit-card"  src={cardLogo} /> */}
                          {paymentType === paymentGateways[index]?.value ? (
                            ""
                          ) : (
                            <img className="credit-card" src={cardLogo} />
                          )}

                          <p></p>
                          <input
                            className="form-check-input mb-4"
                            type="radio"
                            name="radio-group"
                            onClick={e => {
                              (spinner?.applycredit || spinner?.pay)? e?.preventDefault() : handlePaymentType(e.target.value)
                            }}
                            id={`stripe-${index}`}
                            value={paymentGateways[index]?.value}
                            checked={
                              paymentType === paymentGateways[index]?.value
                            }
                            onChange={() => {}}
                          />
                        </div>
                        {(paymentType === paymentGateways[index]?.value && invoiceData?.total > 0) ? 
                          <CreditCard 
                            paymentMethods={paymentGateways}
                            stripecondition={stripecondition}
                            setstripecondition={setstripecondition}
                            setSpinner={setSpinner}
                            setLoading={setLoading}
                            spinner={spinner?.pay}
                            selectedMethod={paymentType}
                            selectedAmount={invoiceData?.total}
                            custompay={""}
                            setOpenModal={setOpenModal}
                            paymentId={invoiceId}
                            setSelectedCard={setSelectedCard}
                            page={"invoiceCheckout"}
                          /> : ""}
                      </div>
                    )
                  }
                })}
                
                {/* ///////////////////////stripe start//////////////////// */}

                {/* {stripeInstances?.map((stripeInstance, index) => {
                  if (stripeInstance) {
                    const options = {
                      mode: "payment",
                      amount: 1099,
                      currency: "usd",
                      paymentMethodCreation: "manual",
                      // Fully customizable with appearance API.
                      appearance: {
                        
                      },
                    }
                    return (
                      <div
                        className="rs-product-left-box rs-product-left-download"
                        key={index}
                      >
                        <h5>{paymentGateways[index]?.name}</h5>
                        <div
                          className="form-check"
                          onClick={() => {
                            handlePaymentType(paymentGateways[index]?.value)
                          }}
                        > */}
                          {/* // <img className="credit-card"  src={cardLogo} /> */}
                          {/* {paymentType === paymentGateways[index]?.value ? (
                            ""
                          ) : (
                            <img className="credit-card" src={cardLogo} />
                          )}

                          <p></p>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="radio-group"
                            onClick={e => {
                              handlePaymentType(e.target.value)
                            }}
                            id={`stripe-${index}`}
                            value={paymentGateways[index]?.value}
                            checked={
                              paymentType === paymentGateways[index]?.value
                            }
                            onChange={() => {}}
                            disabled={disablePayBtn}
                          />
                        </div>
                        {(paymentType === paymentGateways[index]?.value && invoiceData?.total > 0) ? 
                          <CreditCard 
                            creditCardArray={creditCardArray} 
                            paymentMethods={paymentGateways}
                            payment={stripepayment}
                            condition={stripecondition}
                            setcondition={setstripecondition}
                            Ikey={intentkey}
                            action={actionNeeded}
                            load={setSpinner}
                            spinner={spinner?.pay}
                            url={returnURL}
                            setDisablePayBtn={setDisablePayBtn}
                            selectedMethod={paymentType}
                          /> : ""} */}
                        {/* {(paymentType === paymentGateways[index]?.value &&
                          invoiceData?.total > 0) ? 
                          creditCardArray?.length > 0 && creditCardArray?.map((card, index) => {
                            let logo = selectCardLogo(card?.cardType)
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
                                <span>{card?.card}</span>&nbsp;
                                <span>{card?.cardLabel}</span>&nbsp;
                                <span className="ms-auto">{card?.expiry}</span>
                              </div>
                            </div>)
                          }) 
                          : 
                        ""} */}
                        {/* {paymentType === paymentGateways[index]?.value &&
                          invoiceData?.total > 0 && (
                            <div className="row mt-3">
                              <Elements
                                stripe={stripeInstance}
                                options={options}
                              >
                                <CheckoutForm
                                  payment={stripepayment}
                                  condition={stripecondition}
                                  setcondition={setstripecondition}
                                  // handle={handleServerResponse}
                                  Ikey={intentkey}
                                  action={actionNeeded}
                                  load={setSpinner}
                                  url={returnURL}
                                  setDisablePayBtn={setDisablePayBtn}
                                />
                              </Elements>
                            </div>
                          )} */}
                      {/* </div>
                    )
                  }
                })} */}
                {/* ////////////////////////stripe end////////////////////////////////////////////// */}
                <div className="rs-product-left-link">
                  <Link
                    to={`/invoice-detail/${invoiceId}`}
                    className="rs-product-left-link-confirm"
                  >
                    <i className="feather icon-arrow-left" />
                    Back
                  </Link>
                </div>
              </div>
              <div className="offset-lg-1 col-lg-4">
                <div className="rs-product-left-box rs-product-left-box-second invoice-checkout-box">
                  <h5>Proceed to Pay</h5>
                  <div className="rs-product-left-text-price">
                    <ul>
                      {invoiceData?.invoiceitems?.map((item, index) => {
                        return (
                          <li key={index}>
                            <div style={{ display: "flex", gap: "5px" }}>
                              {">> "}
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: item?.description,
                                }}
                              ></div>
                            </div>
                            <span>
                              {currency?.prefix}
                              {item?.amount} {currency?.suffix}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                  <div className="rs-product-left-text-price">
                    <ul>
                      <li>
                        <p>Subtotal</p>
                        <span>
                          {currency?.prefix}
                          {invoiceData?.subtotal} {currency?.suffix}
                        </span>
                      </li>
                      {invoiceData?.promo_code?.amount && (
                        <li>
                          <span>
                            {invoiceData?.promo_code?.amount}{" "}
                            {invoiceData?.promo_code?.type == "percent"
                              ? "%"
                              : "fixed"}{" "}
                            One Time Discount
                          </span>
                          <span>
                            - {currency?.prefix}
                            {invoiceData?.promo_code?.pre} {currency?.suffix}
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className="rs-product-left-text-price">
                    <ul>
                      <li>
                        <p>Total (incl. taxes)</p>
                        <span className="rs-product-left-price-color">
                          {currency?.prefix}
                          {invoiceData?.total} {currency?.suffix}
                        </span>
                      </li>
                    </ul>
                  </div>
                  {invoiceData?.clientsdetails?.credit > 0 && (
                    <>
                      <div className="rs-product-payment">
                        <h5>Apply Credit</h5>
                        <p>
                          Your current credit balance is
                          <span className="product-payment-bold-text">
                            {" "}
                            {currency?.prefix}
                            {invoiceData?.clientsdetails?.credit}{" "}
                            {currency?.suffix}
                          </span>
                          . Click the button below to apply this amount to the
                          invoice
                        </p>
                      </div>
                      <div className="rs-product-left-payment-btn">
                        <button
                          onClick={handleApplyCredit}
                          className="invoice-chechout-apply-btn"
                          disabled={spinner?.pay}
                        >
                          {spinner?.applycredit ? (
                            <div className="ui active inline loader"></div>
                          ) : (
                            "Apply Credit"
                          )}
                        </button>
                      </div>
                    </>
                   )} 
                  <div className="rs-product-left-price-btn">
                    <button
                      className="btn btn-primary w-100 waves-effect waves-light"
                      disabled={
                        !userData ||
                        paymentType == "banktransfer" ||
                        spinner?.applycredit ||
                        spinner?.pay
                      }
                      style={{
                        cursor:
                          !userData || paymentType == "banktransfer"
                            ? "not-allowed"
                            : "pointer",
                      }}
                      onClick={() =>
                        paymentType == "stripe" && invoiceData?.total > 0
                          ? (setstripecondition(true), setSpinner({pay:true}),setLoading(true), setOpenModal(true))
                          : handlePayButton()
                      }
                    >
                      {spinner?.pay ? (
                        <div className="ui active inline loader"></div>
                      ) : (
                        <span>
                          Pay {currency?.prefix}
                          {invoiceData?.total} {currency?.suffix}{" "}
                        </span>
                      )}
                    </button>
                  </div>
                  <div className="rs-product-left-price-content">
                    <p>
                      Have questions? Contact our sales team for assistance.{" "}
                      <Link onClick={(e) => {(spinner?.pay || spinner?.applycredit)? e.preventDefault() : null}} to="/support-ticket/2">Click here</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <TextLoader loading={loading} loader={loader}/>
        <PaymentModal openModal={openModal} message={"Payment"}/>
      </section>
    </div>
  )
}
export default withRouter(InvoiceCheckout)
