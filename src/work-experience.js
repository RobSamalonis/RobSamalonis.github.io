import React, { Component } from 'react';
import WorkIcon from './icons/work-icon.png';
import './work-experience.css'

class Work extends Component {
  render() {
    return (
      <div className="work">
        <h4>Current Position</h4>
        <hr />
        <p>
            Elsevier <br />
            Software Engineer <br />
            Precision Medicine <br />
            Working with Node and React
        </p>
      </div>
    );
  }
}

export default Work;
