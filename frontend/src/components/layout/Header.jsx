import React from "react";
import { Button, Container, Navbar } from "react-bootstrap";
import { FileLock, List } from "react-bootstrap-icons";

const Header = ({ onLogoClick, toggleSidebar }) => {
  return (
    <>
      <Navbar
        bg="light"
        data-bs-theme="light"
        fixed="top"
        className="shadow-sm"
        style={{ zIndex: 1050 }}
      >
        <Container
          fluid
          className="d-flex justify-content-between align-items-center"
          style={{ maxWidth: "1140px" }}
        >
          <Navbar.Brand
            style={{ cursor: "pointer" }}
            className="fs-2 text-primary fw-bold d-flex align-items-center"
            onClick={onLogoClick}
          >
            <FileLock size={32} className="me-2" />
            BharatVault
          </Navbar.Brand>

          {/* Hamburger for mobile */}
          <Button
            variant="outline-primary"
            className="d-md-none me-2"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            style={{ borderRadius: "8px", padding: "6px 12px" }}
          >
            <List size={28} />
          </Button>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
