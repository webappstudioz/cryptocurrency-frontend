import React, { useState } from "react"
import PropTypes from "prop-types"
import { deviceDetails } from "../../pages/Authentication/store/apiServices"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"

const ToogleSwitch = props => {
  const [toggleSwitch, settoggleSwitch] = useState(props?.value)
  const params = useParams()

  const nullHandler = async () => {
    settoggleSwitch(!toggleSwitch)
    let currentip = props.ip
    let m = currentip?.lastIndexOf("/")
    let mainip = currentip?.substring(0, m)

    if (params?.id) {
      let param = new URLSearchParams({
        service_id: params?.id,
        action: toggleSwitch ? "nullIP" : "unNullIP",
        ip: mainip,
      })
      try {
        props?.loader(true)
        props?.loading(true)
        let res = await deviceDetails(param)
        if (res) {
          props?.recall("noload")
          props?.loader(false)
          props?.loading(false)
          toast.success(res.data?.message, {
            position: toast.POSITION.TOP_RIGHT,
          })
        }
      } catch (error) {
        props?.recall("noload")
        settoggleSwitch(props.value)
        props?.loader(false)
        props?.loading(false)
        toast.error(error?.response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      }
    }
  }

  return (
    <>
      <div className={"form-check form-switch custom_switch"}>
        <input
          type="checkbox"
          className="form-check-input"
          id="customSwitch2"
          onChange={() => {}}
          checked={toggleSwitch}
          onClick={e => {
            nullHandler()
          }}
        />
      </div>
    </>
  )
}

ToogleSwitch.propTypes = {
  breadcrumbItem: PropTypes.string,
  breadcrumbImage: PropTypes.string,
  title: PropTypes.string,
}

export default ToogleSwitch
