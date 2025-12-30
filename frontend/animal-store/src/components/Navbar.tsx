import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { useCart } from '../context/CartContext'; // Import hook

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const { cart } = useCart(); // Access cart state

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    delete axiosInstance.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-green-600 flex items-center gap-2">
              🐾 PetAdoption
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-green-600 font-medium">Home</Link>
            
            {/* Cart Link */}
            <Link to="/cart" className="relative text-gray-700 hover:text-green-600 font-medium flex items-center">
              <span>Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                  {cart.length}
                </span>
              )}
            </Link>

            {token ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-green-600 font-medium">Dashboard</Link>
                {role === 'admin' && (
                  <Link to="/admin" className="text-gray-700 hover:text-green-600 font-medium">Admin</Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-green-600 font-medium">Login</Link>
                <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;