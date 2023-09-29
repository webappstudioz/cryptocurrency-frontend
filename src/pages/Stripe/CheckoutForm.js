import React, { useState } from "react"
import {
  useStripe,
  useElements,
  PaymentElement,
  // CardElement,
} from "@stripe/react-stripe-js"
import { useEffect } from "react"
import { toast } from "react-toastify"
// import {paymentConfirm} from "../Service/store/apiService"
import { useHistory,useParams } from "react-router-dom"
import { loginData } from "../Authentication/store/apiServices"
// import { SETTINGS } from "../../constants/api/api_path"
export default function CheckoutForm(props) {
  const params= useParams()
  const history = useHistory()
  const stripe = useStripe()
  const elements = useElements()
  const [loggedIn, setloggedIn] = useState(
    localStorage.getItem("authUser") ? true : false
  )
  const [errorMessage, setErrorMessage] = useState()
  const [profileDetails, setprofileDetails] = useState({})

  const handleError = error => {
    toast.error(error.message, {
      position: toast.POSITION.TOP_RIGHT,
    })
    props.setstripecondition(false)
    props.setOpenModal(false)
    props.setSpinner(false)
    props?.setLoading(false)
    //  location.reload()
  }

  // useEffect(() => {
  //   props.action == true && handleServerResponse()
  // }, [props.action])

  useEffect(() => {
    props.stripecondition == true && handleSubmit()
  }, [props.stripecondition])
  
  useEffect(() => {
    if (loggedIn) {
      let loginDetail = loginData()
      setprofileDetails(prevProfileDetails => {
        const updatedProfileDetails = { ...prevProfileDetails }
        if (
          loginDetail?.address_one !== undefined &&
          loginDetail?.address_one !== ""
        ) {
          updatedProfileDetails.line1 = loginDetail.address_one
        }
        if (
          loginDetail?.address_two !== undefined &&
          loginDetail?.address_two !== ""
        ) {
          updatedProfileDetails.line2 = loginDetail.address_two
        }
        if (loginDetail?.city !== undefined && loginDetail?.city !== "") {
          updatedProfileDetails.city = loginDetail.city
        }
        if (loginDetail?.state !== undefined && loginDetail?.state !== "") {
          updatedProfileDetails.state = loginDetail.state
        }
        if (
          loginDetail?.zip_code !== undefined &&
          loginDetail?.zip_code !== ""
        ) {
          updatedProfileDetails.postal_code = loginDetail.zip_code
        }
        return updatedProfileDetails
      })
    }
  }, [])
  
  const handleSubmit = async event => {
    props.setSpinner(true)
    props?.setLoading(true)
    if (!stripe) {
      props.setSpinner(false)
      props?.setLoading(false)
      props.setOpenModal(false)
      return
    }
    const { error: submitError } = await elements.submit()
    if (submitError) {
      props.setSpinner(false)
      props?.setLoading(false)
      props.setOpenModal(false)
      handleError(submitError)
      return
    }
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      elements,
      params: {
        billing_details: {
          address: profileDetails,
        },
      },
    })

    if (error) {
      handleError(error)
      await props.payment({ status: "error", data: error })
      props.setstripecondition(false)

      return error
    }
    if (paymentMethod) {
      await props.payment({ status: "data", data: paymentMethod })
      return paymentMethod
    }
  }

  // const handleServerResponse = async () => {
  //   props.setSpinner(true)
  //   props.setDisablePayBtn(true)
  //   try {
  //     const { error: errorAction, paymentIntent } = await stripe.handleCardAction(
  //       props.Ikey
  //     )
  //     // props.setSpinner(false)
  //     // props.setOpenModal(false)
  //     props.setDisablePayBtn(false)
  //     if (errorAction) {
  //       toast.error(errorAction?.message, {
  //         position: toast.POSITION.TOP_RIGHT,
  //       }); // Show error from Stripe.js in payment form
  //       history.push(`${props.url}/${SETTINGS?.cancelkey}`)
  //     } else {
  //       // The card action has been handled // The PaymentIntent can be confirmed again on the server
  //       try {
  //         props.setSpinner(true)
  //         props.setDisablePayBtn(true)
  //         let param = new URLSearchParams({ paymentintent: paymentIntent.id })
  //         let res = await paymentConfirm(param)
  //         if (res) {
  //           props.setSpinner(false)
  //           props.setOpenModal(false)
  //           toast.success(res?.data?.message, {
  //             position: toast.POSITION.TOP_RIGHT,
  //           });
  //           history.push(`${props.url}/${SETTINGS?.successKey}`)
  //         }
          
  //       } catch (err) {
  //         toast.error(err?.response?.data?.message, {
  //           position: toast.POSITION.TOP_RIGHT,
  //         });
  //         props.setSpinner(false)
  //         props.setOpenModal(false)
  //       }
  //     }
  //   } catch (err) {
  //     props.setSpinner(false)
  //     props.setOpenModal(false)
  //     props.setDisablePayBtn(false)
  //     toast.error(err?.message, {
  //       position: toast.POSITION.TOP_RIGHT,
  //     });
  //     history.push(props.url)
  //   }
  // }

  return (
    <div>
    {/* <form> */}
      <PaymentElement />
      {errorMessage && <div>{errorMessage}</div>}
    {/* </form> */}
    </div>
  )
}
