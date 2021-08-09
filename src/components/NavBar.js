import React, { useState, useContext, Fragment } from "react";
import { NavLink } from "react-router-dom";
import firebase from "../config/firebase";
import { 
  AppBar, Toolbar, Typography, IconButton, Button, Drawer, Grid, List, ListItem, ListItemIcon,
  ListItemText, Badge, makeStyles, Avatar
} from "@material-ui/core";
import { 
  Menu, Person, Equalizer, PeopleAlt, ShowChart, ExitToApp, ArrowDropDownCircleRounded,
  SupervisorAccount
} from '@material-ui/icons';
import { AuthContext } from "../contexts/AuthContext";

const NavBar = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const {
    user: { user },
    campaign,
    dispatch,
  } = useContext(AuthContext);
  const [showLogOut, setShowLogOut] = useState(false);
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      marginBottom: "40px",
    },
    appBar: { backgroundColor: "#16192f", minHeight: "65px", padding: "5px" },
    appBarProfile: {
      height: "70px",
      width: "100px",
      "&> span": {
        marginLeft: "25px",
        marginTop: "15px",
        "&> span": {
          borderRadius: "50%",
          backgroundColor: "white",
          border: "2px white solid",
          width: "50%",
          "&:hover": {
            cursor: "pointer",
          },
        },
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    clienteInfo: {
      backgroundColor: "#241332",
      height: "150px",
      width: "250px",
      borderRadius: "0px 50px 0px 50px",
      display: "flow-root",
      "&> div": {
        marginTop: "13%",
        marginBottom: "5%",
        marginLeft: "25px",
      },
      "&> h5": {
        color: "white",
        height: "fit-content",
        marginLeft: "25px",
        fontSize: "1rem",
      },
      "&> h6": {
        color: "white",
        height: "fit-content",
        marginLeft: "25px",
        fontSize: "0.7rem",
      },
    },
    title: {
      flexGrow: 1,
    },
    presentation: {
      borderRadius: "0px 50px 0px 50px",
    },
    headerLink: {
      textDecoration: "none",
      color: "white",
      width: "30%",
      "& img": {
        width: "50px",
        margin: "10px",
      },
    },
    menuList: {
      paddingTop: "60px",
      paddingLeft: "6px",
      paddingBottom: "8px",
    },
    sideMenuLink: {
      textDecoration: "none",
      color: "#241332",
      "&:hover": {
        backgroundColor: "#eceaec",
      },
    },
    sideMenuLinkIcon: {
      color: "#5f4d4d",
    },
    logOutButton: {
      marginTop: "20%",
      "& svg": {
        transform: "rotate(180deg)",
        marginRight: "30px",
      },
    },
    floatSignOut: {
      width: 0,
      height: 0,
      marginLeft: "55%",
      borderStyle: "solid",
      borderWidth: "0 5px 10px 5px",
      borderColor: "transparent transparent #161930 transparent",
    },
    floatSignOutContent: {
      border: "1px solid blue",
      borderRadius: "5px 5px 5px 5px",
      backgroundColor: "#161930",
      display: "flex",
      "& svg": {
        width: "20px",
        transform: "rotate(180deg)",
      },
      "& h6": {
        margin: "5px",
      },
      "&:hover": {
        backgroundColor: "tomato",
        cursor: "pointer",
      },
    },
  }));
  const classes = useStyles();

  const handleSignout = () => {
    firebase.auth().signOut()
      .then(() => {
        localStorage.clear();
        dispatch({ type: "SIGNOUT_SUCCESS" });
      });
  };

  const floatSignOut = (
    <div>
      <div className={classes.floatSignOut}></div>
      <div className={classes.floatSignOutContent}>
        <ExitToApp />
        <h6 onClick={handleSignout}>Log Out</h6>
      </div>
    </div>
  );

  return (
    <Fragment>
      <div className={classes.root}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar className="root-menu" variant="dense">
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              <NavLink
                to={{
                  pathname: "/",
                  search: "",
                  hash: "",
                  state: { to: "/" },
                }}
                className={classes.headerLink}
              >
                <img src="./imgs/wow.png" alt="wow" />
              </NavLink>
            </Typography>
            <div className={classes.appBarProfile}>
              <Badge
                overlap="circle"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                badgeContent={<ArrowDropDownCircleRounded color="action" />}
                onClick={() => setShowLogOut(!showLogOut)}
              >
                {user.avatar ? (
                  <Avatar alt="profile" src={user.avatar} />
                ) : (
                  <Avatar alt="profile">
                    {user.name
                      .match(/\b(\w)/g)
                      .join("")
                      .toUpperCase()}
                  </Avatar>
                )}
              </Badge>
              {showLogOut && floatSignOut}
            </div>
          </Toolbar>
        </AppBar>
      </div>
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)}>
        <div
          role="presentation"
          className={classes.presentation}
          onClick={() => setMenuOpen(false)}
          onKeyDown={() => setMenuOpen(false)}
        >
          <Grid container justify="center" className={classes.clienteInfo}>
            { user.avatar 
              ? <Avatar alt="profile" src={user.avatar} />
              : <Avatar alt="profile">
                  {user.name
                    .match(/\b(\w)/g)
                    .join("")
                    .toUpperCase()}
                </Avatar> }
            <Typography variant="h5">{user && user.name}</Typography>
            <Typography variant="h6">
              {user && user.admin ? "Admin" : campaign.name}
            </Typography>
          </Grid>
          <List className={classes.menuList}>
            <NavItem 
              state={ { to: "sellers" } }
              text="CCP"
              icon={ <Person /> }/>
            <NavItem 
              state={ { to: "campaigns" } }
              text="Campaigns"
              icon={ <Equalizer /> }/>
            <NavItem 
              state={ { to: "reports" } }
              text="Reports"
              icon={ <ShowChart /> }/>
            {user.admin && (
              <NavItem 
                state={ { to: "users" } }
                text="Customer"
                icon={ <PeopleAlt /> }/>
            )}
            <NavItem 
              state={ { to: "admins" } }
              text="Administrator"
              icon={ <SupervisorAccount /> }/>
          </List>
        </div>
        <Button className={classes.logOutButton} onClick={handleSignout}>
          <ExitToApp />
          <h4>Log Out</h4>
        </Button>
      </Drawer>
    </Fragment>
  );
};

const NavItem = (props) => {
  const useStyles = makeStyles((theme) => ({
    sideMenuLink: {
      textDecoration: "none",
      color: "#241332",
      "&:hover": {
        backgroundColor: "#eceaec",
      },
    },
    sideMenuLinkIcon: {
      color: "#5f4d4d",
    }
  }));
  const classes = useStyles();

  return(
    <NavLink
      to={{
        pathname: "/",
        search: "",
        hash: "",
        state: props.state,
      }}
      className={ classes.sideMenuLink }
    >
      <ListItem button key={ props.text }>
        <ListItemIcon className={ classes.sideMenuLinkIcon }>
          { props.icon }
        </ListItemIcon>
        <ListItemText primary={ props.text } />
      </ListItem>
    </NavLink>
  )
}

export default NavBar;