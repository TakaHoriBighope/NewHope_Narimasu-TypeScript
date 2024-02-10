import { Box } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import DispFollower from "./DispFollower";
import { useSelector } from "react-redux";

const DisplayAllUsers = () => {
  const [users, setUsers] = useState([]);

  const lang = useSelector((state) => state.lang.value);
  console.log(lang);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get("/users/all");
        setUsers(res.data);
      } catch (error) {
        alert(`getUsers${error}`);
      }
    };
    getUsers();
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          maxHeight: 560,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginLeft: "20px",
          }}
        >
          {users.map((user) => (
            <DispFollower user={user} key={user._id} />
          ))}
        </Box>
      </Box>
    </>
  );
};

export default DisplayAllUsers;
