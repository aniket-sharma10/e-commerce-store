import { Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Orders = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, [currentUser]);

  const fetchOrders = async () => {
    const res = await fetch(`/api/order?userId=${currentUser._id}`);
    const data = await res.json();
    setOrders(data);
  };

  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 my-10">
      <h1 className="text-2xl py-4">Your Orders</h1>

      <div className="overflow-x-scroll w-full table-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300">
        <>
          <Table hoverable className="mt-4">
            <Table.Head>
              <Table.HeadCell>Order Date</Table.HeadCell>
              <Table.HeadCell>Order Id</Table.HeadCell>
              <Table.HeadCell>Shipping Address</Table.HeadCell>
              <Table.HeadCell>Items</Table.HeadCell>
              <Table.HeadCell>Amount (in ₹)</Table.HeadCell>
              <Table.HeadCell>Delivery Status</Table.HeadCell>
              <Table.HeadCell>Payment Status</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {orders.map((order) => (
                <Table.Row key={order._id} className="bg-white">
                  <Table.Cell className="whitespace-nowrap  text-gray-900 ">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell className=" text-gray-900">
                    {order.order_id}
                  </Table.Cell>
                  <Table.Cell className=" text-gray-900">
                    {`${order.address.addressLine1}, ${order.address.addressLine2}, ${order.address.addressLine3}, ${order.address.pincode}`}
                  </Table.Cell>
                  <Table.Cell className=" text-gray-900">
                    {order.products
                      .map((prod) => truncateText(prod.productId.name, 5))
                      .join(", ")}
                  </Table.Cell>
                  <Table.Cell className=" text-gray-900">
                    {order.total_amount}
                  </Table.Cell>
                  <Table.Cell className=" text-gray-900">
                    {order.deliveryStatus}
                  </Table.Cell>
                  <Table.Cell className=" text-green-500">
                    {order.status}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </>
      </div>
    </div>
  );
};

export default Orders;
