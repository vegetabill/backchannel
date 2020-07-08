import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./style/App.css";
import ChannelPage from "./pages/ChannelPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import CreateChannelPage from "./pages/CreateChannelPage";
import Routes from "./Routes";

function App() {
  return (
    <Router>
      <Switch>
        <Route path={Routes.CREATE_CHANNEL.pattern}>
          <CreateChannelPage />
        </Route>
        <Route path={Routes.JOIN_CHANNEL.pattern}>
          <ChannelPage />
        </Route>
        <Route exact path={Routes.ROOT.pattern}>
          <HomePage />
        </Route>
        <Route path={Routes.NOT_FOUND.pattern}>
          <NotFoundPage />
        </Route>
        <Route path="*">
          <NotFoundPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
