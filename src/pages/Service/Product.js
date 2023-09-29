import React, { useEffect, useState } from "react";
import NoRecordFound from "../../components/Common/NorecordFound";
import TextLoader from "../../components/textLoader";
import { Link } from "react-router-dom";
import { loginData } from "../Authentication/store/apiServices";
import {
  productList,
  searchProductList,
  getCokkie
} from "./store/apiService";
import { SETTINGS } from "../../constants/api/api_path"
import { useDispatch, useSelector } from "react-redux";
import { 
  customSaleFetched, 
  instantSaleFetched, 
  isCustomProductsFetched, 
  isInstantProductsFetched, 
  instantNewestFetched, 
  instantLowHighFetched, 
  instantHighLowFetched, 
  customNewestFetched, 
  customLowHighFetched, 
  customHighLowFetched
 } from "../../store/products/action";

function Product({setLoader, loader, setLoading, loading, prodType, filterArray, actionType}) {
  const dispatch = useDispatch()
  let [productArray, setProductArray] = useState();
  const [filteredProducts, setFilteredProducts] = useState();
  const [noRecord, setNoRecord] = useState(false);
  const [currency, setCurrency] = useState();
  const [allProducts, setAllProducts] = useState();
  const [spinner, setSpinner] = useState({ id: "", clicked: false });
  const [currencyId, setCurrencyId] = useState()

  const instantProducts = useSelector((state) => state?.products?.instantProducts)
  const instantSale = useSelector((state) => state?.products?.instantSale)
  const instantNewest = useSelector((state) => state?.products?.instantNewest)
  const instantLowHigh = useSelector((state) => state?.products?.instantLowHigh)
  const instantHighLow = useSelector((state) => state?.products?.instantHighLow)

  const customProducts = useSelector((state) => state?.products?.customProducts)
  const customSale = useSelector((state) => state?.products?.customSale)
  const customNewest = useSelector((state) => state?.products?.customNewest)
  const customLowHigh = useSelector((state) => state?.products?.customLowHigh)
  const customHighLow = useSelector((state) => state?.products?.customHighLow)

  const currencyObj = useSelector((state) => state?.products?.currency)

  useEffect(() => {
    let info = loginData();
    setCurrency(info?.currency);
    let data = getCokkie(SETTINGS.CURRENCY)
    setCurrencyId(data)
  }, []);

  useEffect(() => {
      // setLoader(true);
      // setLoading(true);
    if (filteredProducts?.length > 0) {
      setProductArray(filteredProducts);
      setNoRecord(false);
      // setLoader(false);
      setLoading(false);
    } else if(filteredProducts != undefined){
        // setLoader(false);
        setLoading(false);
        setNoRecord(true);
    }
  }, [filteredProducts]);

  const getProductList = async (prodType) => {
    setLoader(true)
    // setLoading(true)
    try {
      let res = await productList(prodType, currencyId);
      let info = res?.data?.data
      if(info?.currency) {
        setCurrency(info?.currency)
      }
      if (info?.products) {
        prodType === "instant"? dispatch(isInstantProductsFetched(info)) : dispatch(isCustomProductsFetched(info))
        setNoRecord(false);
        setLoader(false)
        setLoading(false)
        setAllProducts(info?.products);
        setProductArray(info?.products);
      } else {
        setNoRecord(true);
      }
    } catch (error) {
      setLoader(false)
      setLoading(false)
      setNoRecord(false);
    }
  };

  useEffect(() => {
    setSpinner({ id: "", clicked: false });
    // setLoader(true)
    // setLoading(true)
    if(prodType){
      if(prodType === "instant" && instantProducts?.length > 0) {
        setProductArray(instantProducts)
        setAllProducts(instantProducts)
        // setLoader(false)
        setLoading(false)
      } else if(prodType === "custom" && customProducts?.length > 0){
        setProductArray(customProducts)
        setAllProducts(customProducts)
        // setLoader(false)
        setLoading(false)
      } else {
        getProductList(prodType);
        setLoading(true)
      }
    }
    currencyObj? setCurrency(currencyObj) : null
  }, [prodType, instantProducts, customProducts, currencyObj,]);

  // useEffect(() => {
  //   if(actionType){
  //     handleSearchFilter(actionType);
  //     }
  // },[actionType])

  useEffect(() => {
    if(prodType === "instant" && actionType) {
      if(actionType === "viewAll" && instantProducts){
        setProductArray(instantProducts)
        setAllProducts(instantProducts)
        // setLoader(false)
        setLoading(false)
      } else if (actionType === "sale" && instantSale) {
          setProductArray(instantSale)
          setAllProducts(instantSale)
          // setLoader(false)
          setLoading(false)
      } else if (actionType === "newest" && instantNewest) {
        setProductArray(instantNewest)
        setAllProducts(instantNewest)
        // setLoader(false)
        setLoading(false)
      } else if (actionType === "LowToHigh" && instantLowHigh) {
        setProductArray(instantLowHigh)
        setAllProducts(instantLowHigh)
        // setLoader(false)
        setLoading(false)
      }else if (actionType === "HighToLow" && instantHighLow) {
        setProductArray(instantHighLow)
        setAllProducts(instantHighLow)
        // setLoader(false)
        setLoading(false)
      } else {
        handleSearchFilter(actionType);
      }
    } else if(prodType === "custom" && actionType) {
        if(actionType === "viewAll" && customProducts) { 
          setProductArray(customProducts)
          setAllProducts(customProducts)
          // setLoader(false)
          setLoading(false)
        } else if (actionType === "sale" && customSale) {
          setProductArray(customSale)
          setAllProducts(customSale)
          // setLoader(false)
          setLoading(false)
        } else if (actionType === "newest" && customNewest) {
          setProductArray(customNewest)
          setAllProducts(customNewest)
          // setLoader(false)
          setLoading(false)
        } else if (actionType === "LowToHigh" && customLowHigh) {
          setProductArray(customLowHigh)
          setAllProducts(customLowHigh)
          // setLoader(false)
          setLoading(false)
        } else if (actionType === "HighToLow" && customHighLow) {
          setProductArray(customHighLow)
          setAllProducts(customHighLow)
          // setLoader(false)
          setLoading(false)
        } else {
          handleSearchFilter(actionType);
        }
    }
  },[actionType,prodType])

  useEffect(() => {
    const isAnyOptionSelected = Object.values(filterArray).some(filterArray => filterArray.some(option => option.check));

    if (allProducts) {
      let myObj = {
        "Select Cores": "filterCores",
        "Select RAM": "filterRAM",
        "Select Storage": "filterStorage",
        "Select Networks": "Network",
        "Select Location": "filterLocation",
      };

      let newdata = allProducts?.filter((obj) => {
        return Object.keys(filterArray).every((k) => {
          const activeF = filterArray[k]
            .filter((e) => e.check)
            .map((e) => e.value);
          if (activeF && activeF.length) {
            return activeF.includes(obj.desc[myObj[k]]);
          } else {
            return true;
          }
        });
      });
      setFilteredProducts(newdata);
    }
  }, [filterArray, allProducts]);

  const handleSearchFilter = async (action) => {
    setLoader(true)
    // setLoading(true)
    try {
      let res = await searchProductList(action, prodType);
      let info = res?.data?.data
      if(info?.currency){
        setCurrency(info?.currency)
      }
      if (info?.products) {
        // setNoRecord(false);
        setLoader(false)
        setLoading(false)
        if(prodType === "instant"){
          if(action === "sale"){
            dispatch(instantSaleFetched(info))
          } 
         else if(action === "newest"){
            dispatch(instantNewestFetched(info))
          }
         else if(action === "LowToHigh"){
            dispatch(instantLowHighFetched(info))
          } 
        else if(action === "HighToLow"){
            dispatch(instantHighLowFetched(info))
          }
        }else if(prodType === "custom"){
          if(action === "sale"){
            dispatch(customSaleFetched(info))
          } 
          else if(action === "newest"){
            dispatch(customNewestFetched(info))
          } 
        else if(action === "LowToHigh"){
            dispatch(customLowHighFetched(info))
          }
         else if(action === "HighToLow"){
            dispatch(customHighLowFetched(info))
          }
        }
        setAllProducts(info?.products);
        setProductArray(info?.products);
      } else {
        setLoader(false)
        setLoading(false)
        setNoRecord(true);
      }
    } catch (error) {
      setLoader(false)
      setLoading(false)
      setNoRecord(true);
    }
  };

  return (
    <div className="tab-content products-list" id="pills-tabContent">
      <div
        className={
          loader ? "barchart overlayerloader" : "tab-pane fade show active"
        }
        id="pills-all"
        role="tabpanel"
        aria-labelledby="pills-all-tab"
        tabIndex={0}
      >
        <TextLoader loading={loading} loader={loader}/>
        {noRecord ? (
          <NoRecordFound message={"No server found"} />
        ) : (
          <>
            <div className="rs-product-left-contentbar">
              {productArray?.map((product, index) => (
                <div className="rs-product-left-box" key={index + "child"}>
                  <h5>{product?.name}</h5>
                  <p className="starting-price">
                    Starting from <strong>{currency?.prefix}
                    {product?.minprice?.amount} {currency?.suffix} /
                    {product?.minprice?.billingcycle.charAt(0).toUpperCase() +
                      product?.minprice?.billingcycle.slice(1)}</strong>{" "}
                  </p>
                  <div className="rs-product-left-text-price">
                    <ul>
                      <li>
                        <p>CPU</p>
                        <span>{product?.desc?.CPU}</span>
                      </li>
                      <li>
                        <p>Chassis</p>
                        <span>{product?.desc?.Chassis}</span>
                      </li>
                      <li>
                        <p>Cores</p>
                        <span>{product?.desc?.Cores}</span>
                      </li>
                      <li>
                        <p>RAM</p>
                        <span>{product?.desc?.RAM}</span>
                      </li>
                      <li>
                        <p>TRAFFIC</p>
                        <span>{product?.desc?.Traffic}</span>
                      </li>
                      <li>
                        <p>Network</p>
                        <span>{product?.desc?.Network}</span>
                      </li>
                      <li>
                        <p>Location</p>
                        <span>{product?.desc?.Location}</span>
                      </li>
                      <li>
                        <p>Storage</p>
                        <span>{product?.desc?.Storage}</span>
                      </li>
                    </ul>
                  </div>
                   <div
                    className={
                      spinner?.clicked && index === spinner.id
                        ? "rs-product-left-price-btn product-list-spinner"
                        : "rs-product-left-price-btn"
                    }
                  >
                    {spinner?.clicked && index === spinner.id ? (
                      <div className="ui active centered inline loader "></div>
                    ) :  (
                      <Link
                        to={{
                          pathname:`/product-config/${product.id}`,
                          status:0
                        }}
                        onClick={(e) => {
                         spinner?.clicked? e?.preventDefault() : (setSpinner({ id: index, clicked: true })
                          // setLoading(true)
                          )
                        }}
                      >
                        {prodType === "instant" ? "Buy Now" : "Customize*"}
                      </Link>
                    )}
                  </div>
                  <div className="rs-product-left-price-content">
                    {product?.minprice?.setupfee > 0 && (
                      <p>
                        * One-off {currency.prefix}
                        {product?.minprice?.setupfee} {currency.suffix} set up
                        fee applies.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Product;
