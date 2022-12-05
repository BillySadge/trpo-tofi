import React from 'react'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import { Link } from 'react-router-dom'

function Book({ book }) {
  return (
    <Card className="my-3 p-3 rounded">
        <Link to={`/book/${book._id}`}>
          <Card.Img src={book.image} />
        </Link>

        <Card.Body>
          <Link to={`/book/${book._id}`}>
            <Card.Title as="div">
              <strong>{book.name}</strong>
            </Card.Title>
          </Link>

          <Card.Text as="div">
            <div className="my-3">
              <Rating 
                value={book.rating} 
                text={`${book.numReviews} reviews`} 
                color={'#f8e825'}
               />
            </div>
          </Card.Text>

          <Card.Text as="h3">
            ${book.price}
          </Card.Text>
        </Card.Body>
    </Card>
  )
}

export default Book
