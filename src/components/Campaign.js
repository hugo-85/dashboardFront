import React, { useState, useEffect, useContext, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { 
  getCampaign, getSellers, getResourses, addSellerToCampaign, updateCampaign, 
  removeSellerToCampaign, addResource, removeResource, updateResource
} from "../middleware/Middleware";
import { Container, Paper, Avatar, Input, Grid, TextField, FormControl, FormGroup,
  Checkbox, FormControlLabel, FormLabel, InputLabel, MenuItem, Select, IconButton, CircularProgress,
  makeStyles, withStyles, Tooltip, Button, Typography
} from "@material-ui/core";
import { Save, ArrowForwardIos, Help, Delete } from "@material-ui/icons";
import MaterialTable from "material-table";
import SearchSellers from "./SearchSellers";
import { BlockPicker } from "react-color";
import { AuthContext } from "../contexts/AuthContext";
import BreadCrumbs from './BreadCrumbs';
import { Autocomplete } from '@material-ui/lab';
import CheckBox from './CheckBox';
import { SnackBar } from './Snack';
import { HtmlTooltip } from './Tooltips';
import * as moment from 'moment';
import 'moment-timezone';

const Campaign = (props) => {
  const history = useHistory();
  const {
    user: { user },
  } = useContext(AuthContext);
  
  const [camp, setCamp] = useState();
  const [sellers, setSellers] = useState([]);
  const [allSellers, setAllSellers] = useState([]);
  const [sellersCompany, setSellersCompany] = useState([]);
  const [resources, setResources] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [snackbarType, setTypeSnack] = useState();
  const [snackbarText, setTextSnack] = useState();
  const [error, setError] = useState(false);
  const [daysWeek, setDaysWeek] = useState({
    lun: true, mar: false, mie: false, jue: false, vie: false
  });
  const [saturday, setSaturday] = useState({ sab: false });
  const [sunday, setSunday] = useState({ dom: false} );
  const [file, setFile] = useState({
    avatar: '', background: '', banner: ''
  });
  const [horario, setHorarios] = useState({
    hSemana: { inicio1: 0, fin1: 24, inicio2: null, fin2: null },
    hSabado: { inicio1: 0, fin1: 24, inicio2: null, fin2: null },
    hDomingo: { inicio1: 0, fin1: 24, inicio2: null, fin2: null }
  });
  let id = history.location.id || props.id;
  if (!id || id === "undefined") {
    id = localStorage.getItem("idSelected");
    if (!id || id === "undefined") history.push("/");
  }

  const useStyles = makeStyles((theme) => ({
    campaniaInfo: {
      width: "100%",
      paddingBottom: "10px",
      marginBottom: "20px",
      borderRadius: "0px 50px 0px 0px",
    },
    defaultGrid: {
      display: "flex",
      "&> div": {
        marginLeft: "20%",
      },
    },
    rowGrid:{
      display: 'flex',
      alignItems: 'center'
    },
    columnGrid: {
      display: "flex",
      flexDirection: "column",
    },
    textInputTitle: {
      marginLeft: "10%",
      width: "100%",
      "& label": {
        fontSize: "26px",
      },
      "& div": {
        fontSize: "21px",
      },
    },
    textInputLoadText: {
      width: "80%",
      "& label": {
        fontSize: "22px",
      },
      "& div": {
        fontSize: "17px",
        color: "#0a0a0a",
      },
    },
    selectInput: {
      marginTop: "15px",
      width: "100%",
    },
    campAvatar: {
      width: "130px",
      height: "130px",
      marginRight: "200px",
      "&> img": {
        width: "100%",
        objectFit: "cover",
      },
    },
    iconTitle: {
      marginLeft: "0px",
    },
    personIcon: {
      color: "white",
      backgroundColor: "#FFC107",
      float: "left",
      marginLeft: "20%",
    },
    npcIcon: {
      color: "white",
      backgroundColor: "tomato",
      float: "left",
      marginLeft: "25%",
    },
    searchVendedor: {
      padding: "10px",
      width: "92.5%",
      marginTop: "20px",
      marginBottom: "20px",
      marginLeft: "2%",
    },
    headerDiv: {
      backgroundColor: "#241332",
      borderRadius: "0px 50px 0px 50px",
      color: "white",
      textAlign: "center",
      height: "60px",
      fontSize: "40px",
      letterSpacing: "4px",
    },
    headerDivCampaign: {
      backgroundColor: "#241332",
      borderRadius: "0px 50px 0px 50px",
      color: "white",
      textAlign: "center",
      minHeight: "60px",
      fontSize: "40px",
      letterSpacing: "4px",
      display: "flex",
      "&> p": {
        margin: "0px",
        marginLeft: "20%",
      },
      "&> span": {
        marginLeft: "auto",
        marginRight: "2%",
        color: "white",
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
  
  const handleChange = (event, name) => setCamp({ ...camp, [name]: event.target.value });

  const handleChangeColor = (color) => setCamp({ ...camp, headerColor: color.hex });

  const handleChangeColorFont = (color) => setCamp({ ...camp, fontColor: color.hex });

  const handleBackColor = (color) => setCamp({ ...camp, backgroundColor: color.hex });

  const uploadImage = e => {
    const file = e.target.files[0],
      name = e.target.getAttribute('name'),
      reader = new FileReader();

    if (file.type.indexOf("image") < 0) setFile({ ...file, [name]: '' });
    else if (file.size > 1048487) {
      openModal('La imagen no debe superar 1Mb', 'error');
      setError(e.target.getAttribute('id'));
    } else {
      reader.readAsDataURL(file);
      reader.onloadend = e => setFile({ ...file, [name]: reader.result });
    }
  };

  const removeImage = (e, name) => {
    let newCampValues = camp;

    setFile({ ...file, [name]: '' });
    newCampValues.avatar = null;

    setCamp(newCampValues);
  };

  const getClientCampaing = async (id) => {
    var camp = await getCampaign(id);
    var days = {};
    var weekend = [];
    setCamp(camp);
    if(camp.horarios && camp.horarios !== undefined && camp.horarios.diasSemana){
      camp.horarios.diasSemana.map(dia => {
        Object.keys(dia).map(k => (k !== 'sab' && k !== 'dom')
            ? days[k] = dia[k] : weekend.push(dia[k]));
      });
      setDaysWeek(days);
      setSaturday({ sab: weekend[1] });
      setSunday({ dom: weekend[0] });
      return false;
    }
  };

  const getSellersCampaign = (id, allSellers) => {
    var res = [];

    for (const key in allSellers)
      if (allSellers[key].hasOwnProperty("campaigns")) {
        const campaigns = allSellers[key].campaigns;
        if (campaigns.some((c) => c.id === id)) res.push(allSellers[key]);
      }
    setSellers(res);
  };

  const getSellersCompany = async (id, allSellers) => {
    let res = [];

    for (const key in allSellers)
      if (allSellers[key].hasOwnProperty("campaigns")) {
        const campaigns = allSellers[key].campaigns;
        let finded = false;
        campaigns.forEach((camp) => {
          if (camp.id === id) finded = true;
        });
        if (!finded) res.push(allSellers[key]);
      }

    setSellersCompany(res);
  };

  const getAllSellers = useCallback(async () => {
    var sellersAll = await getSellers(user.idcompany);
    var aux = sellersAll.filter((s) => s.hasOwnProperty("mail"));
    aux = aux.filter((s) => {
      for (const sel in sellers)
        if (sel.id === s.id || !s.hasOwnProperty("mail")) return false;

      return true;
    });

    setAllSellers(aux);
    getSellersCampaign(id, aux);
    getSellersCompany(id, aux);
  }, [user, id, sellers]);

  const addNewSeller = (res, sellerId) => {
    if (res.statusText === "OK")
      setSellers([...sellers, allSellers.filter((s) => s.uid === sellerId)[0]]);
  };

  const addSeller = async (sellerId) => {
    const promise = await addSellerToCampaign(id, sellerId);
    Promise.resolve(promise)
      .then((res) => Promise.resolve(addNewSeller(res, sellerId)));
  };

  const getResoursesforCampaign = useCallback(async () => {
    const ress = await getResourses(id);
    setResources(ress);
    return false;
  }, [id]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;

    setOpen(false);
    setTextSnack();
    setTypeSnack();
  };

  const goToSeller = (seller) => {
    history.push({
      pathname: "/",
      id: seller.uid,
      to2: "seller",
    });
  };

  const handleCheckBox = (e) => {
    let name = e.target.getAttribute('name');
    (name !== 'sab' && name !== 'dom') 
      ? setDaysWeek({ ...daysWeek, [e.target.name]: e.target.checked })
      : (name !== 'sab')
          ? setSunday({ dom: e.target.checked })
          : setSaturday({ sab: e.target.checked });
  }

  const openModal = (text, type) => {
    setOpen(true);
    setTextSnack(text);
    setTypeSnack(type);
  }

  const validateChanges = (e) => {
    let allWeek = [{dom: sunday.dom}, {lun: daysWeek.lun}, {mar: daysWeek.mar}, {mie: daysWeek.mie},
      {jue: daysWeek.jue}, {vie: daysWeek.vie}, {sab: saturday.sab}],
      finded = false;
    
    Object.keys(daysWeek).map(days => {
      if(daysWeek[days]) finded = true;
    });

    if(!finded && !saturday.sab && !sunday.dom)
      openModal('Al menos un día de la semana tiene que ser activado', 'error');
    else if(!error)
      saveChanges(allWeek);
    else 
      openModal('Chequea todos los datos', 'error');
  }

  const saveChanges = (allWeek) => {
    if(!error)
      updateCampaign(id, {
        bannerImage: file.banner || camp.banner.image || null,
        bannerText: document.getElementById("link").value || camp.banner.text || null,
        avatar: file.avatar || camp.avatar || null,
        fontColor: camp.fontColor,
        headerColor: camp.headerColor,
        loadText: document.getElementById("loadText").value || camp.loadText || null,
        welcomeText: document.getElementById("welcomeText").value || camp.welcomeText.text,
        welcomeSize: document.getElementById("font-size-welcome-text").value || camp.welcomeText.size,
        name: camp.name,
        typeLogin: parseInt(camp.typeLogin),
        backgroundImage: file.background || camp.backgroundImage,
        backgroundColor: camp.backgroundColor,
        tiempoEspera: parseInt(camp.tiempoEspera),
        diasSemana: allWeek,
        hSemana: [
          (document.getElementById('horarioInicio1'))
            ? parseInt(document.getElementById('horarioInicio1').value) || (camp.horarios && camp.horarios !== undefined)
              ? camp.horarios.horarioInicio1 || 9 : 9
            : (camp.horarios && camp.horarios !== undefined)
              ? camp.horarios.horarioInicio1 || 9 : 9,
          (document.getElementById('horarioFin1'))
            ? parseInt(document.getElementById('horarioFin1').value) || (camp.horarios && camp.horarios !== undefined)
              ? camp.horarios.horarioFin1 || 12 : 12
            : (camp.horarios && camp.horarios !== undefined)
              ? camp.horarios.horarioFin1 || 12 : 12,
          (document.getElementById('horarioInicio2'))
            ? parseInt(document.getElementById('horarioInicio2').value) || (camp.horarios && camp.horarios !== undefined)
              ? camp.horarios.horarioInicio2 || 16 : 16
            : (camp.horarios && camp.horarios !== undefined)
              ? camp.horarios.horarioInicio2 || 16 : 16,
          (document.getElementById('horarioFin2'))
            ? parseInt(document.getElementById('horarioFin2').value) || (camp.horarios && camp.horarios !== undefined)
              ? camp.horarios.horarioFin2 || 20 : 20
            : (camp.horarios && camp.horarios !== undefined)
              ? camp.horarios.horarioFin2 || 20 : 20
          ],
        hSabado: [
          (document.getElementById('horarioSabInicio1'))
            ? parseInt(document.getElementById('horarioSabInicio1').value) || (camp.horarios && camp.horarios !== undefined)
              ? camp.horarios.horarioSabInicio1 || 9 : 9
            : (camp.horarios && camp.horarios !== undefined)
              ? camp.horarios.horarioSabInicio1 || 9 : 9,
          (document.getElementById('horarioSabFin1'))
            ? parseInt(document.getElementById('horarioSabFin1').value) || (camp.horarios && camp.horarios !== undefined)
              ? camp.horarios.horarioSabFin1 || 12 : 12
            : (camp.horarios && camp.horarios !== undefined)
              ? camp.horarios.horarioSabFin1 || 12 : 12,
          (document.getElementById('horarioSabInicio2'))
            ? parseInt(document.getElementById('horarioSabInicio2').value) || (camp.horarios && camp.horarios !== undefined)
              ? camp.horarios.horarioSabInicio2 || 16 : 16
            : (camp.horarios && camp.horarios !== undefined)
              ? camp.horarios.horarioSabInicio2 || 16 : 16,
          (document.getElementById('horarioSabFin2'))
            ? parseInt(document.getElementById('horarioSabFin2').value) || (camp.horarios && camp.horarios !== undefined)
              ? camp.horarios.horarioSabFin2 || 20 : 20
            : (camp.horarios && camp.horarios !== undefined)
              ? camp.horarios.horarioSabFin2 || 20 : 20
          ],
        hDomingo: [
          (document.getElementById('horarioDomInicio1'))
            ? parseInt(document.getElementById('horarioDomInicio1').value) || (camp.horarios && camp.horarios !== undefined)
              ? camp.horarios.horarioDomInicio1 || 9 : 9
            : (camp.horarios && camp.horarios !== undefined)
              ? camp.horarios.horarioDomInicio1 || 9 : 9,
          (document.getElementById('horarioDomFin1'))
            ? parseInt(document.getElementById('horarioDomFin1').value) || (camp.horarios && camp.horarios !== undefined)
              ? camp.horarios.horarioDomFin1 || 12 : 12
            : (camp.horarios && camp.horarios !== undefined)
              ? camp.horarios.horarioDomFin1 || 12 : 12,
          (document.getElementById('horarioDomInicio2'))
            ? parseInt(document.getElementById('horarioDomInicio2').value) || (camp.horarios && camp.horarios !== undefined)
              ? camp.horarios.horarioDomInicio2 || 16 : 16
            : (camp.horarios && camp.horarios !== undefined)
              ? camp.horarios.horarioDomInicio2 || 16 : 16,
          (document.getElementById('horarioDomFin2'))
            ? parseInt(document.getElementById('horarioDomFin2').value) || (camp.horarios && camp.horarios !== undefined)
              ? camp.horarios.horarioDomFin2 || 20 : 20
            : (camp.horarios && camp.horarios !== undefined)
              ? camp.horarios.horarioDomFin2 || 20 : 20
        ],
        zonaHoraria: document.getElementById('timezone-select').value || camp.timeZone,
        cantidadClientes: parseInt(document.getElementById('cantidadClientes').value) || camp.cantidadClientes
      }).then(res => openModal('Se han guardado los cambios', 'success'))
      .catch((error) => openModal('Ocurrió algo inesperado; intente más tarde', 'error'));
    else
      openModal('Chequea todos los datos', 'error');
  };

  useEffect(() => {
    if (id && id !== "undefined") {
      if (!camp) getClientCampaing(id);

      if (allSellers.length === 0) getAllSellers();

      if (resources.length === 0) getResoursesforCampaign();
    }
  }, [id, camp, allSellers, resources, getAllSellers, getResoursesforCampaign]);

  if (!camp)
    return (
      <div className={classes.circularLoading}>
        <CircularProgress size={60} />
      </div>
    );
  return (
    <Container>
      <Grid item xs={12}>
        <BreadCrumbs route={ ['Home', 'Campaigns', camp.name] }/>
      </Grid>
      <Paper className={classes.campaniaInfo} elevation={3}>
        <div className={classes.headerDivCampaign}>
          <p> Info Campaign {camp.name} </p>
          <IconButton
            color="primary"
            aria-label="save"
            component="span"
            onClick={validateChanges}
          >
            <Save />
          </IconButton>
        </div>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} className={classes.defaultGrid}>
            <TextField xs={12} sm={6} disabled id="title-input"
              label="Name" name="name" margin="normal" variant="outlined"
              className={classes.textInputTitle} value={camp.name}
              onChange={(e) => handleChange(e, "name")}
            />
            <HtmlTooltip informativeText='Texto informativo' placement='right-start'
              content="Lorem ipsum dolor sit amet, consectetur adipiscing elitm"
              icon={ <Help /> }/>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.defaultGrid}>
            <FormControl className={classes.selectInput} variant="outlined">
              <InputLabel id="typeLogin-select">Login Type</InputLabel>
              <Select
                labelId="typeLogin-select"
                label="Login Type"
                id="typeLogin-select"
                value={camp.typeLogin ? camp.typeLogin : 3}
                onChange={(e) => handleChange(e, "typeLogin")}
              >
                <MenuItem key={2} value={"2"}>
                  Just Name
                </MenuItem>
                <MenuItem key={3} value={"3"}>
                  Just Email
                </MenuItem>
              </Select>
            </FormControl>
            <HtmlTooltip informativeText='Texto informativo' placement='right-start'
              content="Lorem ipsum dolor sit amet, consectetur adipiscing elitm"
              icon={ <Help /> }/>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.defaultGrid}>
            <div>
              <h3>Waiting time
                <HtmlTooltip informativeText='Texto informativo' placement='right-start'
                  content="Lorem ipsum dolor sit amet, consectetur adipiscing elitm"
                  icon={ <Help /> }/>
              </h3>
              <FormControl className={classes.selectInput} variant="outlined">
                <InputLabel id="wait-time-select">Waiting time</InputLabel>
                <Select
                  labelId="wait-time-select"
                  label="Tiempo de espera"
                  id="tiempoEspera"
                  value={camp.tiempoEspera || 'Get a value'}
                  onChange={(e) => handleChange(e, "tiempoEspera")}
                >
                  <MenuItem key={1} value={1}>
                    1 minute
                  </MenuItem>
                  <MenuItem key={2} value={2}>
                    2 minutes
                  </MenuItem>
                  <MenuItem key={3} value={5}>
                    5 minutes
                  </MenuItem>
                  <MenuItem key={4} value={null}>
                    Without limit
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.defaultGrid}>
            <div>
              <h3>Hours of attention
                <HtmlTooltip informativeText='Texto informativo' placement='right-start'
                  content="Lorem ipsum dolor sit amet, consectetur adipiscing elitm"
                  icon={ <Help /> }/>
              </h3>
              <CheckBox 
                text='Monday to friday' 
                daysWeek={ daysWeek } 
                handler={ handleCheckBox }
                identifierInicio1='horarioInicio1'
                identifierFin1='horarioFin1'
                classes={ classes.inputHorarios }
                horariosInicio1={ (camp.horarios && camp.horarios !== undefined &&
                  camp.horarios.semana[0] && camp.horarios.semana[0] !== undefined)
                    ? camp.horarios.semana[0] : 1}
                horariosFin1={ (camp.horarios && camp.horarios !== undefined && 
                  camp.horarios.semana[1] && camp.horarios.semana[1] !== undefined)
                    ? camp.horarios.semana[1] : 24}
                required1='Required'
                identifierInicio2='horarioInicio2'
                identifierFin2='horarioFin2'
                horariosInicio2={ (camp.horarios && camp.horarios !== undefined && 
                  camp.horarios.semana[2] && camp.horarios.semana[2] !== undefined)
                    ? camp.horarios.semana[2] : null}
                horariosFin2={ (camp.horarios && camp.horarios !== undefined && 
                  camp.horarios.semana[3] && camp.horarios.semana[3] !== undefined)
                    ? camp.horarios.semana[3] : null}
                required2='Optional'/>
              <CheckBox 
                text='Saturday' 
                daysWeek={ saturday } 
                handler={ handleCheckBox }
                identifierInicio1='horarioSabInicio1'
                identifierFin1='horarioSabFin1'
                classes={ classes.inputHorarios }
                horariosInicio1={ (camp.horarios && camp.horarios !== undefined &&
                  camp.horarios.sabado[0] && camp.horarios.sabado[0] !== undefined)
                    ? camp.horarios.sabado[0] : 1}
                horariosFin1={ (camp.horarios && camp.horarios !== undefined &&
                  camp.horarios.sabado[1] && camp.horarios.sabado[1] !== undefined)
                    ? camp.horarios.sabado[1] : 24}
                required1='Required'
                identifierInicio2='horarioSabInicio2'
                identifierFin2='horarioSabFin2'
                horariosInicio2={ (camp.horarios && camp.horarios !== undefined &&
                  camp.horarios.sabado[2] && camp.horarios.sabado[2] !== undefined)
                    ? camp.horarios.sabado[2] : null}
                horariosFin2={ (camp.horarios && camp.horarios !== undefined &&
                  camp.horarios.sabado[3] && camp.horarios.sabado[3] !== undefined)
                    ? camp.horarios.sabado[3] : null}
                required2='Optional'/>
              <CheckBox 
                text='Domingo' 
                daysWeek={ sunday } 
                handler={ handleCheckBox }
                identifierInicio1='horarioDomInicio1'
                identifierFin1='horarioDomFin1'
                classes={ classes.inputHorarios }
                horariosInicio1={ (camp.horarios && camp.horarios !== undefined &&
                  camp.horarios.domingo[0] && camp.horarios.domingo[0] !== undefined)
                    ? camp.horarios.domingo[0] : 1}
                horariosFin1={ (camp.horarios && camp.horarios !== undefined &&
                  camp.horarios.domingo[1] && camp.horarios.domingo[1] !== undefined)
                    ? camp.horarios.domingo[1] : 24}
                required1='Requered'
                identifierInicio2='horarioDomInicio2'
                identifierFin2='horarioDomFin2'
                horariosInicio2={ (camp.horarios && camp.horarios !== undefined &&
                  camp.horarios.domingo[2] && camp.horarios.domingo[2] !== undefined)
                    ? camp.horarios.domingo[2] : null}
                horariosFin2={ (camp.horarios && camp.horarios !== undefined && 
                  camp.horarios.domingo[3] && camp.horarios.domingo[3] !== undefined)
                    ? camp.horarios.domingo[3] : null}
                required2='Optional'/>
              <div>
                <p style={{ fontSize: '11px' }}>Timezone:
                { (camp.horarios && camp.horarios !== undefined && 
                  camp.horarios.zonaHoraria && camp.horarios.zonaHoraria != undefined) 
                    ? camp.horarios.zonaHoraria 
                    : 'America/Argentina/Buenos_Aires'
                }</p>
                <Autocomplete
                  id="timezone-select"
                  options={moment.tz.names()}
                  classes={{ option: classes.selectInput }}
                  autoHighlight
                  getOptionLabel={(option) => option}
                  renderOption={(option) => (
                    <React.Fragment>{option}</React.Fragment>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params} id='timezone' label="Elige zona horaria"
                      variant="outlined"
                      inputProps={{ ...params.inputProps }}
                    />
                  )}
                />
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.defaultGrid}>
            <div>
              <h3>Max. of clientes
                <HtmlTooltip informativeText='Texto informativo' placement='right-start'
                  content="Lorem ipsum dolor sit amet, consectetur adipiscing elitm"
                  icon={ <Help /> }/>
              </h3>
              <Input
                type="number" inputProps={{ min: "1" }}
                id="cantidadClientes" label="Max. of clients"
                name="cantidadClientes" margin="normal"
                variant="outlined"
                className={classes.inputHorarios}
                placeholder={camp.cantidadClientes || 2}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.defaultGrid}>
            <div>
              <h2>Avatar
                <HtmlTooltip informativeText='Texto informativo' placement='right-start'
                  content="Lorem ipsum dolor sit amet, consectetur adipiscing elitm"
                  icon={ <Help /> }/>
                <HtmlTooltip informativeText='Texto informativo' placement='right-end'
                  content="Lorem ipsum dolor sit amet, consectetur adipiscing elitm"
                  icon={ <Delete onClick={(e) => removeImage(e, 'avatar')} /> }/>
              </h2>
              <Avatar className={classes.campAvatar}>
                <img
                  src={file.avatar ? file.avatar : camp.avatar}
                  width="100"
                  alt="Upload Preview"
                  className={classes.imgPreview}
                />
              </Avatar>

              <Input
                type="file"
                id="file"
                name="avatar"
                inputProps={{ accept: "image/*" }}
                placeholder="Upload an image."
                className={classes.fileInput}
                onChange={(e) => uploadImage(e)}
                style={(error === 'file')
                  ? { borderBottom: '1.5px solid red' }
                  : null}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.defaultGrid}>
            <div>
              <h2>Banner
                <HtmlTooltip informativeText='Texto informativo' placement='right-start'
                  content="Lorem ipsum dolor sit amet, consectetur adipiscing elitm"
                  icon={ <Help /> }/>
                <HtmlTooltip informativeText='Texto informativo' placement='right-end'
                  content="Lorem ipsum dolor sit amet, consectetur adipiscing elitm"
                  icon={ <Delete onClick={(e) => removeImage(e, 'banner')} /> }/>
              </h2>
              <div className={classes.campAvatar}>
                <img
                  src={ file.banner
                        ? file.banner : camp.banner
                          ? camp.banner.image : "" }
                  width="100"
                  alt="Upload Preview"
                  className={classes.imgPreview}
                />
              </div>
              <Input
                type="file"
                id="bannerFile"
                name="banner"
                inputProps={{ accept: "image/*" }}
                placeholder="Upload an image."
                className={classes.fileInput}
                onChange={(e) => uploadImage(e)}
                style={(error === 'bannerFile')
                  ? { borderBottom: '1.5px solid red' }
                  : null}
              />
              <Input
                type="text" id="link" name="link"
                placeholder={camp.banner.text || "Link for image"}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.defaultGrid}>
            <div>
              <h2>Background image
                <HtmlTooltip informativeText='Texto informativo' placement='right-start'
                  content="Lorem ipsum dolor sit amet, consectetur adipiscing elitm"
                  icon={ <Help /> }/>
                <HtmlTooltip informativeText='Texto informativo' placement='right-end'
                  content="Lorem ipsum dolor sit amet, consectetur adipiscing elitm"
                  icon={ <Delete onClick={(e) => removeImage(e, 'background')} /> }/>
              </h2>
              <Avatar className={classes.campAvatar}>
                <img
                  src={ file.background
                    ? file.background : camp.backgroundImage
                      ? camp.backgroundImage : "" }
                  width="100"
                  alt="Background Image"
                  className={classes.imgPreview}
                />
              </Avatar>
              <Input
                type="file"
                id="backgroundFile"
                name="background"
                inputProps={{ accept: "image/*" }}
                placeholder="Upload an image."
                className={classes.fileInput}
                onChange={(e) => uploadImage(e)}
                style={(error === 'backgroundFile')
                  ? { borderBottom: '1.5px solid red' }
                  : null}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.defaultGrid}>
            <Grid item xs={12} sm={6}>
              <h2>Background Color</h2>
              <BlockPicker color={camp.backgroundColor}
                onChange={handleBackColor}/>
            </Grid>
          </Grid>
        </Grid>
        <hr />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} className={classes.defaultGrid}>
            <div>
              <h2>Header Color
                <HtmlTooltip informativeText='Texto informativo' placement='right-start'
                  content="Lorem ipsum dolor sit amet, consectetur adipiscing elitm"
                  icon={ <Help /> }/>
              </h2>
              <BlockPicker color={camp.headerColor}
                onChange={handleChangeColor} />
            </div>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.defaultGrid}>
            <div>
              <h2>Font Color
                <HtmlTooltip informativeText='Texto informativo' placement='right-start'
                  content="Lorem ipsum dolor sit amet, consectetur adipiscing elitm"
                  icon={ <Help /> }/>
              </h2>
              <BlockPicker color={camp.fontColor}
                onChange={handleChangeColorFont} />
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={6} sm={6} className={classes.defaultGrid}>
            <div className={ classes.rowGrid }>
              <TextField
                id="loadText" label="Load Text"
                name="loadText" margin="normal"
                className={classes.textInputLoadText}
                placeholder={camp.loadText || "Waiting time on client"}
              />
              <HtmlTooltip informativeText='Texto informativo' placement='right-start'
                content="Lorem ipsum dolor sit amet, consectetur adipiscing elitm"
                icon={ <Help /> }/>
            </div>
          </Grid>
          <Grid item xs={6} sm={6} className={classes.columnGrid}>
            <div className={ classes.rowGrid }>
              <TextField
                id="welcomeText" label="Welcome text"
                name="welcomeText" margin="normal"
                className={classes.textInputLoadText}
                placeholder={camp.welcomeText.text || "Welcome text"}
                variant="outlined"
              />
              <HtmlTooltip informativeText='Texto informativo' placement='right-start'
                content="Lorem ipsum dolor sit amet, consectetur adipiscing elitm"
                icon={ <Help /> }/>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Input
                type="number" inputProps={{ min: "0", max: "180" }}
                id="font-size-welcome-text" name="font-size-welcome-text"
                placeholder={camp.welcomeText.size || 18}
              />
              <span style={{ alignSelf: "center" }}>{"px"}</span>
            </div>
          </Grid>
        </Grid>
      </Paper>
      <Paper className={classes.campaniaInfo} elevation={3}>
        <div className={classes.headerDiv}>
          <p>Sellers</p>
        </div>
        <Paper className={classes.searchVendedor}>
          <SearchSellers sellers={sellersCompany} addSeller={addSeller} />
        </Paper>
        <MaterialTable
          title="Sellers"
          style={{ marginBottom: "30px", width: "95%", marginLeft: "2%" }}
          columns={[
            {
              title: "Avatar",
              field: "avatar",
              editable: "never",
              render: (rowData) =>(
                rowData.avatar 
                  ? <img src={rowData.avatar}
                      alt="avatar" style={{ width: 50, borderRadius: "30%" }} />
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
              editable: "never",
              headerStyle: {
                width: "30%",
                textAlign: "center",
              },
            },
            {
              title: "Name",
              field: "name",
              editable: "never",
              headerStyle: {
                width: "30%",
                textAlign: "center",
              },
              cellStyle: {
                padding: "0px",
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
          ]}
          data={sellers}
          editable={{
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                let c;
                oldData.campaigns.forEach((campaign) => {
                  if (campaign.id === id)
                    c = { nps: campaign.nps, name: campaign.name };
                });
                if (c)
                  removeSellerToCampaign({ id: id, nps: c.nps, name: c.name }, oldData.uid)
                  .then((resp) => {
                    let newList = [];
                    allSellers.forEach((seller) => {
                      if (seller.uid !== oldData.uid) newList.push(seller);
                    });
                    getSellersCampaign(id, newList);
                    openModal('Deleted', 'success');
                    resolve();
                  }).catch((error) => {
                    openModal('Cannot delete', 'error');
                    reject()
                  });
              }),
          }}
          actions={[
            {
              icon: ArrowForwardIos,
              tooltip: "View Seller",
              onClick: (event, rowData) => goToSeller(rowData),
            },
          ]}
          options={{
            pageSize: 10,
            pageSizeOptions: [5, 10, 20],
          }}
        />
      </Paper>
      <Paper className={classes.campaniaInfo} elevation={3}>
        <div className={classes.headerDiv}>
          <p>Resources</p>
        </div>
        <MaterialTable
          title="Resources"
          style={{
            marginTop: "20px",
            marginBottom: "30px",
            width: "95%",
            marginLeft: "2%",
          }}
          columns={[
            {
              title: "Name",
              field: "name",
              editable: "always",
              headerStyle: {
                width: "25%",
                textAlign: "center",
              },
            },
            {
              title: "Type",
              field: "type",
              editable: "always",
              lookup: {
                0: "Indicencias",
                1: "Videos",
                2: "Texto",
                3: "Link Productos",
                4: "Link Soporte",
                5: "Imagen",
              },
              headerStyle: {
                width: "25%",
              },
            },
            {
              title: "Content",
              field: "content",
              editable: "always",
              headerStyle: {
                width: "25%",
              },
            },
          ]}
          data={resources}
          editable={{
            onRowAdd: (newData) =>
              addResource(newData, id).then((res) => {
                openModal('Changes saved', 'success');
                getResoursesforCampaign();
              }).catch((error) => openModal('Cannot add the resource', 'error')),
            onRowDelete: (oldData) =>
              removeResource(id, oldData.id).then((res) => {
                openModal('Resource has been deleted', 'success');
                getResoursesforCampaign();
                setResources(resources.filter((r) => r.id !== oldData.id));
              }).catch((error) => openModal('Cannot delete the resource', 'error')),
            onRowUpdate: (oldData, newData) =>
              updateResource(oldData, id).then((res) => {
                openModal('Resource updated', 'success');
                getResoursesforCampaign();
              }).catch(error => openModal('Cannot update the resource', 'error')),
          }}
          options={{
            pageSize: 10,
            pageSizeOptions: [5, 10, 20],
          }}
        />
      </Paper>
      <SnackBar open={ open } 
        snackbarType={ snackbarType } snackbarText={ snackbarText }
        handleClose={ handleClose }/>
    </Container>
  );
};

export default Campaign;
