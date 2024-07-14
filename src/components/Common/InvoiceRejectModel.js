import React, { useEffect, useState } from "react";
import { Col, Modal, Row, Dropdown, Form, FormFeedback } from "reactstrap";
import { Select } from "semantic-ui-react";
// import info from "../../assets/images/Info-Button.svg";
// import { customRegex } from "../../helpers/validation_helpers";
import { customRegex } from "../../helpers/validation_helpers";
import { changePaymentStatus, getPaymentRejectReasons } from "../../pages/Authentication/store/apiServices";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup"
import rederror from "../../assets/images/redvalidationicon/rederror.jpg"

const InvoiceRejectModal = ({ isRejectModal, setIsRejectModal, invoiceId }) => {
  const [spinner, setSpinner] = useState(false)
  const [reasonsOpt, setReasonsOpt] = useState([])
  const [selectedReason, setSelectedReason] = useState()
  const [description, setDescription] = useState()
  const [descriptionError, setDescriptionError] = useState()

  useEffect(() => {
    hanldePaymentRejectReasons()
  }, [])

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      reason: "",
      description: "",
    },
    validationSchema: () => {
      let schema = Yup.object().shape({
        reason: Yup.string()
          .required("Please select payment reject reason."),
        description: Yup.string()
          .matches(customRegex.address, "Please enter alphabets only")
          .matches(customRegex.spaces, "space not allowed"),
        country: Yup.string()
          .required('Please select your country'),
      })
      return schema
    },
    onSubmit: (values) => {
      console.log("value", values)
      // let data = new URLSearchParams({
      //   first_name: name[0],
      //   last_name: name[1] || "",
      //   phone_number: values?.phoneNumber,
      //   email: values?.email,
      //   country_id: values?.country,
      //   password: values?.password,
      //   confirm_password: values?.password,
      //   term_condition: terms,
      //   referral_code: values?.referralCode || "",
      // })

      // setSpinner(true)
      // setAction(true)
      // dispatch(registerUser(data, props?.history))
    },
  })


  const hanldePaymentRejectReasons = async () => {
    try {
      let res = await getPaymentRejectReasons()
      let options = res?.data?.data?.map((reason) => {
        return { value: reason?.id, label: reason?.reason }
      })
      setReasonsOpt(options)
    } catch (error) {
      console.log("error", error)
    }
  }

  const handleReject = async () => {
    setSpinner(true)
    try {
      let data = new URLSearchParams({
        deposit_id: invoiceId,
        reason: selectedReason,
        description: description,
        reason: "canceled",
      })

      let res = await changePaymentStatus(data)
      console.log("res", res)

    } catch (error) {
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  }

  const handleDropdownChange = (_, { value }) => {
    validation.setFieldValue('reason', value);
  };

  return (
    <Modal
      isOpen={isRejectModal}
      toggle={() => { setIsRejectModal(false) }}
      backdrop={"static"}
      scrollable={true}
      id="staticBackdrop"
      className="modal_v1"
    >
      <div className="modal-header">
        <Row className="w-100">
          <Col xs="10">
            <h5 className="modal-title" id="staticBackdropLabel">
              Do you want to reject invoice.
            </h5>
          </Col>
          <Col xs="2">
            <div className="right-content text-end">
              <button
                type="button"
                className="btn-close buttoncustom"
                onClick={(e) => {
                  spinner ? e?.preventDefault() : setIsRejectModal(false);
                }}
                aria-label="Close"
              ></button>
            </div>
          </Col>
        </Row>
      </div>
      <div className="modal-body">
        <Form
          className="form-horizontal"
          onSubmit={e => {
            e.preventDefault()
            validation.handleSubmit()
            return false
          }}
        >
          <div className="form-group select-v1">
            <label className="text-blue font-semibold">Reject Reson</label>
            <Dropdown
              name="reason"
              placeholder="Select Reason"
              className={(validation.touched.country && validation.errors.country) ? "input-outline is-invalid" : "input-outline"}
              // fluid
              // className={(validation.touched.country && validation.errors.country) ? "input-outline is-invalid" : "input-outline"}
              value={validation?.values?.country || ""}
              onChange={handleDropdownChange}
              onBlur={validation.handleBlur}
              options={reasonsOpt}
              invalid={
                validation.touched.reason &&
                  validation.errors.reason
                  ? "true"
                  : "false"
              }
            />
            {validation.touched.reason && validation.errors.reason ? (
              <>
                <FormFeedback type="invalid">
                  <img
                    className="form-error-icon"
                    src={rederror}
                    alt=""
                    height={15}
                  />
                  {validation.errors.reason}
                </FormFeedback>
              </>
            ) : null}
          </div>
          <div className="form-group select-v1">
            <label className="text-blue font-semibold d-block">Description</label>
            <textarea
              name="description"
              disabled={spinner}
              className="textarea_v1"
              placeholder="description"
              value={validation?.values?.description || ""}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
            ></textarea>
            {validation.touched.country && validation.errors.country ? (
              <>
                <FormFeedback type="invalid">
                  <img
                    className="form-error-icon"
                    src={rederror}
                    alt=""
                    height={15}
                  />
                  {validation.errors.country}
                </FormFeedback>
              </>
            ) : null}
          </div>
          <div className="btn-group">
            <button
              className="btn btn-primary btn-modal waves-effect waves-light d-flex justify-content-center align-items-center buttoncustom "
              type="submit"
              onClick={(e) => { setIsRejectModal(false) }}
              style={{
                cursor:
                  spinner ? "not-allowed"
                    : "pointer",
              }}
              disabled={spinner}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary w-100 waves-effect waves-light"
              type="submit"
              disabled={spinner}
            >
              {spinner ? (
                <div className="ui active inline loader"></div>
              ) : (
                "Reject"
              )}
            </button>
          </div>
        </Form>
      </div>
    </Modal>
  )
}

export default InvoiceRejectModal;