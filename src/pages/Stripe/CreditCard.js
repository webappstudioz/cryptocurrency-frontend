import React, { useState, useEffect, useRef } from "react"
import CheckoutForm from "./CheckoutForm"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js/pure"
import { getStoredCards, selectCardLogo } from "../../helpers/api_helper_rs"
import CreditCardLogo from "../../assets/images/credit-card-logo.jpg"
import { addWalletAmount, checkUser, sendInvoiceMail } from "../Authentication/store/apiServices"
import { toast } from "react-toastify"
import { sendStripeDetailsBack, placeOrder, syncService, orderConfirmation } from "../Service/store/apiService"
import { useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { getCards } from "../../store/savedcards/action"
import { CONFIGURATIONS, SETTINGS } from "../../constants/api/api_path"
import { delete_cookie } from "sfcookies"
import ThreeDCard from "./ThreeDCard"
import { syncServiceSilent } from "../../store/services/actions"

const CreditCard = props => {
  const ref = useRef(null);
  const options = {
    mode: "payment",
    amount: 1099,
    currency: "usd",
    paymentMethodCreation: "manual",
    // Fully customizable with appearance API.
    appearance: {
      /*...*/
    },
  }
  const savedCards = useSelector(state => state?.savedCards?.cards)
  const navigate = useHistory()
  const dispatch = useDispatch()
  const silentSignupStatus = useSelector((state) => state?.Account?.user_registerd)
  const [loadstripe, setloadstripe] = useState("")
  const [stripeInstances, setStripeInstances] = useState([])
  const [selectedCard, setSelectedCard] = useState("")
  const [intentkey, setintentkey] = useState("")
  const [returnURL, setreturnURL] = useState({ url: "", invoiceId: "", orders: "", serviceid: "" })
  const [actionNeeded, setactionNeeded] = useState(false)
  const [creditCardArray, setCreditCardArray] = useState([])
  const [invoiceId, setInvoiceId] = useState("")
  const [orders, setOrders] = useState([])
  const [payButton, setPayButton] = useState({action: false, id: ""})

  /**
   * We utilize this component in three different scenarios:
   * During product checkout, we make use of the "Place Order" API. after this use  "sendStripeDetailsBack" API.
   * For invoice checkout, we make use of the "sendStripeDetailsBack" API to handle the transaction.
   * Lastly, in the context of adding funds, we make use of the "addWalletAmount" API, after this use "sendStripeDetailsBack" API.
   */

  useEffect(() => {
    const fetchStripeInstances = async () => {
      if (props?.paymentMethods) {
        // Add a check for paymentGateways
        const instances = await Promise.all(
          props?.paymentMethods.map(async paymentMethod => {
            if (paymentMethod?.value === "stripe") {
              setloadstripe(loadStripe(paymentMethod?.config?.publishableKey))
              return loadStripe(paymentMethod?.config?.publishableKey)
            }
          })
        )
        setStripeInstances(instances)
      }
    }

    fetchStripeInstances()
  }, [props?.paymentMethods])

  const handleRemoveDuplicateCards = (cards) => {
    const uniqueArray = cards?.reduce((accumulator, current) => {
      const existingEntry = accumulator.find(item => item.pm_id === current.pm_id);
      if (!existingEntry) {
        accumulator.push(current);
      }
      return accumulator;
    }, []);

    setCreditCardArray(uniqueArray)
  }

  useEffect(() => {
    if (savedCards) {
      handleRemoveDuplicateCards(savedCards)
    } else {
      let cards = getStoredCards()
      handleRemoveDuplicateCards(cards)
    }
  }, [savedCards])


  useEffect(() => {
    creditCardArray?.map((card) => {
      if (card?.order_preference === 0) {
        setSelectedCard(card?.pm_id)
        props?.setSelectedCard(card?.pm_id)
      }
    })
  }, [creditCardArray])

  useEffect(() => {
    if (creditCardArray?.length > 0) {
      if (props?.paymentId && selectedCard != "add_new") {
        handlePaymentSubmit(selectedCard, props?.paymentId)
      } else {
        if (props?.stripecondition === true && selectedCard != "add_new") {
          if (props?.page == "productCheckout") {
            setPayButton({action:true, id: selectedCard})
            // handlePlaceOrder(selectedCard)
          } else {
            handleAddAmount(selectedCard)
          }
        }
      }
    }
  }, [props?.stripecondition])

  const handleSelectedCard = id => {
    !props?.spinner ? (setSelectedCard(id), props?.setSelectedCard(id)) : ""
  }

  /**
   * api to get stripe_pm id. 
   */

  const stripepayment = res => {
    props?.setSpinner(true)
    props?.setLoading(true)
    if (res.status == "error") {
      toast.error(res.data, {
        position: toast.POSITION.TOP_RIGHT,
      })
      props?.setSpinner(false)
      props?.setLoading(false)
    }
    if (res.status == "data") {
      props?.setSpinner(true)
      props?.setLoading(true)
      // props?.page == "productCheckout" ? handlePlaceOrder(res?.data?.id) : handleAddAmount(res?.data?.id)
      if(props?.paymentId){
        handlePaymentSubmit(res?.data?.id, props?.paymentId, "invoiceCheckout")
      }else {
        props?.page == "productCheckout" ? setPayButton({action:true,id: res?.data?.id}) : handleAddAmount(res?.data?.id)
      }
    }
  }

  const handleAddAmount = async (id) => {
    let paramss = new URLSearchParams({
      paymentmethod: props?.selectedMethod,
      amount: props?.selectedAmount == "custom" ? props?.custompay : props?.selectedAmount,
    })
    try {
      let APIres = await addWalletAmount(paramss)
      if (APIres) {
        let info = APIres?.data?.data
        sendInvoiceMail(info?.invoiceId)
        if (info) {
          setInvoiceId(info?.invoiceId)
          toast.success(APIres?.data?.message, {
            position: toast.POSITION.TOP_RIGHT,
          })
          id != "add_new" ? handlePaymentSubmit(id, info?.invoiceId, "addAmount") : null
        }
      }
    } catch (error) {
      props?.setSpinner(false)
      props?.setLoading(false)
      props?.setOpenModal(false)
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      })
      props?.setstripecondition(false)
    }
  }

   /**
   * If the user registered from the product checkout page.
   * We are awaiting a response from the silent signup API.
   * If the user is already logged in, the order is placed normally.
   */
  useEffect(() => {
    if(payButton?.action === true) {
      // handlePlaceOrder()
      if(silentSignupStatus != "under_process" || silentSignupStatus == true){
        handlePlaceOrder(payButton?.id)
      }
    }
  },[payButton?.action])

  const handlePlaceOrder = async (id) => {
    try {
      let data = ""
      if (selectedCard != "add_new") {
        data = new URLSearchParams({
          cart_token: props?.cartToken,
          payment_method: props?.paymentType,
          apply_credit: props?.creditCardApplied,
          stripe_pm: selectedCard
        });
      } else {
        data = new URLSearchParams({
          cart_token: props?.cartToken,
          payment_method: props?.paymentType,
          apply_credit: props?.creditCardApplied,
        });
      }

      let result = await placeOrder(data);
      props?.creditCardApplied && checkUser();
      if (result) {
        delete_cookie(SETTINGS.GUESTTOKEN);
        let info = result?.data?.data;
        setInvoiceId(info?.invoiceId)
        setOrders(info?.orders)
        dispatch(syncServiceSilent(info?.serviceid))
        localStorage.setItem(CONFIGURATIONS?.NEWSERVICEID, info?.syncServiceids)
        // syncService(info?.serviceid)
        if (info) {
          toast.success(result?.data?.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          if (info?.serviceid && info.invoiceId) {
              sendOrderConfirmation(info?.serviceid, info?.orderid, info?.invoiceId );
            } else if (info.serviceid) {
              sendOrderConfirmation(info?.serviceid, info?.orderid);
            }
          if (info?.paymentStatus?.status === "captured") {
            navigate.push({
              pathname: '/confirmation',
              state: {
                orders: info?.orders,
                invoiceId: info?.invoiceId,
                serviceid: info?.serviceid
              }
            })
          } else {
            handlePaymentSubmit(id, info?.invoiceId, "placeOrder", info?.orders, info?.serviceid)
          }
        }
      }
    } catch (error) {
      props?.setSpinner(false);
      props?.setLoading(false)
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

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

  const handlePaymentSubmit = async (id, invoiceid, action, orders, serviceid) => {
    let params = new URLSearchParams({
      stripe_pm: id,
      invoiceId: invoiceid,
    })
    try {
      let res = await sendStripeDetailsBack(params)
      if (res) {
        if (res?.data?.data?.paymentStatus?.status == "captured") {
          props?.setSpinner(true)
          props?.setLoading(true)
          if (action == "placeOrder") {
            navigate.push({
              pathname: `/confirmation`,
              state: {
                orders: orders,
                invoiceId: invoiceid,
                serviceid: serviceid
              },
            });
          } else {
            navigate.push(`/invoice-detail/${invoiceid}/${SETTINGS?.successKey}`)
          }
        } else {
          setintentkey(res?.data?.data?.paymentStatus?.client_secret)
          if (action == "placeOrder") {
            setreturnURL({ url: '/confirmation', invoiceId: invoiceid, orders: orders, serviceid: serviceid });
          } else {
            setreturnURL({ url: `/invoice-detail`, invoiceId: invoiceid })
          }
          setactionNeeded(true)
        }
        if (selectedCard === "add_new") {
          dispatch(getCards())
        } else if (creditCardArray?.length === 0) {
          dispatch(getCards())
        }
      }
    } catch (err) {
      props?.setSpinner(false)
      props?.setLoading(false)
      props?.setOpenModal(false)
      toast.error(err?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      })

      //handling unexpected error
      navigate.push({
        pathname: `/confirmation`,
        state: {
          orders: orders,
          invoiceId: invoiceid,
          serviceid: serviceid
        },
      });
      props?.setstripecondition(false)
    }
  }

  const handleScroll = (ref) => {
    setTimeout(() => {
      ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }, 500)
  }

  return (
    <div className="row">
      {creditCardArray?.length > 0 &&
        creditCardArray?.map((card, index) => {
          let logo = selectCardLogo(card?.card_type)
          return (
            <div className="row" key={index}>
              <div
                className="credit-card-option mx-auto"
                onClick={() => {
                  handleSelectedCard(card?.pm_id)
                }}
                style={{ cursor: "pointer" }}

              >
                <input
                  className="form-check-input me-2"
                  type="radio"
                  name="card-group"
                  value={card?.pm_id}
                  checked={card?.order_preference === 0 || selectedCard === card?.pm_id}
                  onChange={() => { }}
                  disabled={props?.spinner}
                />{" "}
                <span>
                  <img width="45px" height="27px" src={logo} />
                </span>
                &nbsp; &nbsp;
                <span>{card?.card_last_four}</span>&nbsp;
                <span className="ms-auto">{card?.description}</span>&nbsp;
                <span className="ms-auto">{card?.expiry_date}</span>
              </div>
            </div>
          )
        })}
      {creditCardArray?.length > 0 ? (
        <div className="row">
          <div
            className="credit-card-option mx-auto mb-4"
            onClick={() => {
              handleSelectedCard("add_new")
              handleScroll(ref)
            }}
            style={{ cursor: "pointer" }}
          >
            <input
              className="form-check-input me-2"
              type="radio"
              name="card-group"
              value="add_new"
              checked={selectedCard === "add_new"}
              onChange={() => { }}
            />
            <span>
              <img width="45px" height="27px" src={CreditCardLogo} />
            </span>
            &nbsp; &nbsp;
            <span>Add new card</span>
          </div>
        </div>
      ) : (
        <div className="row credit-card-option mx-auto ">
          {loadstripe && (
            <Elements stripe={loadstripe} options={options}>
              <CheckoutForm
                payment={stripepayment}
                stripecondition={props?.stripecondition}
                setstripecondition={props?.setstripecondition}
                Ikey={intentkey}
                action={actionNeeded}
                setSpinner={props?.setSpinner}
                setLoading={props?.setLoading}
                setOpenModal={props?.setOpenModal}
                url={returnURL}
                invoiceId={invoiceId}
                orders={orders}
              />
            </Elements>
          )}
        </div>
      )}
      <div className="row" ref={ref}>
        {(!actionNeeded && selectedCard === "add_new") && (
          loadstripe && (
            <Elements stripe={loadstripe} options={options}>
              <CheckoutForm
                payment={stripepayment}
                stripecondition={props?.stripecondition}
                setstripecondition={props?.setstripecondition}
                Ikey={intentkey}
                action={actionNeeded}
                setSpinner={props?.setSpinner}
                setLoading={props?.setLoading}
                setOpenModal={props?.setOpenModal}
                url={returnURL}
                invoiceId={invoiceId}
                orders={orders}
              />
            </Elements>
          )
        )}
      </div>
      {(actionNeeded && selectedCard != "add_new") && <div>
        <Elements stripe={loadstripe} options={options}>
          <ThreeDCard
            action={actionNeeded}
            Ikey={intentkey}
            setSpinner={props?.setSpinner}
            setLoading={props?.setLoading}
            setactionNeeded={setactionNeeded}
            setOpenModal={props?.setOpenModal}
            url={returnURL}
          />
        </Elements>
      </div>}
    </div>
  )
}

export default CreditCard
