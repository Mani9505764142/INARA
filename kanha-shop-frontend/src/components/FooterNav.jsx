// src/components/FooterNav.jsx
import React from "react";
import Paper from "@mui/material/Paper";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import BottomNavigation from "@mui/material/BottomNavigation";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

export default function FooterNav() {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();

  return (
    <Paper
      elevation={6}
      square
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: "primary.main",
        px: 2,
        zIndex: 1400,
      }}
    >
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          sx={{
            bgcolor: "transparent",
            ".MuiBottomNavigationAction-label": { color: "background.paper" },
            ".MuiSvgIcon-root": { color: "background.paper" },
          }}
        >
          <BottomNavigationAction
            onClick={(e) => {
              e.preventDefault();
              setValue(0);
              navigate("/");
            }}
            label="Home"
            icon={<HomeIcon />}
          />

          <BottomNavigationAction
            onClick={(e) => {
              e.preventDefault();
              setValue(1);
              navigate("/about");
            }}
            label="About"
            icon={<InfoIcon />}
          />

          <BottomNavigationAction
            onClick={(e) => {
              e.preventDefault();
              setValue(2);
              navigate("/contact");
            }}
            label="Contact"
            icon={<ContactMailIcon />}
          />
        </BottomNavigation>
      </Box>
    </Paper>
  );
}
