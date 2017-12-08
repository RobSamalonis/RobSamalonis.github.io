import React, { Component } from 'react';
import WorkIcon from './icons/work-icon.png';
import './work-experience.css'

class Work extends Component {
  render() {
    return (
      <div className="work">
        <h4><img className="Work" src={WorkIcon} alt="work" />Work Experience</h4>
        <hr />
        <p>
            Elsevier - 6 months -Software Engineer- Technologies: Javascript - Node and React 
        </p>
      </div>
    );
  }
}

export default Work;
