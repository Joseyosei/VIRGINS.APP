import { body } from 'express-validator';

export const registerSchema = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8, max: 100 }).withMessage('Password must be 8-100 characters'),
  body('age').isInt({ min: 18, max: 99 }).withMessage('Must be 18 or older'),
  body('gender').isIn(['Man', 'Woman']).withMessage('Gender must be Man or Woman'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('faith').trim().notEmpty().withMessage('Faith is required'),
];

export const updateProfileSchema = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio must be under 500 characters'),
  body('age').optional().isInt({ min: 18, max: 99 }).withMessage('Must be 18 or older'),
];
