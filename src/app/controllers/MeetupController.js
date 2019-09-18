import * as Yup from 'yup';
import { format, isBefore, parseISO, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import File from '../models/File';
import Meetup from '../models/Meetup';
import User from '../models/User';

class MeetupController {
  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);

    if (!meetup) {
      return res.status(404).json({ error: 'Meetup not found. ' });
    }

    if (meetup.past) {
      return res.status(401).json({ error: 'You cannot delete past Meetups' });
    }

    if (meetup.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'You are not the organizer of this Meetup.' });
    }

    await meetup.destroy();

    return res.status(204).send();
  }

  async index(req, res) {
    const { page = 1, date = format(new Date(), 'yyyy-MM-dd') } = req.query;
    const limit = 10;

    const meetups = await Meetup.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay(parseISO(date)), endOfDay(parseISO(date))],
        },
      },
      order: ['date'],
      limit,
      offset: (page - 1) * limit,
      attributes: ['id', 'name', 'description', 'localization', 'date'],
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
      banner_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Data Input Validation Failed. ' });
    }

    const parsedDate = parseISO(req.body.date);
    if (isBefore(parsedDate, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted. ' });
    }

    req.body.user_id = req.userId;

    const {
      id,
      name,
      description,
      localization,
      date,
      banner_id,
      user_id,
    } = await Meetup.create(req.body);

    return res
      .status(201)
      .json({ id, name, description, localization, date, banner_id, user_id });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      description: Yup.string(),
      localization: Yup.string(),
      date: Yup.date(),
      banner_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Data Input Validation Failed. ' });
    }

    if (req.body.date) {
      const parsedDate = parseISO(req.body.date);
      if (isBefore(parsedDate, new Date())) {
        return res
          .status(400)
          .json({ error: 'Past dates are not permitted. ' });
      }
    }

    const meetup = await Meetup.findByPk(req.params.id);

    if (req.userId !== meetup.user_id) {
      return res
        .status(401)
        .json({ error: 'You are not the organizer of this meetup. ' });
    }

    if (meetup.past) {
      return res.status(401).json({ error: 'You cannot edit past Meetups.' });
    }

    const {
      id,
      name,
      description,
      localization,
      date,
      banner_id,
      user_id,
    } = await meetup.update(req.body);

    return res
      .status(200)
      .json({ id, name, description, localization, date, banner_id, user_id });
  }
}

export default new MeetupController();
