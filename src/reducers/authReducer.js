export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { user: action.user, error: null };
    case "LOGIN_ERROR":
      return { user: null, error: action.error };
    case "SIGNUP_SUCCESS":
      return { user: action.user, error: null };
    case "SIGNUP_ERROR":
      return { user: null, error: action.error };
    case "SIGNOUT_SUCCESS":
      return { user: null, error: null };
    default:
      return state;
  }
};
