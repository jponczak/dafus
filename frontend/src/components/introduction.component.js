import React, { Component } from 'react';

import {
    Container,
    makeStyles,
    Typography
  } from "@material-ui/core";
  
  const useStyles = makeStyles({
      root:{
          width:'100%',
          maxWidth: `960px`,
          display: `flex`,
          marginLeft:`auto`,
          marginRight:`auto`,
          marginTop:`2.5em`,
          paddingLeft:`24px`,
          paddingRight:`24px`
        },
    navbarDisplayFlex: {
      display: `flex`
    },
    navListDisplayFlex: {
      display: `flex`
    }

  });

  const Introduction = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Typography variant="body1" gutterBottom>
                DAFUS, which stands for the Declaration of Affection and Friendship for the United States, 
                provides a simple and easy way to look for family and friends signatures from 1926. These signatures
                were originally in more than 100 large volumes, and were given to the United States from Poland as a 
                thank you for assistance during World War 1.
                <br />
                <br />
                The volumes were recently digitized and are available to view within the Library of Congress's website. 
                Unfortunately, searching these digital volumes is time consuming and complicated. This site, funded and created by
                volunteers, is a simple way to seach by a town or district, and easily link to the specific page of signatures 
                within the Library of Congress.
            </Typography>
        </div>
    );
};

  export default Introduction;

// export default class Introduction extends Component {
//     render() {

// }