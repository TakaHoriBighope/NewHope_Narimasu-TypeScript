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

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUsernameErrText("");
    setEmailErrText("");
    setPasswordErrText("");
    setConfirmErrText("");

    //入力文字列を取得
    const data = new FormData(e.target);
    const username = data.get("username").trim();
    const email = data.get("email").trim();
    const password = data.get("password").trim();
    const confirmPassword = data.get("confirmPassword").trim();

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
    try {
      const res = await authApi.register({
        username,
        email,
        password,
        confirmPassword,
      });
      setLoading(false);
      localStorage.setItem("token", res.token);
      console.log("新規登録に成功しました");
      dispatch(setUser(res.user));
      dispatch(setLanguage(lang));
      navigate("/login");
    } catch (err) {
      console.log(err);
      const errors = err.data.errors;
      errors.forEach((err) => {
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
    }
  };

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
          {t("新規登録")}
        </Typography>
        <Button
          onClick={() => setLang(lang === "en" ? "ja" : "en")}
          // sx={{ margin: 1 }}
        >
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
