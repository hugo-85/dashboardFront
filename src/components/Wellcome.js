import React, { useState, useContext, useEffect } from "react";
import firebase from "../config/firebase";
import { 
  Container, Paper, Button, TextField, Avatar, Input, InputLabel, MenuItem, FormControl,
  Select, makeStyles, CircularProgress
} from "@material-ui/core";
import { Send, Person, ArrowBack } from "@material-ui/icons";
import { AuthContext } from "../contexts/AuthContext";
import { useSpring, animated as a } from "react-spring";
import { getUser } from "../middleware/Middleware";

const Wellcome = (props) => {
  const [file, setFile] = useState();
  const [newUser] = useState(false);
  const [forget, setForget] = useState(false);
  const [emailRecover, setEmailRecover] = useState("");
  const { user, loading, dispatch } = useContext(AuthContext);
  const [campaigns] = useState([]);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [values, setValues] = useState({
    email: "",
    pass: "",
    campaign: "",
    name: "",
    phone: "",
  });

  const useStyles = makeStyles((theme) => ({
    loginForm: {
      float: dimensions.width > 720 ? "right" : "inherit",
      boxShadow:
        "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)",
      backgroundColor: "white",
      marginLeft: "10px",
      marginTop: "10%",
      borderRadius: "0px 58px 0px 0px",
    },
    emailAndPass: {
      borderRadius: "0px 50px 0px 50px",
      backgroundColor: "#241332",
    },
    textInput: {
      width: "80%",
      marginLeft: "10%",
      "& label": {
        color: "white",
      },
      "& input": {
        color: "white",
      },
      "& .Mui-focused": {
        color: "white",
      },
    },
    textInput2: {
      width: "80%",
      marginLeft: "10%",
      "& label": {
        color: "grey",
      },
      "& .Mui-focused": {
        color: "grey",
      },
    },
    fileInput: {
      width: "80%",
      marginLeft: "10%",
      marginBottom: "15px",
      "& label": {
        color: "white",
      },
    },
    imgPreview: {
      width: "100%",
      objectFit: "cover",
    },
    modalButtons: {
      marginLeft: "20%",
      paddingBottom: "10px",
      paddingTop: "10px",
    },
    modalButton: {
      marginLeft: "5px",
    },
    errorLogin: {
      boxShadow:
        "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)",
      backgroundColor: "white",
      float: "right",
      marginTop: "20px",
      width: "48%",
      padding: "10px",
      color: "tomato",
    },
    personIcon: {
      width: "80px",
      height: "80px",
      marginLeft: "40%",
      marginBottom: "15px",
      boxShadow:
        "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)",
    },
    circularLoading: {
      marginLeft: "50%",
      marginTop: "25%",
      "& div": {
        color: "white",
      },
    },
    margin: {
      margin: theme.spacing(1),
    },
    imgLogoMobileContent: {
      textAlign: "center",
    }
  }));
  const classes = useStyles();

  const handleResize = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    document.getElementsByTagName("body")[0].style =
      "background-color: #2a3458 !important";
      
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { float, marginTop } = useSpring({
    from: {
      marginTop: "-280px",
    },
    float: "left",
    marginTop: "80px",
    config: { mass: 50, tension: 50, friction: 20 },
  });

  const handleChange = (name, event) => setValues({ ...values, [name]: event.target.value });

  const handleEmailRecover = (event) => setEmailRecover(event.target.value);

  const handleLogin = (e) => {
    e.preventDefault();
    loginWithMail(values.email.toLowerCase(), values.pass);
  };

  const uploadImage = (e) => {
    const file = e.target.files[0],
        reader = new FileReader();
    if (file.type.indexOf("image") < 0) setFile();
    else {
      reader.readAsDataURL(file);
      reader.onloadend = e => setFile(reader.result);
    }
  };

  const names = (
    <div>
      {!file && (
        <Avatar className={classes.personIcon}>
          <Person />
        </Avatar>
      )}
      {file && (
        <Avatar className={classes.personIcon}>
          <img
            src={file}
            width="100"
            alt="Upload Preview"
            className={classes.imgPreview}
          />
        </Avatar>
      )}
      <Input
        type="file"
        id="file"
        name="file"
        inputProps={{ accept: "image/*" }}
        placeholder="Upload an image."
        className={classes.fileInput}
        onChange={(e) => uploadImage(e)}
      />
      {campaigns && (
        <FormControl className={classes.textInput2}>
          <InputLabel id="idCampania">Campaign</InputLabel>
          <Select
            labelId="idCampaign"
            id="campania-select"
            value={values.campaign}
            onChange={ e => handleChange("campaign", e) }
          >
            {campaigns.map((camp) => (
              <MenuItem key={camp.id} value={camp.id}>
                {camp.productName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <TextField
        id="first-name-input"
        label="Name"
        name="Name"
        margin="normal"
        className={classes.textInput2}
        value={values.name}
        onChange={ e => handleChange("name", e) }
      />
      <TextField
        id="last-name-input"
        label="Phone"
        name="phone"
        margin="normal"
        className={classes.textInput2}
        value={values.phone}
        onChange={ e => handleChange("phone", e) }
      />
    </div>
  );

  const getUserData = async (uid) => {
    const data = await getUser(uid);
    if (data.uid) {
      if (data.role !== "client")
        dispatch({
          type: "LOGIN_ERROR",
          error: { message: "The user don't have permissions" },
        });
      else {
        localStorage.setItem("user", data.uid);
        dispatch({ type: "LOGIN_SUCCESS", user: data });
      }
    } else dispatch({ type: "LOGIN_ERROR", error: { message: data } });
  };

  const loginWithMail = (email, password) => {
    firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => getUserData(user.user.uid))
      .catch((error) => dispatch({ type: "LOGIN_ERROR", error }));
  };


  if (loading)
    return (
      <div className={classes.circularLoading}>
        <CircularProgress />
      </div>
    );
  return (
    <Container>
      {dimensions.width > 720 && (
        <a.img
          src="./imgs/WOW-logo.png"
          alt="logo"
          style={{ float, marginTop }}
        />
      )}
      {dimensions.width < 720 && (
        <div className={classes.imgLogoMobileContent}>
          <img
            className={classes.imgLogoMobile}
            src="./imgs/WOW-logo.png"
            width="100"
            alt="logo"
          />
        </div>
      )}
      <Paper elevation={3} className={classes.loginForm}>
        {!forget && (
          <form onSubmit={handleLogin}>
            <div className={classes.emailAndPass}>
              <TextField
                id="filled-email-input"
                label="Email"
                type="email"
                name="email"
                autoComplete="off"
                margin="normal"
                className={classes.textInput}
                value={values.email}
                onChange={e => handleChange("email", e)}
              />
              <TextField
                id="filled-password-input"
                label="Password"
                type="password"
                name="pass"
                margin="normal"
                className={classes.textInput}
                value={values.pass}
                onChange={e => handleChange("pass", e)}
              />
            </div>
            {newUser ? names : null}
            <div className={classes.modalButtons}>
              <Button
                className={classes.modalButton}
                variant="outlined"
                color="primary"
                endIcon={<Send />}
                type="submit"
              >
                {newUser ? "New User" : "Login"}
              </Button>
              {!newUser && (
                <Button
                  className={classes.margin}
                  size="small"
                  variant="outlined"
                  color="secondary"
                  onClick={() => setForget(!forget)}
                >
                  Forgot my password!
                </Button>
              )}
            </div>
          </form>
        )}
        {forget && (
          <form>
            <TextField
              id="recover-email-input"
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              margin="normal"
              className={classes.textInput}
              value={emailRecover}
              onChange={handleEmailRecover}
            />
            <div className={classes.modalButtons}>
              <Button
                variant="outlined"
                color="secondary"
                endIcon={<ArrowBack />}
                type="button"
                className={classes.modalButton}
                onClick={() => setForget(false)}
              >
                Back
              </Button>
              <Button
                variant="outlined"
                color="primary"
                endIcon={<Send />}
                type="button"
                className={classes.modalButton}
              >
                Send Mail!
              </Button>
            </div>
          </form>
        )}
      </Paper>
      {user && user.error && (
        <Paper className={classes.errorLogin}>
          <div>{user.error.message}</div>
        </Paper>
      )}
    </Container>
  );
};

export default Wellcome;