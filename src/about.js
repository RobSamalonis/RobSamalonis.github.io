import React, { Component } from "react";
import BitMe from "./icons/bitme.jpg";
import "./about.css";

class About extends Component {
  render() {
    return (
      <div className="about">
        <h4>About Me</h4>
        <hr />
        <p>
          I am a Temple University alumni who earn a bachelor's in computer
          science, and currently a full stack software engineer at Elsevier.
          Experience wise, I have had 6 years academically, along with 1 year
          professionally. Although I'm mainly a Javascript developer (React /
          React Native / Node), I have also had experience with C, C++, and
          Java.
        </p>
      </div>
    );
  }
}

export default About;
