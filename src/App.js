import React, { useContext, useEffect } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { BrowserRouter, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Main from "./components/Main";
import NavBar from "./components/NavBar";
import Sellers from "./components/Sellers";
import Campaigns from "./components/Campaigns";
import Campaign from "./components/Campaign";
import Wellcome from "./components/Wellcome";
import Seller from "./components/Seller";
import Users from "./components/Users";
import Admins from "./components/Admins";
import Reports from "./components/Reports";
import NpsReportDetails from "./components/reports/npsReport/NpsReportDetails";
import StatsReportDetails from "./components/reports/statsReport/StatsReportDetails";

function App() {
  const { user } = useContext(AuthContext);
  const useStyles = makeStyles((theme) => ({
    app: {
      backgroundColor: "#F7F7F7",
    },
  }));

  const classes = useStyles();

  if (!user.user || (user.hasOwnProperty("error") && user.error))
    return <Wellcome />;
  return (
    <BrowserRouter>
      <div className={classes.app}>
        <header>
          <NavBar />
        </header>
        <Route
          path="/"
          render={(props) => {
            if (props.location.state) {
              const { to, to2 } = props.location.state;
              if (to === "sellers") return <Sellers />;
              else if (to === "campaigns") return <Campaigns />;
              else if (to === "users") return <Users />;
              else if (to === "admins") return <Admins />;
              else if (to === "reports") return <Reports />;
              else if (to === "reports/NpsReportDetails")
                return <NpsReportDetails />;
              else if (to === "reports/StatsReportDetails")
                return <StatsReportDetails />;
              else if (to === "campaign") return <Campaign id={ to2 }/>
              else if (to === "seller") return <Seller id={ to2 }/>
              else return <Main />;
            } else if (props.location.hasOwnProperty("to2")) {
              const { to2, id } = props.location;
              localStorage.setItem("lastRoute", to2);
              localStorage.setItem("idSelected", id);
              if (to2 === "campaign") return <Campaign />;
              else if (to2 === "seller") return <Seller />;
              else return <Main user={user.user} />;
            } else if (localStorage.getItem("lastRoute") !== null) {
              const to = localStorage.getItem("lastRoute");
              if (to === "campaign") return <Campaign />;
              else if (to === "seller") return <Seller />;
              else return <Main user={user.user} />;
            } else return <Main user={user.user} />;
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
