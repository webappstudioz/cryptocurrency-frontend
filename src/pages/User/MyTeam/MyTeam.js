import React, { useState, useMemo, useEffect } from "react"
// import LevelOne from "./LevelOne"
// import LevelTwo from "./LevelTwo"
// import LevelThree from "./LevelThree"
import { Col, Row, DropdownMenu, DropdownItem, Dropdown } from "reactstrap"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import TableContainer from "./Table/MyTeamTableContainer"
import TextLoader from "../../../components/textLoader"
import {
    SerialNumber,
    Email,
    UserName,
    Name,
    AcountStatus,
    Action,
    JoiningDate,
    PhoneNumber,
} from "./Table/CommonCol"
import { getTeamList } from "../../Authentication/store/apiServices"
import { toast } from "react-toastify"
const MyTeam = () => {
    const [usersList, setUsersList] = useState([])
    const [loader, setLoader] = useState(false)
    const [search, setSearch] = useState("")
    const [isUserStatusFilter, setIsUserStatusFilter] = useState(false)
    const [selectedUserStatus, setSelectedUserStatus] = useState("all")
    const [startDate, setStartDate] = useState()
    const [toDate, settoDate] = useState()
    const [spinner, setSpinner] = useState(false)
    const [activeLevel, setActiveLevel] = useState(1)
    const [pageSizes, setPageSizes] = useState(10)
    const [hasMorePages, setHasMorePages] = useState(false)
    const [totalPages, setTotalPages] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const [page, setPage] = useState(1)
    const [pagination, setPageination] = useState({ state: false, action: "" })
    const [totalUsers, setTotalUsers] = useState()

    useEffect(() => {
        handleAllUsersList(activeLevel)
    }, [])

    const handleTab = (level) => {
        setActiveLevel(level)
        handleAllUsersList(level)
    }

    const handleAllUsersList = async (level) => {
        setLoader(true)
        // setLoading(true)
        try {
            const result = await getTeamList(level)
            let info = result?.data?.data
            let users = info?.data.map((user, index) => {
                return {
                    ...user,
                    serialNumber: index + 1
                }
            })

            console.log("info", info)
            setUsersList(users)
            setPageination({ state: false })
            setLoader(false)
            //   setLoading(false)
            setCurrentPage(info?.current_page)
            setHasMorePages(info?.has_more_pages)
            setTotalPages(info?.total_pages)
            setTotalUsers(info?.total_record)
        } catch (error) {
            setLoader(false)
            //   setLoading(false)
        }
    }

    const columns = useMemo(
        () => [
            {
                Header: "S.No",
                accessor: "serialNumber",
                disableFilters: true,
                filterable: false,
                Cell: cellProps => {
                    return <SerialNumber {...cellProps} />
                },
            },
            {
                Header: "User Name",
                accessor: "user_name",
                disableFilters: true,
                filterable: false,
                Cell: cellProps => {
                    return <UserName {...cellProps} />
                },
            },
            {
                Header: "Name",
                accessor: "name",
                disableGlobalFilter: true,
                disableSortBy: false, // if true the sortBy is disabled and remove sort icons
                filterable: true,
                Cell: cellProps => {
                    return <Name {...cellProps} />
                },
            },
            {
                Header: "User Email",
                accessor: "email",
                filterable: true,
                Cell: cellProps => {
                    return <Email {...cellProps} />
                },
            },
            {
                Header: "Phone Number",
                accessor: "phone_number",
                filterable: true,
                Cell: cellProps => {
                    return <PhoneNumber {...cellProps} />
                },
            },
            {
                Header: "Joining Date",
                accessor: "joining_date",
                filterable: true,
                Cell: cellProps => {
                    return <JoiningDate {...cellProps} />
                },
            },
            {
                Header: "Status",
                accessor: "status",
                filterable: true,
                Cell: cellProps => {
                    return <AcountStatus {...cellProps} />
                },
            },
            {
                Header: "Action",
                accessor: "",
                filterable: true,
                Cell: cellProps => {
                    return <Action {...cellProps} />
                },
            },
        ],
        []
    )

    const userStatusFilter = type => {
        setSelectedUserStatus(type)
        setIsUserStatusFilter(false)
    }

    const handleFilterUsers = async () => {
        try {
            let day = (startDate?.getDate() < 10 ? "0" : "") + startDate?.getDate()
            let month = (startDate?.getMonth() + 1 < 10 ? "0" : "") + (startDate?.getMonth() + 1)
            let year = startDate?.getFullYear()
            let from = year + "-" + month + "-" + day
            // setcomparefromDate(from)

            let day1 = (toDate?.getDate() < 10 ? "0" : "") + toDate?.getDate()
            let month1 = (toDate?.getMonth() + 1 < 10 ? "0" : "") + (toDate?.getMonth() + 1)
            let year1 = toDate?.getFullYear()
            let to = year1 + "-" + month1 + "-" + day1
            // setcomparetoDate(to)
            if (from > to || from == to) {
                toast.error("To date must be greater than From date", {
                    position: toast.POSITION.TOP_RIGHT,
                })
            } else {
                let param = new URLSearchParams({
                    Search_keyword: search,
                    Status: selectedUserStatus,
                    from: from,
                    to: to,
                })
                // setSpinner(true)
                setLoader(true)
                // setLoading(true)
                let res = await getTeamList(activeLevel, param)
                if (res) {
                    setLoader(false)
                    // setLoading(true)
                    // setddata(res?.data?.data?.data?.down)
                    // setudata(res?.data?.data?.data?.up)
                    // setdates(res?.data?.data?.data)
                    // setunit(res?.data?.data?.data?.unit)
                }
            }
        } catch (error) {
            setLoader(false)
            // setLoading(true)
            toast.error(error?.response?.data?.message, {
                position: toast.POSITION.TOP_RIGHT,
            })
        }
        // setrefresh(true)
    }

    const handleClearFilters = () => {
        setSearch("")
        setSelectedUserStatus("all")
        setStartDate("")
        settoDate("")
        handleAllUsersList()
    }

    useEffect(() => {
        console.log("pagination",pagination)
        if (pagination?.state) {
            handlePagination(pagination?.action)
        }
    }, [pagination])

    const handlePagination = async action => {
        setLoader(true)
        // setLoading(true)
        try {
            let data = ""
            if (action == "pageDropDown") {
                data = new URLSearchParams({
                    pagination: pageSizes,
                    level: activeLevel
                })
            } else {
                data = new URLSearchParams({
                    page: page,
                    pagination: pageSizes,
                    level: activeLevel
                })
            }

            let res = await getTeamList(data)
            setPageination({ state: false })
            let fullres = res
            console.log("full", fullres)
            // setUsersList(users)
            // setPageination({ state: false })
            // setLoader(false)
            // setTotalUsers(fullres?.total_records)
            // setHasMorePages(fullres?.has_more_pages)
            // setTotalPages(fullres?.total_pages)
            // setCurrentPage(fullres?.current_page)
            setLoader(false)
        } catch (error) {
            console.log("errors", error)
            setLoader(false)
        }
    }

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
                            <strong>My Team</strong>
                        </h2>
                    </div>
                    <div className="rs-product-left-title rs-product-left-title-wrap title-group">
                        <div className="dropdown-group">
                            <div className="dropdown">
                                <div className="top-center search">
                                    <div className="app-search d-none d-lg-block p-0">
                                        <div className="position-relative">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={search}
                                                placeholder={"Search"}
                                                onChange={e => {
                                                    // handleSearch(e?.target?.value)
                                                    setSearch(e?.target?.value)
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
                                                        setSearch("")
                                                    }}
                                                ></span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="dropdown">
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
                            </div>

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
                                    <button
                                        // title={
                                        //   comparefromDate >= comparetoDate
                                        //     ? "To date must be greater than Start date"
                                        //     : ""
                                        // }
                                        onClick={() => handleFilterUsers()}
                                        className="filter usage-filter"
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
                                        onClick={() => handleClearFilters()}
                                        className="filter usage-filter"
                                        disabled={spinner}
                                    >
                                        Clear
                                    </button>
                                </div>
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
                                                className={activeLevel === 1 ? "nav-link active buttoncustom" : "nav-link buttoncustom"}
                                                id="LevelOne-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#LevelOne"
                                                type="button"
                                                role="tab"
                                                aria-controls="LevelOne"
                                                aria-selected="true"
                                                onClick={() => handleTab(1)}
                                            >
                                                Level One
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button
                                                // disabled={loading}
                                                className={activeLevel === 2 ? "nav-link active buttoncustom" : "nav-link buttoncustom"}
                                                id="LevelTwo-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#LevelTwo"
                                                type="button"
                                                role="tab"
                                                aria-controls="LevelTwo"
                                                aria-selected="false"
                                                onClick={() => handleTab(2)}
                                            // onClick={rendergraph}
                                            >
                                                Level Two
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button
                                                // disabled={loading}
                                                className={activeLevel === 3 ? "nav-link active buttoncustom" : "nav-link buttoncustom"}
                                                id="LevelThree-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#LevelThree"
                                                type="button"
                                                role="tab"
                                                aria-controls="LevelThree"
                                                aria-selected="false"
                                                onClick={() => {
                                                    handleTab(3)
                                                }}
                                            >
                                                Level Three
                                            </button>
                                        </li>
                                    </ul>

                                </div>

                            </div>
                        </div>
                        {/* <div className="tab-content" id="myTabContent">
                            {activeLevel === "LevelOne" &&
                                <div
                                    className="tab-pane fade show active"
                                    id="LevelOne"
                                    role="tabpanel"
                                    aria-labelledby="LevelOne-tab"
                                >
                                    <LevelOne />
                                </div>}
                                {activeLevel === "LevelTwo" &&
                                <div
                                    className="tab-pane fade show active"
                                    id="LevelTwo"
                                    role="tabpanel"
                                    aria-labelledby="LevelTwo-tab"
                                >
                                    <LevelTwo />
                                </div>}
                                {activeLevel === "LevelThree" &&
                                <div
                                    className="tab-pane fade show active"
                                    id="LevelThree"
                                    role="tabpanel"
                                    aria-labelledby="LevelThree-tab"
                                >
                                    <LevelThree />
                                </div>}
                        </div> */}
                    </div>
                    <Row>
                        <Col xs="12">
                            <div className="table_v1 invoice-listing">
                                <TableContainer
                                    tableClassName="product-table table-shadow"
                                    columns={columns}
                                    data={usersList == undefined ? [] : usersList}
                                    isGlobalFilter={true}
                                    isAddCustomer={true}
                                    isAddTableBorderStrap={true}
                                    totalCount={totalUsers}
                                    setPageSizes={setPageSizes}
                                    hasMorePages={hasMorePages}
                                    totalPages={totalPages}
                                    currentPage={currentPage}
                                    //   handleCustomerClicks={handleCustomerClicks}
                                    setPage={setPage}
                                    setPageination={setPageination}
                                    getTablePropsC={() => ({
                                        className: "product-table ",
                                    })}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
            <TextLoader loading={loader} loader={loader} />
        </React.Fragment>
    )
}

export default MyTeam