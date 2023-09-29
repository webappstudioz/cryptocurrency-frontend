import React, { useEffect, useState } from "react"
import ErrorImg from "../../assets/images/404-error.png"
const NoRecordFound = props => {
  const [message, setMessage] = useState(props?.message)
  
  return (
    <>
      <div className="ops-data">
        <h3 className="error-title">
          <i className="fas fa-exclamation-triangle"></i>{message}</h3>
      </div>
    </>
  )
}

export default NoRecordFound;
