import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import Loader from './Loader'
import Message from './Message'
import { listTopBooks } from '../actions/bookActions'

function BookCarousel() {
  const dispatch = useDispatch()
  const bookTopRated = useSelector(state => state.bookTopRated)
  const {error, loading, books} = bookTopRated

  useEffect(() => {
    dispatch(listTopBooks()) 
  },[dispatch])
  return (loading ? <Loader />
  :error ? <Message variant='danger'>{error}</Message>
  :(
    <Carousel pause='hover' className='bg-dark'>
        {books.map(book => (
            <Carousel.Item key={book._id}>
                <Link to={`/book/${book._id}`}> 
                    <Image src={book.image} alt={book.name} fluid/> 
                    <Carousel.Caption className='carousel.caption'>
                        <h4>{book.name} (${book.price})</h4>
                    </Carousel.Caption>
                </Link>
            </Carousel.Item>
        ))}
    </Carousel>
  )
    
  )
}

export default BookCarousel
