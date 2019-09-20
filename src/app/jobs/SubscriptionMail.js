import Mail from '../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { meetup, user } = data;

    await Mail.sendMail({
      to: `${meetup.organizer.name} <${meetup.organizer.email}>`,
      subject: `Nova inscrição em ${meetup.name}`,
      template: 'subscription',
      context: {
        organizer: meetup.organizer.name,
        user: user.name,
        meetup: meetup.name,
      },
    });
  }
}

export default new SubscriptionMail();
