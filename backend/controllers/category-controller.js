import Category from "../models/category-model.js";
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError, UnauthenticatedError } from '../errors/index.js'

export const addCategory = async(req, res) => {
    if(!req.user.isAdmin){
        throw new UnauthenticatedError('Only admins can add new category')
    }
    const category = await Category.create(req.body)
    res.status(StatusCodes.OK).json(category)
}

export const getAllCategories = async(req, res) => {
    if(!req.user.isAdmin){
        throw new UnauthenticatedError('Only admins can add new category')
    }
    const category = await Category.find()
    res.status(StatusCodes.OK).json(category)
}

export const deleteCategory = async(req, res) => {
    if(!req.user.isAdmin){
        throw new UnauthenticatedError('Only admins can delete category')
    }
    const category = await Category.findByIdAndDelete(req.params.catId)
    if(!category){
        throw new NotFoundError('Category not found')
    }
    res.status(StatusCodes.OK).json('Category deleted successfully!')
}

export const updateCategory = async(req, res) =>{ 
    if(!req.user.isAdmin){
        throw new UnauthenticatedError('Only admins can edit category')
    }
    const category = await Category.findByIdAndUpdate(req.params.catId, {...req.body}, {new: true, runValidators: true})
    if(!category){
        throw new NotFoundError('No category found')
    }
    res.status(StatusCodes.OK).json(category)
}