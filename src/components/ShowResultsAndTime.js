import React, { useEffect, useState } from "react";
import { Col } from "reactstrap";
import { getGameResults } from "../pages/Authentication/store/apiServices";
import { RedNumbers, BlackNumbers } from "../constants/gameNumbers";
const ShowResultsAndTime = () => {
    const [gameResults, setGameResults] = useState("")

    useEffect(() => {
        getResults()
    }, [])


    const getResults = async () => {
        try {
            let res = await getGameResults()
            let info = res?.data?.data
            setGameResults(info)
        } catch (error) {
        }
    }

    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        // Function to update the date and time
        const updateDateTime = () => setDateTime(new Date());

        // Set up an interval to update the date and time every second
        const timerId = setInterval(updateDateTime, 1000);

        // Clean up the interval when the component is unmounted
        return () => clearInterval(timerId);
    }, []);

    // Format date and time
    const formattedDate = dateTime.toLocaleDateString();
    const formattedTime = dateTime.toLocaleTimeString();
    return (
        <>
            <div className="slide-content">
                <div className="">
                    <h1>Date :</h1>
                    <p>{formattedDate}</p>
                    <h1>Time :</h1>
                    <p>{formattedTime}</p>
                </div>
                <div className="inner-content">
                    {/* <h3 className="text-white">Comming Soon</h3> */}
                </div>
            </div>
            <div className="results-login-page">
                <div className="login-left-wrapper">
                    {gameResults ? gameResults?.map((result, index) => {
                        return (
                            <div className="login-left-input" key={index}>
                                <Col lg={12}>
                                    <label>{result?.time_zone}</label>
                                    <input
                                        type="text"
                                        className={RedNumbers?.includes(result?.winning_Number) ? "form-control redNumber" : BlackNumbers?.includes(result?.winning_Number) ? "form-control blackNumber" : "form-control"}
                                        name="zoneOne"
                                        defaultValue={result?.winning_Number}
                                        disabled
                                    />
                                </Col>
                            </div>
                        )
                    }) : null}
                </div>
            </div>
        </>
    )
}

export default ShowResultsAndTime;