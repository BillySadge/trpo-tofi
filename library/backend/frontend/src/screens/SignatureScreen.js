import React, { useEffect, useReducer, useRef, useState } from "react";
import { Row, Col, Button, Modal, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CheckoutSteps from "../components/CheckoutSteps";

import FormContainer from "../components/FormContainer";
import { useNavigate } from "react-router-dom";
import { saveSignature } from "../actions/cartActions";
import { InputGroup } from "react-bootstrap";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";

function SignatureScreen() {
  // const [signatureImg, setSignatureImg] = useState("")
  const [isActive, setIsActive] = useState(false);
  const name = useRef();
  const [isName, setIsName] = useState(false);

  const cart = useSelector((state) => state.cart);
  const { signature } = cart;

  const [signatureImg, setSignatureImg] = useState(signature?.signatureImg);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const checkInput = () => {
    if (name.current.value !== "") {
      setIsName(true);
    }
  };

  useEffect(() => {
    init();
  }, []);
  var canvas,
    ctx,
    flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    w = 0,
    h = 0,
    dot_flag = false;

  let x = "black",
    y = 2;
  function init() {
    canvas = document.getElementById("can");
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;

    canvas.addEventListener(
      "mousemove",
      function (e) {
        findxy("move", e);
      },
      false
    );
    canvas.addEventListener(
      "mousedown",
      function (e) {
        findxy("down", e);
      },
      false
    );
    canvas.addEventListener(
      "mouseup",
      function (e) {
        findxy("up", e);
      },
      false
    );
    canvas.addEventListener(
      "mouseout",
      function (e) {
        findxy("out", e);
      },
      false
    );
  }

  function draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();
  }

  function findxy(res, e) {
    if (res === "down") {
      prevX = currX;
      prevY = currY;
      currX = e.clientX - canvas.offsetLeft;
      currY = e.clientY - canvas.offsetTop;

      flag = true;
      dot_flag = true;
      if (dot_flag) {
        ctx.beginPath();
        ctx.fillStyle = x;
        ctx.fillRect(currX, currY, 2, 2);
        ctx.closePath();
        dot_flag = false;
      }
    }
    if (res === "up" || res === "out") {
      flag = false;
    }
    if (res === "move") {
      if (flag) {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;
        draw();
      }
    }
  }
  function erase() {
    var m = window.confirm("Want to clear");
    if (m) {
      ctx.clearRect(0, 0, w, h);
      document.getElementById("canvasimg").style.display = "none";
    }
  }
  function save() {
    canvas = document.getElementById("can");
    document.getElementById("canvasimg").style.border = "2px solid";
    // var image = new Image()
    // image.src = canvas.toDataURL("image/png");
    var dataURL = canvas.toDataURL("image/png");
    setSignatureImg(dataURL);
    document.getElementById("canvasimg").src = dataURL;
    document.getElementById("canvasimg").style.display = "inline";
  }

  function color(color) {
    // console.log(obj.id)
    switch (color) {
      case "green":
        x = "green";
        break;
      case "blue":
        x = "blue";
        break;
      case "red":
        x = "red";
        break;
      case "yellow":
        x = "yellow";
        break;
      case "orange":
        x = "orange";
        break;
      case "black":
        x = "black";
        break;
      case "white":
        x = "white";
        break;
    }
    if (x === "white") y = 14;
    else y = 2;
  }

  const submitHandler = (e) => {
    e.preventDefault();

    var image = document.getElementById("canvasimg");
    // var dataURL = image.toDataURL("image/png");

    console.log(image);
    setSignatureImg(image.src);
    console.log(signatureImg);
    dispatch(saveSignature({ signatureImg }, name.current.value));
    navigate("/payment");
  };

  return (
    <>
      <CheckoutSteps step1 step2 />
      <h1>Signature</h1>
      <Row>
        <Col md={8}>
          <div className="signature-box">
            <canvas
              className="canvas"
              id="can"
              height="300"
              width="300"
              style={{ border: "2px solid" }}
            ></canvas>

            <img
              id="canvasimg"
              className="canvas"
              src={signatureImg ? signatureImg : ""}
              // style={{
              //     display: "none",
              // }}

              style={signatureImg ? { display: "inline" } : { display: "none" }}
              alt="signatureImg"
            />
          </div>
        </Col>
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>Type your name</InputGroup.Text>
            <Form.Control ref={name} onChange={checkInput} />
          </InputGroup>
          <div>Choose Color</div>
          <div className="color-box">
            <button
              style={{ width: "50px", height: "50px", background: "green" }}
              id="green"
              onClick={() => {
                color("green");
              }}
            ></button>
            <button
              style={{ width: "50px", height: "50px", background: "blue" }}
              id="blue"
              onClick={() => {
                color("blue");
              }}
            ></button>
            <button
              style={{ width: "50px", height: "50px", background: "red" }}
              id="red"
              onClick={() => {
                color("red");
              }}
            ></button>
            <button
              style={{ width: "50px", height: "50px", background: "yellow" }}
              id="yellow"
              onClick={() => {
                color("yellow");
              }}
            ></button>
            <button
              style={{ width: "50px", height: "50px", background: "orange" }}
              id="orange"
              onClick={() => {
                color("orange");
              }}
            ></button>
            <button
              style={{ width: "50px", height: "50px", background: "black" }}
              id="black"
              onClick={() => {
                color("black");
              }}
            ></button>
            <div>Eraser</div>
            {/* <button style={{width:"50px",height:"50px",background:"white"}} id="white" onClick={handleShow}></button> */}

            <button
              style={{ width: "50px", height: "50px", background: "white" }}
              id="white"
              onClick={() => {
                color("white");
              }}
            ></button>
          </div>

          <div className="man-buttons">
            {isName ? (
              <Button
                className="btn-cntrl"
                type="button"
                value="save"
                id="btn"
                size="30"
                onClick={() => {
                  setIsActive(true);
                  save();
                }}
                active
              >
                Save Signature
              </Button>
            ) : (
              <Button
                className="btn-cntrl"
                type="button"
                value="save"
                id="btn"
                size="30"
                onClick={() => {
                  setIsActive(true);
                  save();
                }}
                disabled
              >
                Save Signature
              </Button>
            )}
            {/* <Button
              className="btn-cntrl"
              type="button"
              value="save"
              id="btn"
              size="30"
              onClick={() => {
                setIsActive(true);
                save();
              }}
            >
              Save Signature
            </Button> */}
            <Button
              className="btn-cntrl"
              type="button"
              value="clear"
              id="clr"
              // size="23"
              onClick={() => erase()}
            >
              Clear
            </Button>
            {/* <Button  className="btn-cntrl"
          type="button"
          value="clear"
          id="clr"
          // size="23"
          onClick={() => erase()}
        >Clear</Button> */}
          </div>
        </Col>
      </Row>
      <FormContainer>
        <Form onSubmit={submitHandler}>
          {isActive ? (
            <Button className="my-3 " type="submit" variant="primary" active>
              Submit
            </Button>
          ) : (
            <Button className="my-3 " type="submit" variant="primary" disabled>
              Submit
            </Button>
          )}
        </Form>
      </FormContainer>
      <Row></Row>
    </>
  );
}

export default SignatureScreen;
