import React from "react";
import {
  Button,
  Col,
  FloatingLabel,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { ArrowRepeat, PersonPlus } from "react-bootstrap-icons";

const SignupForm = ({
  activeTab,
  signupDetails,
  setSignupDetails,
  confirmPassword,
  setConfirmPassword,
  handleSignupSubmit,
  handleResetForm,
  isSubmitting,
}) => {
  return (
    <div className={`tab-panel ${activeTab === "2" ? "show" : ""}`}>
      <Form
        onSubmit={handleSignupSubmit}
        onReset={handleResetForm}
        className="signup-form"
      >
        <FloatingLabel controlId="username" label="Username" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Username"
            name="username"
            value={signupDetails.username}
            onChange={(e) =>
              setSignupDetails((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
            required
            autoComplete="username"
          />
        </FloatingLabel>

        <FloatingLabel controlId="signupEmail" label="Email" className="mb-3">
          <Form.Control
            type="email"
            placeholder="Email"
            name="signupEmail"
            value={signupDetails.signupEmail}
            onChange={(e) =>
              setSignupDetails((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
            required
            autoComplete="email"
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="signupPassword"
          label="Password"
          className="mb-3"
        >
          <Form.Control
            type="password"
            placeholder="Password"
            name="signupPassword"
            value={signupDetails.signupPassword}
            onChange={(e) =>
              setSignupDetails((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
            autoComplete="new-password"
            required
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="confirmPassword"
          label="Confirm Password"
          className="mb-4"
        >
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </FloatingLabel>

        <Row className="g-2">
          <Col xs={12} sm={6}>
            <Button
              type="reset"
              variant="warning"
              className="w-100 py-2"
              disabled={isSubmitting}
            >
              <ArrowRepeat className="me-2" />
              Reset
            </Button>
          </Col>
          <Col xs={12} sm={6}>
            <Button
              type="submit"
              variant="primary"
              className="w-100 py-2"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Spinner animation="border" size="sm" className="me-2" />
              )}
              <PersonPlus className="me-2" />
              Signup
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SignupForm;
