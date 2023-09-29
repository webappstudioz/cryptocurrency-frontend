import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types"; 
import "bootstrap/dist/css/bootstrap.min.css";
import TableContainer from "../../components/Common/TableContainerCopy"; 
import {
  CustomerId,
  Location,
  CustomerName,
  Date,
  Email,
  CustomerStatus,
} from "../Common/CommonCol";

//redux
import { useSelector, useDispatch } from "react-redux";
 
import {
  Col,
  Row,
  UncontrolledTooltip,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Input,
  FormFeedback,
  Label,
} from "reactstrap";


function Product() {
  const [modal, setModal] = useState(false);
  // const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [customerList, setCustomerList] = useState([]);
  const [customer, setCustomer] = useState([]);

 
  // const toggleViewModal = () => setModal1(!modal1);

  const customers = []
  const handleCustomerClicks = () => {
    
  };


  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "image",
        disableFilters: true,
        filterable: false,
        Cell: (cellProps) => {
          return <div className="table_icon"><img src={cellProps.row.original.image} /></div>;
        },
      },
      {
        Header: "Product/Service",
        accessor: "customerid",
        disableGlobalFilter: true,
        disableSortBy: false, // if true the sortBy is disabled and remove sort icons
        filterable: true,
        Cell: (cellProps) => {
          return <CustomerId {...cellProps} />;
        },
      },
      {
        Header: "IP Address",
        accessor: "ipAddress",
        filterable: true
      },
      {
        Header: "Location",
        accessor: "location",
        filterable: true,      
        Cell: (cellProps) => {
          return <Location {...cellProps} />;
        },
      },
      {
        Header: "Pricing",
        accessor: "pricing",
        filterable: true

      },
      // {
      //   Header: "Next Due",
      //   accessor: "nextDue",

      // },
      {
        Header: "Next Due",
        accessor: "nextDue",
        filterable: true,
        // formatter: (cellContent, row) => handleValidDate(row.joiningDate),
        Cell: (cellProps) => {
          return <Date {...cellProps} />;
        },
      },
      {
        Header: "Status",
        accessor: "customerStatus",
        filterable: true,
        Cell: (cellProps) => {
          return <CustomerStatus {...cellProps} />;
        },
      },      
    ],
    []
  );

  return (
    <React.Fragment>
      
      <div className="page-content dashboard product">
        <div className="container-fluid">          
          <Row>
            <Col xs="12">
              <div className="table_v1">
                <TableContainer
                  tableClassName="product-table table-shadow"
                  columns={columns}
                  data={customers}
                  isGlobalFilter={true}
                  isAddCustomer={true}
                  isAddTableBorderStrap={true}
                  handleCustomerClicks={handleCustomerClicks}
                  getTablePropsC={() => ({
                    className: "product-table "
                  })}
                />
              </div>
            </Col>
          </Row>
        
        </div>
      </div>
    </React.Fragment>
  );
}
Product.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default Product;
