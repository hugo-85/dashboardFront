import React from "react";
import { Paper, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
//import StatsReportDetails from "./reports/statsReport/StatsReportDetails";

const StatsReport = (props) => {
  const {
    avrgQueryTime,
    adherence,
    effectiveness,
    attention1,
    attention2,
    dropOuts1,
    dropOuts2,
    entries,
  } = props;

  const useStyles = makeStyles((theme) => ({
    resume: {
      marginBottom: "40px",
      padding: "10px",
      "&> h2": {
        fontFamily: "Verdana, Arial, Helvetica, sans-serif",
        textAlign: "center",
      },
    },
    resumeTotal: {
      display: "flex",
      backgroundColor: "#4d5abd",
      marginBottom: "10px",
      "&> p": {
        width: "70%",
        marginLeft: "4%",
        color: "white",
        fontFamily: "Verdana, Arial, Helvetica, sans-serif",
      },
      "&> div": {
        width: "7%",
        backgroundColor: "white",
        transform: "skewX(-10deg)",
        boxShadow: "inset 0px 0px 10px -5px rgba(0,0,0,0.76)",
      },
      "&> span": {
        marginTop: "20px",
        marginLeft: "3%",
        color: "white",
        fontFamily: "Verdana, Arial, Helvetica, sans-serif",
      },
    },
    detailButton: {
      width: "100%",
    },
  }));
  const classes = useStyles();

  //if (loading) return <CircularProgress />;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <Paper className={classes.resumeTotal}>
          <p className={classes.ItemTitle}>Avrg. Resolution Query Time</p>
          <div> </div>
          <span>{avrgQueryTime}</span>
        </Paper>
        <Paper className={classes.resumeTotal}>
          <p className={classes.ItemTitle}>Adherence (%)</p>
          <div> </div>
          <span>{adherence}</span>
        </Paper>
        <Paper className={classes.resumeTotal}>
          <p className={classes.ItemTitle}>Effectiveness (%)</p>
          <div> </div>
          <span>{effectiveness}</span>
        </Paper>
        <Paper className={classes.resumeTotal}>
          <p className={classes.ItemTitle}>Dropout Level 1 (%)</p>
          <div> </div>
          <span>{dropOuts1}</span>
        </Paper>
        <Paper className={classes.resumeTotal}>
          <p className={classes.ItemTitle}>Dropout Level 2 (%)</p>
          <div> </div>
          <span>{dropOuts2}</span>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper className={classes.resumeTotal}>
          <p className={classes.ItemTitle}>Attention Level 1 (%)</p>
          <div> </div>
          <span>{attention1}</span>
        </Paper>
        <Paper className={classes.resumeTotal}>
          <p className={classes.ItemTitle}>Attention Level 2 (%)</p>
          <div> </div>
          <span>{attention2}</span>
        </Paper>
        <Paper className={classes.resumeTotal}>
          <p className={classes.ItemTitle}>Service Level 1 (%)</p>
          <div> </div>
          <span>{0}</span>
        </Paper>
        <Paper className={classes.resumeTotal}>
          <p className={classes.ItemTitle}>Service Level 2 (%)</p>
          <div> </div>
          <span>{0}</span>
        </Paper>
        <Paper className={classes.resumeTotal}>
          <p className={classes.ItemTitle}>Service Level 3 (%)</p>
          <div> </div>
          <span>{0}</span>
        </Paper>
        <Paper className={classes.resumeTotal}>
          <p className={classes.ItemTitle}>Entries</p>
          <div> </div>
          <span>{entries}</span>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default StatsReport;

/*
<Paper elevation={3}>
        <Button
          className={classes.detailButton}
          size="large"
          variant="outlined"
          color="primary"
          onClick={() => setShowDetails(!showDetails)}
        >
          Details
        </Button>
      </Paper>
*/

//{showDetails && <StatsReportDetails sellers={sellers} />}
