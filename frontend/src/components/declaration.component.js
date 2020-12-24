import React, { Component } from "react";
import DeclarationDataService from "../services/declaration.service";

export default class Declaration extends Component {
    constructor(props) {
        super(props);
        this.onChangeLocation = this.onChangeLocation.bind(this);
        this.getDeclaration = this.getDeclaration.bind(this);

    this.state = {
        currentDeclaration: {
            id: null,
            location: "",
            district: "",
            volume: "",
            pages: "",
            link: ""
        },
        message: ""
    };
  }
  componentDidMount() {
      this.getDeclaration(this.props.match.params.id);
  }

  onChangeLocation(e) {
    const location = e.target.value;

    this.setState(function(prevState) {
      return {
        currentDeclaration: {
          ...prevState.currentDeclaration,
          location: location
        }
      };
    });
  }
  getDeclaration(id) {
    DeclarationDataService.get(id)
      .then(response => {
        this.setState({
          currentDeclaration: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentDeclaration } = this.state;

    return (
      <div>
        {currentDeclaration ? (
          <div className="edit-form">
            <h4>Declaration</h4>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Declaration...</p>
          </div>
        )}
      </div>
    );
  }
}

