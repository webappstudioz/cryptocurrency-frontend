import React, { useState } from "react"
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  Label,
  Input,
} from "reactstrap"

import { ManageI } from "../../Common/CommonSvg"
const Status = props => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false)

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block table-status"
      >
        <DropdownToggle
          className="btn header-item waves-effect btn-"
          id="page-header-user-dropdown"
          tag="button"
        >
          <ManageI />
          <span className="d-none d-xl-inline-block ms-1 fw-medium font-size-15"></span>{" "}
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <div className="radio-btn">
            <div className="form-check form-check-inline">
              <Input
                type="radio"
                id="customRadioInline1"
                name="customRadioInline1"
                className="form-check-input"
              />
              <Label className="form-check-label" htmlFor="customRadioInline1">
                <span className="badge badge-pill bg-pill font-size-12 bg-soft-success badge bg-secondary">
                  Active
                </span>
              </Label>
            </div>
          </div>
          <div className="radio-btn">
            <div className="form-check form-check-inline">
              <Input
                type="radio"
                id="customRadioInline2"
                name="customRadioInline1"
                className="form-check-input"
              />
              <Label className="form-check-label" htmlFor="customRadioInline2">
                <span className="badge badge-pill bg-pill font-size-12  badge bg-secondary bg_suspend">
                  Suspended
                </span>
              </Label>
            </div>
          </div>
          <div className="radio-btn">
            <div className="form-check form-check-inline">
              <Input
                type="radio"
                id="customRadioInline3"
                name="customRadioInline1"
                className="form-check-input"
              />
              <Label className="form-check-label" htmlFor="customRadioInline3">
                <span className="badge badge-pill bg-pill font-size-12  badge bg-secondary bg-soft-danger">
                  Suspended
                </span>
              </Label>
            </div>
          </div>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  )
}

export default Status
