import React, { useEffect, useMemo, useState } from "react"
import PropTypes from "prop-types"
import "bootstrap/dist/css/bootstrap.min.css"
import TableContainer from "../../components/Common/TableContainer"
//import components
import Breadcrumb from "../../components/Common/Breadcrumb"
import { notificationList } from "../Authentication/store/apiServices"
import { NotifiationDate, Time, Message } from "../Common/CommonCol"
import { Card, CardBody } from "reactstrap"
import TextLoader from "../../components/textLoader"

function Notification() {
  const [notifications, setNotifications] = useState()
  const [loader, setLoader] = useState(false)
  const [loading, setLoading] = useState("")
  const [totalCount, setTotalCount] = useState()
  const [pageSizes, setPageSizes] = useState(10)
  const [hasMorePages, setHasMorePages] = useState(false)
  const [totalPages, setTotalPages] = useState()
  const [currentPage, setCurrentPage] = useState(1)
  const [page, setPage] = useState(1)
  const [pagination, setPageination] = useState({ state: false, action: "" })
  const handleCustomerClicks = () => {}

  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "date",
        disableFilters: true,
        filterable: false,
        Cell: cellProps => {
          return <NotifiationDate {...cellProps} />
        },
      },
      {
        Header: "Time",
        accessor: "Time",
        disableGlobalFilter: true,
        disableSortBy: false, // if true the sortBy is disabled and remove sort icons
        filterable: true,
        Cell: cellProps => {
          return <Time {...cellProps} />
        },
      },
      {
        Header: "Message Subject",
        accessor: "messagesubject",
        filterable: true.valueOf,
        Cell: cellProps => {
          return <Message {...cellProps} />
        },
      },
    ],
    []
  )

  const data = [
    {
      date: "12 Dec, 2020",
      time: "10.15AM",
      messagesubject: "Invoice #29555 Updated",
    },
    {
      date: "12 Dec, 2020",
      time: "10.15AM",
      messagesubject: "Invoice #29555 Updated",
    },
    {
      date: "12 Dec, 2020",
      time: "10.15AM",
      messagesubject: "Invoice #29555 Updated",
    },
    {
      date: "12 Dec, 2020",
      time: "10.15AM",
      messagesubject: "Invoice #29555 Updated",
    },
    {
      date: "12 Dec, 2020",
      time: "10.15AM",
      messagesubject: "Invoice #29555 Updated",
    },
    {
      date: "12 Dec, 2020",
      time: "10.15AM",
      messagesubject: "Invoice #29555 Updated",
    },
  ]

  useEffect(() => {
    handleNotificationList()
  }, [])

  useEffect(() => {
    if (pagination?.state) {
      handlePagination(pagination?.action)
    }
  }, [pagination])

  const handleNotificationList = async () => {
    setLoader(true)
    setLoading(true)
    try {
      let res = await notificationList()
      setNotifications(res?.data?.data?.notifications)
      setTotalCount(res?.data?.data?.total_records)
      setHasMorePages(res?.data?.data?.has_more_pages)
      setTotalPages(res?.data?.data?.total_pages)
      setCurrentPage(res?.data?.data?.current_page)
      setLoader(false)
      setLoading(false)
    } catch (error) {
      setLoader(false)
      setLoading(false)
    }
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

      let res = await notificationList(data)
      setPageination({ state: false })
      let fullres = res?.data?.data
      let notificationArr = res?.data?.data?.notifications
      setNotifications(notificationArr)
      setTotalCount(fullres?.total_records)
      setHasMorePages(fullres?.has_more_pages)
      setTotalPages(fullres?.total_pages)
      setCurrentPage(fullres?.current_page)
      setLoader(false)
      setLoading(false)
    } catch (error) {
      setLoader(false)
      setLoading(false)
    }
  }
  return (
    <React.Fragment>
      <div
        className={
          loader
            ? "page-content notification overlayerloader"
            : "page-content notification"
        }
      >
        <div className="container-fluid">
          <Breadcrumb title="Minible" breadcrumbItem="Notifications" />
          <Card>
            <CardBody>
              {/* <p className="text-blue font-16 font-semibold">Email history</p> */}
              <div className="table_v1">
                {/* {notifications ? ( */}
                  <TableContainer
                    tableClassName="product-table table-shadow"
                    columns={columns}
                    data={notifications || []}
                    isGlobalFilter={true}
                    isAddCustomer={true}
                    isAddTableBorderStrap={true}
                    totalCount={totalCount}
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
                {/* ) :  */}
                    {/* <span>No records Found</span> */}
                {/* } */}
              </div>
              
            </CardBody>
          </Card>
        </div>
      <TextLoader loading={loading} loader={loader}/>
      </div>
    </React.Fragment>
  )
}
Notification.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

export default Notification
