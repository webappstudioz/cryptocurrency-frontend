import React from "react";

import ProgressBar from "@ramonak/react-progress-bar";

const OsInstallationBar = ({ percentage } = props) => {
    return(
         <ProgressBar 
            className="os_installation_bar"
            completed={percentage} 
         />
    )
}

export default OsInstallationBar;