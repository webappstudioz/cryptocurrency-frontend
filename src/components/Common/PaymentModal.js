import React from "react"
import { Col, Modal, ModalBody, Row } from "reactstrap"
import { Watch } from "react-loader-spinner"
const PaymentModal = props => {
  return (
    <Modal className="model-clock-box" isOpen={props?.openModal} centered={true}>
    <ModalBody className="py-3">
      <Row>
        <Col lg={12}>
          <div className="text-center">
            <div className="watch-loader">
            <Watch 
              height="50"
              width="50"
              radius="48"
              color="#171168"
              ariaLabel="watch-loading"
              wrapperStyle={{}}
              wrapperClassName="justity-content-center"
              visible={true}
            />
            </div>
            <h2>{props?.message} processing...</h2>
            <h5>{`Please wait while we process your ${props?.message}. This may take few seconds. Do not refresh the page or navigate away while this is happening.`}</h5>
            <br/>
            <h5><b>{"Thank you for your patience."}</b></h5>
          </div>
        </Col>
      </Row>
    </ModalBody>
  </Modal>
  )
}

export default PaymentModal
