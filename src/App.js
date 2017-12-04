import React, { Component } from 'react';
import Aside from './aside';
import Header from './header';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <aside>
          <Aside />
        </aside>
      </div>
    );
  }
}

export default App;
