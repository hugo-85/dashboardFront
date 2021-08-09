import React, { createContext, useReducer, useEffect, useState } from "react";
import { authReducer } from "../reducers/authReducer";
import { getUser, getCampaign } from "../middleware/Middleware";

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState();

  const getCurrentUser = async (uid) => {
    setLoading(true);
    const data = await getUser(uid);
    setLoading(false);
    if (data.uid) {
      dispatch({ type: "LOGIN_SUCCESS", user: data });
      return { user: data, error: null };
    } else return { user: null, error: { message: data } };
  };

  const [user, dispatch] = useReducer(
    authReducer,
    { user: null, error: null },
    () => {
      const uid = localStorage.getItem("user");
      return uid ? getCurrentUser(uid) : { user: null, error: null };
    }
  );

  useEffect(
    (id) => {
      const getUserCampaing = async (id) => {
        const camp = await getCampaign(id);
        setCampaign(camp);
      };

      if (user && user.user !== null && user.hasOwnProperty("user") && !user.user.admin)
        getUserCampaing(user.campaigns[0]);
    },
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, campaign, loading, dispatch }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
