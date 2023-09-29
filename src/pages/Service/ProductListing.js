import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import allFilters from "../../constants/productListFilters";
import Product from "./Product";
import { bake_cookie, read_cookie } from "sfcookies";
import { SETTINGS } from "../../constants/api/api_path";
import { v4 as uuidv4 } from "uuid";
import { setPageTitle } from "../../helpers/api_helper_rs"
function ProductListing() {
  let [filterArray, setFilterArray] = useState(allFilters);
  const [loader, setLoader] = useState("");
  const [loading, setLoading] = useState("");
  const [prodType, setProdType] = useState();
  const [isActive, setIsActive] = useState("viewAll");
  const [actionType, setActionType] = useState();
  const [guestToken, setGuestToken] = useState("");

  useEffect(async () => {
    setPageTitle("Product List")
    setProdType("instant");
    let guest_Token = read_cookie(SETTINGS.GUESTTOKEN);
    guest_Token?.length != 0 ? setGuestToken(guest_Token) : createGuestToken();
  }, [guestToken]);

  const createGuestToken = () => {
    let guest_Token = uuidv4() + new Date().getTime();
    bake_cookie(SETTINGS.GUESTTOKEN, guest_Token);
    setGuestToken(guest_Token);
  };

  const handleSelectParentElement = (e, index, parent) => {
    let b = filterArray[parent].map((item, i) => {
      if (i === index) {
        return { ...item, check: !e.target.checked };
      } else {
        return item;
      }
    });
    setFilterArray({ ...filterArray, [parent]: b });
  };

  const handleSelectAllParent = (e, parent) => {
    let a = filterArray[parent].map((item) => {
      return { ...item, check: !e.target.checked };
    });
    setFilterArray({ ...filterArray, [parent]: a });
  };

  const checkAll = (parent) => {
    let a = filterArray[parent].every((item) => {
      return item.check === true;
    });
    return a;
  };

  const handleSearchFilter = async (action) => {
    // setLoader(true)
    // setLoading(true)
    setActionType(action);
    setIsActive(action);
  };

  const handleSelectType = (type) => {
    setIsActive("viewAll");
    setActionType("");
    setProdType(type);
  };

  return (
    <div
      className={
        loader
          ? "rs-product-listing-side-section rs-product-listing-section rs-product-section overlayerloader-product"
          : "rs-product-listing-side-section rs-product-listing-section rs-product-section"
      }
    >
      <section>
        <div className="rs-product-left">
          <div className="rs-product-service-filter">
            <div className="rs-product-filter">
              <div className="rs-product-filter-title">
                <h6>all filters</h6>
              </div>
              <div className="rs-product-filter-select">
                <div className="accordion" id="accordionExample">
                  <div className="accordion-item" key="div">
                    <h2 className="accordion-header" id="h2">
                      <button
                        id="button_"
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapse"
                        aria-expanded="true"
                        aria-controls="collapse"
                      >
                        Select Type
                      </button>
                    </h2>
                    <div
                      id="collapse"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingCore"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        <div className="form-check">
                          <input
                            className="form-check-input circle-radio"
                            defaultChecked
                            name="radio-group"
                            type="radio"
                            value="instant"
                            id="val"
                            onChange={(e) => {
                              // setLoader(true)
                              setLoading(true)
                              handleSelectType(e.target.value);
                            }}
                          />
                          <label className="form-check-label" htmlFor="val">
                            Instant
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input circle-radio"
                            name="radio-group"
                            type="radio"
                            value="custom"
                            id="noVal"
                            onChange={(e) => {
                              // setLoader(true)
                              setLoading(true)
                              handleSelectType(e.target.value);
                            }}
                          />
                          <label className="form-check-label" htmlFor="noVal">
                            Custom
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rs-product-filter-select">
                <div className="accordion" id="accordionExample">
                  {Object.keys(filterArray).map((parent, index) => (
                    <div className="accordion-item" key={`div_${index}`}>
                      <h2 className="accordion-header" id={`h2_${index}`}>
                        <button
                          id={`button_${index}`}
                          className="accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse${index}`}
                          aria-expanded="true"
                          aria-controls={`collapse${index}`}
                        >
                          {parent}
                        </button>
                      </h2>
                      <div
                        id={`collapse${index}`}
                        className="accordion-collapse collapse show"
                        aria-labelledby="headingCore"
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={checkAll(parent)}
                              id={`all${index}`}
                              onChange={() => {}}
                              onClick={(e) => {
                                setLoading(true), 
                                handleSelectAllParent(e, parent)
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`all${index}`}
                            >
                              All
                            </label>
                          </div>
                          {filterArray[parent].map((val, index) => (
                            <div className="form-check" key={index + "parent"}>
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={val.check ? true : false}
                                value={val.value}
                                id={val.name}
                                onChange={() => {}}
                                onClick={(e) => {
                                  setLoading(true),
                                  handleSelectParentElement(e, index, parent)
                                }}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={val.name}
                              >
                                {val.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="rs-product-tab">
              <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                  
                  <button
                    className={
                      isActive === "viewAll" ? "nav-link active" : "nav-link"
                    }
                    // id="pills-all-tab"
                    // data-bs-toggle="pill"
                    // data-bs-target="#pills-all"
                    type="button"
                    // role="tab"
                    // aria-controls="pills-all"
                    aria-selected="true"
                    onClick={(e) => {
                      isActive === "viewAll"? e.preventDefault() : (handleSearchFilter("viewAll"), setLoading(true))
                    }}
                  >
                    View All 
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={
                      isActive === "sale" ? "nav-link active" : "nav-link"
                    }
                    id="pills-sale-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-sale"
                    type="button"
                    role="tab"
                    aria-controls="pills-sale"
                    aria-selected="false"
                    onClick={(e) => {isActive === "sale"? e.preventDefault() : (handleSearchFilter("sale"), setLoading(true))}}
                  >
                    Sale
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={
                      isActive === "newest" ? "nav-link active" : "nav-link"
                    }
                    id="pills-mumbai-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-mumbai"
                    type="button"
                    role="tab"
                    aria-controls="pills-mumbai"
                    aria-selected="false"
                    onClick={(e) => {isActive === "newest"? e.preventDefault() : (handleSearchFilter("newest"), setLoading(true))}}
                  >
                    Newest
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={
                      isActive === "LowToHigh" ? "nav-link active" : "nav-link"
                    }
                    id="pills-lowtohigh-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-lowtohigh"
                    type="button"
                    role="tab"
                    aria-controls="pills-lowtohigh"
                    aria-selected="false"
                    onClick={(e) => {isActive === "LowToHigh"? e.preventDefault() : (handleSearchFilter("LowToHigh"), setLoading(true))}}
                  >
                    Price - Low to High
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={
                      isActive === "HighToLow" ? "nav-link active" : "nav-link"
                    }
                    id="pills-hightolow-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-hightolow"
                    type="button"
                    role="tab"
                    aria-controls="pills-hightolow"
                    aria-selected="false"
                    onClick={(e) => {isActive === "HighToLow"? e.preventDefault() : (handleSearchFilter("HighToLow"), setLoading(true))}}
                  >
                    Price - High to Low{" "}
                  </button>
                </li>
              </ul>
              <Product
                prodType={prodType}
                filterArray={filterArray}
                actionType={actionType}
                loader={loader}
                setLoader={setLoader}
                loading={loading}
                setLoading={setLoading}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default React.memo(ProductListing);
