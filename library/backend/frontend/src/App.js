import { Container } from "react-bootstrap";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import HomeScreen from "./screens/HomeScreen";
import BookScreen from "./screens/BookScreen";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import BookListScreen from "./screens/BookListScreen";
import OrderListScreen from "./screens/OrderListScreen";
import BookEditScreen from "./screens/BookEditScreen";
import SignatureScreen from "./screens/SignatureScreen";

function App() {
  return (
    <Router>
      <Header />
      <main className="py-5">
        <Container>
          <Routes>
            <Route exact path="/" element={<HomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/shipping" element={<ShippingScreen />} />
            <Route path="/signature" element={<SignatureScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route path="/order/:id" element={<OrderScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            <Route path="/book/:id" element={<BookScreen />} />
            {/* TODO FIND THE SOLUTION TO REPLACE WILD CARD WITHOUT DOUBLE RENDERING */}
            {/* <Route path="/cart/*" element={<CartScreen />} /> */}
            {/* <Route path='/cart/:id?' element={<CartScreen />} /> */}
            <Route path="/cart/:id" element={<CartScreen />} />
            <Route path="/cart" element={<CartScreen />} />

            <Route path="/admin/userlist" element={<UserListScreen />} />
            <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />

            <Route path="/admin/booklist" element={<BookListScreen />} />
            <Route path="/admin/book/:id/edit" element={<BookEditScreen />} />

            <Route path="/admin/orderlist" element={<OrderListScreen />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
