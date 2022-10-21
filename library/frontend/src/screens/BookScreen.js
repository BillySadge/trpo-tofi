import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, Image, ListGroup, Button, Card } from "react-bootstrap";
import Rating from "../components/Rating";
import axios from "axios";

function BookScreen({ ...match }) {
  const { id } = useParams();
  const [book, setBook] = useState([]);

  useEffect(() => {
    async function fetchBook() {
      const { data } = await axios.get(`/api/books/${id}`);
      setBook(data);
    }

    fetchBook();
  }, [id]);
  return (
    <div>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>
      <Row>
        <Col md={6}>
          <Image src={book.image} alt={book.name} fluid />
        </Col>

        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{book.name}</h3>
            </ListGroup.Item>

            <ListGroup.Item>
              <Rating
                value={book.rating}
                text={`${book.numReviews} reviews`}
                color={"#f8e825"}
              />
            </ListGroup.Item>

            <ListGroup.Item>Price: ${book.price}</ListGroup.Item>

            <ListGroup.Item>Description: {book.description}</ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>${book.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    <strong>
                      {book.countInStock > 0 ? "In Stock" : "Out of Stock"}
                    </strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <div class="d-grid gap-2">
                  <Button
                    class="btn btn-primary"
                    disabled={book.countInStock === 0}
                    type="button"
                  >
                    ADD TO CART
                  </Button>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default BookScreen;
