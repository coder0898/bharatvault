import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Container,
  Form,
  ListGroup,
  Modal,
  Tab,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { BoxArrowInLeft, PersonCircle } from "react-bootstrap-icons";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { currentUser, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [showAadhaarModal, setShowAadhaarModal] = useState(false);
  const [aadhaarInput, setAadhaarInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  // Show toast helper
  const showToast = (message, variant = "success") => {
    setToast({ show: true, message, variant });
    setTimeout(
      () => setToast({ show: false, message: "", variant: "success" }),
      3000
    );
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) navigate("/auth");
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const handleAadhaarSubmit = async () => {
    if (!/^\d{12}$/.test(aadhaarInput)) {
      showToast("Aadhaar must be exactly 12 digits.", "danger");
      return;
    }

    const updatedUser = { ...currentUser, aadhaar: aadhaarInput };

    try {
      await updateUser(updatedUser, (errMsg) =>
        showToast("Failed to persist Aadhaar: " + errMsg, "danger")
      );
      showToast(isUpdating ? "Aadhaar updated!" : "Aadhaar linked!", "success");
      setShowAadhaarModal(false);
      setAadhaarInput("");
    } catch (err) {
      showToast("Unexpected error: " + err.message, "danger");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
    } catch (err) {
      showToast("Logout failed: " + err.message, "danger");
    }
  };

  return (
    <>
      <Tab.Pane eventKey="profile">
        <Container className="d-flex justify-content-center bg-white rounded p-3 align-items-center shadow-sm mb-4">
          <PersonCircle className="me-3 fs-1 text-primary fw-bold" />
          <h2 className="text-primary fw-bold">User Profile</h2>
        </Container>

        <Card className="border-0 shadow-sm rounded-4">
          <Card.Body>
            <h5 className="fw-bold mb-3 text-secondary">Account Details</h5>
            <ListGroup variant="flush">
              <ListGroup.Item className="d-flex justify-content-between py-3">
                <span className="fw-semibold text-muted">Username</span>
                <span className="fw-bold text-dark">
                  {currentUser.displayName || "—"}
                </span>
              </ListGroup.Item>

              <ListGroup.Item className="d-flex justify-content-between py-3">
                <span className="fw-semibold text-muted">Email</span>
                <span className="fw-bold text-dark">{currentUser.email}</span>
              </ListGroup.Item>

              <ListGroup.Item className="d-flex justify-content-between py-3">
                <span className="fw-semibold text-muted">Aadhaar</span>
                <span className="fw-bold text-dark">
                  {currentUser.aadhaar ? (
                    <>
                      {currentUser.aadhaar}
                      <Button
                        size="sm"
                        variant="link"
                        className="ms-2 text-primary p-0"
                        onClick={() => {
                          setIsUpdating(true);
                          setAadhaarInput(currentUser.aadhaar);
                          setShowAadhaarModal(true);
                        }}
                      >
                        Update
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => {
                        setIsUpdating(false);
                        setAadhaarInput("");
                        setShowAadhaarModal(true);
                      }}
                    >
                      Link Aadhaar
                    </Button>
                  )}
                </span>
              </ListGroup.Item>
            </ListGroup>

            <div className="text-center mt-4">
              <Button
                variant="outline-danger"
                size="lg"
                className="px-4 py-2 fw-bold rounded-3"
                onClick={handleLogout}
              >
                <BoxArrowInLeft className="me-2" /> Logout
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Tab.Pane>

      {/* Aadhaar Modal */}
      <Modal
        show={showAadhaarModal}
        onHide={() => setShowAadhaarModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isUpdating ? "Update Aadhaar Number" : "Link Aadhaar"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Aadhaar Number (12 digits)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Aadhaar Number"
                value={aadhaarInput}
                maxLength={12}
                onChange={(e) =>
                  setAadhaarInput(e.target.value.replace(/\D/g, ""))
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAadhaarModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAadhaarSubmit}>
            {isUpdating ? "Update" : "Link"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast */}
      <ToastContainer className="p-3" position="top-end">
        <Toast bg={toast.variant} show={toast.show} delay={3000} autohide>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default Profile;
