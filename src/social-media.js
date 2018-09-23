import React, { Component } from "react";
import Mail from "./icons/mail.png";
import LinkedIn from "./icons/linkedin.png";
import Twitter from "./icons/twitter.png";
import Github from "./icons/github.png";
import "./social-media.css";

class SocialMedia extends Component {
  render() {
    return (
      <div className="media">
        <h4>Social Media</h4>
        <hr />
        <a href="mailto:r.samalonis@elsevier.com">
          <img className="mailIcon" src={Mail} alt="mail" />
        </a>
        <a href="https://www.linkedin.com/in/robert-samalonis-4a092a137/">
          <img className="linkedinIcon" src={LinkedIn} alt="linkedin" />
        </a>
        <a href="https://twitter.com/rsamalonis">
          <img className="twitterIcon" src={Twitter} alt="twitter" />
        </a>
        <a href="https://github.com/RobSamalonis">
          <img className="githubIcon" src={Github} alt="github" />
        </a>
      </div>
    );
  }
}

export default SocialMedia;
