import React, { Component } from "react";
import Pagination from "@material-ui/lab/Pagination";
import DeclarationDataService from "../services/declaration.service";
import { Link } from "react-router-dom";

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';


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

    this.state = {
      declarations: [],
      currentDeclaration: null,
      currentIndex: -1,
      searchData: "",
      page: 1,
      count: 0,
      pageSize: 3
    };

    this.pageSizes = [5, 10, 15];
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

    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search"
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
        </div>
        <div className="col-md-6">
          <h4>Declarations List</h4>

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

          <ul className="list-group">
            {declarations &&
              declarations.map((declaration, index) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActiveDeclaration(declaration, index)}
                  key={index}
                >
                  {declaration.location}, {declaration.district}
                </li>
              ))}
          </ul>

        </div>
        <div className="col-md-6">
          {currentDeclaration ? (
            <div>
              <h4>Declaration</h4>
              <div>
                <label>
                  <strong>Location:</strong>
                </label>{" "}
                {currentDeclaration.location}
              </div>
              <div>
                <label>
                  <strong>District:</strong>
                </label>{" "}
                {currentDeclaration.district}
                <label>
                  <strong>Link:</strong>
                </label>{" "}
                <a href={`${currentDeclaration.link}`} target="_blank">{currentDeclaration.link}</a>
                <label>
                  <strong>Volume:</strong>
                </label>{" "}
                {currentDeclaration.volume}
                <label>
                  <strong>Pages:</strong>
                </label>{" "}
                {currentDeclaration.pages}
              </div>
              <div>
              </div>

              <Link
                to={"/delcarations/" + currentDeclaration.id}
                className="badge badge-warning"
              >
                Edit
              </Link>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Declaration...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}