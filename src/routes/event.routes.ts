import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { authenticate, isEventCreator } from '../middlewares/auth.middleware';
import { validate } from '../validations/validate';
import { eventValidation } from '../validations/event.validation';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - categoryId
 *         - location
 *         - eventDate
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the event
 *         title:
 *           type: string
 *           description: The title of the event
 *         description:
 *           type: string
 *           description: Detailed description of the event
 *         categoryId:
 *           type: integer
 *           description: The category ID the event belongs to
 *         location:
 *           type: string
 *           description: The location of the event
 *         eventDate:
 *           type: string
 *           format: date-time
 *           description: The date and time of the event
 *         maxParticipants:
 *           type: integer
 *           description: Maximum number of participants allowed
 *         currentParticipants:
 *           type: integer
 *           description: Current number of participants
 *         creatorId:
 *           type: integer
 *           description: ID of the user who created the event
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the event was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the event was last updated
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 */
router.get('/', validate(eventValidation.queryEvent, 'query'), EventController.getEvents);

/**
 * @swagger
 * /api/events/{eventId}:
 *   get:
 *     summary: Get a single event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The event ID
 *     responses:
 *       200:
 *         description: Event details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 */
router.get('/:eventId', EventController.getEvent);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - categoryId
 *               - location
 *               - eventDate
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               location:
 *                 type: string
 *               eventDate:
 *                 type: string
 *                 format: date-time
 *               maxParticipants:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  authenticate,
  validate(eventValidation.createEvent),
  EventController.createEvent
);

/**
 * @swagger
 * /api/events/{eventId}:
 *   put:
 *     summary: Update an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *               categoryId:
 *                 type: integer
 *               location:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *               eventDate:
 *                 type: string
 *                 format: date-time
 *               maxParticipants:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the event creator
 *       404:
 *         description: Event not found
 */
router.put(
  '/:eventId',
  authenticate,
  isEventCreator,
  validate(eventValidation.updateEvent),
  EventController.updateEvent
);

/**
 * @swagger
 * /api/events/{eventId}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Event deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the event creator
 *       404:
 *         description: Event not found
 */
router.delete(
  '/:eventId',
  authenticate,
  isEventCreator,
  EventController.deleteEvent
);

/**
 * @swagger
 * /api/events/{eventId}/join:
 *   post:
 *     summary: Join an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The event ID
 *     responses:
 *       200:
 *         description: Successfully joined the event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully joined the event
 *       400:
 *         description: Cannot join event (e.g., event is full, already joined)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 */
router.post(
  '/:eventId/join',
  authenticate,
  EventController.joinEvent
);

/**
 * @swagger
 * /api/events/{eventId}/leave:
 *   delete:
 *     summary: Leave an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The event ID
 *     responses:
 *       200:
 *         description: Successfully left the event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully left the event
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found or not participating
 */
router.delete(
  '/:eventId/leave',
  authenticate,
  EventController.leaveEvent
);

/**
 * @swagger
 * /api/events/{eventId}/participants:
 *   get:
 *     summary: Get event participants
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The event ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of event participants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 participants:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: integer
 *                       status:
 *                         type: string
 *                         enum: [PENDING, CONFIRMED, CANCELLED]
 *                       joinedAt:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       404:
 *         description: Event not found
 */
router.get(
  '/:eventId/participants',
  EventController.getEventParticipants
);

export default router; 