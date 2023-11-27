import React, { useEffect, useMemo, useState } from "react"
import PropTypes from "prop-types"
import "bootstrap/dist/css/bootstrap.min.css"
import TableContainer from "../../components/Common/TableContainer"
import TextLoader from "../../components/textLoader"
import {
  deleteCustomer as onDeleteCustomer,
  getInvoicesList as onGetInvoicesList,
} from "../../store/actions"
import {
  CustomerId,
  Location,
  NotifiationDate,
  Time,
  CustomerName,
  Date,
  Email,
  CustomerStatus,  
//   CurDate,
  DueDate,
  Total,
  Number,
  InvoiceStatus,
  PDF,
  Checks,
//   PaymentMethod,
//   Ammount,
} from "../Common/CommonCol"

//redux
import { useSelector, useDispatch } from "react-redux"

import { Col, Row, DropdownMenu, DropdownItem, Dropdown } from "reactstrap"
import Vector1 from "../../assets/images/Vector1.svg"
import { getInvoice } from "../Authentication/store/apiServices"
import PermissionDenied from "../Authentication/PermissionDenied"
import { toast } from "react-toastify"
import { setPageTitle } from "../../helpers/api_helper_rs"
function UsersList() {
  const dispatch = useDispatch()
  const [modal, setModal] = useState(false)
  // const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false)
  const [invoice, setinvoice] = useState()
  const [defaultinvoicelist, setdefaultinvoicelist] = useState([])
  const [customerList, setCustomerList] = useState([])
  const [customer, setCustomer] = useState([])
  const [loader, setLoader] = useState(false)
  const [loading, setLoading] = useState(false)
  const [totalInvoices, setTotalInvoices] = useState()
  const [pageSizes, setPageSizes] = useState(10)
  const [hasMorePages, setHasMorePages] = useState(false)
  const [totalPages, setTotalPages] = useState()
  const [currentPage, setCurrentPage] = useState(1)
  const [page, setPage] = useState(1)
  const [pagination, setPageination] = useState({ state: false, action: "" })
  const [permissionDen, setPermissionDen] = useState(false)
  const { invoicesList } = useSelector(state => ({
    // invoicesList: state.invoices.invoicesList,
  }))

  // for api integration
  const [selectedDate, setselectedDate] = useState(0)

  const [statusFilterOpen, setstatusFilterOpen] = useState(false)
  const [checkboxValues, setCheckboxValues] = useState({
    Paid: false,
    // Unpaid: false,
    // Refunded: false,
    Cancelled: false,
    // Draft: false,
    // Overdue: false,
    Payment_Pending: false,
    // Collections: false,
  })
  const [filterArray, setFilterArray] = useState({
    status: [],
    time: 0,
    payment: "all"
  })
  const [dateFilterOpen, setdateFilterOpen] = useState(false)
  const [paymentTypeFilter, setPaymentTypeFilter] = useState(false)
  const [selectedPaymentType, setSelectedPaymentType] = useState("all")

  useEffect(() => {
    let config = {
      params: {
        command: "whmcs_invoicelist",
        debug: 1,
      },
    }

    if (invoicesList && !invoicesList.length) {
      dispatch(onGetInvoicesList(config))
    }
  }, [dispatch])

  useEffect(async () => {
    setPageTitle("Invoice")
    // getInvoiceList()
  }, [])

  const getInvoiceList = async(data) => {
    try {
      let res = ""
      if(data){
       res = await getInvoice(data)
      }else{
        res = await getInvoice()
      }
     
      if (res) {
        setPageination({ state: false })
        setLoader(false)
        setLoading(false)
        let info = res?.data?.data
        setCurrentPage(info?.current_page)
        setHasMorePages(info?.has_more_pages)
        setTotalPages(info?.total_pages)
        setTotalInvoices(info?.total_records)
        setinvoice(info?.invoices)
        setdefaultinvoicelist(
          JSON.parse(JSON.stringify(info?.invoices))
        )
      }
    } catch (err) {
      if (err?.response?.data?.status_code == 403) {
        setPermissionDen(true)
      }
      if (err?.response?.data?.status_code != 401) {
        setPermissionDen(true)
        setLoader(false)
        setLoading(false)
        toast.error(err?.response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      }
    }
  }
  
  const handleInvoiceFilter = (status, time) => {
    let data = "" 
    if(status?.length){
      data = new URLSearchParams({
        status:status,
        timeperiod:time,
        pagination:pageSizes,
        page:page
      })
    }else {
      data = new URLSearchParams({
        timeperiod:time,
        pagination:pageSizes,
        page:page
      })
    }
   
    getInvoiceList(data)
  }
  // useEffect(() => {
  //   filterApply()
  // }, [filterArray])

  useEffect(() => {
    if (pagination?.state) {
      handlePagination(pagination?.action)
    }
  }, [pagination])

  const toggle = () => {
    if (modal) {
      setModal(false)
      setCustomer(null)
    } else {
      setModal(true)
    }
  }

  const filterApply = () => {
    
    let arr = [...defaultinvoicelist]
    let filteredData = arr.filter(item => {
      if (
        filterArray.status.length > 0 &&
        !filterArray.status.includes(item.status)
      ) {
        return false
      }

      if (filterArray.time === "today") {
        return item.datetime === new Date().toISOString().slice(0, 10)
      } else if (filterArray.time === "last_7days") {
        let last7Days = new Date()
        last7Days.setDate(last7Days.getDate() - 7)
        return new Date(item.datetime) >= last7Days
      } else if (filterArray.time === "last_1month") {
        let lastMonth = new Date()
        lastMonth.setMonth(lastMonth.getMonth() - 1)
        return new Date(item.datetime) >= lastMonth
      } else if (filterArray.time === "last_12month") {
        let last12Months = new Date()
        last12Months.setFullYear(last12Months.getFullYear() - 1)
        return new Date(item.datetime) >= last12Months
      } else {
        return true
      }
    })
    setinvoice(filteredData)
  }

  const handleCustomerClicks = () => {
    setCustomerList("")
    setIsEdit(false)
    toggle()
  }

  const handleCheckboxChange = event => {
    const { id } = event.target
    setCheckboxValues(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }))
  }

  const clearfilter = () => {
    setCheckboxValues({
      Paid: false,
      // Unpaid: false,
      // Refunded: false,
      Cancelled: false,
      // Draft: false,
      // Overdue: false,
      Payment_Pending: false,
      // Collections: false,
    })
    getInvoiceList()
  }

  const applyFilter = async () => {
    setstatusFilterOpen(false)
    const arr = Object.entries(checkboxValues)
      .filter(([key, value]) => value === true)
      .map(([key]) => key)
    setFilterArray({ ...filterArray, status: arr })
    // filterApply()
    handleInvoiceFilter(arr, filterArray?.time)
  }

  const DateFilter = date => {
    setdateFilterOpen(false)
    setselectedDate(date)
    setFilterArray({ ...filterArray, time: date })
    // filterApply()
    handleInvoiceFilter(filterArray?.status, date)
  }

  const paymentFilter = type => {
    setPaymentTypeFilter(false)
    setSelectedPaymentType(type)
    setFilterArray({ ...filterArray, payment: type })
    // filterApply()
    handleInvoiceFilter(filterArray?.status, filterArray?.date, type)
  }

  const handlePagination = async action => {
    setLoader(true)
    setLoading(true)
    try {
      let data = ""
      if (action == "pageDropDown") {
        data = new URLSearchParams({
          pagination: pageSizes,
        })
      } else {
        data = new URLSearchParams({
          page: page,
          pagination: pageSizes,
        })
      }

      let res = await getInvoice(data)
      setPageination({ state: false })
      let info = res?.data?.data
      setinvoice(info?.invoices)
      setCurrentPage(info?.current_page)
      setHasMorePages(info?.has_more_pages)
      setTotalPages(info?.total_pages)
      setTotalInvoices(info?.total_records)
      setdefaultinvoicelist(
        JSON.parse(JSON.stringify(info?.invoices))
      )
      setLoader(false)
      setLoading(false)
    } catch (error) {
      setLoader(false)
      setLoading(false)
    }
  }

  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: "id",
        disableFilters: true,
        filterable: false,
        Cell: cellProps => {
          return <CustomerId {...cellProps} />
        },
      },
      {
        Header: "User Details",
        accessor: "date",
        disableGlobalFilter: true,
        disableSortBy: false, // if true the sortBy is disabled and remove sort icons
        filterable: true,
        Cell: cellProps => {
          return <CustomerName {...cellProps} />
        },
      },
      // {
      //   Header: "Payment Method",
      //   accessor: "paymentMethod",
      //   filterable: true,
      //   Cell: cellProps => {
      //     return <CustomerStatus {...cellProps} />
      //   },
      // },
      // {
      //   Header: "Amount",
      //   accessor: "subtotal",
      //   filterable: true,
      //   Cell: cellProps => {
      //     return <Email {...cellProps} />
      //   },
      // },
      {
        Header: "Status",
        accessor: "status",
        filterable: true,
        Cell: cellProps => {
          return <InvoiceStatus {...cellProps} />
        },
      },
    //   {
    //     Header: "PDF",
    //     accessor: "lastname",
    //     filterable: false,
    //     disableSortBy: true,
    //     Cell: cellProps => {
    //       return <PDF {...cellProps} />
    //     },
    //   },
    ],
    []
  )

  return (
    <React.Fragment>
      <div
        className={
          loader
            ? "page-content invoice overlayerloader"
            : "page-content invoice"
        }
      >
        <div className="container-fluid">
          <div className="rs-product-left-title rs-product-left-title-wrap title-group">
            <h2>
              {" "}
              {/* <strong>Invoices ✨</strong> */}
              <strong>Users List</strong>
            </h2>
            {!permissionDen && (
              <div className="dropdown-group">
                <div className="dropdown">
                  <Dropdown
                    isOpen={statusFilterOpen}
                    toggle={() => setstatusFilterOpen(!statusFilterOpen)}
                  >
                    <button
                      className="btn btn-primary dropdown-toggle sm"
                      type="button"
                      data-toggle="dropdown"
                      onClick={() => setstatusFilterOpen(!statusFilterOpen)}
                    >
                      {" "}
                      <img src={Vector1} alt="" />
                      <span className="caret" />
                    </button>
                    <DropdownMenu className="outerdiv">
                      <li>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="Paid"
                            onClick={handleCheckboxChange}
                            onChange={() => {}}
                            checked={checkboxValues["Paid"]}
                          />
                          <label className="form-check-label" htmlFor="Paid">
                            Paid
                          </label>
                        </div>
                      </li>
                      <li>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="Cancelled"
                            onChange={() => {}}
                            checked={checkboxValues["Cancelled"]}
                            onClick={handleCheckboxChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="Cancelled"
                          >
                            Cancelled
                          </label>
                        </div>
                      </li>
                      <li>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="Payment_Pending"
                            onChange={() => {}}
                            checked={checkboxValues["Payment_Pending"]}
                            onClick={handleCheckboxChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="Pending"
                          >
                            Pending
                          </label>
                        </div>
                      </li>
                      <li className="btn-groups">
                        <div className="inner-btn-group">
                          <button
                            className="btn btn-clear"
                            type="clear"
                            name="button"
                            onClick={clearfilter}
                          >
                            Clear
                          </button>
                          <button
                            className="btn btn-primary"
                            type="clear"
                            name="button"
                            onClick={applyFilter}
                          >
                            Apply
                          </button>
                        </div>
                      </li>
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <div className="dropdown">
                  <Dropdown
                    isOpen={paymentTypeFilter}
                    toggle={() => setPaymentTypeFilter(!paymentTypeFilter)}
                  >
                    <button
                      className="btn btn-primary dropdown-toggle"
                      type="button"
                      data-toggle="dropdown"
                      onClick={() => setPaymentTypeFilter(!paymentTypeFilter)}
                    >
                        {selectedPaymentType == "all"
                        ? "All"
                        : selectedPaymentType == "deposit"
                        ? "Deposit"
                        : selectedPaymentType == "transfer"
                        ? "Transfer"
                        : selectedPaymentType == "withdraw"
                        ? "Withdraw"
                        : ""}
                      <span className="caret" />
                    </button>
                    <DropdownMenu className="outerdiv">
                      <>
                        <li onClick={() => paymentFilter("all")}>
                          <div className="form-check custom-checkbox">
                            <label
                              className="form-check-label"
                              htmlFor="All"
                            >
                              All
                            </label>
                          </div>
                        </li>
                        <DropdownItem divider />
                        <li onClick={() => paymentFilter("deposit")}>
                          <div className="form-check custom-checkbox">
                            <label
                              className="form-check-label"
                              htmlFor="Deposit"
                            >
                              Deposit
                            </label>
                          </div>
                        </li>
                        <DropdownItem divider />
                        <li onClick={() => paymentFilter("transfer")}>
                          <div className="form-check custom-checkbox">
                            <label
                              className="form-check-label"
                              htmlFor="Transfer"
                            >
                              Transfer
                            </label>
                          </div>
                        </li>
                        <DropdownItem divider />
                        <li onClick={() => paymentFilter("withdraw")}>
                          <div className="form-check custom-checkbox">
                            <label
                              className="form-check-label"
                              htmlFor="Withdraw"
                            >
                              Withdraw
                            </label>
                          </div>
                        </li>
                        <DropdownItem divider />
                      </>
                    </DropdownMenu>
                  </Dropdown>
                </div>

                <div className="dropdown">
                  <Dropdown
                    isOpen={dateFilterOpen}
                    toggle={() => setdateFilterOpen(!dateFilterOpen)}
                  >
                    <button
                      className="btn btn-primary dropdown-toggle"
                      type="button"
                      data-toggle="dropdown"
                      onClick={() => setdateFilterOpen(!dateFilterOpen)}
                    >
                        {selectedDate == 0
                        ? "All Time"
                        : selectedDate == 2
                        ? "Last 7 Days"
                        : selectedDate == 3
                        ? "Last Month"
                        : selectedDate == 4
                        ? "Last 12 Months"
                        : selectedDate == 1
                        ? "Today"
                        : ""}
                      <span className="caret" />
                    </button>
                    <DropdownMenu className="outerdiv">
                      <>
                        <li onClick={() => DateFilter(1)}>
                          <div className="form-check custom-checkbox">
                            <label className="form-check-label" htmlFor="today">
                              Today
                            </label>
                          </div>
                        </li>
                        <DropdownItem divider />
                        <li onClick={() => DateFilter(2)}>
                          <div className="form-check custom-checkbox">
                            <label
                              className="form-check-label"
                              htmlFor="7-days"
                            >
                              Last 7 Days
                            </label>
                          </div>
                        </li>
                        <DropdownItem divider />
                        <li onClick={() => DateFilter(3)}>
                          <div className="form-check custom-checkbox">
                            <label
                              className="form-check-label"
                              htmlFor="last-month"
                            >
                              Last Month
                            </label>
                          </div>
                        </li>
                        <DropdownItem divider />
                        <li onClick={() => DateFilter(4)}>
                          <div className="form-check custom-checkbox">
                            <label
                              className="form-check-label"
                              htmlFor="12-months"
                            >
                              Last 12 Months
                            </label>
                          </div>
                        </li>
                        <DropdownItem divider />
                        <li onClick={() => DateFilter(0)}>
                          <div className="form-check custom-checkbox">
                            <label
                              className="form-check-label"
                              htmlFor="all-time"
                            >
                              All Time
                            </label>
                          </div>
                        </li>
                        <DropdownItem divider />
                      </>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            )}
          </div>
          {!permissionDen ? (
            <Row>
              <Col xs="12">
                <div className="table_v1 invoice-listing">
                  <TableContainer
                    tableClassName="product-table table-shadow"
                    columns={columns}
                    data={invoice == undefined ? [] : invoice}
                    isGlobalFilter={true}
                    isAddCustomer={true}
                    isAddTableBorderStrap={true}
                    totalCount={totalInvoices}
                    setPageSizes={setPageSizes}
                    hasMorePages={hasMorePages}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    handleCustomerClicks={handleCustomerClicks}
                    setPage={setPage}
                    setPageination={setPageination}
                    getTablePropsC={() => ({
                      className: "product-table ",
                    })}
                  />
                </div>
              </Col>
            </Row>
          ) : (
            <PermissionDenied />
          )}
        </div>
      </div>
      <TextLoader loading={loading} loader={loader}/>
    </React.Fragment>
  )
}
UsersList.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

export default UsersList
