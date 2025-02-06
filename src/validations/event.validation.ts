import Joi from 'joi';
import { CreateEventDTO, UpdateEventDTO, EventQueryDTO } from '../types/dto';

export const eventValidation = {
  createEvent: Joi.object<CreateEventDTO>({
    title: Joi.string().required().min(3).max(100).trim()
      .messages({
        'string.empty': 'Title is required',
        'string.min': 'Title must be at least 3 characters',
        'string.max': 'Title cannot exceed 100 characters',
      }),
    description: Joi.string().required().min(10).max(1000).trim()
      .messages({
        'string.empty': 'Description is required',
        'string.min': 'Description must be at least 10 characters',
        'string.max': 'Description cannot exceed 1000 characters',
      }),
    categoryId: Joi.number().required().positive()
      .messages({
        'number.base': 'Category ID must be a number',
        'number.positive': 'Category ID must be positive',
      }),
    location: Joi.string().required().min(3).max(100).trim()
      .messages({
        'string.empty': 'Location is required',
        'string.min': 'Location must be at least 3 characters',
        'string.max': 'Location cannot exceed 100 characters',
      }),
    eventDate: Joi.date().iso().required().min('now')
      .messages({
        'date.base': 'Event date must be a valid date',
        'date.min': 'Event date must be in the future',
      }),
    maxParticipants: Joi.number().optional().positive()
      .messages({
        'number.positive': 'Maximum participants must be positive',
      }),
  }),

  updateEvent: Joi.object<UpdateEventDTO>({
    title: Joi.string().min(3).max(100).trim(),
    description: Joi.string().min(10).max(1000).trim(),
    categoryId: Joi.number().positive(),
    location: Joi.string().min(3).max(100).trim(),
    eventDate: Joi.date().iso().min('now'),
    maxParticipants: Joi.number().positive(),
  }).min(1),

  queryEvent: Joi.object<EventQueryDTO>({
    page: Joi.number().optional().min(1)
      .messages({
        'number.min': 'Page must be greater than 0',
      }),
    limit: Joi.number().optional().min(1).max(100)
      .messages({
        'number.min': 'Limit must be greater than 0',
        'number.max': 'Limit cannot exceed 100',
      }),
    categoryId: Joi.number().optional().positive(),
    location: Joi.string().optional().min(3).max(100).trim(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional().min(Joi.ref('startDate'))
      .messages({
        'date.min': 'End date must be after start date',
      }),
  }),
}; 