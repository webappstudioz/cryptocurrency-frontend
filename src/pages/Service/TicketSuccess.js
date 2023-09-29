import React from "react";
import { useParams, Link, useLocation } from "react-router-dom";

function TicketSuccess() {
  const param = useParams();
  const location = useLocation()
  const ticketId = location?.state?.ticketId
  const id = location?.state?.id
  return (
    // <div className="ticket-success-main-sec" div style={{  textAlign: "center",marginTop:"200px" }}>
    <div className="ticket-success-page">
      <div className="ticket-success-main-sec" style={{  textAlign: "center",marginTop:"160px" }}>
      <p className="ticket-success" style={{ backgroundColor:"lightGreen" }}>
        Ticket created :#{ticketId}{" "}
      </p>

      <p>
        Your ticket has been succesfully created. An email has been sent to your address with the details of your ticket. You can view this ticket now.
      </p>
      <Link to={{pathname:`/ticket-view`,state:{id:id}}}>continue<i className="fas fa-arrow-circle-right"></i></Link>
    </div>
    </div>
  );
}

export default TicketSuccess;
