import React, { useState, useEffect, Fragment, useContext } from "react";
import { storage } from "../config/firebase";
import { useHistory } from "react-router-dom";
import MaterialTable from "material-table";
import {
  Container, Paper, Grid, TextField, Input, Button, Modal, CircularProgress, Avatar, makeStyles
} from "@material-ui/core";
import { Save, PriorityHigh, Star, ArrowForwardIos, PictureAsPdf } from "@material-ui/icons";
import { 
  getSeller, getCampaigns, updateUser, updatePass, addSellerToCampaign, removeSellerToCampaign
} from "../middleware/Middleware";
import { AuthContext } from "../contexts/AuthContext";
import BreadCrumbs from './BreadCrumbs';
import { SnackBar } from './Snack';

const Seller = (props) => {
  const history = useHistory();
  const {
    user: { user },
  } = useContext(AuthContext);
  const [sell, setSeller] = useState();
  const [sellCamps, setSellCamps] = useState([]);
  const [changePass, setChange] = useState(false);
  const [disponibleCamps, setDisponible] = useState();
  const [chats, setChats] = useState([]);
  const [file, setFile] = useState();
  const [fileLikeUrl, setFileLikeUrl] = useState();
  const [rawCamps, setRawCamps] = useState({});
  const [open, setOpen] = useState(false);
  const [snackbarType, setTypeSnack] = useState();
  const [snackbarText, setTextSnack] = useState();
  let id = history.location.id || props.id;

  if (!id || id === "undefined") {
    id = localStorage.getItem("idSelected");
    if (!id || id === "undefined") history.push("/");
  }

  const useStyles = makeStyles((theme) => ({
    vendedorInfo: {
      width: "100%",
      padding: "10px",
      marginBottom: "20px",
      "&> div": {
        display: "flex",
        "& h2": {
          height: "fit-content",
        },
        "& h5": {
          height: "fit-content",
        },
      },
    },
    personAvatar: {
      width: "130px",
      height: "130px",
      fontSize: "xxx-large",
      marginRight: "200px",
      "&> img": {
        width: "100%",
        objectFit: "cover",
      },
    },
    textInput: { width: "80%" },
    fileInput: {
      width: "80%",
      marginLeft: "10px",
      marginTop: "25px",
    },
    selectInput: {
      width: "100%",
    },
    npcIcon: {
      color: "white",
      backgroundColor: "tomato",
      float: "left",
    },
    iconNumber: {
      marginLeft: "60px",
    },
    modalButtons: {
      marginTop: "20px",
      display: "flow-root !important",
      "& button": {
        float: "right",
        marginRight: "15px",
      },
    },
    changeButton: {
      color: "tomato",
    },
    modalPassword: {
      boxShadow:
        "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)",
      backgroundColor: "#ffffff",
      width: "60%",
      height: "30%",
      marginLeft: "20%",
      marginTop: "10%",
      padding: "15px",
      "&> div": {
        backgroundColor: "transparent !important",
      },
      "& div": {
        width: "100%",
      },
      "& button": {
        marginLeft: "60%",
        marginTop: "30px",
      },
    },
    circularLoading: {
      marginLeft: "46%",
      marginTop: "20%",
      "& div": {
        color: "#16192f",
      },
    },
  }));
  const classes = useStyles();

  useEffect(() => {
    if (id) get();

    // Get Chats
    var storageRef = storage.ref(`chats/${id}`);
    // Find all the prefixes and items.
    storageRef
      .listAll()
      .then(res => {
        var chatsFiles = [];
        res.items
          .forEach(itemRef => chatsFiles.push({ name: itemRef.name, path: itemRef.location.path }));
        setChats(chatsFiles);
      });
  }, [id]);

  const handleChange = (name, event) => setSeller({ ...sell, [name]: event.target.value });

  const getCamps = (allCamps, sellCamps) => {
    let aux = [], disp = [];
    if (sellCamps.length > 0) {
      sellCamps.map((sc) => {
        let campAux = [];
        allCamps.filter((c) => {
          if (c.id === sc.id) campAux.push({ ...c, nps: sc.nps });
        });
        if (campAux.length > 0) {
          campAux[0]["nps"] = sc.hasOwnProperty("nps") ? sc.nps : 0;
          aux.push(campAux[0]);
        }
      });
      allCamps.map((sc) => {
        let finded = false;
        aux.filter((c) => {
          if (sc.id === c.id) finded = true;
        });
        if (!finded) disp.push(sc);
      });
    } else disp = allCamps;
    if (aux && aux !== undefined && aux.length > 0 && aux[0] !== undefined)
      setSellCamps(aux);
    else setSellCamps([]);
    if (disp && disp !== undefined && disp.length > 0 && disp[0] !== undefined)
      setDisponible(disp);
    else setDisponible([]);

    let aux2 = {};
    for (const key in disp)
      aux2[disp[key].id] = disp[key].name;
    setRawCamps(aux2);
  };

  const get = async () => {
    const sel = await getSeller(id);
    const allCamps = await getCampaigns(user.idcompany);

    setSeller(sel);
    
    if (
      sel &&
      allCamps &&
      allCamps.length > 0 &&
      sel.hasOwnProperty("campaigns")
    )
      getCamps(allCamps, sel.campaigns);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;

    setOpen(false);
    setTextSnack();
    setTypeSnack();
  };

  const openModal = (text, type) => {
    setOpen(true);
    setTextSnack(text);
    setTypeSnack(type);
  }

  const uploadImage = (e) => {
    const file = e.target.files[0];
    if (file.type.indexOf("image") < 0) setFile();
    else {
      const reader = new FileReader();
      setFile(file);
      reader.readAsDataURL(file);
      reader.onloadend = function (e) {
        setFileLikeUrl(reader.result);
      };
    }
  };

  const downloadPdf = async (pdf) => {
    let storageRef = await storage.ref(escape(pdf.path));
    const downloadUrl = await storageRef.getDownloadURL();

    let a = document.createElement("a");
    a.href = downloadUrl;
    a.target = "_blank";
    a.download = "chat.pdf";
    a.click();
  };

  const saveChanges = () => {
    let userData = {
      mail: sell.mail.toLowerCase(),
      phoneNumber: sell.phone || null,
      displayName: sell.name,
      uid: sell.uid,
      name: sell.name,
      nps: sell.nps || 0,
      admin: sell.admin || false,
      role: sell.role || "seller",
    };
    if (file && file !== undefined)
      storage
        .ref("sellers/profile/" + sell.uid + "/photo-profile")
        .put(file)
        .then(snapshot => {
          storage
            .ref(snapshot.ref.fullPath)
            .getDownloadURL()
            .then(resource => {
              userData.photoURL = resource || sell.avatar || null;
              updateUser(userData);
              openModal('Changes saved', 'success');
            });
        });
    else {
      userData.photoURL = sell.avatar || null;
      updateUser(userData);
      openModal('Changes saved', 'success');
    }
  };

  const openModalPassword = () => {
    setChange(!changePass);
  };

  const changePassword = () => {
    let newPass = document.getElementById("password-input").value;

    if (newPass && newPass !== undefined && newPass !== "") {
      updatePass({
        password: newPass,
        uid: sell.uid,
      }).then((res) => {
        openModalPassword();
        openModal('New password saved', 'success');
      }).catch((err) => {
        openModal('Cannot update password', 'error');
      });
    }
  };

  const goToCampaign = (camp) => {
    history.push({
      pathname: "/",
      id: camp.id,
      to2: "campaign",
    });
  };

  if (!sell)
    return (
      <div className={classes.circularLoading}>
        <CircularProgress size={60} />
      </div>
    );
  return (
    <Container>
      <Grid item xs={12}>
        <BreadCrumbs route={ ['Home', 'Customer Care Professional', sell.name] }/>
      </Grid>
      <Paper className={classes.vendedorInfo}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            {!sell.avatar && !file && (
              <Avatar className={classes.personAvatar}>
                {sell.name
                  .match(/\b(\w)/g)
                  .join("")
                  .toUpperCase()}
              </Avatar>
            )}
            {(fileLikeUrl || sell.avatar) && (
              <Avatar className={classes.personAvatar}>
                <img
                  src={fileLikeUrl ? fileLikeUrl : sell.avatar}
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
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              id="first-name-input"
              label="Name"
              name="name"
              margin="normal"
              className={classes.textInput}
              value={sell.name}
              onChange={e => handleChange("name", e)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              id="filled-mail-input"
              label="Email"
              type="email"
              name="mail"
              autoComplete="email"
              margin="normal"
              className={classes.textInput}
              value={sell.mail}
              onChange={e => handleChange("mail", e)}
            />
            <div>
              <p>NPS</p>
              <Avatar className={classes.npcIcon}>
                <Star />
              </Avatar>
              <h2 className={classes.iconNumber}>{sell.nps}</h2>
            </div>
          </Grid>
        </Grid>

        {!changePass && (
          <div className={classes.modalButtons}>
            <Button
              variant="outlined"
              color="primary"
              endIcon={<Save />}
              onClick={saveChanges}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              className={classes.changeButton}
              endIcon={<PriorityHigh />}
              onClick={openModalPassword}
            >
              Change Password
            </Button>
          </div>
        )}
      </Paper>
      <Modal
        aria-labelledby="Change Password"
        aria-describedby="change"
        open={changePass}
        onClose={openModalPassword}
        className={classes.modalPassword}
      >
        <Fragment>
          <TextField
            id="password-input"
            label="New Password"
            type="password"
            margin="normal"
          />
          <Button
            variant="outlined"
            className={classes.changeButton}
            endIcon={<PriorityHigh />}
            onClick={changePassword}
          >
            Change
          </Button>
        </Fragment>
      </Modal>

      <MaterialTable
        title="Campaigns"
        columns={[
          {
            title: "Name",
            field: "name",
            editable: "always",
            headerStyle: {
              width: "30%",
              textAlign: "center",
            },
            cellStyle: {
              width: "80%",
            },
            lookup: rawCamps,
            render: (rawData) => <div>{rawData.name}</div>,
          },

          /* Se comenta por lo requerido en el siguiente ticket -> 
          https://trello.com/c/eSYiKR10/99-detalles-generales-de-integracion
          
          No se elimina por desconocer las implicancias a la labor del dev que lo implementó
          {
            title: "Avatar",
            field: "avatar",
            editable: "never",
            render: (rowData) =>
              rowData ? (
                <img
                  src={rowData.avatar ? rowData.avatar : "./imgs/wow.png"}
                  alt="avatar"
                  style={{ width: 50, borderRadius: "50%" }}
                />
              ) : (
                <div></div>
              ),
            editComponent: (rowData) => <div></div>,
            headerStyle: {
              width: "25%",
            },
          },
          {
            title: "Type Login",
            field: "typeLogin",
            editable: "never",
            headerStyle: {
              width: "30%",
              textAlign: "center",
            },
            render: (rowData) => {
              if (rowData)
                if (rowData.typeLogin === 1) return <div>mail and Pass</div>;
                else if (rowData.typeLogin === 2) return <div>Just Name</div>;
                else return <div>Just mail</div>;
              else return <div>""</div>;
            },
          },*/

          {
            title: "NPS",
            field: "nps",
            editable: "never",
            headerStyle: {
              width: "30%",
            },
          },
        ]}
        data={sellCamps}
        editable={{
          onRowAdd:
            disponibleCamps && disponibleCamps.length > 0
              ? (newData) =>
                  new Promise((resolve, reject) => {
                    addSellerToCampaign(newData.name, sell.uid).then((resp) => {
                      openModal('Seller assigned', 'success');
                      resolve();
                    }).catch((error) => {
                      openModal('Cannot assign seller', 'error');
                      reject();
                    });
                  })
              : null,
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              removeSellerToCampaign(oldData, id).then((resp) => {
                openModal('Changes saved', 'success');
                get();
                resolve();
              }).catch((error) => {
                openModal('Cannot delete seller', 'error');
                reject();
              });
            }),
        }}
        actions={[
          {
            icon: ArrowForwardIos,
            tooltip: "Edit Campaign",
            onClick: (event, rowData) => goToCampaign(rowData),
          },
        ]}
        options={{
          pageSize: 10,
          pageSizeOptions: [5, 10, 20],
        }}
      />

      <MaterialTable
        title="Chats"
        style={{ marginTop: "40px" }}
        columns={[
          {
            title: "Files",
            field: "name",
            editable: "never",
            cellStyle: {
              width: "80%",
            },
          },
        ]}
        data={chats}
        actions={[
          {
            icon: PictureAsPdf,
            tooltip: "Download PDF",
            onClick: (event, rowData) => downloadPdf(rowData),
          },
        ]}
      />

      <SnackBar open={ open } 
        snackbarType={ snackbarType } snackbarText={ snackbarText }
        handleClose={ handleClose }/>
    </Container>
  );
};

export default Seller;