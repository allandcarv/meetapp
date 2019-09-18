import * as Yup from 'yup';
import { isBefore, parseISO } from 'date-fns';

import Meetup from '../models/Meetup';

class MeetupController {
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
