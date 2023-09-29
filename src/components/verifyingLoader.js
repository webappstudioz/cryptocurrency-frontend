import React, { useEffect } from "react"
import { useState } from "react"
import loader from "../assets/images/loading.gif"
import LoadingBar from "react-top-loading-bar"

const divStyle = {
  textAlign: "center",
}
const VerifyLoader = loading => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setProgress(loading?.loading)
  }, [loading])
  return (
    <div>
      <LoadingBar
        color="#f11946"
        progress={progress}
        // onLoaderFinished={() => setProgress(100)}
        loaderSpeed={10}
      />
      <div
        style={divStyle}
        className="loader-form mdc-linear-progress loader-second"
      >
        <img src={loader} />
        <h2>Verifying...</h2>
      </div>
    </div>
  )
}

export default VerifyLoader
