import React from "react";
// import { Spinner } from "react-bootstrap";
import PacmanLoader from "react-spinners/PacmanLoader";

function Loader() {
  return (
    // <Spinner
    // animation="border"
    // role="status"
    // style={{
    //     height: '100px',
    //     width: '100px',
    //     margin: 'auto',
    //     display: 'block'
    // }}>
    //     <span className="sr-only">Loading...</span>
    // </Spinner>

    // <div>
    <PacmanLoader
      color="#000000"
      size={25}
      speedMultiplier={2}
      cssOverride={{
        height: "100px",
        width: "100px",
        margin: "auto",
        display: "block",
      }}
    />
    // </div>
  );
}

export default Loader;
