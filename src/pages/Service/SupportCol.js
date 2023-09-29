import React, { useState } from "react";
import { Link } from "react-router-dom";
import notes from "../../assets/images/notes.png";

const Department = (cell) => {
  return (
    <div className="d-flex align-items-center country">
      {cell?.row?.original?.department}
    </div>
  );
};

const Status = (cell) => {
  return (
    <div className="status-icon-container">
      <div
        className={
          cell?.row?.original?.status == "Resolved"
            ? "tableStatus-Active"
            : cell?.row?.original?.status == "Closed"
            ? "tableStatus-Terminated"
            : cell?.row?.original?.status == "Suspended"
            ? "tableStatus-Suspended"
            : cell?.row?.original?.status == "Pending"
            ? "tableStatus-Pending"
            : cell?.row?.original?.status == "Open"
            ? "tableStatus-Cancelled"
            : "tableStatus-any"
        }
      >
        {cell?.row?.original?.status}
      </div>
    </div>
  );
};

const Number = (cell) => {
  return (
    <div className="d-flex align-items-center country">
      {/* {cell?.row?.original?.ticket_id} */}
      <Link to={{pathname:`/ticket-view`, state:{id:cell.row.original.id}}}>#{cell?.row?.original?.ticket_id}</Link>
    </div>
  );
};

const LastUpdated = (cell) => {
  return (
    <span style={{ display: "flex", columnGap: "10px" }}>
      <span style={{ display: "flex", alignItems: "baseline" }}>
        <img src={notes} />
      </span>
      <span>{cell?.row?.original?.last_updated}</span>
    </span>
  );
};
const Subject = (cell) => {
  return cell?.row?.original?.subject
};

export { Number, Department, Status, LastUpdated, Subject };
