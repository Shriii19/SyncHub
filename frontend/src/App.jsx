
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

// TODO: Extract theme to a separate file for maintainability
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#22d3ee",
    },
    background: {
      default: "#0f172a",
      paper: "#1e293b",
    },
    text: {
      primary: "#f8fafc",
      secondary: "#94a3b8",
    },
  },
  typography: {
    fontFamily: 'Plus Jakarta Sans, sans-serif',
  },
  shape: {
    borderRadius: 18,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Cool animated background blob */}
      <div style={{
        position: 'fixed',
        top: '-120px',
        left: '-120px',
        width: '340px',
        height: '340px',
        zIndex: 0,
        pointerEvents: 'none',
        filter: 'blur(8px) opacity(0.7)',
      }}>
        <div className="animate-blob" style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 60% 40%, #22d3ee 0%, #6366f1 100%)',
        }} />
      </div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
