import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles, List, CircularProgress, Container, Paper, Grid } from "@material-ui/core";
import StatsCampaign from "./StatsCampaign";
import BreadCrumbs from '../../BreadCrumbs';

const StatsReportDetails = (props) => {
  const history = useHistory();
  const { camps } = history.location.state;
  const [loading, setLoading] = useState(true);

  const getFixedFloatNumber = (param) => {
    if (isNaN(parseFloat(param)) || param === 0)
      return parseFloat(0)
    else 
      return parseFloat(param).toFixed(2);
  }

  const walkTheObject = (objToIterate, objToFill) => {
    let aux = objToFill;
    Object.keys(objToIterate).map(key => {
      if(!isNaN(parseFloat(objToIterate[key])))
        aux[key] += getFixedFloatNumber(objToIterate[key]);
    });
    return aux;
  }

  useEffect(() => {
    for (let i = 0; i < camps.length; i++) {
      const camp = camps[i];
      if (camp.hasOwnProperty("sellers")) {
        let data = { avrgQueryTime: 0, adherence: 0, effectiveness: 0, attention1: 0, attention2: 0,
          dropouts1: 0, dropouts2: 0, entries: 0, service1: 0, service2: 0 };

        for (let s = 0; s < camp.sellers.length; s++) {
          const sel = camp.sellers[s];
          data = walkTheObject(sel, data);
        }

        camp = walkTheObject(data, camp);
      }
    }
    setLoading(false);
  }, [camps]);

  const useStyles = makeStyles((theme) => ({
    root: {
      padding: "10px",
      "& div.ListHeader": {
        fontSize: "40px",
        textAlign: "center",
        fontFamily: "Verdana, Arial, Helvetica, sans-serif",
        fontWeight: "900",
      },
    },
  }));
  const classes = useStyles();

  if (loading) return <CircularProgress />;
  return (
    <Container>
      <Grid item xs={12}>
        <BreadCrumbs route={ ['Home', 'Reports', 'Stats Details'] }/>
      </Grid>
      <Paper elevation={3} className={classes.root}>
        <div className="ListHeader">STATISTICS DETAILS</div>
        <List component="nav" aria-labelledby="nested-list-subheader">
          { camps.map((c) => <StatsCampaign key={c.id} camp={c} />) }
        </List>
      </Paper>
    </Container>
  );
};

export default StatsReportDetails;
