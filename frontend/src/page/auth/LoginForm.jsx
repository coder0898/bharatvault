import React from "react";
import { Button, FloatingLabel, Form, Spinner } from "react-bootstrap";
import { BoxArrowInRight } from "react-bootstrap-icons";

const LoginForm = ({
  activeTab,
  loginDetails,
  setLoginDetails,
  handleLoginSubmit,
  isSubmitting,
}) => {
  return (
    <div className={`tab-panel ${activeTab === "1" ? "show" : ""}`}>
      <Form onSubmit={handleLoginSubmit} className="login-form">
        <FloatingLabel controlId="loginEmail" label="Email" className="mb-3">
          <Form.Control
            type="email"
            name="loginEmail"
            value={loginDetails.loginEmail}
            onChange={(e) =>
              setLoginDetails((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
            autoComplete="email"
            required
            placeholder="Email"
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="loginPassword"
          label="Password"
          className="mb-4"
        >
          <Form.Control
            type="password"
            name="loginPassword"
            value={loginDetails.loginPassword}
            onChange={(e) =>
              setLoginDetails((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
            required
            autoComplete="current-password"
            placeholder="Password"
          />
        </FloatingLabel>

        <Button
          type="submit"
          variant="primary"
          className="w-100 py-2"
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <Spinner animation="border" size="sm" className="me-2" />
          )}
          <BoxArrowInRight className="me-2" />
          Login
        </Button>
      </Form>
    </div>
  );
};

export default LoginForm;
