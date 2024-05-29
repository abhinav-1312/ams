import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface Props {
  children: React.ReactNode;
  window?: () => Window;
}

export default function ResponsiveDrawer(props: Props) {
  const { window, children } = props;
  const [drawerWidth, setDrawerWidth] = useState(260);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    setDrawerWidth((prevWidth) => (prevWidth === 260 ? 0 : 260));
  };
  const handleDrawerClose = () => {
    setMobileOpen(false);
    setDrawerWidth(0);
  };
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Navbar
          handleDrawerOpen={handleDrawerToggle}
          drawerWidth={drawerWidth}
        />
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerClose}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: 260,
              },
            }}
          >
            <Sidebar />
          </Drawer>
          <Drawer
            variant="persistent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            <Sidebar />
          </Drawer>
        </Box>
        <Box
          className="main"
          component="main"
          sx={{
            flexGrow: 1,
            margin: 5,
            padding: 5,
            height: "100%",
            width: "100%",
            overflow: "hidden",
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
}
