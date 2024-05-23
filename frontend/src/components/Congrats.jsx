import React from "react";
import { Link } from "react-router-dom";


const Congratulations = () => {
  const validUrl=true;

  return (
    <div className="congratulationsContainer">
      {validUrl ? (
        <div className="congratulationsWrapper">
          <span className="emoji" role="img" aria-label="Party Popper">
            🎉
          </span>
          <span className="title">Congratulations!</span>
          <p>Your email has been successfully verified.</p>
          <p>Now you can explore our platform to the fullest!</p>
          <Link to="/signin" className="loginLink">
            Click Here to Log In!
          </Link>
        </div>
      ) : (
        <h1>404 Not Found</h1>
      )}
    </div>
  );
};

export default Congratulations;