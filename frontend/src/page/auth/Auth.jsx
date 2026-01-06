import React, { useState } from "react";
import { Col, Container, Row, Toast, ToastContainer } from "react-bootstrap";
import { FileLock } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm.jsx";
import SignupForm from "./SignupForm.jsx";
import AuthTab from "./AuthTab.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const Auth = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [toast, setToast] = useState({ show: false, message: "", variant: "" });

  const showToast = (message, variant = "success") => {
    setToast({ show: true, message, variant });
  };

  const [activeTab, setActiveTab] = useState("1");

  const [loginDetails, setLoginDetails] = useState({
    loginEmail: "",
    loginPassword: "",
  });

  const [signupDetails, setSignupDetails] = useState({
    username: "",
    signupEmail: "",
    signupPassword: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const result = await login(
      loginDetails.loginEmail,
      loginDetails.loginPassword
    );

    if (!result.success) return showToast(result.message, "danger");

    showToast("Login successful!");
    navigate("/home");
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (signupDetails.signupPassword !== confirmPassword) {
      return showToast("Passwords do not match", "danger");
    }

    const result = await signup(
      signupDetails.username,
      signupDetails.signupEmail,
      signupDetails.signupPassword
    );

    if (!result.success) return showToast(result.message, "danger");

    showToast("Signup successful!");
    setActiveTab("1");
  };

  return (
    <Container
      fluid
      className=" d-flex align-items-center justify-content-center p-3"
      style={{ overflow: "hidden" }}
    >
      <Row
        className="w-100 shadow rounded overflow-hidden bg-white"
        style={{ maxWidth: "900px", width: "100%" }}
      >
        {/* Left / Branding Section */}
        <Col
          md={5}
          className="d-none d-md-flex flex-column align-items-center justify-content-center bg-primary text-white p-4"
          style={{ minHeight: "500px" }}
        >
          <FileLock size={60} className="mb-3" />
          <h2 className="fw-bold mb-2">BharatVault</h2>
          <p className="text-center fs-5">
            Digital safe for your personal documents
          </p>
        </Col>

        {/* Right / Auth Forms Section */}
        <Col xs={12} md={7} className="p-4">
          <h1 className="text-center text-primary mb-4">
            <FileLock className="me-2" /> BharatVault
          </h1>

          <AuthTab activeTab={activeTab} setActiveTab={setActiveTab} />

          <LoginForm
            activeTab={activeTab}
            loginDetails={loginDetails}
            setLoginDetails={setLoginDetails}
            handleLoginSubmit={handleLoginSubmit}
          />

          <SignupForm
            activeTab={activeTab}
            signupDetails={signupDetails}
            setSignupDetails={setSignupDetails}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            handleSignupSubmit={handleSignupSubmit}
          />

          {/* Toast Notifications */}
          <ToastContainer position="top-end" className="p-3">
            <Toast
              bg={toast.variant}
              onClose={() => setToast({ ...toast, show: false })}
              show={toast.show}
              delay={3000}
              autohide
            >
              <Toast.Body>{toast.message}</Toast.Body>
            </Toast>
          </ToastContainer>
        </Col>
      </Row>
    </Container>
  );
};

export default Auth;
