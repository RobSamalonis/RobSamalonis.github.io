import React, { Component } from 'react';
import Me from './me.jpg';
import './aside.css'
// Make it like the aside on this page http://jonbloomer.com.au/
class Aside extends Component {
  render() {
    return (
      <div>
          <img className="me" src={Me} alt="me" />
        <h4>This is my aside</h4>
      </div>
    );
  }
}

export default Aside;
