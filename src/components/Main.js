import React, { useState, useEffect, useContext } from "react";
import { Container, Grid, Avatar, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { ArrowForwardIos, Chat, People, Mood } from "@material-ui/icons";
import MaterialTable, { MTableToolbar } from "material-table";
import { getCampaignsForCompany, getSellers } from "../middleware/Middleware";
import { AuthContext } from "../contexts/AuthContext";
import BreadCrumbs from './BreadCrumbs';
import DefaultPaper from './DefaultPaper';
import { db_realtime } from '../config/firebase';

const Main = (props) => {
  const {
    user: { user },
  } = useContext(AuthContext);
  const [sellers, setSellers] = useState([]);
  const [camps, setCamps] = useState([]);
  const [sellerOnline, setSellerOnline] = useState([]);
  const [totalNps, setTotalNps] = useState(0);
  const history = useHistory();
  let  listening = false;

  const useStyles = makeStyles((theme) => ({
    root: {
      padding: "10px",
      marginBottom: "40px",
    },
    personIcon: {
      color: '#FFD950',
      backgroundColor: '#FFF8DD',
      borderRadius: '10px'
    },
    npcIcon: {
      color: "#FF2366",
      backgroundColor: "#FFDAE5",
      borderRadius: '10px'
    },
    equalizerIcon: {
      color: "#4791FF",
      backgroundColor: "#E0ECFF",
      borderRadius: '10px'
    },
    dataGrid: {
      marginBottom: "30px",
    },
    defaultPaper: {
      padding: "20px",
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 2px 30px rgba(#000, .9)',
      [theme.breakpoints.down('xs')]:{
        flexDirection: 'column',
        textAlign: 'center'
      }
    },
    titleToolbar: {
      '& h6': {
        fontSize: '.9rem'
      }
    },
    flexRow: {
      display: 'flex',
      alignItems: 'center'
    }
  }));
  const classes = useStyles();

  const calculateNps = (sellers) => {
    let nps = 0, c = 0;
    sellers.map(seller => {
      if(!isNaN(parseInt(seller.nps)) && parseInt(seller.nps) > 0){
        nps += seller.nps;
        c++;
      }
    });
    nps = (!isNaN(nps) && nps > 0 && c > 0) ? parseFloat(nps / c).toFixed(2) : 0;
    setTotalNps(nps); 
  };

  const get = async () => {
    const camps = await getCampaignsForCompany(user.idcompany);
    const sellers = await getSellers(user.idcompany);

    setSellers(sellers);
    setCamps(camps);

    calculateNps(sellers);
  };

  const listenerRealtime = () => {
    listening = true;
    //Este es un escuchador de los usuarios que se conectan en el CHAT, por eso se hardcodea y no
    //pasa por API
    db_realtime.child('user-names-online').on('child_added', info => {
      let finded = false;
      info.forEach(usr => {
        sellers.map(seller => {
          if(seller.uid === usr.val().id){
            sellerOnline.map(onSeller => {
              if(seller.uid === onSeller.uid) finded = true;
            });
            if(!finded) setSellerOnline([...sellerOnline, seller]);
          }
        });
      });
    });

    db_realtime.child('user-names-online').on('child_removed', info => {
      let finded = false;
      info.forEach(usr => {
        sellers.map(seller => {
          if(seller.uid === usr.val().id)
            setSellerOnline(sellerOnline.filter(sellr => sellr.uid !== seller.uid));
        });
      });
    });
  }

  useEffect(() => {
    if (camps && camps.length === 0) get();

    if (!listening) listenerRealtime();
  }, [camps, user]);

  const goToVendedor = (vendedor) => {
    history.push({
      pathname: "/seller",
      id: vendedor.uid,
      to2: "seller",
    });
  };

  return (
    <Container>
      <Grid item xs={12}>
        <BreadCrumbs route={ ['Home'] }/>
      </Grid>
      <Grid container spacing={3} className={classes.dataGrid}>
        <DefaultPaper
          sm={4} classes={ classes.equalizerIcon }
          icon={ <Chat/> } title='Campaigns'
          number={ camps.length } state='campaigns'/>
        <DefaultPaper
          sm={4} classes={ classes.personIcon }
          icon={ <People/> } title='Online CCP'
          number={ sellerOnline.length } state='sellers'/>
        <DefaultPaper
          sm={4} classes={ classes.npcIcon }
          icon={ <Mood/> } title='NPS CCP'
          number={ totalNps } state='sellers'/>
      </Grid>
      <MaterialTable
        title="Online Customer Care Professional"
        style={{ padding: '10px' }}
        columns={[
          {
            title: "ID",
            field: "uid",
            editable: "never",
            headerStyle: {
              width: "10%",
            },
          },
          {
            title: "CCP",
            field: "seller",
            editable: "always",
            render: (rowData) => (
              <div className={ classes.flexRow }>
                { rowData.avatar 
                  ? <img
                      src={rowData.avatar}
                      alt="Avatar"
                      style={{ width: 50, borderRadius: "30%" }}
                    />
                  : <Avatar>
                      {rowData.name
                        .match(/\b(\w)/g)
                        .join("")
                        .toUpperCase()}
                    </Avatar> } 
                <p>{ rowData.name }</p>
              </div>
            ),
            headerStyle: {
              width: "30%",
            },
          },
          {
            title: "Email",
            field: "mail",
            headerStyle: {
              width: "30%",
            },
          },
          {
            title: "NPS",
            field: "nps",
            editable: "never",
            headerStyle: {
              width: "10%",
            },
          },
        ]}
        data={sellerOnline}
        actions={[
          {
            icon: ArrowForwardIos,
            tooltip: "See Customer Care Professional",
            onClick: (event, rowData) => goToVendedor(rowData),
          },
        ]}
        components={{
          Toolbar: props => (
            <div>
              <MTableToolbar { ...props } classes={{ root: classes.titleToolbar }}/>
            </div>
          )
        }}
        options={{
          pageSize: 10,
          pageSizeOptions: [5, 10, 20],
          actionsColumnIndex: -1,
          headerStyle: {
            fontSize: '.85rem',
            fontWeight: 'bold'
          }
        }}
      />
    </Container>
  );
};

export default Main;
