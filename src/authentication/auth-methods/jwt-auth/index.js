import { useEffect, useState } from "react";
import { httpClient } from "../../../util/Api";
import { usuariosService } from "../../../services";

export const useProvideAuth = () => {
  const [authUser, setAuthUser] = useState(null);
  const [error, setError] = useState("");
  const [isLoadingUser, setLoadingUser] = useState(true);
  const [isLoading, setLoading] = useState(false);

  const fetchStart = () => {
    setLoading(true);
    setError("");
  };

  const fetchSuccess = () => {
    setLoading(false);
    setError("");
  };

  const fetchError = (error) => {
    setLoading(false);
    setError(error);
  };

  const userLogin = (user, callbackFun) => {
    fetchStart();
    usuariosService
      .login(user)
      .then(({ data }) => {
        if (
          data.statusCode === 200
          //  && login.body.role
        ) {
          fetchSuccess();
          // httpClient.defaults.headers.common["Authorization"] =
          //   "Bearer " + data.access_token;
          localStorage.setItem(
            "token",
            JSON.stringify({
              ...data.body,
              // token: data.access_token,
              modulos: [
                "inicio",
                "clientes",
                // "hosting",
                "pagos",
                // "soporte",
                "usuarios",
                // "proyectos",
              ],
            })
          );
          getAuthUser();
          if (callbackFun) callbackFun();
        } else {
          fetchError("No tiene permisos para acceder a esta aplicación");
        }
      })
      .catch(function (error) {
        fetchError(error.response?.data?.message || error.message);
      });
  };

  const userSignup = (user, callbackFun) => {
    fetchStart();
    httpClient
      .post("auth/register", user)
      .then(({ data }) => {
        if (data.result) {
          fetchSuccess();
          localStorage.setItem("token", data.token.access_token);
          httpClient.defaults.headers.common["Authorization"] =
            "Bearer " + data.token.access_token;
          getAuthUser();
          if (callbackFun) callbackFun();
        } else {
          fetchError(data.error);
        }
      })
      .catch(function (error) {
        fetchError(error.message);
      });
  };

  const sendPasswordResetEmail = (email, callbackFun) => {
    fetchStart();

    setTimeout(() => {
      fetchSuccess();
      if (callbackFun) callbackFun();
    }, 300);
  };

  const confirmPasswordReset = (code, password, callbackFun) => {
    fetchStart();

    setTimeout(() => {
      fetchSuccess();
      if (callbackFun) callbackFun();
    }, 300);
  };

  const renderSocialMediaLogin = () => null;

  const userSignOut = (callbackFun) => {
    fetchStart();
    fetchSuccess();
    localStorage.removeItem("token");
    setAuthUser(false);
  };

  const getAuthUser = () => {
    const token = localStorage.getItem("token");
    fetchStart();
    fetchSuccess();
    setAuthUser(JSON.parse(token));
  };

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.

  useEffect(() => {
    const token = localStorage.getItem("token");
    // if (token) {
    //   httpClient.defaults.headers.common["Authorization"] = "Bearer " + token;
    // }
    setAuthUser(JSON.parse(token));
    setLoadingUser(false);
    // httpClient
    //   .post("auth/me")
    //   .then(({ data }) => {
    //     if (data.user) {
    //       setAuthUser(data.user);
    //     }
    //     setLoadingUser(false);
    //   })
    //   .catch(function () {
    //     localStorage.removeItem("token");
    //     httpClient.defaults.headers.common["Authorization"] = "";
    //     setLoadingUser(false);
    //   });
  }, []);

  // Return the user object and auth methods
  return {
    isLoadingUser,
    isLoading,
    authUser,
    error,
    setError,
    setAuthUser,
    getAuthUser,
    userLogin,
    userSignup,
    userSignOut,
    renderSocialMediaLogin,
    sendPasswordResetEmail,
    confirmPasswordReset,
  };
};
