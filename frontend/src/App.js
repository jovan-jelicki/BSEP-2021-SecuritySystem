import './App.css';
import * as React from "react";
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import LogInPage from "./pages/LogInPage";
import IndexPage from "./pages/IndexPage";
import ForgottenPass from "./pages/ForgottenPass";
import UnauthorizedPage from "./helpers/UnauthorizedPage";
// import dompurify from 'dompurify';
// dompurify.sanitize(someMaliciousHTML);
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { PersistGate } from 'redux-persist/integration/react'

const { store, persistor } = configureStore();

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      userRole: "",
      username: "",
      Id: ""
    }
  };

  render() {
    document.title = "Certificates"
    return (

      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <Switch>
              <Route exact path="/" render={(props) => <LogInPage {...props} />} />
              <Route path="/profile" render={(props) => <IndexPage {...props} />} />
              <Route path="/forgotten" render={(props) => <ForgottenPass {...props} />} />
              <Route path="/unauthorized" component={UnauthorizedPage} />
            </Switch>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    )
  }
}

