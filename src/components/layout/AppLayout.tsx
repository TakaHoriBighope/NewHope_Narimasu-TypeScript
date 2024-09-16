import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { mediaQuery, useMediaQuery } from "../../utiles/useMediaQuery";

const AppLayout = () => {
  const isSp = useMediaQuery(mediaQuery.sp);
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log(uid);
        // ...
      } else {
        // User is signed out
        navigate("/login");
        // ...
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (isSp) {
    <div>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ flexGrow: 1, p: 1, width: "max-content" }}>
          <Outlet />
        </Box>
      </Box>
    </div>;
  }
  return (
    <div>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ flexGrow: 1, p: 1, width: "max-content" }}>
          <Outlet />
        </Box>
      </Box>
    </div>
  );
};

export default AppLayout;
