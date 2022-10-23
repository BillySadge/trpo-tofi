import { Container } from 'react-bootstrap'
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'

import HomeScreen from './screens/HomeScreen'  
import BookScreen from './screens/BookScreen'  
import CartScreen from './screens/CartScreen'  

function App() {
  return (
    <Router>
      <Header />
      <main className="py-5">
        <Container>
          <Routes>
            <Route exact path='/' element={<HomeScreen />} />
            <Route path='/book/:id' element={<BookScreen />} />
            <Route path='/cart/:id?' element={<CartScreen />} />
          </Routes>
        </Container>
        
      </main>
      <Footer />
    </Router>
  );
}

export default App;
