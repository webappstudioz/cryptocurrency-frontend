import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from 'reactstrap';
import { getFormatedDate } from '../../helpers/api_helper_rs';
import calender from "../../assets/images/calender.svg"

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
    // <Link to={`/admin/user-detail/${cell?.row?.original?.id}`}  style={{cursor:"pointer"}}>
    <>{cell?.row.original?.serialNumber}</>
    // </Link>
  )
}

const Winner = cell => {
  return (
    // <Link to={`/admin/user-detail/${cell?.row?.original?.winner}`}  style={{cursor:"pointer"}}>
    <>
      {cell?.row.original?.winner}</>
    // </Link>
  )
}

const InvoiceId = (cell) => {
  return (
    <Link to="#" className="text-body fw-bold">{cell.value ? cell.value : ''}</Link>
  );
};

const BillingName = (cell) => {
  return cell.value ? cell.value : '';
};

const GameDate = cell => {
  let date = getFormatedDate(cell?.row?.original?.date)
  return (
    <div className="d-flex align-items-center notification_date text-blue font-normal">
      <img src={calender} />
      {date}
    </div>
  )
}

// const Date = (cell) => {
//     return cell.value ? cell.value : '';
// };

const Amount = (cell) => {
  return cell.value ? cell.value : '';
};

const TimeSlot = (cell) => {
  return (
    // <Link to={`/admin/user-detail/${cell?.row?.original?.winner}`}  style={{cursor:"pointer"}}>
    <>{cell?.row.original?.timeSlot}</>
    // </Link>
  )
}

const InvoiceStatus = (cell) => {
  return (
    <Badge
      className={"badge badge-pill bg-pill font-size-12 bg-soft-" +
        (cell.value === "Paid" ? "success" : "warning" && cell.value === "Pending" ? "warning" : "")}
    >
      {cell.value}
    </Badge>
  )
};

const DownloadPdf = (cell) => {
  return (
    <button className="btn btn-light btn-sm w-xs">Pdf <i className="uil uil-download-alt ms-2"></i></button>
  )
};

export {
  InvoiceId,
  BillingName,
  GameDate,
  Amount,
  InvoiceStatus,
  DownloadPdf,
  SerialNumber,
  Winner,
  TimeSlot
};