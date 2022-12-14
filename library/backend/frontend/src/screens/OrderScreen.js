import React, { useState, useEffect } from "react";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PayPalButton } from "react-paypal-button-v2";
import Message from "../components/Message";
import Loader from "../components/Loader";
import axios from "axios";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";

const fileDownload = require("js-file-download");

function OrderScreen() {
  const orderId = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sdkReady, setSdkReady] = useState(false);

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  //   const navigate = useNavigate()

  //   console.log(orderId.id)
  if (!loading && !error) {
    order.itemsPrice = order.orderItems
      .reduce((acc, item) => acc + item.price * item.qty, 0)
      .toFixed(2);
  }

  const addPayPalScript = () => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AUw2zgequHsvZdLccgrPVTAkQTPKg64ersnm9szrwjuHZWHLphhV1uHcnBD1hhXfAOhc6ZyRLXE_jRh_";
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };
  //AUw2zgequHsvZdLccgrPVTAkQTPKg64ersnm9szrwjuHZWHLphhV1uHcnBD1hhXfAOhc6ZyRLXE_jRh_

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }

    if (
      !order ||
      successPay ||
      order._id !== Number(orderId.id) ||
      successDeliver
    ) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId.id));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [
    dispatch,
    order,
    orderId.id,
    successPay,
    successDeliver,
    navigate,
    userInfo,
  ]);

  const successPaymentHandler = (paymentResult) => {
    console.log(orderId.id);
    dispatch(payOrder(orderId.id, paymentResult));
  };

  // const deliverHandler = () => {
  //   dispatch(deliverOrder(order));
  // };

  const handlePDFDownload = (order) => {
    order.orderItems.forEach((orderItem) => {
      console.log(orderItem);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      axios
        .get(`/api/orders/${orderItem.order}/deliver`, {
          responseType: "blob",
          ...config,
        })
        .then((res) => {
          fileDownload(res.data, "filename.pdf");
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  // let image = new Image();
  // image.src = `data:image/png;base64,${order.signature.image}`
  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div>
      <h1>Order: {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Signature</h2>
              <p>
                <strong>Name: </strong> {order.user.name}{" "}
              </p>
              <p>
                <strong>Email: </strong>{" "}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>{" "}
              </p>

              <p>
                <strong>Signature: </strong>
                {/* {order.signature?.image} */}
                <img
                  src={`static/images/signatures/signature${order.signature._id}.png`}
                />
                {/* <img src={image ? image: ""} alt="signature image" /> */}
                {/* <img src={image ? image: ""} alt="signature image" /> */}
                {/* {order.shippingAddress?.address}, {order.shippingAddress?.city}{" "}
                {order.shippingAddress?.postalCode},{" "}
                {order.shippingAddress?.country} */}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>

              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>

              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="warning">Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message variant="info">Your order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/book/${item.book}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty + 1} X ${item.price} = $
                          {((item.qty + 1) * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Item: </Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax: </Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total: </Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader size={24} />}

                  {!sdkReady ? (
                    <Loader size={24} />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
            {loadingDeliver && <Loader />}
            {userInfo && order.isPaid && (
              <ListGroup.Item>
                <div className="d-grid gap-2">
                  <Button
                    type="button"
                    className="btn btn-block my-3"
                    onClick={() => handlePDFDownload(order)}
                    // onClick={deliverHandler}
                  >
                    Download
                  </Button>
                </div>
              </ListGroup.Item>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default OrderScreen;
