import React, { Component } from 'react';

import './about.css'
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
        <div className="contact">
            <hr />
            <span className="email"><a href="mailto:r.samalonis@elsevier.com" target="_top" className= "email"><img className="mail" src={Mail} alt="mail" /></a></span>
            <span className="linkedin"><a href="https://www.linkedin.com/in/robert-samalonis-4a092a137/" target="_top"><img className="linkedinIcon" src={LinkedIn} alt="linkedin" /></a></span>
            <span className="twitter"><a href="https://twitter.com/rsamalonis" target="_top" className= "twitter"><img className="twitterIcon" src={Twitter} alt="twitter" /></a></span>
            <span className="github"><a href="https://github.com/RobSamalonis" target="_top" className= "github"><img className="githubIcon" src={Github} alt="github" /></a></span>
        </div>
      </div>
    );
  }
}

export default Aside;
