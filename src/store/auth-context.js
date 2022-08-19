import React, { useCallback, useEffect, useState } from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});
const calcRemainTime = (expireTime) => {
  const currentTime = new Date().getTime();
  const adjustTime = new Date(expireTime).getTime();
  return adjustTime - currentTime;
};
let timeId = "";

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationData = localStorage.getItem("expire");

  const remainingTime = calcRemainTime(storedExpirationData);
  if (remainingTime <= 60000) {
    localStorage.removeItem("token");
    localStorage.removeItem("expire");
    return null;
  }
  return {
    token: storedToken,
    duration: remainingTime,
  };
};

export const AuthContextProvider = (props) => {
  let initialToken;
  const tokenData = retrieveStoredToken();
  if (tokenData) {
    initialToken = tokenData.token;
  }
  const [token, setToken] = useState(initialToken);
  const userIsLoggedIn = !!token;

  const loginHandler = (token, expirationTime) => {
    localStorage.setItem("token", token);
    localStorage.setItem("expire", expirationTime);
    setToken(token);
    timeId = setTimeout(logoutHandler, calcRemainTime(expirationTime));
  };

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.clear();
    if (timeId) {
      clearTimeout(timeId);
    }
  }, []);

  useEffect(() => {
    if (tokenData) {
      console.log("-> tokenData", tokenData.duration);
      timeId = setTimeout(logoutHandler, calcRemainTime(tokenData.duration));
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
