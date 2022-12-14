import React, { useEffect } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import Message from "../components/Message";
import { addToCart, removeFromCart } from "../actions/cartActions";

function CartScreen() {
  const bookId = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const qty = location.search ? Number(location.search.split("=")[1]) : 1;

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const dispatch = useDispatch();

  // const userDetails = useSelector(state => state.userDetails);
  // const { user } = userDetails;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (bookId.id) {
      dispatch(addToCart(bookId.id, qty));
    }
  }, [dispatch, bookId.id, qty]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    if (userInfo === null || typeof userInfo === "undefined") {
      navigate("/login?redirect=shipping");
    } else if (userInfo !== null) {
      navigate("/signature");
      // navigate('/shipping')
    }

    // navigate('/login?redirect=shipping')
  };
  return (
    <Row>
      <Col md={8}>
        <h1>Library Cart</h1>
        {cartItems.length === 0 ? (
          <Message variant="info">
            You cart is empty <Link to="/">Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.book}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/book/${item.book}`}>{item.name}</Link>
                  </Col>

                  <Col md={2}>${item.price}</Col>

                  <Col md={3}>
                    <h5>
                      {new Date(
                        Date.now() + item.qty * 1000 * 24 * 60 * 60
                      ).toLocaleDateString("be-BY")}
                      {/* {new Date(
                        Date.now() + qty * 1000 * 24 * 60 * 60
                      ).toLocaleDateString("be-BY")} */}
                    </h5>
                  </Col>

                  <Col md={1}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromCartHandler(item.book)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>

      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Items in cart: {cartItems.length}</h2>$
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>

            <ListGroup.Item>
              <div className="d-grid gap-2">
                <Button
                  onClick={checkoutHandler}
                  className="btn btn-primary"
                  type="button"
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
}

export default CartScreen;
