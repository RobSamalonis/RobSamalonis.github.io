import React, { Component } from 'react';
import Aside from './aside';
import About from './about';
import Header from './header';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <aside>
          <Aside />
        </aside>
        <about>
          <About />
        </about>
      </div>
    );
  }
}

export default App;
