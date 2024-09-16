import React, { FormEvent, useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { setLanguage } from "../redux/features/langSlice";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { serverTimestamp, doc, setDoc } from "firebase/firestore";
import { setDisplayName } from "../redux/features/displayNameSlice";
import { useAppDispatch } from "../redux/hooks";
import { login } from "../redux/features/userSlice";
import { mediaQuery, useMediaQuery } from "../utiles/useMediaQuery";

const Register = () => {
  const isSp = useMediaQuery(mediaQuery.sp);
  console.log(isSp);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [usernameErrText, setUsernameErrText] = useState("");
  const [emailErrText, setEmailErrText] = useState("");
  const [passwordErrText, setPasswordErrText] = useState("");
  const [confirmErrText, setConfirmErrText] = useState("");
  const [loading, setLoading] = useState(false);

  const [t, i18n] = useTranslation();
  const [lang, setLang] = useState("ja");

  useEffect(() => {
    i18n.changeLanguage(lang);
    dispatch(setLanguage(lang));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, lang, i18n]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUsernameErrText("");
    setEmailErrText("");
    setPasswordErrText("");
    setConfirmErrText("");

    //入力文字列を取得
    const data = new FormData(e.target as HTMLFormElement);
    const username = data.get("username") as string;
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    const confirmPassword = data.get("confirmPassword") as string;

    let error = false;
    setLoading(true);
    if (username === "") {
      error = true;
      if (lang === "ja") {
        setUsernameErrText("名前を入力してください");
      } else {
        setUsernameErrText("Input your name!");
      }
    }

    if (email === "") {
      error = true;
      if (lang === "ja") {
        setEmailErrText("Eメールアドレスを入力してください");
      } else {
        setEmailErrText("Input your e-mail address!");
      }
    }
    if (password === "") {
      error = true;
      if (lang === "ja") {
        setPasswordErrText("パスワードを入力してください");
      } else {
        setPasswordErrText("Input your password !");
      }
    }
    if (confirmPassword === "") {
      error = true;
      if (lang === "ja") {
        setConfirmErrText("確認用パスワードを入力してください");
      } else {
        setConfirmErrText("Input your same password !");
      }
    }
    if (password !== confirmPassword) {
      error = true;
      if (lang === "ja") {
        setConfirmErrText("パスワードと確認用パスワードが異なります");
      } else {
        setConfirmErrText("Passwords different !");
      }
    }
    if (error) return;
    //新規登録APIを叩く
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setLoading(false);
        if (user) {
          dispatch(
            login({
              uid: user.uid,
              email: email,
            })
          );
        }
        // setUser(user);
        console.log(`新規登録に成功:${user.uid}`);
        // dispatch(setLanguage(lang));
      })
      .catch((err) => {
        const errors = err.data.errors;
        errors.forEach((err: any) => {
          if (err.path === "username") {
            setUsernameErrText(err.msg);
          }
          if (err.path === "email") {
            setEmailErrText(err.msg);
          }
          if (err.path === "password") {
            setPasswordErrText(err.msg);
          }
          if (err.path === "confirmPassword") {
            setConfirmErrText(err.msg);
          }
        });
        setLoading(false);
      });
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        await setDoc(doc(db, "users", uid), {
          coverPicture: "",
          followers: [],
          followings: [],
          profilePicture: "",
          createdAt: serverTimestamp(),
          updatedAt: "",
          uid: user.uid,
          username: username,
        });
        dispatch(setDisplayName(username));
        console.log(`Register:${username}`);
      } else {
        console.log("user is logged out");
      }
    });
  };

  if (isSp) {
    return (
      <>
        <Box
          sx={{
            flex: 1,
            width: "100%",
            display: "flex",
            height: "280px",
            padding: "15px",
            marginTop: "15px",
            alignItems: "center",
            borderRadius: "5px",
            flexDirection: "column",
            backgroundColor: "white",
            // boxShadow: "6px 7px 13px -10px #404755",
            boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography
            sx={{ fontSize: "15px", fontWeight: "550", color: "gray" }}
          >
            {t("新規登録")}
          </Typography>
          <Button onClick={() => setLang(lang === "en" ? "ja" : "en")}>
            {t("言語を切り替え")}
          </Button>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              // type="text"
              inputProps={{ inputMode: "text" }}
              id="username"
              label={t("ユーザー名")}
              margin="normal"
              name="username"
              required
              helperText={usernameErrText}
              error={usernameErrText !== ""}
              disabled={loading}
            />
            <TextField
              fullWidth
              id="email"
              inputProps={{ inputMode: "email" }}
              label={t("メールアドレス")}
              margin="normal"
              name="email"
              required
              helperText={emailErrText}
              error={emailErrText !== ""}
              disabled={loading}
            />

            <TextField
              fullWidth
              inputProps={{ inputMode: "text" }}
              id="password"
              label={t("パスワード")}
              margin="normal"
              name="password"
              type="password"
              required
              helperText={passwordErrText}
              error={passwordErrText !== ""}
              disabled={loading}
            />
            <TextField
              fullWidth
              inputProps={{ inputMode: "text" }}
              id="confirmPassword"
              label={t("確認用パスワード")}
              margin="normal"
              name="confirmPassword"
              type="password"
              required
              helperText={confirmErrText}
              error={confirmErrText !== ""}
              disabled={loading}
            />

            <LoadingButton
              sx={{ mt: 1, mb: 1 }}
              fullWidth
              type="submit"
              loading={loading}
              color="primary"
              variant="outlined"
            >
              <p style={{ fontWeight: "700", margin: "5px" }}>
                {t("アカウント作成")}
              </p>
            </LoadingButton>
          </Box>
          <Button
            component={Link}
            to="/login"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <p>{t("すでにアカウントを持っていますか？　")}</p>
            <p style={{ fontWeight: "700" }}>{t("ログイン")}</p>
          </Button>
        </Box>
      </>
    );
  }
  return (
    <>
      <Box
        sx={{
          flex: 1,
          width: "130%",
          display: "flex",
          height: "520px",
          padding: "30px",
          marginTop: "50px",
          alignItems: "center",
          borderRadius: "10px",
          flexDirection: "column",
          backgroundColor: "white",
          // boxShadow: "6px 7px 13px -10px #404755",
          boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography sx={{ fontSize: "18px", fontWeight: "550", color: "gray" }}>
          {/* 新規登録 */}
          {t("新規登録")}
        </Typography>
        <Button onClick={() => setLang(lang === "en" ? "ja" : "en")}>
          {t("言語を切り替え")}
        </Button>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            type="text"
            id="username"
            label={t("ユーザー名")}
            margin="normal"
            name="username"
            required
            helperText={usernameErrText}
            error={usernameErrText !== ""}
            disabled={loading}
          />
          <TextField
            fullWidth
            id="email"
            label={t("メールアドレス")}
            margin="normal"
            name="email"
            required
            helperText={emailErrText}
            error={emailErrText !== ""}
            disabled={loading}
          />

          <TextField
            fullWidth
            id="password"
            label={t("パスワード")}
            margin="normal"
            name="password"
            type="password"
            required
            helperText={passwordErrText}
            error={passwordErrText !== ""}
            disabled={loading}
          />
          <TextField
            fullWidth
            id="confirmPassword"
            label={t("確認用パスワード")}
            margin="normal"
            name="confirmPassword"
            type="password"
            required
            helperText={confirmErrText}
            error={confirmErrText !== ""}
            disabled={loading}
          />

          <LoadingButton
            sx={{ mt: 3, mb: 2 }}
            fullWidth
            type="submit"
            loading={loading}
            color="primary"
            variant="outlined"
          >
            <p style={{ fontWeight: "700", margin: "5px" }}>
              {/* アカウント作成 */}
              {t("アカウント作成")}
            </p>
          </LoadingButton>
        </Box>
        <Button component={Link} to="/login">
          {t("すでにアカウントを持っていますか？　")}
          <p style={{ fontWeight: "700" }}>{t("ログイン")}</p>
        </Button>
      </Box>
    </>
  );
};
export default Register;
