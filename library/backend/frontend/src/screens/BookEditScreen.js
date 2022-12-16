import React, { useState, useEffect } from "react";
import axios from 'axios'
import { Link } from "react-router-dom";
import { Form, Button} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { useNavigate, useParams } from "react-router-dom";
import { listBookDetails, updateBook } from "../actions/bookActions";
import { BOOK_UPDATE_RESET } from '../constants/bookConstants'


function BookEditScreen() {
  const bookId = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [bookSrc, setBookSrc] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const bookDetails = useSelector((state) => state.bookDetails);
  const { error, loading, book } = bookDetails;
  const bookUpdate = useSelector((state) => state.bookUpdate);
  const { error:errorUpdate, loading:loadingUpdate, success: successUpdate } = bookUpdate;

  useEffect(() => {

    if(successUpdate){
        dispatch({type: BOOK_UPDATE_RESET})
        navigate('/admin/booklist')

    }else{
        if (!book.name || book._id !== Number(bookId.id)) {
            dispatch(listBookDetails(bookId.id));
          } else {
            setName(book.name);
            setPrice(book.price);
            setImage(book.image);
            setBookSrc(book.uploadSrc);
            setBrand(book.brand);
            setCategory(book.category);
            setCountInStock(book.countInStock);
            setDescription(book.description);
          }
    }


    
  }, [dispatch, book, book._id,bookId.id, navigate, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();

    // update book
    dispatch(updateBook({
        _id:bookId.id,
        name,
        price,
        image,
        bookSrc,
        brand,
        category,
        countInStock,
        description

    }

    ))
  };


  const uploadImageHandler = async (e) => {
   const file = e.target.files[0]
   const formData = new FormData()
   formData.append('image', file)
   formData.append('book_id', bookId.id)

   setUploading(true)

   try{
    const config = {
      headers:{
        'Content-Type':'multipart/form-data'
      }
    }

    const {data} = await axios.post('/api/books/upload/image/', formData, config)
    setImage(data)
    // console.log(data)
    setUploading(false)
   }catch(error){
    setUploading(false)
   }
  }
  const uploadFileHandler = async (e) => {
   const file = e.target.files[0]
   const formData = new FormData()
   formData.append('bookSrc', file)
   formData.append('book_id', bookId.id)

   setUploading(true)

   try{
    const config = {
      headers:{
        'Content-Type':'multipart/form-data'
      }
    }

    const {data} = await axios.post('/api/books/upload/file/', formData, config)
    setBookSrc(data)
    // console.log(data)
    setUploading(false)
   }catch(error){
    setUploading(false)
   }
  }

  return (
    <div>
      <Link to="/admin/booklist">Go Back</Link>
      <FormContainer>
        {loadingUpdate && <Loader /> }
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        <h1>Edit Book</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                min="0"
                step=".01"
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.Control
                type="file"
                placeholder="Choose file"
                onChange={uploadImageHandler}
              ></Form.Control>

              {/* <Form.File id='image-file' label='Choose file' custom onChange={uploadFileHandler}>
              </Form.File> */}
             {uploading && <Loader />}
            </Form.Group>
            <Form.Group controlId="booksrc">
              <Form.Label>Book File</Form.Label>
              <Form.Control
                type="text"
                placeholder="upload book file"
                value={bookSrc}
                onChange={(e) => setBookSrc(e.target.value)}
              ></Form.Control>
              <Form.Control
                type="file"
                placeholder="Choose file"
                onChange={uploadFileHandler}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand "
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="countinstock">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                
                type="number"
                placeholder="Enter stock"
                value={countInStock}
                min="1"
                
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            

            

            <Button className="my-3 " type="submit" variant="primary">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </div>
  );
}

export default BookEditScreen;
