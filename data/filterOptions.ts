
export interface FilterSection {
    title: string;
    items: string[];
}

export const INTEREST_OPTIONS: FilterSection[] = [
    {
        title: 'All Interests',
        items: [
            'Music', 'Instruments', 'Singing', 'Songwriting', 'Music production', 'DJing', 'Dancing', 'Ballet', 'Contemporary dance',
            'Hip hop dance', 'Salsa', 'Ballroom dancing', 'Painting', 'Drawing', 'Sculpting', 'Pottery', 'Ceramics', 'Digital art',
            'Illustration', 'Calligraphy', 'Graffiti', 'Street art', 'Photography', 'Film photography', 'Videography', 'Filmmaking',
            'Video editing', 'Animation', 'Acting', 'Theatre', 'Improv comedy', 'Stand up comedy', 'Writing', 'Poetry', 'Creative writing',
            'Screenwriting', 'Blogging', 'Journalism', 'Reading', 'Literature', 'Science fiction', 'Fantasy novels', 'Mystery thrillers',
            'Historical fiction', 'Non fiction', 'Philosophy', 'Psychology', 'Sociology', 'Anthropology', 'History', 'Ancient civilizations',
            'World War history', 'Medieval history', 'Science', 'Astronomy', 'Physics', 'Biology', 'Chemistry', 'Mathematics', 'Technology',
            'Artificial intelligence', 'Machine learning', 'Robotics', 'Coding', 'Web development', 'Game development', 'App development',
            'Open source', 'Cybersecurity', 'Blockchain', 'Cryptocurrency', 'NFTs', 'Startups', 'Entrepreneurship', 'Business strategy',
            'Marketing', 'Branding', 'Product design', 'UX design', 'UI design', 'Graphic design', 'Fashion', 'Streetwear', 'Vintage fashion',
            'Sustainable fashion', 'Thrifting', 'Personal styling', 'Makeup', 'Skincare', 'Haircare', 'Tattoos', 'Piercings', 'Body art',
            'Fitness', 'Gym training', 'Weightlifting', 'Bodybuilding', 'Powerlifting', 'Calisthenics', 'CrossFit', 'Running', 'Marathon training',
            'Sprinting', 'Cycling', 'Mountain biking', 'Swimming', 'Surfing', 'Skateboarding', 'Snowboarding', 'Skiing', 'Rock climbing',
            'Bouldering', 'Martial arts', 'Boxing', 'Kickboxing', 'Muay Thai', 'Brazilian Jiu Jitsu', 'Karate', 'Taekwondo', 'Judo', 'MMA',
            'Yoga', 'Pilates', 'Meditation', 'Mindfulness', 'Breathwork', 'Spirituality', 'Buddhism', 'Hinduism', 'Christianity', 'Islam',
            'Judaism', 'Astrology', 'Tarot', 'Crystals', 'Energy healing', 'Veganism', 'Vegetarianism', 'Plant based diet', 'Organic food',
            'Nutrition', 'Cooking', 'Baking', 'Pastry making', 'Bread making', 'Fermentation', 'Coffee', 'Specialty coffee', 'Latte art', 'Tea', 'Matcha', 'Gaming', 'PC gaming', 'Console gaming', 'Mobile gaming',
            'Esports', 'Speedrunning', 'Game streaming', 'Retro gaming', 'Board games', 'Chess', 'Card games', 'Poker', 'Magic the Gathering',
            'Dungeons and Dragons', 'Tabletop RPGs', 'Anime', 'Manga', 'Cosplay', 'K pop', 'J pop', 'K dramas', 'J dramas', 'Movies', 'Cinema',
            'Cult films', 'Horror films', 'Documentaries', 'Travel', 'Backpacking', 'Solo travel', 'Road trips', 'Van life', 'Digital nomad lifestyle',
            'Adventure travel', 'Luxury travel', 'Cultural exploration', 'Language learning', 'Spanish', 'French', 'German', 'Italian', 'Japanese',
            'Korean', 'Mandarin', 'Arabic', 'Nature', 'Hiking', 'Trekking', 'Camping', 'Bushcraft', 'Survival skills', 'Forestry', 'Gardening',
            'Urban gardening', 'Permaculture', 'Sustainability', 'Zero waste living', 'Minimalism', 'Environmentalism', 'Climate activism',
            'Social justice', 'Human rights', 'Feminism', 'LGBTQ advocacy', 'Mental health awareness', 'Animals', 'Pets', 'Dogs', 'Cats',
            'Birds', 'Reptiles', 'Aquariums', 'Wildlife conservation', 'Bird watching', 'Marine biology', 'Horses', 'Horseback riding',
            'Cars', 'Classic cars', 'Electric vehicles', 'Car modification', 'Motorcycles', 'Superbikes', 'Racing', 'Formula 1', 'MotoGP',
            'NASCAR', 'Cycling races', 'Aviation', 'Planes', 'Drones', 'Space exploration', 'Astrophotography', 'Architecture', 'Urban planning',
            'Interior design', 'Home decor', 'DIY projects', 'Woodworking', 'Metalworking', 'Leathercraft', 'Jewelry making', 'Knitting',
            'Crochet', 'Embroidery', 'Sewing', 'Fashion design', 'Collecting', 'Sneakers', 'Watches', 'Vinyl records', 'Books', 'Art',
            'Antiques', 'Coins', 'Stamps', 'Memorabilia', 'Magic tricks', 'Juggling', 'Parkour', 'Freerunning', 'Slacklining', 'Poi spinning',
            'Fire spinning', 'Flow arts', 'Graffiti art', 'Urban exploration', 'Abandoned places', 'Photography walks', 'Street photography',
            'Landscape photography', 'Portrait photography', 'Night photography', 'Astrophotography', 'Podcasts', 'Audio storytelling',
            'Voice acting', 'Public speaking', 'Debate', 'Storytelling', 'Standup paddleboarding', 'Kayaking', 'Canoeing', 'Sailing',
            'Yachting', 'Scuba diving', 'Free diving', 'Fishing', 'Fly fishing', 'Hunting', 'Archery', 'Shooting sports', 'Golf',
            'Tennis', 'Badminton', 'Table tennis', 'Volleyball', 'Basketball', 'Football', 'Soccer', 'Rugby', 'Cricket', 'Baseball',
            'Softball', 'Hockey', 'Ice hockey', 'Figure skating', 'Rollerblading', 'Longboarding', 'Astronomy observation', 'Stargazing',
            'Camping under stars', 'Music festivals', 'Concerts', 'Raves', 'Electronic music', 'House music', 'Techno', 'Trance',
            'Dubstep', 'Drum and bass', 'Jazz', 'Blues', 'Rock music', 'Metal', 'Punk rock', 'Indie music', 'Folk music', 'Classical music',
            'Opera', 'Musical theatre', 'Comedy shows', 'Improv shows', 'Trivia nights', 'Pub quizzes', 'Art workshops',
            'Escape rooms', 'Laser tag', 'Paintball', 'Go karting', 'Virtual reality', 'Augmented reality', '3D printing', 'Electronics',
            'Arduino projects', 'Raspberry Pi', 'Home automation', 'Smart home tech', 'Genealogy', 'Family history', 'Calligraphy',
            'Hand lettering', 'Bullet journaling', 'Scrapbooking', 'Card making', 'Origami', 'Paper crafts', 'Model building', 'RC cars',
            'RC planes', 'RC drones', 'Slot car racing', 'Train modeling', 'Warhammer', 'Miniature painting', 'Comic books', 'Graphic novels',
            'Zines', 'Self publishing', 'Bookbinding', 'Antique restoration', 'Furniture restoration', 'Upcycling', 'Repurposing',
            'Vintage shopping', 'Flea markets', 'Auctions', 'Estate sales'
        ]
    }
];

export const ARTIST_TYPE_OPTIONS: FilterSection[] = [
    {
        title: 'Visual Arts (2D & 3D)',
        items: [
            'Painter (oil)', 'Painter (acrylic)', 'Painter (watercolor)', 'Digital artist', 'Illustrator', 'Graphic designer',
            'Sketch artist', 'Draughtsman', 'Sculptor', 'Ceramicist', 'Potter', 'Printmaker', 'Collage artist', 'Mixed-media artist',
            'Street artist', 'Muralist', 'Tattoo artist', 'Calligrapher', 'Pixel artist', 'Voxel artist', 'Mosaic artist',
            'Stained glass artist', 'Land artist', 'Environmental artist', 'Installation artist', 'Light artist',
            'Projection artist', 'Kinetic sculptor'
        ]
    },
    {
        title: 'Music & Audio',
        items: [
            'Singer', 'Vocalist', 'Rapper', 'MC', 'Music composer', 'Songwriter', 'Guitarist', 'Pianist', 'Drummer',
            'Violinist', 'Bassist', 'Saxophonist', 'Flutist', 'Trumpeter', 'Cellist', 'Harpist', 'Percussionist',
            'Instrumentalist (other)', 'Music producer', 'Beatmaker', 'DJ', 'Sound engineer', 'Audio designer', 'Foley artist',
            'Binaural audio designer', 'Spatial audio designer', 'Podcast producer', 'Audio storyteller', 'Music visualizer',
            'Conductor', 'Lyricist', 'ASMR artist', 'Sound sculptor'
        ]
    },
    {
        title: 'Performing Arts',
        items: [
            'Actor', 'Actress', 'Theatre performer', 'Stage actor', 'Dancer (ballet)', 'Dancer (contemporary)',
            'Dancer (hip-hop)', 'Dancer (jazz)', 'Dancer (classical)', 'Dancer (ballroom)', 'Choreographer',
            'Theatre director', 'Stage director', 'Voice actor', 'Comedian', 'Stand-up comedian',
            'Improvisational comedian', 'Circus performer', 'Acrobat', 'Aerialist', 'Spoken word artist',
            'Slam poet (performance)', 'Mime artist', 'Physical theatre performer', 'Drag artist', 'Drag queen',
            'Drag king', 'Cosplayer', 'Puppeteer', 'Marionette artist', 'Magician', 'Illusionist', 'Busker', 'Street performer'
        ]
    },
    {
        title: 'Writing & Literary Arts',
        items: [
            'Novelist', 'Fiction writer', 'Short story writer', 'Poet', 'Playwright', 'Screenwriter', 'Scriptwriter',
            'Comic book writer', 'Graphic novelist', 'Copywriter', 'Creative writer', 'Blogger', 'Essayist', 'Critic',
            'Literary critic', 'Reviewer', 'Memoir writer', 'Biographer', 'Zine maker', 'Indie publisher',
            'Podcast scriptwriter', 'Game narrative designer', 'Dialogue writer', 'Ghostwriter'
        ]
    },
    {
        title: 'Film, Video & Animation',
        items: [
            'Filmmaker', 'Film director', 'Short film creator', 'Documentary filmmaker', 'Cinematographer',
            'Director of photography', 'Video artist', 'Animator (2D)', 'Animator (3D)', 'Stop-motion animator',
            'Claymation artist', 'Motion graphics artist', 'Video editor', 'Film editor', 'Colorist', 'VFX artist',
            'Visual effects artist', 'Storyboard artist', 'Title sequence designer', 'Camera operator', 'Steadicam operator'
        ]
    },
    {
        title: 'Photography',
        items: [
            'Photographer', 'Portrait photographer', 'Fashion photographer', 'Street photographer', 'Documentary photographer',
            'Photojournalist', 'Landscape photographer', 'Nature photographer', 'Wildlife photographer', 'Commercial photographer',
            'Product photographer', 'Food photographer', 'Event photographer', 'Wedding photographer', 'Conceptual photographer',
            'Fine art photographer', 'Architectural photographer', 'Sports photographer', 'Astrophotographer',
            'Macro photographer', 'Photo editor', 'Photo retoucher'
        ]
    },
    {
        title: 'Design & Applied Arts',
        items: [
            'Graphic designer', 'Brand designer', 'Editorial designer', 'UX designer', 'UI designer', 'Product designer',
            'Industrial designer', 'Game designer', 'Level designer', 'Concept artist (games)', 'Concept artist (film)',
            'Character designer', 'Environment designer', 'Fashion designer', 'Costume designer', 'Textile designer',
            'Textile artist', 'Jewelry designer', 'Interior designer', 'Spatial designer', 'Furniture designer',
            'Packaging designer', 'Type designer', 'Font creator', 'Icon designer', 'Motion designer', 'AR filter creator',
            'Experience designer', 'Service designer'
        ]
    },
    {
        title: 'Digital & New Media',
        items: [
            'Digital artist', '3D artist', 'CGI artist', 'AI artist', 'Generative artist', 'Prompt engineer (creative)',
            'NFT artist', 'Crypto artist', 'AR artist', 'Augmented reality artist', 'VR artist', 'Virtual reality artist',
            'Immersive experience designer', 'Creative technologist', 'Creative coder', 'Algorithmic artist',
            'Generative coder', 'Data visualization artist', 'GIF artist', 'Meme creator', 'Holography artist',
            'Projection mapping artist', 'Interactive media artist', 'Web designer', 'Digital installation artist'
        ]
    },
    {
        title: 'Craft & Specialized Arts',
        items: [
            'Woodworker', 'Furniture maker', 'Carpenter (artistic)', 'Leatherworker', 'Leather artist', 'Glassblower',
            'Glass artist', 'Blacksmith', 'Metalworker', 'Metal sculptor', 'Silversmith', 'Goldsmith', 'Ceramicist',
            'Potter', 'Bookbinder', 'Paper artist', 'Origami artist', 'Papercut artist', 'Model maker', 'Miniature artist',
            'Diorama maker', 'Luthier', 'Instrument maker', 'Cake decorator', 'Pastry artist', 'Sugar artist',
            'Chocolatier (artistic)', 'Makeup artist', 'Body painter', 'Special effects makeup artist',
            'Prosthetic makeup artist', 'Hairstylist (creative)', 'Florist (artistic)', 'Floral designer', 'Weaver',
            'Fiber artist', 'Quilter', 'Embroiderer', 'Textile sculptor'
        ]
    },
    {
        title: 'Content & Social Creators',
        items: [
            'Content creator', 'YouTuber', 'Video creator', 'TikTok creator', 'Reels creator', 'Short-form content creator',
            'Vlogger', 'Video essayist', 'Streamer', 'Live streamer', 'Gaming content creator', 'Educational content creator',
            'Tutorial creator', 'Influencer (art/creative)', 'Podcast host', 'Social media artist'
        ]
    },
    {
        title: 'Experimental & Hybrid Arts',
        items: [
            'Bio-artist', 'Living art creator', 'Interactive installation artist', 'Sound sculptor', 'Noise artist',
            'Mixed reality artist', 'Transmedia storyteller', 'Cross-media artist', 'Performance + tech artist',
            'Interdisciplinary artist', 'Conceptual artist', 'Process artist', 'Relational artist', 'Social practice artist',
            'Public art artist', 'Community artist', 'Site-specific artist', 'Time-based media artist', 'New media artist',
            'Experimental filmmaker', 'Video performance artist', 'Sound installation artist', 'Sensory artist',
            'Multisensory experience designer'
        ]
    }
];
