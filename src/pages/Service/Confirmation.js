import React, { useEffect, useState } from "react";
import {
  withRouter,
  Link,
  useLocation,
  useHistory
} from "react-router-dom";
import pdf from "../../assets/images/pdf.png";
import group from "../../assets/images/Group.png";
import {
  downloadInvoiceInstant,
  invoiceDetail,
  storeUserData,
  loginData,
} from "../Authentication/store/apiServices";
import { toast } from "react-toastify";
import TextLoader from "../../components/textLoader";
import { useDispatch } from "react-redux"
import { isNotificationUpdated } from "../../store/auth/notification/action";
import { removeServices } from "../../store/services/actions";
const Confirmation = () => {
  const navigate = useHistory();
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState("");
  const dispatch = useDispatch()
  const location = useLocation();
  const data = location?.state?.orders?.[0]
  const invoiceId = location?.state?.invoiceId
  const serviceid = location?.state?.serviceid
  const handleInvoiceDownload = async () => {
    setLoading(true)
    try {
      let res = await downloadInvoiceInstant(invoiceId);
      if (res) {
        toast.success("Invoice download initiated.", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
    }
  };

  useEffect(()=>{
    invoiceId? getInvoiceDetail() : navigate.push('/dashboard')
  }, [invoiceId]);

  useEffect(() =>{
    // dispatch(removeServices())
  },[])

  // const getConfirmPageDetail = async () => {
  //   //orderdetail
  //   try {
  //     let param = new URLSearchParams({
  //       orderid: params.oid,
  //     });
  //     setLoader(true);
  //     let res = await confirmPageDetail(param);
  //     getInvoiceDetail();
  //     if (res) {
  //       setLoader(false);
  //       setdata(res?.data?.data[0]);
  //       dispatch(isNotificationUpdated("unread"))
  //     }
  //   } catch (err) {
  //     setLoader(false);
  //     toast.error(err?.response?.data?.message, {
  //       position: toast.POSITION.TOP_RIGHT,
  //     });
  //   }
  // }

  const getInvoiceDetail = async () => {
    try {
      let res = await invoiceDetail(invoiceId);
      if (res) {
        let data = loginData();
        data.credit = res?.data?.data?.clientsdetails?.credit;
        storeUserData(data);
        dispatch(isNotificationUpdated("unread"))
        // dispatch(removeServices())
      }
    } catch (err) {
    }
  };


  return (
    <div>
      <section
        className={
          loader
            ? "rs-confirm-section rs-product-section  overlayerloader"
            : "rs-confirm-section rs-product-section"
        }
      >
        <div className="rs-product-left">
          <div className="rs-product-left-title">
            <div className="rs-product-left-link">
              <a>
                Review <i className="feather icon-arrow-right" />
              </a>
              <a>
                Payment
                <i className="feather icon-arrow-right" />
              </a>
              <a className="rs-product-left-link-confirm">Confirm</a>
            </div>
            <h2>Thank you for your order✨</h2>
            <p>
              You will soon receive a confirmation email with details of your
              order and a link to download the files.
            </p>
          </div>
          <div className="rs-product-left-contentbar">
            <div className="row">
              {invoiceId ? (
                <div className="col-lg-7">
                  <div className="rs-product-left-box rs-product-left-download">
                    <h6>Download Invoice</h6>
                    <a
                      onClick={handleInvoiceDownload}
                      download
                      style={{ cursor: "pointer" }}
                    >
                      <img src={pdf} />
                      Invoice
                      <img src={group} />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="col-lg-7"></div>
              )}
              <div className="offset-lg-1 col-lg-4">
                <div className="rs-product-left-box rs-product-left-box-second">
                  <h5>Order Summary</h5>
                  <ul>
                    {data?.lineitems?.lineitem?.map((element, index) => {
                      return (
                        <li
                          key={index + "detail"}
                          className="order-details-products"
                        >
                          <p style={{ minWidth: "60%" }}>{element.product}</p>
                          <span>
                            {data?.currencyprefix}
                            {element?.amount}
                            {data?.currencysuffix}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  {/* <div className="rs-product-left-text-price">
                    <ul>
                      <li>
                        <p>Subtotal</p>
                        <span>€329.22</span>
                      </li>
                      <li>
                        <p>
                          Discount<span>{data?.promocode}</span>
                        </p>
                        <span>-€100</span>
                      </li>
                    </ul>
                  </div> */}
                  <div className="rs-product-left-text-price">
                    <ul>
                      <li>
                        <p>Total (incl. taxes)</p>
                        <span className="rs-product-left-price-color">
                          {data?.currencyprefix}
                          {data?.amount}
                          {data?.currencysuffix}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <h5 className="rs-product-payment">Payment Details</h5>
                  <div className="rs-product-left-payment-btn">
                    {data?.paymentmethodname}
                    {/* <a href="#">
                      <img src={symbol} />
                      Ending with 2478
                    </a> */}
                  </div>
                  <div className="rs-product-left-price-btn">
                    {/* to={{pathname:`/server-management/${serviceid}`, state:"newservice"}} */}
                    <Link to="/dashboard">Go to Dashboard</Link>
                  </div>
                  <div className="rs-product-left-price-content">
                    <p>
                      Have questions? Contact our sales team for assistance.{" "}
                      <Link to="/support-ticket/2">Click here</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <TextLoader loading={loading} loader={loader}/>
    </div>
  );
};

export default withRouter(Confirmation);
