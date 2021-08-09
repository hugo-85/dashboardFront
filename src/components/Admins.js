import React, { useState, useEffect, useContext, useCallback } from "react";
import { Container, MenuItem, FormControl, Select, Avatar, Input, Grid, makeStyles
} from "@material-ui/core";
import MaterialTable from "material-table";
import { 
  getAdmins, getCampaign, getCampaignsForCompany, postUser, updateUser, deleteUser
} from "../middleware/Middleware";
import { AuthContext } from "../contexts/AuthContext";
import { SnackBar } from './Snack';
import BreadCrumbs from './BreadCrumbs';

const Admins = () => {
  const {
    user: { user },
  } = useContext(AuthContext);
  const [users, setUsers] = useState();
  const [campaigns, setCampaigns] = useState();
  const [file, setFile] = useState();
  const [open, setOpen] = useState(false);
  const [snackbarType, setTypeSnack] = useState();
  const [snackbarText, setTextSnack] = useState();

  const useStyles = makeStyles((theme) => ({
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

  const get = useCallback(async () => {
    const data = await getAdmins(user.idcompany);
    setUsers(data);
  }, [user]);

  const getCamps = useCallback(async () => {
    const camps = await getCampaignsForCompany(user.idcompany);
    let infoCamp = [];
    camps.forEach(async (camp) => {
      let campaign = await getCampaign(camp);
      infoCamp.push(campaign);
    });
    setCampaigns(infoCamp);
  }, [user]);

  useEffect(() => {
    if (!users) get();
    getCamps();
  }, [users, get, user, getCamps]);

  const uploadImage = (e) => {
    const file = e.target.files[0],
      reader = new FileReader();;
    if (file.type.indexOf("image") < 0) setFile();
    else {
      reader.readAsDataURL(file);
      reader.onloadend = e => setFile(reader.result);
    }
  };

  const openModal = (text, type) => {
    setOpen(true);
    setTextSnack(text);
    setTypeSnack(type);
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;

    setOpen(false);
    setTextSnack();
    setTypeSnack();
  };

  if (!users || !campaigns) return <div>Loading</div>;
  return (
    <Container>
      <Grid item xs={12}>
        <BreadCrumbs route={ ['Home', 'Admins'] }/>
      </Grid>
      <MaterialTable
        title="Administrator"
        style={{ marginBottom: "50px", width: "102%" }}
        columns={[
          {
            title: "Avatar",
            field: "avatar",
            editable: "always",
            render: (rowData) => (
              rowData.avatar
                ? <img
                    src={rowData.avatar}
                    alt="avatar"
                    style={{ width: 50, borderRadius: "30%" }}
                  />
                : <Avatar>
                    {rowData.name
                      .match(/\b(\w)/g)
                      .join("")
                      .toUpperCase()}
                  </Avatar>
            ),
            editComponent: (props) => (
              <div>
                <Avatar className={classes.uploadFile}>
                  <img
                    src={file ? file : "./imgs/fileUpload.png"}
                    alt="avatar"
                    onClick={ () => document.getElementById("fileUpload").click() }
                  />
                </Avatar>
                <Input
                  type="file"
                  id="fileUpload"
                  name="file"
                  style={{ display: "none" }}
                  inputProps={{ accept: "image/*" }}
                  onChange={(e) => uploadImage(e)}
                />
              </div>
            ),
            headerStyle: {
              width: "25%",
            },
          },
          {
            title: "Email",
            field: "mail",
            editable: "onAdd",
            headerStyle: {
              width: "30%",
            },
          },
          {
            title: "Name",
            field: "name",
            editable: "always",
            headerStyle: {
              width: "30%",
            },
            cellStyle: {
              padding: "0px",
            },
          },
          {
            title: "Password",
            field: "password",
            editable: "onAdd",
            headerStyle: {
              width: "30%",
            },
          },
          {
            title: "Campaign",
            field: "idCampaign",
            editable: "always",
            headerStyle: {
              width: "30%",
              textAlign: "center",
            },
            render: (rowData) => {
              var aux = campaigns.filter((camp) => camp.id === rowData.idCampaign);
              return <div>{aux.length > 0 ? aux[0].name : "Not Found"}</div>;
            },
            editComponent: (props) => (
              <FormControl>
                <Select
                  labelId="campaign-select"
                  label="Campaign"
                  id="campaign-select"
                  value={ props.rowData.idCampaign
                    ? props.rowData.idCampaign
                    : campaigns[0].id }
                  onChange={(e) => props.onChange(e.target.value)}
                >
                  {campaigns.map((camp) => (
                    <MenuItem key={camp.id} value={camp.id}>
                      {camp.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ),
          },
        ]}
        data={users}
        editable={{
          onRowAdd: (newData) =>
            postUser({
              mail: newData.mail.toLowerCase(),
              avatar: file || null,
              password: newData.password,
              name: newData.name,
              idcompany: user.idcompany,
              role: "client",
              admin: true,
            }).then((resp) => {
              openModal('Changes saved', 'success');
              get();
            }).catch((error) => {
              let str = (!newData.mail || !newData.password || !newData.name)
                ? 'Complete all fields'
                : 'Mail is invalid or is already in use';
              openModal(str, 'error');
            }),
          onRowUpdate: (newData, oldData) =>
            updateUser({
              mail: newData.mail.toLowerCase(),
              photoURL: newData.photoURL,
              uid: newData.uid,
              name: newData.name,
              admin: true,
              role:'client',
            }).then((res) => {
              openModal('Changes saved', 'success');
              get();
            }).catch((err) => openModal('Cannot update admin', 'error')),
          onRowDelete: (oldData) =>
            deleteUser(oldData.uid).then((res) => {
              openModal('User deleted', 'success');
              setUsers(users.filter((u) => u.uid !== oldData.uid));
            }).catch((err) => openModal('Cannot delete this admin', 'error'))
        }}
        options={{
          pageSize: 10,
          pageSizeOptions: [5, 10, 20],
        }}
      />
      <SnackBar open={ open } 
        snackbarType={ snackbarType } snackbarText={ snackbarText }
        handleClose={ handleClose }/>
    </Container>
  );
};

export default Admins;
