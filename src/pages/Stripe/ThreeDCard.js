import React, { useEffect } from "react"
import { useStripe } from "@stripe/react-stripe-js"
import { useHistory } from "react-router-dom"
import { toast } from "react-toastify"
import { SETTINGS } from "../../constants/api/api_path"
import { paymentConfirm } from "../Service/store/apiService"
import { useDispatch } from "react-redux"
import { getCards } from "../../store/savedcards/action"

export default function ThreeDCard(props) {
  const stripe = useStripe()
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    props?.action == true && stripe ? handleServerResponse() : null
  }, [props?.action, stripe])

  const handleServerResponse = async () => {
    props.setSpinner(true)
    props?.setLoading(true)
    try {
      const { error: errorAction, paymentIntent } =
        await stripe.handleCardAction(props?.Ikey)
      if (errorAction) {
        toast.error(errorAction?.message, {
          position: toast.POSITION.TOP_RIGHT,
        }) // Show error from Stripe.js in payment form
        props?.url?.url === "/confirmation"
          ? history.push({
              pathname: props?.url.url,
              state: {
                orders: props?.url?.orders,
                invoiceId: props?.url?.invoiceId,
              },
            })
          : history.push(
              `${props?.url?.url}/${props?.url?.invoiceId}/${SETTINGS?.cancelkey}`
            )
        props?.setactionNeeded(false)
      } else {
        // The card action has been handled // The PaymentIntent can be confirmed again on the server
        try {
          props.setSpinner(true)
          props?.setLoading(true)
          let param = new URLSearchParams({ paymentintent: paymentIntent.id })
          let res = await paymentConfirm(param)
          if (res) {
            props.setSpinner(false)
            props?.setLoading(false)
            props.setOpenModal(false)
            toast.success(res?.data?.message, {
              position: toast.POSITION.TOP_RIGHT,
            })
            props?.setactionNeeded(false)
            props?.url?.url === "/confirmation"
              ? history.push({
                  pathname: props?.url?.url,
                  state: {
                    orders: props?.url?.orders,
                    invoiceId: props?.url?.invoiceId,
                  },
                })
              : history.push(
                  `${props?.url?.url}/${props?.url?.invoiceId}/${SETTINGS?.successKey}`
                )
          }
          dispatch(getCards())
        } catch (err) {
          props?.url?.url === "/confirmation"
            ? history.push({
                pathname: props?.url?.url,
                state: {
                  orders: props?.url?.orders,
                  invoiceId: props?.url?.invoiceId,
                },
              })
            : history.push(`${props?.url?.url}/${props?.url?.invoiceId}`)
          toast.error(err?.response?.data?.message, {
            position: toast.POSITION.TOP_RIGHT,
          })
          props.setSpinner(false)
          props?.setLoading(false)
          props.setOpenModal(false)
        }
      }
    } catch (err) {
      props.setSpinner(false)
      props?.setLoading(false)
      props.setOpenModal(false)
      toast.error(err?.message, {
        position: toast.POSITION.TOP_RIGHT,
      })
      props?.url?.url === "/confirmation"
        ? history.push({
            pathname: props?.url?.url,
            state: {
              orders: props?.url?.orders,
              invoiceId: props?.url?.invoiceId,
            },
          })
        : history.push(`${props?.url?.url}/${props?.url?.invoiceId}`)
      props?.setactionNeeded(false)
    }
  }
  return <></>
}
