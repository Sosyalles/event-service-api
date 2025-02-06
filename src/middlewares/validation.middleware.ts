import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { CreateEventDTO, UpdateEventDTO, EventQueryDTO } from '../types/dto';

const createEventSchema = Joi.object<CreateEventDTO>({
  title: Joi.string().required().min(3).max(100),
  description: Joi.string().required().min(10).max(1000),
  categoryId: Joi.number().required().positive(),
  location: Joi.string().required().min(3).max(100),
  eventDate: Joi.date().iso().required().min('now'),
  maxParticipants: Joi.number().optional().positive(),
});

const updateEventSchema = Joi.object<UpdateEventDTO>({
  title: Joi.string().min(3).max(100),
  description: Joi.string().min(10).max(1000),
  categoryId: Joi.number().positive(),
  location: Joi.string().min(3).max(100),
  eventDate: Joi.date().iso().min('now'),
  maxParticipants: Joi.number().positive(),
}).min(1);

const eventQuerySchema = Joi.object<EventQueryDTO>({
  page: Joi.number().optional().min(1),
  limit: Joi.number().optional().min(1).max(100),
  categoryId: Joi.number().optional().positive(),
  location: Joi.string().optional().min(3).max(100),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional().min(Joi.ref('startDate')),
});

export const validateCreateEvent = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error } = createEventSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }
  next();
};

export const validateUpdateEvent = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error } = updateEventSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }
  next();
};

export const validateEventQuery = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error } = eventQuerySchema.validate(req.query, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }
  next();
}; 