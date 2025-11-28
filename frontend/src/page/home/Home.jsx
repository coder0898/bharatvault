import { useState } from "react";
import { Tab } from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header.jsx";
import Sidebar from "../../components/layout/Sidebar.jsx";
import Main from "../../components/layout/Main.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

function Home() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [activeKey, setActiveKey] = useState("dashboard");
  const [showSidebar, setShowSidebar] = useState(false);

  const onLogoClick = (e) => {
    e.preventDefault();
    setActiveKey("dashboard");
  };

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <>
      <Header onLogoClick={onLogoClick} toggleSidebar={toggleSidebar} />
      <div
        style={{
          paddingTop: "56px", // navbar height
          display: "flex",
          width: "100vw",
        }}
      >
        <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
          {/* Sidebar */}
          <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
          {/* Main Content */}
          <div className="content p-4">
            <Main logout={logout} />
          </div>
        </Tab.Container>
      </div>
    </>
  );
}

export default Home;
