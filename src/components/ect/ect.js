import React, { Fragment } from "react";

// import the ECT package and style
import * as ECT from "@whoicd/icd11ect";
import "@whoicd/icd11ect/style.css";
import { Component } from "react";
import { Grid, TextField } from "@material-ui/core";

class ECTReactComponent extends Component {
  iNo = 1

  constructor(props) {
    super(props);

    // configure the ECT
    const settings = {
      // the API located at the URL below should be used only for software development and testing
      apiServerUrl: "https://icd11restapi-developer-test.azurewebsites.net",
      autoBind: false, // in React we recommend using the manual binding
    };
    const callbacks = {
      selectedEntityFunction: (selectedEntity) => {
        // shows an alert with the code selected by the user and then clears the search results
        alert("ICD-11 code selected: " + selectedEntity.code);
        ECT.Handler.clear(this.iNo);
      }
    };
    ECT.Handler.configure(settings, callbacks);
  }

  componentDidMount() {
    // manual binding only after the component has been mounted
    ECT.Handler.bind(this.iNo);
  }

  render() {
    return (
      <Fragment>
        {/* input element used for typing the search */}
        <input
          type="text"
          className="ctw-input"
          data-ctw-ino={this.iNo}
        />
        <Grid item xs={12} >
          <TextField 
            id="fullWidth"
            fullWidth
            multiline
            data-ctw-ino={this.iNo}
            label="DIAGNOSTICO CIE-11" />
        </Grid>
        {/* div element used for showing the search results */}
        <div className="ctw-window" data-ctw-ino={this.iNo}></div>
      </Fragment>
    );
  }
}

export default ECTReactComponent;
