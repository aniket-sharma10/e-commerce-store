import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Select, Spinner } from "flowbite-react";
import { Link } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/cart`);
        const data = await res.json();
        if (res.ok) {
          setCartItems(data.items);
          setLoading(false);
        } else {
          setLoading(false);
          return toast.error("Failed to fetch cart");
        }
      } catch (error) {
        setLoading(false);
        console.log(error.message);
      }
    };
    fetchCart();
  }, []);

  const updateQuantity = async (productId, quantity) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cart`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json();
      if (res.ok) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          )
        );
        setLoading(false);
      } else {
        setLoading(false);
        return toast.error(data.msg);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const handleDelete = async (productId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cart`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (res.ok) {
        setCartItems((prev) =>
          prev.filter((item) => item.productId !== productId)
        );
        setLoading(false);
      } else {
        setLoading(false);
        return toast.error(data.msg);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const getTotalPrice = () => {
    return cartItems
      .reduce((total, item) => {
        return total + item.prod.price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  if (loading) {
    return (
      <div className="w-full p-4 min-h-screen flex justify-center items-center">
        <Spinner size={"xl"} />
        <p className="ml-2 text-2xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-6xl p-6 sm:p-10 my-10 mx-auto bg-white">
      <div className="border-b">
        <h2 className="text-3xl py-2">Shopping Cart</h2>
        <p className="flex justify-end pr-4">Price</p>
      </div>
      {!loading &&
        cartItems &&
        cartItems.map((item, index) => (
          <div key={index} className="border-b p-1 sm:p-3">
            <div className="grid gap-2 grid-cols-3 sm:grid-cols-4 items-center">
              <Link
                to={`/product/${item.productId}`}
                className="w-32 sm:w-44 h-32 sm:h-44 pr-1 flex items-center"
              >
                <img
                  src={item.prod.images[0]}
                  className="object-contain w-full h-full"
                />
              </Link>
              <div className="col-span-2 sm:col-span-3 pl-1">
                <div className="flex flex-col">
                  <h3 className="hover:text-teal-600 cursor-pointer text-xl">
                    <Link to={`/product/${item.productId}`}>
                      {item.prod.name}
                    </Link>
                  </h3>
                  <div className="flex justify-between mt-3">
                    <Select
                      defaultValue={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.productId, e.target.value)
                      }
                    >
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Qty: {i + 1}
                        </option>
                      ))}
                    </Select>
                    <span className="text-xl my-auto">
                      <span className="text-lg">₹</span>
                      {item.prod.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex  justify-between mt-10">
                    <p
                      className="text-red-600 hover:underline cursor-pointer"
                      onClick={() => handleDelete(item.productId)}
                    >
                      Remove from cart
                    </p>
                    <h3 className="text-xl self-end">
                      Subtotal: <span className="text-lg">₹</span>
                      {(item.prod.price.toFixed(2) * item.quantity).toFixed(2)}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      <div className="flex justify-end text-2xl mt-3">
        <h3 className="text-2xl">
          Total({cartItems.length} items) : <span className="text-xl">₹</span>
          {getTotalPrice()}
        </h3>
      </div>
    </div>
  );
}

export default Cart;
