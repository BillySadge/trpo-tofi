import React from "react";
// import { Spinner } from "react-bootstrap";

import BookLoader from "./bookLoader/bookloader";
// import PacmanLoader from "react-spinners/PacmanLoader";

function Loader({size}) {
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
    <>
    <BookLoader
        size={size}
        background={"linear-gradient(135deg, #6066FA, #4645F6)"}
        // desktopSize={"100px"}
        // mobileSize={"60px"}
        textColor={"#4645F6"}
        className="ld-custom"
        text={"Wait a bit..."}
      />
    </>
    // <PacmanLoader
    //   color="#000000"
    //   size={25}
    //   speedMultiplier={2}
    //   cssOverride={{
    //     height: "100px",
    //     width: "100px",
    //     margin: "auto",
    //     display: "block",
    //   }}
    // />
    // </div>
  )
}

export default Loader;
