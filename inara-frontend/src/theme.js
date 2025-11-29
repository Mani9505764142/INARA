import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#7A1F1F" },
    secondary: { main: "#C79B34" },
    background: { default: "#FFF7E8", paper: "#FDF9F3" },
    text: { primary: "#121212", secondary: "#6B6B6B" },
  },
  typography: {
    fontFamily: ['"Inter"', '"Poppins"', "sans-serif"].join(","),
    h1: { fontFamily: '"Playfair Display", serif' },
    h2: { fontFamily: '"Playfair Display", serif' },
  },
});

export default theme;
