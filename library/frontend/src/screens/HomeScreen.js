import React, {useState, useEffect} from 'react'
import { Row, Col } from 'react-bootstrap'
import Book from '../components/Book'
import axios from 'axios'

function HomeScreen() {
  const [books, setBooks] = useState([])

  useEffect(() => {

    async function fetchBooks(){

      const { data } = await axios.get('/api/books/')
      setBooks(data)
    }

    fetchBooks()
      
  }, [])

  return (
    <div>
        <h1>Latest Books</h1>
        <Row>
            {books.map(book => (
                <Col key={book._id} sm={12} md={6} lg={4} xl={3}>
                    <Book book={book} />
                </Col>
            ))}
        </Row>
    </div>
  )
}

export default HomeScreen
