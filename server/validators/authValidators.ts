import { body } from 'express-validator';

export const loginSchema = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

export const forgotPasswordSchema = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
];

export const resetPasswordSchema = [
  body('password').isLength({ min: 8, max: 100 }).withMessage('Password must be 8-100 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) throw new Error('Passwords do not match');
    return true;
  }),
];
