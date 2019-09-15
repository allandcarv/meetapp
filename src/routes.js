import { Router } from 'express';
import multer from 'multer';

import authMiddleware from './app/middlewares/auth';

import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

routes.use(authMiddleware);

routes.post('/files', upload.single('file'), (req, res) => res.json());
routes.put('/users', UserController.update);

export default routes;
