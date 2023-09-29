import React, { Fragment } from "react";
import PropTypes from "prop-types";
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
  useRowSelect,
} from "react-table";
import { Table, Row, Col, Button, Input } from "reactstrap";
import { Filter, DefaultColumnFilter } from "./filters";
import left from "../../assets/images/left.svg";
import right from "../../assets/images/right.svg";

const TableContainer = ({
  columns,
  data,
  isGlobalFilter,
  isAddOrder,
  isAddTableWithoutBorderStrap,
  handleOrderClicks,
  isAddCustomer,
  isAddUsers,
  handleUserClicks,
  handleCustomerClicks,
  isAddTableBorderStrap,
  isAddInvoice,
  handleInvoiceClicks,
  totalCount,
  setPageSizes,
  // pageSize,
  hasMorePages,
  totalPages,
  currentPage,
  setPage,
  setPageination
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    // nextPage,
    // previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize },
    // state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  const generateSortingIndicator = (column) => {
    return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : "";
  };

  const onChangeInSelect = (event) => {
    setPageSize(Number(event.target.value));
    setPageSizes(Number(event.target.value))
    setPageination({state:true, action: "pageDropDown"})
  };

  const onChangeInInput = (event) => {
    const page = event.target.value ? Number(event.target.value) - 1 : 0;
    gotoPage(page);
  };

  const handlePreviousClick = (previous) => {
      setPage(previous -1)
      setPageination({state:true, action: "pageBtn"})
  }

  const handleNextClick = (next) => {
    setPage(next)
    setPageination({state:true, action: "pageBtn"})
  }

  return (
    <Fragment>


      <Row className="mb-3">
        {isGlobalFilter && (
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        )}
        {isAddUsers && (
          <Col sm="7">
            <div className="text-sm-end">
              <Button
                type="button"
                color="success"
                className="waves-effect waves-light mb-3 btn btn-success"
                onClick={handleUserClicks}
              >
                <i className="mdi mdi-plus me-1" />
                Add New
              </Button>
            </div>
          </Col>
        )}
        {isAddInvoice && (
          <Col sm="7">
            <div className="text-sm-end">
              <Button
                type="button"
                color="success"
                className="waves-effect waves-light mb-3 btn btn-success"
                onClick={handleInvoiceClicks}
              >
                <i className="mdi mdi-plus me-1" />
                Add Invoice
              </Button>
            </div>
          </Col>
        )}
        {isAddOrder && (
          <Col sm="7">
            <div className="text-sm-end">
              <Button
                type="button"
                color="success"
                className="waves-effect waves-light mb-3 btn btn-success"
                onClick={handleOrderClicks}
              >
                <i className="mdi mdi-plus me-1" />
                Add New Order
              </Button>
            </div>
          </Col>
        )}
      </Row>

      {isAddTableWithoutBorderStrap && (
        <div className="table-responsive">
          <Table bordered hover {...getTableProps()} className="react_table">
            <thead className="table-nowrap">
              {headerGroups.map((headerGroup) => (
                <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th key={column.id}>
                      <div className="mb-2" {...column.getSortByToggleProps()}>
                        {column.render("Header")}
                        {generateSortingIndicator(column)}
                      </div>
                      <Filter column={column} />
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <Fragment key={row.getRowProps().key}>
                    <tr>
                      {row.cells.map((cell) => {
                        return (
                          <td key={cell.id} {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}

      {isAddTableBorderStrap && (
        <div className="table-responsive">
          <Table
            className="table-centered datatable dt-responsive nowrap table-card-list react_table"
            {...getTableProps()}
          >
            <thead className="table-nowrap">
              {headerGroups.map((headerGroup) => (
                <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th key={column.id}>
                      <div className="mb-2" {...column.getSortByToggleProps()}>
                        {column.render("Header")}
                        {generateSortingIndicator(column)}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody {...getTableBodyProps()}>
              {page?.length? page.map((row) => {
                prepareRow(row);
                return (
                  <Fragment key={row.getRowProps().key}>
                    <tr>
                      {row.cells.map((cell) => {
                        return (
                          <td key={cell.id} {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  </Fragment>
                );
              }) : (<Fragment>
                <tr className="record-found">      
                  <td colSpan="7">
                    No Record Found
                  </td>               
                </tr>
              </Fragment>)}
            </tbody>
          </Table>
        </div>
      )}

      <Row className="table_footer">
        <Col md="6">
          <p className="total-page text-black-v2 font-small font-normal">Total Records: {totalCount || 0}</p>
        </Col>
        <Col md="6">
          <div className="table-footer-right-content d-flex align-items-center justify-content-end">
            <div className="d-flex table-footer-right-content">
              <div className="table-page-select d-flex align-items-center">
                <p className="m-0 pr-2">Rows per page:</p>
                <select
                  className="form-select"
                  value={pageSize}
                  onChange={onChangeInSelect}
                >
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="d-flex gap-1">
              <Button
                color="primary"
                onClick={() => {handlePreviousClick(currentPage)}}
                disabled={currentPage == 1? true : false}
              >
                {<img src={left} alt="" />}
              </Button>
            </div>
            <div className="page_index"> <p className="page-index text-blue font-semibold"> {currentPage}/{totalPages || 1}</p></div>
            <div className="d-flex gap-1">
              <Button color="primary" onClick={() => {handleNextClick(currentPage +1)}} disabled={!hasMorePages}>
                {<img src={right} alt="" />}
              </Button>
            </div>
          </div>
        </Col>
      </Row>

    </Fragment>
  );
};

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <React.Fragment>
      <Col sm={4}>
        {/* <div className="search-box me-2 mb-2 d-inline-block">
          <div className="position-relative">
            <label htmlFor="search-bar-0" className="search-label">
              <span id="search-bar-0-label" className="sr-only">
                Search this table
              </span>
              <input
                onChange={(e) => {
                  setValue(e.target.value);
                  onChange(e.target.value);
                }}
                id="search-bar-0"
                type="text"
                className="form-control"
                placeholder={`${count} records...`}
                value={value || ""}
              />
            </label>
            <i className="bx bx-search-alt search-icon"></i>
          </div>
        </div> */}
      </Col>


    </React.Fragment>
  );
}

TableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default TableContainer;
