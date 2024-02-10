import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../api/authApi";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { initReactI18next } from "react-i18next";
import jaJson from "../components/locales/ja.json";
import enJson from "../components/locales/en.json";
import { useDispatch } from "react-redux";
import { setLanguage } from "../redux/features/langSlice";
import { setUser } from "../redux/features/userSlice";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enJson },
    ja: { translation: jaJson },
  },
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [usernameErrText, setUsernameErrText] = useState("");
  const [passwordErrText, setPasswordErrText] = useState("");
  const [loading, setLoading] = useState(false);

  const [t, i18n] = useTranslation();
  const [lang, setLang] = useState("ja");

  useEffect(() => {
    i18n.changeLanguage(lang);
    dispatch(setLanguage(lang));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, lang, i18n]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUsernameErrText("");
    setPasswordErrText("");

    //入力文字列を取得
    const data = new FormData(e.target);
    const username = data.get("username").trim();
    const password = data.get("password").trim();
    console.log(username);
    console.log(password);

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
    try {
      const res = await authApi.login({
        username,
        password,
      });
      setLoading(false);
      localStorage.setItem("token", res.token);
      console.log("ログインに成功しました");
      dispatch(setUser(res.user));
      dispatch(setLanguage(lang));
      navigate("/");
    } catch (err) {
      const errors = err.data.errors;
      console.log(errors);
      errors.forEach((err) => {
        if (err.param === "username" || err.path === "username") {
          setUsernameErrText(err.msg);
        }
        if (err.param === "password" || err.path === "password") {
          setPasswordErrText(err.msg);
        }
      });
      setLoading(false);
    }
  };

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
        {t("ログイン")}
      </Typography>
      <Button onClick={() => setLang(lang === "en" ? "ja" : "en")}>
        {t("言語を切り替え")}
      </Button>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
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
