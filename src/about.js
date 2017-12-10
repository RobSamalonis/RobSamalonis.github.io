import React, { Component } from 'react';
import BitMe from './icons/bitme.jpg';
import './about.css'

class About extends Component {
  render() {
    return (
      <div className="about">
        <h4>About Me</h4>
        <hr />
        <p>I'm a recent graduate of Temple University in Philadelphia, now working as a software engineer at Elsevier. 
          Although my core and most recent language is Javascript (working with React and Node), I have also had  
          experience using C, C++ and Java.   
        </p>
      </div>
    );
  }
}

export default About;
