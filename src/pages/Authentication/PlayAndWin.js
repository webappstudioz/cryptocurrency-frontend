import React, { useState, useEffect } from "react";
import RouletteWheel from "../../components/RouletteWheel";
import { RedNumbers } from "../../constants/api/api_path";
import { customRegex } from "../../helpers/validation_helpers";
import { toast } from "react-toastify"
import { handlePlacebet } from "./store/apiServices";

const PlayandWin = (props) => {
    const [dateTime, setDateTime] = useState(new Date());
    const formattedDate = dateTime.toLocaleDateString();
    const formattedTime = dateTime.toLocaleTimeString();
    const maxVal = 25
    const [allNumbers, setAllNumbers] = useState([
        { name: "1", amount: "" },
        { name: "2", amount: "" },
        { name: "3", amount: "" },
        { name: "4", amount: "" },
        { name: "5", amount: "" },
        { name: "6", amount: "" },
        { name: "7", amount: "" },
        { name: "8", amount: "" },
        { name: "9", amount: "" },
        { name: "10", amount: "" },
        { name: "11", amount: "" },
        { name: "12", amount: "" },
        { name: "13", amount: "" },
        { name: "14", amount: "" },
        { name: "15", amount: "" },
        { name: "16", amount: "" },
        { name: "17", amount: "" },
        { name: "18", amount: "" },
        { name: "19", amount: "" },
        { name: "20", amount: "" },
        { name: "21", amount: "" },
        { name: "22", amount: "" },
        { name: "23", amount: "" },
        { name: "24", amount: "" },
        { name: "25", amount: "" },
        { name: "26", amount: "" },
        { name: "27", amount: "" },
        { name: "28", amount: "" },
        { name: "29", amount: "" },
        { name: "30", amount: "" },
        { name: "31", amount: "" },
        { name: "32", amount: "" },
        { name: "33", amount: "" },
        { name: "34", amount: "" },
        { name: "35", amount: "" },
        { name: "36", amount: "" },
    ])

    const [gameData, setGameData] = useState({
        red: "",
        black: "",
        zero: ""
    })

    // const [totalAmount, setTotalAmount] = useState(0)
    useEffect(() => {
        const updateDateTime = () => setDateTime(new Date());
        const timerId = setInterval(updateDateTime, 1000);
        return () => clearInterval(timerId);
    }, []);

    // useEffect(() => {
    //     // Filter out items with non-empty 'amount' values
    //     let numbersWithValues = allNumbers.filter(item => item.amount !== "");

    //     // Convert filtered items to an object
    //     const numbersObject = numbersWithValues.reduce((acc, item) => {
    //         acc[item.name] = item.amount;
    //         return acc;
    //     }, {});

    //     // Extract non-empty values from gameData and convert to object
    //     const entries = Object.entries(gameData);
    //     const filteredEntries = entries.filter(([key, value]) => value !== "");
    //     const value = Object.fromEntries(filteredEntries);

    //     // Calculate the total amount from both objects
    //     const totalAmount = [
    //         ...Object.values(numbersObject),
    //         ...Object.values(value)
    //     ]
    //     .map(amount => parseFloat(amount)) // Convert amounts to numbers
    //     .reduce((sum, current) => sum + (isNaN(current) ? 0 : current), 0); // Sum up amounts

    //     setTotalAmount(totalAmount)
    // }, [gameData, allNumbers, maxVal]);

    const handleNumberChange = (name, value) => {
        if (customRegex.amount.test(value) || value === "") {
            const updatedNumbers = allNumbers.map(num =>
                num.name === name ? { ...num, amount: value } : num
            );
            setAllNumbers(updatedNumbers);
        }
    };

    const handleChange = (name, value) => {
        if (customRegex.amount.test(value)) {
            setGameData((prev) => ({ ...prev, [name]: value }))
        } else if (!value) {
            setGameData((prev) => ({ ...prev, [name]: value }))
        }
    }

    const onSubmit = async () => {
        let numbersWithValues = allNumbers.filter(item => item.amount !== "")
        const numbersObject = numbersWithValues.reduce((acc, item) => {
            acc[item.name] = item.amount;
            return acc;
        }, {});
        const entries = Object.entries(gameData);
        const filteredEntries = entries.filter(([key, value]) => value !== "");
        const value = Object.fromEntries(filteredEntries);

        // Calculate the total amount from both objects
        const totalAmount = [
            ...Object.values(numbersObject),
            ...Object.values(value)
        ]
            .map(amount => parseFloat(amount)) // Convert amounts to numbers
            .reduce((sum, current) => sum + (isNaN(current) ? 0 : current), 0); // Sum up amounts

        // setTotalAmount(totalAmount)
        if (totalAmount > maxVal) {
            toast.error(`You have insufficient funds to place the bet.`, {
                position: toast.POSITION.TOP_RIGHT,
            })
        } else if (!totalAmount) {
            toast.error(`Please enter an amount to place the bet.`, {
                position: toast.POSITION.TOP_RIGHT,
            })
        } else if (totalAmount <= maxVal) {
            console.log("numbersObject", numbersObject)
            console.log("value", value)
            let betNumbers = {
                ...numbersObject,
                ...value,
            }
            const numberArray = Object.keys(betNumbers).map(key => ({
                'Amount': Number(betNumbers[key]),  // Convert value to number
                'W_number': key  // Use the key as it is
              }));

              let payload = new URLSearchParams({
                number: numberArray,
                timeZone: formattedTime,
              })
            // timezone: "",
            console.log("payload", payload)
            try {
                let res = await handlePlacebet(payload)
                console.log("res", res)
            } catch (error) {
                console.log("error", error)
            }
        }
    }

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
                            {/* <div className="poker-wheel-box"> */}
                            <RouletteWheel />
                            {/* </div> */}
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
                                        <input
                                            type="text"
                                            name="zero"
                                            value={gameData.zero}
                                            onChange={(e) => {
                                                handleChange(e.target.name, e.target.value)
                                            }}></input>
                                    </div>
                                    <div className="table-top-left">
                                        <div className="form-field">
                                            <p>Date :</p>
                                            <p>{formattedDate}</p>
                                        </div>
                                        <div className="form-field">
                                            <p>Time :</p>
                                            <p>{formattedTime}</p>
                                        </div>
                                    </div>
                                </div>
                                <div
                                // className="poker-table-box" 
                                >
                                    <div
                                    // className="table-responsive"

                                    >
                                        <table
                                        // className="poker-number-table"
                                        >
                                            {allNumbers.map((num, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            <div className="poker-num-box">
                                                                <div className={`poker-num ${RedNumbers.includes(Number(num.name)) ? "red" : ""}`}>
                                                                    {num.name}
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    name={num.name}
                                                                    value={num.amount}
                                                                    onChange={(e) => handleNumberChange(num.name, e.target.value)} />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </table>
                                        {/* <table className="poker-number-table">
                                        <tr>
                                            <td>
                                                <div className="poker-num-box">
                                                    <div className="poker-num red">
                                                        1
                                                    </div>
                                                    <input type="text"></input>
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
                                        </table> */}
                                    </div>
                                </div>
                                <div className="poker-color-box mt-3">
                                    <div className="table-color-box">
                                        <div className="color-box-name red">
                                            red
                                        </div>
                                        <input
                                            type="text"
                                            name="red"
                                            value={gameData.red}
                                            onChange={(e) => {
                                                handleChange(e?.target.name, e?.target?.value)
                                            }}
                                        />
                                    </div>
                                    <div className="table-color-box">
                                        <div className="color-box-name">
                                            Black
                                        </div>
                                        <input
                                            type="text"
                                            name="black"
                                            value={gameData.black}
                                            onChange={(e) => {
                                                handleChange(e?.target.name, e?.target?.value)
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="casino-top-btn-grp mt-4">
                    {/* <a href="#" className="btn btn-casion">
                        <span>
                            HOME
                        </span>
                    </a>
                    <a href="#" className="btn btn-casion">
                        <span>
                            GET CHIPSW
                        </span>
                    </a> */}
                    <button href="#" className="btn btn-casion" onClick={onSubmit}>
                        <span>
                            SPIN
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};


export default React.memo(PlayandWin);