import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import SmallSidebar from "./Smallsidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

// ✅ SINGLE SOURCE OF TRUTH
const SIDEBAR_WIDTH = 260;
const SMALL_SIDEBAR_WIDTH = 60;

function Layout({ isSidebarOpen, handleToggleSidebar, setIsAuthenticated }) {
  const sidebarWidth = isSidebarOpen
    ? SIDEBAR_WIDTH
    : SMALL_SIDEBAR_WIDTH;

  return (
    <Box display="flex">
      {/* Sidebar */}
      {isSidebarOpen ? (
        <Sidebar
          onToggle={handleToggleSidebar}
          setIsAuthenticated={setIsAuthenticated}
        />
      ) : (
        <SmallSidebar
          onToggle={handleToggleSidebar}
          setIsAuthenticated={setIsAuthenticated}
        />
      )}

      {/* Main Content */}
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        sx={{
          marginLeft: `${sidebarWidth}px`,
          transition: "margin-left 0.2s ease-in-out",
          minHeight: "100%"
        }}
      >
        {/* ✅ PASS WIDTH TO NAVBAR */}
        <Navbar sidebarWidth={sidebarWidth} />

        {/* Page Content */}
        <Box flex={1} p={5}>
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}

export default Layout;
