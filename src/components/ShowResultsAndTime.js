import React, { useEffect, useMemo, useState } from "react";
import { Col } from "reactstrap";
import { getGameResults, loginData } from "../pages/Authentication/store/apiServices";
import { RedNumbers, BlackNumbers } from "../constants/gameNumbers";
import { TableContainer } from "@material-ui/core";
import ResultsTableContainer from "./Common/ResultsTable";
import { Amount, GameDate, SerialNumber, TimeSlot, Winner } from "../pages/GameResults/resultCol";
import GameResultsOnLoginContainer from "./Common/GameResultsOnLogin";
import { Time } from "../pages/Common/CommonCol";
const ShowResultsAndTime = () => {
  const userInfo = loginData()
    const [gameResults, setGameResults] = useState("")
    const [invoice, setInvoice] = useState()
    const [totalInvoices, setTotalInvoices] = useState()
    const [pageSizes, setPageSizes] = useState(10)
    const [hasMorePages, setHasMorePages] = useState(false)
    const [totalPages, setTotalPages] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const [page, setPage] = useState(1)
    const [pagination, setPageination] = useState({ state: false, action: "" })

    useEffect(() => {
        getResults()
    }, [])


    const columns = useMemo(
        () => [
            {
                Header: "Result",
                accessor: "serialNumber",
                disableFilters: true,
                filterable: false,
                Cell: cellProps => {
                  return <SerialNumber {...cellProps} />
                },
            },
            {
                Header: "Winner",
                accessor: "winner",
                disableGlobalFilter: true,
                disableSortBy: false, // if true the sortBy is disabled and remove sort icons
                filterable: true,
                Cell: cellProps => {
                  return <Winner {...cellProps} />
                },
            },
            {
                Header: "Time Slot",
                accessor: "timeSlot",
                disableGlobalFilter: true,
                disableSortBy: false, // if true the sortBy is disabled and remove sort icons
                filterable: true,
                Cell: cellProps => {
                  return <TimeSlot {...cellProps} />
                },
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
                Cell: cellProps => {
                  return <Amount {...cellProps} />
                },
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

    const getResults = async () => {
        try {
            let res = await getGameResults()
            let info = res?.data?.data
            setGameResults(info)
        } catch (error) {
        }
    }

    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        // Function to update the date and time
        const updateDateTime = () => setDateTime(new Date());

        // Set up an interval to update the date and time every second
        const timerId = setInterval(updateDateTime, 1000);

        // Clean up the interval when the component is unmounted
        return () => clearInterval(timerId);
    }, []);

    // Format date and time
    const formattedDate = dateTime.toLocaleDateString();
    const formattedTime = dateTime.toLocaleTimeString();

    const TableData = [
        {
            serialNumber: 1,
            winner: 21,
            timeSlot: "09:30pm",
            date: "1/8/24",
            amount: 100
        },
        {
            serialNumber: 2,
            winner: 21,
            timeSlot: "09:30pm",
            date: "1/8/24",
            amount: 100
        },
        {
            serialNumber: 3,
            winner: 21,
            timeSlot: "09:30pm",
            date: "1/8/24",
            amount: 100
        }, {
            serialNumber: 4,
            winner: 21,
            timeSlot: "09:30pm",
            date: "1/8/24",
            amount: 100
        },
        {
            serialNumber: 5,
            winner: 21,
            timeSlot: "09:30pm",
            date: "1/8/24",
            amount: 100
        },
        {
            serialNumber: 6,
            winner: 21,
            timeSlot: "09:30pm",
            date: "1/8/24",
            amount: 100
        },
        {
            serialNumber: 7,
            winner: 21,
            timeSlot: "09:30pm",
            date: "1/8/24",
            amount: 100
        },
        {
            serialNumber: 8,
            winner: 21,
            timeSlot: "09:30pm",
            date: "1/8/24",
            amount: 100
        },
        {
            serialNumber: 9,
            winner: 21,
            timeSlot: "09:30pm",
            date: "1/8/24",
            amount: 100
        },
        {
            serialNumber: 10,
            winner: 21,
            timeSlot: "09:30pm",
            date: "1/8/24",
            amount: 100
        },
    ]
    return (
        <>
            <div className="slide-content">
                <div className="login-date-time">
                    <div className="login-date-div">
                        <h1>Date :</h1>
                        <p>{formattedDate}</p>
                    </div>
                    <div className="login-date-div">
                        <h1>Time :</h1>
                        <p>{formattedTime}</p>
                    </div>
                </div>
                <div className="inner-content">
                    {/* <h3 className="text-white">Comming Soon</h3> */}
                </div>
            </div>
            <div className="results-login-page">
                <div className="login-left-wrapper">
                    {/* {gameResults ? gameResults?.map((result, index) => {
                        return (
                            
                        )
                    }) : null} */}

<div className="login-left-input" >
                                <Col lg={12}>
                                    <label>{"result?.time_zone"}</label>
                                    <input
                                        type="text"
                                        className= {"form-control redNumber"}
                                        name="zoneOne"
                                        defaultValue={1}
                                        disabled
                                    />

                                </Col>
                            </div>
                            <div className="login-left-input" >
                                <Col lg={12}>
                                    <label>{"result?.time_zone"}</label>
                                    <input
                                        type="text"
                                        className= {"form-control redNumber"}
                                        name="zoneOne"
                                        defaultValue={1}
                                        disabled
                                    />

                                </Col>
                            </div>
                            <div className="login-left-input" >
                                <Col lg={12}>
                                    <label>{"result?.time_zone"}</label>
                                    <input
                                        type="text"
                                        className= {"form-control redNumber"}
                                        name="zoneOne"
                                        defaultValue={1}
                                        disabled
                                    />

                                </Col>
                            </div>
                            <div className="login-left-input" >
                                <Col lg={12}>
                                    <label>{"result?.time_zone"}</label>
                                    <input
                                        type="text"
                                        className= {"form-control redNumber"}
                                        name="zoneOne"
                                        defaultValue={1}
                                        disabled
                                    />

                                </Col>
                            </div>
                            <div className="login-left-input" >
                                <Col lg={12}>
                                    <label>{"result?.time_zone"}</label>
                                    <input
                                        type="text"
                                        className= {"form-control redNumber"}
                                        name="zoneOne"
                                        defaultValue={1}
                                        disabled
                                    />

                                </Col>
                            </div>
                            <div className="login-left-input" >
                                <Col lg={12}>
                                    <label>{"result?.time_zone"}</label>
                                    <input
                                        type="text"
                                        className= {"form-control redNumber"}
                                        name="zoneOne"
                                        defaultValue={1}
                                        disabled
                                    />

                                </Col>
                            </div>
                            <div className="login-left-input" >
                                <Col lg={12}>
                                    <label>{"result?.time_zone"}</label>
                                    <input
                                        type="text"
                                        className= {"form-control redNumber"}
                                        name="zoneOne"
                                        defaultValue={1}
                                        disabled
                                    />

                                </Col>
                            </div>
                            <div className="login-left-input" >
                                <Col lg={12}>
                                    <label>{"result?.time_zone"}</label>
                                    <input
                                        type="text"
                                        className= {"form-control redNumber"}
                                        name="zoneOne"
                                        defaultValue={1}
                                        disabled
                                    />

                                </Col>
                            </div>
                            <div className="login-left-input" >
                                <Col lg={12}>
                                    <label>{"result?.time_zone"}</label>
                                    <input
                                        type="text"
                                        className= {"form-control redNumber"}
                                        name="zoneOne"
                                        defaultValue={1}
                                        disabled
                                    />

                                </Col>
                            </div>
                            <div className="login-left-input" >
                                <Col lg={12}>
                                    <label>{"result?.time_zone"}</label>
                                    <input
                                        type="text"
                                        className= {"form-control redNumber"}
                                        name="zoneOne"
                                        defaultValue={1}
                                        disabled
                                    />

                                </Col>
                            </div>        

                    {/* <div className="login-left-input">
                        <Col lg={12}>
                            <div className="table_v1 invoice-listing">
                                <GameResultsOnLoginContainer
                                    tableClassName="product-table table-shadow"
                                    columns={columns}
                                    data={TableData == undefined ? [] : TableData}
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
                    </div> */}
                </div>
            </div>
        </>
    )
}
// className={RedNumbers?.includes(result?.winning_Number) ? "form-control redNumber" : BlackNumbers?.includes(result?.winning_Number) ? "form-control blackNumber" : "form-control"}

export default ShowResultsAndTime;