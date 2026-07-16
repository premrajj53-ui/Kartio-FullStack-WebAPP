import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './pages/home';
import Footer from './components/footer';
import About from './pages/about';
import ReturnPolicy from './pages/returnPolicy';
import Disclaimer from './pages/disclaimer';
import Login from './pages/login';
import Register from './pages/register';
import ProductDetail from './pages/productDetail';
import Cart from './pages/cart';
import Checkout from './pages/checkout';
import OrderSuccess from './pages/orderSuccess';
import VerifyEmail from './pages/verifyEmail';
import MyOrders from './pages/myOrders';
import AdminDashboard from './pages/adminDashboard';
import AdminProducts from './pages/adminProduct';
import EditProduct from './pages/editProducts';
import AdminOrders from './pages/adminOrders';
import AddProduct from './pages/addProduct';
import AdminUsers from './pages/adminUsers';
import Shop from'./pages/shop';
import SearchResults from './pages/searchResult';
import './styles/global.css';

function App() {
  return (
    <Router>
      <Navbar />
      
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/myOrders" element={<MyOrders />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/admin/Products" element={<AdminProducts />} />
          <Route path="/admin/edit-product/:id" element={<EditProduct />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/addProduct" element={<AddProduct />} />
          <Route path="/shop" element={<Shop/>} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </main>
      
      <Footer />
    </Router>
  );
}     

export default App;