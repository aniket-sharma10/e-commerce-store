import React, { useState, useEffect } from "react";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { signOut } from '../../redux/userSlice'
import { FaShoppingCart, FaSearch } from 'react-icons/fa'

function Header() {
  const {currentUser} = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [cartItems, setCartItems] = useState([])
  
  const getLinkClass = (path) => {
    return location.pathname === path ? 'text-teal-500 font-semibold' : 'text-gray-700 hover:text-teal-500'
  }

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`/api/cart`);
        const data = await res.json();
        if (res.ok) {
          setCartItems(data.items || []);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchCart();
  }, [location.pathname]); // Refetch when route changes

  const handleSignout = async() => {
    try {
      const res = await fetch(`/api/user/signout`, {
        method: "POST"
      })
      const data = await res.json()
      if(res.ok){
        dispatch(signOut())
      }
      else{
        return toast.error(data.msg)
      }
    } catch (error) {
      return toast.error(error.message)
    }
  }


  return (
    <Navbar fluid rounded className="bg-white shadow-md sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Link to={'/'} className="flex items-center">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text">
            Shoppers
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4 md:order-2">

        <Link to="/cart" className="relative">
          <FaShoppingCart className="w-6 h-6 text-gray-700 hover:text-teal-500" />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </Link>

        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar 
                alt="user" 
                img={currentUser.profilePicture} 
                rounded 
                className="cursor-pointer rounded-full hover:ring-2 hover:ring-teal-500 transition-all"
              />
            }
          >
            <Dropdown.Header>
              <span className="block font-semibold">@{currentUser.username}</span>
              <span className="block text-sm text-gray-500 truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={"dashboard?tab=profile"}>
              <Dropdown.Item className="hover:bg-teal-50">Profile</Dropdown.Item>
            </Link>
            <Link to={"/cart"}>
              <Dropdown.Item className="hover:bg-teal-50">Cart</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item 
              onClick={handleSignout}
              className="text-red-500 hover:bg-red-50"
            >
              Sign Out
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to={"/signin"}>
            <Button outline gradientDuoTone="pinkToOrange">
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>

      <Navbar.Collapse className="mt-2 md:mt-0">
        <Link to="/" className={`${getLinkClass('/')} transition-colors duration-200`}>
          Home
        </Link>
        <Link to="/collections/Men" className={`${getLinkClass('/collections/Men')} transition-colors duration-200`}>
          Men's
        </Link>
        <Link to="/collections/Women" className={`${getLinkClass('/collections/Women')} transition-colors duration-200`}>
          Women's
        </Link>
        <Link to="/collections/Footwear" className={`${getLinkClass('/collections/Footwear')} transition-colors duration-200`}>
          Footwear
        </Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
