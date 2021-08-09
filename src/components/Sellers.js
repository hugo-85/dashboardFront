import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Container, Input, Avatar, Grid, makeStyles, Chip } from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import MaterialTable from "material-table";
import { getSellers, postUser, updateUser, updatePass, deleteUser } from "../middleware/Middleware";
import { AuthContext } from "../contexts/AuthContext";
import BreadCrumbs from './BreadCrumbs';
import { SnackBar } from './Snack';

const Sellers = (props) => {
  const [sellers, setSellers] = useState([]);
  const [open, setOpen] = useState(false);
  const [snackbarType, setTypeSnack] = useState();
  const [snackbarText, setTextSnack] = useState();
  const [file, setFile] = useState();
  const history = useHistory();
  const {
    user: { user },
  } = useContext(AuthContext);

  const useStyles = makeStyles((theme) => ({
    sellersTable: {
      marginTop: "40px",
    },
    popList: {
      width: "100%",
    },
    uploadFile: {
      borderRadius: "30%",
      cursor: "pointer",
      "&> img": {
        width: "100%",
        objectFit: "cover",
      },
    },
  }));
  const classes = useStyles();

  useEffect(() => {
    get();
  }, []);

  const get = async () => {
    const sels = await getSellers(user.idcompany);
    setSellers(sels);
  };

  const openModal = (text, type) => {
    setOpen(true);
    setTextSnack(text);
    setTypeSnack(type);
  }

  const uploadImage = (e) => {
    const file = e.target.files[0],
      reader = new FileReader();

    if (file.type.indexOf("image") < 0) setFile();
    else {
      reader.readAsDataURL(file);
      reader.onloadend = ev => setFile(reader.result);
    }
  };

  const goToVendedor = (seller) => {
    history.push({
      pathname: "/",
      id: seller.uid,
      to2: "seller",
    });
  };

  const handleClose = (event, reason) => {
      if (reason === "clickaway") return;

      setOpen(false);
      setTextSnack();
      setTypeSnack();
  };

  return (
    <Container className={classes.sellersTable}>
      <Grid item xs={12}>
        <BreadCrumbs route={ ['Home', 'Customer Care Professional'] }/>
      </Grid>
      <MaterialTable
        title="Customer Care Professional"
        columns={[
          {
            title: "Avatar",
            field: "avatar",
            editable: "always",
            editComponent: (props) => (
              <div>
                <Avatar className={classes.uploadFile}>
                  <img
                    src={file ? file : "./imgs/fileUpload.png"}
                    alt="Avatar"
                    onClick={() => document.getElementById("fileUpload").click()}
                  />
                </Avatar>
                <Input
                  type="file"
                  id="fileUpload"
                  name="file"
                  style={{ display: "none" }}
                  inputProps={{ accept: "image/*" }}
                  onChange={e => uploadImage(e)}
                />
              </div>
            ),
            render: (rowData) => (
              rowData.avatar
                ?   <img
                      src={rowData.avatar}
                      alt="Avatar"
                      style={{ width: 50, borderRadius: "30%" }}
                    />
                : <Avatar>
                    {rowData.name
                      .match(/\b(\w)/g)
                      .join("")
                      .toUpperCase()}
                  </Avatar>
            ),
            headerStyle: {
              width: "25%",
            },
          },
          {
            title: "Email",
            field: "mail",
            editable: "always",
            headerStyle: {
              width: "30%",
            },
          },
          {
            title: "Password",
            field: "password",
            editable: "always",
            headerStyle: {
              width: "30%",
              textAlign: "center",
            },
          },
          {
            title: "Name",
            field: "name",
            editable: "always",
            headerStyle: {
              width: "30%",
            },
          },
          {
            title: "NPS",
            field: "nps",
            editable: "never",
            headerStyle: {
              width: "30%",
            },
          },
          {
            title: "Assigned campaigns",
            field: "campañas",
            editable: "never",
            render: (rowData) => (
              <div>
                {rowData && rowData !== undefined
                  ? rowData.campaigns.map(camp => (
                      <Chip
                        style={{ marginRight: "5px", marginBottom: "5px" }}
                        label={camp.name}
                        variant="default"
                        size="small"
                        color="primary"
                      />))
                  : null}
              </div>
            ),
            headerStyle: {
              width: "50%",
              textAlign: "center",
            },
          },
        ]}
        data={sellers}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              postUser({
                avatar: newData.avatar,
                mail: newData.mail.toLowerCase(),
                password: newData.password,
                name: newData.name,
                role: "seller",
                admin: false,
                idcompany: user.idcompany,
              }).then((resp) => {
                openModal('Changes saved', 'success');
                resolve();
                goToVendedor(resp.userRecord);
              }).catch((error) => {
                let str = (!newData.mail || !newData.password || !newData.name)
                  ? 'Fill all fields'
                  : 'Mail is invalid or already in use'
                openModal(str, 'error');
                reject();
              })
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              updateUser({
                mail: newData.mail.toLowerCase(),
                photoURL: newData.avatar,
                uid: newData.uid,
                name: newData.name,
                nps: newData.nps || 0,
                admin: false,
                role: "seller",
              }).then((res) => {
                if (
                  newData.password &&
                  newData.password !== undefined &&
                  newData.password !== ""
                )
                  updatePass({
                    password: newData.password,
                    uid: newData.uid
                  }).then((res) => {
                    openModal('Changes saved', 'success');
                    resolve();
                    goToVendedor(newData);
                  }).catch((err) => {
                    openModal('Cannot update password', 'error');
                    reject();
                  });
                else {
                  openModal('Changes saved', 'success');
                  resolve();
                  goToVendedor(newData);
                }
              }).catch((err) => {
                openModal('Invalid password: Must have 6 or more characters', 'error');
                reject();
              })
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              deleteUser(oldData.uid).then((res) => {
                openModal('Changes saved', 'success');
                setSellers(sellers.filter((s) => s.uid !== oldData.uid));
                resolve();
              }).catch((err) => {
                openModal('Cannot delete user', 'error');
                reject();
              })
            })
        }}
        actions={[
          {
            icon: ArrowForwardIosIcon,
            tooltip: "See seller",
            onClick: (event, rowData) => goToVendedor(rowData),
          },
        ]}
        options={{
          pageSize: 10,
          pageSizeOptions: [5, 10, 20],
          headerStyle: {
            fontSize: '.85rem',
            fontWeight: 'bold'
          }
        }}
      />
      <SnackBar open={ open } 
        snackbarType={ snackbarType } snackbarText={ snackbarText }
        handleClose={ handleClose }/>
    </Container>
  );
};

export default Sellers;
