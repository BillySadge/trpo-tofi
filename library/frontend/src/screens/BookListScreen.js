import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { register } from "../actions/userActions";
import { useLocation, useNavigate } from "react-router-dom";
import { listBooks } from '../actions/bookActions'

function BookListScreen() {
    const dispatch = useDispatch()
 
    const navigate = useNavigate()
    const bookList = useSelector(state => state.bookList)
    const {loading, error, books} = bookList
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        if(userInfo && userInfo.isAdmin){
            
            dispatch(listBooks())
        }else{
            navigate('/login')
        }
    },[dispatch, navigate, userInfo])


    const deleteHandler = (id) => {
        // console.log(id)
        if(window.confirm('Are you sure you want to delete this book?')){

          //
        }
    }

    const createBookHandler = (book) => {
        // create book
    }

  return (
    <div>
      <Row className='align-items-center'>
            <Col>
                <h1>Books</h1>
            </Col>
            <Col className='text-right create-btn'>
                <Button className='my-3'  onClick={createBookHandler}>
                    <i className="fas fa-plus"></i>  Create Book
                </Button>
            </Col>
      </Row>
      {loading 
      ? <Loader />
      : error
      ?( <Message variant='danger'>{error}</Message> )
    :(
        <Table striped bordered hover responsive className='table-sm'>
            <thead>
                <tr> 
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
                </tr>
            </thead>

            <tbody>
                {books.map(book => (
                    <tr key={book._id}>
                        <td>{book._id}</td>
                        <td>{book.name}</td>
                        <td>${book.price}</td>
                        <td>{book.category}</td>
                        <td>{book.brand}</td>

                        <td>
                            <LinkContainer to={`/admin/book/${book._id}/edit`}>
                                <Button variant='light' className="btn-sm">
                                <i className="fas fa-edit"></i>
                                </Button>
                            </LinkContainer>
                            <Button variant='danger' className="btn-sm" onClick={() => deleteHandler(book._id)}>
                                <i className="fas fa-trash"></i>
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )}
    </div>
  )
}

export default BookListScreen
