import React, { useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Tab,
  Spinner,
} from "react-bootstrap";
import { useFiles } from "../context/FileContext";
import {
  FileEarmarkText,
  Share,
  BarChartFill,
  HouseDoorFill,
} from "react-bootstrap-icons";

const Dashboard = () => {
  const { fileList, loading } = useFiles();

  const stats = useMemo(() => {
    if (!fileList || fileList.length === 0)
      return {
        totalFiles: 0,
        totalShared: 0,
        totalSizeKB: 0,
        fileTypeCount: {},
        recentFiles: [],
      };

    const totalFiles = fileList.length;
    const totalShared = fileList.filter((f) => f.shared).length;

    const totalSizeKB = fileList.reduce(
      (sum, f) => sum + parseFloat(f.size || 0),
      0
    );

    const fileTypeCount = {};
    fileList.forEach((f) => {
      const t = f.type || "Unknown";
      fileTypeCount[t] = (fileTypeCount[t] || 0) + 1;
    });

    const recentFiles = [...fileList]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    return { totalFiles, totalShared, totalSizeKB, fileTypeCount, recentFiles };
  }, [fileList]);

  return (
    <Tab.Pane eventKey="dashboard">
      <Container className="bg-white rounded p-3 shadow-sm d-flex align-items-center justify-content-center mb-4">
        <HouseDoorFill className="me-3 fs-1 text-primary" />
        <h2 className="text-primary fw-bold m-0">Dashboard Overview</h2>
      </Container>

      <Container className="bg-white rounded p-4 shadow-sm">
        <Row className="gy-4 mb-4">
          <StatCard
            title="Total Files"
            value={stats.totalFiles}
            icon={<FileEarmarkText size={40} />}
            color="primary"
            loading={loading}
          />
          <StatCard
            title="Shared Files"
            value={stats.totalShared}
            icon={<Share size={40} />}
            color="success"
            loading={loading}
          />
          <StatCard
            title="Storage Used"
            value={`${stats.totalSizeKB.toFixed(2)} KB`}
            icon={<BarChartFill size={40} />}
            color="warning"
            loading={loading}
          />
        </Row>

        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-primary text-white fw-bold">
            File Types Breakdown
          </Card.Header>
          <Card.Body>
            {loading ? (
              <div className="text-center py-3">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : Object.keys(stats.fileTypeCount).length === 0 ? (
              <p className="text-muted m-0">No files uploaded yet.</p>
            ) : (
              <ul className="m-0">
                {Object.entries(stats.fileTypeCount).map(([type, count]) => (
                  <li key={type}>
                    <strong>{type}:</strong> {count}
                  </li>
                ))}
              </ul>
            )}
          </Card.Body>
        </Card>

        <Card className="shadow-sm">
          <Card.Header className="bg-secondary text-white fw-bold">
            Recent Uploads
          </Card.Header>
          <Card.Body className="p-0">
            <Table responsive hover className="m-0 text-center">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Size</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Shared</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-3 text-center">
                      <Spinner animation="border" variant="secondary" />
                    </td>
                  </tr>
                ) : stats.recentFiles.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-3 text-muted">
                      No recent uploads
                    </td>
                  </tr>
                ) : (
                  stats.recentFiles.map((file) => (
                    <tr key={file.id}>
                      <td className="text-start">{file.name}</td>
                      <td>{file.size}</td>
                      <td>{file.type}</td>
                      <td>{new Date(file.date).toLocaleString()}</td>
                      <td>{file.shared ? "Yes" : "No"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </Tab.Pane>
  );
};

const StatCard = ({ title, value, icon, color, loading }) => (
  <Col xs={12} sm={6} lg={4}>
    <Card className="shadow-sm h-100 text-center border-0">
      <Card.Body className="py-4">
        <div className={`text-${color} mb-2`}>{icon}</div>
        <h6 className={`text-${color} fw-bold`}>{title}</h6>
        <h3 className="fw-bold">
          {loading ? <Spinner animation="border" size="sm" /> : value}
        </h3>
      </Card.Body>
    </Card>
  </Col>
);

export default Dashboard;
