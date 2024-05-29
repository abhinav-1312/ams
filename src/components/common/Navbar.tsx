import React from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { Typography, IconButton, Toolbar, Button, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

interface AppBarProps extends MuiAppBarProps {
  handleDrawerOpen: () => void;
  drawerWidth: number;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) =>
    prop !== "handleDrawerOpen" && prop !== "drawerWidth",
})<AppBarProps>(({ theme, handleDrawerOpen, drawerWidth }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: `calc(100% - ${drawerWidth}px)`,
  marginLeft: `${drawerWidth}px`,
}));

const Navbar: React.FC<AppBarProps> = ({ handleDrawerOpen, drawerWidth }) => {
  const Logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("mobileNumber");
    localStorage.removeItem("assetIds");
    localStorage.removeItem("locationId");
    window.location.reload();
  };

  return (
    <AppBar
      position="fixed"
      handleDrawerOpen={handleDrawerOpen}
      drawerWidth={drawerWidth}
    >
      <Box
        sx={{
          display: "flex !important",
          justifyContent: "space-between",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ width: "100%" }}
          >
            Asset Management Panel
          </Typography>
        </Toolbar>
        <Box sx={{ m: 2 }}>
          <Button variant="contained" color="error" onClick={Logout}>
            Logout
          </Button>
        </Box>
      </Box>
    </AppBar>
  );
};

export default Navbar;
