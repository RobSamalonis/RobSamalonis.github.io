import React, { Component } from "react";
import WorkIcon from "./icons/work-icon.png";
import "./work-experience.css";

class Work extends Component {
  render() {
    return (
      <div className="work">
        <h4>Current Position</h4>
        <hr />
        <div className="wrapper">
          <p className="job">
            <b>Company: </b> <br />
            <b>Title: </b> <br />
            <b>Technologies: </b>
          </p>
          <p className="details">
            Elsevier <br />
            Software Engineer II
            <br />
            React / Node / AWS / Jenkins
            <br />
            Docker / Cypress / Jest / Redux
            <br />
          </p>
        </div>
      </div>
    );
  }
}

export default Work;
