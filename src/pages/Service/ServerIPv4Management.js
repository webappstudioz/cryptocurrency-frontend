import React, { useEffect, useState, useMemo } from "react";
import { Input } from "reactstrap";
import { useParams } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import ServiceNotFound from "../../components/Common/ServiceNotFound";
import { Col, Row, Modal } from "reactstrap";
import TableContainer from "../../components/Common/TableContainerCopy";
import reset from "../../assets/images/reset.svg";
import { NullRouted, Actions, DDOSStatus } from "../Common/CommonCol";
import { toast } from "react-toastify";

const ServerIPv4Management = (props) => {
  const [fullRes, setFullRes] = useState();
  const [chartLoader, setchartLoader] = useState(true);
  const [BarData, setBarData] = useState(""); /////set bar data incoming,outgoing from barchart component
  const [avgband, setavgband] = useState(""); /////set bar data incoming,outgoing from bandwidth component
  const [band95, setband95] = useState("");
  const [ipv4Search, setipv4Search] = useState("");
  const [ipv4Data, setIpv4Data] = useState("");
  const [loader, setLoader] = useState(true);
  const [loading, setLoading] = useState(0);
  const [UpdateIp, setUpdateIp] = useState("");
  const [ipv4Modal, setipv4Modal] = useState(false);
  const [DomianName, setDomianName] = useState("");
  const [DomainNameError, setDomainNameError] = useState(false);
  const [rescuespinner, setrescuespinner] = useState(false);
  const [serverDetail, setServerDetail] = useState({
    servername: "",
    serverId: "",
  });
  const [cancellationType, setcancellationType] = useState(
    "End of Billing Period"
  );
  const [cancelReason, setcancelReason] = useState("");
  const [cancelRequestalert, setcancelRequestalert] = useState(false);
  const [osreinstallPending, setosreinstallPending] = useState(false);
  const [rescuePending, setrescuePending] = useState(false);
  const [serverStatusSpinneer, setserverStatusSpinneer] = useState(true);
  const [RescueImageList, setRescueImageList] = useState([]);
  const [selectedRescueimage, setselectedRescueimage] = useState("");
  const [RescueSshKeys, setRescueSshKeys] = useState("");
  const [RescueScript, setRescueScript] = useState("");
  const [RescuePowerCycle, setRescuePowerCycle] = useState(false);
  const [RescueEmail, setRescueEmail] = useState(false);
  // const [SshKeyValid, setSshKeyValid] = useState("")
  const [SshKeyError, setSshKeyError] = useState(false);
  const params = useParams();
  useEffect(() => {
    setFullRes(props?.fullRes);
    setIpv4Data(props?.ipv4Data)
  }, [props]);

  function tog_Ipv4Modal(ip) {
    setUpdateIp(ip);
    setipv4Modal(!ipv4Modal);
    removeBodyCss();
  }

  function tog_backdrop() {
    setmodal_backdrop(!modal_backdrop);
    removeBodyCss();
  }

  function tog_backdrop_cancel() {
    setmodal_backdrop_cancel(!modal_backdrop_cancel);
    removeBodyCss();
  }

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  const UpdateIpApi = async () => {
    let statusparam = new URLSearchParams({
      action: "updateIP",
      service_id: serverDetail?.serverId != undefined && serverDetail?.serverId,
      ip: UpdateIp,
      reverseLookup: DomianName,
    });
    if (!DomianName) {
      statusparam.delete("reverseLookup");
    }
    try {
      setrescuespinner(true);
      let res = await deviceDetails(statusparam);
      if (res) {
        setrescuespinner(false);
        setipv4Modal(false);
        handleIPVmanageMent();

        toast.success(res.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      setrescuespinner(false);
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const hostnamevalid = (e) => {
    if (
      /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(e)
    ) {
      setDomainNameError(false);
    } else {
      setDomainNameError(true);
    }
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      height: 50,
      minHeight: 50,
    }),
  };

  const columns = useMemo(
    () => [
      {
        Header: "IP Address",
        accessor: "ip",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Gateway",
        accessor: "gateway",
        disableGlobalFilter: true,
        disableSortBy: false, // if true the sortBy is disabled and remove sort icons
        filterable: true,
      },
      {
        Header: "Null Routed",
        accessor: "nullRouted",
        filterable: true.valueOf,
        Cell: (cellProps) => {
          return (
            <NullRouted
              {...cellProps}
              recall={handleIPVmanageMent}
              loader={setLoader}
            />
          );
        },
      },
      {
        Header: "Reverse DNS",
        accessor: "reverseLookup",
        disableGlobalFilter: true,
        disableSortBy: false, // if true the sortBy is disabled and remove sort icons
        filterable: true,
      },
      {
        Header: "DDOS Protection",
        accessor: "ddos",
        disableGlobalFilter: true,
        disableSortBy: false, // if true the sortBy is disabled and remove sort icons
        filterable: true,
        Cell: (cellProps) => {
          return <DDOSStatus {...cellProps} />;
        },
      },
      {
        Header: "Actions",
        accessor: "actions",
        filterable: true.valueOf,
        Cell: (cellProps) => {
          return <Actions {...cellProps} togModal={tog_Ipv4Modal} />;
        },
      },
    ],
    []
  );


  const handleCustomerClicks = () => {};

  const handleIPVmanageMent = async (flag) => {
    try {
      let param = new URLSearchParams({
        service_id: params.id,
        action: "ips",
      });
      if (flag == "load") {
        // setinlineLoader(true)
        setLoader(true);
        setLoading(100);
      }
      let res = await deviceDetails(param);
      if (res) {
        if (flag == "load") {
          // setinlineLoader(true)
          setLoader(false);
          setLoading(100);
        }
        let data = res?.data?.data;
        setIpv4Data(data);
      }
    } catch (error) {
      if (flag == "load") {
        // setinlineLoader(true)
        setLoader(false);
        setLoading(100);
      }
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      // setinlineLoader(false)
    }
  };

  return (
    <React.Fragment>
    <div className="tab_content bg-transparent manage-tab">
                  {fullRes?.data?.data?.product?.status != "Active" ? (
                    <ServiceNotFound />
                  ) : (
                    <>
                      <Row className="server-search">
                        <Col md="10">
                          <div className="app-search d-none d-lg-block p-0 search-v1">
                            <div className="position-relative">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Filter for IP addresses"
                                value={ipv4Search}
                                onChange={(e) => handleIpv4Search(e)}
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    ipv4Search
                                      ? handleDebounceVal(ipv4Search)
                                      : handleIPVmanageMent("load");
                                  }
                                }}
                              />
                              <span
                                className="uil-search"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  ipv4Search
                                    ? handleDebounceVal(ipv4Search)
                                    : handleIPVmanageMent("load")
                                }
                              ></span>
                            </div>
                          </div>
                        </Col>
                        <Col md="2 text-end pl-0">
                          <a
                            style={{ cursor: "pointer" }}
                            className="btn-reset"
                            onClick={() => {
                              if (ipv4Search) {
                                setipv4Search("");
                                handleDebounceVal("");
                              }
                            }}
                          >
                            Reset <img src={reset} alt="" />
                          </a>
                        </Col>
                      </Row>
                      <div className="table_v1 table-management">
                        <TableContainer
                          tableClassName="product-table table-shadow"
                          columns={columns}
                          data={ipv4Data ? ipv4Data : []}
                          isGlobalFilter={true}
                          isAddCustomer={true}
                          isAddTableBorderStrap={true}
                          handleCustomerClicks={handleCustomerClicks}
                          getTablePropsC={() => ({
                            className: "product-table ",
                          })}
                        />
                      </div>
                    </>
                  )}
                  {/* </CardBody>
                  </Card> */}
                </div>

<Modal
isOpen={ipv4Modal}
toggle={() => {
  tog_Ipv4Modal();
}}
backdrop={"static"}
scrollable={false}
id="staticBackdrop"
className="modal_v1"
size="lg"
>
<div className="modal-header">
  <Row className="w-100">
    <Col xs="10">
      <h5 className="modal-title" id="staticBackdropLabel">
        Update IP ({UpdateIp})
      </h5>
    </Col>
    <Col xs="2">
      <div className="right-content text-end">
        <button
          type="button"
          className="btn-close buttoncustom"
          onClick={() => {
            setipv4Modal(false);
          }}
          aria-label="Close"
        ></button>
      </div>
    </Col>
  </Row>
</div>
<div className="modal-body">
  <div className="form-group select-v1">
    <label className="text-blue font-semibold d-block">
      Valid domain Name
    </label>
    <Input
      className="form-control bg-input"
      placeholder="hosted-by. redswitches.com "
      value={DomianName}
      onChange={(e) => {
        setDomianName(e.target.value);
        !e.target.value
          ? setDomainNameError(false)
          : hostnamevalid(e.target.value);
      }}
    ></Input>
    <p
      style={{ color: "red" }}
      className="font-16 font-normal text-color mt-2"
    >
      {DomainNameError &&
        "Please provide valid domain name e.g hosted.redswitches.com"}
    </p>
  </div>

  <div className="btn-group rescuesubmit">
    <button
      className="btn btn-primary btn-modal waves-effect waves-light d-flex justify-content-center align-items-center buttoncustom "
      style={{
        cursor:
          !DomainNameError && DomianName ? "pointer" : "not-allowed",
      }}
      type="submit"
      onClick={!DomainNameError && DomianName && UpdateIpApi}
      disabled={rescuespinner}
    >
      {rescuespinner ? (
        <div className="ui active inline loader"></div>
      ) : (
        "Launch"
      )}{" "}
    </button>
  </div>
</div>
</Modal>
</React.Fragment>
  );
};

export default ServerIPv4Management;
