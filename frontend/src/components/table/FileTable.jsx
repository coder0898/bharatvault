import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  OverlayTrigger,
  Pagination,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import { PencilSquare, ShareFill, Trash } from "react-bootstrap-icons";

const FileTable = ({
  filteredFiles,
  handleShowModal,
  handleDeleteBtn,
  handleShareFile,
  fullList,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 3;

  const totalPages = Math.ceil(filteredFiles.length / filesPerPage);

  const currentFiles = filteredFiles.slice(
    (currentPage - 1) * filesPerPage,
    currentPage * filesPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages || 1);
  }, [totalPages]);

  const renderFileName = (file) => {
    const isLong = file.name.length > 20;
    const displayName = isLong ? file.name.slice(0, 20) + "..." : file.name;

    return (
      <OverlayTrigger placement="top" overlay={<Tooltip>{file.name}</Tooltip>}>
        <span>{displayName}</span>
      </OverlayTrigger>
    );
  };

  return (
    <div className="table-responsive">
      <Table hover bordered striped className="align-middle text-center">
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>File Name</th>
            <th>Size</th>
            <th>Type</th>
            <th>Upload Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentFiles.length > 0 ? (
            currentFiles.map((file) => {
              const actualIndex = fullList.findIndex((f) => f.id === file.id);

              return (
                <tr key={file.id}>
                  <td>{actualIndex + 1}</td>
                  <td className="text-start fw-semibold">
                    {renderFileName(file)}
                  </td>
                  <td>{file.size}</td>
                  <td>{file.type}</td>
                  <td>{file.date}</td>

                  <td className="d-flex justify-content-center gap-2 flex-wrap">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleShareFile(actualIndex)}
                    >
                      <ShareFill className="me-1" />
                      Share
                    </Button>

                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={() => handleShowModal("edit", actualIndex)}
                    >
                      <PencilSquare className="me-1" />
                      Edit
                    </Button>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={(e) => handleDeleteBtn(e, actualIndex)}
                    >
                      <Trash className="me-1" />
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-muted">
                No files found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <Row className="mt-3">
          <Col className="d-flex justify-content-center">
            <Pagination>
              <Pagination.First
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
              />
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              />

              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}

              <Pagination.Next
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              />
              <Pagination.Last
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
              />
            </Pagination>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default FileTable;
