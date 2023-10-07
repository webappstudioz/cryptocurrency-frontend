import React, { useEffect, useRef} from "react"
import LoadingBar from "react-top-loading-bar"

const ProgressBar = props => {
  const ref = useRef(null)
  const progress = props?.loading;

  useEffect(() => {
    progress === true? ref.current.continuousStart() : progress === false? ref.current.complete() : null
  }, [progress])
  
  return (
    // <div className="progressloader">
    //   <div className="loader__element"></div>
    //  </div>
    <div className="lodingbar">
      <LoadingBar 
        color="linear-gradient(to right, #fd2839, #fb29fc, #285a3d)"
        ref={ref} 
      />
    </div>
  )
}

export default ProgressBar
