import React, { useState, useEffect } from "react";
import showeye from "../../assets/images/showeye.svg";
import { Progress } from "semantic-ui-react";
import hideeye from "../../assets/images/hideeye.svg";
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";
import { FormatDate } from "../../helpers/api_helper_rs";
import { loginData } from "../Authentication/store/apiServices";

const PlayandWin = (props) => {
    return (
    <div className="casino-box-main">
      Play and win
      <div className="casino-wrapper">
        <div className="casino-top-btn-grp">
            <a href="#" className="btn btn-casion">
                <span>
                    Claim Bonus
                </span>
            </a>
            <a href="#" className="btn btn-casion">
               <span>
                    Winning AMT 
               </span> 
               <input type="text" placeholder=""></input>
            </a>
            <a href="#" className="btn btn-casion">
               <span>
                    Total Bet
               </span> 
               <input type="text" placeholder=""></input>
            </a>
            <a href="#" className="btn btn-casion">
               <span>
                    balance Amount
               </span> 
               <input type="text" placeholder="$12.415"></input>
            </a>
        </div>
        <div className="casino-table-main">
            <div className="row align-items-center g-4">
                <div className="col-md-5">
                    <div className="poker-wheel-box">
                    </div>
                </div>
                <div className="col-md-7">
                    <div className="poker-number-table-box">
                        <div className="table-top-heading">
                            <div className="table-top-left">
                                <p>Sereal No: <span>123</span></p>
                            </div>
                            <div className="table-top-center">
                                <div className="zero-num">
                                    0
                                </div>
                                <input type="text"></input>
                            </div>
                            <div className="table-top-right">
                                <div className="form-field">
                                    <label>DATE</label>
                                    <input type="date"></input>
                                </div>
                                <div className="form-field">
                                    <label>time</label>
                                    <input type="date"></input>
                                </div>
                            </div>
                        </div>
                        <table className="poker-number-table">
                            <tr>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num red">
                                            1
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num">
                                            2
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num red">
                                            3
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num">
                                            4
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num red">
                                            5
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num">
                                            6
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num red">
                                            7
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num">
                                            8
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num red">
                                            9
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num">
                                            10
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num">
                                            11
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                                <td>
                                    <div className="poker-num-box red">
                                        <div className="poker-num">
                                            12
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num">
                                            13
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num red">
                                            14
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num">
                                            15
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num red">
                                            16
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num">
                                            17
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num red">
                                            18
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num red">
                                            19
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num">
                                            20
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num red">
                                            21
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num">
                                            22
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num red">
                                            23
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num">
                                            24
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num red">
                                            25
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num">
                                            26
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num red">
                                            27
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num">
                                            28
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num">
                                            29
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num red">
                                            30
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num">
                                            31
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num red">
                                            32
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num">
                                            33
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num red">
                                            34
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num">
                                            35
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                                <td>
                                    <div className="poker-num-box">
                                        <div className="poker-num red">
                                            36
                                        </div>
                                        <input type="text"  ></input>
                                    </div>
                                </td>
                            </tr>
                        </table>
                        <div className="poker-color-box mt-3">
                            <div className="table-color-box">
                                <div className="color-box-name red">
                                    red
                                </div>
                                <input type="text" ></input>
                            </div>
                            <div className="table-color-box">
                                <div className="color-box-name">
                                    Black
                                </div>
                                <input type="text" ></input>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="casino-top-btn-grp mt-4">
            <a href="#" className="btn btn-casion">
                <span>
                    HOME
                </span>
            </a>
            <a href="#" className="btn btn-casion">
                <span>
                    GET CHIPSW
                </span>
            </a>
            <a href="#" className="btn btn-casion">
                <span>
                    SPIN
                </span>
            </a>
        </div>
      </div>
    </div>
  );
};


export default React.memo(PlayandWin);