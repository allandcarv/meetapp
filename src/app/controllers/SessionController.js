import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Data Input Validation Failed.' });
    }

    const user = await User.findOne({ where: { email: req.body.email } });
    const checkPassword = await user.checkPassword(req.body.password);

    if (!user || !checkPassword) {
      return res.status(400).json({ error: 'Wrong User and/or Password.' });
    }

    const { id, name, email } = user;

    return res.status(201).json({
      id,
      name,
      email,
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
