import React, { useEffect } from "react"
const PermissionDenied = props => {
  useEffect(() => {
  }, [])
  return (
    <>
      <div className="ops-data">
        <h3 className="error-title">
          <i className="fas fa-exclamation-triangle"></i>Access Denied</h3>
        <p>You do not have the required permission to access this page</p>
        <p>Contact the master account owner if you feel this to be an error</p>
      </div>
    </>
  )
}

export default PermissionDenied
