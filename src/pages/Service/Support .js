import React, { useEffect, useMemo, useState } from "react";
import Vector1 from "../../assets/images/Vector1.svg";
import status from "../../assets/images/status.png";
import TableContainer from "../../components/Common/TableContainerCopy";
import { Col, Row, Dropdown, DropdownMenu, DropdownItem } from "reactstrap";
import TextLoader from "../../components/textLoader";
import {
  getSupportDepartment,
  getTicketListing,
  userRole,
} from "../../pages/Authentication/store/apiServices";
import { Department, Status, Subject, Number, LastUpdated } from "./SupportCol";
import { setPageTitle } from "../../helpers/api_helper_rs";
import PermissionDenied from "../Authentication/PermissionDenied";
import { isSupportTicketsFetched } from "../../store/supportTickets/actions"
import { useSelector, useDispatch } from "react-redux";

function Support() {
  const dispatch = useDispatch();
  const ticketsInfo = useSelector(state => state?.supportTickets)
  const [statusFilterOpen, setstatusFilterOpen] = useState(false);
  const [departmentFilterOpen, setdepartmentFilterOpen] = useState(false);
  const [dateFilterOpen, setdateFilterOpen] = useState(false);
  const [TechnicalDropdown, setTechnicalDropdown] = useState([]);
  const [defaultTicketList, setdefaultTicketList] = useState([]);
  const [TicketList, setTicketList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [loading, setLoading] = useState(true);
  const [StatusArray, setStatusArray] = useState([]);
  const [selectedDate, setselectedDate] = useState("all");
  const [depLabel, setdepLabel] = useState("All");
  const [permission, setPermission] = useState(ticketsInfo?.tickets?.tickets_view);
  const [checkboxValues, setCheckboxValues] = useState({
    Open: false,
    Closed: false,
    Pending: false,
    Resolved: false,
  });
  const [loggedIn, setloggedIn] = useState(
    localStorage.getItem("authUser") ? true : false
  );
  const [filterArray, setFilterArray] = useState({
    status: [],
    department: "all",
    time: "All Time",
  });

  useEffect(async () => {
    setPageTitle("Support");
    let roleInfo = await userRole();
    roleInfo == "client" && setPermission(true);
    // setRole(roleInfo);
    !loggedIn && history.push("/support-ticket");
    getTechnicallist();
    // getTicketList();
  }, []);

  useEffect(() => {
    filterApply();
  }, [filterArray]);

  useEffect(() => {
    ticketsInfo?.fetched? (setTicketList(ticketsInfo?.tickets?.tickets), setLoading(false), setLoader(false)) : getTicketList();
  },[ticketsInfo?.fetched])

  const getTechnicallist = async () => {
    try {
      let res = await getSupportDepartment();
      if (res) {
        setTechnicalDropdown(res?.data?.data);
      }
    } catch (err) {}
  };

  const getTicketList = async () => {
    try {
      let res = await getTicketListing();
      if (res) {
        let info = res?.data?.data
        setPermission(info?.tickets_view);
        setTicketList(info?.tickets);
        dispatch(isSupportTicketsFetched(info))
        setdefaultTicketList(
          JSON.parse(JSON.stringify(info?.tickets))
        );
        setLoader(false);
        setLoading(false);
      }
    } catch (err) {
      setLoader(false);
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: " #",
        accessor: "ticket_id",
        disableFilters: true,
        filterable: false,
        Cell: (cellProps) => {
          return <Number {...cellProps} />;
        },
      },
      {
        Header: "Department",
        accessor: "department",
        disableGlobalFilter: true,
        disableSortBy: false, // if true the sortBy is disabled and remove sort icons
        filterable: true,
        Cell: (cellProps) => {
          return <Department {...cellProps} />;
        },
      },

      {
        Header: (
          <span style={{ display: "contents" }}>
            <span>Status</span>
            <span style={{ display: "contents" }}>
              {/* <img src={status} /> */}
            </span>
          </span>
        ),
        accessor: "status",
        filterable: false,
        disableSortBy: true,
        Cell: (cellProps) => {
          return <Status {...cellProps} />;
        },
      },
      {
        Header: "Subject",
        accessor: "title",
        filterable: true,
        Cell: (cellProps) => {
          return <Subject {...cellProps} />;
        },
      },
      {
        Header: "Last Updated",
        accessor: "last_updated",
        filterable: true,
        Cell: (cellProps) => {
          return <LastUpdated {...cellProps} />;
        },
      },
    ],
    []
  );

  const handleCheckboxChange = (event) => {
    const { id } = event.target;
    setCheckboxValues((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const clearfilter = () => {
    setCheckboxValues({
      Open: false,
      Closed: false,
      Pending: false,
      Resolved: false,
    });
  };

  const filterApply = () => {
    let arr = [...defaultTicketList];
    let filteredData = arr.filter((item) => {
      if (
        filterArray.status.length > 0 &&
        !filterArray.status.includes(item.status)
      ) {
        return false;
      }
      if (
        filterArray.department !== "all" &&
        filterArray.department !== item.department
      ) {
        return false;
      }
      if (filterArray?.time === "today") {
        return item.formatdate === new Date().toISOString().slice(0, 10);
      } else if (filterArray?.time === "last_7days") {
        let last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        return new Date(item?.formatdate) >= last7Days;
      } else if (filterArray?.time === "last_1month") {
        let lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return new Date(item?.formatdate) >= lastMonth;
      } else if (filterArray.time === "last_12month") {
        let last12Months = new Date();
        last12Months.setFullYear(last12Months.getFullYear() - 1);
        return new Date(item?.formatdate) >= last12Months;
      } else {
        return true;
      }
    });
    setTicketList(filteredData);
  };

  const departmentFilter = async (id, name) => {
    setdepLabel(name);
    if (name === "All") {
      name = "all";
    }
    setdepartmentFilterOpen(false);
    setFilterArray({ ...filterArray, department: name });
  };

  const applyFilter = async () => {
    setstatusFilterOpen(false);
    const arr = Object.entries(checkboxValues)
      .filter(([key, value]) => value === true)
      .map(([key]) => key);
    setStatusArray(arr);
    setFilterArray({ ...filterArray, status: arr });

    filterApply();
  };

  const DateFilter = async (date) => {
    setdateFilterOpen(false);
    setselectedDate(date);
    setFilterArray({ ...filterArray, time: date });
    filterApply("d", date);
  };

  return (
    <div>
      <section className="rs-product-home-section rs-product-section">
        <div className="rs-product-left">
          <div className="rs-product-left-title rs-product-left-title-wrap title-group">
            <h2>Support Ticket ✨</h2>
            {!permission ? (
              ""
            ) : (
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
                            id="Open"
                            onClick={handleCheckboxChange}
                            checked={checkboxValues["Open"]}
                            onChange={() => {}}
                          />
                          <label className="form-check-label" htmlFor="Open">
                            Open
                          </label>
                        </div>
                      </li>
                      <li>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="Closed"
                            checked={checkboxValues["Closed"]}
                            onClick={handleCheckboxChange}
                            onChange={() => {}}
                          />
                          <label className="form-check-label" htmlFor="Closed">
                            Closed
                          </label>
                        </div>
                      </li>
                      <li>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="Pending"
                            checked={checkboxValues["Pending"]}
                            onClick={handleCheckboxChange}
                            onChange={() => {}}
                          />
                          <label className="form-check-label" htmlFor="Pending">
                            Pending
                          </label>
                        </div>
                      </li>
                      <li>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="Resolved"
                            checked={checkboxValues["Resolved"]}
                            onClick={handleCheckboxChange}
                            onChange={() => {}}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="Resolved"
                          >
                            Resolved
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
                    isOpen={departmentFilterOpen}
                    toggle={() =>
                      setdepartmentFilterOpen(!departmentFilterOpen)
                    }
                  >
                    <button
                      className="btn btn-primary dropdown-toggle"
                      type="button"
                      data-toggle="dropdown"
                      onClick={() =>
                        setdepartmentFilterOpen(!departmentFilterOpen)
                      }
                    >
                      {depLabel}
                      <span className="caret" />
                    </button>
                    <DropdownMenu className="outerdiv">
                      <li onClick={() => departmentFilter("all", "All")}>
                        {/* <div className="form-check custom-checkbox"> */}
                          <label
                            className="form-check-label"
                            htmlFor="technical"
                          >
                            All
                          </label>
                        {/* </div> */}
                      </li>
                      <DropdownItem divider />
                      {TechnicalDropdown?.map((el, index) => {
                        return (
                          <div key={index}>
                            <li
                              onClick={() => departmentFilter(el.id, el.name)}
                            >
                              {/* <div className="form-check custom-checkbox"> */}
                                <label
                                  className="form-check-label"
                                  htmlFor="technical"
                                >
                                  {el.name}
                                </label>
                              {/* </div> */}
                            </li>
                            <DropdownItem divider />
                          </div>
                        );
                      })}
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
                      {selectedDate == "all"
                        ? "All Time"
                        : selectedDate == "last_7days"
                        ? "Last 7 Days"
                        : selectedDate == "last_1month"
                        ? "Last Month"
                        : selectedDate == "last_12month"
                        ? "Last 12 Months"
                        : selectedDate == "today"
                        ? "Today"
                        : ""}
                      <span className="caret" />
                    </button>
                    <DropdownMenu className="outerdiv">
                      <>
                        <li onClick={() => DateFilter("today")}>
                          {/* <div className="form-check custom-checkbox"> */}
                            <label className="form-check-label" htmlFor="today">
                              Today
                            </label>
                          {/* </div> */}
                        </li>
                        <DropdownItem divider />
                        <li onClick={() => DateFilter("last_7days")}>
                          {/* <div className="form-check custom-checkbox"> */}
                            <label
                              className="form-check-label"
                              htmlFor="7-days"
                            >
                              Last 7 Days
                            </label>
                          {/* </div> */}
                        </li>
                        <DropdownItem divider />
                        <li onClick={() => DateFilter("last_1month")}>
                          {/* <div className="form-check custom-checkbox"> */}
                            <label
                              className="form-check-label"
                              htmlFor="last-month"
                            >
                              Last Month
                            </label>
                          {/* </div> */}
                        </li>
                        <DropdownItem divider />
                        <li onClick={() => DateFilter("last_12month")}>
                          {/* <div className="form-check custom-checkbox"> */}
                            <label
                              className="form-check-label"
                              htmlFor="12-months"
                            >
                              Last 12 Months
                            </label>
                          {/* </div> */}
                        </li>
                        <DropdownItem divider />
                        <li onClick={() => DateFilter("all")}>
                          {/* <div className="form-check custom-checkbox"> */}
                            <label
                              className="form-check-label"
                              htmlFor="all-time"
                            >
                              All Time
                            </label>
                          {/* </div> */}
                        </li>
                        <DropdownItem divider />
                      </>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          className={loader ? "support-table overlayerloader" : "support-table"}
        >

          {(permission != undefined && !permission) ? (
            <PermissionDenied />
          ) : (
            <>
              <Row>
                <Col xs="12">
                  <div className="table_v1">
                    <TableContainer
                      tableClassName="product-table table-shadow"
                      columns={columns}
                      totalCount={TicketList.length}
                      data={TicketList}
                      isGlobalFilter={true}
                      isAddCustomer={true}
                      isAddTableBorderStrap={true}
                      getTablePropsC={() => ({
                        className: "product-table ",
                      })}
                    />
                  </div>
                </Col>
              </Row>
            </>
          )}
        </div>
      </section>
      <TextLoader loading={loading} loader={loader}/>
    </div>
  );
}

export default Support;
