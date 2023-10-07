import React, { useEffect, useRef} from "react"
import loader from "../assets/images/loading.gif"
import LoadingBar from "react-top-loading-bar"

const divStyle = {
  textAlign: "center",
}
const TextLoader = props => {
  const ref = useRef(null)
  const progress = props?.loading;
  const loading = props?.loader;

  useEffect(() => {
    progress === true? ref.current.continuousStart() : progress === false? ref.current.complete() : null
  }, [progress, loading])
  
  return (
    <div >
      <LoadingBar 
        // color="#f11946"
        color="linear-gradient(to right, #fd2839, #fb29fc, #285a3d)"
        ref={ref} 
      />
      {loading? <div style={divStyle} className="loader-form mdc-linear-progress">
        <img src={loader} />
      </div> : null}
    </div>
  )
}

export default TextLoader
