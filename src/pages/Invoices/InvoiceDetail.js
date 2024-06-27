import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import pdfdown from "../../assets/images/pdfdown.png"
import pdfnew from "../../assets/images/pdfnew.png"
import { useParams, useHistory, useLocation } from "react-router-dom"
import {
  invoiceDetail,
  downloadInvoice,
  userRole,
  storeUserData,
  loginData,
  syncInvoice,
  applyCredit,
  invoiceForceRemote,
  checkUser
} from "../Authentication/store/apiServices"
import TextLoader from "../../components/textLoader"
import { toast } from "react-toastify"
import { SETTINGS } from "../../constants/api/api_path"
import { addSpace, firstLetterCapital, setPageTitle } from "../../helpers/api_helper_rs"
import PermissionDenied from "../Authentication/PermissionDenied"
import { useDispatch } from "react-redux"
import { isNotificationUpdated } from "../../store/auth/notification/action"
import { removeServices } from "../../store/services/actions"
import PaymentModal from "../../components/Common/PaymentModal"
import bitCoinIcon from "../../assets/images/btc.png"
import bitCashIncon from "../../assets/images/bch.png"
import { Watch } from "react-loader-spinner"

function InvoiceDetail() {
  const param = useParams()
  const navigate = useHistory()
  const location = useLocation()
  const blockonomicsData = location?.state?.blockonomics
  const notesRef = useRef()
  const action = location?.state?.action
  const [loader, setLoader] = useState(true)
  const [loading, setLoading] = useState(true)
  const [Details, setDetails] = useState("")
  const [permission, setPermission] = useState()
  const [spinner, setSpinner] = useState()
  const [openModal, setOpenModal] = useState(false)
  const [paymentProccessing, setPaymentProcessing] = useState(false)
  const invoiceMode = param?.mode
  const [finalAddressArr, setFinalAddressArr] = useState([])
  const [oldBalance, setOldBalance] = useState("")
  const [newBalance, setNewBalance] = useState("")
  const [totalAmt, setTotalAmt] = useState("")
  const dispatch = useDispatch()
  
  useEffect(() => {
    let role = userRole()
    role === "client"? setPermission(true) : ""
    setPageTitle("Invoice")
    getInvoiceDetail()
  }, [param.id])

  useEffect(() => {
    if (invoiceMode) {
      if (invoiceMode === SETTINGS.cancelkey) {
        toast.error("Payment has been cancelled by user", {
          position: toast.POSITION.TOP_RIGHT,
        })
      } else if (invoiceMode === SETTINGS.successKey) {
        toast.success("We have received your payment.", {
          position: toast.POSITION.TOP_RIGHT,
        })
      }
    }
  }, [invoiceMode])

  const getInvoiceDetail = async () => {
    try {
      let res = "";
      action? res = await syncInvoice(param.id, action) : res = await invoiceDetail(param.id)
      if (res) {
        let info = res?.data?.data
        setDetails(info)
        let totalBal = Math.abs(info?.total) * 100 
        setTotalAmt(totalBal)
        let oldBal = Math.abs(info?.balance) * 100
        setOldBalance(oldBal)
        setLoader(false)
        setLoading(false)
        setPermission(true)
        // if(invoiceMode === SETTINGS.BITPAY_CONFIRMED && info?.status === "Unpaid"){
        //   syncInvoiceForce() 
        // } 
          
        // if(invoiceMode){
          dispatch(isNotificationUpdated("unread"))
          dispatch(removeServices())
        // }
        let data = loginData()
        data.credit = info?.clientsdetails?.credit
        storeUserData(data)
      }
    } catch (err) {
     
      setLoader(false)
      setLoading(false)
      toast.error(err?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      })
      if(err?.response?.status === 403){
        setPermission(false)
      } else if(err?.response?.status === 404 || err?.response?.status === 400){
        navigate.push("/invoice")
      }
    }
  }

  const handleInvoice = async () => {
    setLoading(true)
    try{
      let res = await downloadInvoice(Details?.id)
      if (res) {
        toast.success("Invoice download initiated.", {
          position: toast.POSITION.TOP_RIGHT,
        })
        setLoading(false)
      }
    }catch(error) {
      toast.error(error, {
        position: toast.POSITION.TOP_RIGHT,
      })
      setLoading(false)
    }
  }

  const handlePayButton = () => {
    if (invoiceMode === SETTINGS.successKey || invoiceMode === SETTINGS.processKey) {
      toast.warning("Your last payment is under process. Please try later.", {
        position: toast.POSITION.TOP_RIGHT,
      })
    } else {
      navigate.push({pathname:`/invoice-checkout`, state:{invoiceId:param?.id, invoiceDetail: Details,}})
      // navigate.push(`/invoice-checkout/${param?.id}`)
    }
  }
 
  const handleApplyCredit = async () => {
    setSpinner(true)
    setLoading(true)
    setOpenModal(true)
    try {
      let data = new URLSearchParams({
        invoiceid: param?.id,
      })
      let result = await applyCredit(data)
      let info = result?.data?.data
      syncInvoiceForce()
      if (info?.creditApplied === "error") {
        toast.error("error", {
          position: toast.POSITION.TOP_RIGHT,
        })
      } else {
        let res = checkUser()
        toast.success(result?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        setPaymentProcessing(true)
      }
      setSpinner(false)
      setLoading(false)
      setOpenModal(false)
    } catch (error) {
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      })
      setOpenModal(false)
      setLoading(false)
      setSpinner(false)
    }
  }

  const syncInvoiceForce = async () => {
    try{
      let res = await invoiceForceRemote(param?.id, true)
      let info = res?.data?.data
      if(info?.status === "Paid"){
        setPaymentProcessing(false)
      }
      let newBal = Math.abs(info?.balance) * 100
      setNewBalance(newBal)
      setDetails(info)
    }catch(error){ }
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
    // let newArr = addressArray.filter(item => item !== "");
    // let newArr1 = newArr.filter(item => item !== "undefined");
    if(newArr.length){
      setFinalAddressArr(newArr)
    }
  },[Details])

  useEffect(() => {
    if(Details?.notes){
      let notesElement = notesRef?.current
      if(notesElement){
        const imgTag = notesElement.querySelector('img');
        if(imgTag){
          const parts = imgTag.src?.split('/');
          const imageName = parts[parts?.length - 1];
          if(imageName === "btc.png"){
            imgTag.src = bitCoinIcon
          }else if(imageName === "bch.png"){
            imgTag.src = bitCashIncon
          }else{
            imgTag.remove()
          }
        }
      }
    }
  },[Details?.notes])

  useEffect(() => {
    if(invoiceMode === SETTINGS.BITPAY_CONFIRMED && Details?.status === "Unpaid"){
      const interval = setInterval(() => {
        syncInvoiceForce()
      },10000)
      return () => {
        clearInterval(interval)
      };
    }
  },[invoiceMode, Details])

  useEffect(() => {   
    if(invoiceMode === SETTINGS.BITPAY_CONFIRMED && Details?.status === "Paid"){
      navigate.push(`/invoice-detail/${param.id}`)
    // }else if(invoiceMode === SETTINGS.BITPAY_CONFIRMED && Details?.status === "Unpaid" && newBalance != "" && oldBalance != newBalance){
    }else if(invoiceMode === SETTINGS.BITPAY_CONFIRMED && Details?.status === "Unpaid" && newBalance != "" && totalAmt != newBalance){
      navigate.push(`/invoice-detail/${param.id}`)
    }
  },[totalAmt, oldBalance, newBalance, Details])

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
              {permission? <div className="row">
                <div className="col-lg-8 left-invoice">
                  {(invoiceMode === SETTINGS.successKey && Details?.status != "Paid") && (
                    <>
                      <div className="row w-100 mx-auto">
                        <div className="card w-100">
                          <div className="card-title py-1 px-2 text-white font-weight-bold ">
                            Success
                          </div>
                          <div className="card-text text-center mx-2 mb-3">
                            Thank you for completing the payment process. We are
                            awaiting notification to confirm the payment you
                            just made. We will send you an email confirmation as
                            soon as this has been received.
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {invoiceMode === SETTINGS.cancelkey && (
                    <>
                      <div className="row w-100 mx-auto">
                        <div className="card w-100">
                          <div className="card-title py-1 px-2 text-white font-weight-bold error-msg">
                            Error
                          </div>
                          <div className="card-text text-center mx-2 mb-3">
                            Unfortunately your payment attempt was not
                            successful. Please try again or contact support.
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {(invoiceMode === SETTINGS.processKey || paymentProccessing) && (
                    <>
                      <div className="row w-100 mx-auto">
                        <div className="card w-100">
                          <div className="card-title py-1 px-2 text-white font-weight-bold processing-msg">
                            Processing
                          </div>
                          <div className="card-text text-center mx-2 mb-3">
                            Thank you for completing the payment process. We are
                            awaiting notification to confirm the payment you
                            just made. We will send you an email confirmation as
                            soon as this has been received.
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {(invoiceMode === SETTINGS.BITPAY_UNCONFIRMED && Details?.status === "Unpaid") && ( 
                    <>
                      <div className="row w-100 mx-auto">
                        <div className="card w-100">
                          <div className="card-title py-1 px-2 text-white font-weight-bold processing-msg">
                            Unconfirmed Transaction
                          </div>
                          <div className="card-text text-center mx-2 mb-3">
                          {"Your transaction is currently unconfirmed due to network congestion or other reasons. It's pending and subject to potential delays until it receives confirmations. We appreciate your patience as the network processes this transaction. For more details, refer to the provided transaction ID."}
                          <br/>
                          <a href={`https://www.blockonomics.co/api/tx?txid=${blockonomicsData?.txid}&addr=${blockonomicsData?.addr}`} target="_blank" rel="noreferrer">{blockonomicsData?.txid}</a>
                          </div>
                        </div>
                      </div>
                    </>
                  )}  

                  {(invoiceMode === SETTINGS.BITPAY_PARTIALLYCONFIRMED && Details?.status === "Unpaid") && (
                    <>
                      <div className="row w-100 mx-auto">
                        <div className="card w-100">
                          <div className="card-title py-1 px-2 text-white font-weight-bold partially-confirmed-msg">
                          Partially Confirmed Transaction
                          </div>
                          <div className="card-text text-center mx-2 mb-3">
                            {"Your payment status is partially confirmed. Some parts of the transaction have received confirmations, while others remain pending. Please be patient as the remaining components undergo verification. For further details or concerns, refer to the transaction ID provided."}
                            <br/>
                            <a href={`https://www.blockonomics.co/api/tx?txid=${blockonomicsData?.txid}&addr=${blockonomicsData?.addr}`}  target="_blank" rel="noreferrer">{blockonomicsData?.txid}</a>
                          </div>
                        </div>
                      </div>
                    </>
                   )} 

                  {(invoiceMode === SETTINGS.BITPAY_CONFIRMED && Details?.status === "Unpaid") && ( 
                    <div className="row w-100 mx-auto">
                      <div className="card w-100">
                        <div className="card-title py-1 px-2 text-white font-weight-bold ">
                        Confirmed Transaction
                        </div>
                        <div className="card-text text-center mx-2 mb-3">
                          {"Your payment has been confirmed successfully! The transaction has been validated and added to the blockchain. Thank you for your patience. If you have any further questions, please don't hesitate to reach out."}
                          <br/><br/>
                          <div className="watch-loader">
                            <Watch 
                              height="50"
                              width="50"
                              radius="48"
                              color="#171168"
                              ariaLabel="watch-loading"
                              wrapperStyle={{}}
                              wrapperClassName="justity-content-center"
                              visible={true}
                            />
                          </div>
                          <b>{"We are proccessing your payment and invoice transaction will be updated shortly..."}</b>
                          <br/>
                          <a href={`https://www.blockonomics.co/api/tx?txid=${blockonomicsData?.txid}&addr=${blockonomicsData?.addr}`}  target="_blank" rel="noreferrer">{blockonomicsData?.txid}</a>
                        </div>
                      </div>
                    </div>
                  )}  

                  <div className="single-invoice">
                    <span className={`status ${Details?.status} `}>
                      status : {Details?.status}
                    </span>
                    <h3>Invoice: #{Details.id}</h3>
                    <div className="row">
                      <div className="col-lg-6 col-sm-6">
                        <p className="issue-date">Issue Date</p>
                        <p className="date">{Details?.date}</p>
                        <p className="due-date">Due Date</p>
                        <p className="date">{Details?.datedue}</p>
                      </div>
                      <div className="col-lg-6 col-sm-6 company-details">
                        <p className="pay-to">Pay To:</p>
                        <div
                          className="pay-to-details"
                          dangerouslySetInnerHTML={{ __html: Details?.payto }}
                        ></div>
                        {/* <h4>RedSwitches Pvt. Ltd.</h4>
                        <p className="details">
                          20 Collyer Quay #09-01,
                          <br />
                          Singapore - 049319
                          <br />
                          UEN: 20220819076H
                        </p> */}
                      </div>
                    </div>
                  </div>
                  <div className="receipt-details" style={{backgroundColor:"#fff"}}>
                    <div className="row">
                      <div className="col-lg-4 col-sm-4">
                        <p>Invoiced To:</p>
                        <h4 className="receipt-name">
                          {firstLetterCapital(Details?.clientsdetails?.companyname)}
                        </h4>
                        <p className="details">
                          {firstLetterCapital(Details?.clientsdetails?.fullname)}
                          <br />
                          {finalAddressArr.length > 0? finalAddressArr?.map((address, index) => {
                            if(address){
                              let finalVal = addSpace(address)
                              finalVal = firstLetterCapital(finalVal)
                              return `${finalVal}, `
                            }
                          }) : null}
                          {Details?.clientsdetails?.country}
                        </p>
                      </div>
                      <div className="col-lg-4 col-sm-4">
                        <p className="issue-date">Issue Date</p>
                        <p className="date">{Details?.date}</p>
                        <p className="due-date">Due Date</p>
                        <p className="date">{Details?.datedue}</p>
                      </div>
                      <div className="col-lg-4 col-sm-4">
                        <p>Balance Due</p>
                        <h3 className="due-balance">
                          {Details?.currency?.prefix}
                          {Details?.balance? Details?.balance + " " : ""}
                          {Details?.currency?.suffix}
                        </h3>
                      </div>
                    </div>
                  </div>
                {(Details?.notes) && <div className="note-details mt-5" style={{backgroundColor:"#fff"}}>            
                    <div className=" w-100 mx-auto">
                      <div className="card w-100">
                        <div className="card-title py-1 px-2 text-white font-weight-bold partially-confirmed-msg">
                          Note
                        </div>
                        <div className="card-text text-center ">
                          <p dangerouslySetInnerHTML={{ __html: Details?.notes }} ref={notesRef}/>
                        </div>
                      </div>
                    </div>
                  </div>}
                  <div
                    className="invoice-detail-section single-invoice-view"
                    style={{ overflowX: "auto" }}
                  >
                    <table width="100%" className="table table-bordered" style={{backgroundColor:"#fff"}}>
                      <thead>
                        <tr>
                          <th colSpan={2} className="descriptions">
                            Item description
                          </th>
                          <th colSpan={1} className="total">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Details?.invoiceitems?.map((element, index) => {
                          return (
                            <tr key={index + "itemDetals"}>
                              <td colSpan={2} className="description">
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: element?.description,
                                  }}
                                />
                              </td>
                              <td colSpan={1} className="total">
                                {element?.amount < 0
                                  ? "-" +
                                    Details?.currency?.prefix +
                                    "" +
                                    Math.abs(element?.amount + " ") +
                                    " " +
                                    Details?.currency?.suffix
                                  : Details?.currency?.prefix +
                                    "" +
                                    element?.amount +
                                    " " +
                                    "" +
                                    Details?.currency?.suffix}
                              </td>
                            </tr>
                          )
                        })}
                        {/* <tr>
                          <td colSpan={2} className="description">
                            <p>
                              1x Intel Xeon Hexa-Core E-2286G (28/09/2022 -
                              27/10/2022)
                              <br />
                              Network Uplink: 1Gbps Duplex
                              <br />
                              Preferred Location: Frankfurt
                              <br />
                              Disk 1: 2TB SATA HDD
                              <br />
                              Traffic: 30TB Tier 1 Traffic
                              <br />
                            </p>
                          </td>
                          <td colSpan={1} className="total">
                            $124.00USD
                          </td>
                        </tr> */}
                        <tr className="table-data">
                          <td colSpan={2} className="total-heading">
                            Sub Total
                          </td>
                          <td colSpan={1} className="sub-totail">
                            {Details?.currency?.prefix}
                            {Details?.subtotal? Details?.subtotal + " " : ""}
                            {Details?.currency?.suffix}
                          </td>
                        </tr>
                        {Details?.taxname ? (
                          <tr className="table-data">
                            <td colSpan={2} className="total-heading">
                              {Details?.taxrate}% {Details?.taxname}
                            </td>
                            <td colSpan={1} className="sub-totail">
                              {Details?.currency?.prefix}
                              {Details?.tax + " "}
                              {Details?.currency?.suffix}
                            </td>
                          </tr>
                        ) : null}
                        {Details?.taxname2 ? (
                          <tr className="table-data">
                            <td colSpan={2} className="total-heading">
                              {Details?.taxrate2}% {Details?.taxname2}
                            </td>
                            <td colSpan={1} className="sub-totail">
                              {Details?.currency?.prefix}
                              {Details?.tax2 + " "}
                              {Details?.currency?.suffix}
                            </td>
                          </tr>
                        ) : null}
                        <tr className="table-data">
                          <td colSpan={2} className="total-heading">
                            Credit Applied
                          </td>
                          <td colSpan={1} className="credit-applied">
                            - {Details?.currency?.prefix}
                            {Details?.credit? Details?.credit + " " : ""}
                            {Details?.currency?.suffix}
                          </td>
                        </tr>
                        <tr className="table-data">
                          <td colSpan={2} className="total-heading">
                            Total
                          </td>
                          <td colSpan={1} className="sub-totail">
                            {Details?.currency?.prefix}
                            {Details?.total? Details?.total + " " : ""}
                            {Details?.currency?.suffix}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="table-responsive">
                      <table width="100%" className="table table-bordered" style={{backgroundColor:"#fff"}}>
                        <thead>
                          <tr>
                            <th className="description">Transaction date</th>
                            <th className="description">Gateway</th>
                            <th className="description">transaction ID</th>
                            <th className="description">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Details?.transactions?.length > 0 ? (
                            Details?.transactions?.map((element, index) => {
                              return (
                                <tr key={index + "transaction"}>
                                  <td className="related">{element?.date}</td>
                                  <td className="related">{element?.gateway}</td>
                                  <td className="related">{element?.transid}</td>
                                  <td className="related">
                                    {Details?.currency?.prefix}
                                    {element?.amount + " "}
                                    {Details?.currency?.suffix}
                                  </td>
                                </tr>
                              )
                            })
                          ) : (
                            <tr>
                              <td
                                className="related"
                                colSpan={4}
                                style={{ textAlign: "center" }}
                              >
                                No Related Transactions Found
                              </td>
                            </tr>
                          )}
                          <tr>
                            <td colSpan={3} className="total-heading">
                              Balance
                            </td>
                            <td colSpan={1} className="total">
                              {Details?.currency?.prefix}
                              {Details?.balance? Details?.balance + " " : ""}
                              {Details?.currency?.suffix}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="last-text" style={{backgroundColor:"#fff"}}>* Indicates a Taxed item</p>
                  </div>
                </div>
                <div className="col-lg-4 right-column">
                  <div className="rs-product-left-box rs-product-left-box-second right-invoice">
                    <h5>{Details?.status == "Unpaid"? "Proceed to Pay" : Details?.status}</h5>
                    <div className="rs-product-left-text-price">
                      <ul className="border-0">
                        <li>
                          <p>Subtotal</p>
                          <span>
                            {Details?.currency?.prefix}
                            {Details?.subtotal + " "}
                            {Details?.currency?.suffix}
                          </span>
                        </li>
                        <li>
                          <p>{Details?.taxrate}% {Details?.taxname}</p>
                          <span>
                          {Details?.currency?.prefix}
                              {Details?.tax + " "}
                              {Details?.currency?.suffix}
                          </span>
                        </li>
                        <li>
                          <p>{Details?.taxrate2}% {Details?.taxname2}</p>
                          <span>
                            {Details?.currency?.prefix}
                              {Details?.tax2 + " "}
                              {Details?.currency?.suffix}
                          </span>
                        </li>
                        <li>
                          <p>Credit Applied</p>
                          <span className="credit-applied">
                          - {Details?.currency?.prefix}
                            {Details?.credit? Details?.credit + " " : ""}
                            {Details?.currency?.suffix}
                          </span>
                        </li>
                        {/* <li>
                          <p>Processing fees</p>
                          <span>$0.00USD</span>
                        </li> */}
                      </ul>
                    </div>
                    <div className="rs-product-left-text-price">
                      <ul className="total">
                        <li>
                          <p className="total-amount">Total (incl. taxes)</p>
                          <span>
                            {Details?.currency?.prefix}
                            {Details?.total + " "}
                            {Details?.currency?.suffix}
                          </span>
                        </li>
                      </ul>
                    </div>
                    {Details?.status == "Unpaid" && Details?.total > 0 ? (
                      <>
                      {
                      (Details?.invoiceitems?.find((item) => item?.type != "AddFunds") && Details?.clientsdetails?.credit > 0) && <><div className="rs-product-payment">
                        <h5>Apply Credit</h5>
                        <p>
                          Your current credit balance is
                          <span className="product-payment-bold-text">
                            {" "}
                            {Details?.currency?.prefix}
                            {Details?.clientsdetails?.credit}{" "}
                            {Details?.currency?.suffix}
                          </span>
                          . Click the button below to apply this amount to the
                          invoice
                        </p>
                      </div>
                      <div className="rs-product-left-payment-btn">
                        <button
                          onClick={handleApplyCredit}
                          className="invoice-chechout-apply-btn"
                          disabled={spinner}
                        >
                          {spinner ? (
                            <div className="ui active inline loader"></div>
                          ) : (
                            "Apply Credit"
                          )}
                        </button>
                      </div></>
                      }

                      <div className="rs-product-left-price-btn">
                        <a onClick={(e) => {Details?.balance < 0 ? e.preventDefault() : handlePayButton()}} style={{cursor:Details?.balance < 0? "not-allowed" : "pointer"}}>
                          Pay {Details?.currency?.prefix}
                          {Details?.balance + " "}
                          {Details?.currency?.suffix}
                        </a>
                      </div>
                      </>
                    ) : (
                      ""
                      // invoiceMode === SETTINGS.successKey && (
                      //   <div className="rs-product-left-price-btn">
                      //     <a onClick={handlePayButton} style={{cursor:"pointer"}}>
                      //       Pay {Details?.currency?.prefix}
                      //       {Details?.total}
                      //       {Details?.currency?.suffix}
                      //     </a>
                      //   </div>
                      // )
                    )}
                    {/* <div className="rs-product-left-price-btn">
                      <Link to={"#"} onClick={handlePayButton}>
                        Pay {Details?.currency?.prefix}
                        {Details?.total}
                        {Details?.currency?.suffix}
                      </Link>
                    </div> */}
                    <div className="rs-product-left-price-content">
                      <p className="assistance">
                        Have questions? Contact our sales team for assistance.{" "}
                        <Link to="/support-ticket/2">Click here</Link>
                      </p>
                    </div>
                    <div className="single-invoice-download">
                      <h6>Download Invoice</h6>
                      <a href="#" onClick={handleInvoice}>
                        <img src={pdfnew} />
                        Invoice #{Details.id}
                        <img src={pdfdown} className="download" />
                      </a>
                    </div>
                  </div>
                </div>
              </div> : !loader? <PermissionDenied /> : null}
            </div>
          </div>
        </section>
      </>
      <TextLoader loading={loading} loader={loader}/>
      <PaymentModal openModal={openModal} message={"Payment"}/>
    </div>
  )
}

export default InvoiceDetail
