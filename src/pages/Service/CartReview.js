import React, { useEffect, useState, useRef } from "react";
import { withRouter, Link, useHistory, useLocation } from "react-router-dom";
import close from "../../assets/images/close-fill.svg";
import { Modal, Col, Row } from "reactstrap";
import TextLoader from "../../components/textLoader";
import {
  updateProductQuantity,
  applyPromoCode,
  getCartList,
  removeProduct,
  createCartToken,
  copyCartLink,
  getCartLink,
  CartEmpty,
  deletePromoCode
} from "./store/apiService";
import { loginData } from "../Authentication/store/apiServices";
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";
import { read_cookie } from "sfcookies";
import { SETTINGS } from "../../constants/api/api_path";
import ProgressBar from "../../components/progressBar";
import { bake_cookie } from "sfcookies";


const CartReview = () => {
  const [modalInfo, setModalInfo] = useState({
    modaleName: "",
    modalMessage: "",
    action: "",
    id: "",
  });
  const [deleteModal, setDeleteModal] = useState(false);
  const [productList, setProductList] = useState();
  const [orderSummary, setOrderSummary] = useState();
  const [currency, setCurrency] = useState();
  const [loader, setLoader] = useState(true);
  const [loading, setLoading] = useState(true);
  const [PromoInput, setPromoInput] = useState("");
  const [contractMonth, setContractMonth] = useState();
  const [lineLoader, setlineLoader] = useState("");
  const navigate = useHistory();
  const [createdtoken, setCreatedToken] = useState("");
  const { search } = useLocation();
  const parameters = new URLSearchParams(search);
  const token = parameters.get("token");
  const emptyFieldRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [spinner, setSpinner] = useState({applyCode:false, buy: false})
  const [productQuanity, setProductQuantity] = useState([])

  useEffect(() => {
    let info = loginData();
    let guest_Token = read_cookie(SETTINGS.GUESTTOKEN);
    if (guest_Token?.length != 0) {
      setCreatedToken(guest_Token);
    } else {
      let cart_token = createCartToken();
      setCreatedToken(cart_token);
    }
    setCurrency(info?.currency);
    if (createdtoken) {
      cartProductList();
    }
  }, [createdtoken]);

  const cartProductList = async () => {
    try {
      let data = new URLSearchParams({
        cart_token: createdtoken,
      });
      let result = await getCartList(data);
      let info = result?.data?.data
      if (info?.cart_items?.length > 0) {
        setProductList(info?.cart_items);
        if(productQuanity?.length === 0) {
          let product = []
          info?.cart_items?.map((prod) => {
            product.push({id: prod?.id, quantity: prod?.quantity})
          })
          setProductQuantity(product)
        }
        setOrderSummary(info?.cart_summary);
        setCurrency(info?.currency);
        if(info?.currency){
          bake_cookie(SETTINGS.CURRENCY, info?.currency?.id);
        }
        setLoader(false);
        setlineLoader(false);
        setLoading(false);
        setPromoInput("")
      } else {
        navigate.push(`/productlist`);
      }
    } catch (error) {
      setlineLoader(false);
      setLoader(false);
      setLoading(false);
    }
  };
  const handleProdQuantity = (action, id, defaultQuantity) => {
    if (action === "add") {
      let quantity = defaultQuantity;
      quantity = quantity + 1;
      if (quantity <= 10) {
      
        updateProdQuantity(id, quantity);
      }
    } else if (action === "subtract") {
      let quantity = defaultQuantity;
      quantity = quantity - 1;
      if (quantity >= 1) {
        updateProdQuantity(id, quantity);
      }
    }
  };

  const updateProdQuantity = async (id, quantity) => {
    setlineLoader(true);
    setLoading(true)
    try {
      let data = new URLSearchParams({
        product_id: id,
        cart_token: createdtoken,
        quantity: quantity,
      });
      let res = await updateProductQuantity(data);
      if (res) {
        setlineLoader(false);
        setLoading(false)
          productQuanity?.map((prod, index) => {
            if(id === prod?.id) {
              productQuanity[index].quantity = quantity
            }
          })
        cartProductList();
      }
    } catch (error) {
      setlineLoader(false);
      setLoading(false)
    }
  };

  const handleContract = (billingcycle) => {
    if (billingcycle === "monthly") {
      setContractMonth("1 Month");
    } else if (billingcycle === "quarterly") {
      setContractMonth("3 Months");
    } else if (billingcycle === "semiannually") {
      setContractMonth("6 Months");
    } else if (billingcycle === "annually") {
      setContractMonth("12 Months");
    } else if (billingcycle === "free") {
      setContractMonth("Free");
    }
  };

  const handlePromoCode = async () => {
    if (PromoInput) {
      setSpinner({applyCode:true})
      setLoading(true)
      try {
        let data = new URLSearchParams({
          promocode: PromoInput,
          cart_token: createdtoken,
        });
        let result = await applyPromoCode(data);
        +toast.success(result?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setIsActive(false);
        cartProductList();
        setSpinner({applyCode:false})
        setLoading(false)
        
      } catch (error) {
        toast.error(error?.response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setlineLoader(false);
        setSpinner({applyCode:false})
        setLoading(false)
      }
    } else {
      emptyFieldRef.current.focus();
      setIsActive(true);
    }
  };

  const handleProductDelete = async (id) => {
    setLoader(true);
    setLoading(true);
    try {
      let data = new URLSearchParams({
        cart_token: createdtoken,
        product_id: id,
      });
      let result = await removeProduct(data);
      setLoader(false);
      setLoading(false);
      if (result) {
        cartProductList();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoader(false);
      setLoading(false);
    }
  };

  const handleShareCart = async () => {
    try {
      let data = new URLSearchParams({
        cart_token: createdtoken,
      });
      let result = await copyCartLink(data);
      if (result?.data) {
        copy(result?.data?.data?.url);
        toast.success(result?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  useEffect(() => {
    if (token && createdtoken) {
      getCartLinkInfo();
    }
  }, [token, createdtoken]);

  const getCartLinkInfo = async () => {
    try {
      let data = new URLSearchParams({
        cart_token: createdtoken,
        token: token,
      });
      let result = await getCartLink(data);
      let url = result?.data?.data?.url;
      url ? location.replace(url) : navigate.push(`/productlist`);
    } catch (error) {}
  };

  const handleEmptyCart = async () => {
    let data = new URLSearchParams({
      cart_token: createdtoken,
    });
    try {
      setLoader(true);
      let res = await CartEmpty(data);
      if (res) {
        setLoader(false);

        toast.success(res?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        navigate.push("/productlist");
      }
    } catch (error) {
      setLoader(false);
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleDeletePromo = async() => {
    try{
      let data = new URLSearchParams({
        cart_token :createdtoken
      })
      let res = await deletePromoCode(data)
      toast.success(res?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      cartProductList()
    }catch(error) {
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleDeleteItem = (action, id) => {
    if (action === "removePromo") {
      handleDeletePromo();
    } else if (action === "removeItem") {
      handleProductDelete(id);
    } else if (action === "emptyCart") {
      handleEmptyCart();
    }
  };

  return (
    <div>
      <section className="rs-product-section">
        <div
          className={
            loader ? "rs-product-left  overlayerloader" : "rs-product-left"
          }
        >
          <div className="rs-product-left-title">
            <div className="rs-product-left-link">
              <a className="rs-product-left-link-confirm">
                Review <i className="feather icon-arrow-right" />
              </a>
              <h5 href="#" className="top-link-color">
                Payment
              </h5>
              <h5 href="#" className="top-link-color">
                <i className="feather icon-arrow-right" />{" "}
                Confirm
              </h5>
            </div>
            <h2>Shopping Cart ({productList?.length})✨</h2>
          </div>

          <div className="rs-product-left-contentbar">
            <div className="row">
              <div className="col-lg-7">
                {productList?.map((product, index) => {
                  return (
                    <div className="rs-product-left-box" key={index}>
                      <h5 className="top-head">
                        {product?.name}
                        <div className="quantity-edit-btn">
                          <i
                            style={{
                              color: "#fd3e60",
                              cursor: "pointer",
                              fontSize: "larger",
                            }}
                            onClick={(e) => {
                             (spinner?.applyCode || spinner?.buy)?
                             e?.preventDefault() : ( setModalInfo({
                                modaleName: "Remove Item",
                                modalMessage:
                                  "Are you sure you want to remove this item from your shopping cart?",
                                action: "removeItem",
                                id: product?.id,
                              }),setDeleteModal(true))
                            }}
                            className="uil uil-minus-circle"
                          ></i>
                        </div>
                      </h5>
                      <ul>
                        <li>
                          <p>Chassis:</p>
                          <span>{product?.description?.Chassis}</span>
                        </li>
                        <li>
                          <p>CPU:</p>
                          <span>{product?.description?.CPU}</span>
                        </li>
                        <li>
                          <p>Cores:</p>
                          <span>{product?.description?.Cores}</span>
                        </li>
                        <li>
                          <p>RAM:</p>
                          <span>{product?.description?.RAM}</span>
                        </li>
                        <li>
                          <p>Storage:</p>
                          <span>{product?.description?.Storage}</span>
                        </li>
                        <li>
                          <p>Network:</p>
                          <span>{product?.description?.Network}</span>
                        </li>
                        <li>
                          <p>Traffic:</p>
                          <span>{product?.description?.Traffic}</span>
                        </li>
                        <li>
                          <p>Location:</p>
                          <span>{product?.description?.Location}</span>
                        </li>
                        <li>
                          <div className="quantity-btn">
                            <p>Quantity:</p>
                            <div className="price-container">
                              <span>
                                <button
                                  disabled={spinner?.applyCode || spinner?.buy}
                                  onClick={() =>
                                    handleProdQuantity(
                                      "subtract",
                                      product?.id,
                                      product?.quantity
                                    )
                                  }
                                >
                                  -
                                </button>{" "}
                                {productQuanity?.map((prod, index) =>{
                                  if(prod?.id === product?.id){
                                    return <span key={index}>{prod?.quantity} </span>
                                  }
                                  })}
                                <button 
                                disabled={spinner?.applyCode || spinner?.buy}
                                className="plus-minus-btn"
                                  onClick={() =>
                                    handleProdQuantity(
                                      "add",
                                      product?.id,
                                      product?.quantity
                                    )
                                  }
                                >
                                  +
                                </button>
                              </span>
                              <div className="quantity-edit-btn">
                                <button
                                  disabled={spinner?.applyCode || spinner?.buy}
                                  onClick={() =>
                                    navigate.push({
                                      pathname:`/product-config/${product.id}`,
                                      status:1
                                    })
                                  }
                                >
                                  <i className="uil uil-pen"></i>Edit
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  );
                })}
              </div>
              <div className="offset-lg-1 col-lg-4">
                <div className="rs-product-left-box rs-product-left-box-second">
                  <h5 className="empty-cart">
                    <small>Incl. taxes</small>
                    <button
                      disabled={spinner?.applyCode || spinner?.buy}
                      onClick={() => {
                        // setemptyCart(true),
                        setModalInfo({
                          modaleName: "Empty Cart",
                          modalMessage:
                            "Are you sure you want to empty your shopping cart?",
                          action: "emptyCart",
                          id: "",
                        });
                        setDeleteModal(true);
                      }}
                    >
                      {" "}
                      <i className="uil uil-trash-alt"></i>Empty Cart
                    </button>
                  </h5>
                  <h5>
                    {" "}
                    {/* {product?.paytype != "free" && product?.billingcycle
                      ? product?.billingcycle?.charAt(0)?.toUpperCase() +
                        product?.billingcycle?.slice(1).toLowerCase()
                      : ""}{" "} */}
                    Total
                  </h5>
                  <div className="rs-product-left-price">
                    <h4>
                      {currency?.prefix}
                      {orderSummary?.total} {currency?.suffix}
                    </h4>
                    {orderSummary?.strike_amount?.discountPer ? (
                      <h5>
                        {currency?.prefix}
                        {orderSummary?.strike_amount?.discountPer}{" "}
                        {currency?.suffix}
                      </h5>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="rs-product-left-text-price">
                    <ul>
                      <li>
                        <p>Subtotal:</p>
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
                            One Time Discount {" "}
                            <a
                              className="trash"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setModalInfo({
                                  modaleName: "Remove Promo Code",
                                  modalMessage:
                                    "Are you sure you want to remove promo code?",
                                  action: "removePromo",
                                  id: "",
                                }),
                                  setDeleteModal(true);
                              }}
                            >
                              <i className="uil uil-trash-alt"></i>
                            </a>
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
                        <p>{orderSummary?.tax?.tax1?.name} @ {(orderSummary?.tax?.tax1?.rate * 100).toFixed(2)}%:</p>
                        <span>
                          {currency?.prefix}
                          {(orderSummary?.tax?.tax1?.total)?.toFixed(2)} {currency?.suffix}
                        </span>
                      </li> : null}
                      {(orderSummary?.tax?.tax2?.rate * 100 > 0)? <li>
                        <p>{orderSummary?.tax?.tax2?.name} @ {(orderSummary?.tax?.tax2?.rate * 100).toFixed(2)}%:</p>
                        <span>
                          {currency?.prefix}
                          {(orderSummary?.tax?.tax2?.total)?.toFixed(2)} {currency?.suffix}
                        </span>
                      </li> : null}
                      </>: null}
                      
                      {orderSummary?.tax?.amount > 0 && (
                        <li>
                          <p>Taxes</p>
                          <span>
                            {currency?.prefix}
                            {orderSummary?.tax?.amount} {currency?.suffix}
                          </span>
                        </li>
                      )}
                      {/* <li>
                        <p>Contract</p>
                        <span>{contractMonth}</span>
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
                  {orderSummary?.promo_code?.amount ? (
                    ""
                  ) : (
                    <>
                      <div className="rs-product-left-text-price">
                        <ul>
                          <li>
                            <p>Promo Code</p>
                            <span style={{ color: "#bcb2c7" }}>optional</span>
                          </li>
                        </ul>
                      </div>
                      <div className="promp-div">
                        <input
                          disabled={spinner?.applyCode || spinner?.buy}
                          className="promo-input"
                          type="text"
                          value={PromoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          ref={emptyFieldRef}
                          style={{ borderColor: isActive && "#0d22db" }}
                          onBlur={() => setIsActive(false)}
                        />
                      </div>
                      <div className="promo-apply-div">
                        <button
                          // style={{
                          //   cursor: PromoInput ? "pointer" : "not-allowed",
                          // }}
                          className="promo-apply-buttom"
                          onClick={handlePromoCode}
                          disabled={spinner?.applyCode || spinner?.buy}
                        >
                      {spinner?.applyCode? <div className="ui active inline loader"></div> : "Apply Code"}
                        </button>
                      </div>
                    </>
                  )}
                  <div className="rs-product-left-price-btn">
                    <Link onClick={(e) => {(spinner?.applyCode || spinner?.buy)? e.preventDefault() : setSpinner({buy:true})}} to={`/product-checkout`} >
                    {spinner?.buy? <div className="ui active inline loader"></div> : <span>Buy Now {currency?.prefix}
                      {orderSummary?.total} {currency?.suffix}</span>}
                    </Link>
                  </div>
                  <div className="rs-product-left-price-content">
                    <p style={{ textAlign: "right" }}>
                      <Link onClick={(e) => {(spinner?.applyCode || spinner?.buy)? e.preventDefault() : null}} className="back-to-shopping" to="/productlist">
                        Continue Shopping
                      </Link>
                    </p>
                  </div>
                  {/* <div className="rs-product-left-price-btn">
                    <Link to={`/product-checkout/${params?.id}/instant`}>
                      Continue
                    </Link>
                  </div> */}
                  {/* <div className="rs-product-left-price-content">
                    <p>Local taxes may apply</p>
                    <a href="#">Learn more</a>
                  </div> */}
                <ProgressBar loading={lineLoader}/>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="rs-product-left-contentbar">
            <div className="row">
              <div className="col-lg-7">
                <div className="rs-product-left-box rs-product-left-box-bill">
                  <h5>Choose Billing Cycle</h5>
                  <ul>
                    {product?.paytype === "free" && (
                      <li className="activeCard">
                        Free <br />
                        {currency?.prefix}0.00{" "}{currency?.suffix}
                      </li>
                    )}
                    {
                    (product?.paytype == "onetime" && product?.price?.monthly || product?.paytype == "recurring" && product?.price?.monthly)
                       && 
                        <li
                          className={isActive === "monthly" ? "activeCard" : ""}
                          onClick={() => handleSelectBillingCycle("monthly")}
                        >
                          Monthly
                          <br />
                          {currency?.prefix}
                          {product?.price?.monthly}
                          {" "}{currency?.suffix}
                        </li>
                      }
                    {product?.paytype === "onetime" &&
                      product?.price?.msetupfee > 0 && (
                        <li
                          className={
                            isActive === "msetupfee" ? "activeCard" : ""
                          }
                          onClick={() => handleSelectBillingCycle("msetupfee")}
                        >
                          Monthly Setup Fee
                          <br />
                          {currency?.prefix}
                          {product?.price?.msetupfee}
                          {" "}{currency?.suffix}
                        </li>
                      )}
                    {product?.paytype === "recurring" &&
                      product?.price?.quarterly && (
                        <li
                          className={
                            isActive === "quarterly" ? "activeCard" : ""
                          }
                          onClick={() => handleSelectBillingCycle("quarterly")}
                        >
                          Quarterly
                          <br />
                          {currency?.prefix}
                          {product?.price?.quarterly}
                          {" "}{currency?.suffix}
                        </li>
                      )}
                    {product?.paytype === "recurring" &&
                      product?.price?.semiannually && (
                        <li
                          className={
                            isActive === "semiannually" ? "activeCard" : ""
                          }
                          onClick={() =>
                            handleSelectBillingCycle("semiannually")
                          }
                        >
                          Semi-Annually
                          <br />
                          {currency?.prefix}
                          {product?.price?.semiannually}
                          {" "}{currency?.suffix}
                        </li>
                      )}
                    {product?.paytype === "recurring" &&
                      product?.price?.annually && (
                        <li
                          className={
                            isActive === "annually" ? "activeCard" : ""
                          }
                          onClick={() => handleSelectBillingCycle("annually")}
                        >
                          Annually
                          <br />
                          {currency?.prefix}
                          {product?.price?.annually}
                          {" "}{currency?.suffix}
                        </li>
                      )}
                    {product?.paytype === "recurring" &&
                      product?.price?.biennially && (
                        <li
                          className={
                            isActive === "biennially" ? "activeCard" : ""
                          }
                          onClick={() => handleSelectBillingCycle("biennially")}
                        >
                          Biannually
                          <br />
                          {currency?.prefix}
                          {product?.price?.biennially}
                          {" "}{currency?.suffix}
                        </li>
                      )}
                    {product?.paytype === "recurring" &&
                      product?.price?.triennially && (
                        <li
                          className={
                            isActive === "triennially" ? "activeCard" : ""
                          }
                          onClick={() =>
                            handleSelectBillingCycle("triennially")
                          }
                        >
                          Triannually
                          <br />
                          {currency?.prefix}
                          {product?.price?.triennially}
                          {" "}{currency?.suffix}
                        </li>
                      )}
                  </ul>
                </div>
              </div>
            </div>
          </div> */}
          {/* <div className="rs-product-left-contentbar">
            <div className="row">
              <div className="col-lg-7">
                <div className="rs-product-left-box rs-product-left-box-list configurable-options-select">
                  <h5>Configurable Options</h5>
                  {product?.config_options.map((options, index, key) => {
                    if (options?.optiontype == 1) {
                      //1 = dropdown
                      return (
                        <>
                          <h6>{options?.name}</h6>
                          <select
                            className="form-select"
                            aria-label="Default select example"
                            onChange={(e) => {handleSelectConfigOptions(e, options?.name)}}
                          >
                            {options?.sub_config_option.map(
                              (subOption, key) => {
                                return (
                                  <option key={key} value={subOption?.id}>
                                    {subOption?.optionname}
                                  </option>
                                );
                              }
                            )}
                          </select>
                        </>
                      );
                    }

                    if (options?.optiontype == 2) {
                      // 2 = radio
                      return (
                        <div className="radio-input-select">
                          <h6>{options?.name}</h6>
                          <div className="row-select-type">
                            {options?.sub_config_option.map(
                              (subOption, key) => {
                                return (
                                  <div key={key} className="radio-select-type">
                                    <input
                                      type="radio"
                                      name={`sub-config-options${options?.name}`}
                                      value={subOption?.id}
                                      className="form-check-input form-check-input"
                                      onChange={(e) =>{handleSelectConfigOptions(e, options?.name)}}
                                    />
                                    <span>{subOption?.optionname}</span>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      );
                    }

                    if (options?.optiontype == 3) {
                      // 3 = checkbox
                      return (
                        <div className="radio-input-select">
                          <h6>{options?.name}</h6>
                          <div className="row-select-type">
                            {options?.sub_config_option.map(
                              (subOption, key) => {
                                return (
                                  <div key={key} className="radio-select-type">
                                    <input
                                      type="checkbox"
                                      name="sub-config-options"
                                      value={subOption?.id}
                                      className="form-check-input form-check-input"
                                    />
                                    <span>{subOption?.optionname}</span>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      );
                    }

                    if (options?.optiontype == 4) {
                      // 4 = quantity
                      return (
                        <>
                          <h6>{options?.name}</h6>
                          {options?.sub_config_option.map((subOption, key) => {
                            return (
                              <>
                                <input
                                  key={key}
                                  type="number"
                                  name="sub-config-options"
                                  value={subOption?.optionname}
                                  className="form-control"
                                />
                              </>
                            );
                          })}
                        </>
                      );
                    }
                  })}
                  {/* <h6>Operating System</h6>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                  >
                    <option selected>CentOS7</option>
                    <option value={1}>Debian 10</option>
                    <option value={2}>Debian 11</option>
                    <option value={3}>Ubuntu 18.04</option>
                    <option value={4}>Ubuntu 20.04</option>
                    <option value={5}>VMWare vSphere ESXi 6.7</option>
                  </select>
                  <h6>Additional IPs</h6>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                  >
                    <option selected>None</option>
                    <option value={1}>1 IPv4 €3.00EUR</option>
                    <option value={2}>2 IPv4 €6.00EUR</option>
                    <option value={3}>3 IPv4 €9.00EUR</option>
                    <option value={4}>4 IPv4 €12.00EUR</option>
                    <option value={5}>5 IPv4 €15.00EUR</option>
                  </select> */}
          {/* </div> */}
          {/* </div> */}
          {/* </div> */}
          {/* </div> */}
          <div className="rs-product-left-contentbar">
            <div className="row">
              <div className="col-lg-7">
                <div className="rs-product-left-box rs-product-left-link">
                  <h5>Share your cart</h5>
                  <div className="rs-product-left-link-btn">
                    <a
                      className="copy-configuration-btn"
                      onClick={(e) => {
                       (spinner?.applyCode || spinner?.buy)? e.preventDefault() : handleShareCart();
                      }}
                    >
                      <i className="feather icon-link " />
                      copy link
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="rs-product-left-contentbar">
            <div className="row">
              <div className="col-lg-7">
                <div className="rs-product-left-link">
                  <Link
                    to={
                      params?.mode === "instant"
                        ? `/product-config/${params?.id}`
                        : `/custom-product/${params?.id}`
                    }
                  >
                    <i className="feather icon-arrow-left" />
                    Back To Configuration Page
                  </Link>
                </div>
              </div>
            </div>
          </div> */}

          <Modal isOpen={deleteModal} centered={true}>
            <div className="modal-header">
              <Row className="w-100">
                <Col xs="11">
                  <h5 className="modal-title mt-0">{modalInfo?.modaleName}</h5>
                </Col>
                <Col xs="1">
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteModal(false);
                    }}
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">
                      {" "}
                      <img src={close} alt="" />
                    </span>
                  </button>
                </Col>
              </Row>
            </div>
            <div className="modal-body p-0 two-factor verify">
              <h6 className="font-bold text-blue text-center">
                {modalInfo?.modalMessage}
              </h6>
              <div className="factor-disable-btn">
                <button
                  className="btn btn-danger waves-effect waves-light btn-green"
                  type="button"
                  onClick={() => {
                    handleDeleteItem(modalInfo?.action, modalInfo?.id);
                    setDeleteModal(false);
                  }}
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  Yes
                </button>
                <button
                  className="btn btn-danger waves-effect waves-light btn-disable"
                  type="button"
                  onClick={() => {
                    setDeleteModal(false);
                  }}
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  No
                </button>
              </div>
            </div>
          </Modal>
        </div>
        <TextLoader loading={loading} loader={loader}/>
      </section>
    </div>
  );
};
export default withRouter(CartReview);
