import AuthLayout from "./components/layout/AuthLayout";
import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Home";
import Share from "./pages/Share";
import Talk from "./pages/Talk";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Information from "./pages/Information";
import MSettings from "./pages/MSettings";
import PSettings from "./pages/PSettings";
import NotMatch from "./pages/NotMatch";
import ShareTimeLine from "./components/share/ShareTimeLine";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { blue } from "@mui/material/colors";
import { useEffect } from "react";
import { auth, db } from "./firebase";
import { login, logout } from "./redux/features/userSlice";
import { useAppDispatch } from "./redux/hooks";
import { doc, getDoc } from "firebase/firestore";
import { setDisplayName } from "./redux/features/displayNameSlice";
import Rightbar from "./components/home/Rightbar";

export const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    auth.onAuthStateChanged((loginUser) => {
      console.log(loginUser);
      if (loginUser) {
        const fetchCurrentUser = async () => {
          const docRef = doc(db, "users", loginUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            // console.log(docSnap.data().username);
            dispatch(setDisplayName(docSnap.data().username));
            dispatch(
              login({
                uid: loginUser.uid,
                email: loginUser.email,
                profilePicture: docSnap.data().profilePicture,
                displayName: docSnap.data().username,
              })
            );
          } else {
            console.log("No such document!");
          }
        };
        fetchCurrentUser();
      } else {
        dispatch(logout());
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

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
              <Route path="share" element={<Share />} />
              <Route path="timeline" element={<ShareTimeLine />} />
              <Route path="information" element={<Information mode="main" />} />
              <Route path="msettings" element={<MSettings />} />
              <Route path="psettings" element={<PSettings />} />
              <Route path="talk" element={<Talk />} />
              <Route path="*" element={<NotMatch />} />
              <Route path="rightbar" element={<Rightbar />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
};

// export default App;
