import React, { Fragment } from "react";
import PropTypes from "prop-types";
import TextLoader from "../textLoader";
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
  TableCell,
  useRowSelect,
} from "react-table";
import { Table, Row, Col, Button } from "reactstrap";
import { Filter, DefaultColumnFilter } from "./filters";
import left from "../../assets/images/left.svg";
import right from "../../assets/images/right.svg";

const defaultTablePropGetter = () => ({})
const TableContainer = ({
  tableClassName = "",
  columns,
  data,
  totalCount,
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
  // tableLoader,
  // getTableProps = defaultTablePropGetter,
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
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      totalCount,
      // tableLoader,
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
    return !column?.disableSortBy && <div className="sort-icons"><UpIcon color={column?.isSorted && column?.isSortedDesc ? "#3F3D65": '#9F9EB2'}/><DownIcon color={column.isSorted && !column.isSortedDesc ? "#3F3D65": '#9F9EB2'}/></div> 
  };

  const onChangeInSelect = (event) => {
    setPageSize(Number(event?.target?.value));
  };

  const onChangeInInput = (event) => {
    const page = event?.target?.value ? Number(event?.target?.value) - 1 : 0;
    gotoPage(page);
  };

  return (
    <Fragment>


      <Row className="mb-3">
        {isGlobalFilter && (
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state?.globalFilter}
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
          <Table bordered hover {...getTableProps()} className={`react_table ${tableClassName}`}>
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
              {page.length?page.map((row) => {
                prepareRow(row);
                return (
                  <Fragment key={row.getRowProps().key}>
                    <tr>
                      {row?.cells?.map((cell) => {
                        return (
                          <td key={cell?.id} {...cell?.getCellProps()}>
                            {cell?.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  </Fragment>
                );
              }):(
                <TableCell>
                No data to display
                </TableCell>
              )}
            </tbody>
          </Table>
        </div>
      )}

      {isAddTableBorderStrap && (
        <div className="table-responsive">
          <Table
            className={`table-centered datatable dt-responsive nowrap table-card-list react_table ${tableClassName}`}
            {...getTableProps()}
          >
            <thead className="table-nowrap">
              {headerGroups.map((headerGroup) => (
                <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th key={column.id}>
                      <div {...column.getSortByToggleProps()}>
                        {column.render("Header")}
                        {generateSortingIndicator(column)}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
{/* className={tableLoader? "overlayerloader" : ""} */}
            <tbody {...getTableBodyProps()} >
              {page?.length > 0? page?.map((row) => {
                prepareRow(row);
                return (
                  <Fragment key={row.getRowProps().key}>
                    <tr>
                      {row?.cells.map((cell) => {
                        return (
                          <td key={cell?.id} {...cell?.getCellProps()}>
                            {cell?.render("Cell")} 
                          </td>
                        );
                      })}
                    </tr>
                  </Fragment>
                );
              }) : 
              (<Fragment>
                <tr className="record-found">      
                  <td colSpan="7">
                    No Record Found
                  </td>               
                </tr>
              </Fragment>)
              }
            </tbody>
          </Table>
              {/* {tableLoader? <TextLoader /> : ""} */}
        </div>
      )}

      <Row className="table_footer">
        <Col md="6">
          {/* 1-8 of {totalCount} */}
          <p className="total-page text-black-v2 font-small font-semibold">Total Records: {totalCount || 0}</p>
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
                onClick={previousPage}
                disabled={!canPreviousPage}
              >
                {<img src={left} alt="" />}
              </Button>
            </div>
            <div className="page_index"> <p className="page-index text-blue font-semibold"> {pageIndex + 1} / {pageOptions.length || 1}</p></div>
            <div className="d-flex gap-1">
              <Button color="primary" onClick={nextPage} disabled={!canNextPage}>
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
        <div className="search-box me-2 mb-2 d-inline-block">
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
        </div>
      </Col>


    </React.Fragment>
  );
}

TableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default TableContainer;

const DownIcon = ({color}) => {
  return <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4.39043 4.51196C4.19027 4.76216 3.80973 4.76216 3.60957 4.51196L0.649878 0.812348C0.387973 0.484966 0.621059 0 1.04031 0H6.95969C7.37894 0 7.61203 0.484966 7.35012 0.812348L4.39043 4.51196Z" fill={color}/>
  </svg>
}
const UpIcon = ({color}) => {
  return <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4.39043 0.488043C4.19027 0.23784 3.80973 0.23784 3.60957 0.488043L0.649878 4.18765C0.387973 4.51503 0.621059 5 1.04031 5H6.95969C7.37894 5 7.61203 4.51503 7.35012 4.18765L4.39043 0.488043Z" fill={color}/>
  </svg>
  
}