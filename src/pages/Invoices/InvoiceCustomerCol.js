import React from "react"
import { Link } from "react-router-dom"
import { downloadInvoice } from "../Authentication/store/apiServices"
import pdfdown from "../../assets/images/pdfdown.png"
import pdfnew from "../../assets/images/pdfnew.png"
import { toast } from "react-toastify"
import { loginData } from "../Authentication/store/apiServices"
import { FormatDate } from "../../helpers/api_helper_rs"
const Total = cell => {
  let info = loginData()
  let currency = info?.currency
  return (
    <div className="d-flex align-items-center country">
      {currency.prefix +
        cell.row.original.total +
        " " +
        currency.suffix}
    </div>
  )
}
const Checks = cell => {
  return (
    <div className="d-flex align-items-center country">
      <input type="checkbox" />
    </div>
  )
}

const Number = cell => {
  return (
    <div className="d-flex align-items-center country">
      <Link to={`/invoice-detail/${cell.row.original.viewid}`}>
        #{cell.row.original.id}
      </Link>
    </div>
  )
}

const CurDate = cell => {
  let logInfo = loginData();
  let formatedDate = FormatDate(
      cell?.row?.original?.date,
      logInfo?.ClientDateFormat || logInfo?.DateFormat,
      logInfo?.role
    )
  return formatedDate
}
const DueDate = cell => {
  let logInfo = loginData();
  let formatedDate = FormatDate(
      cell?.row?.original?.duedate,
      logInfo?.ClientDateFormat || logInfo?.DateFormat,
      logInfo?.role
    )
  return formatedDate
}

const InvoiceStatus = cell => {
  return (
    <div className="status-icon-container">
      <div
        className={
          cell?.row?.original?.status == "Paid"
            ? "tableStatus-Active"
            : cell?.row?.original?.status == "Unpaid"
            ? "tableStatus-Cancelled"
            : cell?.row?.original?.status == "Cancelled"
            ? "tableStatus-Pending"
            : cell?.row?.original?.status == "Refunded"
            ? "tableStatus-Suspended"
            : ""
        }
      >
        {cell?.row?.original?.status}
      </div>
    </div>
  )
}
const handleInvoice = async id => {
  let res = await downloadInvoice(id)
  if (res) {
    toast.success(res, {
      position: toast.POSITION.TOP_RIGHT,
    })
  }
}
const PDF = cell => {
  return (
    <>
      <a
        className="pdf-download"
        style={{ cursor: "pointer" }}
        onClick={() => handleInvoice(cell?.row?.original?.id)}
      >
        <img src={pdfnew} alt="" />
        Invoice #{cell.row.original.id}
        <img src={pdfdown} alt="" />
      </a>
    </>
  )
}

export { CurDate, DueDate, Total, Number, InvoiceStatus, PDF, Checks }
