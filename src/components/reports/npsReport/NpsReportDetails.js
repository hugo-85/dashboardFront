import React from "react";
import { useHistory } from "react-router-dom";
import NpsCampaign from "./NpsCampaign";
import { Avatar, Paper, Grid, Container, makeStyles } from "@material-ui/core";
import BreadCrumbs from '../../BreadCrumbs';

const NpsReportDetails = (props) => {
  const history = useHistory();
  const { company, camps } = history.location.state;
  
  const useStyles = makeStyles((theme) => ({
    details: {
      marginTop: "40px",
      padding: "5px",
      marginLeft: "20px",
      marginRight: "20px",
      paddingBottom: "40px",
    },
    companyTitle: {
      width: "100%",
      borderBottom: "3px solid #161930",
      display: "flex",
      marginRight: "40px",
      "&> h2": {
        marginRight: "40px",
      },
    },
    npsCompany: {
      marginTop: "10px",
      height: "50px",
      width: "50px",
      marginLeft: "auto",
    },
  }));
  const classes = useStyles();

  return (
    <Container>
      <Grid item xs={12}>
        <BreadCrumbs route={ ['Home', 'Reports', 'NPS Details'] }/>
      </Grid>
      <Paper elevation={3} className={classes.details}>
        <div className={classes.companyTitle}>
          <h2>{company.name}</h2>
          <Avatar className={classes.npsCompany}>{company.nps}</Avatar>
        </div>
        {camps.map((c) => (
          <NpsCampaign key={c.id} camp={c} />
        ))}
      </Paper>
    </Container>  
  );
};

export default NpsReportDetails;
