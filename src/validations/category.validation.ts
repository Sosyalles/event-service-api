import Joi from 'joi';
import { Category } from '../types/models';

export interface CreateCategoryDTO extends Omit<Category, 'id' | 'createdAt' | 'updatedAt'> {}
export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {}

export const categoryValidation = {
  createCategory: Joi.object<CreateCategoryDTO>({
    name: Joi.string().required().min(2).max(50).trim()
      .messages({
        'string.empty': 'Category name is required',
        'string.min': 'Category name must be at least 2 characters',
        'string.max': 'Category name cannot exceed 50 characters',
      }),
    description: Joi.string().optional().max(500).trim()
      .messages({
        'string.max': 'Description cannot exceed 500 characters',
      }),
  }),

  updateCategory: Joi.object<UpdateCategoryDTO>({
    name: Joi.string().min(2).max(50).trim(),
    description: Joi.string().max(500).trim(),
  }).min(1)
    .messages({
      'object.min': 'At least one field must be provided for update',
    }),

  // For route parameters
  categoryId: Joi.object({
    categoryId: Joi.number().required().positive()
      .messages({
        'number.base': 'Category ID must be a number',
        'number.positive': 'Category ID must be positive',
      }),
  }),
}; 