import React, { useEffect, useMemo, useState } from "react";
import { Button, Input } from "reactstrap";
import PropTypes from "prop-types";
import { useParams, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import TableContainer from "../../components/Common/TableContainerCopy";
import Alert from "react-bootstrap/Alert";
import { getServiceName } from "../../store/actions";
import { debounce } from "lodash-es";
import {
  WidAppServer,
  WidIpAddress,
  WidLocation,
  WidStatus,
} from "../../components/Common/Widgets";
import info from "../../assets/images/Info-Button.svg";
import reset from "../../assets/images/reset.svg";
import Select from "react-select";
import { toast } from "react-toastify";
import TextLoader from "../../components/textLoader";
import { NullRouted, Actions, DDOSStatus } from "../Common/CommonCol";
import {  useDispatch } from "react-redux";
import ServerManageMenu from "../../components/CommonForBoth/TopbarDropdown/ServerManageMenu";
import { Col, Row, Modal } from "reactstrap";
import { reboot } from "./store/apiService";
import { getOs, getPartionmode } from "../../store/actions";
import {
  productDetails,
  deviceDetails,
  cancelServer,
  userRole,
  getDataTrafficDetails, 
  getBandwidthDetails,
  getOsInstallationInfo,
  cancelOsInstallation
} from "../Authentication/store/apiServices";
import ServiceNotFound from "../../components/Common/ServiceNotFound";
import { pushLatestStatus, setPageTitle } from "../../helpers/api_helper_rs";
import ServerOverview from "./ServerOverview";
import PermissionDenied from "../Authentication/PermissionDenied";
import ServerUsage from "./ServerUsage";
import { Tab } from "bootstrap";
import { customRegex } from "../../helpers/validation_helpers";
import { CONFIGURATIONS } from "../../constants/api/api_path";
import OsInstallationBar from "../../components/OsInstallationBar";
import { Progress } from "semantic-ui-react";

function DatatableTables() {
  const locationParams = useLocation()
  const product = locationParams?.state
  const [fullRes, setfullRes] = useState();
  // const [overView, setOverview] = useState();
  // const [productDetail, setproductDetail] = useState();
  const [deviceData, setdeviceData] = useState("");
  // const [Location, setLocation] = useState("");
  // const [os, setos] = useState("");
  const [loader, setLoader] = useState(true);
  const [loading, setLoading] = useState(true);
  const [rescuespinner, setrescuespinner] = useState(false);
  const [userRoleInfo, setUserRoleInfo] = useState();
  // const [serverDetail, setServerDetail] = useState({
  //   servername: "",
  //   serverId: "",
  // });
  const [cancellationType, setcancellationType] = useState(
    "End of Billing Period"
  );
  const [cancelReason, setcancelReason] = useState("");
  const [cancelRequestalert, setcancelRequestalert] = useState(false);
  // const [osReinstallPending, setOSReinstallPending] = useState(false);
  const [osReinstallPending, setOSReinstallPending] = useState({jobId: "", status: "", percentage: 0});
  const [rescuePending, setrescuePending] = useState(false);
  const [serverStatusSpinneer, setserverStatusSpinneer] = useState(true);
  const [RescueImageList, setRescueImageList] = useState([]);
  const [selectedRescueimage, setselectedRescueimage] = useState("");
  const [RescueSshKeys, setRescueSshKeys] = useState("");
  const [RescueScript, setRescueScript] = useState("");
  const [RescuePowerCycle, setRescuePowerCycle] = useState(false);
  const [RescueEmail, setRescueEmail] = useState(false);
  const [SshKeyError, setSshKeyError] = useState(false);
  const [ipv4Data, setIpv4Data] = useState("");
  const [ipv4Search, setipv4Search] = useState("");
  const [DomianName, setDomianName] = useState("");
  const [DomainNameError, setDomainNameError] = useState(false);
  const options3 = [
    { value: "Immediate", label: "Immediate" },
    { value: "End of Billing Period", label: "End of Billing Period" },
  ];
  const [modal_backdrop, setmodal_backdrop] = useState(false);
  const [modal_backdrop_cancel, setmodal_backdrop_cancel] = useState(false);
  const [ipv4Modal, setipv4Modal] = useState(false);
  const [UpdateIp, setUpdateIp] = useState("");
  const [activeTab, setActiveTab] = useState("Overview")
  // const [barChartInfo, setBarChartInfo] = useState()
  const params = useParams();
  // const parameters = useLocation()
  // const serviceType = parameters?.state
  const dispatch = useDispatch();
  const [barChartData, setBarChartData] = useState("") // set bar chart data 
  const [bandwidthChartData, setBanwidthChartData] = useState("") //set bandwidth chart data
  const [barchartLoader, setBarchartLoader] = useState("") // set bar chart loader 
  const [bandwidthLoader, setBandwidthLoader] = useState("") // set bandwidth chart loader 
  const [serviceDataSynced, setServiceDataSynced] = useState(false) 
  const [cancelInstallationModal, setCancelInstallationModal] = useState(false)
  const [showCancelButton, setShowCancelButton] = useState(false)
  const [cancelInstSpinner, setCancelSpinner] = useState(false)
  const handleTab = (tab) => {
    setActiveTab(tab)
  }

  useEffect(() => { 
    setPageTitle("Server Information")
    let role = userRole()
    setUserRoleInfo(role)
  },[])
  
  useEffect(async () => {
    // dispatch(getOs());
    dispatch(getPartionmode());
    // setServerDetail({ serverId: params?.id });
  }, []);
  
  useEffect(() => {
    if (params?.id) {
      if(product?.product){
        let serverinfo = product?.product
        handleDashboardDetails(serverinfo, "params")
      }else{
        dahboardDetails0()
      }
      getOsInstallationStatus(params?.id)
    }
  },[product])

  const dahboardDetails0 = async () => {
    try {
      var res = await productDetails(params?.id, 0);
      if (res) {
        let serverinfo = res?.data?.data
        handleDashboardDetails(serverinfo, "dahboardDetails0")
        serverinfo?.product?.servername == "Leaseweb" && rescueimagelist()
        // if(serverinfo?.os_pending_request === "ACTIVE"){
        //   setOSReinstallPending({serverId: serverinfo?.id, jobId: serverinfo?.os_job_uuid, status: serverinfo?.os_pending_request, percentage: 0});
        //   syncInstallationStatus(serverinfo?.id, serverinfo?.os_job_uuid)
        // }
      }
    } catch (error) {
      setLoader(false);
      setLoading(false);
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  
  const handleDashboardDetails = (serverinfo, action) => {
    serverinfo?.product?.cancel_request?.status == true? setcancelRequestalert(true) : setcancelRequestalert(false);
    setrescuePending(serverinfo?.rescue_pending_request);
    setfullRes(serverinfo);
    setLoader(false);
    setLoading(false);
    // serverinfo?.product?.servername == "Leaseweb" && rescueimagelist()
    let alldata = serverinfo?.product;
    // alldata?.configoptions?.configoption.map((ele) => {
    //   ele.option == "Location" && setLocation(ele.value);
    // });
    // alldata?.configoptions?.configoption.map((ele) => {
    //   ele.option == "OS Template" && setos(ele.value);
    // });
    // setproductDetail(serverinfo?.product);
    // setServerDetail({
    //   servername: serverinfo?.product?.servername,
    //   serverId: params?.id,
    // });
  }

  useEffect( async() => {
    if(params?.id && fullRes) {
      if(fullRes?.product?.status === "Active" && fullRes?.product_usage){
        !barChartData && await getBarChartData(params?.id)
        !bandwidthChartData && await getBandwidthChartData(params?.id)
      }
      if(!serviceDataSynced){
        fullRes?.server? await syncApi(false) : await syncApi(true)
      }
    }
  },[fullRes])


  const getBarChartData = async(id) => {
    setBarchartLoader(true)
    try {
      let param = new URLSearchParams({
        service_id: id,
        action: "dataTraffic",
      })
      let res = await getDataTrafficDetails(param)
      if (res) {
        setBarChartData(res?.data?.data?.data)
        setBarchartLoader(false)
      }
    } catch (error) {
      setBarchartLoader(false)
    }
  }

  const getBandwidthChartData = async(id) => {
    setBandwidthLoader(true)
    try {
      let param = new URLSearchParams({
        service_id: id,
        action: "bandwidth",
      })
    
      let res = await getBandwidthDetails(param)
      if (res) {
        setBanwidthChartData(res?.data?.data?.data)
        setBandwidthLoader(false)
      }
    } catch (error) {
      setBandwidthLoader(false)
    }
  } 

  const syncApi = async (forceSync) => {
    setServiceDataSynced(true)
    var today = new Date();
    let alltime = localStorage.getItem(CONFIGURATIONS?.SERVER_TIME);
    let firsttime = JSON.parse(alltime);
    if(!alltime){
      dashboardDetail1("alltime")
    } else if(forceSync === true){
      dashboardDetail1("forceSync")
    } else if(firsttime){
        let hour = today.getHours() - firsttime?.hour;
        let min = today.getMinutes() - firsttime?.minutes;
        if(hour == 0 && min > 1 && firsttime.date == today.toDateString()){
          dashboardDetail1("firsttime")
        }
    }
    return
    //remove if code working fine 8-9-23
    var today = new Date();
    // let alltime = localStorage.getItem("userservertime");
    // let firsttime = JSON.parse(alltime);
    
    if (alltime != undefined && alltime.length > 0) {
      let hour = today.getHours() - firsttime.hour;
      let min = today.getMinutes() - firsttime.minutes;
      if (hour == 0 && min > 1 && firsttime.date == today.toDateString() || forceSync) {
        try {
          let res = await productDetails(params?.id, 1);
          let serverinfo = res?.data?.data
          serverinfo?.product?.cancel_request?.status == true
          ? setcancelRequestalert(true)
          : setcancelRequestalert(false);
          setOSReinstallPending(serverinfo?.os_pending_request);
        setrescuePending(serverinfo?.rescue_pending_request);
        setfullRes(serverinfo);
          localStorage.setItem(
            "userservertime",
            JSON.stringify({
              date: today.toDateString(),
              hour: today.getHours(),
              minutes: today.getMinutes(),
            })
          );
        } catch (err) {}
      }
    } else {
      try {
        let res = await productDetails(params.id, 1);
        let serverinfo = res?.data?.data
        serverinfo?.product?.cancel_request?.status == true? setcancelRequestalert(true) : setcancelRequestalert(false);
        setOSReinstallPending(serverinfo?.os_pending_request);
        setrescuePending(serverinfo?.rescue_pending_request);
        setfullRes(serverinfo);
      } catch (err) {}
      localStorage.setItem(
        "userservertime",
        JSON.stringify({
          date: today.toDateString(),
          hour: today.getHours(),
          minutes: today.getMinutes(),
        })
      );
    }
  };

  const dashboardDetail1 = async(action) => {
    try {
      let res = await productDetails(params?.id, 1);
      let serverinfo = res?.data?.data
      if(serverinfo){
        handleDashboardDetails(serverinfo, "dahboardDetails1")
        setServiceDataSynced(false)
      }
      var today = new Date();
      localStorage.setItem(CONFIGURATIONS?.SERVER_TIME, JSON.stringify({
        date: today.toDateString(),
        hour: today.getHours(),
        minutes: today.getMinutes(),
      }))
    } catch (err) {

    }
  }

  const rescueimagelist = async () => {
    try {
      let param = new URLSearchParams({
        service_id: params.id,
        action: "rescueImages",
      });

      let res = await deviceDetails(param);
      if (res) {
        let arr = [];
        res?.data?.data?.data.map((ele) => {
          arr.push({ value: ele.id, label: ele.name });
        });
        setRescueImageList(arr);
      }
    } catch (err) {}
  };

  const hostnamevalid = (e) => {
    if (
      /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(e)
    ) {
      setDomainNameError(false);
    } else {
      setDomainNameError(true);
    }
  };

  const EasydcimServerStatus = async () => {
    let statusparam = new URLSearchParams({
      service_id: params?.id != undefined && params?.id,
      action: "device-detail",
    });
    setLoader(true);
    setLoading(true);
    let dDetail = await deviceDetails(statusparam);
    if (dDetail) {
      setLoader(false);
      setLoading(false);
      setdeviceData(dDetail?.data?.data);
      dDetail?.data?.data?.result?.device_status &&
        setserverStatusSpinneer(false);
    }
  };

  const UpdateIpApi = async () => {
    let statusparam = new URLSearchParams({
      action: "updateIP",
      service_id: params?.id != undefined && params?.id,
      ip: UpdateIp,
      reverseLookup: DomianName,
    });
    if (!DomianName) {
      statusparam.delete("reverseLookup");
    }
    try {
      setrescuespinner(true);
      let res = await deviceDetails(statusparam);
      if (res) {
        setrescuespinner(false);
        setipv4Modal(false);
        handleIPVmanageMent();
        setDomianName()
        toast.success(res?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      setrescuespinner(false);
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const getDropValue = (e) => {
    setcancellationType(e?.value);
  };

  const getReason = (e) => {
    setcancelReason(e?.target?.value);
  };

  const CancelServer = async () => {
    setmodal_backdrop_cancel(false);
    if (!cancelRequestalert) {
      toast.success("We are processing your cancellation request.",{
        position: toast.POSITION.TOP_RIGHT,
      })
      let param = new URLSearchParams({
        service_id: params?.id,
        type: cancellationType,
        reason: cancelReason,
      });
      try {
        // setLoader(true);
        setLoading(true);
        let res = await cancelServer(param);
        if (res) {
          setcancelRequestalert(true);
          // setLoader(false);
          setLoading(false);
          toast.success(res?.data?.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      } catch (err) {
        // setLoader(false);
        setLoading(false);
        toast.error(err?.response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  };

  const LaunchRescueMode = async () => {
    try {
      let param = new URLSearchParams({
        service_id: params?.id,
        action: "launchRescueMode",
        rescueImageId: selectedRescueimage?.value,
        powerCycle: RescuePowerCycle,
        sshKeys: RescueSshKeys,
        postInstallScript: RescueScript,
        rescueImageName: selectedRescueimage?.label,
        emailNotify: RescueEmail,
      });
      if (RescueScript.length < 1) {
        param.delete("postInstallScript");
      }
      if (RescueSshKeys.length < 1) {
        param.delete("sshKeys");
      }
      setrescuespinner(true);

      let res = await deviceDetails(param);
      if (res) {
        dahboardDetails0();
        setrescuespinner(false);

        setmodal_backdrop(false);
        setLoader(false);
        setLoading(false);
        toast.success(res?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (err) {
      setrescuespinner(false);

      toast.error(err?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleCustomerClicks = () => {};

  function tog_Ipv4Modal(ip) {
    setUpdateIp(ip);
    setipv4Modal(!ipv4Modal);
    removeBodyCss();
  }

  function tog_backdrop() {
    setmodal_backdrop(!modal_backdrop);
    removeBodyCss();
  }

  function tog_backdrop_cancel() {
    setmodal_backdrop_cancel(!modal_backdrop_cancel);
    removeBodyCss();
  }

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  const customStyles = {
    control: (base) => ({
      ...base,
      height: 50,
      minHeight: 50,
    }),
  };

  const columns = useMemo(
    () => [
      {
        Header: "IP Address",
        accessor: "ip",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Gateway",
        accessor: "gateway",
        disableGlobalFilter: true,
        disableSortBy: false, // if true the sortBy is disabled and remove sort icons
        filterable: true,
      },
      {
        Header: "Null Routed",
        accessor: "nullRouted",
        filterable: true.valueOf,
        Cell: (cellProps) => {
          return (
            <NullRouted
              {...cellProps}
              recall={handleIPVmanageMent}
              loader={setLoader}
              loading={setLoading}
            />
          );
        },
      },
      {
        Header: "Reverse DNS",
        accessor: "reverseLookup",
        disableGlobalFilter: true,
        disableSortBy: false, // if true the sortBy is disabled and remove sort icons
        filterable: true,
      },
      {
        Header: "DDOS Protection",
        accessor: "ddos",
        disableGlobalFilter: true,
        disableSortBy: false, // if true the sortBy is disabled and remove sort icons
        filterable: true,
        Cell: (cellProps) => {
          return <DDOSStatus {...cellProps} />;
        },
      },
      {
        Header: "Actions",
        accessor: "actions",
        filterable: true.valueOf,
        Cell: (cellProps) => {
          return <Actions {...cellProps} togModal={tog_Ipv4Modal} />;
        },
      },
    ],
    []
  );

  const handleReboot = () => {
    let config = {
      params: {
        command: "lw_ipmiReset",
        whmcs_hostingid: params.id,
      },
    };
    reboot(config)
      .then((res) => {})
      .catch((err) => {});
  };

  const handleIpv4Search = (e) => {
    setipv4Search(e.target.value);
  };

  const handleDebounceVal = debounce(async (search) => {
    setLoading(true)
    const ipRegex = customRegex?.ipAddress
   if(ipRegex.test(search)) {
    let param = new URLSearchParams({
      service_id: params?.id,
      action: "ips",
      ips: search,
    });
    try {
      // setLoader(true);
      // setLoading(true);
      let res = await deviceDetails(param);
      if (res) {
        setLoader(false);
        setLoading(false);
        let data = res?.data?.data;
        setIpv4Data(data); 
      }
    } catch (err) {
      setLoader(false);
      setLoading(false);
      setIpv4Data([]); 
    }
  } else {
    setLoading(false)
    toast.error("Please enter a valid IP Address", {
      position: toast.POSITION.TOP_RIGHT,
    });
  }
  }, 500);

  const handleIPVmanageMent = async (flag) => {
    try {
      let param = new URLSearchParams({
        service_id: params.id,
        action: "ips",
      });
      if (flag == "load") {
        setLoader(true);
        setLoading(true);
      }
      let res = await deviceDetails(param);
      if (res) {
        if (flag == "load") {
          setLoader(false);
          setLoading(false);
        }
        let data = res?.data?.data;
        setIpv4Data(data); 
      }
    } catch (error) {
      if (flag == "load") {
        setLoader(false);
        setLoading(false);
      }
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      // setinlineLoader(false)
    }
  };

  useEffect(() => {
  const interval = setInterval(() => {
    if(params?.id) {
      getOsInstallationStatus(params?.id)
    }
  },10000)

  return () => {
    clearInterval(interval)
  }
},[]);

  const getOsInstallationStatus = (serverId) =>{
    let storedArray = JSON.parse(localStorage.getItem(CONFIGURATIONS?.SERVER_INSTALL_ARRAY))
    if(storedArray){
      let installationStatus = storedArray.find(obj => obj?.serverId === serverId)
      if(installationStatus){
        setOSReinstallPending({
          jobId: installationStatus?.jobId,
          status: installationStatus?.status, 
          percentage: installationStatus?.percentage
        })
      }
    }
  }

  const cancelInstallation = async() => {
    setCancelInstallationModal(false)
    setLoading(true)
    setCancelSpinner(true)
    try{
      let data = new URLSearchParams({
        service_id: params?.id,
        job_id: osReinstallPending?.jobId
      })
      let res = await cancelOsInstallation(data)
      let info = res?.data?.data
      if(info){
        let myObject = {serverId: info?.service_id, jobId: info?.uuid, status: info?.status, percentage: info?.percentage || existingObject?.percentage};
        pushLatestStatus(myObject)
        toast.success("Operating system installation cancelled.", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setLoading(false)
        setCancelSpinner(false)
        setOSReinstallPending({jobId: osReinstallPending?.jobId, status: info?.status, percentage: info?.percentage || existingObject?.percentage})
      }
    }catch(error){
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false)
      setCancelSpinner(false)
    }
  }

  const handleRemoveNotification = async() => {
    const storedArray = JSON.parse(localStorage.getItem(CONFIGURATIONS?.SERVER_INSTALL_ARRAY))
    const indexToRemove = storedArray?.findIndex(obj => obj?.serverId === params?.id)
    if(indexToRemove != -1){
      storedArray.splice(indexToRemove, 1);
      localStorage.setItem(CONFIGURATIONS?.SERVER_INSTALL_ARRAY, JSON.stringify(storedArray));
      setOSReinstallPending({jobId: "", status: "", percentage: 0})
    }
  }

  return (
    <React.Fragment>
      <div
        className={
          loader
            ? "page-content  server-management overlayerloader"
            : "page-content  server-management"
        }
      >
        <div className="container-fluid">
          {cancelRequestalert && (
            <Alert key="cancel-success" variant="success">
              <i className="uil uil-info-circle"></i> 
                There is a pending cancellation request for this service.
            </Alert>
          )}
          {osReinstallPending?.status === "ACTIVE" && (
            <Alert key="os-success" variant="success">
              <i className="uil uil-info-circle"></i>{" "}
                The installation of the operating system is currently in progress. Please be patient, as it may take a few minutes to complete.
                <div className="installation-bar">
                  <OsInstallationBar percentage={osReinstallPending?.percentage || 0}/>
                  <Button disabled={cancelInstSpinner} onClick={() =>setCancelInstallationModal(true)} >
                    {cancelInstSpinner? <div className="ui active inline loader"></div> : "Cancel Installation"}
                  </Button>
                </div>
            </Alert>
          )}
          {osReinstallPending?.status === "CANCELED" && (
            <Alert key="os-success" variant="success">
              <i className="uil uil-info-circle"></i>{" "}
                The installation of the operating system is Canceled.
                <div className="installation-bar">
                  <OsInstallationBar percentage={osReinstallPending?.percentage || 0}/>
                  {/* <div className="right-content text-end"> */}
                    <button
                      type="button"
                      className="btn-close buttoncustom"
                      onClick={handleRemoveNotification}
                      aria-label="Close"
                    ></button>
                  {/* </div> */}
                  {/* <Button disabled={cancelInstSpinner} onClick={() =>setCancelInstallationModal(true)} >
                    {cancelInstSpinner? <div className="ui active inline loader"></div> : "Cancel Installation"}
                  </Button> */}
                </div>
            </Alert>
          )} 
          {osReinstallPending?.status === "FAILED" && (
            <Alert key="os-success" variant="success">
              <i className="uil uil-info-circle"></i>{" "}
                The installation of the operating system is Failed.
                <div className="installation-bar">
                  <OsInstallationBar percentage={osReinstallPending?.percentage || 0}/>
                  {/* <div className="right-content text-end"> */}
                    <button
                      type="button"
                      className="btn-close buttoncustom"
                      onClick={handleRemoveNotification}
                      aria-label="Close"
                    ></button>
                  {/* </div> */}
                  {/* <Button disabled={cancelInstSpinner} onClick={() =>setCancelInstallationModal(true)} >
                    {cancelInstSpinner? <div className="ui active inline loader"></div> : "Cancel Installation"}
                  </Button> */}
                </div>
            </Alert>
          )} 
          {rescuePending && (
            <Alert key="rescue-success" variant="success">
              <i className="uil uil-info-circle"></i>
              {" "}The server is currently in the process of installing a rescue image. Please be patient, as it may take a few minutes to complete.
            </Alert>
          )}

          {(!loader && fullRes?.product?.servername != "EasyDCIM" && !fullRes?.server) &&(
            <Alert key="rescue-success" variant="success">
            <i className="uil uil-info-circle"></i>{" "}
              Configuring your new server details may require a few minutes. Thank you for your patience.
          </Alert>
          )}

          <div className="server_info">
            <h5 className="info_heding">Server Information: {fullRes?.product?.name}</h5>
            <div className="row">
              <div className="col">
                <WidAppServer
                  model={fullRes?.server?.hostname}
                ></WidAppServer>
              </div>
              <div className="col">
                <WidIpAddress
                  ipAddress={fullRes?.product?.dedicatedip}
                ></WidIpAddress>
              </div>
              <div className="col">
                <WidLocation location={fullRes?.product?.desformat?.Location}></WidLocation>
              </div>
              <div className="col">
                <WidStatus
                  status={fullRes?.product?.status}
                ></WidStatus>
              </div>
            </div>
          </div>
          <div className="theme_tab">
            <div className="tab-header">
              <div className="row">
                <div className="col-md-10">
                  <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        // disabled={loading}
                        className={activeTab === "Overview"? "nav-link active buttoncustom" : "nav-link buttoncustom"}
                        id="home-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#Overview"
                        type="button"
                        role="tab"
                        aria-controls="Overview"
                        aria-selected="true"
                        onClick={() => handleTab("Overview")}
                      >
                        Overview
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        // disabled={loading}
                        className={activeTab === "Usage"? "nav-link active buttoncustom" : "nav-link buttoncustom"}
                        id="profile-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#Usage"
                        type="button"
                        role="tab"
                        aria-controls="Usage"
                        aria-selected="false"
                        onClick={() => handleTab("Usage")}
                        // onClick={rendergraph}
                      >
                        Usage
                      </button>
                    </li>
                   {fullRes?.product?.servername != "EasyDCIM" && <li className="nav-item" role="presentation">
                      <button
                        // disabled={loading}
                        className={activeTab === "Management"? "nav-link active buttoncustom" : "nav-link buttoncustom"}
                        id="Management-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#Management"
                        type="button"
                        role="tab"
                        aria-controls="Management"
                        aria-selected="false"
                        onClick={() =>
                          {handleTab("Management"), (fullRes?.product?.status == "Active" && fullRes?.IPv4Management) &&
                          handleIPVmanageMent("load")}
                        }
                      >
                        IPv4 Management
                      </button>
                    </li>}
                  </ul>
                </div>
                <div className="col-md-2 manage-btn-cstm">
                  <ServerManageMenu
                    toggleModal={tog_backdrop}
                    toggleModalCancel={
                      cancelRequestalert ? "no" : tog_backdrop_cancel
                    }
                    ospending={osReinstallPending?.status === "ACTIVE"? true : false}
                    rescuePending={rescuePending}
                    reboot={handleReboot}
                    // status={fullRes?.product?.status}
                    easyServerStatus={EasydcimServerStatus}
                    // serverDetail={fullRes?.product?.servername}
                    // permissions={fullRes}
                    fullRes={fullRes}
                    setLoading={setLoading}
                  ></ServerManageMenu>
                </div>
              </div>
            </div>
            <div className="tab-content" id="myTabContent">
            {/* //server overview start*/}
            {activeTab === "Overview" && 
              <div
                className="tab-pane fade show active"
                id="Overview"
                role="tabpanel"
                aria-labelledby="Overview-tab"
              >
                {fullRes?.product_overview? <ServerOverview fullRes={fullRes}/> : (userRoleInfo != "client" && fullRes?.product_overview != undefined) && <PermissionDenied />}
              </div>
            }
             {/* server overview end */}

            {/* server usage start */}
            <div className="tab_content bg-transparent manage-tab">
            {activeTab === "Usage" &&
              <div
                className="tab-pane fade show active"
                id="Usage"
                role="tabpanel"
                aria-labelledby="Usage-tab"
              >
                {(fullRes?.product?.status != "Active" && fullRes?.product_usage) ? <ServiceNotFound />  : fullRes?.product_usage? <ServerUsage 
                  barChartData={barChartData} 
                  bandwidthChartData={bandwidthChartData} 
                  barchartLoader={barchartLoader}
                  bandwidthLoader={bandwidthLoader}
                  product={fullRes?.product}
                /> : (userRoleInfo != "client" && fullRes?.product_usage != undefined) && <PermissionDenied />} 
              </div>
            }
            {/* server usage end */}
            </div>
            </div>
            <div className="tab-content" id="myTabContent">
                <div className="tab_content bg-transparent manage-tab">
                  {activeTab === "Management"? (fullRes?.product?.status != "Active" && fullRes?.IPv4Management) ? (
                    <ServiceNotFound />
                  ) : fullRes?.IPv4Management? (
                    <>
                      <Row className="server-search">
                        <Col md="10">
                          <div className="app-search d-none d-lg-block p-0 search-v1">
                            <div className="position-relative">
                              <input
                                disabled={loading}
                                type="text"
                                className="form-control"
                                placeholder="Filter for IP addresses"
                                value={ipv4Search}
                                onChange={(e) => handleIpv4Search(e)}
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    ipv4Search
                                      ? handleDebounceVal(ipv4Search)
                                      : handleIPVmanageMent("load");
                                  }
                                }}
                              />
                              <span
                                className="uil-search"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  ipv4Search
                                    ? handleDebounceVal(ipv4Search)
                                    : handleIPVmanageMent("load")
                                }
                              ></span>
                            </div>
                          </div>
                        </Col>
                        <Col md="2 text-end pl-0">
                          <a
                            style={{ cursor: "pointer" }}
                            className="btn-reset"
                            onClick={() => {
                              if (ipv4Search) {
                                setipv4Search("");
                                handleDebounceVal("");
                              }
                            }}
                          >
                            Reset <img src={reset} alt="" />
                          </a>
                        </Col>
                      </Row>
                      <div className="table_v1 table-management">
                        <TableContainer
                          tableClassName="product-table table-shadow"
                          columns={columns}
                          data={ipv4Data?.data ? ipv4Data?.data : []}
                          isGlobalFilter={true}
                          isAddCustomer={true}
                          isAddTableBorderStrap={true}
                          handleCustomerClicks={handleCustomerClicks}
                          getTablePropsC={() => ({
                            className: "product-table ",
                          })}
                        />
                      </div>
                    </>
                  ): 
                  (userRoleInfo != "client" && fullRes?.IPv4Management != undefined) && <PermissionDenied />
                  : null}
                  {/* allready commented </CardBody>
                  </Card> */}
               {/* </div> */}
                {/* : <PermissionDenied />} */}
              </div> 
              {/* sever management end */}
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modal_backdrop}
        toggle={() => {
          tog_backdrop();
        }}
        backdrop={"static"}
        scrollable={true}
        id="staticBackdrop"
        className="modal_v1"
      >
        <div className="modal-header">
          <Row className="w-100">
            <Col xs="10">
              <h5 className="modal-title" id="staticBackdropLabel">
                Rescue Mode
              </h5>
            </Col>
            <Col xs="2">
              <div className="right-content text-end">
                <button
                  type="button"
                  className="btn-close buttoncustom"
                  onClick={(e) => {
                    rescuespinner? e?.preventDefault() : setmodal_backdrop(false);
                  }}
                  aria-label="Close"
                ></button>
              </div>
            </Col>
          </Row>
        </div>
        <div className="modal-body">
          <p
            className="m-0 mb-4 text-blue font-semibold"
            style={{
              border: "1px solid #e7b4da",
              display: "flex",
              padding: "8px",
              alignItems: "baseline",
            }}
          >
            <img
              src={info}
              width={15}
              height={15}
              style={{ marginRight: "5px", paddingTop: "2px" }}
            ></img>
            <span>
              Performing rescue mode will boot your dedicated server in this
              environment,recovering (if possible) from any problems.
            </span>
          </p>
          {RescueImageList && (
            <div className="form-group select-v1">
              <label className="text-blue font-semibold">Rescue Image</label>
              <Select
                isDisabled={rescuespinner}
                classNamePrefix="select-v1"
                defaultValue={selectedRescueimage}
                options={RescueImageList}
                styles={customStyles}
                onChange={(value) => setselectedRescueimage(value)}
              />
            </div>
          )}
          <div className="form-group select-v1">
            <label className="text-blue font-semibold d-block">SSH Keys</label>
            <textarea
              disabled={rescuespinner}
              className="textarea_v1"
              placeholder="ssh-rsa... "
              value={RescueSshKeys}
              onChange={(e) => {
                setRescueSshKeys(e.target.value);
                if (!e.target.value) {
                  setSshKeyError(false);
                } else {
                  const regex = customRegex?.sshKey
                  const isValid = regex.test(e.target.value);
                  setSshKeyError(!isValid);
                }
              }}
            ></textarea>
            <p style={{ color: "red" }} className="font-normal text-color">
              {SshKeyError && "Please provide valid SSH Key."}
            </p>
            <p className="font-normal text-color">
              You may add your public SSH key here.
            </p>
          </div>

          <div className="form-group select-v1">
            <label className="text-blue font-semibold">
              Custom Startup Script
            </label>
            <textarea
              disabled={rescuespinner}
              className="textarea_v1"
              placeholder="#!/usr/bin/env bash "
              value={RescueScript}
              onChange={(e) => setRescueScript(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group select-v1 mb-0">
            <input
              type="checkbox"
              className="form-check-input text-color font-16 font-normal rescue"
              id="customControlInline1"
              checked={RescuePowerCycle}
              onChange={() => {}}
              disabled={rescuespinner}
              onClick={() => setRescuePowerCycle(!RescuePowerCycle)}
            />
            <label className="form-check-label" htmlFor="customControlInline1">
              Power cycle your dedicated server
            </label>
          </div>

          <div className="form-group select-v1">
            <input
              type="checkbox"
              className="form-check-input text-color font-16 font-normal rescue"
              value={RescueEmail}
              id="customControlInline2"
              disabled={rescuespinner}
              onClick={() => setRescueEmail(!RescueEmail)}
            />
            <label className="form-check-label" htmlFor="customControlInline2">
              Receive email notification
            </label>
          </div>

          <div className="btn-group rescuesubmit">
            <button
              className="btn btn-primary btn-modal waves-effect waves-light d-flex justify-content-center align-items-center buttoncustom "
              type="submit"
              onClick={(e) => {
                (selectedRescueimage &&
                !SshKeyError &&
                !rescuespinner) ?
                LaunchRescueMode() : e?.preventDefault()
              }}
              style={{
                cursor:
                  rescuespinner || !selectedRescueimage || SshKeyError
                    ? "not-allowed"
                    : "pointer",
              }}
              // disabled={rescuespinner}
            >
              {rescuespinner ? (
                <div className="ui active inline loader"></div>
              ) : (
                "Launch"
              )}
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={modal_backdrop_cancel}
        toggle={() => {
          tog_backdrop_cancel();
        }}
        backdrop={"static"}
        scrollable={true}
        id="staticBackdrop_cancel"
        className="modal_v1"
      >
        <div className="modal-header">
          <Row className="w-100">
            <Col xs="10">
              <h5 className="modal-title" id="staticBackdropLabel">
                Cancel Server
              </h5>
            </Col>
            <Col xs="2">
              <div className="right-content text-end">
                <button
                  type="button"
                  className="btn-close buttoncustom"
                  onClick={() => {
                    setmodal_backdrop_cancel(false);
                  }}
                  aria-label="Close"
                ></button>
              </div>
            </Col>
          </Row>
        </div>
        <div className="modal-body">
          <p className="m-0 mb-4 text-blue font-semibold">
            Requesting Cancellation for
          </p>
          <div className="block_content mt-20 mb-30">
            <p className="text-color-v1 font-small  font-semibold">
              {fullRes?.product?.translated_name}
            </p>
          </div>
          <div className="form-group select-v1">
            <label className="text-blue font-semibold d-block">
              Briefly describe your reason for cancellation
            </label>
            <textarea
              className="textarea_v1"
              placeholder="Reason for cancellation is..... "
              onChange={(e) => getReason(e)}
            ></textarea>
          </div>
          <div className="form-group select-v1">
            <label className="text-blue font-semibold">
              Cancellation Type:
            </label>
            <Select
              classNamePrefix="select-v1"
              defaultValue={options3[1]}
              options={options3}
              styles={customStyles}
              onChange={getDropValue}
            />
          </div>
          <div className="footer-btn">
            <Row className="w-100">
              <Col md="6">
                <button
                  type="button"
                  className="btn btn-border waves-effect waves-light text-blue font-16 font-normal w-100 buttoncustom"
                  onClick={() => {
                    setmodal_backdrop_cancel(false);
                  }}
                >
                  Close
                </button>
              </Col>
              <Col md="6">
                <button
                  className="btn btn-danger waves-effect waves-light btn-remove text-white w-100 buttoncustom"
                  onClick={CancelServer}
                >
                  Request Cancellation
                </button>
              </Col>
            </Row>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={ipv4Modal}
        toggle={() => {
          tog_Ipv4Modal();
        }}
        backdrop={"static"}
        scrollable={false}
        id="staticBackdrop"
        className="modal_v1"
        size="lg"
      >
        <div className="modal-header">
          <Row className="w-100">
            <Col xs="10">
              <h5 className="modal-title" id="staticBackdropLabel">
                Update IP ({UpdateIp})
              </h5>
            </Col>
            <Col xs="2">
              <div className="right-content text-end">
                <button
                  type="button"
                  className="btn-close buttoncustom"
                  onClick={() => { setipv4Modal(false), setDomianName("") }}
                  aria-label="Close"
                ></button>
              </div>
            </Col>
          </Row>
        </div>
        <div className="modal-body">
          <div className="form-group select-v1">
            <label className="text-blue font-semibold d-block">
              Valid domain Name
            </label>
            <Input
              className="form-control bg-input"
              placeholder="hosted-by. redswitches.com "
              value={DomianName}
              disabled={rescuespinner}
              onChange={(e) => {
                setDomianName(e.target.value);
                !e.target.value
                  ? setDomainNameError(false)
                  : hostnamevalid(e.target.value);
              }}
            ></Input>
            <p
              style={{ color: "red" }}
              className="font-16 font-normal text-color mt-2"
            >
              {DomainNameError &&
                "Please provide valid domain name e.g hosted.redswitches.com"}
            </p>
          </div>
          <div className="btn-group rescuesubmit">
            <button
              className="btn btn-primary btn-modal waves-effect waves-light d-flex justify-content-center align-items-center buttoncustom "
              style={{
                cursor:
                  !DomainNameError && DomianName ? "pointer" : "not-allowed",
              }}
              type="submit"
              disabled={rescuespinner}
              onClick={(e) => {!DomainNameError && DomianName? UpdateIpApi(): e?.preventDefault}}
            >
              {rescuespinner ? (
                <div className="ui active inline loader"></div>
              ) : (
                "Launch"
              )}{" "}
            </button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={cancelInstallationModal} centered={true} modalClassName="manage-modal">
        <div className="modal-header">
          <Row className="w-100">
            <Col xs="11">
              <h3 className="modal-title mt-0">Cancel Installation</h3>
            </Col>
            <Col xs="1">
              <button
                type="button"
                onClick={() => {
                  setCancelInstallationModal(false)
                }}
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">
                  {" "}
                </span>
              </button>
            </Col>
          </Row>
        </div>
        <div className="modal-body p-0 two-factor verify">
          <h6 className="font-bold text-blue text-center">
            Are you sure you want to cancel the operating system installation?
          </h6>
          <div className="factor-disable-btn">
            <button
              className="btn btn-danger waves-effect waves-light btn-green"
              type="button"
              onClick={() => cancelInstallation()}
              data-dismiss="modal"
              aria-label="Close"
            >
              Yes
            </button>
            <button
              className="btn btn-danger waves-effect waves-light btn-disable"
              type="button"
              onClick={() => {
                setCancelInstallationModal(false)
              }}
              data-dismiss="modal"
              aria-label="Close"
            >
              No
            </button>
          </div>
        </div>
      </Modal>
      <TextLoader loading={loading} loader={loader}/>.
    </React.Fragment>
  );
}
DatatableTables.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default React.memo(DatatableTables);
