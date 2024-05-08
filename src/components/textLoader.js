import React, { useEffect, useRef} from "react"
import loader from "../assets/images/loading.gif"
import LoadingBar from "react-top-loading-bar"
import { Triangle } from  'react-loader-spinner'

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
        // color="linear-gradient(to right, #fd2839, #fb29fc, #285a3d)"
        color="linear-gradient(to right, #fdc929, #285a3d)"
        ref={ref} 
      />
      {loading? 
      <div style={divStyle} className="loader-form mdc-linear-progress">
        {/* <img src={loader} /> */}
        <Triangle
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="triangle-loading"
          wrapperStyle={{}}
          wrapperClassName=""
          visible={true}
        />
      </div> 
      : null}
    </div>
  )
}

export default TextLoader
