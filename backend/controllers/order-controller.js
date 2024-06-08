import { StatusCodes } from "http-status-codes";
import Order from "../models/order-model.js"
import { NotFoundError, BadRequestError, UnauthenticatedError } from "../errors/index.js";

export const getOrders = async (req, res) => {
    let orders;
    if (req.user.isAdmin) {
        orders = await Order.find().populate('products.productId');
    }
    else {
        orders = await Order.find({ userId: req.user.userId }).populate('userId').populate('products.productId');
    }
    if (!orders) {
        throw new NotFoundError('No orders found!')
    }
    res.status(StatusCodes.OK).json(orders);
};

export const updateDeliveryStatus = async (req, res) => {
    if(!req.user.isAdmin){
        throw new UnauthenticatedError('Only admins can chagne delivery status')
    }
    const { orderId } = req.params;
    const { deliveryStatus } = req.body;

    const validStatuses = ['ordered', 'shipped', 'out for delivery', 'delivered'];
    if (!validStatuses.includes(deliveryStatus)) {
        throw new BadRequestError('Invalid delivery status')
    }

    const order = await Order.findByIdAndUpdate(orderId, {deliveryStatus}, {new: true}).populate('products.productId');
    if(!order){
        throw new NotFoundError('Order not found')
    }
    res.status(StatusCodes.OK).json(order)
}