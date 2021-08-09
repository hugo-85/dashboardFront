import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  Container, Input, MenuItem, FormControl, Select, Avatar, Button, Tooltip, Grid, makeStyles
} from "@material-ui/core";
import MaterialTable, { MTableHeader } from "material-table";
import { ArrowForwardIos, Visibility } from "@material-ui/icons";
import CallMadeIcon from '@material-ui/icons/CallMade';
import { getCampaigns, getCompany } from "../middleware/Middleware";
import { AuthContext } from "../contexts/AuthContext";
import { ButtonContainer } from "../floating-button/components/app.jsx";
import qrcode from 'qrcode-generator';
import BreadCrumbs from './BreadCrumbs';
import { UrlButton } from './UrlButton';
import { ModalForCenter } from './Modals';

const Campaigns = (props) => {
  const history = useHistory();
  const {
    user: { user },
  } = useContext(AuthContext);
  const [camps, setCamps] = useState([]);
  const [company, setComp] = useState([]);
  const [file, setFile] = useState();
  const [showGenerator, setButtonBehaviour] = useState(false);
  const [iframeContent, setIframeContent] = useState(null);
  const [openModal, setModalOpen] = useState(false);
  const [bodyModal, setBodyModal] = useState(null);

  const useStyles = makeStyles((theme) => ({
    campaignsTable: {
      marginTop: "40px",
    },
    selectInput: {
      width: "100%",
    },
    uploadFile: {
      borderRadius: "30%",
      cursor: "pointer",
      "&> img": {
        width: "100%",
        objectFit: "cover",
      },
    }
  }));
  const classes = useStyles();
  
  useEffect(() => {
    getCamps();
  }, []);

  const getCamps = async () => {
    const camps = await getCampaigns(user.idcompany);
    const comp = await getCompany(user.idcompany);
    setCamps(camps);
    setComp(comp);
  };

  const uploadImage = (e) => {
    const file = e.target.files[0],
      reader = new FileReader();
    if (file.type.indexOf("image") < 0) setFile();
    else {
      reader.readAsDataURL(file);
      reader.onloadend = ev => setFile(reader.result);
    }
  };

  const goToCampaign = (camp) => {
    history.push({
      pathname: "/",
      id: camp.id,
      to2: "campaign",
    });
  };

  const handleModal = (open, modal) => {
    setModalOpen(open);
    setBodyModal(modal);
  }

  const URLButton = (url, qr) => {
    let button = <div style={{ display: 'flex' }}>
                    <Tooltip title='Enlace' aria-label="Ir a enlace">
                      <Button>
                        <CallMadeIcon
                          onClick={ e => window.open(url, '_blank') }/>
                      </Button>
                    </Tooltip>
                    <Tooltip title='QR' aria-label='mostrar QR'>
                      <Button>
                        <Visibility
                          onClick={ e => handleModal(true, qr.createDataURL(12, 1)) }/>
                      </Button>
                    </Tooltip>
                  </div>;
    return button;
  }

  return (
    <Container className={classes.campaignsTable}>
      <Grid item xs={12}>
        <BreadCrumbs route={ ['Home', 'Campaigns'] }/>
      </Grid>
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
          },
          {
            title: "Avatar",
            field: "avatar",
            editable: "always",
            render: (rowData) => (
              <img
                src={rowData.avatar ? rowData.avatar : "./imgs/wow.png"}
                alt="Avatar"
                style={{ width: 50, borderRadius: "50%" }}
              />
            ),
            editComponent: (props) => (
              <div>
                <Avatar className={classes.uploadFile}>
                  <img
                    src={file ? file : "./imgs/fileUpload.png"}
                    alt="avatar"
                    onClick={() =>
                      document.getElementById("fileUpload").click()
                    }
                  />
                </Avatar>
                <Input
                  type="file"
                  id="fileUpload"
                  name="file"
                  style={{
                    display: "none",
                  }}
                  inputProps={{ accept: "image/*" }}
                  //onChange={(e) => props.onChange(e.target.value)}
                  onChange={(e) => uploadImage(e)}
                />
              </div>
            ),
            headerStyle: {
              width: "25%",
            },
          },
          {
            title: "Type Login",
            field: "typeLogin",
            editable: "always",
            headerStyle: {
              width: "40%",
              textAlign: "center",
            },
            render: (rowData) => {
              if (rowData.typeLogin === 1) return <div>Email and Pass</div>;
              else if (rowData.typeLogin === 2) return <div>Just Name</div>;
              else return <div>Just Email</div>;
            },
            editComponent: (props) => (
              <FormControl className={classes.selectInput}>
                <Select
                  labelId="typeLogin-select"
                  label="Login Type"
                  defaultValue={1}
                  id="typeLogin-select"
                  onChange={e => props.onChange(e.target.value)}
                >
                  <MenuItem key={1} value={"1"}>
                    Email and Pass
                  </MenuItem>
                  <MenuItem key={2} value={"2"}>
                    Just Name
                  </MenuItem>
                  <MenuItem key={3} value={"3"}>
                    Just Email
                  </MenuItem>
                </Select>
              </FormControl>
            ),
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
            title: "URL Sales",
            field: "URL promotor",
            editable: "never",
            headerStyle: {
              width: "40%",
              textAlign: 'center',
            },
            render: (rowData) => {
              let qr = qrcode(0, 'L'),
                url = `https://chat.wow2.xinnux.com/${company.name}/sales`;              
              qr.addData(url);
              qr.make();
  
              return (
                <div style={{ display: 'flex' }}>
                  <UrlButton title='Enlace' label='Ir a enlace'
                    buttonContent={
                      <CallMadeIcon onClick={ e => window.open(url, '_blank') }/>
                    }/>
                  <UrlButton title='QR' label='Mostrar QR'
                    buttonContent={
                      <Visibility onClick={ e => handleModal(true, qr.createDataURL(12, 1)) }/>
                    }/>
                </div>
              )
            }
          },
          {
            title: "URL Cliente",
            field: "URL cliente",
            editable: "never",
            headerStyle: {
              width: "40%",
              textAlign: 'center'
            },
            render: (rowData) => {
              let qr = qrcode(0, 'L'),
                  url = `https://chat.wow2.xinnux.com/${company.name}/${rowData.name}/client`;
              qr.addData(url);
              qr.make();

              return(
                <div style={{ display: 'flex' }}>
                  <UrlButton title='Enlace' label='Ir a enlace'
                    buttonContent={
                      <CallMadeIcon onClick={ e => window.open(url, '_blank') }/>
                    }/>
                  <UrlButton title='QR' label='Mostrar QR'
                    buttonContent={
                      <Visibility onClick={ e => handleModal(true, qr.createDataURL(12, 1)) }/>
                    }/>
                </div>
              )
            }
          },
          {
            title: "Embed Button",
            field: "button",
            editable: "never",
            headerStyle: {
              width: "30%",
            },
            render: (rowData) => {
              return (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setButtonBehaviour(true);
                    setIframeContent(rowData.name);
                  }}
                >
                  Generate
                </Button>
              );
            },
          },
        ]}
        data={camps}
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
          headerStyle: {
            fontSize: '.85rem',
            fontWeight: 'bold',
            minWidth: '110px'
          }
        }}
      />
      {showGenerator ? (
        <ButtonContainer
          event={() => setButtonBehaviour(false)}
          campaign={iframeContent}
          company={user.name}
        />
      ) : null}

      {openModal
        ? <ModalForCenter bodyModal={ bodyModal } handleModal={ handleModal } />
        : null}
    </Container>
  );
};

export default Campaigns;
