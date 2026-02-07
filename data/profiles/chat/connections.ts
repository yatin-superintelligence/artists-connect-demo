import { Connection } from '../../../types';

export const CHAT_CONNECTIONS: Connection[] = [
  {
    id: 'c7',
    profile: {
      id: 'p7',
      name: 'Kam',
      age: 26,
      profileType: 'Artist',

      distance: '3 km away',
      bio: 'I view the world through a lens of high-contrast aesthetics. As a photographer and art director, I orchestrate moments of visual impact, curating scenes where every shadow plays a role. I believe in the power of collaboration and the collision of different artistic energies. My style is sharp, my vision is uncompromising, and I’m looking for fellow creatives who want to push the boundaries of visual storytelling. Whether behind the camera or designing the set, I demand authenticity. Let’s create art that leaves a lasting impression.',
      images: ['https://images.pexels.com/photos/220417/pexels-photo-220417.jpeg?auto=compress&cs=tinysrgb&w=400'],
      isPro: true,
      artistTypes: ['Photographer', 'Art director', 'Stylist'],
      interests: ['Travel', 'Fashion', 'Photography', 'Cocktails', 'Luxury travel', 'Art', 'Music'],
      lastSeen: 'Recently'
    },
    lastMessage: "Your aesthetic is exactly what I've been looking for. Do you have a digital portfolio?",
    lastMessageTime: '4:20 PM',
    unreadCount: 1
  },
  {
    id: 'c8',
    profile: {
      id: 'p8',
      name: 'Leo',
      age: 30,
      profileType: 'Artist',

      distance: '3 km away',
      bio: 'Structure is my language, and form is my art. As an architect and sculptor, I build monuments to persistence, finding beauty in the industrial, the raw, and the unfinished. I appreciate the interplay of dark wood, poured concrete, and intellectual depth. I’m looking for artistic connections that challenge my blueprints, people who can inhabit the spaces I design with creative intensity. Let’s explore the architecture of ideas and collaborate on something tangible.',
      images: ['https://images.pexels.com/photos/9617902/pexels-photo-9617902.jpeg?auto=compress&cs=tinysrgb&w=400'],
      isPro: true,
      artistTypes: ['Architect', 'Industrial designer', 'Sculptor'],
      interests: ['Architecture', 'Coffee', 'Product design', 'Travel', 'Collecting', 'Music', 'Sculpting'],
      lastSeen: 'Recently'
    },
    lastMessage: "I'll upload some photos of the site tomorrow. Want to see?",
    lastMessageTime: '4:15 PM',
    unreadCount: 1
  },
  {
    id: 'c1',
    profile: {
      id: 'p1',
      name: 'Fahad',
      age: 29,
      profileType: 'Artist',

      distance: '3 km away',
      bio: 'Lines, angles, and the perfect curve of a horizon: my mind is always drafting the next concept. As an architect and draughtsman, I appreciate the precision of a well-executed plan, but I know that the most breathtaking structures are built on inspiration. I’m a student of history and a chaser of storms, finding peace in the eye of the hurricane. I value honesty as much as I value structural integrity. If you appreciate the weight of a good conversation and the lightness of shared creativity, let’s sketch out a new project.',
      images: ['https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=800'],
      isVerified: true,
      isPro: true,
      artistTypes: ['Architect', 'Interior designer', 'Draughtsman'],
      interests: ['Architecture', 'Interior design', 'Drawing', 'Travel', 'Coffee', 'Urban planning', 'History'],
      hiddenBio: 'I have a collection of antique maps and a love for storm chasing.',
      lastSeen: '1D'
    },
    lastMessage: "Let me know how it goes. I'd love to see the result.",
    lastMessageTime: '2:45 PM',
    unreadCount: 0
  },
  {
    id: 'c2',
    profile: {
      id: 'p2',
      name: 'Aditya',
      age: 33,
      profileType: 'Artist',

      distance: '5 km away',
      bio: 'In a world screaming for attention, I choose the whisper. A writer and poet by nature, I find my truths in the quietude of a forest or the stillness of a morning meditation. My photography captures the untouched and the overlooked: the dew on a spiderweb, the fog rolling over a hill. I’m seeking an artistic dialogue that doesn\'t need to be loud to be profound. Let’s strip away the noise and find inspiration in the silence. Minimalism is my aesthetic; depth is my requirement.',
      images: ['https://images.pexels.com/photos/804009/pexels-photo-804009.jpeg?auto=compress&cs=tinysrgb&w=800'],
      isPro: true,
      isVerified: true,
      artistTypes: ['Writer', 'Nature photographer', 'Poet'],
      interests: ['Coffee', 'Hiking', 'Minimalism', 'Meditation', 'Nature', 'Reading', 'Philosophy'],
      hiddenBio: 'I once lived in a monastery for six months just to find silence.',
      lastSeen: '1D'
    },
    lastMessage: "I'll send you the link. I think you'd appreciate the silence between the words.",
    lastMessageTime: '1:20 PM',
    unreadCount: 1
  },
  {
    id: 'c3',
    profile: {
      id: 'p3',
      name: 'Art Collective',
      age: 0,
      profileType: 'Group',

      distance: 'Mixed',
      bio: 'A collective of visual and performance artists pushing boundaries.',
      images: [
        'https://images.pexels.com/photos/8381889/pexels-photo-8381889.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    },
    lastMessage: "A mix. Musicians, painters, designers. You'll see.",
    lastMessageTime: '11:15 AM',
    unreadCount: 1,
    isGroup: true,
    members: [
      {
        id: 'm1',
        name: 'Kam',
        age: 26,
        profileType: 'Artist',

        distance: '',
        bio: 'I view the world through a lens of high-contrast aesthetics. As a photographer and art director, I orchestrate moments of visual impact, curating scenes where every shadow plays a role. I believe in the power of collaboration and the collision of different artistic energies. My style is sharp, my vision is uncompromising, and I’m looking for fellow creatives who want to push the boundaries of visual storytelling. Whether behind the camera or designing the set, I demand authenticity. Let’s create art that leaves a lasting impression.',
        images: ['https://images.pexels.com/photos/220417/pexels-photo-220417.jpeg?auto=compress&cs=tinysrgb&w=400'],
        isPro: true,
        artistTypes: ['Photographer', 'Art director', 'Stylist'],
        interests: ['Travel', 'Fashion', 'Photography', 'Cocktails', 'Luxury travel', 'Art', 'Music']
      },
      {
        id: 'm2',
        name: 'Leo',
        age: 30,
        profileType: 'Artist',

        distance: '',
        bio: 'Structure is my language, and form is my art. As an architect and sculptor, I build monuments to persistence, finding beauty in the industrial, the raw, and the unfinished. I appreciate the interplay of dark wood, poured concrete, and intellectual depth. I’m looking for artistic connections that challenge my blueprints, people who can inhabit the spaces I design with creative intensity. Let’s explore the architecture of ideas and collaborate on something tangible.',
        images: ['https://images.pexels.com/photos/9617902/pexels-photo-9617902.jpeg?auto=compress&cs=tinysrgb&w=400'],
        isPro: true,
        artistTypes: ['Architect', 'Industrial designer', 'Sculptor'],
        interests: ['Architecture', 'Coffee', 'Product design', 'Travel', 'Collecting', 'Music', 'Sculpting']
      }
    ]
  },
  {
    id: 'c4',
    profile: {
      id: 'p4',
      name: 'Zane',
      age: 26,
      profileType: 'Artist',

      distance: '2 km away',
      bio: 'My life is measured in movements and crescendos. As a cellist and composer, I speak a language without words, translating the deepest human experiences into resonance and vibration. I find solace in the resonance of wood and string, and I’m drawn to the slower, more deliberate tempos of creation. I’m looking for collaborators who can listen—really listen—to the silence between the notes. Let’s spend an afternoon composing, with nothing but the sound of the water and the comfort of shared creativity.',
      images: ['https://images.pexels.com/photos/555345/pexels-photo-555345.jpeg?auto=compress&cs=tinysrgb&w=800'],
      artistTypes: ['Cellist', 'Classical musician', 'Composer'],
      interests: ['Music', 'Photography', 'Nature', 'Classical music', 'Coffee', 'Kayaking', 'Reading'],
      hiddenBio: 'I play the cello when no one is watching.',
      lastSeen: '2D'
    },
    lastMessage: "Headphones on. Ready.",
    lastMessageTime: '10:05 AM',
    unreadCount: 0
  },
  {
    id: 'c5',
    profile: {
      id: 'p5',
      name: 'Rohan',
      age: 30,
      profileType: 'Artist',

      distance: '6 km away',
      bio: 'I chase perspectives that most people only dream of. As a landscape photographer and drone pilot, I live life at altitude, constantly seeking the view from above. The thrill of the climb, the thin air of the summit, and the vastness of the world below. That’s where I feel most creative. I’m terrified of the small things but fearless in the face of the massive. I need a fellow adventurer who is ready to pack a gear bag at a moment\'s notice and follow the horizon. Let’s capture the wild and find art in the adventure.',
      images: ['https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=800'],
      artistTypes: ['Photographer (landscape)', 'Videographer', 'Drone pilot'],
      interests: ['Rock climbing', 'Nature', 'Adventure travel', 'Dogs', 'Hiking', 'Photography', 'Camping'],
      hiddenBio: 'I am terrified of spiders but I love scorpions.',
      lastSeen: '3D'
    },
    lastMessage: "That would be a cool project. Complete coverage.",
    lastMessageTime: '9:30 AM',
    unreadCount: 1
  },
  {
    id: 'c6',
    profile: {
      id: 'p6',
      name: 'Vikram',
      age: 28,
      profileType: 'Artist',

      distance: '4 km away',
      bio: 'History is not in the past; it is painted in the layers of the present. As an art historian and watercolorist, I spend my days decoding the stories hidden in brushstrokes and fading pigments. I see the world as a living museum, full of tragic heroes and beautiful ruins. I’m looking for a muse or fellow artist who understands that every scar is a signature and every flaw is a masterpiece. Let’s wander through galleries, debate the classics, and maybe, just maybe, create a new masterpiece together.',
      images: ['https://images.pexels.com/photos/29888278/pexels-photo-29888278.jpeg?auto=compress&cs=tinysrgb&w=800'],
      isVerified: false,
      artistTypes: ['Painter (watercolor)', 'Art historian', 'Curator'],
      interests: ['Art', 'Cultural exploration', 'Chess', 'History', 'Painting', 'Literature', 'Classical music'],
      hiddenBio: 'I am secretly a grandmaster at Tetris.',
      lastSeen: '1W'
    },
    lastMessage: "Sold. I'll take notes.",
    lastMessageTime: '8:45 AM',
    unreadCount: 0
  },
  {
    id: 'n1',
    profile: {
      id: 'np1',
      name: 'Mira',
      age: 25,
      profileType: 'Artist',

      distance: '1 km away',
      bio: 'Words are my pigment, and the page is my canvas. As a poet and calligrapher, I am in love with the curve of a letter and the rhythm of a verse. I find magic in the mundane—the smell of old book glue, the sound of rain on a library roof, the feeling of ink on paper. I’m a wanderer in the city, looking for hidden bookshops and secret cafes. I seek a fellow storyteller, someone who wants to write a chapter full of ideas, deep conversations, and the kind of narrative that belongs in a leather-bound novel.',
      images: ['https://images.pexels.com/photos/17821548/pexels-photo-17821548.jpeg?auto=compress&cs=tinysrgb&w=800'],
      artistTypes: ['Poet', 'Creative writer', 'Calligrapher'],
      interests: ['Poetry', 'Books', 'Literature', 'Writing', 'Coffee', 'Bookbinding'],
      hiddenBio: 'I have read every single book in my local library.',
      lastSeen: 'NOW'
    },
    unreadCount: 0
  },
  {
    id: 'n2',
    profile: {
      id: 'np2',
      name: 'Kabir',
      age: 27,
      profileType: 'Artist',

      distance: '3 km away',
      bio: 'There is an art to rising, whether it’s dough in the oven or the sun over a mountain peak. As a baker and food photographer, I believe that patience is the most essential ingredient in craft. I find joy in the tactile: the flour on my hands, the crunch of a crust, the earth beneath my boots. I’ve been lost in the Himalayas and found in the kitchen. I’m looking for someone to share ideas with, someone who appreciates the simple, honest warmth of a fresh loaf and the wild beauty of a rugged trail.',
      images: ['https://images.pexels.com/photos/3298638/pexels-photo-3298638.jpeg?auto=compress&cs=tinysrgb&w=800'],
      artistTypes: ['Culinary artist', 'Baker', 'Food photographer'],
      interests: ['Baking', 'Hiking', 'Cooking', 'Nature', 'Bread making', 'Travel'],
      hiddenBio: 'I once got lost in the Himalayas for three days. It was the best time of my life.',
      lastSeen: '5h ago'
    },
    unreadCount: 0
  },
  {
    id: 'n3',
    profile: {
      id: 'np3',
      name: 'Isha',
      age: 24,
      profileType: 'Artist',

      distance: '5 km away',
      bio: 'I am movement incarnate, a fleeting shape in the spotlight. As a contemporary dancer and choreographer, I do not just listen to the music; I become it. My body is my instrument, expressing the words I cannot speak. I find rhythm in the wind and melody in the silence. I am looking for a collaborator who can move with me, not necessarily on the dance floor, but in creative spirit—someone who understands the ebb and flow of energy. Let’s create a duet of artistic expression.',
      images: ['https://images.pexels.com/photos/30979050/pexels-photo-30979050.jpeg?auto=compress&cs=tinysrgb&w=800'],
      artistTypes: ['Dancer (contemporary)', 'Choreographer', 'Performance artist'],
      interests: ['Dancing', 'Nature', 'Vinyl records', 'Music', 'Meditation', 'Yoga', 'Art'],
      hiddenBio: 'I can speak to birds. Or at least I try to.',
      lastSeen: '2h ago'
    },
    unreadCount: 0
  },
  {
    id: 'np4',
    profile: {
      id: 'np4',
      name: 'Arthur',
      age: 29,
      profileType: 'Artist',

      distance: '2 km away',
      bio: 'I carry my home in my heart and my stories in my songs. As a folk musician and writer, I travel light but feel deeply. I am drawn to the ancient wisdom of forests and the profound truth found in deep silence. I turned off the television ten years ago to tune into the frequency of the real world. I’m seeking a fellow artist, a traveler who values authenticity over accumulation. Let’s sit by a fire, share a song, and listen to the music of the wild.',
      images: ['https://images.pexels.com/photos/4238485/pexels-photo-4238485.jpeg?auto=compress&cs=tinysrgb&w=800'],
      artistTypes: ['Writer', 'Travel photographer', 'Folk musician'],
      interests: ['Travel', 'Nature', 'Meditation', 'Reading', 'Folk music', 'Minimalism'],
      hiddenBio: 'I haven’t owned a television in ten years.',
      lastSeen: 'NOW'
    },
    unreadCount: 0
  }
];