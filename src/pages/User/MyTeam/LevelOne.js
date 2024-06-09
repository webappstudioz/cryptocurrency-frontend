import React from "react"
import { Col, Row, DropdownMenu, DropdownItem, Dropdown } from "reactstrap"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import TableContainer from "./Table/MyTeamTableContainer"

const LevelOne = () => {

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
    return (
        <React.Fragment>
            <div className="page-content invoice">
                <div className="container-fluid">
                    <div className="rs-product-left-title rs-product-left-title-wrap title-group">
                        <h2>
                            <strong>Level One</strong>
                        </h2>
                    </div>
                    <Row>
                        <Col xs="12">
                            <div className="table_v1 invoice-listing">
                                <TableContainer
                                    tableClassName="product-table table-shadow"
                                    columns={columns}
                                    data={allUsers == undefined ? [] : allUsers}
                                    isGlobalFilter={true}
                                    isAddCustomer={true}
                                    isAddTableBorderStrap={true}
                                    totalCount={totalUsers}
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
                </div>
            </div>
        </React.Fragment>
    )
}

export default LevelOne