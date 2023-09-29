import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "reactstrap";
import Status from "../../../components/CommonForBoth/TopbarDropdown/Status";

import pdf from "../../../assets/images/pdf.svg";
import calender from "../../../assets/images/calender.svg";
import time from "../../../assets/images/time-note.svg";
import eye from "../../../assets/images/eye.svg";
import rightarrow from "../../../assets/images/rightarrow.png";
import image1 from "../../../assets/images/operatingystem/image1.PNG";
import image2 from "../../../assets/images/operatingystem/image2.PNG";

import del from "../../../assets/images/table-delete.svg";
import edit from "../../../assets/images/table-edit.svg";
import ToogleSwitch from "../../../components/Common/ToogleSwitch";
import { loginData } from "../../Authentication/store/apiServices";
import amsterdam from "../../../assets/images/amsterdam.png";
import frankfurt from "../../../assets/images/frankfurt.png";
import america from "../../../assets/images/usa.png";
import london from "../../../assets/images/london.png";
import singapore from "../../../assets/images/singapore.png";
import hongkong from "../../../assets/images/hongkong.png";
import sydney from "../../../assets/images/sydney.png";
import Mumbai from "../../../assets/images/india.png";
import { FormatDate } from "../../../helpers/api_helper_rs";
import { toast } from "react-toastify";
import { CONFIGURATIONS } from "../../../constants/api/api_path";
import { useSelector } from "react-redux";

  /**
   * step4
   * here we are fetching stored array and hit the function to get status or percentage of operating system installation. 
   */
  const getStoredServersList = (cellId) => {
    const storedArray = JSON.parse(localStorage.getItem(CONFIGURATIONS?.SERVER_INSTALL_ARRAY))
    const service = storedArray?.find(obj => obj?.serverId === cellId?.id)
    if(service && service?.event == "module_create"){
      // let status = `service${service?.status}`
      let serviceStatus  = {status: `service${service?.status}`, percentage: service?.percentage}
      return serviceStatus
    }
  }

const getServiceStatus = (service) => {
  /**
   * We store the WID of a new service in local storage.
   * If a user adds a new service with an active status, but the data hasn't been synchronized yet, this function will return the Provisioning status.
   * Otherwise, it will return the same status fetched from the API.
   */
  const rowid = service?.wid;
  let serviceIdArr = localStorage.getItem(CONFIGURATIONS?.NEWSERVICEID)
  if(serviceIdArr){
    serviceIdArr = serviceIdArr.split(",")
    if (service?.status === "Active" && serviceIdArr.includes(rowid)) {
      return "Provisioning...";
     }
  }
  return service?.status;
}

const getServiceStatus1 = (status) => {
  //service status
  if(status === "serviceFINISHED"){
      return "Active"
  } else if(status === "serviceFAILED"){
      return "Provisioning Failed";
  } else if(status === "serviceCANCELED"){
      return "Provisioning Canceled";
  } else if(status === "serviceACTIVE"){
      return "Provisioning...";
  } else if(status === "serviceEXPIRED"){
      return "Provisioning Expired";
  } else if(status === "serviceFINALIZING"){
      return "Finalizing...";
  } else{
      return status
  }
  // else if() {

  // }
  // const rowid = service?.wid;
  // let serviceIdArr = localStorage.getItem(CONFIGURATIONS?.NEWSERVICEID)
  // if(serviceIdArr){
  //   serviceIdArr = serviceIdArr.split(",")
  //   if (service?.status === "Active" && serviceIdArr.includes(rowid)) {
  //     return "Provisioning...";
  //    }
  // }
  // return service?.status;
}

const getWarningMessage = (status) => {
  /**
   * If the service status is not active, this function will return messages corresponding to that status.
   */
  if(status == "Provisioning...") {
      return "Your server is presently undergoing provisioning. We kindly request you to attempt access again in a few minutes."
  } else if(status == "Provisioning failed"){
      return "Opertaing system installation has been failed. Please contact to support team for further assiatnace."
  } else if(status == "Provisioning canceled"){
      return "Opertaing system installation has been canceled. Please contact to support team for further assiatnace."
  } else if(status == "Provisioning Expired"){
      return "Opertaing system installation has been expired. Please contact to support team for further assiatnace."
  } else if(status == "Finalizing..."){
      return "The operating system installation has been completed and is finalizing."
  } else if(status == "Pending"){
      return "Service is not active as we eagerly await confirmation of your payment."
  }  else if(status == "Completed"){
      return "Service is Completed."
  } else if(status == "Fraud"){
      return "Your order has been not completed due to suspicious activity, We are reviewing your order and update. You may contact support for assistance."
  } else if(status == "Cancelled"){
      return "Service is Cancelled."
  } else if(status == "Suspended"){
      return "Service is Suspended."
  } else if(status == "Terminated"){
      return "Service is Terminated."
  } else{
    if(status != "Active"){
      return "Service is not Active."
    }
  }
}

const handleFetchedService = (id) => {
  /**
   * If the data for the provisioning service has been asynchronously fetched, this function retrieves the data from Redux and returns it based on the service ID.
   */
  let fetchFetchedServices = useSelector(state => state?.fetchServices?.services)
  if(fetchFetchedServices){
    const service = fetchFetchedServices.find(service => id === service?.product?.id);
    return service || null;
  }
}

const CustomerId = (cell) => {
  const handleAction = () => {
    const status =  getStoredServersList(cell?.row?.original)
    let cellStatus = getServiceStatus1(status?.status || cell?.row?.original?.status)
    let message = getWarningMessage(cellStatus)
    return message || null
  }

  return (
    <Link
      to={{
        pathname:`/server-management/${cell?.row?.original?.id}`, 
        state:{
          product: handleFetchedService(cell?.row?.original?.id)
        }
      }}
      onClick={(e) => {
        let message = handleAction()
        message? (e?.preventDefault(),toast.warning(message, {
            position: toast.POSITION.TOP_RIGHT,
          })) : null
      }}
      className="text-body fw-bold"
    >
      <h5>{cell.row.original.name}</h5>
    </Link>
  );
};

const IpAddress = (cell) => {
  return (
    <span className="d-flex align-items-center ipaddress text">
      {cell.row.original.dedicatedip}
    </span>
  );
};

const Location = (cell) => {
  return (
    <div className="d-flex align-items-center country">
      <img
        src={
          cell?.row?.original?.location?.toLowerCase() == "london"
            ? london
            : cell?.row?.original?.location?.toLowerCase() == "frankfurt"
            ? frankfurt
            : cell?.row?.original?.location?.toLowerCase() == "america"
            ? america
            : cell?.row?.original?.location?.toLowerCase() == "singapore"
            ? singapore
            : cell?.row?.original?.location?.toLowerCase() == "hongkong"
            ? hongkong
            : cell?.row?.original?.location?.toLowerCase() == "sydney"
            ? sydney
            : cell?.row?.original?.location?.toLowerCase() == "Mumbai"
            ? Mumbai
            : cell?.row?.original?.location?.toLowerCase() == "amsterdam"
            ? amsterdam
            : ""
        }
        height={11}
      />
      {cell?.row?.original?.location}
    </div>
  );
};

const Pricing = (cell) => {
  const [currency, setCurrency] = useState();
  useEffect(() => {
    let info = loginData();
    setCurrency(info?.currency);
  }, []);

  return (
    <div className="d-flex align-items-center country">
      <img src={cell.row.original.image2} />
      {currency?.prefix}
      {cell?.row?.original?.firstpaymentamount} {currency?.suffix}
    </div>
  );
};

const TableStatus = (cell) => {
  const [installationStatus, setInstallationStatus] = useState('');

  const getInitialStatus = () => {
    const storedStatus = getStoredServersList(cell?.row?.original);
    return storedStatus || cell?.row?.original?.status;
  };

  useEffect(() => {
    setInstallationStatus(getInitialStatus());
    const timeInterval = setInterval(() => {
    const storedStatus = getStoredServersList(cell?.row?.original);
      setInstallationStatus(storedStatus || cell?.row?.original?.status);
    }, 10000);

    return () => {
      clearInterval(timeInterval);
    }
  }, [cell]);
  const cellStatus = getServiceStatus1(installationStatus?.status || installationStatus);
  return (
    <div className="status-icon-container">
      <div
        className={
            cellStatus == "Active"
            ? "tableStatus-Active"
            : cellStatus == "Terminated"
            ? "tableStatus-Terminated"
            : cellStatus == "Suspended"
            ? "tableStatus-Suspended"
            : cellStatus == "Pending"
            ? "tableStatus-Pending" 
            : cellStatus == "Fraud"
            ? "tableStatus-Fraud" 
            : cellStatus == "Completed"
            ? "tableStatus-Completed"
            : cellStatus == "Provisioning..."
            ? "tableStatus-Provisioning"
            : cellStatus == "Provisioning failed"
            ? "tableStatus-Suspended"
            : cellStatus == "Cancelled"
            ? "tableStatus-Cancelled"
            : cellStatus == "Provisioning canceled"
            ? "tableStatus-Cancelled"
            : cellStatus == "Finalizing..."
            ? "tableStatus-Finalizing"
            : "tableStatus"
        }
      >
        <img src={cell.row.original.image2} />
          {(cellStatus === "Provisioning...")?  `${cellStatus} ${installationStatus?.percentage || 0}%` : cellStatus}
        {/* {(installationStatus?.percentage && installationStatus?.percentage != 100)? 
          `${cellStatus} ${installationStatus?.percentage || 0}%` : cellStatus } */}
        {/* {cellStatus} {installationStatus?.percentage}% */}
      </div>
    </div>
  );
};

const Action = (cell) => {
    const handleAction = () => {
    const status =  getStoredServersList(cell?.row?.original)
    let cellStatus = getServiceStatus1(status?.status || cell?.row?.original?.status)
    let message = getWarningMessage(cellStatus)
    return message || null
  } 

  return (
    <>
      <Link
        to={{
          pathname:`/server-management/${cell?.row?.original?.id}`, 
          state:{
            product: handleFetchedService(cell?.row?.original?.id)
          }
        }}
        onClick={(e) => {
          let message = handleAction()
          message? (e?.preventDefault(),toast.warning(message, {
              position: toast.POSITION.TOP_RIGHT,
            })) : null
        }}
      >
        <img style={{ cursor: "pointer" }} src={rightarrow} />
      </Link>
    </>
  );
};

const NoRecordFound = () => {
  return (
    <div className="d-flex align-items-center notification_date text-blue font-normal">
      <h6>No Records Found</h6>
    </div>
  );
};

const NotifiationDate = (cell) => {
  return (
    <div className="d-flex align-items-center notification_date text-blue font-normal">
      <img src={calender} />
      {cell.row.original.date}
    </div>
  );
};

const Time = (cell) => {
  return (
    <div className="d-flex align-items-center notification_date text-blue font-normal">
      <img src={time} alt="" />
      {cell.row.original.time}
    </div>
  );
};

const Total = (cell) => {
  return (
    <div className="d-flex align-items-center country">
      {"$" + cell.row.original.total}
    </div>
  );
};

const Number = (cell) => {
  return (
    <div className="d-flex align-items-center country">
      {"#" + cell.row.original.invoiceno}
    </div>
  );
};

const CustomerName = (cell) => {
  return cell.value ? cell.value : "";
};

const NextDate = (cell) => {
  let logInfo = loginData();
  let formatedDate = FormatDate(
    cell?.value,
    logInfo?.ClientDateFormat || logInfo?.DateFormat,
    logInfo?.role
  );
  return (
    <span className="d-flex align-items-center nextdue text">
      {formatedDate ? formatedDate : ""}
    </span>
  );
};

const Email = (cell) => {
  return cell.value ? cell.value : "";
};

const CustomerStatus = (cell) => {
  let value = cell?.value?.toLowerCase();
  return (
    <div className="d-flex">
      <div className="status_block">
        <Badge
          className={
            "badge badge-pill bg-pill font-size-12 bg-soft-" +
            (value === "active"
              ? "success"
              : "danger" && value === "deactive"
              ? "danger"
              : "")
          }
        >
          {cell.value}
        </Badge>{" "}
      </div>
      <div className="status_ab">
        <Status></Status>
      </div>
    </div>
  );
};

const InvoiceStatus = (cell) => {
  return (
    <div className="d-flex">
      <div className="status_block">
        <Badge
          className={
            "badge badge-pill bg-pill font-size-12 bg-soft-" +
            (cell.value === "Paid"
              ? "success"
              : "danger" && cell.value === "Unpaid"
              ? "danger"
              : "")
          }
        >
          {cell.value}
        </Badge>{" "}
      </div>
    </div>
  );
};

const PDF = (cell) => {
  return (
    <>
      <a className="download" href={cell.row.original.pdf}>
        <img src={pdf} alt="" /> PDF
      </a>
    </>
  );
};

const Message = (cell) => {
  return (
    <div className="d-flex align-items-center notification_message text-color-v1">
      {cell.row.original.messagesubject}
      <img src={eye} alt="" />
    </div>
  );
};

const NullRouted = (cell) => {
  return (
    <div className="status_block server_block d-flex">
      <div
        className={
          "badge badge-pill bg-pill font-small  bg-soft-" +
          (cell.value === "Unblock"
            ? "success"
            : "danger" && cell.value === "Block"
            ? "danger"
            : "")
        }
      >
        {cell.value}
      </div>
      <ToogleSwitch className="table-switch" />
      <p className="text-color-v1 font-small text-null">Null</p>
    </div>
  );
};

const Actions = (cell) => {
  return (
    <div className="d-flex align-items-center notification_message text-color-v1">
      <img src={edit} alt="" />
      <img src={del} alt="" />
    </div>
  );
};
const OSicons = (cell) => {
  return (
    <div>
      {cell?.row?.original?.image_name == "linux" ? (
        <img src={image1} alt="" />
      ) : cell?.row?.original?.image_name == "vm" ? (
        <img src={image2} alt="" />
      ) : (
        ""
      )}
    </div>
  );
};

export {
  CustomerId,
  CustomerName,
  NextDate,
  Email,
  CustomerStatus,
  Location,
  Pricing,
  Total,
  Number,
  InvoiceStatus,
  PDF,
  NotifiationDate,
  Time,
  Message,
  NullRouted,
  Actions,
  IpAddress,
  TableStatus,
  NoRecordFound,
  Action,
  OSicons,
};
