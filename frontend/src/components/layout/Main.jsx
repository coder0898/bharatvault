import React from "react";
import { Tab } from "react-bootstrap";
import Dashboard from "../../tab/Dashboard.jsx";
import Profile from "../../tab/Profile.jsx";
import Filelist from "../../tab/Filelist.jsx";

const Main = ({ handleLogout }) => {
  return (
    <>
      <Tab.Content>
        <Dashboard />
        <Profile handleLogout={handleLogout} />
        <Filelist />
      </Tab.Content>
    </>
  );
};

export default Main;
