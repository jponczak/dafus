import React, {Component} from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Declaration from "./components/declaration.component";
import DeclarationsList from "./components/declarations-list.component";

class App extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <a href="/tutorials" className="navbar-brand">
            Polish Declarations of Admiration and Friendship for the United States
          </a>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/declarations"} className="nav-link">
                Declarations
              </Link>
            </li>
          </div>
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/declarations"]} component={DeclarationsList} />
            <Route path="/declarations/:id" component={Declaration} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
