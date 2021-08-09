import React from "react";
import { makeStyles, Grid } from "@material-ui/core";
import { Chat, People, Mood } from '@material-ui/icons';
import DefaultPaper from './DefaultPaper';

const NpsReport = (props) => {
  const { company, bestSeller, bestCampaign } = props;

  const useStyles = makeStyles((theme) => ({
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
  }));
  const classes = useStyles();

  return (
    <Grid container spacing={3}>
      <DefaultPaper
        sm={4}
        classes={ classes.equalizerIcon }
        icon={ <Chat/> }
        title='Total'
        number={ company["nps"].toFixed(2) }
        state='campaigns'/>
      <DefaultPaper
        sm={4}
        classes={ classes.personIcon }
        icon={ <People/> }
        title='Best Campaign'
        number={ bestCampaign.nps }
        state={ 'campaign' }
        id={ bestCampaign.id }
      />
      <DefaultPaper
        sm={4}
        classes={ classes.npcIcon }
        icon={ <Mood/> }
        title='Best CCP'
        text={ `${bestSeller.name} | ${bestSeller.nps.toFixed(2) }` }
        state={ 'seller' }
        id={ bestSeller.uid }
      />
    </Grid>
  );
};

export default NpsReport;
