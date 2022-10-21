import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Book from "../components/Book";
import { listBooks } from "../actions/bookActions";
function HomeScreen() {
  const dispatch = useDispatch();
  const bookList = useSelector((state) => state.bookList);

  const { error, loading, books } = bookList;

  useEffect(() => {
    dispatch(listBooks());
  }, [dispatch]);

  return (
    <div>
      <h1>Latest Books</h1>
      {loading ? (
        <h2>Loading....</h2>
      ) : error ? (
        <h3>{error}</h3>
      ) : (
        <Row>
          {books.map((book) => (
            <Col key={book._id} sm={12} md={6} lg={4} xl={3}>
              <Book book={book} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default HomeScreen;
