import React from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
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
      <Form onSubmit={handleSignupSubmit} onReset={handleResetForm}>
        <Form.Group className="mb-3" controlId="username">
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
        </Form.Group>

        <Form.Group className="mb-3" controlId="signupEmail">
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
        </Form.Group>

        <Form.Group className="mb-3" controlId="signupPassword">
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
        </Form.Group>

        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </Form.Group>

        <Row className="g-2">
          <Col>
            <Button
              type="reset"
              variant="warning"
              className="w-100"
              disabled={isSubmitting}
            >
              <ArrowRepeat className="me-2" /> Reset
            </Button>
          </Col>
          <Col>
            <Button
              type="submit"
              variant="primary"
              className="w-100"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Spinner animation="border" size="sm" className="me-2" />
              )}
              <PersonPlus className="me-2" /> Signup
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SignupForm;
