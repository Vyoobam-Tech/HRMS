import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import SmallSidebar from "./Smallsidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function Layout({ isSidebarOpen, handleToggleSidebar, setIsAuthenticated }) {
  return (
    <Box display="flex">
      {isSidebarOpen ? (
        <Sidebar onToggle={handleToggleSidebar} setIsAuthenticated={setIsAuthenticated} />
      ) : (
        <SmallSidebar onToggle={handleToggleSidebar} setIsAuthenticated={setIsAuthenticated} />
      )}
      <Box flex={1} display="flex" flexDirection="column">
        <Navbar isSidebarOpen={isSidebarOpen} />
        <Box
          flex={1}
          p={5}
          sx={{
            marginLeft: isSidebarOpen ? "220px" : "60px",
            transition: "margin-left 0.2s ease-in-out",
          }}
        >
          {/* This is where child routes will appear */}
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;
