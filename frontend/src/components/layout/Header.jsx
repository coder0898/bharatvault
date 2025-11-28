import React from "react";
import { Button, Container, Navbar } from "react-bootstrap";
import { FileLock, List, ListColumns, ListNested } from "react-bootstrap-icons";

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
        >
          <Navbar.Brand
            style={{ cursor: "pointer" }}
            className="fs-2 text-primary fw-bold"
            onClick={onLogoClick}
          >
            <FileLock className="me-2" /> BharatVault
          </Navbar.Brand>
          {/* Hamburger for mobile */}
          <Button
            variant="outline-primary"
            className="d-md-none me-2"
            onClick={toggleSidebar}
          >
            <List size={30} />
          </Button>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
