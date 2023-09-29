import React, { useState, useEffect } from "react";
import file from "../../assets/images/file.png";
import {
  getSupportDepartment,
  loginData,
  createTicket,
  getIplist,
  getSupportPin
} from "../../pages/Authentication/store/apiServices";
import Select from "react-select";
import { toast } from "react-toastify";
import { useHistory,Link } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Form, Input } from "reactstrap";
import rederror from "../../assets/images/redvalidationicon/rederror.jpg";
import del from "../../assets/images/Delete.svg";
import { useParams } from "react-router-dom";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import TextLoader from "../../components/textLoader";
import { useDispatch } from "react-redux";
import { removeSupportTickets } from "../../store/supportTickets/actions";

function SupportRequest() {
  const param = useParams();
  const history = useHistory();
  const dispatch = useDispatch()
  const PriorityDropdown = [
    { label: "Low", value: 1 },
    { label: "Medium", value: 2 },
    { label: "High", value: 3 },
    { label: "Urgent", value: 4 },
  ];

  const [PriorityDropdownValue, setPriorityDropdownValue] = useState(
    PriorityDropdown[0]
  );
  const [TechnicalDropdown, setTechnicalDropdown] = useState([]);
  const [TechDropValue, setTechDropValue] = useState();
  const [serverIpList, setserverIpList] = useState([]);
  const [selectedIp, setselectedIp] = useState();
  const [loggedIn, setloggedIn] = useState(
    localStorage.getItem("authUser") ? true : false
  );
  const [selectedFile, setSelectedFile] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [firstName, setfirstName] = useState("");
  const [email, setemail] = useState("");
  const [inputKey, setInputKey] = useState(0);
  const [inputError, setInputError] = useState();
  const [mess, setmess] = useState("");
  const [supportPin, setSuppotPin] = useState()
  const [spinner, setSpinner] = useState(false)
  // const [defaultDepartment, setDefaultDepartment] = useState()
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

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

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: firstName || "",
      email: email || "",
      subject: "",
      support_pin: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Firstname required.")
        .matches(/^[A-Za-z]+$/, "Only albhabets are allowed."),
      email: Yup.string()
        .email("Please enter a valid email address.")
        .required("Email address is required."),
      subject: Yup.string().required("Subject is required."),
    }),

    onSubmit: async (values) => {
      let formData = new FormData();
      formData.append("subject", values.subject);
      formData.append("email", values.email);
      formData.append("description", mess);
      formData.append("name", values.name);
      formData.append("priority", PriorityDropdownValue.value);
      formData.append("department", TechDropValue.value);
      if (selectedIp) {
        formData.append("dedicated_ip", selectedIp.value);
      }
      formData.append("support_pin", supportPin || values.support_pin);

      if (selectedFile.length > 0) {
        for (let i = 0; i < selectedFile.length; i++) {
          formData.append("attachments[]", selectedFile[i]);
        }
      }
      if (!inputError) {
        try {
          setSpinner(true)
          let res = await createTicket(formData);
          if (res) {
            setSpinner(false)
            dispatch(removeSupportTickets())
            toast.success(res.data?.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
            history.push({
              pathname:`/ticket-success`,
              state:{
                id:res?.data?.data?.ticket_view_token,
                ticketId:res?.data?.data?.ticket_id,
              }
            });
          }
        } catch (err) {
          setSpinner(false)
          toast.error(err?.response?.data?.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    },
  });

  useEffect(() => {
    getTechnicallist();
    getserverlist();
    handleSupportPIN()
    if (loggedIn) {
      let loginDetail = loginData();
      setfirstName(loginDetail.first_name);
      setemail(loginDetail.email);
    }
  }, []);

  const customStyles = {
    control: (base) => ({
      ...base,
      height: 50,
      minHeight: 50,
    }),
  };

  const getTechnicallist = async () => {
    try {
      let res = await getSupportDepartment();
      if (res) {
        let arr = [];
        const convertedArray = res?.data?.data.map((obj) => ({
          value: obj.id,
          label: obj.name,
        }));

        setTechnicalDropdown(convertedArray);
        let defaultDepartment = ""
        convertedArray?.map((option) => {
          let optionname = option?.label.split(" ")
          if(optionname[0] == "Technical") {
            defaultDepartment = option
          }
        })
        let option = ""
        param.id == 2
          ? setTechDropValue(convertedArray[4])
          : setTechDropValue(defaultDepartment);
      }
    } catch (err) {}
  };

  const getserverlist = async () => {
    try {
      let res = await getIplist();
      if (res) {
        let arr = [];
        const convertedArray = res?.data?.data.map((obj) => ({
          value: obj,
          label: obj,
        }));

        setserverIpList(convertedArray);
        // setselectedIp(convertedArray[0])
      }
    } catch (err) {}
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
          // setSelectedFile(file)
          setErrorMsg("");
        } else {
          setErrorMsg(
            "Only JPG, PNG, PDF, DOC, XLS, and ZIP files are allowed"
          );
        }
      }
    }
  };

  // const handlePriority = (option) => {};

  // const handleDepartment = (option) => {
  // };

  const delImage = (index) => {
    let arr = [...selectedFile];
    arr.splice(index, 1);
    setSelectedFile(arr);
    if (selectedFile.length == 1) {
      setSelectedFile([]);
      setInputKey((prevKey) => prevKey + 1);
    }
  };

  const handleSupportPIN = async() => {
    try{
      let res = await getSupportPin()
      setSuppotPin(res?.data?.data?.support_pin)
    }catch(error) {
    }
  }

  return (
    <>
      <section
        className="rs-product-home-section rs-product-section"
      >
        <div className="rs-product-left">
          <div className="rs-product-left-title rs-product-left-title-wrap">
            <h2>Submit a Support Request ✨</h2>
          </div>
          <div className="rs-product-left-contentbar rs-product-left-contentbar-wrap">
            <div className="row">
              <div className="col-lg-12">
                <div className="rs-read-announcements-card open-ticket">
                  <div className="rs-read-announcements-card-header">
                    <ul>
                      <li>
                        {" "}
                        <Link to="/support">Support Ticket ›</Link>{" "}
                      </li>
                      <li>Submit a Support Request</li>
                    </ul>
                  </div>
                  <Form
                    className="form-horizontal floating-form my-account"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >
                    <div className="rs-read-announcements-card-body">
                      <h5>Personal Information</h5>
                      <div className="rs-read-announcements-card-content">
                        <div className="row">
                          <>
                            {" "}
                            <div className="col-lg-6 form-group">
                            <p className="place-holder">Subject</p>
                            <Input
                              disabled={spinner}
                              type="text"
                              className="form-control"
                              id="subject"
                              name="subject"
                              placeholder="Enter Subject"
                              // defaultValue="Issue accessing website on mobile device"

                              // value={subject}
                              // onChange={(e) => {
                              //   setsubject(e.target.value);
                              // }}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.subject || ""}
                              invalid={
                                validation.touched.subject &&
                                validation.errors.subject
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.subject &&
                              validation.errors.subject && (
                                <>
                                  <span className="ticket-validaton-error">
                                    <img
                                      className="form-error-icon"
                                      src={rederror}
                                      alt=""
                                      height={15}
                                    />
                                    {validation.errors.subject}
                                  </span>
                                </>
                              )}
                          </div>
                            {/* <div className="col-lg-6 form-group">
                              <p className="place-holder">Name</p>
                              <input
                                type="text"
                                name="name"
                                className="form-control"
                                id="first-name"
                                disabled={loggedIn}
                                // value={ firstName}
                                // onChange={(e)=>setfirstName(e.target.value)}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.name || ""}
                                invalid={
                                  validation.touched.name &&
                                  validation.errors.name
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.name &&
                                validation.errors.name && (
                                  <>
                                    <span className="ticket-validaton-error">
                                      <img
                                        className="form-error-icon"
                                        src={rederror}
                                        alt=""
                                        height={15}
                                      />
                                      {validation.errors.name}
                                    </span>
                                  </>
                                )}
                            </div> */}
                            <div className="col-lg-6 form-group">
                              <p className="place-holder">Email Address</p>
                              <Input
                                type="text"
                                placeholder="Email Address"
                                className="form-control"
                                id="email-address"
                                disabled={loggedIn || spinner}
                                name="email"
                                // value={email}
                                // onChange={(e) => setemail(e.target.value)}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.email || ""}
                                invalid={
                                  validation.touched.email &&
                                  validation.errors.email
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.email &&
                                validation.errors.email && (
                                  <>
                                    <span className="ticket-validaton-error">
                                      <img
                                        className="form-error-icon"
                                        src={rederror}
                                        alt=""
                                        height={15}
                                      />
                                      {validation.errors.email}
                                    </span>
                                  </>
                                )}
                            </div>
                            <div className="col-lg-6 form-group">
                              <p className="place-holder">Support PIN</p>
                              <input
                                type="text"
                                placeholder="Enter Support PIN"
                                className="form-control"
                                id="support_pin"
                                disabled={supportPin || spinner}
                                name="support_pin"
                                // value={email}
                                // onChange={(e) => setemail(e.target.value)}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={supportPin || validation.values.support_pin || ""}
                              />
                            </div>
                          </>
                          <div className="col-lg-6 form-group">
                            <p className="place-holder">Department</p>
                            <Select
                              isDisabled={spinner}
                              classNamePrefix="select-v1"
                              value={TechDropValue}
                              options={TechnicalDropdown}
                              styles={customStyles}
                              onChange={(value) => {
                                setTechDropValue(value)
                                  // handleDepartment(value);
                              }}
                            />
                            {/* </div> */}
                          </div>
                          <div className="col-lg-6 form-group">
                            <p className="place-holder">Server Ip</p>
                            <Select
                              isDisabled={spinner}
                              classNamePrefix="select-v1"
                              value={selectedIp}
                              options={serverIpList}
                              styles={customStyles}
                              placeholder="Select Server IP Address"
                              onChange={(value) => {
                                setselectedIp(value);
                                // handleDepartment(value);
                              }}
                            />
                            {/* </div> */}
                          </div>
                          {/* <div className="col-lg-6 form-group">
                            <p className="place-holder">Priority</p>
                            <Select
                              classNamePrefix="select-v1"
                              value={PriorityDropdownValue}
                              options={PriorityDropdown}
                              styles={customStyles}
                              onChange={(value) => {
                                setPriorityDropdownValue(value),
                                  handlePriority(value);
                              }}
                            />
                          </div> */}
                         
                          <div className="col-lg-12 form-group text-editor-ticket">
                            <p className="place-holder">Message:</p>
                            <Editor
                              isDisabled={spinner}
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
                          </div>
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
                                disabled={spinner}
                                key={inputKey}
                                id="file-upload"
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf,.doc,.xls,.zip"
                                onChange={handleFileChange}
                                onClick={(event) => {
                                  if (
                                    event.target.files.length === 1 &&
                                    event.target.files[0].name ===
                                      selectedFile[selectedFile.length - 1]
                                        ?.name
                                  ) {
                                    event.target.value = null;
                                  }
                                }}
                                multiple
                              />
                              {/* <button>Add more +</button> */}
                            </label>
                            <span className="file-formats">
                              Please select files to attach (20 MB max, .jpg,
                              .png, .pdf, .doc, .xls, .zip)
                            </span>
                            {/* {
                              <div><strong>Selected File : </strong> {selectedFile ? selectedFile.name : "none"} <span onClick={() => { setSelectedFile(""); setInputKey((prevKey) => prevKey + 1);}} style={{ color: "red",cursor:"pointer" }}>{selectedFile && "X"}</span></div>
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
                            {/* {errorMsg && (
                              <div className="text-danger">{errorMsg}</div>
                            )} */}
                            {errorMsg && (
                              <span className="ticket-validaton-error">
                                {" "}
                                <img
                                  className="form-error-icon"
                                  src={rederror}
                                  alt=""
                                  height={15}
                                />
                                {errorMsg}
                              </span>
                            )}
                          </div>
                          <div className="row btn-groups">
                            <button
                              disabled={spinner}
                              type="submit"
                              className="submit-btn"
                              onClick={() => {
                                if (!mess) {
                                  setInputError("Message is required");
                                } else if (mess.length < 50) {
                                  setInputError(
                                    "Message must be at least 50 characters"
                                  );
                                } else {
                                  setInputError("");
                                  // handle form submission
                                }
                              }}
                            >
                              {spinner? <div className="ui active inline loader"></div> : "Submit" }
                            </button>
                            <button
                              className="cancel-btn"
                              type="button"
                              disabled={spinner}
                              onClick={() => {
                                setSelectedFile([]);
                                setEditorState(() => EditorState.createEmpty());
                                setInputError("")
                                validation.resetForm();
                              }}
                            >
                             Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <TextLoader loading={spinner}/>
    </>
  );
}

export default SupportRequest;
