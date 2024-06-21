import React from "react";
import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { signOut } from '../../redux/userSlice'

function Header() {
  const {currentUser} = useSelector((state) => state.user)
  const dispatch = useDispatch()
  

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
    <Navbar fluid rounded>
      <Link className="text-base sm:text-xl whitespace-nowrap font-semibold dark:text-white">
        <span className="p-1 bg-gradient-to-tr from-blue-400 via-blue-600 to-blue-800 text-white rounded-lg">
          Shoppers
        </span>
      </Link>

      <div className="flex gap-2 md:order-2">
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block ">@{currentUser.username}</span>
              <span className="block font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={"dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Link to={"/cart"}>
              <Dropdown.Item>Cart</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
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

      <Navbar.Collapse>
        <Navbar.Link href="/" active>
          Home
        </Navbar.Link>
        <Navbar.Link href="/collections/Men">Men's</Navbar.Link>
        <Navbar.Link href="/collections/Women">Women's</Navbar.Link>
        <Navbar.Link href="/collections/Footwear">Footwear</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
