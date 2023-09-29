import React, { useState, useEffect } from "react";
import calendar from "../../assets/images/calendar.png";
import star from "../../assets/images/star.png";
import setting from "../../assets/images/setting.png";
import arrow from "../../assets/images/Arrow-forward.png";
import generic from "../../assets/images/icon-generic.png";
import rederror from "../../assets/images/redvalidationicon/rederror.jpg";
import { Modal, Col, Row } from "reactstrap";
import { toast } from "react-toastify";
import close from "../../assets/images/close-fill.svg";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import TextLoader from "../../components/textLoader";
import {
  loginData,
  replyTicket,
  ticketView,
  CloseTicket,
} from "../Authentication/store/apiServices";
import file from "../../assets/images/file.png";
import del from "../../assets/images/Delete.svg";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import { useHistory } from "react-router-dom";

function TicketView() {
  const location = useLocation()
  const ticketId = location?.state?.id
  let history = useHistory();
  const [details, setdetails] = useState("");
  const [loader, setLoader] = useState(true);
  const [loading, setLoading] = useState("");
  const [userData, setUserData] = useState();
  const [selectedFile, setSelectedFile] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [inputKey, setInputKey] = useState(0);
  const [conversations, setconversations] = useState([]);
  const [modal, setmodal] = useState(false);
  const [inputError, setInputError] = useState();
  const [mess, setmess] = useState("");
  const [serverip, setserverip] = useState("");
  const [spinner, setSpinner] = useState({cancelBtn: false, submitBtn: false})
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const ipAddressPattern = /^(\d{1,3}\.){3}\d{1,3}$/;

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    const contentState = newEditorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    const html = draftToHtml(rawContentState);
    setmess(html);
    const text = convertFromRaw(rawContentState).getPlainText();
    if (text.length < 50) {
      setInputError("Message must be at least 50 characters.");
    } else {
      setInputError("");
    }
  };
  useEffect(async () => {
    getDetail();
    let loginDetail = loginData();
    setUserData(loginDetail);
  }, []);

  const getDetail = async () => {
    let id = ticketId;
    setLoading(true)
    try {
      let res = await ticketView(id);
      if (res) {
        setLoader(false);
        setLoading(false)
        setdetails(res?.data?.data);
        let arr = res?.data?.data?.conversations;
        arr.reverse();
        setconversations(arr);
        {
          res?.data?.data?.tags?.map((element, index) => {
            if (ipAddressPattern.test(element)) {
              setserverip(element);
            }
          });
        }
      }
    } catch (err) {
      setLoader(false);
      setLoading(false)
      toast.error(err?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      history.push("/support");
    }
  };

  const closeticket = async () => {
    try {
      let params = new URLSearchParams({ ticket_id: ticketId });
      setLoading(true)
      setSpinner({cancelBtn: true, submitBtn: false})
      let res = await CloseTicket(params);
      if (res) {
        toast.success(res.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setLoading(false)
        setSpinner({cancelBtn: false, submitBtn: false})
        getDetail();
      }
    } catch (err) {
      setLoading(false)
      setSpinner({cancelBtn: false, submitBtn: false})
      toast.error(err?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSize = file.size / 1024 / 1024; // in MB
      const fileType = file.type.split("/")[1]; // get file extension

      // Validate file size (10MB max)
      if (fileSize > 20) {
        setErrorMsg("File size should be less than 20 MB");
      } else {
        // Validate file extension
        if (
          fileType === "jpg" ||
          fileType === "jpeg" ||
          fileType === "png" ||
          fileType === "pdf" ||
          fileType === "doc" ||
          fileType === "xls" ||
          fileType === "zip"
        ) {
          setSelectedFile([...selectedFile, file]);
          // setSelectedFile(file);
          setErrorMsg("");
        } else {
          setErrorMsg(
            "Only JPG, PNG, PDF, DOC, XLS, and ZIP files are allowed"
          );
        }
      }
    }
  };

  const delImage = (index) => {
    let arr = [...selectedFile];
    arr.splice(index, 1);
    setSelectedFile(arr);
    if (selectedFile.length == 1) {
      setSelectedFile([]);
      setInputKey((prevKey) => prevKey + 1);
    }
  };
  
  const replyToticket = async () => {
    let formData = new FormData();
    if (selectedFile.length > 0) {
      for (let i = 0; i < selectedFile.length; i++) {
        formData.append("attachments[]", selectedFile[i]);
      }
    }
    formData.append("from_email", userData.email);
    formData.append("group_id", details.group_id);
    formData.append("body", mess);
   
    if(mess?.length > 0) {
    try {
      setSpinner({cancelBtn: false, submitBtn: true})
      setLoading(true)
      let res = await replyTicket(ticketId, formData);
      if (res) {
        setSpinner({cancelBtn: false, submitBtn: false})
        setLoading(false)
        setEditorState(() => EditorState.createEmpty());
        setSelectedFile([]);
        toast.success(res.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        getDetail();
        setmess("")
      }
    } catch (err) {
      setLoading(false)
      setSpinner({cancelBtn: false, submitBtn: false})
      toast.error(err?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }else {
    setInputError("Please enter your message")
    toast.error("Please enter your message", {
      position: toast.POSITION.TOP_RIGHT,
    });
  }
  };

  const handleDownload = (e, url, fileName) => {
    e.preventDefault();
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className={loader ? "view-ticket overlayerloader" : "view-ticket"}>
        <section className="rs-product-home-section rs-product-section">
          <div className="rs-product-left">
            <div className="rs-product-left-title rs-product-left-title-wrap">
              <div className="rs-product-left-link">
                <Link to="/support">
                  <i className="feather icon-arrow-left" />
                  back to Support Ticket List
                </Link>
              </div>
              <div className="ticket-subject">
                <h2>
                  #{details?.ticket_id} - {details?.subject} ✨
                </h2>
                <span className="open">{details?.status}</span>
                {/* {details?.tags?.map((element, index) => {
                  return (
                    <span className="open" style={{backgroundColor:"#6464fd"}} key={index + "tag"}>
                      {element}
                    </span>
                  );
                })} */}
              </div>
            </div>
            <div className="rs-product-price ticket-view">
              <div className="rs-product-price-card">
                <div className="rs-product-price-box">
                  <div className="rs-product-price-box-img">
                    <img src={setting} />
                  </div>
                  <div className="rs-product-price-box-content application-server">
                    <p>Department</p>
                    <h5>{details?.department}</h5>
                  </div>
                </div>
                <div className="rs-product-price-box">
                  <div className="rs-product-price-box-img ip">
                    <img src={star} />
                  </div>
                  <div className="rs-product-price-box-content">
                    <p>Server IP</p>
                    <h5>{serverip?serverip:"-"}</h5>
                  </div>
                </div>
                <div className="rs-product-price-box">
                  <div className="rs-product-price-box-img location">
                    <img src={calendar} />
                  </div>
                  <div className="rs-product-price-box-content">
                    <p>Last Updated</p>
                    <h5>{details?.last_updated}</h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="rs-product-left-contentbar rs-product-left-contentbar-wrap">
              <div className="row">
                {details?.status != "Closed" && (
                  <div className="col-lg-12">
                    <div className="rs-read-announcements-card open-ticket ticket-view-body">
                      <div className="rs-read-announcements-card-body">
                        <div className="sender">
                          <div className="box-img">
                            {userData
                              ? userData?.first_name?.charAt(0)?.toUpperCase()
                              : ""}
                            {userData
                              ? userData?.last_name?.charAt(0)?.toUpperCase()
                              : ""}
                          </div>
                          <div className="info">
                            <h5>
                              {userData
                                ? userData?.first_name
                                    ?.charAt(0)
                                    ?.toUpperCase() +
                                  userData?.first_name?.slice(1).toLowerCase()
                                : ""}{" "}
                              {userData
                                ? userData?.last_name
                                    ?.charAt(0)
                                    ?.toUpperCase() +
                                  userData?.last_name?.slice(1).toLowerCase()
                                : ""}
                            </h5>
                            <span className="time">Write a message</span>
                          </div>
                        </div>
                        <div className="rs-read-announcements-card-content">
                          <div className="row">
                            <div className="col-lg-12 form-group text-editor-ticket">
                              <Editor
                                editorState={editorState}
                                onEditorStateChange={onEditorStateChange}
                                toolbar={{
                                  options: [
                                    "inline",
                                    // "textAlign",
                                    "list",
                                    "link",
                                    "image",
                                    "embedded",
                                  ],
                                  inline: {
                                    options: ["bold", "italic", "underline"],
                                  },
                                  // textAlign: {
                                  //   options: [
                                  //     "left",
                                  //     "center",
                                  //     "right",
                                  //     "justify",
                                  //   ],
                                  // },
                                  link: {
                                    options: ["link"],
                                  },
                                  image: {
                                    urlEnabled: true,
                                    uploadEnabled: true,
                                    alignmentEnabled: true,
                                    previewImage: false,
                                    inputAccept:
                                      "image/gif,image/jpeg,image/jpg,image/png,image/svg",
                                    alt: { present: false, mandatory: false },
                                    defaultSize: {
                                      height: "100px",
                                      width: "100px",
                                    },
                                  },
                                  list: { options: ["ordered", "unordered"] },
                                  embedded: {
                                    defaultSize: {
                                      height: "auto",
                                      width: "auto",
                                    },
                                  },
                                }}
                              />
                            </div>
                            {inputError && (
                              <span className="ticket-validaton-error">
                                {" "}
                                <img
                                  className="form-error-icon"
                                  src={rederror}
                                  alt=""
                                  height={15}
                                />
                                {inputError}
                              </span>
                            )}
                            <div className="col-lg-6 form-group mb-4">
                              <p className="place-holder">Attachments</p>
                              <label
                                htmlFor="file-upload"
                                className="custom-file-upload form-control"
                              >
                                {selectedFile?.length > 0 ? (
                                  <p> Add More +</p>
                                ) : (
                                  <img src={file} alt="Upload file icon" />
                                )}
                                <input
                                  disabled={loading}
                                  key={inputKey}
                                  id="file-upload"
                                  type="file"
                                  accept=".jpg,.jpeg,.png,.pdf,.doc,.xls,.zip"
                                  onChange={handleFileChange}
                                  onClick={(event) => {
                                    if (
                                      event.target.files
                                      //   .length === 1 &&
                                      // event.target.files[0].name ===
                                      //   selectedFile[selectedFile.length - 1]
                                      //     ?.name
                                    ) {
                                      event.target.value = null;
                                    }
                                  }}
                                  // multiple
                                />
                                {/* <button>Add more +</button> */}
                              </label>
                              <span className="file-formats">
                                Please select files to attach (20 MB max, .jpg,
                                .png, .pdf, .doc, .xls, .zip)
                              </span>
                              {/* {
                              <div>
                                <strong>Selected File : </strong>{" "}
                                {selectedFile ? selectedFile.name : "none"}{" "}
                                <span
                                  onClick={() => {
                                    setSelectedFile("");
                                    setInputKey((prevKey) => prevKey + 1);
                                  }}
                                  style={{ color: "red", cursor: "pointer" }}
                                >
                                  {selectedFile && "X"}
                                </span>
                              </div>
                            } */}
                              {selectedFile?.length > 0 && (
                                <div>
                                  <h5>Selected files:</h5>
                                  <ul>
                                    {selectedFile?.map((file, index) => (
                                      <li className="upload-list" key={index}>
                                        {file?.name}
                                        <img
                                          src={del}
                                          style={{ cursor: "pointer" }}
                                          onClick={() => delImage(index)}
                                        />
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {errorMsg && (
                                <div className="text-danger">{errorMsg}</div>
                              )}
                            </div>
                            <div className="row btn-groups">
                              <button
                                type="button"
                                className="submit-btn"
                                value="Send"
                                name="button"
                                disabled={loading}
                                // onClick={!inputError && replyToticket}
                                onClick={replyToticket}

                              >
                                {spinner?.submitBtn? <div className="ui active inline loader"></div> : <span>Send <img src={arrow} alt="" /></span> }
                              </button>
                              <button
                                className="cancel-btn"
                                // onClick={closeticket}
                                onClick={() => setmodal(true)}
                                disabled={loading}
                              >
                                {spinner?.cancelBtn? <div className="ui active inline loader"></div> : "Close This Ticket" }
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="col-lg-12 ticket-container">
                  <div className="rs-read-announcements-card open-ticket ticket-view-body">
                    <div className="rs-read-announcements-card-body">
                      <h5 className="support">Support Ticket History</h5>
                      <div className="conversation">
                        {conversations &&
                          conversations?.map((element, index) => {
                            const inputStr = element?.from_email;
                            const name = inputStr?.substring(0, inputStr?.indexOf("<"))?.trim();
                            const result = name?.replace(/^"(.*)"$/, "$1");
                            let userDp = result.split(" ")
                            const firstName = userDp[0]
                            const lastName = userDp[1]
                            return (
                              <div className="receiver" key={index}>
                                <div className="sender">
                                  <div className="box-img">{firstName? firstName?.charAt(0)?.toUpperCase() : null}{lastName? lastName?.charAt(0)?.toUpperCase() : null}</div>
                                  <div className="info">
                                    <h5>  
                                      {firstName? firstName?.charAt(0)?.toUpperCase() + firstName?.slice(1)?.toLowerCase() : null}
                                      {" "}
                                      {lastName? lastName?.charAt(0)?.toUpperCase() + lastName?.slice(1)?.toLowerCase() : null}
                                    </h5>
                                    <span className="time">
                                      {element.created_at}
                                    </span>
                                  </div>
                                </div>
                                <div
                                  className="message-text"
                                  style={{ padding: "20px 0" }}
                                >
                                  {/* {element.body_text}
                                   */}
                                  {
                                    <div
                                      style={{ width: "100%" }}
                                      dangerouslySetInnerHTML={{
                                        __html: element.body,
                                      }}
                                    />
                                  }
                                </div>
                                {element?.attachments?.length > 0 &&
                                  element?.attachments?.map((el, index) => {
                                    return (
                                      <div className="attachment" key={index}>
                                        <h5>
                                          {element?.attachments?.length}{" "}
                                          Attachments
                                        </h5>
                                        <img
                                          src={el.url}
                                          // width={119}
                                          // height={178}
                                          style={{
                                            maxHeight: "178px",
                                            maxWidth: "119px",
                                          }}
                                        />
                                        <div className="downloadt">
                                          <p>
                                            <img src={generic} />
                                            {el.name}
                                          </p>
                                          <a
                                            href={el?.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            download
                                          >
                                            Download
                                          </a>
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            );
                          })}

                        <div className="receiver">
                          <div className="sender">
                            <div className="box-img">
                              {" "}
                              {userData?.first_name
                                ? userData?.first_name?.charAt(0)?.toUpperCase()
                                : null}
                              {userData?.last_name
                                ? userData?.last_name?.charAt(0)?.toUpperCase()
                                : null}
                            </div>
                            <div className="info">
                              <h5>
                                {userData?.first_name? userData?.first_name?.charAt(0)?.toUpperCase() + userData?.first_name?.slice(1).toLowerCase() : null} {userData?.last_name? userData?.last_name?.charAt(0)?.toUpperCase() + userData?.last_name?.slice(1).toLowerCase() : null}
                              </h5>
                              <span className="time">
                                {details?.last_updated}
                              </span>
                            </div>
                          </div>
                          {/* <p className="hi-text">Hi Dominik,</p> */}
                          <div
                            className="message-text"
                            style={{ padding: "20px 0" }}
                          >
                            {/* {element.body_text}
                             */}
                            {
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: details?.description,
                                }}
                              />
                            }
                          </div>
                          {details?.attachments?.length > 0 &&
                            details?.attachments?.map((el, index) => {
                              return (
                                <div className="attachment" key={index}>
                                  <h5>
                                    {details?.attachments?.length} Attachments
                                  </h5>
                                  <img
                                    src={el.url}
                                    // width={178}
                                    // height={119}
                                    style={{
                                      maxHeight: "178px",
                                      maxWidth: "119px",
                                    }}
                                  />
                                  <div className="downloadt">
                                    <p>
                                      <img src={generic} />
                                      {el?.name}
                                    </p>
                                    <a
                                      href={el?.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      download
                                    >
                                      Download
                                    </a>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                        <br />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="rs-product-table-page">
              <div className="rs-product-table-no-page">
                <p>1-8 of 15</p>
              </div>
              <div className="rs-product-table-page-box">
                <div className="rs-product-table-per-page">
                  <p>Rows per page:</p>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                  >
                    <option>1</option>
                    <option value={1}>2</option>
                    <option value={2}>3</option>
                    <option value={3}>4</option>
                    <option value={4}>5</option>
                    <option value={5}>6</option>
                    <option value={6}>7</option>
                    <option value={7} selected="">
                      8
                    </option>
                    <option value={8}>9</option>
                    <option value={9}>10</option>
                    <option value={10}>11</option>
                    <option value={11}>12</option>
                    <option value={12}>13</option>
                    <option value={13}>14</option>
                    <option value={14}>15</option>
                    <option value={15}>16</option>
                    <option value={16}>17</option>
                    <option value={17}>18</option>
                    <option value={18}>19</option>
                    <option value={19}>20</option>
                    <option value={20}>21</option>
                    <option value={21}>22</option>
                    <option value={22}>23</option>
                    <option value={23}>24</option>
                    <option value={24}>25</option>
                  </select>
                </div>
                <div className="rs-product-table-page-list">
                  <ul>
                    <li>
                      <a href="#">
                        <i className="feather icon-chevron-left" />
                      </a>
                    </li>
                    <li>1</li>
                    <li>/</li>
                    <li>4</li>
                    <li>
                      <a href="#">
                        <i className="feather icon-chevron-right" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div> */}
          </div>
          {/* <Modal isOpen={modal} toggle={() => setmodal(!modal)} >
          <ModalHeader toggle={()=>setmodal(!modal)}>Are you Sure ?</ModalHeader>
          <ModalBody>
            Are you sure you want to close ticket ?
          </ModalBody>
          <ModalFooter>
              <Button color="secondary" onClick={() => { closeticket(),setmodal(false) }}>Close</Button>
            <Button color="primary" onClick={()=>setmodal(false)}>Cancel</Button>
          </ModalFooter>
          </Modal>
           */}

          <Modal isOpen={modal} centered={true}>
            <div className="modal-header">
              <Row className="w-100">
                <Col xs="11">
                  <h5 className="modal-title mt-0">Close Ticket</h5>
                </Col>
                <Col xs="1">
                  <button
                    type="button"
                    onClick={() => {
                      setmodal(false);
                    }}
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">
                      {" "}
                      <img src={close} alt="" />
                    </span>
                  </button>
                </Col>
              </Row>
            </div>
            <div className="modal-body p-0 two-factor verify">
              <h6 className="font-bold text-blue text-center">
                Are you sure to want to close this ticket ?
              </h6>
              <div className="factor-disable-btn">
                <button
                  className="btn btn-danger waves-effect waves-light btn-green"
                  type="button"
                  onClick={() => {
                    closeticket(), setmodal(false);
                  }}
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  Close
                </button>
                <button
                  className="btn btn-danger waves-effect waves-light btn-disable"
                  type="button"
                  onClick={() => {
                    setmodal(false);
                  }}
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        </section>
      </div>
      <TextLoader loader={loader} loading={loading}/>
    </>
  );
}

export default TicketView;
