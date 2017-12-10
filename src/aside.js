import React, { Component } from 'react';
import Me from './icons/me.jpg';
import Location from './icons/location.png';
import Mail from './icons/mail.png';
import './aside.css'
// Make it like the aside on this page http://jonbloomer.com.au/
class Aside extends Component {
  render() {
    return (
      <div>
        <img className="me" src={Me} alt="me" />
        <div className="head">
            <h2>Robert Samalonis</h2>
            <h4>Software Engineer</h4>
            <hr />
            <span className="address"><img className="location" src={Location} alt="location" />Philadelphia, PA</span>
            <br />
            <a href="mailto:r.samalonis@elsevier.com"><img className="mailIcon" src={Mail} alt="mail" />r.samalonis@elsevier.com</a>
        </div>
      </div>
    );
  }
}

export default Aside;
