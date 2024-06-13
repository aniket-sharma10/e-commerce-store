import React, { useEffect, useState } from "react";
import { Footer } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { HiMail, HiOutlineLocationMarker, HiPhone } from "react-icons/hi";

function Footerr() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/category/getCategories?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setCategories(data);
        } else {
          console.log(data.msg);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, [navigate]);

  return (
    <Footer className="bg-[#f9f9f9] py-10">
      <div className="w-full grid md:grid-cols-5 grid-cols-2 justify-center items-center">
        <div className="md:col-span-2 md:px-10 px-6 h-60 flex flex-col gap-5">
          <Link to={"/"} className="text-2xl font-semibold">
            Shoppers
          </Link>
          <div className="flex flex-col gap-6 text-[#878787] text-sm">
            <p className="flex gap-1 items-center">
              <HiOutlineLocationMarker size={"35"} />
              <span>84 Main Rd E, St Albans VIC 3021, Australia</span>
            </p>
            <p className="flex gap-1 items-center">
              <HiMail size={"25"} />
              <span>contact@shoppers.com</span>
            </p>
            <p className="flex gap-1 items-center">
              <HiPhone size={"25"} />
              <span>+999 8887776</span>
            </p>
          </div>
        </div>
        <div className="px-10 h-60 flex flex-col gap-5">
          <h2 className="text-xl font-semibold">Categories</h2>
          <div className="flex flex-col gap-6 text-[#878787]">
            <ul className="gap-3 flex flex-col">
              {categories &&
                categories.length > 0 &&
                categories.map((cat) => (
                  <li
                    key={cat._id}
                    className="text-base cursor-pointer hover:text-teal-400"
                  >
                    <Link to={`/collections/${cat.name}`}>{cat.name}</Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <div className="px-10 h-60 flex flex-col gap-5">
          <h2 className="text-xl font-semibold">Information</h2>
          <div className="flex flex-col gap-6 text-[#878787]">
            <ul className="gap-3 flex flex-col">
              <li className="text-base cursor-pointer  hover:text-teal-400">
                About Us
              </li>
              <li className="text-base cursor-pointer  hover:text-teal-400">
                Contact Us
              </li>
              <li className="text-base cursor-pointer  hover:text-teal-400">
                Privacy Policy
              </li>
              <li className="text-base cursor-pointer  hover:text-teal-400">
                Terms & Conditions
              </li>
            </ul>
          </div>
        </div>
        <div className="px-10 h-60 flex flex-col gap-5">
          <h2 className="text-xl font-semibold">Useful Links</h2>
          <div className="flex flex-col gap-6 text-[#878787]">
            <ul className="gap-3 flex flex-col">
              <Link
                to={"/dashboard?tab=profile"}
                className="text-base cursor-pointer  hover:text-teal-400"
              >
                My Account
              </Link>
              <Link to={'/orders'} className="text-base cursor-pointer  hover:text-teal-400">
                My Orders
              </Link>
              <li className="text-base cursor-pointer  hover:text-teal-400">
                FAQs
              </li>
              <li className="text-base cursor-pointer  hover:text-teal-400">
                FAQs 2
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Footer>
  );
}

export default Footerr;
