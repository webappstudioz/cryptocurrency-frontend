import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useParams, useHistory, useLocation } from "react-router-dom"
import {
  invoiceDetail,
  storeUserData,
  loginData,
  changePaymentStatus,
  getPaymentRejectReasons,
} from "../Authentication/store/apiServices"
import TextLoader from "../../components/textLoader"
import { toast } from "react-toastify"
import { FormatDate, addSpace, firstLetterCapital, setPageTitle } from "../../helpers/api_helper_rs"
import bitCoinIcon from "../../assets/images/btc.png"
import bitCashIncon from "../../assets/images/bch.png"
import InvoiceRejectModal from "../../components/Common/InvoiceRejectModel"

function InvoiceDetail() {
  const param = useParams()
  const navigate = useHistory()
  const notesRef = useRef()
  const [loader, setLoader] = useState(false)
  const [loading, setLoading] = useState(false)
  const [Details, setDetails] = useState("")
  const [isRejectModal, setIsRejectModal] = useState(false)
  const [finalAddressArr, setFinalAddressArr] = useState([])

  useEffect(() => {
    setPageTitle("Invoice")
    getInvoiceDetail()
  }, [param.id])

  const getInvoiceDetail = async () => {
    try {
      let res = await invoiceDetail(param.id)
      // console.log("res", res)
      if (res) {
        let info = res?.data?.data
        setDetails(info)
        setLoader(false)
        setLoading(false)
        let data = loginData()
        data.credit = info?.clientsdetails?.credit
        storeUserData(data)
      }
    } catch (err) {
      console.log("err", err)
      setLoader(false)
      setLoading(false)
      toast.error(err?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      })
      if (err?.response?.status === 403) {
      } else if (err?.response?.status === 404 || err?.response?.status === 400) {
        navigate.push("/invoice")
      }
    }
  }

  useEffect(() => {
    setFinalAddressArr([])
    let addressArray = [
      Details?.clientsdetails?.address1,
      Details?.clientsdetails?.address2,
      Details?.clientsdetails?.city,
      Details?.clientsdetails?.fullstate,
      Details?.clientsdetails?.postcode,
    ]
    let newArr = addressArray.filter(item => item !== "" && item !== "undefined");
    if (newArr.length) {
      setFinalAddressArr(newArr)
    }
  }, [Details])

  useEffect(() => {
    if (Details?.notes) {
      let notesElement = notesRef?.current
      if (notesElement) {
        const imgTag = notesElement.querySelector('img');
        if (imgTag) {
          const parts = imgTag.src?.split('/');
          const imageName = parts[parts?.length - 1];
          if (imageName === "btc.png") {
            imgTag.src = bitCoinIcon
          } else if (imageName === "bch.png") {
            imgTag.src = bitCashIncon
          } else {
            imgTag.remove()
          }
        }
      }
    }
  }, [Details?.notes])

  const handlePayment = async (status) => {
    console.log("accept")
    try {
      let data = new URLSearchParams({
        invoice_id: param.id,
        status: status
      })
      let result = await changePaymentStatus(data)
      console.log("result", result)
    } catch (error) {
      console.log("error", error)
    }
  }

  return (
    <div>
      <>
        <section
          className={
            loader
              ? "rs-product-section rs-product-section-single overlayerloader"
              : "rs-product-section rs-product-section-single"
          }
        >
          <div className="rs-product-left">
            <div className="rs-product-left-title rs-product-left-title-wrap">
              <div className="rs-product-left-link">
                <Link to="/invoice">
                  <i className="feather icon-arrow-left" />
                  back to Invoice List
                </Link>
              </div>
            </div>

            <div className="rs-product-left-contentbar rs-product-left-contentbar-wrap">
              <div className="row">
                <div className="col-lg-12 left-invoice">
                  <div className="single-invoice">
                    <span className={`status ${Details?.status} `}>
                      status : {Details?.status}
                    </span>
                    <h3>Invoice: #{Details.id}</h3>
                    <div className="row">
                      <div className="col-lg-6 col-sm-6">
                        <p className="issue-date">Pay By</p>
                        <p className="date">{Details?.send_from}</p>
                        <p className="due-date">Invoice Date</p>
                        <p className="date">{FormatDate(Details?.created_at)}</p>
                      </div>
                      <div className="col-lg-6 col-sm-6 company-details">
                        <p className="pay-to">Pay To:</p>
                        <p className="date">{Details?.send_to}</p>

                        <p className="pay-to">Payment Status:</p>
                        <p className="date">{Details?.status}</p>
                      </div>
                    </div>
                  </div>
                  <div className="receipt-details" style={{ backgroundColor: "#fff" }}>
                    <div className="row">
                      <div className="col-lg-6 col-sm-6 company-details">
                        <p className="due-date">Payment Type</p>
                        <p className="date">{Details?.payment_type}</p>
                        <p className="due-date">Payment Method</p>
                        <p className="date">{Details?.method_type === "bank" ? "Bank Transfer" : Details?.method_type}</p>
                      </div>
                      <div className="col-lg-6 col-sm-6 company-details">
                        <p className="pay-to">Amount:</p>
                        <p className="date">{Details?.amount}</p>
                        <p className="pay-to">Payment ID:</p>
                        <p className="date">{Details?.payment_id}</p>
                      </div>
                    </div>
                  </div>
                  <div className="receipt-details" style={{ backgroundColor: "#fff" }}>
                    <div className="row">
                      <div className="col-lg-6 col-sm-6 company-details">
                        <p className="due-date">Reason of Cancellation</p>
                        <p className="date">{Details?.payment_type}</p>
                      </div>
                    </div>
                  </div>
                  {Details?.status === "pending" && <div className="btn-group mt-30">
                    <button
                      className="btn btn-primary w-100 waves-effect waves-light btn-cancel m-0"
                      onClick={() => { setIsRejectModal(true) }}
                    >
                      Reject
                    </button>
                    <button
                      className="btn btn-primary w-100 waves-effect waves-light btn-save m-0"
                      // type="submit"
                      onClick={(e) => handlePayment("paid")}
                    >
                      Accept
                    </button>
                  </div>}
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
      <InvoiceRejectModal
        isRejectModal={isRejectModal}
        setIsRejectModal={setIsRejectModal}
        invoiceId={param.id}
      />
      <TextLoader loading={loading} loader={loader} />
      {/* <PaymentModal openModal={openModal} message={"Payment"}/> */}
    </div>
  )
}

export default InvoiceDetail
