import React, { Fragment } from "react";
import NpsSeller from "./NpsSeller";
import { Avatar, makeStyles } from "@material-ui/core";

const NpsCampaign = (props) => {
  const { id, name, sellers, nps } = props.camp;

  const useStyles = makeStyles((theme) => ({
    campEntry: {
      marginTop: "40px",
      marginLeft: "10%",
      borderBottom: "2px solid #161930",
      display: "flex",
      "&> h3": { marginRight: "40px" },
    },
    npsCamp: {
      marginTop: "10px",
      marginLeft: "auto",
    },
  }));
  const classes = useStyles();

  return (
    <Fragment>
      <div key={id} className={classes.campEntry}>
        <h3>{name}</h3>
        <Avatar className={classes.npsCamp}>{nps}</Avatar>
      </div>
      {sellers.map((s) => (
        <NpsSeller key={s.uid} seller={s} />
      ))}
    </Fragment>
  );
};

export default NpsCampaign;
