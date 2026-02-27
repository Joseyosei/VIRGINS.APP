import { Request, Response } from 'express';
import CommunityEvent from '../models/CommunityEvent';

// Seed events so the API returns data even on a fresh DB
const SEED_EVENTS = [
  {
    title: 'Singles Worship Night',
    description: 'An evening of worship and fellowship for faith-minded singles in the community. Light refreshments provided.',
    category: 'worship',
    organizer: 'Grace Community Church',
    location: { address: '1200 Oak St', city: 'Austin', state: 'TX' },
    spotsTotal: 80,
    tags: ['worship', 'singles', 'fellowship'],
    faithTradition: 'Non-Denominational',
    isVirtual: false,
  },
  {
    title: 'Faith & Finances Workshop',
    description: 'Biblical stewardship and financial planning for singles preparing for marriage. Taught by a certified financial counselor.',
    category: 'study',
    organizer: 'Heritage Baptist Church',
    location: { address: '500 Main Ave', city: 'Nashville', state: 'TN' },
    spotsTotal: 40,
    tags: ['finances', 'marriage-prep', 'study'],
    faithTradition: 'Baptist',
    isVirtual: false,
  },
  {
    title: 'Community Service Day',
    description: 'Join fellow believers serving at the local food bank. A great way to meet like-minded people while glorifying God through service.',
    category: 'service',
    organizer: 'City Hope Ministries',
    location: { address: '300 Harvest Blvd', city: 'Dallas', state: 'TX' },
    spotsTotal: 60,
    tags: ['service', 'community', 'volunteering'],
    faithTradition: 'Non-Denominational',
    isVirtual: false,
  },
  {
    title: 'Online Courtship Q&A Panel',
    description: 'Married couples share their courtship journeys. Live Q&A for singles seeking Godly relationship wisdom.',
    category: 'social',
    organizer: 'VIRGINS Community',
    location: { address: '', city: 'Virtual', state: '' },
    spotsTotal: 200,
    tags: ['courtship', 'marriage', 'online'],
    faithTradition: 'Christian',
    isVirtual: true,
    meetingLink: 'https://zoom.us/virgins-panel',
  },
  {
    title: 'Spring Retreat: Covenant Foundations',
    description: 'A weekend retreat exploring biblical foundations of marriage and covenant. Separate men\'s and women\'s tracks available.',
    category: 'retreat',
    organizer: 'Shepherd\'s Valley Retreat Center',
    location: { address: '8000 Valley Rd', city: 'Denver', state: 'CO' },
    spotsTotal: 100,
    tags: ['retreat', 'marriage', 'covenant', 'weekend'],
    faithTradition: 'Evangelical',
    isVirtual: false,
  },
];

async function seedEventsIfEmpty() {
  const count = await CommunityEvent.countDocuments();
  if (count > 0) return;

  const now = Date.now();
  const events = SEED_EVENTS.map((e, i) => ({
    ...e,
    dateTime: new Date(now + (i + 1) * 7 * 24 * 60 * 60 * 1000), // stagger weekly
    endDateTime: new Date(now + (i + 1) * 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
    attendees: [],
  }));

  await CommunityEvent.insertMany(events);
}

// Auto-seed on first import
seedEventsIfEmpty().catch(() => {});

export const listEvents = async (req: Request, res: Response) => {
  try {
    await seedEventsIfEmpty();

    const { category, city, page = 1, limit = 20 } = req.query;
    const filter: any = { dateTime: { $gte: new Date() } };
    if (category && category !== 'all') filter.category = category;
    if (city) filter['location.city'] = { $regex: city as string, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    const [events, total] = await Promise.all([
      CommunityEvent.find(filter)
        .sort({ dateTime: 1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      CommunityEvent.countDocuments(filter),
    ]);

    // Attach spotsLeft to each event
    const enriched = events.map((e: any) => ({
      ...e,
      spotsLeft: Math.max(0, e.spotsTotal - (e.attendees?.length || 0)),
    }));

    res.json({ events: enriched, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch {
    res.status(500).json({ message: 'Failed to load community events' });
  }
};

export const getEvent = async (req: Request, res: Response) => {
  try {
    const event = await CommunityEvent.findById(req.params.id).lean() as any;
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ ...event, spotsLeft: Math.max(0, event.spotsTotal - (event.attendees?.length || 0)) });
  } catch {
    res.status(500).json({ message: 'Failed to load event' });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const event = await CommunityEvent.create({ ...req.body, createdBy: (req as any).userId });
    res.status(201).json(event);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const rsvpEvent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const event = await CommunityEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const isAttending = event.attendees.some((a) => a.toString() === userId);
    if (isAttending) {
      event.attendees = event.attendees.filter((a) => a.toString() !== userId) as any;
      await event.save();
      return res.json({ attending: false, spotsLeft: event.spotsTotal - event.attendees.length });
    }

    if (event.attendees.length >= event.spotsTotal) {
      return res.status(400).json({ message: 'This event is full' });
    }

    event.attendees.push(userId as any);
    await event.save();
    res.json({ attending: true, spotsLeft: event.spotsTotal - event.attendees.length });
  } catch {
    res.status(500).json({ message: 'Failed to RSVP' });
  }
};
