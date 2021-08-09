import React, { useState } from "react";
import { ListItem, makeStyles } from "@material-ui/core";
import { Help, ExpandLess, ExpandMore } from '@material-ui/icons';
import { ItemChip } from "./StatsSeller";
import { HtmlTooltip } from '../../Tooltips';

const StatsCampaign = ({ camp }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => setOpen(!open);

  const useStyles = makeStyles((theme) => ({
    statListItem: {
      width: "98%",
      border: "1px solid #161930",
      fontSize: "30px",
      fontFamily: "Verdana, Arial, Helvetica, sans-serif",
      borderRadius: "10px",
      display: "block",
      marginBottom: "10px",
      padding: "0px",
      "& div.MuiChip-root": {
        margin: "2px",
      },
      "& div.details": {
        padding: "5px",
      },
    },
    itemTitle: {
      backgroundColor: "#161930",
      borderRadius: "10px 10px 0px 0px",
      color: "white",
      width: "100%",
      textAlign: "center",
    },
  }));
  const classes = useStyles();

  return (
    <ListItem button 
      onClick={ e => (camp.sellers.length > 0) ? handleClick : null }
      className={classes.statListItem}>
      <div className={classes.itemTitle}>{camp.name}
        {(camp.sellers.length > 0) 
          ? (open) ? <ExpandLess /> : <ExpandMore />
          : null }
      </div>
      <div className="details">
        <ItemChip label={`Avrg. Resolution Query Time ${camp.avrgQueryTime}`}/>
        <HtmlTooltip informativeText='Tiempo medio de resolución de consultas'
          placement='right-start'
          content="Tiempo medio en el que los promotores están atendiendo"
          icon={ <Help /> }/>
        <ItemChip label={`Adherence (%) ${camp.adherence}`}/>
        <HtmlTooltip informativeText='Adherencia'
          placement='right-start'
          content="Tiempo que el agente estuvo disponible sobre total de tiempo"
          icon={ <Help /> }/>
        <ItemChip label={`Effectiveness (%) ${camp.effectiveness}`}/>
        <HtmlTooltip informativeText='Efectividad'
          placement='right-start'
          content="Contactos efectivos sobre cantidad de contactos"
          icon={ <Help /> }/>
      </div>
      <div className='details'>
        <ItemChip label={`Dropout Level 1 (%) ${camp.dropouts1}`}/>
        <HtmlTooltip informativeText='Tiempo medio de resolución de consultas'
          placement='right-start'
          content="Tiempo medio en el que los promotores están atendiendo"
          icon={ <Help /> }/>
        <ItemChip label={`Dropout Level 2 (%) ${camp.dropouts2}`}/>
        <HtmlTooltip informativeText='Tiempo medio de resolución de consultas'
          placement='right-start'
          content="Tiempo medio en el que los promotores están atendiendo"
          icon={ <Help /> }/>
      </div>
      <div className='details'>
        <ItemChip label={`Attention Level 1 (%) ${camp.attention1}`}/>
        <HtmlTooltip informativeText='Tiempo medio de resolución de consultas'
          placement='right-start'
          content="Tiempo medio en el que los promotores están atendiendo"
          icon={ <Help /> }/>
        <ItemChip label={`Attention Level 2 (%) ${camp.attention2}`}/>
        <HtmlTooltip informativeText='Tiempo medio de resolución de consultas'
          placement='right-start'
          content="Tiempo medio en el que los promotores están atendiendo"
          icon={ <Help /> }/>
        <ItemChip label={`Service Level 1 (%) ${camp.service1}`}/>
        <HtmlTooltip informativeText='Tiempo medio de resolución de consultas'
          placement='right-start'
          content="Tiempo medio en el que los promotores están atendiendo"
          icon={ <Help /> }/>
        <ItemChip label={`Service Level 2 (%) ${camp.service2}`}/>
        <HtmlTooltip informativeText='Tiempo medio de resolución de consultas'
          placement='right-start'
          content="Tiempo medio en el que los promotores están atendiendo"
          icon={ <Help /> }/>
        <ItemChip label={`Entries ${camp.entries}`}/>
        <HtmlTooltip informativeText='Tiempo medio de resolución de consultas'
          placement='right-start'
          content="Tiempo medio en el que los promotores están atendiendo"
          icon={ <Help /> }/>
      </div>
    </ListItem>
  )
};

export default StatsCampaign;
