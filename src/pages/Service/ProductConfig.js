import React, { useEffect, useState } from "react";
import {
  withRouter,
  Link,
  useHistory,
  useParams,
  useLocation,
} from "react-router-dom";
import TextLoader from "../../components/textLoader";
import {
  productDetail,
  productBillingCycle,
  updateConfiguration,
  copyConfiguration,
  getConfiguation,
  getCurrencyList,
  addToCart,
  updateCurrency,
  createCartToken,
  getCokkie,
} from "./store/apiService";
import { loginData } from "../Authentication/store/apiServices";
import { SETTINGS } from "../../constants/api/api_path";
import { read_cookie } from "sfcookies";
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";
import ProgressBar from "../../components/progressBar";
import { bake_cookie } from "sfcookies";

const ProductConfig = (props) => {
  const [product, setProduct] = useState();
  const [currency, setCurrency] = useState();
  const [currencyId, setCurrencyId] = useState();
  const [guestToken, setGuestToken] = useState("");
  const [productId, setProductId] = useState();
  const [loader, setLoader] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState();
  const [currencyList, setCurrencyList] = useState();
  const [loginStatus, setLoginStatus] = useState();
  const [lineLoader, setlineLoader] = useState("");
  const [selectedCurrency, setSelecetedCurrency] = useState({
    label: "",
    code: "",
    id: "",
  });
  const navigate = useHistory();
  const params = useParams();
  const { search } = useLocation();
  const parameters = new URLSearchParams(search);
  const token = parameters.get("token");
  const Location = useLocation();
  const status = Location?.status;

  const [HDDConfig, setHDDConfig] = useState({
    selectedValue: "",
    quanitiy: "0",
    type: "",
  });
  const [SSDConfig, setSSDConfig] = useState({
    selectedValue: "",
    quanitiy: "0",
    type: "",
  });
  const [containHDD, setContainHDD] = useState(false);
  const [containSSD, setContainSSD] = useState(false);
  const [minMaxHDDSSD, setminMaxHDDSSD] = useState({ min: "", max: "" });
  const [previousHDDSSD, setPreviousHDDSDD] = useState();
  const [disableHDD, setDesableHDD] = useState(false);
  const [disableSSD, setDesableSSD] = useState(false);
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    let guest_Token = read_cookie(SETTINGS.GUESTTOKEN);
    if (guest_Token?.length != 0) {
      setGuestToken(guest_Token);
    } else {
      let cart_token = createCartToken();
      setGuestToken(cart_token);
    }
    let info = loginData();
    setCurrency(info?.currency);
    setProductId(params?.id);
  }, []);

  useEffect(() => {
    let user = localStorage.getItem("authUser");
    user ? setLoginStatus(true) : (setLoginStatus(false), getCurrency());
  }, []);

  useEffect(() => {
    let jwt = localStorage.getItem("jwt");
    if (jwt) {
      localStorage.clear();
    }
  }, []);

  useEffect(() => {
    if (productId && guestToken && !token) {
      getProductDetail();
    } else if (token && guestToken && productId) {
      getUserConfiguration();
    }
  }, [productId, guestToken, token]);

  useEffect(() => {
    let data = getCokkie(SETTINGS.CURRENCY);
    setCurrencyId(data);
  }, []);

  const getProductDetail = (action, info) => {
    setlineLoader(true);
    setLoading(true);
    let data = "";
    if (action === "currencyUpdate") {
      data = new URLSearchParams({
        product_id: productId,
        cart_token: guestToken,
        is_added: status || 0,
        currencyId: info,
      });
    } else if (action === "billingCycleUpdate" && currencyId) {
      data = new URLSearchParams({
        billingcycle: info,
        product_id: productId,
        cart_token: guestToken,
        is_added: status || 0,
        currencyId: currencyId,
      });
    } else if (action === "billingCycleUpdate") {
      data = new URLSearchParams({
        billingcycle: info,
        product_id: productId,
        cart_token: guestToken,
        is_added: status || 0,
      });
    } else if (currencyId) {
      data = new URLSearchParams({
        product_id: productId,
        cart_token: guestToken,
        is_added: status || 0,
        selectedCurrencyId: currencyId,
      });
    } else {
      data = new URLSearchParams({
        product_id: productId,
        cart_token: guestToken,
        is_added: status || 0,
      });
    }
    handleProductDetail(data);
  };

  const handleProductDetail = async (data) => {
    setlineLoader(true);
    setLoading(true)
    try {
      let res = await productDetail(data);
      bake_cookie(SETTINGS.CURRENCY, res?.data?.data?.currency?.id);
      setlineLoader(false);
      // setLoading(false)
      setIsActive(res?.data?.data?.billingcycle);
      let defaultCurr = res?.data?.data?.currency;
      if (defaultCurr) {
        setCurrency(res?.data?.data?.currency);
        setSelecetedCurrency({
          label: defaultCurr?.label,
          code: defaultCurr?.code,
          id: defaultCurr?.id,
        });
      }
      setProduct(res?.data?.data);
      setHDDSSDConfigs(res?.data?.data);
      setLoader(false);
      setLoading(false);
    } catch (error) {
      // navigate.push("/productlist");
      setLoader(false);
      setLoading(false);
      setlineLoader(false);
    }
  };

  const handleSelectBillingCycle = async (billingCycle) => {
    setIsActive(billingCycle);
    getProductDetail("billingCycleUpdate", billingCycle);
  };

  const handleSelectConfigOptions = async (
    suboption,
    option,
    optiontype,
    configType,
    optionname
  ) => {
    let suboptionid = "";
    if (suboption?.id) {
      suboptionid = suboption?.id;
    } else {
      suboptionid = suboption;
    }

    if (optiontype == 1) {
      setDesableHDD(true);
      setDesableSSD(true);
      if (optionname) {
        const name = optionname.split("|");
        if (name[0] === "raidsetup") {
          const suboptionname = suboption?.optionname.split("|");
          updateHDDSSDConfigs(suboptionid, option, suboptionname[0]);
        } else {
          updateConfig(suboptionid, option, name[0]);
        }
      }
    } else if (optiontype == 4 && configType === "HDD") {
      setDesableHDD(true);
      setHDDConfig((prevVal) => {
        setPreviousHDDSDD({ prevVal, action: "HDD" });
        // updateConfig(0, prevVal?.selectedValue);
        return {
          selectedValue: suboptionid,
          quanitiy: HDDConfig?.quanitiy,
          type: optiontype,
        };
      });
      // updateConfig(HDDConfig?.quanitiy, suboptionid);
    } else if (optiontype == 4 && configType === "SSD") {
      setDesableSSD(true);
      setSSDConfig((prevVal) => {
        // setPreviousSSD(prevVal)
        setPreviousHDDSDD({ prevVal, action: "SSD" });
        return {
          selectedValue: suboptionid,
          quanitiy: SSDConfig?.quanitiy,
          type: optiontype,
        };
      });
      // updateConfig(SSDConfig?.quanitiy, suboptionid);
    }
    // else if(optiontype == 4) {
    //   let { value, min, max } = suboption.target;
    //   value = Math.max(Number(min), Math.min(Number(max), Number(value)));
    //   updateConfig(value, option);
    // }

    // setHDDSSDConfigs()

    // if (optionname) {
    //   const name = optionname.split("|");
    //   if (name[0] === "raidsetup") {
    //     const suboptionname = suboption?.optionname.split("|");
    //     if (suboptionname[0] == -1) {
    //       setminMaxHDDSSD({ min: "0", max: "100" });

    //       setHDDConfig({
    //         selectedValue: HDDConfig?.selectedValue,
    //         quanitiy: "0",
    //         type: 4,
    //       });
    //       setSSDConfig({
    //         selectedValue: SSDConfig?.selectedValue,
    //         quanitiy: "0",
    //         type: 4,
    //       });
    //     } else if (suboptionname[0] == 0) {
    //       setminMaxHDDSSD({ min: "2", max: "36" });

    //       setHDDConfig({
    //         selectedValue: HDDConfig?.selectedValue,
    //         quanitiy: 2,
    //         type: 4,
    //       });
    //       setSSDConfig({
    //         selectedValue: SSDConfig?.selectedValue,
    //         quanitiy: 2,
    //         type: 4,
    //       });
    //     } else if (suboptionname[0] == 1) {
    //       setminMaxHDDSSD({ min: "2", max: "100" });

    //       setHDDConfig({
    //         selectedValue: HDDConfig?.selectedValue,
    //         quanitiy: 2,
    //         type: 4,
    //       });
    //       setSSDConfig({
    //         selectedValue: SSDConfig?.selectedValue,
    //         quanitiy: 2,
    //         type: 4,
    //       });
    //     } else if (suboptionname[0] == 5) {
    //       setminMaxHDDSSD({ min: "3", max: "31" });

    //       setHDDConfig({
    //         selectedValue: HDDConfig?.selectedValue,
    //         quanitiy: 3,
    //         type: 4,
    //       });
    //       setSSDConfig({
    //         selectedValue: SSDConfig?.selectedValue,
    //         quanitiy: 3,
    //         type: 4,
    //       });
    //     } else if (suboptionname[0] == 10) {

    //       setminMaxHDDSSD({ min: "4", max: "36" });
    //       setHDDConfig({
    //         selectedValue: HDDConfig?.selectedValue,
    //         quanitiy: 4,
    //         type: 4,
    //       });
    //       setSSDConfig({
    //         selectedValue: SSDConfig?.selectedValue,
    //         quanitiy: 4,
    //         type: 4,
    //       });
    //     }
    //   }
    // }
  };

  const updateHDDSSDConfigs = (suboptionid, option, suboptionName) => {
    let hdd_configs = { selectedValue: "", quanitiy: "" };
    let ssd_configs = { selectedValue: "", quanitiy: "" };

    if (suboptionName == -1) {
      setminMaxHDDSSD({ min: "0", max: "100" });
      hdd_configs = { selectedValue: HDDConfig?.selectedValue, quanitiy: "0" };
      ssd_configs = { selectedValue: SSDConfig?.selectedValue, quanitiy: "0" };
    } else if (suboptionName == 0) {
      setminMaxHDDSSD({ min: "2", max: "36" });
      hdd_configs = { selectedValue: HDDConfig?.selectedValue, quanitiy: 2 };
      ssd_configs = { selectedValue: SSDConfig?.selectedValue, quanitiy: 2 };
    } else if (suboptionName == 1) {
      hdd_configs = { selectedValue: HDDConfig?.selectedValue, quanitiy: 2 };
      ssd_configs = { selectedValue: SSDConfig?.selectedValue, quanitiy: 2 };
      setminMaxHDDSSD({ min: "2", max: "100" });
    } else if (suboptionName == 5) {
      hdd_configs = { selectedValue: HDDConfig?.selectedValue, quanitiy: 3 };
      ssd_configs = { selectedValue: SSDConfig?.selectedValue, quanitiy: 3 };
      setminMaxHDDSSD({ min: "3", max: "31" });
    } else if (suboptionName == 10) {
      hdd_configs = { selectedValue: HDDConfig?.selectedValue, quanitiy: 4 };
      ssd_configs = { selectedValue: SSDConfig?.selectedValue, quanitiy: 4 };
      setminMaxHDDSSD({ min: "4", max: "36" });
    }

    setHDDConfig({
      selectedValue: HDDConfig?.selectedValue,
      quanitiy: hdd_configs?.quanitiy,
      type: 4,
    });

    setSSDConfig({
      selectedValue: SSDConfig?.selectedValue,
      quanitiy: ssd_configs?.quanitiy,
      type: 4,
    });

    updateConfig(suboptionid, option, "raidsetup", hdd_configs, ssd_configs);
  };

  const handlePrevState = async (prevVal, action) => {
    if (prevVal?.selectedValue) {
      if (guestToken && productId) {
        setlineLoader(true);
        setLoading(true);
        try {
          let data = new URLSearchParams({
            cart_token: guestToken,
            config_option_id: prevVal?.selectedValue,
            sub_config_option_value: 0,
            product_id: productId,
            is_added: status || 0,
          });
          let res = await updateConfiguration(data);
          if (res) {
            if (action === "HDD") {
              updateHDD(HDDConfig?.quanitiy, HDDConfig?.selectedValue);
            } else if (action === "SSD") {
              updateSSD(SSDConfig?.quanitiy, SSDConfig?.selectedValue);
            }
          }
        } catch (error) {}
        setlineLoader(false);
        setLoading(false)
      }
    }
  };

  const updateConfig = async (
    suboption,
    option,
    optionname,
    hdd_configs,
    ssd_configs
  ) => {
    if (option && guestToken && productId) {
      setlineLoader(true);
      setLoading(true)
      try {
        let data = new URLSearchParams({
          cart_token: guestToken,
          config_option_id: option,
          sub_config_option_value: suboption,
          product_id: productId,
          is_added: status || 0,
        });
        let res = await updateConfiguration(data);
        if (res) {
          setProduct(res?.data?.data);
          if (optionname === "raidsetup") {
            updateHDD(
              hdd_configs?.quanitiy,
              hdd_configs?.selectedValue,
              ssd_configs
            );
          } else {
            setDesableHDD(false);
            setDesableSSD(false);
          }
        }
      } catch (error) {}
      setlineLoader(false);
      setLoading(false)
    }
  };

  const handleShareConfig = async () => {
    try {
      let data = new URLSearchParams({
        product_id: productId,
        cart_token: guestToken,
      });
      let result = await copyConfiguration(data);
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

  const getUserConfiguration = async () => {
    setLoader(true);
    setLoading(true);
    try {
      let data = new URLSearchParams({
        product_id: productId,
        cart_token: guestToken,
        token: token,
      });
      let response = await getConfiguation(data);
      let url = response?.data?.data?.url;
      setLoader(false);
      setLoading(false);
      url
        ? location.replace(url)
        : navigate.push(`/product-config/` + `${productId}`);
    } catch (error) {
      setLoader(false);
      setLoading(false);
    }
  };

  const getCurrency = async () => {
    try {
      let res = await getCurrencyList();
      let currency_list = res?.data?.data;
      if (currency_list) {
        setCurrencyList(currency_list);
      }
    } catch (error) {}
  };

  const handleAddToCart = async () => {
    setLoading(true);
    setSpinner(true);
    try {
      let data = new URLSearchParams({
        product_id: productId,
        cart_token: guestToken,
      });
      let result = await addToCart(data);
      if (result) {
        setSpinner(false);
        setLoading(false);
        navigate.push(`/cart-review`);
      }
    } catch (error) {
      setSpinner(false);
      setLoading(false);
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleCurrencyChange = async (currency) => {
    setCurrencyId(currency?.id);
    silentHitCurrencyUpdate(currency?.id, guestToken);
    getProductDetail("currencyUpdate", currency?.id);
  };

  const silentHitCurrencyUpdate = async (currency_id, guest_token) => {
    try {
      let data = new URLSearchParams({
        currencyId: currency_id,
        cart_token: guest_token,
      });
      let result = await updateCurrency(data);
      if (result) {
        bake_cookie(SETTINGS.CURRENCY, currency_id);
      }
    } catch (error) {}
  };

  // useEffect(() => {
  //   if(product) {
  //     product?.config_options?.map((options, index) => {
  //       if(options?.optiontype == 4) {
  //         let containhdd = options.optionname.includes("HDD");
  //         let containssd = options.optionname.includes("SSD");
  //         if(containhdd) {
  //           setContainHDD(true)
  //         }
  //         if(containssd) {
  //           setContainSSD(true)
  //         }
  //         if(containhdd) {
  //           options?.selectedDropDown? setHDDConfig({selectedValue: options?.id, quanitiy: options?.selectedQty, type: 4}) :  ""
  //         } else if(containssd) {
  //           options?.selectedDropDown? setSSDConfig({selectedValue: options?.id, quanitiy: options?.selectedQty, type: 4}) : ""
  //         }
  //       }
  //     })
  //   }
  // },[product])

  // useEffect(() => {
  //   if (product) {
  //     let hddId = null;
  //     let sddId = null;
  //     let selectedHdDropDownId = null;
  //     let selectedSdDropDownId = null;

  //     let selectedHdQty = 0;
  //     let selectedSdQty = 0;
  //     product?.config_options?.map((options, index) => {
  //       if (options?.optiontype == 4) {
  //         let containhdd = options.optionname.includes("HDD");
  //         let containssd = options.optionname.includes("SSD");
  //         if (containhdd) {
  //           setContainHDD(true);
  //           if (!hddId) {
  //             hddId = options.id;
  //           }

  //           if (options?.selectedDropDownHDD) {
  //             selectedHdDropDownId = options.id;
  //             selectedHdQty = options.selectedQty;
  //           }
  //         } else if (containssd) {
  //           setContainSSD(true);
  //           if (!sddId) {
  //             sddId = options.id;
  //           }
  //           if (options?.selectedDropDownSSD) {
  //             selectedSdDropDownId = options.id;
  //             selectedSdQty = options.selectedQty;
  //           }
  //         }
  //       }
  //     });

  //     setHDDConfig({
  //       selectedValue: selectedHdDropDownId || hddId,
  //       quanitiy: selectedHdQty,
  //       type: 4,
  //     });
  //     setSSDConfig({
  //       selectedValue: selectedSdDropDownId || sddId,
  //       quanitiy: selectedSdQty,
  //       type: 4,
  //     });
  //   }

  //   if (!minMaxHDDSSD?.min && !minMaxHDDSSD?.max) {
  //     product?.config_options?.map((option) => {
  //       const name = option?.optionname.split("|");
  //       if (name[0] == "raidsetup") {
  //         option?.sub_config_option?.map((suboption) => {
  //           if (option?.selectedValue == suboption?.id) {
  //             const suboptionname = suboption?.optionname?.split("|");
  //             if (suboptionname[0] == -1) {
  //               setminMaxHDDSSD({ min: "0", max: "100" });
  //             } else if (suboptionname[0] == 0) {
  //               setminMaxHDDSSD({ min: "2", max: "36" });
  //             } else if (suboptionname[0] == 1) {
  //               setminMaxHDDSSD({ min: "2", max: "100" });
  //             } else if (suboptionname[0] == 5) {
  //               setminMaxHDDSSD({ min: "3", max: "31" });
  //             } else if (suboptionname[0] == 10) {
  //               setminMaxHDDSSD({ min: "4", max: "36" });
  //             }
  //           }
  //         });
  //       }
  //     });
  //   }
  // }, [product, minMaxHDDSSD]);

  const setHDDSSDConfigs = (productInfo) => {
    if (productInfo) {
      let hddId = null;
      let sddId = null;
      let selectedHdDropDownId = null;
      let selectedSdDropDownId = null;

      let selectedHdQty = "";
      let selectedSdQty = 0;
      productInfo?.config_options?.map((options, index) => {
        if (options?.optiontype == 4) {
          let containhdd = options.optionname.includes("HDD");
          let containssd = options.optionname.includes("SSD");
          if (containhdd) {
            setContainHDD(true);
            if (!hddId) {
              hddId = options.id;
            }

            if (options?.selectedDropDownHDD) {
              selectedHdDropDownId = options.id;
              selectedHdQty = options.selectedQty;
            }
          } else if (containssd) {
            setContainSSD(true);
            if (!sddId) {
              sddId = options.id;
            }
            if (options?.selectedDropDownSSD) {
              selectedSdDropDownId = options.id;
              selectedSdQty = options.selectedQty;
            }
          }
        }
      });
      // setHDDConfig({
      //   selectedValue: selectedHdDropDownId || hddId,
      //   quanitiy: selectedHdQty,
      //   type: 4,
      // });
      // setSSDConfig({
      //   selectedValue: selectedSdDropDownId || sddId,
      //   quanitiy: selectedSdQty,
      //   type: 4,
      // });
      productInfo?.config_options?.map((option) => {
        const name = option?.optionname.split("|");
        if (name[0] == "raidsetup") {
          option?.sub_config_option?.map((suboption) => {
            if (option?.selectedValue == suboption?.id) {
              const suboptionname = suboption?.optionname?.split("|");
              if (suboptionname[0] == -1) {
                setminMaxHDDSSD({ min: "0", max: "100" });
                setHDDConfig({
                  selectedValue: selectedHdDropDownId || hddId,
                  quanitiy: selectedHdQty || "0",
                  type: 4,
                });
                setSSDConfig({
                  selectedValue: selectedSdDropDownId || sddId,
                  quanitiy: selectedSdQty || "0",
                  type: 4,
                });
              } else if (suboptionname[0] == 0) {
                setminMaxHDDSSD({ min: "2", max: "36" });
                setHDDConfig({
                  selectedValue: selectedHdDropDownId || hddId,
                  quanitiy: selectedHdQty || 2,
                  type: 4,
                });
                setSSDConfig({
                  selectedValue: selectedSdDropDownId || sddId,
                  quanitiy: selectedSdQty || 2,
                  type: 4,
                });
              } else if (suboptionname[0] == 1) {
                setminMaxHDDSSD({ min: "2", max: "100" });
                setHDDConfig({
                  selectedValue: selectedHdDropDownId || hddId,
                  quanitiy: selectedHdQty || 2,
                  type: 4,
                });
                setSSDConfig({
                  selectedValue: selectedSdDropDownId || sddId,
                  quanitiy: selectedSdQty || 2,
                  type: 4,
                });
              } else if (suboptionname[0] == 5) {
                setminMaxHDDSSD({ min: "3", max: "31" });
                setHDDConfig({
                  selectedValue: selectedHdDropDownId || hddId,
                  quanitiy: selectedHdQty || 3,
                  type: 4,
                });
                setSSDConfig({
                  selectedValue: selectedSdDropDownId || sddId,
                  quanitiy: selectedSdQty || 3,
                  type: 4,
                });
              } else if (suboptionname[0] == 10) {
                setminMaxHDDSSD({ min: "4", max: "36" });
                setHDDConfig({
                  selectedValue: selectedHdDropDownId || hddId,
                  quanitiy: selectedHdQty || 4,
                  type: 4,
                });
                setSSDConfig({
                  selectedValue: selectedSdDropDownId || sddId,
                  quanitiy: selectedSdQty || 4,
                  type: 4,
                });
              }
            }
          });
        }
      });
    }
  };

  useEffect(() => {
    handlePrevState(previousHDDSSD?.prevVal, previousHDDSSD?.action);
  }, [previousHDDSSD]);

  // useEffect(() => {
  //   if (minMaxHDDSSD?.min && minMaxHDDSSD?.max) {
  //     // handleHDDquantity();
  //     // handleSSDquantity();
  //   }
  // }, [minMaxHDDSSD]);

  const handleHDDquantity = (e, val, type) => {
    setDesableHDD(true);
    if (e) {
      let { value, min, max } = e.target;
      value = Math.max(Number(min), Math.min(Number(max), Number(value)));
      setHDDConfig({
        selectedValue: HDDConfig?.selectedValue,
        quanitiy: value,
        type: type,
      });
      updateConfig(value, HDDConfig?.selectedValue);
    }
    // else {
    //   updateConfig(HDDConfig?.quanitiy, HDDConfig?.selectedValue);
    // }
  };

  const updateHDD = async (suboption, option, ssd_configs) => {
    if (option && guestToken && productId) {
      setlineLoader(true);
      setLoading(true)
      try {
        let data = new URLSearchParams({
          cart_token: guestToken,
          config_option_id: option,
          sub_config_option_value: suboption,
          product_id: productId,
          is_added: status || 0,
        });
        let res = await updateConfiguration(data);
        if (res) {
          setProduct(res?.data?.data);
          setDesableHDD(false);
          ssd_configs
            ? updateSSD(ssd_configs?.quanitiy, ssd_configs?.selectedValue)
            : setDesableSSD(false);
        }
      } catch (error) {}
      setlineLoader(false);
      setLoading(false)
    }
  };

  const handleSSDquantity = (e, val, type) => {
    setDesableSSD(true);
    if (e) {
      let { value, min, max } = e.target;
      value = Math.max(Number(min), Math.min(Number(max), Number(value)));
      setSSDConfig({
        selectedValue: SSDConfig?.selectedValue,
        quanitiy: value,
        type: type,
      });
      updateConfig(value, SSDConfig?.selectedValue);
    }
    // else {
    //   updateConfig(SSDConfig?.quanitiy, SSDConfig?.selectedValue);
    // }
  };

  const updateSSD = async (suboption, option) => {
    if (option && guestToken && productId) {
      setlineLoader(true);
      setLoading(true)
      try {
        let data = new URLSearchParams({
          cart_token: guestToken,
          config_option_id: option,
          sub_config_option_value: suboption,
          product_id: productId,
          is_added: status || 0,
        });
        let res = await updateConfiguration(data);
        if (res) {
          setDesableSSD(false);
          setProduct(res?.data?.data);
        }
      } catch (error) {}
      setlineLoader(false);
      setLoading(false)
    }
  };

  return (
    <div>
      <section className="rs-product-delivery-section rs-product-section">
        <div
          className={
            loader ? "rs-product-left  overlayerloader" : "rs-product-left"
          }
        >
          <div className="rs-product-left-title">
            <div className="rs-product-left-link">
              <Link
                onClick={(e) => {
                  spinner ? e?.preventDefault() : null;
                }}
                to="/productlist"
              >
                <i className="feather icon-arrow-left" />
                back to listing
              </Link>
            </div>
            <h2>
              {product?.description?.Chassis}/{product?.description?.CPU}
              {(!product?.description?.Chassis || !product?.description?.CPU) &&
                product?.name}
              ✨
            </h2>
          </div>
          <div className="rs-product-left-contentbar">
            <div className="row">
              <div className="col-lg-7">
                {product?.group === "Custom" && (
                  <div className="rs-product-left-box">
                    <h5>Delivery time</h5>
                    <p className="rs-product-left-content">
                      5 business days *<br />
                      <br />* Due to high demand and the impact of the current
                      pandemic on the availability of server hardware, delivery
                      times may differ and can’t always be guaranteed.
                    </p>
                  </div>
                )}
                <div className="rs-product-left-box">
                  <h5>{product?.name}</h5>
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
                  </ul>
                </div>
                {product?.paytype != "free" && product?.price && (
                  <div className="rs-product-left-box rs-product-left-box-bill mt-5">
                    <h5>Choose Billing Cycle</h5>
                    <ul>
                      {product?.paytype === "free" && (
                        <li className="activeCard">
                          Free <br />
                          {currency?.prefix}0.00 {currency?.suffix}
                        </li>
                      )}
                      {((product?.paytype == "onetime" &&
                        product?.price?.monthly) ||
                        (product?.paytype == "recurring" &&
                          product?.price?.monthly)) && (
                        <li
                          className={isActive === "monthly" ? "activeCard" : ""}
                          onClick={(e) => {
                            spinner
                              ? e?.preventDefault()
                              : handleSelectBillingCycle("monthly");
                          }}
                        >
                          Monthly
                          <br />
                          {currency?.prefix}
                          {product?.price?.monthly} {currency?.suffix}
                        </li>
                      )}
                      {product?.paytype === "onetime" &&
                        product?.price?.msetupfee > 0 && (
                          <li
                            className={
                              isActive === "msetupfee" ? "activeCard" : ""
                            }
                            onClick={(e) =>
                              spinner
                                ? e?.preventDefault()
                                : handleSelectBillingCycle("msetupfee")
                            }
                          >
                            Monthly Setup Fee
                            <br />
                            {currency?.prefix}
                            {product?.price?.msetupfee} {currency?.suffix}
                          </li>
                        )}
                      {product?.paytype === "recurring" &&
                        product?.price?.quarterly && (
                          <li
                            className={
                              isActive === "quarterly" ? "activeCard" : ""
                            }
                            onClick={(e) =>
                              spinner
                                ? e?.preventDefault()
                                : handleSelectBillingCycle("quarterly")
                            }
                          >
                            Quarterly
                            <br />
                            {currency?.prefix}
                            {product?.price?.quarterly} {currency?.suffix}
                          </li>
                        )}
                      {product?.paytype === "recurring" &&
                        product?.price?.semiannually && (
                          <li
                            className={
                              isActive === "semiannually" ? "activeCard" : ""
                            }
                            onClick={(e) =>
                              spinner
                                ? e?.preventDefault()
                                : handleSelectBillingCycle("semiannually")
                            }
                          >
                            Semi-Annually
                            <br />
                            {currency?.prefix}
                            {product?.price?.semiannually} {currency?.suffix}
                          </li>
                        )}
                      {product?.paytype === "recurring" &&
                        product?.price?.annually && (
                          <li
                            className={
                              isActive === "annually" ? "activeCard" : ""
                            }
                            onClick={(e) =>
                              spinner
                                ? e?.preventDefault()
                                : handleSelectBillingCycle("annually")
                            }
                          >
                            Annually
                            <br />
                            {currency?.prefix}
                            {product?.price?.annually} {currency?.suffix}
                          </li>
                        )}
                      {product?.paytype === "recurring" &&
                        product?.price?.biennially && (
                          <li
                            className={
                              isActive === "biennially" ? "activeCard" : ""
                            }
                            onClick={(e) =>
                              spinner
                                ? e?.preventDefault()
                                : handleSelectBillingCycle("biennially")
                            }
                          >
                            Biannually
                            <br />
                            {currency?.prefix}
                            {product?.price?.biennially} {currency?.suffix}
                          </li>
                        )}
                      {product?.paytype === "recurring" &&
                        product?.price?.triennially && (
                          <li
                            className={
                              isActive === "triennially" ? "activeCard" : ""
                            }
                            onClick={(e) =>
                              spinner
                                ? e?.preventDefault()
                                : handleSelectBillingCycle("triennially")
                            }
                          >
                            Triannually
                            <br />
                            {currency?.prefix}
                            {product?.price?.triennially} {currency?.suffix}
                          </li>
                        )}
                    </ul>
                  </div>
                )}
                {product?.config_options?.length > 0 && (
                  <div className="rs-product-left-box rs-product-left-box-list configurable-options-select mt-5">
                    <h5>Configurable Options</h5>
                    {product?.config_options?.map((options, index) => {
                      if (options?.optiontype == 1) {
                        //1 = dropdown
                        return (
                          <div key={`${index}+configDropdown`}>
                            <h6>{options?.name}</h6>
                            <select
                              disabled={spinner}
                              className="form-select"
                              aria-label="Default select example"
                              onChange={(e) => {
                                const data = options?.sub_config_option?.filter(
                                  (item) => {
                                    return item.id == e.target.value;
                                  }
                                );
                                handleSelectConfigOptions(
                                  { ...data[0] },
                                  options?.id,
                                  options?.optiontype,
                                  "",
                                  options?.optionname
                                );
                              }}
                              value={options?.selectedValue}
                            >
                              {options?.sub_config_option?.map(
                                (subOption, index) => {
                                  return (
                                    <option
                                      key={subOption?.id}
                                      value={subOption?.id}
                                    >
                                      {subOption?.name}
                                    </option>
                                  );
                                }
                              )}
                            </select>
                          </div>
                        );
                      }

                      if (options?.optiontype == 2) {
                        // 2 = radio
                        return (
                          <div className="radio-input-select">
                            <h6>{options?.name}</h6>
                            <div className="row-select-type">
                              {options?.sub_config_option?.map((subOption) => {
                                return (
                                  <div
                                    key={`${index}+"radio"`}
                                    className="radio-select-type"
                                  >
                                    <input
                                      type="radio"
                                      name={`sub-config-options${options?.name}`}
                                      checked={
                                        options?.selectedValue == subOption?.id
                                      }
                                      value={subOption?.id}
                                      className="form-check-input form-check-input"
                                      onClick={(e) => {
                                        spinner
                                          ? e?.preventDefault()
                                          : handleSelectConfigOptions(
                                              e.target.value,
                                              options?.id,
                                              options?.optiontype,
                                              "",
                                              options?.optionname
                                            );
                                      }}
                                    />
                                    <span>{subOption?.name}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      if (options?.optiontype == 3) {
                        // 3 = checkbox
                        return (
                          <div
                            className="radio-input-select"
                            key={`${index}+"checkbox"`}
                          >
                            <h6>{options?.name}</h6>
                            <div className="row-select-type">
                              {options?.sub_config_option?.map(
                                (subOption, key) => {
                                  return (
                                    <div
                                      key={key}
                                      className="radio-select-type"
                                    >
                                      <input
                                        type="checkbox"
                                        name="sub-config-options"
                                        value={subOption?.id}
                                        defaultChecked={
                                          options?.selectedValue ==
                                          subOption?.id
                                        }
                                        className="form-check-input form-check-input"
                                        onChange={(e) => {
                                          handleSelectConfigOptions(
                                            e.target.value,
                                            options?.id,
                                            options?.optiontype,
                                            "",
                                            options?.optionname
                                          );
                                        }}
                                      />
                                      <span>{subOption?.name}</span>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        );
                      }

                      // if (options?.optiontype == 4) {
                      //   // 4 = quantity
                      //   return (
                      //     <div key={`${index}+"quantity"`}>
                      //       <h6>{options?.name}</h6>
                      //       {options?.sub_config_option?.map(
                      //         (subOption, key) => {
                      //           return (
                      //             <div key={subOption?.id}>
                      //               <input
                      //                 type="number"
                      //                 name="sub-config-options"
                      //                 value={options?.selectedQty}
                      //                 className="form-control"
                      //                 onChange={(e) => {
                      //                   handleSelectConfigOptions(
                      //                     e,
                      //                     options?.id,
                      //                     options?.optiontype
                      //                   );
                      //                 }}
                      //                 min="1"
                      //                 max="10"
                      //               />
                      //             </div>
                      //           );
                      //         }
                      //       )}
                      //     </div>
                      //   );
                      // }

                      // if (options?.optiontype == 4) {
                      // 4 = quantity
                      // return (
                      //   <>
                      //     {/* <div key={`${index}+"quantity"`}>
                      //     <h6>{options?.name}</h6> */}
                      //     {/* {options?.sub_config_option?.map(
                      //       (subOption, key) => {
                      //         return (
                      //           <div key={subOption?.id}>
                      //             <input
                      //               type="number"
                      //               name="sub-config-options"
                      //               value={options?.selectedQty}
                      //               className="form-control"
                      //               onChange={(e) => {
                      //                 handleSelectConfigOptions(
                      //                   e,
                      //                   options?.id,
                      //                   options?.optiontype
                      //                 );
                      //               }}
                      //               min="1"
                      //               max="10"
                      //             />
                      //           </div>
                      //         );
                      //       }
                      //     )} */}
                      //     {/* </div> */}
                      //   </>
                      // );
                      // }
                    })}
                    {(containHDD || containSSD) && (
                      <div className="rs-product-left-box-inner">
                        <h6>Disk</h6>
                        {containHDD && (
                          <>
                            <div className="rs-product-left-box-select">
                              <h4>HDD</h4>
                              <input
                                type="number"
                                name="sub-config-options-quantity"
                                value={HDDConfig?.quanitiy}
                                className="sub-config-options-quantity"
                                onChange={(e) => {
                                  handleHDDquantity(
                                    e,
                                    HDDConfig?.selectedValue,
                                    4
                                  );
                                }}
                                min={minMaxHDDSSD?.min}
                                max={minMaxHDDSSD?.max}
                                disabled={disableHDD || spinner}
                              />
                              <select
                                disabled={spinner}
                                className="form-select"
                                aria-label="Default select example"
                                onChange={(e) => {
                                  handleSelectConfigOptions(
                                    e?.target.value,
                                    HDDConfig?.quanitiy,
                                    4,
                                    "HDD"
                                  );
                                }}
                                value={HDDConfig?.selectedValue}
                              >
                                {product?.config_options?.map(
                                  (options, index) => {
                                    if (options?.optiontype == 4) {
                                      let containhdd =
                                        options.optionname.includes("HDD");
                                      if (containhdd) {
                                        return (
                                          <option
                                            key={options?.id}
                                            value={options?.id}
                                            disabled={disableHDD}
                                          >
                                            {options?.name}
                                          </option>
                                        );
                                      }
                                    }
                                  }
                                )}
                              </select>
                            </div>
                          </>
                        )}
                        {containSSD && (
                          <>
                            <div className="rs-product-left-box-select">
                              <h4>SSD</h4>
                              <input
                                type="number"
                                name="sub-config-options-quantity"
                                value={SSDConfig?.quanitiy}
                                className="sub-config-options-quantity"
                                onChange={(e) => {
                                  handleSSDquantity(
                                    e,
                                    SSDConfig?.selectedValue,
                                    4
                                  );
                                }}
                                min={minMaxHDDSSD?.min}
                                max={minMaxHDDSSD?.max}
                                disabled={disableSSD || spinner}
                              />
                              <select
                                disabled={spinner}
                                value={SSDConfig.selectedValue}
                                className="form-select"
                                aria-label="Default select example"
                                onChange={(e) => {
                                  handleSelectConfigOptions(
                                    e?.target.value,
                                    SSDConfig?.quanitiy,
                                    4,
                                    "SSD"
                                  );
                                }}
                              >
                                {product?.config_options?.map(
                                  (options, index) => {
                                    if (options?.optiontype == 4) {
                                      let containssd =
                                        options.optionname.includes("SSD");
                                      if (containssd) {
                                        return (
                                          <option
                                            key={options?.id}
                                            value={options?.id}
                                            disabled={disableSSD}
                                          >
                                            {options?.name}
                                          </option>
                                        );
                                      }
                                    }
                                  }
                                )}
                              </select>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
                <div className="rs-product-left-box rs-product-left-link mt-5">
                  <h5>Share your configuration</h5>
                  <div className="rs-product-left-link-btn">
                    <a
                      className="copy-configuration-btn"
                      onClick={(e) => {
                        spinner ? e?.preventDefault() : handleShareConfig();
                      }}
                    >
                      <i className="feather icon-link " />
                      copy link
                    </a>
                  </div>
                </div>
              </div>
              <div className="offset-lg-1 col-lg-4">
                {!loginStatus && currencyList?.length > 1 && (
                  <div className="dropdown dropdown-custom">
                    <a
                      className="btn btn-secondary dropdown-toggle"
                      role="button"
                      id="dropdownMenuLink"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {selectedCurrency?.label} ({selectedCurrency?.code})
                    </a>

                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuLink"
                    >
                      {currencyList?.map((currency, index) => {
                        return (
                          <li key={index}>
                            <a
                              className="dropdown-item"
                              value="action"
                              onClick={(e) => {
                                spinner
                                  ? e?.preventDefault()
                                  : handleCurrencyChange(currency);
                              }}
                            >
                              {currency?.label} ({currency?.code})
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                <div className="rs-product-left-box rs-product-left-box-second">
                  <h5>
                    <small>Incl. taxes</small>
                  </h5>
                  <h5>
                    {product?.paytype != "free"
                      ? product?.billingcycle?.charAt(0)?.toUpperCase() +
                        product?.billingcycle?.slice(1).toLowerCase()
                      : ""}{" "}
                    Total
                  </h5>
                  {
                    <div className="rs-product-left-price">
                      <h4>
                        {currency?.prefix}
                        {product?.order_summary?.product_price}{" "}
                        {currency?.suffix}
                      </h4>
                      {product?.order_summary?.strike_amount?.discountPer ? (
                        <h5>
                          {currency?.prefix}
                          {
                            product?.order_summary?.strike_amount?.discountPer
                          }{" "}
                          {currency?.suffix}
                        </h5>
                      ) : (
                        ""
                      )}
                    </div>
                  }
                  {product?.config_options?.length > 0 && (
                    <div className="rs-product-left-text-price">
                      <ul>
                        {product?.config_options?.map((option, index) => {
                          return (
                            <li key={`${index}billingcard`}>
                              {option?.sub_config_option?.map(
                                (subOption, subindex) => {
                                  if (option?.selectedValue == subOption?.id) {
                                    return (
                                      <div className="price-div" key={subindex}>
                                        <p
                                          style={{
                                            fontWeight: "400",
                                            maxWidth: "250px",
                                          }}
                                        >
                                          &gt;&gt; {option?.name}:{" "}
                                          {option?.optiontype == 4 &&
                                            `x ${option?.selectedQty}`}{" "}
                                          {subOption?.name}{" "}
                                        </p>
                                        <span>
                                          {currency?.prefix}
                                          {option?.optiontype == 4
                                            ? (
                                                option?.selectedQty *
                                                subOption?.price?.amount
                                              ).toFixed(2)
                                            : subOption?.price
                                            ? subOption?.price?.amount
                                            : "0.00"}{" "}
                                          {currency?.suffix}
                                        </span>
                                      </div>
                                    );
                                  }
                                }
                              )}
                            </li>
                          );
                        })}
                      </ul>
                      {(product?.order_summary?.total_setup_price > 0) |
                      (product?.order_summary?.tax?.amount > 0) ? (
                        <div className="rs-product-left-text-price">
                          <ul>
                            {product?.order_summary?.total_setup_price > 0 && (
                              <li>
                                <p>Setup Cost:</p>
                                <span>
                                  {currency?.prefix}
                                  {
                                    product?.order_summary?.total_setup_price
                                  }{" "}
                                  {currency?.suffix}
                                </span>
                              </li>
                            )}
                            {product?.order_summary?.tax?.amount > 0 && (
                              <li>
                                <p>Taxes</p>
                                <span>
                                  {currency?.prefix}
                                  {product?.order_summary?.tax?.amount}{" "}
                                  {currency?.suffix}
                                </span>
                              </li>
                            )}
                          </ul>
                        </div>
                      ) : (
                        ""
                      )}
                      <ul>
                        <li>
                          <div className="price-div">
                            <p
                              style={{
                                fontWeight: "400",
                                maxWidth: "250px",
                              }}
                            >
                              Subtotal:{" "}
                            </p>
                            <span>
                              {currency?.prefix}
                              {product?.order_summary?.sub_total}{" "}
                              {currency?.suffix}
                            </span>
                          </div>
                        </li>
                        {product?.order_summary?.tax?.total > 0 &&
                        product?.order_summary?.tax?.tax1 &&
                        product?.order_summary?.tax?.tax1?.rate * 100 > 0 ? (
                          <li>
                            <div className="price-div">
                              <p
                                style={{
                                  fontWeight: "400",
                                  maxWidth: "250px",
                                }}
                              >
                                {`${
                                  product?.order_summary?.tax?.tax1?.name
                                } @ ${(
                                  product?.order_summary?.tax?.tax1?.rate * 100
                                ).toFixed(2)}%`}{" "}
                              </p>
                              <span>
                                {currency?.prefix}
                                {product?.order_summary?.tax?.tax1?.tax}{" "}
                                {currency?.suffix}
                              </span>
                            </div>
                          </li>
                        ) : null}

                        {product?.order_summary?.tax?.total > 0 &&
                        product?.order_summary?.tax?.tax2 &&
                        product?.order_summary?.tax?.tax2?.rate * 100 > 0 ? (
                          <li>
                            <div className="price-div">
                              <p
                                style={{
                                  fontWeight: "400",
                                  maxWidth: "250px",
                                }}
                              >
                                {`${
                                  product?.order_summary?.tax?.tax2?.name
                                } @ ${(
                                  product?.order_summary?.tax?.tax2?.rate * 100
                                ).toFixed(2)}%`}{" "}
                              </p>
                              <span>
                                {currency?.prefix}
                                {product?.order_summary?.tax?.tax2?.tax}{" "}
                                {currency?.suffix}
                              </span>
                            </div>
                          </li>
                        ) : null}
                      </ul>
                    </div>
                  )}
                  <div className="rs-product-left-text-price">
                    <ul>
                      <li>
                        <p className="total-amount">Total due (incl. taxes)</p>
                        <span className="rs-product-left-price-color">
                          {currency?.prefix}
                          {product?.order_summary?.total} {currency?.suffix}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="rs-product-left-price-btn">
                    <a
                      style={{ color: "white", cursor: "pointer" }}
                      onClick={(e) => {
                        spinner ? e?.preventDefault() : handleAddToCart();
                      }}
                    >
                      {spinner ? (
                        <div className="ui active inline loader"></div>
                      ) : status == 1 ? (
                        "Continue >>"
                      ) : (
                        "Add to Cart"
                      )}
                    </a>
                  </div>
                   <ProgressBar loading={lineLoader}/>
                </div>
              </div>
            </div>
            <div className="rs-product-left-link mt-5">
              <Link
                onClick={(e) => {
                  spinner ? e.preventDefault() : null;
                }}
                to="/productlist"
              >
                <i className="feather icon-arrow-left" />
                Back to listing
              </Link>
            </div>
          </div>
        </div>
        <TextLoader loading={loading} loader={loader} />
      </section>
    </div>
  );
};
export default withRouter(React.memo(ProductConfig));
