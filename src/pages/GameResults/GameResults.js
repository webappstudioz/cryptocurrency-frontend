import React, { useEffect, useMemo, useState } from "react"
import PropTypes from "prop-types"
import "bootstrap/dist/css/bootstrap.min.css"
import TextLoader from "../../components/textLoader"
import {
  GameDate,
  //   CurDate,
  //   Total,
  //   Number,
  InvoiceStatus,
  //   SendTo,
  //   PaymentType,
} from "./resultCol"

import { Col, Row, DropdownMenu, DropdownItem, Dropdown } from "reactstrap"
import Vector1 from "../../assets/images/Vector1.svg"
import { getGameResults, getInvoice, loginData } from "../Authentication/store/apiServices"
import { toast } from "react-toastify"
import { setPageTitle } from "../../helpers/api_helper_rs"
import ResultsTableContainer from "../../components/Common/ResultsTable"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
function GameResults() {
  const userInfo = loginData()
  const [invoice, setInvoice] = useState()
  const [loader, setLoader] = useState(false)
  const [loading, setLoading] = useState(false)
  const [totalInvoices, setTotalInvoices] = useState()
  const [pageSizes, setPageSizes] = useState(10)
  const [hasMorePages, setHasMorePages] = useState(false)
  const [totalPages, setTotalPages] = useState()
  const [currentPage, setCurrentPage] = useState(1)
  const [page, setPage] = useState(1)
  const [pagination, setPageination] = useState({ state: false, action: "" })
  const [selectedPaymentType, setSelectedPaymentType] = useState("all")
  const [statusFilterOpen, setstatusFilterOpen] = useState(false)
  const [checkboxValues, setCheckboxValues] = useState({
    paid: false,
    cancelled: false,
    pending: false,
  })
  const [filterArray, setFilterArray] = useState({
    status: [],
    paymentType: "all",
  })
  const [paymentTypeFilter, setPaymentTypeFilter] = useState(false)
  const [startDate, setStartDate] = useState()
  const [toDate, settoDate] = useState()
  const [spinner, setSpinner] = useState(false)
  
  useEffect(async () => {
    setPageTitle("Game Results")
    // getInvoiceList()
  }, [])

  const getReults = async() => {
    try{
      let res = await getGameResults()
      console.log("res", res)
    }catch(error){
      console.log("error", error)
      toast.error(error?.response?.data?.message, {
        position:toast.POSITION.TOP_RIGHT
      })
    }
  }

  const getInvoiceList = async (data) => {
    try {
      let res = ""
      if (data) {
        res = await getInvoice(data)
      } else {
        res = await getInvoice()
      }

      if (res) {
        setPageination({ state: false })
        setLoader(false)
        setLoading(false)
        let info = res?.data?.data
        let invoices = info?.data.map((invoice, index) => {
          return {
            ...invoice,
            serialNumber: index + 1
          }
        })
        setCurrentPage(info?.current_page)
        setHasMorePages(info?.has_more_pages)
        setTotalPages(info?.last_page)
        setTotalInvoices(info?.total_record)
        setInvoice(invoices)

      }
    } catch (error) {
      console.log("error", error)
      if (error?.response?.data?.status_code == 403) {
      }
      if (error?.response?.data?.status_code != 401) {
        setLoader(false)
        setLoading(false)
        toast.error(error?.response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      }
    }
  }

  const handleInvoiceFilter = (status, paymentType) => {
    let data = ""
    if (status?.length) {
      data = new URLSearchParams({
        status: status,
        payment_type: paymentType,
        pagination: pageSizes,
        page: page
      })
    } else {
      data = new URLSearchParams({
        payment_type: paymentType,
        pagination: pageSizes,
        page: page
      })
    }

    getInvoiceList(data)
  }

  useEffect(() => {
    if (pagination?.state) {
      handlePagination(pagination?.action)
    }
  }, [pagination])


  const handleCheckboxChange = event => {
    const { id } = event.target
    setCheckboxValues(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }))
  }

  const clearfilter = () => {
    setstatusFilterOpen(false)
    setCheckboxValues({
      paid: false,
      cancelled: false,
      pending: false,
    })
    getInvoiceList()
  }

  const applyFilter = async () => {
    setstatusFilterOpen(false)
    const arr = Object.entries(checkboxValues)
      .filter(([key, value]) => value === true)
      .map(([key]) => key)
    setFilterArray({ ...filterArray, status: arr })
    handleInvoiceFilter(arr, filterArray?.paymentType)
  }


  const paymentFilter = (paymentType) => {
    setPaymentTypeFilter(false)
    setSelectedPaymentType(paymentType)
    setFilterArray({ ...filterArray, paymentType: paymentType })
    handleInvoiceFilter(filterArray?.status, paymentType)
  }

  const handlePagination = async action => {
    setLoader(true)
    setLoading(true)
    try {
      let data = ""
      if (action == "pageDropDown") {
        data = new URLSearchParams({
          pagination: pageSizes,
          status: filterArray?.status,
          payment_type: filterArray.paymentType
        })
      } else {
        data = new URLSearchParams({
          page: page,
          pagination: pageSizes,
          status: filterArray?.status,
          payment_type: filterArray.paymentType
        })
      }
      getInvoiceList(data)

    } catch (error) {
      console.log("error", error)

    }
  }

  const columns = useMemo(
    () => [
      {
        Header: "Result",
        accessor: "serialNumber",
        disableFilters: true,
        filterable: false,
        // Cell: cellProps => {
        //   return <Number {...cellProps} />
        // },
      },
      {
        Header: "Winner",
        accessor: "send_to",
        disableGlobalFilter: true,
        disableSortBy: false, // if true the sortBy is disabled and remove sort icons
        filterable: true,
        // Cell: cellProps => {
        //   return <SendTo {...cellProps} />
        // },
      },
      {
        Header: "Time Slot",
        accessor: "payment_type",
        disableGlobalFilter: true,
        disableSortBy: false, // if true the sortBy is disabled and remove sort icons
        filterable: true,
        // Cell: cellProps => {
        //   return <PaymentType {...cellProps} />
        // },
      },
      {
        Header: "Date",
        accessor: "created_at",
        disableGlobalFilter: true,
        disableSortBy: false, // if true the sortBy is disabled and remove sort icons
        filterable: true,
        Cell: cellProps => {
          return <GameDate {...cellProps} />
        },
      },
      {
        Header: "Amount",
        accessor: "amount",
        filterable: true,
        // Cell: cellProps => {
        //   return <Total {...cellProps} />
        // },
      },
      // {
      //   Header: "Status",
      //   accessor: "status",
      //   filterable: true,
      //   Cell: cellProps => {
      //     return <InvoiceStatus {...cellProps} />
      //   },
      // },
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
              <strong>Game Results</strong>
            </h2>
            <div className="dropdown-group">
              <div className="dropdown">
                <div className="top-center search">
                  <div className="app-search d-none d-lg-block p-0">
                    {/* <div className="position-relative">
                      <input
                        type="text"
                        className="form-control"
                        value={search}
                        placeholder={"Search"}
                        onChange={e => {
                          // handleSearch(e?.target?.value)
                          setsearch(e?.target?.value)
                          // handleDebounceVal(e?.target?.value)
                        }}
                      />
                      {!search ? (
                        <span className={"uil-search"}></span>
                      ) : (
                        <span
                          className={"uil-times"}
                          style={{ cursor: "pointer" }}
                          onClick={e => {
                            // handleSearch()
                            // handleDebounceVal("")
                            // dashBoardCall0(0)
                            setsearch("")
                          }}
                        ></span>
                      )}
                    </div> */}
                  </div>
                </div>
              </div>
              {/* <div className="dropdown">
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
                </div> */}
              {/* <div className="dropdown">
                <Dropdown
                  isOpen={isUserStatusFilter}
                  toggle={() => setIsUserStatusFilter(!isUserStatusFilter)}
                >
                  <button
                    className="btn btn-primary dropdown-toggle"
                    type="button"
                    data-toggle="dropdown"
                    onClick={() => setIsUserStatusFilter(!isUserStatusFilter)}
                  >
                    {selectedUserStatus == "all"
                      ? "All"
                      : selectedUserStatus == "active"
                        ? "Active"
                        : selectedUserStatus == "inactive"
                          ? "In-active"
                          : ""}
                    <span className="caret" />
                  </button>
                  <DropdownMenu className="outerdiv">
                    <>
                      <li onClick={() => userStatusFilter("all")}>
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
                      <li onClick={() => userStatusFilter("active")}>
                        <div className="form-check custom-checkbox">
                          <label
                            className="form-check-label"
                            htmlFor="Active"
                          >
                            Active
                          </label>
                        </div>
                      </li>
                      <DropdownItem divider />
                      <li onClick={() => userStatusFilter("inactive")}>
                        <div className="form-check custom-checkbox">
                          <label
                            className="form-check-label"
                            htmlFor="In-active"
                          >
                            In-active
                          </label>
                        </div>
                      </li>
                      <DropdownItem divider />
                    </>
                  </DropdownMenu>
                </Dropdown>
              </div> */}

              <div className="dropdown">
                <div
                  className="chartfilter"
                // className={loader ? "chartfilter overlayerloader" : "chartfilter"}
                >
                  <span>
                    <p className="datelabel">From</p>
                    <DatePicker
                      selected={startDate}
                      placeholderText="Please select a date"
                      onChange={date => {
                        setStartDate(date)
                        settoDate(toDate ? toDate : new Date())

                        // comparisonvalid(date, toDate)
                      }}
                      // minDate={registrationDate}
                      maxDate={new Date()}
                      dateFormat={"yyyy/MM/dd"}
                    />
                  </span>
                  <span>
                    <p className="datelabel">To</p>
                    <DatePicker
                      selected={toDate}
                      placeholderText="Please select a date"
                      onChange={date => {
                        settoDate(date)
                        // comparisonvalid(startDate, date)
                      }}
                      minDate={startDate}
                      maxDate={new Date()}
                      dateFormat={"yyyy/MM/dd"}
                    />
                  </span>
                  <div className="filter-clear-btns">
                    <button
                      // title={
                      //   comparefromDate >= comparetoDate
                      //     ? "To date must be greater than Start date"
                      //     : ""
                      // }
                      onClick={() => handleFilterUsers()}
                      className=" btn btn-primary filter usage-filter"
                      disabled={spinner}
                    // style={{
                    //   cursor:
                    //     (comparefromDate >= comparetoDate || spinner) ? "not-allowed" : "pointer",
                    // }}
                    >
                      {/* {spinner ? <div className="ui active inline loader"></div> : "Filter"} */}
                      Filter
                    </button>
                    <button
                      // title={
                      //   comparefromDate >= comparetoDate
                      //     ? "To date must be greater than Start date"
                      //     : ""
                      // }
                      onClick={() => handleClearFilters()}
                      className="btn btn-primary filter usage-filter"
                      disabled={spinner}
                    // style={{
                    //   cursor:
                    //     (comparefromDate >= comparetoDate || spinner) ? "not-allowed" : "pointer",
                    // }}
                    >
                      {/* {spinner ? <div className="ui active inline loader"></div> : "Filter"} */}
                      Clear
                    </button>
                  </div>
                </div>
                {/* <Dropdown
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
                  </Dropdown> */}
              </div>
            </div>
          </div>
          <Row>
            <Col xs="12">
              <div className="table_v1 invoice-listing">
                <ResultsTableContainer
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
                  setPage={setPage}
                  setPageination={setPageination}
                  getTablePropsC={() => ({
                    className: "product-table ",
                  })}
                  role={userInfo?.role}
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <TextLoader loading={loading} loader={loader} />
    </React.Fragment>
  )
}
GameResults.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

export default GameResults
