import React from "react";
import { Button } from "react-bootstrap";
import { BoxArrowInRight, PersonPlus } from "react-bootstrap-icons";

const AuthTab = ({ activeTab, setActiveTab }) => {
  return (
    <>
      <div className="tab-buttons text-center mb-3" role="tablist">
        <Button
          className={`tab ${activeTab === "1" ? "active" : ""}`}
          onClick={() => setActiveTab("1")}
        >
          <BoxArrowInRight className="me-2" /> Login
        </Button>
        <Button
          className={`tab ${activeTab === "2" ? "active" : ""}`}
          onClick={() => setActiveTab("2")}
        >
          <PersonPlus className="me-2" /> Signup
        </Button>
      </div>
    </>
  );
};

export default AuthTab;
