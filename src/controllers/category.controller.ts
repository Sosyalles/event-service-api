import { Request, Response, NextFunction } from 'express';
import { Category } from '../models';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../validations/category.validation';
import logger, { addRequestContext } from '../utils/logger';

export class CategoryController {
  static async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('Fetching all categories', { context: addRequestContext(req) });
      const categories = await Category.findAll();
      logger.debug('Categories fetched successfully', { 
        context: addRequestContext(req),
        count: categories.length 
      });
      res.json(ApiResponse.success(categories));
    } catch (error) {
      logger.error('Error fetching categories', { 
        context: addRequestContext(req),
        error 
      });
      next(error);
    }
  }

  static async getCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categoryId = parseInt(req.params.categoryId);
      logger.info('Fetching category by ID', { 
        context: addRequestContext(req),
        categoryId 
      });

      const category = await Category.findByPk(categoryId);
      if (!category) {
        logger.warn('Category not found', { 
          context: addRequestContext(req),
          categoryId 
        });
        throw ApiError.notFound('Category not found');
      }

      logger.debug('Category fetched successfully', { 
        context: addRequestContext(req),
        categoryId 
      });
      res.json(ApiResponse.success(category));
    } catch (error) {
      logger.error('Error fetching category', { 
        context: addRequestContext(req),
        error 
      });
      next(error);
    }
  }

  static async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreateCategoryDTO = req.body;
      logger.info('Creating new category', { 
        context: addRequestContext(req),
        categoryData: data 
      });

      const category = await Category.create(data);
      logger.debug('Category created successfully', { 
        context: addRequestContext(req),
        categoryId: category.id 
      });
      res.status(201).json(ApiResponse.created(category));
    } catch (error) {
      logger.error('Error creating category', { 
        context: addRequestContext(req),
        error 
      });
      next(error);
    }
  }

  static async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const data: UpdateCategoryDTO = req.body;
      logger.info('Updating category', { 
        context: addRequestContext(req),
        categoryId,
        updateData: data 
      });

      const category = await Category.findByPk(categoryId);
      if (!category) {
        logger.warn('Category not found for update', { 
          context: addRequestContext(req),
          categoryId 
        });
        throw ApiError.notFound('Category not found');
      }

      await category.update(data);
      logger.debug('Category updated successfully', { 
        context: addRequestContext(req),
        categoryId 
      });
      res.json(ApiResponse.success(category));
    } catch (error) {
      logger.error('Error updating category', { 
        context: addRequestContext(req),
        error 
      });
      next(error);
    }
  }

  static async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categoryId = parseInt(req.params.categoryId);
      logger.info('Deleting category', { 
        context: addRequestContext(req),
        categoryId 
      });

      const category = await Category.findByPk(categoryId);
      if (!category) {
        logger.warn('Category not found for deletion', { 
          context: addRequestContext(req),
          categoryId 
        });
        throw ApiError.notFound('Category not found');
      }

      await category.destroy();
      logger.debug('Category deleted successfully', { 
        context: addRequestContext(req),
        categoryId 
      });
      res.json(ApiResponse.success({ message: 'Category deleted successfully' }));
    } catch (error) {
      logger.error('Error deleting category', { 
        context: addRequestContext(req),
        error 
      });
      next(error);
    }
  }
} 