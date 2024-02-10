import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import AuthLayout from "./components/layout/AuthLayout";
import AppLayout from "./components/layout/AppLayout";
import TimeLine from "./components/home/TimeLine";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { blue } from "@mui/material/colors";
import Information from "./pages/Information";
import MSettings from "./pages/MSettings";
import PSettings from "./pages/PSettings";

function App() {
  const theme = createTheme({
    palette: { primary: blue },
  });
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="profile/:username" element={<Profile />} />
              <Route path="timeline/:username" element={<TimeLine />} />
              <Route path="information/:username" element={<Information />} />
              <Route path="msettings/:username" element={<MSettings />} />
              <Route path="psettings/:username" element={<PSettings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
