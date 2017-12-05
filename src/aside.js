import React, { Component } from 'react';
import Me from './me.jpg';
import Location from './location.png';
import Mail from './mail.png'
import './aside.css'
// Make it like the aside on this page http://jonbloomer.com.au/
class Aside extends Component {
  render() {
    return (
      <div>
        <img className="me" src={Me} alt="me" />
        <h2>Robert Samalonis</h2>
        <h4>Software Engineer - Elsevier</h4>
        <hr />
        <span className="address"><img className="location" src={Location} alt="location" />Philadelphia, PA</span>
        <a href="mailto:someone@example.com?Subject=Hello%20again" target="_top" className= "email"><img className="mail" src={Mail} alt="mail" />r.samalonis@elsevier.com</a>
      </div>
    );
  }
}

export default Aside;
