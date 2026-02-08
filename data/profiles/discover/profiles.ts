
import { Profile } from '../../../types';

export const DISCOVER_PROFILES: Profile[] = [
  {
    id: 'l2', // Chloe's ID from likes data
    name: 'Chloe',
    age: 26,
    profileType: 'Artist',

    distance: '8 km away',
    bio: 'My life is a constant composition, a melody found in the chaos of the city streets and the silence of a darkroom. As a vocalist and songwriter, I chase the raw, unpolished emotions that most people try to hide, turning heartbreak into harmonies and secrets into lyrics. When I’m not behind a microphone, you’ll find me with a camera in hand, capturing the fleeting, gritty elegance of fashion in motion. I thrive on moments that feel like a live performance, ones that are unrehearsed, electric, and impossible to ignore. Open to collaborations that are as radical as they are real.',
    images: ['https://images.pexels.com/photos/10589285/pexels-photo-10589285.jpeg?auto=compress&cs=tinysrgb&w=800'],
    isVerified: false,
    artistTypes: ['Vocalist', 'Songwriter', 'Fashion photographer'],
    interests: ['Coffee', 'Vinyl records', 'Jazz', 'Travel', 'Vintage fashion', 'Classic cars'],
    hiddenBio: 'I can recite the entire script of Pulp Fiction.',
    lastSeen: '10m ago'
  },
  {
    id: 'd1',
    name: 'Rocky',
    age: 24,
    profileType: 'Artist',

    distance: '1 km away',
    bio: 'I see the world not as it is, but as a canvas of infinite texture and color waiting to be disrupted. As a painter and mixed-media artist, I am obsessed with the layers beneath the surface, especially the hidden strokes of personality that define who we really are. My photography is an extension of this curiosity, freezing moments of vulnerability and strength in equal measure. I believe in connections that challenge perspective, collaborations that are as fluid and complex as the oils I mix. Exploring the gallery of our minds to create a masterpiece of shared experience is what I aim for.',
    images: ['https://images.pexels.com/photos/23915302/pexels-photo-23915302.jpeg?auto=compress&cs=tinysrgb&w=800'],
    isVerified: false,
    artistTypes: ['Painter (oil)', 'Mixed-media artist', 'Photographer'],
    interests: ['Photography', 'Music festivals', 'Travel', 'Psychology', 'Art', 'Meditation'],
    hiddenBio: 'I have a secret collection of vintage cameras and a love for midnight city walks.',
    lastSeen: 'NOW'
  },
  {
    id: 'd2',
    name: 'Moon',
    age: 28,
    profileType: 'Artist',

    distance: '1 km away',
    bio: 'I am a weaver of words and a breaker of codes, existing in the liminal spaces where technology meets the human soul. My art is performance, a digital poetry that challenges the boundaries of perception and thought. I am here to disrupt the algorithm of your daily life, to introduce a glitch of pure, chaotic beauty. As a writer and tech artist, I value the narrative over the norm, and I look for partners who are willing to rewrite the script with me. Deconstructing the expected to build a new language of expression is my mission.',
    images: ['https://images.pexels.com/photos/28973978/pexels-photo-28973978.jpeg?auto=compress&cs=tinysrgb&w=800'],
    isVerified: false,
    artistTypes: ['Poet', 'Performance + tech artist', 'Writer'],
    interests: ['Gaming', 'Social justice', 'Poetry', 'Crochet', 'Digital art', 'Tabletop RPGs'],
    hiddenBio: 'I write poetry about the apocalypse and I make really good sourdough bread.',
    lastSeen: '2h ago'
  },
  {
    id: 'd3',
    name: 'Liam',
    age: 28,
    profileType: 'Artist',

    distance: '2 km away',
    bio: 'To me, architecture is more than just shelter; it is the physical manifestation of tension, balance, and the interplay of light and shadow. I design spaces that breathe, and I live my life with the same intention: seeking the perfect structural integrity in a chaotic world. Whether I’m drafting a skyline-changing concept or hiking a rugged trail, I am searching for the foundation of something real. I value connections that have weight, a partnership built on solid ground but designed to reach for the sky. Building something enduring, with clean lines and deep foundations, is what I strive for.',
    images: ['https://images.pexels.com/photos/6322368/pexels-photo-6322368.jpeg?auto=compress&cs=tinysrgb&w=800'],
    isVerified: false,
    artistTypes: ['Interior designer', 'Spatial designer', 'Architect'],
    interests: ['Architecture', 'Hiking', 'Coffee', 'Interior design', 'Woodworking', 'Camping', 'Nature'],
    hiddenBio: 'My dream is to design a sustainable community in the mountains.',
    lastSeen: '1D'
  },
  {
    id: 'd4',
    name: 'Sophia',
    age: 27,
    profileType: 'Artist',

    distance: '4 km away',
    bio: 'My home is wherever my laptop opens and the light hits just right. As a digital artist and travel photographer, I collect horizons like others collect souvenirs, stitching together a tapestry of cultures, colors, and digital dreams. I live for the gradient of a sunset in a new city and the stories hidden in the faces of strangers. Always inspired by fellow nomads, those who find inspiration in the unknown and see every departure as a new beginning. Turning the world into a studio to make every destination a work of art is how I live.',
    images: ['https://images.pexels.com/photos/5428667/pexels-photo-5428667.jpeg?auto=compress&cs=tinysrgb&w=800'],
    isVerified: false,
    artistTypes: ['Digital artist', 'Travel photographer', 'Blogger'],
    interests: ['Yoga', 'Travel', 'Language learning', 'Cultural exploration', 'Digital nomad lifestyle', 'Photography', 'Cooking'],
    hiddenBio: 'I speak four languages fluently.',
    lastSeen: '3h ago'
  },
  {
    id: 'd5',
    name: 'Maya',
    age: 25,
    profileType: 'Artist',

    distance: '6 km away',
    bio: 'I exist in the frequencies you feel in your chest before you hear them. As a DJ and sound engineer, I am a master of the invisible architecture of sound, sculpting moods with bass and crafting atmospheres with rhythm. My world is loud, vibrant, and driven by the beat of the underground. I resonate with those who can dance through the noise, who understand that silence is just another drop waiting to happen. If you can vibrate on that level, mixing our signals to create a track that never ends is the plan.',
    images: ['https://images.pexels.com/photos/14912840/pexels-photo-14912840.jpeg?auto=compress&cs=tinysrgb&w=800'],
    isVerified: false,
    artistTypes: ['DJ', 'Music producer', 'Sound engineer'],
    interests: ['Music', 'Vinyl records', 'Concerts', 'Raves', 'Electronic music', 'Night photography', 'Music festivals'],
    hiddenBio: 'I have a secret tattoo that only matches with my mood.',
    lastSeen: '5h ago'
  },
  {
    id: 'd6',
    name: 'Ethan',
    age: 31,
    profileType: 'Artist',

    distance: '10 km away',
    bio: 'Life, like a perfect dish, is about balance, heat, and the courage to devour. As a chef and culinary artist, I treat every ingredient with respect and every plate as a canvas. I am driven by the sensory, such as the scent of saffron, the texture of velvet, or the taste of a complex sauce. I believe that collaboration is the ultimate feast, and I value an appetite for the exquisite. Curating a culinary experience that transcends flavor is my passion.',
    images: ['https://images.pexels.com/photos/13869898/pexels-photo-13869898.jpeg?auto=compress&cs=tinysrgb&w=800'],
    isVerified: false,
    artistTypes: ['Culinary artist', 'Food photographer', 'Chef'],
    interests: ['Cooking', 'Coffee', 'Travel', 'Jazz'],
    hiddenBio: 'I once cooked for a world-renowned critic and got a standing ovation.',
    lastSeen: 'NOW'
  }
];
