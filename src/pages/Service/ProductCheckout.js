import React, { useEffect, useState } from "react";
import razor from "../../assets/images/razor.png";
import paypal from "../../assets/images/paypal.png";
import crypto from "../../assets/images/crypto.png";
import wise from "../../assets/images/wise.png";
import hand from "../../assets/images/hand.PNG";
import { decrypt } from "../../helpers/api_helper_rs";
import TextLoader from "../../components/textLoader";
import SignIn from "../CartAuthentication/signin";
import SignUp from "../CartAuthentication/signup";
import CartTwoFA from "../CartAuthentication/cartTwoFA";
import { checkUser, loginData } from "../Authentication/store/apiServices";
import { useDispatch, useSelector } from "react-redux";
import {
  getCartDetail,
  placeOrder,
  orderConfirmation,
  updateCart,
  syncService,
} from "./store/apiService";
import { read_cookie, delete_cookie, bake_cookie } from "sfcookies";
import { CONFIGURATIONS, SETTINGS } from "../../constants/api/api_path";
import { toast } from "react-toastify";
import useRazorpay from "react-razorpay";
import RazorPayForm from "../Razorpay/RazorpayForm";
import Switch from "react-switch";
import cardLogo from "../../assets/images/ccard-logos-set.png";
import PaymentModal from "../../components/Common/PaymentModal";
import {
  withRouter,
  Link,
  useHistory,
} from "react-router-dom";
import CreditCard from "../Stripe/CreditCard";
import ProgressBar from "../../components/progressBar";
import { getUserDetails } from "./store/apiService";
import { syncServiceSilent } from "../../store/services/actions";
const ProductCheckout = (props) => {
  const Razorpay = useRazorpay();
  const navigate = useHistory();
  const dispatch = useDispatch()
  const HOST_URL = process.env.REACT_APP_HOST;
  const [paymentType, setPaymentType] = useState("");
  const [userData, setUserData] = useState();
  const [token, setToken] = useState();
  const [isVerified, setIsVerified] = useState(false);
  const [userRegistered, setUserRegistered] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState("");
  const [currency, setCurrency] = useState();
  const [authCard, setAuthCard] = useState({
    pageHeading: "Sign Up",
    buttonName: "Already Registered?",
    action: "register",
  });
  const [paymentGateways, setPaymentGateways] = useState();
  const [cartToken, setCartToken] = useState();
  const [creditCardApplied, setCreditCardApplied] = useState(false);
  const [paypalBasicFormData, setPaypalBasicFormData] = useState();
  const [stripecondition, setstripecondition] = useState(false);
  const [orderSummary, setOrderSummary] = useState();
  const [stripeKey, setstripeKey] = useState("");
  const [payPalForm, setPaypalForm] = useState();
  const userInfo = useSelector((state) => state?.Account?.user)
  const userLogin = useSelector((state) => state?.Login)
  const silentSignupStatus = useSelector((state) =>state?.Account?.user_registerd)
  const [razorpayFormInfo, setRazorpayFormInfo] = useState();
  const [submitRazorPayForm, setSubmitRazorPayForm] = useState(false);
  const [invoiceId, setInvoiceId] = useState();
  const [isupdateCart, setIsUpdateCart] = useState(false);
  const [spinner, setSpinner] = useState({
    pay: false,
    login: false,
    register: false,
    verify: false
  });
  const [openModal, setOpenModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState("");
  const [lineLoader, setLineLoader] = useState("")
  const [payButton, setPayButton] = useState(false)
  const reduxCurrency = useSelector(state => state?.Widgets?.currency)

  useEffect(() => {
    reduxCurrency?.id && handleUpdateCart()
  },[reduxCurrency])

  useEffect(() => {
    let usertoken = JSON.parse(localStorage.getItem("jwt"));
    usertoken ? ((usertoken = JSON.parse(decrypt(usertoken))), setToken(usertoken)) : setToken("");
    (userInfo?.token && !userInfo?.role)? setUserRegistered(true) : setUserRegistered(false);
    let loginDetail = loginData();
    setUserData(loginDetail);
    setIsVerified(false);
  }, [userLogin, isVerified, userInfo?.token]);

  useEffect(() => {
    let guest_Token = read_cookie(SETTINGS.GUESTTOKEN);
    if (guest_Token?.length) {
      setCartToken(guest_Token);
      cartDetail(guest_Token);
    } else {
      toast.success("Your shopping cart is empty.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      navigate.push("/productlist");
    }
  }, []);

  useEffect(() => {
    if (orderSummary) {
      setLoader(false);
      // setLoading(false)
    }
  }, [userData, userInfo?.email, userLogin, orderSummary]);

  useEffect(() => {
    isupdateCart ? handleUpdateCart() : "";
  }, [isupdateCart]);

  useEffect(() => {
    if (paypalBasicFormData) {
      let submit = document.getElementsByName("submit");
      if (submit && submit.length) {
        const e = submit[0];
        e.style.width = "auto";
        e.style.height = "auto";
      }
      handleClick();
    }
  }, [paypalBasicFormData]);

  const handlePaymentType = (type) => {
    setPaymentType(type);
  };

  const cartDetail = async (guest_Token) => {
    setLoading(true);
    setLoader(true);
    try {
      let data = new URLSearchParams({
        cart_token: guest_Token,
      });
      let result = await getCartDetail(data);
      let info = result?.data?.data;
      if (info) {
        setOrderSummary(info?.cart_summary);
        // silentSignupStatus? getUserDetails() : null
        if (!userData && info?.currency) {
          bake_cookie(SETTINGS.CURRENCY, info?.currency?.id);
          setCurrency(info?.currency);
        }
        setPaymentGateways(info?.payment_gateways);
        setLoader(false);
        setLoading(false);
        info?.payment_gateways?.map((el, index) => {
          if (index == 0) {
            setPaymentType(el.value);
          }
          if (el.value == "stripe") {
            setstripeKey(el?.config?.publishableKey);
          }
        });
      } else {
        navigate.push(`/productlist`);
      }
    } catch (error) {
      setLoader(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    silentSignupStatus === true? getUserDetails() : null
  },[silentSignupStatus])

  const handlestripeclick = () => {
    setstripecondition(true);
    setLoading(true);
    setOpenModal(true);
    setSpinner({ pay: true });
  };

  const handleAuthentication = () => {
    if (authCard?.action === "login") {
      setAuthCard({
        pageHeading: "Sign Up",
        buttonName: "Already Registered?",
        action: "register",
      });
    } else {
      setAuthCard({
        pageHeading: "Sign In",
        buttonName: "Create a New Account",
        action: "login",
      });
    }
  };

  const handlePayButton = async () => {
    setLoading(true);
    setOpenModal(true);
    setSpinner({ pay: true });
    setPayButton(true)
    // try {
    //   let data = new URLSearchParams({
    //     cart_token: cartToken,
    //     payment_method: paymentType,
    //     apply_credit: creditCardApplied,
    //   });
    //   let result = await placeOrder(data);
    //   creditCardApplied && checkUser();      
    //   let info = result?.data?.data;
    //   setInvoiceId(info?.invoiceId);
    //   if (result) {
    //     dispatch(syncServiceSilent(info?.serviceid))
    //     localStorage.setItem(CONFIGURATIONS?.NEWSERVICEID, info?.syncServiceids)
    //     // syncService(info?.serviceid);
    //     delete_cookie(SETTINGS.GUESTTOKEN);
    //   }

    //   if (info?.payment_method === "paypal" && info?.redirect === true) {
    //     setPaypalBasicFormData(info);
    //     setPaypalForm(info?.payment_button);
    //   } else if (info?.payment_method === "banktransfer") {
    //     if (info?.orderid && info?.invoiceId) {
    //       navigate.push({
    //         pathname: `/confirmation`,
    //         state: { 
    //           orders: info?.orders,
    //           invoiceId: info?.invoiceId,
    //           serviceid: info?.serviceid
    //         },
    //       });
    //     }
    //   } else if (info?.payment_method === "razorpay") {
    //     setRazorpayFormInfo(info?.payment_button);
    //     setSubmitRazorPayForm(true);
    //   }
    //   toast.success(result?.data?.message, {
    //     position: toast.POSITION.TOP_RIGHT,
    //   });

    //   if (info?.redirect === false && info?.invoiceId) {
    //     navigate.push({
    //       pathname: `/confirmation`,
    //       state: { 
    //         orders: info?.orders,
    //         invoiceId: info?.invoiceId,
    //         serviceid: info?.serviceid
    //       },
    //     });
    //   } else if (info?.redirect === false) {
    //     setSpinner({ pay: false });
    //     // setLoading(false)
    //     navigate.push(`/confirm/${info?.orderid}`);
    //     navigate.push({
    //       pathname: `/confirmation`,
    //       state: { 
    //         orders: info?.orders,
    //         serviceid: info?.serviceid
    //       },
    //     });
    //   }

    //   if (info?.serviceid && info.invoiceId) {
    //     sendOrderConfirmation(info?.serviceid, info?.orderid, info?.invoiceId );
    //   } else if (info.serviceid) {
    //     sendOrderConfirmation(info?.serviceid, info?.orderid);
    //   }
    //   setSpinner({ pay: false });
    //   // setLoading(false)
    // } catch (error) {
    //   setOpenModal(false);
    //   setSpinner({ pay: false });
    //   setLoading(false)
    //   toast.error(error?.response?.data?.message, {
    //     position: toast.POSITION.TOP_RIGHT,
    //   });
    //   navigate.push("/productlist")
    // }
  };

  useEffect(() => {
    if(payButton){
      /**
       * If the user registered from the product checkout page.
       * We are awaiting a response from the silent signup API.
       * If the user is already logged in, the order is placed normally.
       */
      if(silentSignupStatus != "under_process" || silentSignupStatus == true){
        handlePlaceOrder()
      }
    }
  },[silentSignupStatus, payButton])

  const handlePlaceOrder = async() => {
    try {
      let data = new URLSearchParams({
        cart_token: cartToken,
        payment_method: paymentType,
        apply_credit: creditCardApplied,
      });
      let result = await placeOrder(data);
      // creditCardApplied && checkUser();   //give error on live server "Undefined array key \"invoice_date_created\"" we can not find this error  
      let info = result?.data?.data;
      setInvoiceId(info?.invoiceId);
      if (result) {
        dispatch(syncServiceSilent(info?.serviceid))
        localStorage.setItem(CONFIGURATIONS?.NEWSERVICEID, info?.syncServiceids)
        // syncService(info?.serviceid);
        delete_cookie(SETTINGS.GUESTTOKEN);
      }

      if (info?.payment_method === "paypal" && info?.redirect === true) {
        setPaypalBasicFormData(info);
        setPaypalForm(info?.payment_button);
      } else if (info?.payment_method === "banktransfer") {
        if (info?.orderid && info?.invoiceId) {
          navigate.push({
            pathname: `/confirmation`,
            state: { 
              orders: info?.orders,
              invoiceId: info?.invoiceId,
              serviceid: info?.serviceid
            },
          });
        }
      } else if (info?.payment_method === "razorpay") {
        setRazorpayFormInfo(info?.payment_button);
        setSubmitRazorPayForm(true);
      }
      toast.success(result?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });

      if (info?.redirect === false && info?.invoiceId) {
        navigate.push({
          pathname: `/confirmation`,
          state: { 
            orders: info?.orders,
            invoiceId: info?.invoiceId,
            serviceid: info?.serviceid
          },
        });
      } else if (info?.redirect === false) {
        setSpinner({ pay: false });
        navigate.push(`/confirm/${info?.orderid}`);
        navigate.push({
          pathname: `/confirmation`,
          state: { 
            orders: info?.orders,
            serviceid: info?.serviceid
          },
        });
      }
      if (info?.serviceid && info.invoiceId) {
        sendOrderConfirmation(info?.serviceid, info?.orderid, info?.invoiceId );
      } else if (info.serviceid) {
        sendOrderConfirmation(info?.serviceid, info?.orderid);
      }
      setSpinner({ pay: false });
    } catch (error) {
      setOpenModal(false);
      setSpinner({ pay: false });
      setLoading(false)
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      navigate.push("/productlist")
    }
  }

  const handleClick = () => {
    if (paypalBasicFormData) {
      setTimeout(() => {
        let return_url = document.getElementsByName("return");
        let cancel_url = document.getElementsByName("cancel_return");
        if (return_url && return_url.length) {
          let url = return_url[0];
          url.value = `${HOST_URL}/invoice-detail/${paypalBasicFormData?.invoiceId}/${SETTINGS.successKey}`;
        }

        if (cancel_url && cancel_url.length) {
          let url = cancel_url[0];
          url.value = `${HOST_URL}/invoice-detail/${paypalBasicFormData?.invoiceId}/${SETTINGS.cancelkey}`;
        }
      }, 2000);

      setTimeout(() => {
        let handlesubmit = document.getElementsByName("submit");
        if (handlesubmit && handlesubmit.length) {
          const e = handlesubmit[0];
          e.click();
        }
      }, 5000);
    }
  };

  const sendOrderConfirmation = async (serviceId, orderid, invoiceid) => {
    try {
      let data = "";
      if (serviceId && invoiceid) {
        data = new URLSearchParams({
          serviceid: serviceId,
          invoiceid: invoiceid,
          orderid: orderid
        });
      } else if (serviceId) {
        data = new URLSearchParams({
          serviceid: serviceId,
        });
      }
      let result = await orderConfirmation(data); //send order confirmation and invoice mail to the user
    } catch (error) {}
  };

  const handleUpdateCart = async () => {
    setLineLoader(true)
    try {
      let data = new URLSearchParams({
        cart_token: cartToken,
      });

      let res = await updateCart(data);
      let info = res?.data?.data;
      setOrderSummary(info?.cart_summary);
      setCurrency(info?.currency);
      setLineLoader(false);
      setPaymentGateways(info?.payment_gateways)
      info?.payment_gateways?.map((el, index) => {
        if (index == 0) {
          setPaymentType(el.value);
        }
        if (el.value == "stripe") {
          setstripeKey(el?.config?.publishableKey);
        }
      });
    } catch (error) {
      setLineLoader(false);
    }
  };

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
              <Link onClick={(e) => {(spinner?.pay || spinner?.login || spinner?.register || spinner?.verify)? e?.preventDefault() : null }} to={`/cart-review`}>
                Review <i className="feather icon-arrow-right" />
              </Link>
              <a className="rs-product-left-link-confirm">
                Payment
              </a>
              <h5 >
                <i className="feather icon-arrow-right" />{" "}
                Confirm
              </h5>
            </div>
          </div>
          <div className="rs-product-left-contentbar">
            <div className="row">
              <div className="col-lg-7">
                <div className="rs-product-left-box rs-product-left-download">
                  {!userData && (
                    <h5 className="cart-auth-h5">
                      {token
                        ? "Two-Factor Authentication"
                        : !userRegistered
                        ? authCard?.pageHeading
                        : ""}{" "}
                      {!token && !userRegistered && (
                        <button
                          className="cart-auth-btn"
                          onClick={(e) => {(spinner?.pay || spinner?.login || spinner?.register || spinner?.verify)? e?.preventDefault() : handleAuthentication()}}
                        >
                          {authCard?.buttonName}
                        </button>
                      )}
                    </h5>
                  )}
                  <div className="">
                    {userData ? (
                      <div className="cart-signup">
                        <div className="text-center mt-2">
                          <img className="s-icon" src={hand} alt="" />
                          <h5 className="m-0">Welcome Back !</h5>
                          <h3>
                            {userData
                              ? userData?.first_name?.charAt(0)?.toUpperCase() +
                                userData?.first_name?.slice(1).toLowerCase()
                              : ""}{" "}
                            {userData
                              ? userData?.last_name?.charAt(0)?.toUpperCase() +
                                userData?.last_name?.slice(1).toLowerCase()
                              : ""}
                          </h3>
                        </div>
                      </div>
                    ) : token ? (
                      <CartTwoFA 
                        setLoader={setLoader}
                        setLoading={setLoading}
                        spinner={spinner}
                        setSpinner={setSpinner}
                        setIsVerified={setIsVerified} 
                        setIsUpdateCart={setIsUpdateCart}
                      />
                    ) : authCard?.action === "login" ? (
                      <SignIn
                        spinner={spinner}
                        setSpinner={setSpinner}
                        setIsUpdateCart={setIsUpdateCart}
                      />
                    ) : userRegistered ? (
                      <>
                        <div className="cart-signup">
                          <div className="text-center mt-2">
                            <p className="text-muted m-0 font-normal">
                              We’ve sent a verification link to{" "}
                              <span className="fw-medium text-primary font-normal">
                                {userInfo?.email}
                              </span>
                              . The link expires shortly.
                              <br />
                              You can resume your order process after successful
                              account verification.
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <SignUp
                        loader={loader}
                        setLoader={setLoader}
                        loading={loading}
                        setLoading={setLoading}
                        spinner={spinner}
                        setSpinner={setSpinner}
                      />
                    )}
                  </div>
                </div>
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
                        <div
                          className="form-check"
                          onClick={(e) => (spinner?.pay || spinner?.login || spinner?.register || spinner?.verify)? e?.preventDefault() : 
                            handlePaymentType(paymentMethod?.value)
                          }
                        >
                          {payPalForm ? (
                            <div
                              dangerouslySetInnerHTML={{ __html: payPalForm }}
                            ></div>
                          ) : (
                            <img src={paypal} />
                          )}
                          <input
                            className="form-check-input"
                            type="radio"
                            name="radio-group"
                            onClick={(e) =>
                              handlePaymentType(e.target.value)
                            }
                            id="paypal"
                            value={paymentMethod?.value}
                            checked={paymentType === paymentMethod?.value}
                            onChange={() => {}}
                            disabled={spinner?.pay || spinner?.login || spinner?.register || spinner?.verify}
                          />
                        </div>
                      </div>
                    );
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
                          onClick={(e) => (spinner?.pay || spinner?.login || spinner?.register || spinner?.verify)? e?.preventDefault() : 
                            handlePaymentType(paymentMethod?.value)
                          }
                        >
                          <img src={paypal} />
                          <input
                            className="form-check-input"
                            type="radio"
                            name="radio-group"
                            onClick={(e) => {
                              handlePaymentType(e.target.value);
                            }}
                            id="paypalcheckout"
                            value={paymentMethod?.value}
                            checked={paymentType === paymentMethod?.value}
                            onChange={() => {}}
                            disabled={spinner?.pay || spinner?.login || spinner?.register || spinner?.verify}
                          />
                        </div>
                      </div>
                    );
                  }

                  if (paymentMethod?.value === "crypto") {
                    return (
                      <div
                        className="rs-product-left-box rs-product-left-download"
                        key={index}
                      >
                        <h5>Cryptocurrency</h5>
                        <div
                          className="form-check"
                          onClick={(e) => {(spinner?.pay || spinner?.login || spinner?.register || spinner?.verify)? e?.preventDefault() :
                            handlePaymentType(paymentMethod?.value);
                          }}
                        >
                          <img src={crypto} />
                          <input
                            className="form-check-input"
                            type="radio"
                            name="radio-group"
                            onClick={(e) => {
                              handlePaymentType(e.target.value);
                            }}
                            id="crypto"
                            value="crypto"
                            checked={paymentType == "crypto"}
                            onChange={() => {}}
                            disabled={spinner?.pay || spinner?.login || spinner?.register || spinner?.verify}
                          />
                        </div>
                      </div>
                    );
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
                          onClick={(e) => {(spinner?.pay || spinner?.login || spinner?.register || spinner?.verify)? e?.preventDefault() :
                            handlePaymentType(paymentMethod?.value);
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
                            onClick={(e) => {
                              handlePaymentType(e.target.value);
                            }}
                            id="razor"
                            value={paymentMethod?.value}
                            checked={paymentType == paymentMethod?.value}
                            onChange={() => {}}
                            disabled={spinner?.pay || spinner?.login || spinner?.register || spinner?.verify}
                          />
                        </div>
                      </div>
                    );
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
                          onClick={(e) => {(spinner?.pay || spinner?.login || spinner?.register || spinner?.verify)? e?.preventDefault() :
                            handlePaymentType(paymentGateways[index]?.value);
                          }}
                        >
                          {paymentType === paymentGateways[index]?.value ? (
                            ""
                          ) : (
                            <img className="credit-card" src={cardLogo} />
                          )}
                          <p></p>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="radio-group"
                            onClick={(e) => {
                              handlePaymentType(e.target.value);
                            }}
                            id={`stripe-${index}`}
                            value={paymentGateways[index]?.value}
                            checked={
                              paymentType === paymentGateways[index]?.value
                            }
                            onChange={() => {}}
                            disabled={spinner?.pay || spinner?.login || spinner?.register || spinner?.verify}
                          />
                        </div>
                        {paymentType === paymentGateways[index]?.value &&
                        orderSummary?.total > 0 ? (
                          <CreditCard
                            paymentMethods={paymentGateways}
                            stripecondition={stripecondition}
                            setstripecondition={setstripecondition}
                            setSpinner={setSpinner}
                            setLoading={setLoading}
                            spinner={spinner?.pay}
                            selectedMethod={paymentType}
                            selectedAmount={orderSummary?.total}
                            custompay={""}
                            setOpenModal={setOpenModal}
                            paymentId={""}
                            setSelectedCard={setSelectedCard}
                            page={"productCheckout"}
                            creditCardApplied={creditCardApplied}
                            paymentType={paymentType}
                            cartToken={cartToken}
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    );
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
                          onClick={(e) => {(spinner?.pay || spinner?.login || spinner?.register || spinner?.verify)? e?.preventDefault() :
                            handlePaymentType(paymentMethod?.value);
                          }}
                        >
                          <img src={wise} />
                          <input
                            className="form-check-input"
                            type="radio"
                            name="radio-group"
                            onClick={(e) => {
                              handlePaymentType(e.target.value);
                            }}
                            id="banktransfer"
                            value={paymentMethod?.value}
                            checked={paymentType == paymentMethod?.value}
                            onChange={() => {}}
                            disabled={spinner?.pay || spinner?.login || spinner?.register || spinner?.verify}
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
                            {paymentMethod?.config.map((obj, index) =>
                              Object.entries(obj).map(([key, value]) => (
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
                    );
                  }
                })}

                {/* {paymentGateways?.cryptocheckout?.map(
                  (paymentMethod, index) => {
                    if (paymentMethod?.name) {
                      return (
                        <div
                          className="rs-product-left-box rs-product-left-download"
                          key={index}
                        >
                          <h5>Credit/Debit Card</h5>
                          <div className="form-check">
                            <img src={stripe} />
                            <input
                              className="form-check-input"
                              type="radio"
                              name="radio-group"
                              onClick={(e) => {
                                handlePaymentType(e.target.value);
                              }}
                              id="crypto"
                              value="crypto"
                              checked={paymentType == "crypto"}
                              onChange={() => {}}
                              disabled={disablePayBtn}
                            />
                          </div>
                        </div>
                      );
                    }
                  }
                )} */}
                {/* ///////////////////////stripe start//////////////////// */}

                {/* {stripeInstances.map((stripeInstance, index) => {
                  if (stripeInstance) {
                    const options = {
                      mode: "payment",
                      amount: 1099,
                      currency: "usd",
                      paymentMethodCreation: "manual",
                      // Fully customizable with appearance API.
                      appearance: {
                      }, 
                    };
                    return (
                      <div
                        className="rs-product-left-box rs-product-left-download"
                        key={index}
                      >
                        <h5>{paymentGateways[index]?.name}</h5>
                        <div
                          className="form-check"
                          onClick={() => {
                            handlePaymentType(paymentGateways[index]?.value);
                          }}
                        >
                          {paymentType === paymentGateways[index]?.value ? (
                            ""
                          ) : (
                            <img className="credit-card" src={cardLogo} />
                          )}
                          <p></p>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="radio-group"
                            onClick={(e) => {
                              handlePaymentType(e.target.value);
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
                        {(paymentType === paymentGateways[index]?.value &&
                          orderSummary?.total > 0) ?<CreditCard 
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
                        /> : ""}
                        {/* {(paymentType === paymentGateways[index]?.value &&
                          orderSummary?.total > 0) ? 
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
                          orderSummary?.total > 0 && <div className="row mt-3">
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
                              setDisablePayBtn={setDisablePayBtn}
                              url={returnURL}
                            />
                          </Elements>
                        </div>} 
                      </div>
                    );
                  }
                })}*/}
                {/* //////////////////////// stripe end////////////////////////////////////////////// */}
              </div>
              <div className="offset-lg-1 col-lg-4">
                <div className="rs-product-left-box rs-product-left-box-second">
                  <h5>Proceed to Pay</h5>
                  <div className="rs-product-left-text-price">
                    <ul>
                      <li>
                        <p>Subtotal</p>
                        <span>
                          {currency?.prefix}
                          {orderSummary?.sub_total} {currency?.suffix}
                        </span>
                      </li>
                      {orderSummary?.promo_code?.amount && (
                        <li>
                          <span>
                            {orderSummary?.promo_code?.amount}{" "}
                            {orderSummary?.promo_code?.type == "percent"
                              ? "%"
                              : "fixed"}{" "}
                            One Time Discount
                          </span>
                          <span>
                            - {currency?.prefix}
                            {orderSummary?.promo_code?.pre} {currency?.suffix}
                          </span>
                        </li>
                      )}
                      {orderSummary?.tax?.total > 0 ?
                     <> 
                      {(orderSummary?.tax?.tax1?.rate * 100 > 0)? <li>
                        <p>{orderSummary?.tax?.tax1?.name} @ {(orderSummary?.tax?.tax1?.rate * 100)?.toFixed(2)}%:</p>
                        <span>
                          {currency?.prefix}
                          {(orderSummary?.tax?.tax1?.total)?.toFixed(2)} {currency?.suffix}
                        </span>
                      </li> : null}
                      {(orderSummary?.tax?.tax2?.rate * 100 > 0)? <li>
                        <p>{orderSummary?.tax?.tax2?.name} @ {(orderSummary?.tax?.tax2?.rate * 100)?.toFixed(2)}%:</p>
                        <span>
                          {currency?.prefix}
                          {(orderSummary?.tax?.tax2?.total)?.toFixed(2)} {currency?.suffix}
                        </span>
                      </li> : null}
                      </>: null}
                      {/* <li>
                        <p>
                          Discount<span>XMAS22</span>
                        </p>
                        <span>-€100</span>
                      </li> */}
                    </ul>
                  </div>
                  <div className="rs-product-left-text-price">
                    <ul>
                      <li>
                        <p className="total-amount">Total (incl. taxes)</p>
                        <span className="rs-product-left-price-color">
                          {currency?.prefix}
                          {orderSummary?.total} {currency?.suffix}
                        </span>
                      </li>
                    </ul>
                  </div>
                  {userData?.credit > 0 && orderSummary?.total > 0 ? (
                    <>
                      <div className="rs-product-payment">
                        <h5>Apply Credit</h5>
                        <p>
                          Your current credit balance is 
                          <span className="product-payment-bold-text">
                            {" "}
                            {currency?.prefix}{userData?.credit}{" "}
                            {currency?.suffix}
                          </span>
                          . Click the button below to apply this amount to the
                          invoice.
                        </p>
                      </div>
                      {/* <div className="rs-product-left-payment-btn">
                        // <a href="#">Apply Credit</a> 
                        <input
                          type="checkbox"
                          className="btn-check "
                          id="btn-check-outlined"
                          onChange={() => {
                            setCreditCardApplied(!creditCardApplied);
                          }}
                        />
                        <label
                          className="btn btn-outline-primary apply-credit-btn"
                          htmlFor="btn-check-outlined"
                        >
                          Apply Credit
                        </label>
                      </div> */}
                      <div className="rs-product-left-payment-btn">
                        <Switch
                          borderRadius={6}
                          onColor="#285a3d"
                          activeBoxShadow="0px 0px 1px 2px"
                          onChange={() => {
                            setCreditCardApplied(!creditCardApplied);
                          }}
                          checked={creditCardApplied}
                          uncheckedIcon={
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                                fontSize: 15,
                              }}
                            >
                              No
                            </div>
                          }
                          checkedIcon={
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                                fontSize: 15,
                              }}
                            >
                              Yes
                            </div>
                          }
                        />
                        <label htmlFor="btn-check-outlined">Apply Credit</label>
                      </div>
                    </>
                  ) : (
                    ""
                  )}

                  <div className="rs-product-left-price-btn">
                    <button
                      className="btn btn-primary w-100 waves-effect waves-light"
                      disabled={!userData || spinner?.pay || spinner?.login || spinner?.register || spinner?.verify}
                      onClick={() =>
                        paymentType == "stripe" && orderSummary?.total > 0
                          ? handlestripeclick()
                          : handlePayButton()
                      }
                    >
                      {spinner?.pay ? (
                        <div className="ui active inline loader"></div>
                      ) : (
                        <span>
                          Pay {currency?.prefix}
                          {orderSummary?.total} {currency?.suffix}{" "}
                        </span>
                      )}
                    </button>
                  </div>
                  <div className="rs-product-left-price-content">
                    <p>
                      Have questions? Contact our sales team for assistance.{" "}
                      <Link onClick={(e) => {(spinner?.pay || spinner?.login || spinner?.register || spinner?.verify)? e?.preventDefault() : null }} to="/support-ticket/2">Click here</Link>
                    </p>
                  </div>
                <ProgressBar loading={lineLoader}/>
                </div>
              </div>
            </div>
            <div className="rs-product-left-link  mt-5">
              <Link
                onClick={(e) => {(spinner?.pay || spinner?.login || spinner?.register || spinner?.verify)? e?.preventDefault() : null }}
                to={`/cart-review`}
                className="rs-product-left-link-confirm"
              >
                <i className="feather icon-arrow-left" />
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
        <TextLoader loading={loading} loader={loader}/>
        <TextLoader loading={lineLoader} />
        <PaymentModal openModal={openModal} message={"Order"} />
      </section>
    </div>
  );
};
export default withRouter(ProductCheckout);
