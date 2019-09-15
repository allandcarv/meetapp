import { Router } from 'express';

import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Allan Carvalho',
    email: 'allandcarv@gmail.com',
    password: '123456',
  });

  return res.status(201).json(user);
});

export default routes;
