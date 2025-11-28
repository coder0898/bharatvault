import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalContainer = ({
  modalShow,
  handleCloseModal,
  handleFileUpload,
  submitUploadFile,
  handleConfirmDelete,
  mode,
  shareFile,
  confirmDelete,
}) => {
  return (
    <Modal show={modalShow} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === "add" && "Upload File"}
          {mode === "edit" && "Edit File"}
          {mode === "share" && "Share File"}
          {mode === "delete" && "Delete File"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {(mode === "add" || mode === "edit") && (
          <Form>
            <Form.Group>
              <Form.Label>Select a file</Form.Label>
              <h6 className="text-danger fw-bold">
                Only PDF & Images allowed.
              </h6>
              <Form.Control
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
              />
            </Form.Group>
          </Form>
        )}

        {mode === "share" && shareFile && (
          <>
            <p>Copy the link below:</p>
            <Form.Control type="text" readOnly value={shareFile.url} />
            <Button
              className="mt-2"
              onClick={() => navigator.clipboard.writeText(shareFile.url)}
            >
              Copy Link
            </Button>
          </>
        )}

        {mode === "delete" && confirmDelete && (
          <>
            <h5 className="text-danger fw-bold">Are you sure?</h5>
            <p>
              You are about to delete <strong>{confirmDelete.name}</strong>
            </p>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Cancel
        </Button>

        {mode === "delete" ? (
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        ) : (
          <Button variant="primary" onClick={submitUploadFile}>
            {mode === "add" && "Upload"}
            {mode === "edit" && "Save Changes"}
            {mode === "share" && "Copied"}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ModalContainer;
