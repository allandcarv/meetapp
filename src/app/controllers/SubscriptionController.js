import Meetup from '../models/Meetup';
import File from '../models/File';
import Subscription from '../models/Subscription';
import User from '../models/User';

class SubscriptionController {
  async index(req, res) {
    const subscriptions = await Subscription.findAll({
      where: { user_id: req.userId },
      include: [
        {
          model: Meetup,
          attributes: ['past', 'name', 'description', 'localization', 'date'],
          include: [
            {
              model: User,
              as: 'organizer',
              attributes: ['id', 'name', 'email'],
            },
            {
              model: File,
              as: 'banner',
              attributes: ['id', 'url', 'path'],
            },
          ],
        },
      ],
      attributes: ['id'],
    });

    return res.status(200).json(subscriptions);
  }

  async store(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);

    const checkSubscription = await Subscription.findOne({
      where: { meetup_id: req.params.id },
    });

    const checkDate = await Subscription.findOne({
      where: { user_id: req.userId },
      include: {
        model: Meetup,
        required: true,
        where: {
          date: meetup.date,
        },
        attributes: ['id'],
      },
    });

    if (!meetup) {
      return res.status(404).json({ error: 'Meetup not found. ' });
    }

    if (meetup.user_id === req.userId) {
      return res
        .status(400)
        .json({ error: 'You cannot subscribe to your own meetup.' });
    }

    if (meetup.past) {
      return res
        .status(401)
        .json({ error: 'You cannot subscribe to past Meetups. ' });
    }

    if (checkSubscription) {
      return res
        .status(401)
        .json({ error: 'You have already subscribed to this Meetup.' });
    }

    if (checkDate) {
      return res.status(401).json({
        error:
          'You have already subscribed to another Meetup at the same date and hour. ',
      });
    }

    const subscription = await Subscription.create({
      user_id: req.userId,
      meetup_id: req.params.id,
    });

    return res.status(201).json(subscription);
  }
}

export default new SubscriptionController();
