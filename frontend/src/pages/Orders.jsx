import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Orders = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const res = await fetch(`/api/order?userId=${currentUser._id}`);
            const data = await res.json();
            setOrders(data);
        };

        fetchOrders();
    }, [currentUser]);

    return (
        <div>
            <h1>Your Orders</h1>
            {orders.length > 0 ? (
                orders.map(order => (
                    <div key={order._id}>
                        <p>Order ID: {order.order_id}</p>
                        <p>Status: {order.status}</p>
                        <p>Total Amount: {order.total_amount}</p>
                        {/* Render more order details as needed */}
                    </div>
                ))
            ) : (
                <p>No orders found</p>
            )}
        </div>
    );
};

export default Orders;
