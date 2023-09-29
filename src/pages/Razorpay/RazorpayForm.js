import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { SETTINGS } from "../../constants/api/api_path"
import { razorpayCapture } from "../Service/store/apiService"

const RazorPayForm = props => {
  const navigate = useHistory()
  const Razorpay = props?.Razorpay
  const [rzp1, setRzp1] = useState()
  const razorpayFormInfo = props?.razorpayFormInfo
  const submitForm = props?.submitRazorPayForm
  const invoiceId = props?.invoiceId   

  useEffect(() => {
    if (razorpayFormInfo) {
      handleRazorpayForm()
      props?.setOpenModal(false)
    }
  }, [razorpayFormInfo])
  
  useEffect(() => {
    if (submitForm) {
      razorpayFormSubmit()
    }
  }, [submitForm])

  const handleRazorpayForm = () => {
    if(razorpayFormInfo){
      var options = {
        key: razorpayFormInfo?.keyId, // Enter the Key ID generated from the Dashboard
        amount: razorpayFormInfo?.raz_amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: razorpayFormInfo?.currency,
        name: razorpayFormInfo?.companyname, //your business name
        description: razorpayFormInfo?.description,
        // image: "https://example.com/your_logo",
        order_id: razorpayFormInfo?.raz_order_id, //This is a sample Order ID. Pass the "id" obtained in the response of Step 1
        // callback_url: "https://eneqd3r9zrjok.x.pipedream.net/",
        prefill: {
          name: razorpayFormInfo?.clientdetails?.fullname, //your customer's name fullname
          email: razorpayFormInfo?.clientdetails?.email,
          contact: razorpayFormInfo?.clientdetails?.phonenumber,
        },
        handler: function (response) {
          props?.setSubmitRazorPayForm(false)
          invoiceId? navigate.push(`/invoice-detail/${invoiceId}/${SETTINGS?.successKey}`) : ""
          handleRazorPayCapture(response)
          // alert(response.razorpay_payment_id);
        },
        // notes: {
        //   address: "Razorpay Corporate Office",
        // },
        theme: {
          color: "#3399cc",
        },

        modal: {
          ondismiss: function () {
            document.body.classList.remove("overflow")
            invoiceId? navigate.push(`/invoice-detail/${invoiceId}/${SETTINGS?.cancelkey}`) : ""
            props?.setSubmitRazorPayForm(false)
          },
        },
      }
      if (Razorpay) {
        const rzp = new Razorpay(options)
        setRzp1(rzp)
      }
    }
  }

  const razorpayFormSubmit = () => {
    props?.setSpinner({pay:false})
    props?.setLoading(false)
    if (rzp1) {
      rzp1.on("payment.failed", function (response) {
        // alert(response.error.code)
        // alert(response.error.description)
        // alert(response.error.source)
        // alert(response.error.step)
        // alert(response.error.reason)
        // alert(response.error.metadata.order_id)
        // alert(response.error.metadata.payment_id)
      })

      rzp1.open()
    }
  }

  const handleRazorPayCapture = async razorpayInfo => {
    try {
      let data = new URLSearchParams({
        invoiceid: invoiceId,
        razorpay_payment_id: razorpayInfo?.razorpay_payment_id,
        razorpay_signature: razorpayInfo?.razorpay_signature,
        razorpay_order_id: razorpayInfo?.razorpay_order_id,
      })
      let res = await razorpayCapture(data)
    } catch (error) {
    }
  }

  return <div></div>
}

export default RazorPayForm
