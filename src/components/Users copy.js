import React, { useState, useEffect, useContext } from "react";
import { Container, Paper, Grid, Button, makeStyles, CircularProgress } from "@material-ui/core";
import MaterialTable from "material-table";
import { getSellers, getChats, getCampaign, getCampaigns, getUser, getNonClients,
} from "../middleware/Middleware";
import { AuthContext } from "../contexts/AuthContext";
import { FilterList, DeleteOutline } from '@material-ui/icons';
import { SnackBar } from './Snack';
import Chats from "./Chats";
import BreadCrumbs from "./BreadCrumbs";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import DateFnsUtils from "@date-io/date-fns";
import startOfDay from "date-fns/startOfDay";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import { parse, format, addSeconds } from "date-fns";
import moment from "moment";

const Users = () => {
  const {
    user: { user },
  } = useContext(AuthContext);
  const [filteredChats, setFilteredChats] = useState();
  const [filteredMarkedClients, setFilteredClients] = useState();
  const [fromDate, setFromDate] = useState(startOfDay(new Date()));
  const [toDate, setToDate] = useState(startOfDay(new Date()));
  const [chats, setChats] = useState();
  const [open, setOpen] = useState(false);
  const [snackbarType, setTypeSnack] = useState();
  const [snackbarText, setTextSnack] = useState();

  const get = async () => {
    let sels = await getSellers(user.idcompany);
    let chast2 = [], camps = [];

    if (sels && sels.length > 0 && sels[0].hasOwnProperty("uid")) {
      for (let i = 0; i < sels.length; i++) {
        const sel = sels[i];
        const chats = await getChats(sel.uid);
        const countChatsUser = [];
        if (chats && chats.length > 0 && chats[0].hasOwnProperty("userID"))
          for (let c = 0; c < chats.length; c++)
            if (chats[c].tiempoTotal !== null) {
              if (camps.length === 0 || camps.includes((n) => n.id !== chats[c].campaignId)){
                const camp = await getCampaign(chats[c].campaignId);
                camps.push({ id: chats[c].campaignId, name: camp.name });
              }
              if (camps.length > 0) {
                const user2 = await getUser(chats[c].userID);
                countChatsUser[chats[c].userID] = countChatsUser[chats[c].userID]
                  ? countChatsUser[chats[c].userID] + 1 : 1;
                chats[c]["seller"] = sel["name"];
                delete chats[c].chatId;
                delete chats[c].charlaId;
                delete chats[c].enlace;
                delete chats[c].userID;
                chats[c]["npsSeller"] = sel["nps"];
                chats[c]["user"] = user2["name"];
                chats[c]["nps"] = (!chats[c].hasOwnProperty("nps"))
                  ? 0 : chats[c].nps? chats[c].nps: 0;
                chats[c]["campaign"] = camps.filter((n) => n.id === chats[c].campaignId)[0].name;
                delete chats[c].campaignId;
                chast2.push(chats[c]);
              }
            }
      }
      setChats(chast2);
    }
  };

  const getNoAtendidos = async (from = null, to = null) => {
    let cmps = await getCampaigns(user.idcompany),
      markedUsers = [];

    cmps.forEach(async (cmp) => {
      let nonCli = await getNonClients(cmp.id);
      nonCli.map((nCli) => {
        if (nCli && nCli !== undefined) {
          nCli.campaign = cmp.name;
          if (from && to) {
            if (
              moment(from).format("DD-MM-YYYY") <= nCli.fecha ||
              moment(to).format("DD-MM-YYYY") >= nCli.fecha
            )
              markedUsers.push(nCli);
          } else markedUsers.push(nCli);
        }
      });
    });

    setFilteredClients(markedUsers);
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
  };

  const validateFromDate = (aDate) => {
    var startDate = startOfDay(aDate);
    if (startDate > toDate) {
      openModal(`La fecha debe ser igual o menor a ${format(toDate, "dd/MM/yyyy")}`, 'error');
      setFromDate(toDate);
    } else setFromDate(startOfDay(startDate));
  };

  const validateToDate = (aDate) => {
    var endDate = startOfDay(aDate);
    if (endDate < toDate) {
      openModal(`La fecha debe ser igual o mayor a ${fromDate}`, 'error');
      setToDate(fromDate);
    } else setToDate(endDate);
  };

  const clearFilter = () => setFilteredChats(null);

  const filterData = () => {
    let chatsFiltered = [];
    for (let i = 0; i < chats.length; i++) {
      const user = chats[i];
      if (user.chats.length > 0)
        for (let c = 0; c < user.chats.length; c++) {
          const chat = user.chats[c];
          if (chat.inicioDeCharla && chat.inicioDeCharla !== "") {
            var result = parse(chat.inicioDeCharla.substring(0, 10),"dd-MM-yyyy",new Date());
            if (result >= fromDate && result <= toDate) {
              chatsFiltered.push(user);
              break;
            }
          }
        }
    }

    getNoAtendidos(fromDate, toDate);
    setFilteredChats(chatsFiltered);
  };

  useEffect(() => {
    get();
    getNoAtendidos();
  }, [user]);

  const useStyles = makeStyles((theme) => ({
    root: {
      paddingBottom: "100px",
    },
    circularLoading: {
      marginLeft: "46%",
      marginTop: "20%",
      "& div": {
        color: "#16192f",
      },
    },
    paperFilter: {
      marginBottom: "20px",
      padding: "10px",
      "& div.filterTitle": {
        marginLeft: "5%",
        borderBottom: "1px solid #161930",
      },
      "& .clientsFilters": {
        display: "flex",
        "&> div": {
          marginLeft: "10%",
        },
        "&> button": {
          margin: "0 auto",
          height: "50px",
          marginTop: "1.5%",
        },
      },
    },
  }));
  const classes = useStyles();

  const createChats = async () => {
    console.log(format(new Date(), "dd/MM/yyyy, hh:mm:ss"));

    var sels = await getSellers(user.idcompany);
    let cmps = await getCampaigns(user.idcompany);

    let resp = await axios.get(
      `http://localhost:4000/api/v1/users/clients/list/${user.idcompany}`,
      {
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );

    let clients = resp.data;

    console.log("users chat --> ", clients);
    var start = new Date(2020, 8);
    var end = new Date();
    for (let s = 0; s < sels.length; s++) {
      const sel = sels[s];
      var cantChats = Math.floor(Math.random() * 10) + 10;
      for (let c = 0; c < cantChats; c++) {
        var campaign = cmps[Math.floor(Math.random() * cmps.length)];
        var client = clients[Math.floor(Math.random() * clients.length)];
        var fechaInicio = new Date(
          start.getTime() + Math.random() * (end.getTime() - start.getTime())
        );
        var tiempo = Math.floor(Math.random() * 10);
        var fechaFin = addSeconds(fechaInicio, tiempo);
        var nps = Math.floor(Math.random() * 9);
        if (nps === 0) nps = 1;

        console.log(
          "chat",
          campaign.id,
          client.uid,
          format(fechaInicio, "dd/MM/yyyy, hh:mm:ss"),
          format(fechaFin, "dd/MM/yyyy, hh:mm:ss"),
          tiempo,
          nps
        );
      }
    }
  };

  if (!chats)
    return (
      <div className={classes.circularLoading}>
        <CircularProgress size={60} />
      </div>
    );
  return (
    <Container className={classes.root}>
      <Grid item xs={12}>
        <BreadCrumbs route={["Home", "Customers"]} />
      </Grid>
<<<<<<< HEAD
      <Button variant="outlined" color="secondary" onClick={createChats}>
        Create Chats
      </Button>
=======
>>>>>>> a1944e35cc7f993f547bd4e79e771b348cc8bb2a
      <Paper className={classes.paperFilter}>
        <div className="filterTitle">
          <h3>Filters</h3>
        </div>
        <div className="clientsFilters">
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="fromDate"
              label="From Date"
              autoOk={true}
              value={fromDate}
              onChange={validateFromDate}
              KeyboardButtonProps={{ "aria-label": "change date" }}
            />
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="toDate"
              label="To Date"
              autoOk={true}
              value={toDate}
              onChange={validateToDate}
              KeyboardButtonProps={{ "aria-label": "change date" }}
            />
          </MuiPickersUtilsProvider>
          <Button
            variant="outlined"
            color="primary"
            endIcon={<FilterList />}
            onClick={filterData}
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            endIcon={<DeleteOutline />}
            onClick={clearFilter}
          >
            Clear
          </Button>
        </div>
      </Paper>
      <MaterialTable
        title="Chats"
        style={{ marginBottom: "50px", paddingBottom: "20px", width: "100%" }}
        columns={[
          {
            title: "Name",
            field: "user",
            editable: "never",
            headerStyle: {
              width: "30%",
            },
            render: (rowData) => <div>{rowData.user || "Usuario no registrado"}</div>,
          },
          {
            title: "Date",
            field: "inicioDeCharla",
            editable: "never",
            headerStyle: {
              width: "30%",
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
              width: "15%",
            },
          },
          {
            title: "Customer Care Professional",
            field: "seller",
            editable: "never",
            headerStyle: {
              width: "30%",
            },
            cellStyle: {
              padding: "0px",
            },
          },
          {
            title: "Campaign",
            field: "campaign",
            editable: "never",
            headerStyle: {
              width: "30%",
              textAlign: "center",
            },
          },
        ]}
        data={filteredChats ? filteredChats : chats}
        options={{
          pageSize: 10,
          pageSizeOptions: [5, 10, 20],
          exportButton: true,
          filtering: true,
        }}
      />
      <MaterialTable
        title="Non-Attended Customers"
        style={{ marginBottom: "50px", paddingBottom: "20px", width: "100%" }}
        columns={[
          {
            title: "Name",
            field: "name",
            editable: "never",
            headerStyle: {
              width: "30%",
            },
            render: (rowData) => <div>{rowData.name || "Usuario no registrado"}</div>,
          },
          {
            title: "Mail",
            field: "mail",
            editable: "never",
            headerStyle: {
              width: "30%",
            },
          },
          {
            title: "Date",
            field: "fecha",
            editable: "never",
            headerStyle: {
              width: "30%",
            },
          },
          {
            title: "Time",
            field: "hora",
            editable: "never",
            headerStyle: {
              width: "15%",
            },
          },
          {
            title: "Campaign",
            field: "campaign",
            editable: "never",
            headerStyle: {
              width: "30%",
              textAlign: "center",
            },
          },
        ]}
        data={filteredMarkedClients}
        options={{
          pageSize: 10,
          pageSizeOptions: [5, 10, 20],
          exportButton: true,
          filtering: true,
        }}
      />
<<<<<<< HEAD
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={snackbarType}>
          {snackbarText}
        </Alert>
      </Snackbar>

      <Paper className={classes.chatsTable}>
        <div className={classes.headerDiv}>
          <p>CHATS</p>
        </div>
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="download-table-xls-button"
          table="table-pivot"
          filename="tablexls"
          sheet="tablexls"
          buttonText="Download as XLS"
        />
        <div className="chatsBody">
          <Chats
            chats={chats.map((c) => {
              delete c.tableData;
              return c;
            })}
          />
        </div>
      </Paper>
=======
      <SnackBar open={ open } 
        snackbarType={ snackbarType } snackbarText={ snackbarText }
        handleClose={ handleClose }/>
>>>>>>> a1944e35cc7f993f547bd4e79e771b348cc8bb2a
    </Container>
  );
};

export default Users;