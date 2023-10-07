import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import TableContainer from "../../components/Common/TableContainerCopy";
import {
  WidServer,
  WidInvoice,
  WidTicket,
  WidBalance,
} from "../../components/Common/Widgets";
import {
  CustomerId,
  Location,
  Pricing,
  NextDate,
  IpAddress,
  TableStatus,
  Action,
  OSicons,
} from "./Component/ServiceCustomerCol";
//redux
import { useSelector, useDispatch } from "react-redux";
import { Col, Row } from "reactstrap";
import { loginData, productDetails, storeUserData, userRole } from "../Authentication/store/apiServices";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getWidgetsDetail } from "../../pages/Authentication/store/apiServices";
import TextLoader from "../../components/textLoader";
import PermissionDenied from "../Authentication/PermissionDenied";
import statusfilter from "../../assets/images/statusfilter.png";
import { sessionExpired, setPageTitle} from "../../helpers/api_helper_rs"
import { isServicesFetched } from "../../store/services/actions";
import Alert from "react-bootstrap/Alert";
import { CONFIGURATIONS } from "../../constants/api/api_path";
import { isSyncServicesFetched } from "../../store/syncedServices/action";
import { isWidgetsFetched } from "../../store/widgets/action";
import { fetcheOsList } from "../../store/osInstallList/action";
function DatatableTables() {
  const dispatch = useDispatch();
  const cardsData = useSelector(state => state?.savedCards)
  const servicesList = useSelector(state => state?.services)
  const reduxCall = useSelector(state=> state?.services?.call)
  const syncStatus = useSelector(state => state?.services?.syncStatus) //sync status of new service
  const widgets = useSelector(state => state?.Widgets)
  const [cards, setCards] = useState();
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState("")
  // const [tableLoader, setTableLoader] = useState(true);
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState();
  const [cardsActive, setCardsActive] = useState();
  const [sessioncheck, setsessioncheck] = useState(false);
  const [role, setRole] = useState();
  const [permission, setPermission] = useState(true)
  const [provisioningServiceArr, setProvisioningServiceArr] = useState([])
  const [fetchedServices, setFetchedServices] = useState([])
  const allServiceSyncStatus = useSelector(state => state?.services?.allServiceSync) //sync status of all services

  useEffect(() => {
    let title = setPageTitle("Dashboard")
    setCardsActive(title)
    let roleinfo = userRole();
    roleinfo === "client"? setPermission(true) : ""
    setRole(roleinfo);
  }, []);

  useEffect(() => {
    //call dashboard0 after new service synced for listing
    if(syncStatus === 0){
      dashBoardCall0(0, true)
    }else if(syncStatus === true){
      // setLoading(true)
      let loaderStatus = ""
      servicesList?.services? loaderStatus = false : loaderStatus = true
      // dashBoardCall0(0, loaderStatus)
    }else if(!servicesList?.services){
      // dashBoardCall0(0, true)
    }

    // if(syncStatus !== false || syncStatus === true){
    //   dashBoardCall0(0) //send service welcome mail.
    // }
  },[syncStatus])

  useEffect(() => {
    if(allServiceSyncStatus){
    //call dashboard0 after all services synced for listing
      // dashBoardCall0(0, false)
    }
  }, [allServiceSyncStatus])

  // useEffect(() => {
  //   if(servicesList){
  //     setTotalCount(servicesList?.services?.length)
  //     setProducts(servicesList?.services)      
  //   }
  // }, [servicesList, provisioningServiceArr])

  useEffect(() => {
    setCards(widgets)
  },[widgets])

  // useEffect(() => {
  //   let serviceIdArr = localStorage.getItem(CONFIGURATIONS?.NEWSERVICEID)
  //   if(serviceIdArr){
  //     serviceIdArr = serviceIdArr.split(",")
  //       if(servicesList?.services && provisioningServiceArr?.length != serviceIdArr?.length){
  //         servicesList?.services?.map((service) => {
  //           if(service?.status === "Active" && serviceIdArr.includes(service?.wid)){
  //             setProvisioningServiceArr((prevArray) => [...prevArray, service?.wid])
  //             handleProvisioningService(service?.id, service?.wid)
  //           }
  //         })
  //       }
  //   }
  // },[servicesList])

  // const handleProvisioningService = async(id, wid) => {
  //   try{
  //     let res = await productDetails(id, 1)
  //     if(res){
  //       setFetchedServices((...prevArray) => [...prevArray, res?.data?.data])
  //       let serviceIdArr = localStorage.getItem(CONFIGURATIONS?.NEWSERVICEID)
  //       if(serviceIdArr){
  //         let storedValues = serviceIdArr.split(",")
  //         let indexToRemove = storedValues.indexOf(wid)
  //         if(indexToRemove !== -1){
  //           storedValues.splice(indexToRemove,1)
  //           serviceIdArr = storedValues.join(",")
  //           localStorage.setItem(CONFIGURATIONS?.NEWSERVICEID, serviceIdArr)
  //           setProvisioningServiceArr((prevArray) => prevArray.filter(value => value !== wid))
  //         }
  //       }
  //     }
  //   }catch(error){
  //   }
  // } 

  //  useEffect(async() => {
  //    if(fetchedServices?.length > 0){
  //     dispatch(isSyncServicesFetched(fetchedServices))
  //   }
  //  },[fetchedServices?.length])

  // useEffect(() => {
  //   let call  = JSON.parse(localStorage.getItem("usertime"))
  //   if(cardsData?.cardsUpdated && call?.call != 1 && reduxCall !=1){
  //     dashBoardCall1(1)
  //   }
  // },[reduxCall, cardsData?.cardsUpdated])

  const handleCustomerClicks = () => {};
  
  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "image",
        disableFilters: true,
        filterable: false,
        Cell: (cellProps) => {
          return <OSicons {...cellProps} />;
        },
      },
      {
        Header: "Product/Service",
        accessor: "name",
        disableGlobalFilter: true,
        disableSortBy: false, // if true the sortBy is disabled and remove sort icons
        filterable: true,
        Cell: (cellProps) => {
          return <CustomerId {...cellProps} />;
        },
      },
      {
        Header: "IP Address",
        accessor: "dedicatedip",
        filterable: true,
        Cell: (cellProps) => {
          return <IpAddress {...cellProps} />;
        },
      },
      {
        Header: "Location",
        accessor: "location",
        filterable: true,
        Cell: (cellProps) => {
          return <Location {...cellProps} />;
        },
      },
      {
        Header: "Pricing",
        accessor: "pricing",
        filterable: true,
        Cell: (cellProps) => {
          return <Pricing {...cellProps} cur={cards} />;
        },
      },

      {
        Header: "Next Due",
        accessor: "nextduedate",
        filterable: true,
        Cell: (cellProps) => {
          return <NextDate {...cellProps} />;
        },
      },
      {
        Header: (
          <span>
            Status<img src={statusfilter}></img>
          </span>
        ),
        accessor: "contractStatus",
        filterable: true,
        disableSortBy: true,
        Cell: (cellProps) => {
          return <TableStatus {...cellProps} />;
        },
      },
      {
        accessor: "action",
        filterable: false,
        disableSortBy: true,
        Cell: (cellProps) => {
          return <Action {...cellProps} />;
        },
      },
    ],
    []
  );

  // get dashboard data using call 0
  const dashBoardCall0 = async(call, loader) => {
    return
    try {
      loader && setLoader(true);
      loader && setLoading(true);
      let res = await getWidgetsDetail(0);
      if (res) {
        let info = res?.data?.data
        let data = loginData()
        data.credit=info?.current_balance
        storeUserData(data)
        setCards(info)
        dispatch(isServicesFetched(info?.product_listing?.products, call))
        dispatch(isWidgetsFetched(info))
        dispatch(fetcheOsList())
        setPermission(info?.product_permission)
        setLoader(false);
        setLoading(false);
        var today = new Date();
        if (call == "first") {
          localStorage.setItem(
            "usertime",
            JSON.stringify({
              date: today.toDateString(),
              hour: today.getHours(),
              minutes: today.getMinutes(),
              call: 0
            })
          );
        }
      }
    } catch (err) {
        setLoader(false);
        setLoading(false);
      if (err?.response?.data?.status_code != 401) {
        toast.error(err?.response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      if (err?.response?.data?.status_code === "401") {
        sessionExpired(err?.response?.data?.message)
      }
    }
  }

  //get dashboard data using call 1
  const dashBoardCall1 = async(call) => {
    return
    try {
      let res = await getWidgetsDetail(call);
      if (res) {
        let productData = res?.data?.data
        setTotalCount(productData?.product_listing?.total_records);
        setProducts(productData?.product_listing?.products);
        let list = productData?.product_listing?.products?.map((item) => ({
          id: item.id,
          name: item.name,
        }));
        let data = loginData()
        data.credit=productData?.current_balance
        storeUserData(data)
        dispatch(isServicesFetched(productData?.product_listing?.products, call))
        dispatch(isWidgetsFetched(productData))
        setCards(productData);
        setPermission(productData?.product_permission)
        var today = new Date();
          localStorage.setItem(
            "usertime",
            JSON.stringify({
              date: today.toDateString(),
              hour: today.getHours(),
              minutes: today.getMinutes(),
              call: 1
            })
          );
      }
    } catch (err) {
      if (err?.response?.data?.status_code != 401) {
        toast.error(err?.response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      if (err?.response?.data?.status_code == 401) {
        setsessioncheck(true);
      }
    }
  }

  return (
    <React.Fragment>
      <div
        className={
          loader
            ? "page-content dashboard overlayerloader"
            : "page-content dashboard"
        }
      >
        <div className="container-fluid">
        {syncStatus === false &&<Alert key="cancel-success" variant="success">
          <i className="uil uil-info-circle"></i> 
          {" "}Thanks for purchasing new server. We are configuring your new server and will be available soon here.
        </Alert>}
          {cardsActive == "Dashboard" && (
            <div className="server_info">
              <div className="row">
                {/* <div className="col"> */}
                  {/* <Link to="#">
                    <WidServer servers={cards?.servers}></WidServer>
                  </Link> */}
                {/* </div> */}
                {/* <div className="col"> */}
                  {/* <Link to="/invoice">
                    <WidInvoice invoices={cards?.invoices}></WidInvoice>
                  </Link> */}
                {/* </div> */}
                <div className="col">
                  <Link to="/support">
                    <WidTicket tickets={cards?.tickets}></WidTicket>
                  </Link>
                  
                </div>                
                  <div className="col">
                    <WidBalance
                      balance={cards?.current_balance}
                      currency={cards?.currency}
                    ></WidBalance>
                  </div>
              </div>
            </div>
          )}
          <Row>
            <Col xs="12">
              <h1>Work in Progress</h1>
              {/* {permission ? (
                <div className="table_v1">
                  <TableContainer
                    tableClassName="product-table table-shadow"
                    columns={columns}
                    data={products || []}
                    isGlobalFilter={true}
                    isAddCustomer={true}
                    isAddTableBorderStrap={true}
                    totalCount={totalCount}
                    // tableLoader={tableLoader}
                    handleCustomerClicks={handleCustomerClicks}
                    getTablePropsC={() => ({
                      className: "product-table ",
                    })}
                  />
                </div>
              ) : (
                !sessioncheck && !loader && <PermissionDenied />
              )} */}
            </Col>
          </Row>
        </div>
      </div>
      <TextLoader loader={loader} loading={loading}/>
    </React.Fragment>
  );
}
DatatableTables.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default DatatableTables;
