import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { login } from "../redux/features/userSlice";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useAppDispatch } from "../redux/hooks";
import type { FormEvent } from "react";
import { mediaQuery, useMediaQuery } from "../utiles/useMediaQuery";
import { setLanguage } from "../redux/features/langSlice";

const Login = () => {
  const isSp = useMediaQuery(mediaQuery.sp);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [emailErrText, setEmailErrText] = useState("");
  const [passwordErrText, setPasswordErrText] = useState("");
  const [loading, setLoading] = useState(false);

  const [t, i18n] = useTranslation();
  const [lang, setLang] = useState("ja");

  useEffect(() => {
    i18n.changeLanguage(lang);
    dispatch(setLanguage(lang));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, i18n]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailErrText("");
    setPasswordErrText("");

    //入力文字列を取得
    const data = new FormData(e.target as HTMLFormElement);
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    //FormDataEntryValue型をstring型に変える。
    let error = false;
    setLoading(true);
    if (email === "") {
      error = true;
      if (lang === "ja") {
        setEmailErrText("メールアドレスを入力してください");
      } else {
        setEmailErrText("Input your name!");
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
    if (error) return;
    //ログイン用APIを叩く
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user.uid);
        dispatch(login(user));
        // dispatch(setLanguage(lang));
        setLoading(false);
        navigate("/");
      })
      .catch((err) => {
        const errors = err.data.errors;
        console.log(errors);
        errors.forEach((err: any) => {
          if (err.param === "email" || err.path === "email") {
            setEmailErrText(err.msg);
          }
          if (err.param === "password" || err.path === "password") {
            setPasswordErrText(err.msg);
          }
        });
        setLoading(false);
      });
  };
  if (isSp) {
    return (
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
          boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: "550",
            color: "gray",
          }}
        >
          {t("ログイン")}
        </Typography>
        <Button onClick={() => setLang(lang === "en" ? "ja" : "en")}>
          {t("言語を切り替え")}
        </Button>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            inputProps={{ inputMode: "email" }}
            id="username"
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
          <LoadingButton
            sx={{ mt: 1, mb: 1 }}
            fullWidth
            type="submit"
            loading={loading}
            color="primary"
            variant="outlined"
          >
            <p style={{ fontWeight: "700", margin: "5px" }}>{t("ログイン")}</p>
          </LoadingButton>
        </Box>
        <Button
          component={Link}
          to="/register"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <p>{t("アカウントを持っていませんか？　")}</p>
          <p style={{ fontWeight: "700" }}>{t("新規登録")}</p>
        </Button>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        flex: 1,
        width: "130%",
        display: "flex",
        height: "360px",
        padding: "30px",
        marginTop: "50px",
        alignItems: "center",
        borderRadius: "10px",
        flexDirection: "column",
        backgroundColor: "white",
        boxShadow: "0px 3px 10px 0px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: "550",
          color: "gray",
        }}
      >
        {/* ログイン */}
        {t("ログイン")}
      </Typography>
      <Button onClick={() => setLang(lang === "en" ? "ja" : "en")}>
        {t("言語を切り替え")}
      </Button>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          id="username"
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
        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          fullWidth
          type="submit"
          loading={loading}
          color="primary"
          variant="outlined"
        >
          <p style={{ fontWeight: "700", margin: "5px" }}>{t("ログイン")}</p>
        </LoadingButton>
      </Box>
      <Button component={Link} to="/register">
        {t("アカウントを持っていませんか？　")}
        <p style={{ fontWeight: "700" }}>{t("新規登録")}</p>
      </Button>
    </Box>
  );
};

export default Login;
