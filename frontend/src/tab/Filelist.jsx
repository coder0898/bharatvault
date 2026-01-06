import React, { useState } from "react";
import { Button, Col, Container, Form, Row, Tab } from "react-bootstrap";
import { ListCheck, PlusLg, Search } from "react-bootstrap-icons";
import FileTable from "../components/table/FileTable";
import ModalContainer from "../components/modal/ModalContainer.jsx";
import { useFiles } from "../context/FileContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

const Filelist = () => {
  const { fileList, addFile, updateFile, deleteFile, generateShareLink } =
    useFiles();
  const { showToast } = useToast();

  const [modalShow, setModalShow] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [mode, setMode] = useState("add");
  const [editIndex, setEditIndex] = useState(null);
  const [shareFile, setShareFile] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleShowModal = (type, index = null) => {
    setMode(type);
    setModalShow(true);

    if (type === "edit") {
      setEditIndex(index);
      setUploadFile(null);
    }

    if (type === "add") {
      setUploadFile(null);
      setEditIndex(null);
    }

    if (type === "share") {
      setShareFile(fileList[index]);
    }

    if (type === "delete") {
      setConfirmDelete(fileList[index]);
      setEditIndex(index);
    }
  };

  const handleCloseModal = () => {
    setModalShow(false);
    setUploadFile(null);
    setEditIndex(null);
    setShareFile(null);
    setConfirmDelete(null);
  };

  const handleFileUpload = (e) => setUploadFile(e.target.files[0]);

  const submitUploadFile = async (e) => {
    e.preventDefault();

    const currentFile = uploadFile || fileList[editIndex];
    if (!currentFile) {
      showToast("Please select a file.", "warning");
      return;
    }

    const fileData = {
      name: currentFile.name,
      size: `${(currentFile.size / 1024).toFixed(2)} KB`,
      type: currentFile.type,
      date: new Date().toLocaleDateString(),
    };

    let result;
    if (mode === "add") result = await addFile(fileData, uploadFile);
    if (mode === "edit")
      result = await updateFile(editIndex, fileData, uploadFile);

    if (!result?.success) {
      showToast(result?.message || "Operation failed", "danger");
      return;
    }

    showToast(result.message || "Operation successful", "success");
    handleCloseModal();
  };

  const handleConfirmDelete = async () => {
    if (editIndex === null) return;
    const result = await deleteFile(editIndex);
    if (!result?.success)
      showToast(result?.message || "Delete failed", "danger");
    handleCloseModal();
  };

  const handleDeleteBtn = (e, index) => {
    e.stopPropagation();
    handleShowModal("delete", index);
  };

  // const handleShareFile = (index) => {
  //   handleShowModal("share", index);
  // };
  const handleShareFile = async (index) => {
    const url = await generateShareLink(index);
    if (!url) return;

    // Copy link to clipboard
    navigator.clipboard
      .writeText(url)
      .then(() => showToast("Share link copied!", "success"))
      .catch(() => showToast("Failed to copy link", "danger"));

    // Optional: set state for modal display if you have a share modal
    setShareFile({ ...fileList[index], url });
  };

  const filteredFiles = fileList.filter((file) => {
    const safeName = file?.name || file?.originalName || "";
    return safeName.toLowerCase().includes(searchTerm.toLowerCase().trim());
  });

  return (
    <Tab.Pane eventKey="fileList">
      <Container className="d-flex justify-content-center bg-white rounded p-3 align-items-center shadow-sm">
        <ListCheck className="me-3 fs-1 text-primary fw-bold" />
        <h2 className="text-primary fs-2 fw-bold mb-0">File List</h2>
      </Container>

      <Container className="bg-white rounded p-4 shadow-sm mt-4">
        <Row className="mb-3 align-items-center border-bottom border-primary border-4">
          <Col xs={12} md={6}>
            <h4 className="text-primary fw-bold mb-2">Uploaded Files</h4>
          </Col>
          <Col>
            <Button
              variant="primary"
              className="d-flex align-items-center float-end mb-2"
              onClick={() => handleShowModal("add")}
            >
              <PlusLg className="text-white me-2" /> Add File
            </Button>

            <ModalContainer
              modalShow={modalShow}
              mode={mode}
              shareFile={shareFile}
              confirmDelete={confirmDelete}
              handleCloseModal={handleCloseModal}
              handleFileUpload={handleFileUpload}
              submitUploadFile={submitUploadFile}
              handleConfirmDelete={handleConfirmDelete}
            />
          </Col>
        </Row>

        <Row className="mb-3 justify-content-end">
          <Col xs={12} md="auto">
            <Form className="d-flex position-relative mt-2 mb-2 mt-md-0">
              <Form.Control
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ps-5"
              />
              <Search
                className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"
                size={18}
              />
            </Form>
          </Col>
        </Row>

        <FileTable
          filteredFiles={filteredFiles}
          handleShowModal={handleShowModal}
          handleDeleteBtn={handleDeleteBtn}
          fullList={fileList}
          handleShareFile={handleShareFile}
        />
      </Container>
    </Tab.Pane>
  );
};

export default Filelist;
