import './App.css';
import * as React from "react";
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import StartPage from "./pages/StartPage";
import RegistrationPage from "./pages/RegistrationPage";
import ProfilePage from "./pages/ProfilePage";


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
    const role = "Admin";
    const Id = this.state.Id;
    //document.title = "Certificates"
    return (
        <BrowserRouter>
          <Switch>
           <Route exact path="/"  render={(props) => <StartPage {...props} role={role} /> } />
           <Route path="/profile" render={(props) => <ProfilePage {...props}/>}/>
          </Switch>
        </BrowserRouter>
    );
  }
}

