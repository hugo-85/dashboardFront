import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { getCampaigns, getCompany, getSellers, getChats, getSessions, getServices
} from "../middleware/Middleware";
import { Container, TextField, Grid, CircularProgress, makeStyles } from "@material-ui/core";
import { HourglassEmpty, QuestionAnswer } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import NpsReport from "./NpsReport";
import BreadCrumbs from './BreadCrumbs.js';
import DefaultPaper, { StatisticPaper } from './DefaultPaper';
import moment from 'moment';

const Reports = () => {
  const [company, setCompany] = useState();
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bestSeller, setBestSeller] = useState();
  const [bestCampaign, setBestCampaign] = useState();
  const [avrgQueryTime, setAvrgQueryTime] = useState(0);
  const [adherence, setAdherence] = useState(0);
  const [effectiveness, setEffectiveness] = useState(0);
  const [service1, setService1] = useState(0);
  const [service2, setService2] = useState(0);
  const [attention1, setAttention1] = useState(0);
  const [attention2, setAttention2] = useState(0);
  const [dropOuts1, setDropouts1] = useState(0);
  const [dropOuts2, setDropouts2] = useState(0);
  const [entries, setEntries] = useState(0);
  const {
    user: { user },
  } = useContext(AuthContext);

  const useStyles = makeStyles((theme) => ({
    equalizerIcon: {
      color: "#4791FF",
      backgroundColor: "#E0ECFF",
      borderRadius: '10px'
    },
    statistics: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      paddingBottom: '2rem',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      }
    },
    containerStats: {
      marginTop: '2.5%', 
      maxWidth: '95%', 
      [theme.breakpoints.down('xs')]: {
        maxWidth: '100%',
        margin: '5% auto'
      }
    },
    searchBar: {
      margin: '2% 0 2% auto', 
      maxWidth: '250px',
      [theme.breakpoints.down('xs')]: {
        maxWidth: '100%',
        margin: '5% auto'
      }
    }
  }));
  const classes = useStyles();

  const isNumber = arg => {
    return (arg && arg !== undefined && !isNaN(parseFloat(arg))) ? parseFloat(arg) : 0;
  }

  const calculateAdherence = (chats, sessions) => {
    let adherence = 0;
    sessions.map(session => {
      let init = session.inicioSession,
        finale = session.finSession,
        usedTimeInit = 0, 
        usedTimeFinale = 0,
        timeAvailable = (init && init !== undefined && finale && finale !== undefined)
          ? moment(finale).diff(moment(init), 'seconds')
          : 0;

      if(timeAvailable > 0)
        chats.map(chat => {
          let cInit = chat.inicioDeCharla,
            cFinale = chat.finDeCharla;
          if(moment(cInit).format('DD-MM-YYYY') === moment(init).format('DD-MM-YYYY') &&
            moment(cInit).format('HH:mm:ss') > moment(init).format('HH:mm:ss') &&
            moment(cInit).format('HH:mm:ss') < moment(finale).format('HH:mm:ss')){
              usedTimeInit = (usedTimeInit === 0 || 
                moment(usedTimeInit).format('HH:mm:ss') > moment(cInit).format('HH:mm:ss'))
                  ? moment(cInit) : usedTimeInit;
              usedTimeFinale = (usedTimeFinale === 0 ||
                moment(usedTimeFinale).format('HH:mm:ss') < moment(cFinale).format('HH:mm:ss'))
                  ?  moment(cFinale) : usedTimeFinale;
            }
        });

      adherence += (timeAvailable > 0 && usedTimeFinale > 0 && usedTimeInit > 0)
        ? timeAvailable - moment(usedTimeFinale).diff(moment(usedTimeInit), 'seconds')
        : 0;
    });
    adherence /= sessions.length;
    if(!isNaN(adherence) && adherence > 0)
        return adherence 
    else 
      return 0;
  }

  const get = async () => {
    const company1 = await getCompany(user.idcompany);
    let camps = await getCampaigns(user.idcompany);
    let sellersAll = await getSellers(user.idcompany);
    //Stats for sellers
    let queryTime = 0, countChats = 0, countAttended = 0, countShortAttended = 0, countRejected = 0,
      countTimeOutAttended = 0, countTotalUsers = 0, npsTotal = 0, maxNpsCampaign = -1;

    sellersAll = sellersAll.filter((s) => s.hasOwnProperty("mail"));

    for (let i = 0; i < sellersAll.length; i++) {
      const sel = sellersAll[i];
      const chats = await getChats(sel.uid);
      const sessions = await getSessions(sel.uid);
      const services = await getServices(sel.uid);
      let selQueryTime = 0, selCountChats = 0, selAttended = 0, selShortAttended = 0,
        selTimeOutAttended = 0, selRejected = 0, selTotalUsers = 0;

      sel["chats"] = chats;
      sel["sessions"] = sessions;
      sel["services"] = services;
      
      if (chats.length > 0) {
        for (let c = 0; c < chats.length; c++) {
          const chat = chats[c];
          selCountChats += (!isNaN(chat.tiempoTotal)) ? 1 : 0;
          selQueryTime += (!isNaN(chat.tiempoTotal)) ? chat.tiempoTotal : 0;
        }
        countChats += selCountChats;
        queryTime += selQueryTime;
      }
      if (sessions.length > 0)
        for (let s = 0; s < sessions.length; s++) {
          const session = sessions[s];
          if (session.hasOwnProperty("atendidos") && session.hasOwnProperty("rechazados")) {
            selAttended += isNumber(session.atendidos);
            selShortAttended += isNumber(session.antecionesCortas);
            selRejected += isNumber(session.rechazados);
            selTotalUsers += isNumber(session.totalUsuarios);
          }
        }
      if (services.length > 0)
        services.map(serv => {
          if(serv && serv !== undefined && serv.tiempoDeEspera && serv.tiempoDeEspera !== undefined){
            let espera = parseInt(serv.tiempoDeEspera);
            selTimeOutAttended += (isNaN(espera) || espera === 0) ? 0 : 1;
          }
        });

      sel["avrgQueryTime"] = (selQueryTime > 0)
        ? parseFloat(selQueryTime / selCountChats).toFixed(2) : 0;
      sel["adherence"] = (chats.length > 0 && sessions.length > 0)
        ? parseFloat(calculateAdherence(chats, sessions)) : 0;
      sel["effectiveness"] = 0;
      sel["attention1"] = (selTotalUsers > 0 && selAttended > 0)
        ? Math.round(parseFloat(selAttended / selTotalUsers) * 100).toFixed(2) : 0;
      sel["attention2"] = (selAttended > 0 && (selTotalUsers - selRejected) > 0)
        ? Math.round(parseFloat(selAttended/(selTotalUsers - selRejected)) * 100).toFixed(2) : 0;
      sel["dropouts1"] = (selRejected > 0 && selAttended > 0)
        ? Math.round(parseFloat(selRejected / selAttended) * 100).toFixed(2) : 0;
      sel["dropouts2"] = (selRejected > 0 && selShortAttended > 0 &&
        selAttended > 0 && selAttended - selShortAttended > 0)
          ? Math.round(
              parseFloat((selRejected - selShortAttended) / (selAttended - selShortAttended) * 100)
              .toFixed(2)
            ) : 0;
      sel["entries"] = selCountChats;
      sel["service1"] = (selTotalUsers > 0 && selTimeOutAttended > 0)
        ? Math.round(parseFloat(selTimeOutAttended / selTotalUsers) * 100) : 0;
      sel["service2"] = (selTimeOutAttended > 0 && (selTotalUsers - selShortAttended) > 0)
        ? Math.round(parseFloat(selTimeOutAttended / (selTotalUsers - selShortAttended)) * 100) : 0;

      countAttended += parseFloat(selAttended);
      countShortAttended += parseFloat(selShortAttended);
      countRejected += parseFloat(selRejected);
      countTotalUsers += parseFloat(selTotalUsers);
      countTimeOutAttended += parseFloat(selTimeOutAttended);
    }

    let vAvrgQryTime = (queryTime > 0 && countChats > 0) ? parseFloat(queryTime / countChats) : 0;
    vAvrgQryTime = (!isNaN(vAvrgQryTime) && vAvrgQryTime !== 0) ? vAvrgQryTime.toFixed(2) : 0;
    setAvrgQueryTime(vAvrgQryTime);

    let vAttention1 = (countAttended > 0 && countTotalUsers > 0) 
      ? Math.round(parseFloat(countAttended / countTotalUsers) * 100) : 0;
    vAttention1 = (!isNaN(vAttention1) && vAttention1 !== 0) ? vAttention1.toFixed(2) : 0;
    setAttention1(vAttention1);

    let vAttention2 = (countAttended > 0 && (countTotalUsers - countRejected) > 0)
      ? Math.round(parseFloat(countAttended / (countTotalUsers - countRejected)) * 100) : 0;
    vAttention2 = (!isNaN(vAttention2) && vAttention2 !== 0) ? vAttention2.toFixed(2) : 0;
    setAttention2(vAttention2);

    let vDropouts1 = (countAttended > 0 && countRejected > 0)
      ? Math.round(parseFloat(countRejected / countAttended) * 100) : 0;
    vDropouts1 = (!isNaN(vDropouts1) && vDropouts1 !== 0) ? vDropouts1.toFixed(2) : 0;
    setDropouts1(vDropouts1);

    let vDropouts2 = ((countRejected - countShortAttended) > 0 && (countAttended - countShortAttended) > 0)
      ? Math.round(
          parseFloat((countRejected - countShortAttended)/(countAttended - countShortAttended)) * 100
        ) : 0;
    vDropouts2 = (!isNaN(vDropouts2) && vDropouts2 !== 0) ? vDropouts2.toFixed(2) : 0;
    setDropouts2(vDropouts2);

    let vService1 = (countTimeOutAttended > 0 && countTotalUsers > 0)
      ? Math.round(parseFloat(countTimeOutAttended / countTotalUsers) * 100) : 0;
    vService1 = (!isNaN(vService1) && vService1 !== 0) ? vService1.toFixed(2) : 0;
    setService1(vService1);

    let vService2 = (countTimeOutAttended > 0 && (countTotalUsers - countShortAttended) > 0)
      ? Math.round(parseFloat(countTimeOutAttended / (countTotalUsers - countShortAttended) * 100)) : 0;
    vService2 = (!isNaN(vService2) && vService2 !== 0) ? vService2.toFixed(2) : 0;
    setService2(vService2);

    setEntries(countChats);

    camps = camps.map((c) => ({ ...c, sellers: getSellersCampaign(c.id, sellersAll) }));

    for (let i = 0; i < camps.length; i++) {
      const camp = camps[i];
      let npsCamp = 0, maxNps = 0, indexSel = -1;
      for (let j = 0; j < camp.sellers.length; j++) {
        const sel = camp.sellers[j];
        if (!isNaN(sel.nps))
          npsCamp += Number(sel.nps);
        if (!isNaN(Number(sel.nps)) > maxNps) {
          indexSel = j;
          maxNps = Number(sel.nps);
        }
      }

      if (indexSel > -1) {
        camps[i]["sellers"][indexSel]["bestSeller"] = true;
        setBestSeller(camps[i]["sellers"][indexSel]);
      }

      if (camps[i]["nps"] > maxNpsCampaign) {
        maxNpsCampaign = camps[i]["nps"];
        setBestCampaign(camps[i]);
      }
      npsTotal += camps[i]["nps"];
    }
    setCamps(camps);
    company1["nps"] = Math.round((npsTotal / camps.length) * 100) / 100;
    setCompany(company1);
    setLoading(false);
  };

  const getSellersCampaign = (id, allSellers) => {
    let res = [];

    for (const key in allSellers)
      if (allSellers[key].hasOwnProperty("campaigns")) {
        const campaigns = allSellers[key].campaigns;
        if (campaigns.some((c) => c.id === id)) {
          const selCamp = campaigns.filter((c2) => c2.id === id);
          res.push({
            ...allSellers[key],
            nps: (selCamp[0].nps && selCamp[0].nps !== undefined) ? selCamp[0].nps : 0,
            bestSeller: false,
          });
        }
      }
    return res;
  };

  const setAllStatistics = (data, c) => {
    if(c > 0)
      Object.keys(data)
        .map(key => data[key] = (key === 'entries')
          ? parseInt(data[key]) : (parseFloat(data[key]) / c).toFixed(2));
    else
      Object.keys(data).map(key => data[key] = 0);

    setAvrgQueryTime(data.avrgQueryTime);
    setAttention1(data.attention1);
    setAttention2(data.attention2);
    setDropouts1(data.dropouts1);
    setDropouts2(data.dropouts2);
    setService1(data.service1);
    setService2(data.service2);
    setEntries(data.entries);
  }

  const handleSelector = async (e, value) => {
    if(value && value.sellers && value.sellers !== undefined){
      let data = { avrgQueryTime: 0, adherence: 0, effectiveness: 0, attention1: 0, attention2: 0,
        dropouts1: 0, dropouts2: 0, service1: 0, service2: 0, service3: 0, entries: 0 }, c = 0;

      value.sellers.map(seller => {
        if(seller.entries === 0) return false
        c++;
        Object.keys(seller)
          .map(key => data[key] += (!isNaN(parseFloat(seller[key]))) ? parseFloat(seller[key]) : 0);
      });
      
      setAllStatistics(data, c);
    } else 
      get();
  }

  useEffect(() => {
    if (camps && camps.length === 0) get();
  }, [camps, user]);

  if (loading) return <CircularProgress />;
  return (
    <Container className={classes.reportsCointainer}>
      <Grid item xs={12}>
        <BreadCrumbs route={ ['Home', 'Reports'] }/>
      </Grid>
      <NpsReport company={company} camps={camps} loading={loading}
        bestSeller={bestSeller} bestCampaign={bestCampaign}/>
      <Autocomplete
        id="campaign-select" options={camps} autoHighlight
        freeSolo getOptionLabel={(option) => option.name}
        className={ classes.searchBar }
        renderOption={(option) => (
          <React.Fragment>{option.name}</React.Fragment>
        )}
        renderInput={(params) => (
          <div>
            <TextField
              {...params}
              id='campaign' variant="outlined"
              inputProps={{ ...params.inputProps }}
              placeholder={ `Selector` }
            />
          </div>
        )}
        onChange={ handleSelector }/>
      <div className={ classes.statistics }>
        <Grid container xs={12} sm={6} className={ classes.containerStats }
          style={{ marginRight: '1%' }}>
          <DefaultPaper
            sm={12} classes={ classes.equalizerIcon }
            icon={ <HourglassEmpty/> }
            title='TMO' text='min'
            number={ (avrgQueryTime / 60).toFixed(2) }/>
          <StatisticPaper
            title='General'
            data={ [
              { title: 'Adherence', value: adherence },
              { title: 'Effectiveness', value: effectiveness },
              { title: 'Dropout lvl 1', value: dropOuts1 },
              { title: 'Dropout lvl 2', value: dropOuts2 },
            ] }/>
        </Grid>
        <Grid container xs={12} sm={6} className={ classes.containerStats }
          style={{ marginLeft: '1%' }}>
          <DefaultPaper
            sm={12} classes={ classes.equalizerIcon }
            icon={ <QuestionAnswer/> }
            title='Entries'
            number={ entries }/>
          <StatisticPaper
            title='General'
            data={ [
              { title: 'Attention lvl 1', value: attention1 },
              { title: 'Attention lvl 2', value: attention2 },
              { title: 'Service lvl 1', value: service1},
              { title: 'Service lvl 2', value: service2 }
            ] }/>
        </Grid>
      </div>
    </Container>
  );
};

export default Reports;
