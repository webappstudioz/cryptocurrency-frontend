import * as url from "../../../helpers/url_helper";
import { postNew, getNew } from "../../../helpers/api_helper_rs";
import { v4 as uuidv4 } from "uuid";
import { bake_cookie } from "sfcookies";
import { SETTINGS } from "../../../constants/api/api_path";

// for live project get services
// export const getServices = (config) => getNew(url.GET_SERVICES, config);

// export const getServiceDetail = (params) =>{
//   getNew(`${url.GET_SERVICES_DETAIL}`, params);
// }
// export const getHardwareDetail = (params) =>
//   getNew(`${url.GET_SERVICES_DETAIL}`, params);
// export const getIPList = (params) => getNew(`${url.GET_IP_LIST}`, params);

// export const getCards = (config) => getNew(url.GET_CARDS, config);
// export const getBandwidth = (config) => getNew(url.GET_BANDWIDTH, config);
// export const getDataTraffic = (config) => getNew(url.GET_DATATRAFFIC, config);

export const reboot = (config) => postNew(url.REBOOT, null, config);

export const productList = async (prodType, currencyId) => {
  if (currencyId) {
    let data = new URLSearchParams({
      type: prodType,
      currencyId: currencyId,
    });
    return await postNew(url.PRODUCTS_LIST, data);
  } else {
    let data = new URLSearchParams({
      type: prodType,
    });
    return await postNew(url.PRODUCTS_LIST, data);
  }
};

export const searchProductList = async (action, prodType) => {
  let data = new URLSearchParams({
    filter: action,
    type: prodType,
  });
  return await postNew(url.PRODUCTS_LIST, data);
};

export const productDetail = async (data) => {
  return await postNew(url.PRODUCT_DETAIL, data);
};

export const productBillingCycle = async (
  id,
  billingCycle,
  guest_token,
  status
) => {
  let data = new URLSearchParams({
    billingcycle: billingCycle,
    product_id: id,
    cart_token: guest_token,
    is_added: status,
  });

  return await postNew(url.PRODUCT_DETAIL, data);
};

export const updateConfiguration = async (data) => {
  return await postNew(url.UPDATE_CONFIGURATION, data);
};

export const copyConfiguration = async (data) => {
  return await postNew(url.COPY_CONFIGURATION, data);
};

export const getConfiguation = async (data) => {
  return await postNew(url.GET_CONFIGURATION, data);
};

export const updateProductQuantity = async (data) => {
  return await postNew(url.UPDATE_PROD_QUANTITY, data);
};

export const applyPromoCode = async (data) => {
  return await postNew(url.APPLY_PROMO_CODE, data);
};

export const getCurrencyList = async () => {
  return await getNew(url.CURRENCY_LIST);
};

export const addToCart = async (data) => {
  return await postNew(url.ADD_TO_CART, data);
};

export const getCartList = async (data) => {
  return await postNew(url.CART_LIST, data);
};

export const getCartDetail = async (data) => {
  return await postNew(url.CART_DETAIL, data);
};

export const updateCurrency = async (data) => {
  return await postNew(url.UPDATE_CURRENCY, data);
};

export const removeProduct = async (data) => {
  return await postNew(url.REMOVE_PRODUCT, data);
};

export const createCartToken = () => {
  let guest_Token = uuidv4() + new Date().getTime();
  bake_cookie(SETTINGS.GUESTTOKEN, guest_Token);
  return guest_Token;
};

export const copyCartLink = async (data) => {
  return await postNew(url.COPY_CART_LINK, data);
};

export const getCartLink = async (data) => {
  return await postNew(url.GET_CART_LINK, data);
};

export const getCokkie = (name) => {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const CartEmpty = async (data) => {
  return await postNew(url.EMPTY_CART, data);
};

export const placeOrder = async (data) => {
  return await postNew(url.PLACE_ORDER, data);
};

export const InvoicePay = async (data) => {
  return await postNew(url.INVOICE_PAY, data);
};

export const orderConfirmation = async (data) => {
  return await postNew(url.ORDER_CONFIRMATION, data);
};

export const deletePromoCode = async (data) => {
  return await postNew(url.DELETE_PROMO_CODE, data);
};

export const sendStripeDetailsBack = async (data) => {
  return await postNew(url.SEND_STRIPE_DETAILS_BACK, data);
};

export const paymentConfirm = async (data) => {
  return await postNew(url.PAYMENT_CONFIRM, data);
};

export const razorpayCapture = async (data) => {
  return await postNew(url.RAZORPAY_CAPTURE, data);
};

export const updateCart = async (data) => {
  return await postNew(url.UPDATE_CART, data);
};

export const getSavedCards = async() => {
  return await getNew(url.GET_SAVED_CARDS)
}

export const syncService = async(data) => {
  try{
    // let data = new URLSearchParams({
    //   service_id:serviceId
    // })
      return await postNew(url.SYNC_SERVICE, data)
  }catch(error){
  }
}

export const getUserDetails = async() => {
    try {
      let res = await getNew(url.GET_USER_DETAILS)
    }catch(error){

    }
}

export const syncAllServices = async() => {
  try {
    return await postNew(url.SYNC_ALL_SERVICES)
  }catch(error){
  }
}