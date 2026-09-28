import { connectDatabase, disconnectDatabase } from '../config/database';
import { Competition } from '../models/Competition';
import { User } from '../models/User';

const COMPETITION_TITLE = 'Feedants Classical Dance';

async function seed(): Promise<void> {
  await connectDatabase();

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const registrationStart = new Date(now - 2 * day);
  const registrationEnd = new Date(now + 5 * day);
  const submissionStart = new Date(now + 6 * day);
  const submissionEnd = new Date(now + 20 * day);
  const resultDate = new Date(now + 25 * day);

  const competitionDoc = {
    title: COMPETITION_TITLE,
    category: 'Dance',
    tags: ['Multi-Win'],
    description:
      'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.',
    aboutLong:
      'Feedants Classical Dance invites performers of every age and skill level to submit a recorded classical ' +
      'dance performance from anywhere in the world. Entries are judged on technique, expression, and adherence ' +
      'to classical form by an experienced panel. Winners across six positions receive cash rewards and a ' +
      'certificate of achievement.',
    prizePool: 1500,
    entryFee: 99,
    capacity: 20,
    registrationStart,
    registrationEnd,
    submissionStart,
    submissionEnd,
    resultDate,
    certificateAvailable: true,
    judge: {
      name: 'Manju Dubey',
      profession: 'Professional Kathak Dancer',
      experience: '12+ Years of Experience',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
      introVideoUrl: 'https://assets.feedants.com/videos/manju-dubey-intro.mp4',
    },
    previousWinners: [
      { name: 'Riya Shah', position: '1st Winner', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80', videoUrl: 'https://assets.feedants.com/videos/riya-shah.mp4' },
      { name: 'Aarav Mehta', position: '1st Winner', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80', videoUrl: 'https://assets.feedants.com/videos/aarav-mehta.mp4' },
      { name: 'Neha Verma', position: '2nd Winner', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80', videoUrl: 'https://assets.feedants.com/videos/neha-verma.mp4' },
      { name: 'Ishita Chopra', position: '3rd Winner', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80', videoUrl: 'https://assets.feedants.com/videos/ishita-chopra.mp4' },
    ],
    rewards: [
      { position: '1st Winner', title: 'Gold', amount: 550 },
      { position: '2nd Winner', title: 'Silver', amount: 300 },
      { position: '3rd Winner', title: 'Bronze', amount: 240 },
      { position: '4th Winner', title: 'Star', amount: 200 },
      { position: '5th Winner', title: 'Star', amount: 130 },
      { position: '6th Winner', title: 'Star', amount: 80 },
    ],
    judgingParameters: ['Technique', 'Expression', 'Costume & Presentation', 'Adherence to Classical Form', 'Overall Impact'],
    rules: [
      'Only contributions from paid participants will be considered for judging.',
      'One submission per registered participant.',
      'Performance must be between 1 and 5 minutes long.',
      'Submissions must be the participant\u2019s original, unedited performance.',
    ],
    eligibility: ['Open to all age groups.', 'Open to participants worldwide.', 'A valid registration is required before submission.'],
    refundPolicy: 'Entry fees are non-refundable once registration is confirmed, except in case of competition cancellation by Feedants.',
    paymentProvider: 'Razorpay',
    referral: {
      code: 'referral123',
      link: 'https://feedants.com/r/referral123',
      rewardPerSignup: 10,
    },
  };

  const competition = await Competition.findOneAndUpdate(
    { title: COMPETITION_TITLE },
    { $setOnInsert: { registeredCount: 0 }, $set: competitionDoc },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const demoUser = await User.findOneAndUpdate(
    { email: 'demo@feedants.com' },
    { $setOnInsert: { name: 'Demo User', email: 'demo@feedants.com' } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log('[seed] Competition ready:', competition._id.toString(), '-', competition.title);
  console.log('[seed] Demo user ready:', demoUser._id.toString(), '-', demoUser.email);

  await disconnectDatabase();
}

seed()
  .then(() => {
    console.log('[seed] Done.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('[seed] Failed:', err);
    process.exit(1);
  });