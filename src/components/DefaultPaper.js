import React from "react";
import { Paper, Grid, LinearProgress } from "@material-ui/core";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";

const DefaultPaper = (props) => {
    const useStyles = makeStyles((theme) => ({
        iconTitle: {
          marginLeft: "0px",
          marginBottom: '2px',
          fontSize: '.9rem',
          fontWeight: '400'
        },
        titleContainer: {
          marginLeft: '5px'
        },
        iconText: {
            fontSize: '11px'
        },
        defaultPaper: {
          padding: "20px",
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderRadius: '10px',
          boxShadow: '0 2px 30px rgba(#000, .9)',
          minHeight: '90px',
          [theme.breakpoints.down('xs')]:{
            flexDirection: 'column',
            textAlign: 'center'
          }
        },
        linkButton: {
          textDecoration: "none",
          color: 'inherit',
          padding: '2% 5%',
          borderRadius: '10px',
          border: '.5px solid rgba(0,0,0,.8)',
          fontSize: '12px'
        },
    }));
    const classes = useStyles();
    const state = (props.state && props.id)
        ? { to: props.state, to2: props.id }
        : (props.state) ? { to: props.state } : null;

    return(
        <Grid item xs={12} sm={ props.sm }>
            <Paper elevation={20} className={ classes.defaultPaper }>
                <Avatar className={ props.classes }>
                    { props.icon }
                </Avatar>
                <div className={classes.titleContainer}>
                    <h2 className={classes.iconTitle}>{ props.title }</h2>
                    { (props.number && props.text)
                        ?   <h3>{ props.number }
                                <span className={ classes.iconText }>
                                    { props.text }
                                </span>
                            </h3>
                        : (props.number || props.number == 0) 
                            ? <h3>{ props.number || 0}</h3>
                            : <h3 className={classes.iconText}>{ props.text }</h3> 
                    }
                </div>
                <Link
                    to={{
                        pathname: "/",
                        search: "",
                        hash: "",
                        state: state,
                    }}
                    className={classes.linkButton}
                >View
                </Link>
            </Paper>
        </Grid>
      )
}

const StatisticPaper = (props) => {
    const useStyles = makeStyles((theme) => ({
        defaultPaper: {
          padding: "20px",
          display: 'flex',
          flexDirection: 'column',
          marginTop: '5%',
          justifyContent: 'space-around',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderRadius: '10px',
          boxShadow: '0 2px 30px rgba(#000, .9)',
          minHeight: '90px',
          [theme.breakpoints.down('xs')]:{
            flexDirection: 'column',
            textAlign: 'center'
          }
        },
        title: {
            margin: '0',
            textAlign: 'left',
            width: '100%',
            padding: '10px',
            borderBottom: '.5px solid #8b9b8b',
            fontWeight: '500',
            fontSize: '.9rem'
        }
    }));
    const classes = useStyles();

    return(
        <Grid item xs={12}>
            <Paper elevation={20} className={ classes.defaultPaper }>
                <h4 className={ classes.title }>{ props.title }</h4>
                { (props.data.length > 0)
                    ?   props.data.map((dt, i) => (
                            <div style={{ width: '100%', padding: '1%' }} key={i}>
                                <p style={{ 
                                    marginBottom: '1px', fontSize: '15px', fontWeight: 'bold'
                                }}>{ dt.title }
                                </p>
                                <LinearProgress variant="determinate" value={ parseInt(dt.value) }/>
                                <span style={{ marginTop: '1px', fontSize: '14px' }}>
                                    { dt.value }</span>
                            </div>
                        ))
                    : null }
            </Paper>
        </Grid>
      )
}

export default DefaultPaper;
export { StatisticPaper };