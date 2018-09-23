import React, { Component } from "react";
import Aside from "./aside";
import About from "./about";
import Work from "./work-experience";
import SocialMedia from "./social-media";
import city from "./icons/city.jpg";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="col">
          <Aside />
          <About />
          <Work />
          <SocialMedia />
        </div>
      </div>
    );
  }
}

export default App;
