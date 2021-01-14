import React, { Component } from "react";
import Pagination from "@material-ui/lab/Pagination";
import DeclarationDataService from "../services/declaration.service";
import { Link } from "react-router-dom";
import { Container } from 'react-bootstrap'

import { makeStyles } from '@bit/mui-org.material-ui.styles';
import List from '@bit/mui-org.material-ui.list';
import ListItem from '@bit/mui-org.material-ui.list-item';
import Divider from '@bit/mui-org.material-ui.divider';
import ListItemText from '@bit/mui-org.material-ui.list-item-text';
import ListItemAvatar from '@bit/mui-org.material-ui.list-item-avatar';
import Typography from '@bit/mui-org.material-ui.typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  root: {
    width: 360,
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));

export default class DeclarationsList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchCombined = this.onChangeSearchCombined.bind(this);
    this.retrieveDeclarations = this.retrieveDeclarations.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveDeclaration = this.setActiveDeclaration.bind(this);
    //this.searchCombined = this.searchCombined.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);

    this.classes = useStyles;

    this.state = {
      declarations: [],
      currentDeclaration: null,
      currentIndex: -1,
      searchData: "",
      page: 1,
      count: 0,
      pageSize: 10
    };

    this.pageSizes = [10, 50, 100];
  }

  componentDidMount() {
    this.retrieveDeclarations();
  }

  onChangeSearchCombined(e) {
    const searchData = e.target.value;

    this.setState({
      searchData: searchData
    });
  }
  getRequestParams(searchData, page, pageSize) {
    let params = {};

    if (searchData) {
      params["combined"] = searchData;
    }

    if (page) {
      params["page"] = page - 1;
    }

    if (pageSize) {
      params["size"] = pageSize;
    }

    return params;
  }

  retrieveDeclarations() {
    const { searchData, page, pageSize } = this.state;
    const params = this.getRequestParams(searchData, page, pageSize);
    console.log("params: ", params);

    DeclarationDataService.getAll(params)
      .then((response) => {
        const { declarations, totalPages } = response.data;

        this.setState({
          declarations: declarations,
          count: totalPages
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveDeclarations();
    this.setState({
      currentDeclaration: null,
      currentIndex: -1
    });
  }

  setActiveDeclaration(declaration, index) {
    this.setState({
      currentDeclaration: declaration,
      currentIndex: index
    });
  }
  handlePageChange(event, value) {
    this.setState(
      {
        page: value,
      },
      () => {
        this.retrieveDeclarations();
      }
    );
  }

  handlePageSizeChange(event) {
    this.setState(
      {
        pageSize: event.target.value,
        page: 1
      },
      () => {
        this.retrieveDeclarations();
      }
    );
  }

  searchCombined() {
    DeclarationDataService.findByCombined(this.state.searchCombined)
      .then(response => {
        this.setState({
          declarations: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { searchData, declarations, currentDeclaration, currentIndex, page, count, pageSize } = this.state;
    const classes = this.classes;

    return (

      <Container fluid>
          <div className="input-group mb-3">
             <input
               type="text"
               className="form-control"
               placeholder="Search for a town or district ..."
               value={searchData}
               onChange={this.onChangeSearchCombined}
             />
             <div className="input-group-append">
               <button
                 className="btn btn-outline-secondary"
                 type="button"
                 onClick={this.retrieveDeclarations}
               >
                 Search
               </button>
             </div>
           </div>

          <List>
           {declarations &&
               declarations.map((declaration, index) => (
                 <ListItem alignItems="flex-start">
                   <ListItemText
                     primary={declaration.location + ", " + declaration.district} 
                     secondary={
                       <React.Fragment>
                         <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">
                          {declaration.pages.length} pages of signatures found in volume {declaration.volume} 
                         </Typography>
                       </React.Fragment>
                     }
                     onClick={() => this.setActiveDeclaration(declaration, index)}
                   key={index}
                 />
                   <Button variant="outlined" color="primary" href="#outlined-buttons">
                     <a href={declaration.link +'&r=-0.05,0.414,1.063,0.685,0#full-screen'} target="_blank">see the signatures</a>
                   </Button>
                 </ListItem>
               ))}
           </List>
           <div className="mt-3">
                   {"Declarations per Page: "}
                   <select onChange={this.handlePageSizeChange} value={pageSize}>
                     {this.pageSizes.map((size) => (
                       <option key={size} value={size}>
                         {size}
                       </option>
                     ))}
                   </select>

                   <Pagination
                     className="my-3"
                     count={count}
                     page={page}
                     siblingCount={1}
                     boundaryCount={1}
                     variant="outlined"
                     shape="rounded"
                     onChange={this.handlePageChange}
                   />
                 </div>

      </Container>
    );
  }}
