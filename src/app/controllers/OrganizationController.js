import Meetup from '../models/Meetup';
import File from '../models/File';
import User from '../models/User';

class OrganizationController {
  async index(req, res) {
    const meetups = await Meetup.findAll({
      where: { user_id: req.userId },
      order: ['date'],
      attributes: ['id', 'name', 'description', 'localization', 'date', 'past'],
      include: [
        {
          model: File,
          as: 'banner',
          attributes: ['id', 'url', 'path'],
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
}

export default new OrganizationController();
