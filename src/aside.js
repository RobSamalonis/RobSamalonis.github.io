import React, { Component } from 'react';
import Me from './icons/me.jpg';
import Location from './icons/location.png';
import './aside.css'
// Make it like the aside on this page http://jonbloomer.com.au/
class Aside extends Component {
  render() {
    return (
      <div>
        <img className="me" src={Me} alt="me" />
        <div className="head">
            <h2>Rob Samalonis</h2>
            <h4>Software Engineer - Elsevier</h4>
            <span className="address"><img className="location" src={Location} alt="location" />Philadelphia, PA</span>
        </div>
      </div>
    );
  }
}

export default Aside;
