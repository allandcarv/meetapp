import { Router } from 'express';
import multer from 'multer';

import authMiddleware from './app/middlewares/auth';

import multerConfig from './config/multer';

import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import OrganizationController from './app/controllers/OrganizationController';
import SessionController from './app/controllers/SessionController';
import SubscriptionController from './app/controllers/SubscriptionController';
import UserController from './app/controllers/UserController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

routes.use(authMiddleware);

routes.post('/files', upload.single('file'), FileController.store);
routes.delete('/meetups/:id', MeetupController.delete);
routes.get('/meetups', MeetupController.index);
routes.post('/meetups', MeetupController.store);
routes.put('/meetups/:id', MeetupController.update);
routes.get('/meetups/organization', OrganizationController.index);
routes.get('/meetups/subscriptions', SubscriptionController.index);
routes.post('/meetups/:id/subscribe', SubscriptionController.store);
routes.put('/users', UserController.update);

export default routes;
