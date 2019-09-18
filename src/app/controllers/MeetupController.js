import * as Yup from 'yup';
import { isBefore, parseISO } from 'date-fns';

import File from '../models/File';
import Meetup from '../models/Meetup';
import User from '../models/User';

class MeetupController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const meetups = await Meetup.findAll({
      where: {
        user_id: req.userId,
      },
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'name', 'description', 'localization'],
      include: [
        {
          model: File,
          as: 'banner',
          attributes: ['id', 'path', 'url'],
        },
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.status(200).json(meetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      description: Yup.string().required(),
      localization: Yup.string().required(),
      date: Yup.date().required(),
      banner_id: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Data Input Validation Failed. ' });
    }

    const parsedDate = parseISO(req.body.date);
    if (isBefore(parsedDate, new Date())) {
      return res.status(400).json({ error: 'Past dates are not available. ' });
    }

    req.body.user_id = req.userId;

    const meetup = await Meetup.create(req.body);

    return res.json(meetup);
  }
}

export default new MeetupController();
