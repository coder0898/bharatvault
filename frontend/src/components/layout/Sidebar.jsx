import React from "react";
import { Nav } from "react-bootstrap";
import { HouseDoorFill, ListCheck, PersonCircle } from "react-bootstrap-icons";

const Sidebar = ({ showSidebar, setShowSidebar }) => {
  return (
    <>
      <Nav
        variant="pills"
        className={`sidebar flex-column bg-light border-end pt-5 ${
          showSidebar ? "sidebar-show" : "sidebar-hide"
        } d-md-block`}
      >
        <Nav.Item>
          <Nav.Link
            eventKey="dashboard"
            className="fw-bold"
            onClick={() => setShowSidebar(false)}
          >
            <HouseDoorFill className="me-2" /> Dashboard
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="profile"
            className="fw-bold"
            onClick={() => setShowSidebar(false)}
          >
            <PersonCircle className="me-2" /> Profile
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="fileList"
            className="fw-bold"
            onClick={() => setShowSidebar(false)}
          >
            <ListCheck className="me-2" /> FileList
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </>
  );
};

export default Sidebar;
