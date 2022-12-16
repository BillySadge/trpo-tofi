import React, { useEffect, useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../actions/cartActions";
import { useNavigate } from "react-router-dom";

function PaymentScreen() {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress, signature } = cart;
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  // if (!signature.signatureImg || signature.signatureImg === "") {
  //   navigate("/signature");
  // }
  // if (!shippingAddress.address) {
  //   navigate("/shipping");
  // }
  useEffect(() => {
    if (!signature.signatureImg || signature.signatureImg === "") {
      navigate("/signature");
    }
  },[signature.signatureImg])
  const submitHandler = (e) => {
    // if(signature.signatureImg && signature.signatureImg != ""){
      console.log(signature.signatureImg)
      e.preventDefault();
      dispatch(savePaymentMethod(paymentMethod));
      console.log(signature.signatureImg)
      navigate("/placeorder"); 
    // } 
  };
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              label="PayPal or Credit Card"
              id="paypal"
              name="paymentMethod"
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>
        <Button className="my-3" type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
}

export default PaymentScreen;
