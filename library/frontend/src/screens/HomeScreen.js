import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate,useLocation } from 'react-router-dom'
import { Row, Col } from "react-bootstrap";
import Book from "../components/Book";
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listBooks } from "../actions/bookActions";
function HomeScreen() {
  const dispatch = useDispatch();
  const bookList = useSelector((state) => state.bookList);
  const location = useLocation()
  const { error, loading, books } = bookList;
  let keyword = location.search

  useEffect(() => {
    dispatch(listBooks(keyword));
  }, [dispatch, keyword]);

  return (
    <div>
      <h1>Latest Books</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
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
