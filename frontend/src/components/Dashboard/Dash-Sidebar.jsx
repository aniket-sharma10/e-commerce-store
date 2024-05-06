import { Sidebar } from "flowbite-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  HiArrowSmRight,
  HiChartPie,
  HiShoppingBag,
  HiUser,
  HiUserGroup,
} from "react-icons/hi";
import { FaLayerGroup } from "react-icons/fa6";
import { toast } from "react-toastify";
import { signOut } from '../../redux/userSlice'

function DashSidebar() {
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("");
  const location = useLocation();
  const dispatch = useDispatch();

  const handleSignout = async () => {
    try {
      const res = await fetch(`/api/user/signout`, {
        method: "POST",
      });
      const data = await res.json();
      if(res.ok){
        dispatch(signOut())
      }
      else{
        return toast.error(data.msg)
      }
    } catch (error) {
      return toast.error(error.message);
    }
  };

  return (
    <Sidebar className="w-full md:w-64">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {currentUser.isAdmin && (
            <Link to={"/dashboard?tab=dash"}>
              <Sidebar.Item
                active={tab === "dash" || !tab}
                icon={HiChartPie}
                as="div"
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          <Link to={"/dashboard?tab=profile"}>
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.isAdmin && (
            <Sidebar.Collapse icon={HiShoppingBag} label="Products" >
              <Link to={"/dashboard?tab=addProduct"}>
              <Sidebar.Item
                active={tab === "addProduct"}
                icon={HiShoppingBag}
                as="div"
              >
                Add a product
              </Sidebar.Item>
            </Link>
            </Sidebar.Collapse>
          )}
          {currentUser.isAdmin && (
            <Link to={"/dashboard?tab=category"}>
              <Sidebar.Item
                active={tab === "category"}
                icon={FaLayerGroup}
                as="div"
              >
                Categories
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to={"/dashboard?tab=users"}>
              <Sidebar.Item
                active={tab === "users"}
                icon={HiUserGroup}
                as="div"
              >
                Users
              </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default DashSidebar;
