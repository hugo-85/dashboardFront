import React from "react";
import { ListItem, Chip, makeStyles } from "@material-ui/core";

const StatsSeller = ({ seller }) => {
  const useStyles = makeStyles((theme) => ({
    sellItem: {
      width: "80%",
      marginLeft: "15%",
      border: "1px solid #161930",
      borderRadius: "10px",
      display: "block",
      marginBottom: "10px",
      padding: "0px",
      "& div.sellName": {
        backgroundColor: "#434b86",
        borderRadius: "10px 10px 0px 0px",
        color: "white",
        width: "100%",
        textAlign: "center",
      },
      "& div.MuiChip-root": {
        margin: "2px",
      },
      "& div.details": {
        padding: "5px",
      },
    },
  }));
  const classes = useStyles();
  return (
    <ListItem button className={classes.sellItem}>
      <div className="sellName">{seller.name}</div>
      <div className="details">
        <ItemChip label={`Avrg. Resolution Query Time ${seller.avrgQueryTime}`}/>
        <ItemChip label={`Adherence (%) ${seller.adherence}`}/>
        <ItemChip label={`Effectiveness (%) ${seller.effectiveness}`}/>
        <ItemChip label={`Dropout Level 1 (%) ${seller.dropouts1}`}/>
        <ItemChip label={`Dropout Level 2 (%) ${seller.dropouts2}`}/>
        <ItemChip label={`Attention Level 1 (%) ${seller.attention1}`}/>
        <ItemChip label={`Attention Level 2 (%) ${seller.attention2}`}/>
        <ItemChip label={`Service Level 1 (%) ${seller.service1}`}/>
        <ItemChip label={`Service Level 2 (%) ${seller.service2}`}/>
        <ItemChip label={`Entries ${seller.entries}`}/>
      </div>
    </ListItem>
  );
};

export const ItemChip = (props) => {
  return(
    <Chip
      variant="outlined"
      size="small"
      label={ props.label }/>
  )
}

export default StatsSeller;
