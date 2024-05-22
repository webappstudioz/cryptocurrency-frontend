import React, { useState, useEffect } from "react";
// import showeye from "../../assets/images/showeye.svg";
// import { Progress } from "semantic-ui-react";
// import hideeye from "../../assets/images/hideeye.svg";
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";
// import { FormatDate } from "../../helpers/api_helper_rs";
import { loginData } from "../Authentication/store/apiServices";
import logoGreen from "../../assets/images/c2c/logoGreen.jpg"
import { C2CWallet, ComisionIncome, DepositWallet, FixedWallet, MonthlyReturn, WidBalance } from "../../components/Common/Widgets";
const Dashboard = ({ fullRes } = props) => {
  const logInfo = loginData()
  // const [password, setpassword] = useState(true);
  // const [rescuePassword, setrescuePassword] = useState(true);
  // const [ipmiPassword, setipmiPassword] = useState(true);
  // const [startDate, setStartDate] = useState();
  // const [dueDate, setDueDate] = useState();
  // const [currency, setCurrency] = useState()
  const [loader, setLoader] = useState(false);
  // const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   let logInfo = loginData();
  //   console.log("logindo",logInfo)
  //   setCurrency(logInfo?.currency)
  //   if (fullRes?.product?.regdate) {
  //     let startdate = FormatDate(
  //       fullRes?.product?.regdate,
  //       logInfo?.ClientDateFormat || logInfo?.DateFormat,
  //       logInfo?.role
  //     );
  //     setStartDate(startdate);
  //   }

  //   if (fullRes?.product?.nextduedate) {
  //     let startdate = FormatDate(
  //       fullRes?.product?.nextduedate,
  //       logInfo?.ClientDateFormat || logInfo?.DateFormat,
  //       logInfo?.role
  //     );
  //     setDueDate(startdate);
  //   }
  // }, [fullRes]);

console.log("country", logInfo)
  return (
    <React.Fragment>
      <div
        className={
          loader
            ? "page-content  server-management overlayerloader"
            : "page-content  server-management"
        }
      >
        <div className="container-fluid">        
            <div className="container mt-5">
                <div className="row">
                   <div className="col-md-12">
                    <div className="d-flex justify-content-between align-items-center breaking-news bg-white">
                        <div className="d-flex flex-row flex-grow-1 flex-fill justify-content-center bg-danger py-2 text-white px-1 news">
                          <span className="d-flex align-items-center">Results</span>
                        </div>
                        <marquee className="news-scroll" behavior="scroll" direction="left" >
                          <a href="#">
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                          </a> 
                          <span className="dot"></span> 
                          <a href="#">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
                          </a>
                          <span className="dot"></span>
                          <a href="#">
                            Duis aute irure dolor in reprehenderit in voluptate velit esse 
                          </a>
                        </marquee>
                    </div>
                </div>
            </div>
        </div>
          <div className="server_info">
            <h5 className="info_heding">Account Details</h5>
            <div className="row">
                <div className="col">
                    <C2CWallet /> 
                    {/*  */}
                </div>
                <div className="col">
                    <FixedWallet />
                </div>
                <div className="col">
                    <MonthlyReturn />
                </div>
                <div className="col">
                    <ComisionIncome />
                </div>
            </div>
          </div>
    <div>
      <div className="row">
        <div className="col-md-6">
          <div className="tab_content tab-data-table">
            {/* <h5 className="info_heding">Profile Details</h5> */}
            <table className="w-100">
              <tbody>
                <img src={logoGreen} style={{height:"100%", width:"100%"}}/>
              </tbody>
            </table>
            <br/>
            <table className="w-100">
              <tbody>
              <tr>
                  <th>Your Referral Link</th>
                    <React.Fragment>
                      <td className="text-right" onClick={() => {
                              copy(`https://www.crypto2cassino.com/@${logInfo?.user_name}`);
                              toast("Referral link has been  copied", {
                                autoClose: 1000,
                              });
                            }}>
                        {`https://www.crypto2cassino.com/@${logInfo?.user_name}`}
                      </td>
                      {/* <td className="text-right"></td>
                        <td >
                          <svg
                            onClick={() => {
                              copy("https://www.crypto2cassino.com/@C2C8474");
                              toast("Referral link has been  copied", {
                                autoClose: 1000,
                              });
                            }}
                            className="pw-icon-pass"
                            width="13"
                            height="17"
                            viewBox="0 0 15 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2.02526 16.4685C1.8004 16.4153 1.58059 16.3427 1.36827 16.2515C1.07612 16.1087 0.830075 15.8867 0.65819 15.6106C0.486306 15.3346 0.395472 15.0156 0.396227 14.6905C0.379227 14.1735 0.396227 13.6564 0.396227 13.1394C0.396227 10.6354 0.396227 8.13178 0.396227 5.62845C0.405174 5.19207 0.572476 4.77374 0.866808 4.45144C1.16114 4.12915 1.56255 3.9249 1.99633 3.87649C2.45233 3.84249 2.91227 3.87039 3.38927 3.87039V4.00247C3.38927 6.21447 3.37827 8.42646 3.39427 10.6385C3.37907 11.1864 3.52846 11.7263 3.82311 12.1885C4.11775 12.6507 4.54409 13.014 5.04723 13.2315C5.42622 13.4071 5.84075 13.4926 6.25829 13.4815H12.3423C12.3423 13.8745 12.3483 14.2545 12.3423 14.6345C12.3431 14.7976 12.3219 14.96 12.2793 15.1175C12.1904 15.4667 11.9978 15.781 11.7268 16.0186C11.4558 16.2562 11.1191 16.4061 10.7612 16.4485C10.7428 16.453 10.725 16.4597 10.7082 16.4685H2.02526Z"
                              fill="#9F9EB2"
                            />
                            <path
                              d="M4.37758 6.50446C4.37758 5.13246 4.37758 3.76019 4.37758 2.38752C4.37009 2.09061 4.43648 1.79651 4.57069 1.53156C4.70491 1.26662 4.9028 1.03905 5.14662 0.869455C5.43858 0.650757 5.79381 0.533193 6.15858 0.534494C8.51192 0.530494 10.8646 0.530494 13.2166 0.534494C13.6825 0.543533 14.1271 0.731573 14.4583 1.0594C14.7894 1.38722 14.9818 1.8297 14.9956 2.29548C15.0056 3.36048 14.9956 4.42568 14.9956 5.49568C14.9956 7.20634 14.9956 8.91685 14.9956 10.6275C15.0066 11.0475 14.8709 11.4583 14.612 11.7891C14.353 12.12 13.9869 12.3502 13.5766 12.4405C13.4481 12.4706 13.3165 12.4854 13.1846 12.4844C10.8513 12.4844 8.51792 12.4844 6.18459 12.4844C5.70827 12.4847 5.25107 12.297 4.91249 11.962C4.57391 11.627 4.38135 11.1719 4.3766 10.6956C4.3686 9.29563 4.3766 7.90461 4.3766 6.50862L4.37758 6.50446Z"
                              fill="#9F9EB2"
                            />
                          </svg>
                        </td> */}
                      
                        {/* <>
                          <td></td>
                        </> */}
                    </React.Fragment>
                  <><td></td><td></td><td></td></>
                </tr>
                {/* <img src={logoGreen} style={{height:"100%", width:"100%"}}/> */}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-md-6">
          <div className="tab_content tab-data-table">
            {/* <h5 className="info_heding">Authentications</h5> */}
            <table className="w-100">
              <tbody>
                <tr>
                  <th>Member Id</th>
                    <React.Fragment>
                      <td className="text-right">
                        {logInfo?.user_name}
                      </td>
                      {/* <td className="text-right"></td> */}
                        {/* <td className="text-right">
                          <svg
                            onClick={() => {
                              copy("");
                              toast("Username has been  copied", {
                                autoClose: 1000,
                              });
                            }}
                            className="pw-icon-pass"
                            width="13"
                            height="17"
                            viewBox="0 0 15 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2.02526 16.4685C1.8004 16.4153 1.58059 16.3427 1.36827 16.2515C1.07612 16.1087 0.830075 15.8867 0.65819 15.6106C0.486306 15.3346 0.395472 15.0156 0.396227 14.6905C0.379227 14.1735 0.396227 13.6564 0.396227 13.1394C0.396227 10.6354 0.396227 8.13178 0.396227 5.62845C0.405174 5.19207 0.572476 4.77374 0.866808 4.45144C1.16114 4.12915 1.56255 3.9249 1.99633 3.87649C2.45233 3.84249 2.91227 3.87039 3.38927 3.87039V4.00247C3.38927 6.21447 3.37827 8.42646 3.39427 10.6385C3.37907 11.1864 3.52846 11.7263 3.82311 12.1885C4.11775 12.6507 4.54409 13.014 5.04723 13.2315C5.42622 13.4071 5.84075 13.4926 6.25829 13.4815H12.3423C12.3423 13.8745 12.3483 14.2545 12.3423 14.6345C12.3431 14.7976 12.3219 14.96 12.2793 15.1175C12.1904 15.4667 11.9978 15.781 11.7268 16.0186C11.4558 16.2562 11.1191 16.4061 10.7612 16.4485C10.7428 16.453 10.725 16.4597 10.7082 16.4685H2.02526Z"
                              fill="#9F9EB2"
                            />
                            <path
                              d="M4.37758 6.50446C4.37758 5.13246 4.37758 3.76019 4.37758 2.38752C4.37009 2.09061 4.43648 1.79651 4.57069 1.53156C4.70491 1.26662 4.9028 1.03905 5.14662 0.869455C5.43858 0.650757 5.79381 0.533193 6.15858 0.534494C8.51192 0.530494 10.8646 0.530494 13.2166 0.534494C13.6825 0.543533 14.1271 0.731573 14.4583 1.0594C14.7894 1.38722 14.9818 1.8297 14.9956 2.29548C15.0056 3.36048 14.9956 4.42568 14.9956 5.49568C14.9956 7.20634 14.9956 8.91685 14.9956 10.6275C15.0066 11.0475 14.8709 11.4583 14.612 11.7891C14.353 12.12 13.9869 12.3502 13.5766 12.4405C13.4481 12.4706 13.3165 12.4854 13.1846 12.4844C10.8513 12.4844 8.51792 12.4844 6.18459 12.4844C5.70827 12.4847 5.25107 12.297 4.91249 11.962C4.57391 11.627 4.38135 11.1719 4.3766 10.6956C4.3686 9.29563 4.3766 7.90461 4.3766 6.50862L4.37758 6.50446Z"
                              fill="#9F9EB2"
                            />
                          </svg>
                        </td> */}
                      
                        {/* <>
                          <td></td>
                        </> */}
                    </React.Fragment>
                  <><td></td><td></td><td></td></>
                </tr>
                <tr></tr>
                <tr>
                  <th>Member Name</th>
                    <React.Fragment>
                      <td className="text-right">
                        {logInfo?.first_name} {logInfo?.last_name}
                      </td>
                    </React.Fragment>
                  <><td></td><td></td><td></td></>
                </tr>
                <tr></tr>
                <tr>
                  <th>Date of Joining</th>
                    <React.Fragment>
                      <td className="text-right">
                        20-09-2023
                      </td>
                    </React.Fragment>
                  <><td></td><td></td><td></td></>
                </tr>
                <tr></tr>
                <tr>
                  <th>Mobile</th>
                    <React.Fragment>
                      <td className="text-right">
                        {logInfo?.phone_numnber}
                      </td>
                    </React.Fragment>
                  <><td></td><td></td><td></td></>
                </tr>
                <tr></tr>
                <tr>
                  <th>Email</th>
                    <React.Fragment>
                      <td className="text-right">
                        {logInfo?.email}
                      </td>
                    </React.Fragment>
                  <><td></td><td></td><td></td></>
                </tr>
                <tr></tr>
                <tr>
                  <th>Sponser</th>
                    <React.Fragment>
                      <td className="text-right">
                      C2C54857
                      </td>
                    </React.Fragment>
                  <><td></td><td></td><td></td></>
                </tr>
                <tr></tr>
                <tr>
                  <th>Country</th>
                    <React.Fragment>
                      <td className="text-right">
                        {logInfo?.country_name}
                      </td>
                    </React.Fragment>
                  <><td></td><td></td><td></td></>
                </tr>
                <tr></tr>
                <tr>
                  <th>Account Type</th>
                    <React.Fragment>
                      <td className="text-right">
                        Registeration
                      </td>
                    </React.Fragment>
                  <><td></td><td></td><td></td></>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div>
      </div>
    </div>
    </div>
    </div></React.Fragment>
  );
};

export default React.memo(Dashboard);
