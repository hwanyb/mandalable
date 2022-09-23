import React, { useState } from "react";
import styled from "styled-components";
import { authService, firebaseInstance } from "../firebase";

const AuthWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px;
  text-align: center;
  justify-content: center;
  margin: 50px 30px;
  background-color: ${(props) => props.theme.color.backgroundSecond};
  box-shadow: 0 0 10px ${(props) => props.theme.color.shadow};
  border-radius: ${(props) => props.theme.borderRadius};
`;
const AuthTitle = styled.h2`
  font-size: ${(props) => props.theme.fontSize.base};
  color: ${(props) => props.theme.color.primary};
  font-weight: 300;
  margin-bottom: 20px;
`;
const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const Input = styled.input`
  display: block;
  margin-bottom: 20px;
`;
const ErrorText = styled.p``;
const Button = styled.button`
  margin-bottom: 10px;
`;

const AuthText = styled.p`
  color: ${(props) => props.theme.color.fontPrimary};
  font-size: ${(props) => props.theme.fontSize.sm};
  font-size: 300;
  margin-top: 20px;
  margin-bottom: 10px;
`;
export default function AuthContainer() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [signupMode, setSignupMode] = useState(true);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "nickname") {
      setNickname(value);
    }
  };
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (signupMode) {
      await authService
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          authService.currentUser.updateProfile({
            displayName: nickname,
          });
          alert("회원가입 완료");
        })
        .catch((error) => setError(error.message));
    } else {
      await authService
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          alert("로그인 완료");
        })
        .catch((error) => setError(error.message));
    }
  };
  const onGoogleSignupClick = async (event: React.MouseEvent) => {
    event.preventDefault();
    const provider = new firebaseInstance.auth.GoogleAuthProvider();
    if (signupMode) {
      await authService
        .signInWithPopup(provider)
        .then(() => {
          alert("회원가입 완료");
        })
        .catch((error) => setError(error.message));
    } else {
      await authService
        .signInWithPopup(provider)
        .then(() => {
          alert("로그인 완료");
        })
        .catch((error) => setError(error.message));
    }
  };
  const onLoginClick = (event: React.MouseEvent) => {
    event.preventDefault();
    setSignupMode(!signupMode);
  };
  return (
    <AuthWrapper>
      <AuthTitle>{signupMode ? "가입하기" : "로그인"}</AuthTitle>
      <AuthForm onSubmit={onSubmit}>
        {signupMode && (
          <Input
            name="nickname"
            type="text"
            placeholder="닉네임"
            required
            value={nickname}
            onChange={onChange}
          />
        )}
        <Input
          name="email"
          type="text"
          placeholder="이메일"
          required
          value={email}
          onChange={onChange}
        />
        <Input
          name="password"
          type="password"
          placeholder="비밀번호"
          required
          value={password}
          onChange={onChange}
        />
        <ErrorText>{error}</ErrorText>
        <Button type="submit">{signupMode ? "가입하기" : "로그인"}</Button>
        <Button onClick={onGoogleSignupClick}>
          {signupMode ? "Google 계정으로 가입하기" : "Google 계정으로 로그인"}
        </Button>
        <AuthText>
          {signupMode
            ? "이미 Mandalable에 가입하셨나요?"
            : "Mandalable 계정이 없으신가요?"}
        </AuthText>
        <Button onClick={onLoginClick}>
          {signupMode ? "로그인" : "가입하기"}
        </Button>
      </AuthForm>
    </AuthWrapper>
  );
}
