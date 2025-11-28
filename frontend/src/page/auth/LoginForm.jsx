import React from "react";
import { Button, Form, Spinner } from "react-bootstrap";
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
      <Form onSubmit={handleLoginSubmit}>
        <Form.Group className="mb-3" controlId="loginEmail">
          <Form.Control
            type="email"
            placeholder="Email"
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
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="loginPassword">
          <Form.Control
            type="password"
            placeholder="Password"
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
          />
        </Form.Group>

        <Button
          type="submit"
          className="w-100"
          variant="primary"
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
