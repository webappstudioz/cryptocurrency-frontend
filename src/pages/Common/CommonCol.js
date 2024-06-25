import React, { useState } from "react"
import { Link } from "react-router-dom"
import Status from "../../components/CommonForBoth/TopbarDropdown/Status"
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  Row,
  Col,
  Badge,
} from "reactstrap"
import pdf from "../../assets/images/pdf.svg"
import calender from "../../assets/images/calender.svg"
import time from "../../assets/images/time-note.svg"
import eye from "../../assets/images/eye.svg"
import reboot from "../../assets/images/reboot.png"
import ToogleSwitch from "../../components/Common/ToogleSwitch"
import rightarrow from "../../assets/images/rightarrow.png"

import del from "../../assets/images/table-delete.svg"
import edit from "../../assets/images/table-edit.svg"
// import { ManageI } from "../../Common/CommonSvg"
import { ManageI } from "../../components/Common/CommonSvg"
import { FormatDate, getFormatedDate, getFormatedTime } from "../../helpers/api_helper_rs"
import { updateUserStatus } from "../Authentication/store/apiServices"
// const formateDate = (date, format) => {
//     const dateFormat = format ? format : "DD MMM Y";
//     const date1 = moment(new Date(date)).format(dateFormat);
//     return date1;
// };
// const toLowerCase1 = str => {
//     return (
//       str === "" || str === undefined ? "" : str.toLowerCase()
//     );
//   };

const SerialNumber = cell => {
  return (
    <Link to={`/admin/user-detail/${cell?.row?.original?.id}`}  style={{cursor:"pointer"}}>
      {cell?.row.original?.serialNumber}
    </Link>
  )
}

const UserName = cell => {
  return (
    <Link to={`/admin/user-detail/${cell?.row?.original?.id}`}  style={{cursor:"pointer"}}>
      {cell?.row.original?.user_name}
    </Link>
  )
}

const Name = cell => {
  return (
    <Link to={`/admin/user-detail/${cell?.row?.original?.id}`}  style={{cursor:"pointer"}}>
      {cell?.row.original?.first_name}{" "}{cell?.row.original?.last_name}
    </Link>
  )
}

const Email = cell => {
  return (
    <Link to={`/admin/user-detail/${cell?.row?.original?.id}`}  style={{cursor:"pointer"}}>
      {cell?.row.original?.email}
    </Link>
  )
}

const PhoneNumber = cell => {
  return (
    <Link to={`/admin/user-detail/${cell?.row?.original?.id}`}  style={{cursor:"pointer"}}>
      {cell?.row.original?.phone_number}
    </Link>
  )
}

const JoiningDate = cell => {
  const joiningDate = FormatDate(cell?.row.original?.joining_date)
  return (
    <Link to={`/admin/user-detail/${cell?.row?.original?.id}`}  style={{cursor:"pointer"}}>
      {joiningDate}
    </Link>
  )
}

const AcountStatus = cell => {
  const [userStatus, setUserStatus] = useState(cell.value === 1 ? true : false)
  const handleUserStatusChange = async (status) => {
    try {
      let data = new URLSearchParams({
        user_id: cell?.row?.original?.id,
        status: status === true ? 1 : 0
      })
      const result = await updateUserStatus(data)
      setUserStatus(status)
    } catch (error) {
    }
  }

  return (
    <>
      <div className={"form-check form-switch custom_switch"}>
        <input
          type="checkbox"
          className="form-check-input"
          id="customSwitch2"
          onChange={() => { }}
          checked={userStatus}
          onClick={e => {
            handleUserStatusChange(!userStatus)
          }}
        />
      </div>
    </>
  )
}

const Action = cell => {
  return (
    <Link to={`/admin/user-detail/${cell?.row?.original?.id}`}>
      <img style={{ cursor: "pointer" }} src={rightarrow} />
    </Link>
  )
}

const CustomerId = cell => {
  return (
    <p className="">{cell?.row.original?.serialNumber}</p>
  )
}

const Location = cell => {
  return (
    <div className="d-flex align-items-center country">
      <img src={cell?.row.original?.image2} />
      {cell?.row.original?.location}
    </div>
  )
}

const NotifiationDate = cell => {
  let notificationdate = getFormatedDate(cell?.row?.original?.time)
  return (
    <div className="d-flex align-items-center notification_date text-blue font-normal">
      <img src={calender} />
      {notificationdate}
    </div>
  )
}

const Time = cell => {
  let notificationtime = getFormatedTime(cell?.row?.original?.time)
  return (
    <div className="d-flex align-items-center notification_date text-blue font-normal">
      <img src={time} alt="" />
      {notificationtime}
    </div>
  )
}

const Total = cell => {
  return (
    <div className="d-flex align-items-center country">
      {"$" + cell?.row.original?.total}
    </div>
  )
}

const Number = cell => {
  return (
    <div className="d-flex align-items-center country">
      {"#" + cell?.row.original?.invoiceno}
    </div>
  )
}

const CustomerName = cell => {
  return cell?.value ? cell?.value : ""
}

const Date = cell => {
  return cell?.value ? cell?.value : ""
}

const DDOSStatus = cell => {
  if (!cell?.value) {
    return "Unavailable"
  }
  if (cell?.value?.detectionProfile == "STANDARD_DEFAULT") return "Default"
  return cell?.value?.detectionProfile
}

const CustomerStatus = cell => {
  return (
    <div className="d-flex">
      <div className="status_block">
        <Badge
          className={
            "badge badge-pill bg-pill font-size-12 bg-soft-" +
            (cell?.value === "Active"
              ? "success"
              : "danger" && cell?.value === "Deactive"
                ? "danger"
                : "")
          }
        >
          {cell?.value}
        </Badge>{" "}
      </div>
      <div className="status_ab">
        <Status></Status>
      </div>
    </div>
  )
}

const InvoiceStatus = cell => {
  return (
    <div className="d-flex">
      <div className="status_block">
        <Badge
          className={
            "badge badge-pill bg-pill font-size-12 bg-soft-" +
            (cell?.value === "Paid"
              ? "success"
              : "danger" && cell?.value === "Unpaid"
                ? "danger"
                : "")
          }
        >
          {cell?.value}
        </Badge>{" "}
      </div>
    </div>
  )
}

const PDF = cell => {
  return (
    <>
      <a className="download" href={cell?.row.original?.pdf}>
        <img src={pdf} alt="" /> PDF
      </a>
    </>
  )
}

const Message = cell => {
  let path = ""
  if (cell?.row?.original?.rel === "serviceid") {
    path = `/dashboard`
    if (cell?.row?.original?.relid) {
      path = `/server-management/${cell?.row?.original?.relid}`
    }
  } else if (
    cell?.row?.original?.rel === "invoiceid" &&
    cell?.row?.original?.relid
  ) {
    path = `/invoice-detail/${cell?.row?.original?.relid}`
  } else {
    path = `/invoice`
  }
  return (
    <div className="d-flex align-items-center notification_message text-color-v1">
      {cell?.row?.original?.subject}
      <Link to={path}>
        <img src={eye} alt="" />
      </Link>
    </div>
  )
}

const NullRouted = ({ cell, recall, loader, loading }) => {
  return (
    <div className="status_block server_block d-flex">
      <div
        className={
          "badge badge-pill bg-pill font-small  bg-soft-" +
          (cell?.value ? "danger" : "success")
        }
      >
        {cell?.value ? "Block" : "Unblock"}
      </div>
      <ToogleSwitch
        loader={loader}
        loading={loading}
        recall={recall}
        ip={cell?.row?.original?.ip}
        className="table-switch"
        value={!cell?.value ? true : false}
      />
    </div>
  )
}

const Actions = ({ cell, togModal }) => {
  const [menu, setMenu] = useState(false)
  let currentip = cell?.row?.original?.ip
  let m = currentip?.lastIndexOf("/")
  let mainip = currentip?.substring(0, m)
  return (
    <div className="d-flex align-items-center notification_message text-color-v1">
      <img
        src={edit}
        alt=""
        // style={{ cursor: !cell?.row?.original?.ddos ? "not-allowed" : "pointer" }}
        style={{ cursor: "pointer" }}
        onClick={() => {
          // cell?.row?.original?.ddos &&
          togModal(mainip)
        }}
      />
    </div>
  )
}

export {
  SerialNumber,
  UserName,
  Name,
  Email,
  PhoneNumber,
  JoiningDate,
  AcountStatus,
  Action,
  CustomerId,
  CustomerName,
  Date,
  CustomerStatus,
  Location,
  Total,
  Number,
  InvoiceStatus,
  PDF,
  NotifiationDate,
  Time,
  Message,
  NullRouted,
  Actions,
  DDOSStatus,
}
