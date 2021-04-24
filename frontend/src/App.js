import './App.css';
import * as React from "react";
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import LogInPage from "./pages/LogInPage";
import IndexPage from "./pages/IndexPage";
import ForgottenPass from "./pages/ForgottenPass";


export default class App extends React.Component {
  constructor () {
    super();
    this.state = {
      userRole : "",
      username : "",
      Id : ""
    }
  };
  render() {
    document.title = "Certificates"
    return (
        <BrowserRouter>
          <Switch>
           <Route exact path="/"  render={(props) => <LogInPage {...props} /> } />
           <Route path="/profile" render={(props) => <IndexPage {...props} />} />
           <Route path="/forgotten" render={(props) => <ForgottenPass {...props} />} />
          </Switch>
        </BrowserRouter>
    );
  }
}

