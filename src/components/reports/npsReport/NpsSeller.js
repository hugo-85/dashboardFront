import React from "react";
import { Avatar, makeStyles } from "@material-ui/core";

const NpsSeller = (props) => {
  const { avatar, name, nps, bestSeller } = props.seller;
  const useStyles = makeStyles((theme) => ({
    sellerEntry: {
      marginLeft: "20%",
      borderBottom: "1px solid #161930",
      display: "flex",
    },
    avatar: {
      marginRight: "40px",
      padding: "5px",
      marginTop: "10px",
    },
    npsSeller: {
      height: "30px",
      width: "30px",
      fontSize: "15px",
      marginTop: "15px !important",
      backgroundColor: bestSeller ? "darkorange" : "",
      marginLeft: "auto",
      padding: "5px",
    },
  }));
  const classes = useStyles();
  return (
    <div className={classes.sellerEntry}>
      <Avatar className={classes.avatar} alt="avatar">
        {avatar 
          ? <img src={avatar} alt="avatar" />
          :   name
              .match(/\b(\w)/g)
              .join("")
              .toUpperCase()}
      </Avatar>
      <h4>{name}</h4>
      <Avatar className={classes.npsSeller}>{nps}</Avatar>
    </div>
  );
};

export default NpsSeller;
