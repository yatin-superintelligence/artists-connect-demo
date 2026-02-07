import { Profile } from '../../../types';

export const LIKES_PROFILES: Profile[] = [
  {
    id: 'l1',
    name: 'Daniel',
    age: 29,
    profileType: 'Artist',

    distance: '2 km away',
    bio: '...',
    images: [
      'https://picsum.photos/seed/dan/600/800',
      'https://picsum.photos/seed/dan2/600/800',
      'https://picsum.photos/seed/dan3/600/800'
    ],
    lastSeen: 'NOW'
  },
  {
    id: 'l2',
    name: 'Chloe',
    age: 26,
    profileType: 'Artist',

    distance: '8 km away',
    bio: '...',
    images: ['https://images.pexels.com/photos/10589285/pexels-photo-10589285.jpeg?auto=compress&cs=tinysrgb&w=800'],
    lastSeen: '10m ago'
  },
  {
    id: 'l3',
    name: 'Sam',
    age: 35,
    profileType: 'Artist',

    distance: '4 km away',
    bio: '...',
    images: [
      'https://picsum.photos/seed/sam/600/800',
      'https://picsum.photos/seed/sam2/600/800'
    ],
    lastSeen: '1h ago'
  },
  {
    id: 'l4',
    name: 'Jade',
    age: 24,
    profileType: 'Artist',

    distance: '1 km away',
    bio: '...',
    images: [
      'https://picsum.photos/seed/jade/600/800',
      'https://picsum.photos/seed/jade2/600/800',
      'https://picsum.photos/seed/jade3/600/800'
    ],
    lastSeen: 'NOW'
  }
];