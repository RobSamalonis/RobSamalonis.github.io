import React, { Component } from 'react';
import WorkIcon from './icons/work-icon.png';
import './work-experience.css'

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
              <b>Team: </b> <br />
              <b>Technology: </b>
          </p>
          <p className="details">
          Elsevier <br />
          Software Engineer <br />
          Precision Medicine <br />
          Node and React <br />
          </p>
        </div>
      </div>
    );
  }
}

export default Work;
