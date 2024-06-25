import React, { useState, useEffect } from "react";
// import showeye from "../../assets/images/showeye.svg";
// import { Progress } from "semantic-ui-react";
// import hideeye from "../../assets/images/hideeye.svg";
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";
import { FormatDate } from "../../helpers/api_helper_rs";
import { getUserDetail, loginData } from "./store/apiServices";
import logoGreen from "../../assets/images/c2c/logoGreen.jpg"
import { useParams } from "react-router-dom/cjs/react-router-dom";
import TextLoader from "../../components/textLoader";
// import { C2CWallet, ComisionIncome, DepositWallet, FixedWallet, MonthlyReturn, WidBalance } from "../../components/Common/Widgets";
const SingleUserDetail = () => {
    const params = useParams()
    // const userInfo = loginData()
    const [loader, setLoader] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState("")

    useEffect(() => {
        handleGetUserDetail()
    }, [])

    const handleGetUserDetail = async () => {
        setLoader(true)
        setLoading(true)
        try {
            const result = await getUserDetail(params?.id)
            const info = result?.data?.data
            setUserInfo(info)
            setLoader(false)
            setLoading(false)
            toast.success(result?.data?.message, {
                position: toast.POSITION.TOP_RIGHT,
            })
        } catch (error) {
            toast.success(error?.data?.message, {
                position: toast.POSITION.TOP_RIGHT,
            })
            setLoader(false)
            setLoading(false)
        }
    }

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
                    <div>
                        <div className="row">
                            <div className="col-md-12">
                                <h5 className="info_heding">Personal Details</h5>
                                <div className="tab_content tab-data-table">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <table className="w-100">
                                                <tbody>
                                                    <tr>
                                                        <th>Member Id</th>
                                                        <React.Fragment>
                                                            <td className="text-right">
                                                                {userInfo?.user_name}
                                                            </td>
                                                        </React.Fragment>
                                                        <><td></td><td></td><td></td></>
                                                    </tr>

                                                    <tr></tr>
                                                    <tr>
                                                        <th>Mobile</th>
                                                        <React.Fragment>
                                                            <td className="text-right">
                                                                {userInfo?.country_code}{" "}
                                                                {userInfo?.phone_number}
                                                            </td>
                                                        </React.Fragment>
                                                        <><td></td><td></td><td></td></>
                                                    </tr>
                                                    <tr></tr>
                                                    <tr>
                                                        <th>Date of Joining</th>
                                                        <React.Fragment>
                                                            <td className="text-right">
                                                                {FormatDate(userInfo?.joining_date)}
                                                            </td>
                                                        </React.Fragment>
                                                        <><td></td><td></td><td></td></>
                                                    </tr>
                                                    <tr></tr>

                                                    <tr>
                                                        <th>Address</th>
                                                        <React.Fragment>
                                                            <td className="text-right">
                                                                {userInfo?.address}
                                                            </td>
                                                        </React.Fragment>
                                                        <><td></td><td></td><td></td></>
                                                    </tr>
                                                    <tr></tr>
                                                    <tr>
                                                        <th>Zip Code</th>
                                                        <React.Fragment>
                                                            <td className="text-right">
                                                                {userInfo?.zip_code}
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
                                        <div className="col-md-6">
                                            <table className="w-100">
                                                <tbody>
                                                    <tr>
                                                        <th>Member Name</th>
                                                        <React.Fragment>
                                                            <td className="text-right">
                                                                {userInfo?.first_name} {userInfo?.last_name}
                                                            </td>
                                                        </React.Fragment>
                                                        <><td></td><td></td><td></td></>
                                                    </tr>
                                                    <tr></tr>
                                                    <tr>
                                                        <th>Email</th>
                                                        <React.Fragment>
                                                            <td className="text-right">
                                                                {userInfo?.email}
                                                            </td>
                                                        </React.Fragment>
                                                        <><td></td><td></td><td></td></>
                                                    </tr>
                                                    <tr></tr>
                                                    <tr>
                                                        <th>Account Status</th>
                                                        <React.Fragment>
                                                            <td className="text-right">

                                                            </td>
                                                        </React.Fragment>
                                                        <><td></td><td></td><td></td></>
                                                    </tr>
                                                    <tr></tr>
                                                    <tr>
                                                        <th>City</th>
                                                        <React.Fragment>
                                                            <td className="text-right">
                                                                {userInfo?.city}
                                                            </td>
                                                        </React.Fragment>
                                                        <><td></td><td></td><td></td></>
                                                    </tr>
                                                    <tr></tr>
                                                    <tr>
                                                        <th>Country</th>
                                                        <React.Fragment>
                                                            <td className="text-right">
                                                                {userInfo?.country_name}
                                                            </td>
                                                        </React.Fragment>
                                                        <><td></td><td></td><td></td></>
                                                    </tr>
                                                    <tr></tr>

                                                    <tr>
                                                        <th>Sponser</th>
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
                            </div>
                        </div>
                    </div>
                    <br />
                    <div>
                        <div className="row">
                            <div className="col-md-12">
                                <h5 className="info_heding">Bank Details</h5>
                                <div className="tab_content tab-data-table">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <table className="w-100">
                                                <tbody>
                                                    <img src={logoGreen} style={{ height: "100%", width: "100%" }} />
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="col-md-6">
                                            <table className="w-100">
                                                <tbody>
                                                    <tr>
                                                        <th>Bank Name</th>
                                                        <React.Fragment>
                                                            <td className="text-right">
                                                                {userInfo?.bank_name}
                                                            </td>
                                                        </React.Fragment>
                                                        <><td></td><td></td><td></td></>
                                                    </tr>
                                                    <tr></tr>
                                                    <tr>
                                                        <th>Account Number</th>
                                                        <React.Fragment>
                                                            <td className="text-right">
                                                                {userInfo?.account_number}
                                                            </td>
                                                        </React.Fragment>
                                                        <><td></td><td></td><td></td></>
                                                    </tr>
                                                    <tr></tr>
                                                    <tr>
                                                        <th>{"Account Holder's Name"}</th>
                                                        <React.Fragment>
                                                            <td className="text-right">
                                                                {FormatDate(userInfo?.account_holder_name)}
                                                            </td>
                                                        </React.Fragment>
                                                        <><td></td><td></td><td></td></>
                                                    </tr>
                                                    <tr></tr>
                                                    <tr>
                                                        <th>IFSC Code</th>
                                                        <React.Fragment>
                                                            <td className="text-right">
                                                                {userInfo?.ifsc_code}
                                                            </td>
                                                        </React.Fragment>
                                                        <><td></td><td></td><td></td></>
                                                    </tr>
                                                    <tr></tr>
                                                    <tr>
                                                        <th>UPI ID</th>
                                                        <React.Fragment>
                                                            <td className="text-right">
                                                                {userInfo?.upi_id}
                                                            </td>
                                                        </React.Fragment>
                                                        <><td></td><td></td><td></td></>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <br />
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div>
                        <div className="row">
                            <div className="col-md-12">
                                <h5 className="info_heding">Crypto Details</h5>
                                <div className="tab_content tab-data-table">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <table className="w-100">
                                                <tbody>
                                                    <img src={logoGreen} style={{ height: "100%", width: "100%" }} />
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="col-md-6">
                                            <table className="w-100">
                                                <tbody>
                                                    <tr>
                                                        <th>Crypto Id</th>
                                                        <React.Fragment>
                                                            <td className="text-right">
                                                                {userInfo?.crypto_id}
                                                            </td>
                                                        </React.Fragment>
                                                        <><td></td><td></td><td></td></>
                                                    </tr>
                                                    {/* <tr></tr>
                                                    <tr>
                                                        <th>Account Number</th>
                                                        <React.Fragment>
                                                            <td className="text-right">
                                                                {userInfo?.account_number}
                                                            </td>
                                                        </React.Fragment>
                                                        <><td></td><td></td><td></td></>
                                                    </tr>
                                                    <tr></tr>
                                                    <tr>
                                                        <th>{"Account Holder's Name"}</th>
                                                        <React.Fragment>
                                                            <td className="text-right">
                                                                {FormatDate(userInfo?.account_holder_name)}
                                                            </td>
                                                        </React.Fragment>
                                                        <><td></td><td></td><td></td></>
                                                    </tr>
                                                    <tr></tr>
                                                    <tr>
                                                        <th>IFSC Code</th>
                                                        <React.Fragment>
                                                            <td className="text-right">
                                                                {userInfo?.ifsc_code}
                                                            </td>
                                                        </React.Fragment>
                                                        <><td></td><td></td><td></td></>
                                                    </tr>
                                                    <tr></tr>
                                                    <tr>
                                                        <th>UPI ID</th>
                                                        <React.Fragment>
                                                            <td className="text-right">
                                                                {userInfo?.upi_id}
                                                            </td>
                                                        </React.Fragment>
                                                        <><td></td><td></td><td></td></>
                                                    </tr> */}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <br />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <TextLoader loading={loading} loader={loader} />
            </div>
        </React.Fragment>
    );
};

export default React.memo(SingleUserDetail);
