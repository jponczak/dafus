import React from "react";
import { Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';

import Declaration from "./components/declaration.component";
import DeclarationsList from "./components/declarations-list.component";
import Introduction from "./components/introduction.component";


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        DAFUS
      </Link>{' '}
      {new Date().getFullYear()}
      {'. All Rights Reserved.'}
    </Typography>
  );
}

export default function App() {
  return (
    <Container maxWith="md">
      {/* <Box my={4}>
      <Typography variant="h4" component="h1" gutterBottom>
          DAFUS
      </Typography>
 */}
        <Introduction />
        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/declarations"]} component={DeclarationsList} />
            <Route path="/declarations/:id" component={Declaration} />
          </Switch>
        </div>

        <Copyright />

      {/* </Box> */}

    </Container>
  )
}

