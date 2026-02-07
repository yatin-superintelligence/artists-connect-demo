// Posts data for profiles
export interface Post {
    id: string;
    profileId: string;
    images: string[];
    caption: string;
}

// Posts organized by profile ID
export const PROFILE_POSTS: { [profileId: string]: Post[] } = {
    // Chloe's posts (profile ID: l2)
    'l2': [
        {
            id: 'post-chloe-1',
            profileId: 'l2',
            images: [
                'https://images.pexels.com/photos/35348327/pexels-photo-35348327.jpeg?auto=compress&cs=tinysrgb&w=800',
                'https://images.pexels.com/photos/35348326/pexels-photo-35348326.jpeg?auto=compress&cs=tinysrgb&w=800'
            ],
            caption: "Nature has its own setlist. These blooms sing a quiet chorus that only the patient can hear. Sometimes the best melodies are the ones we never record. 🌸"
        },
        {
            id: 'post-chloe-2',
            profileId: 'l2',
            images: [
                'https://images.pexels.com/photos/13727429/pexels-photo-13727429.jpeg?auto=compress&cs=tinysrgb&w=800',
                'https://images.pexels.com/photos/11538992/pexels-photo-11538992.jpeg?auto=compress&cs=tinysrgb&w=800'
            ],
            caption: "The ocean is the ultimate rhythm section. Endless, crashing, and perfectly timed. Waiting for the tide to write the next verse in the wet sand."
        }
    ],
    // Rock's posts (profile ID: d1)
    'd1': [
        {
            id: 'post-annu-1',
            profileId: 'd1',
            images: [
                'https://images.pexels.com/photos/2549941/pexels-photo-2549941.jpeg?auto=compress&cs=tinysrgb&w=800'
            ],
            caption: "Velocity is a texture. The blur of the city lights is just another medium to paint with. Freedom is found where the engine roar meets the silence of the mind. 🏍️"
        }
    ],
    // Moon's posts (profile ID: d2)
    'd2': [
        {
            id: 'post-moon-1',
            profileId: 'd2',
            images: [
                'https://images.pexels.com/photos/16295972/pexels-photo-16295972.jpeg?auto=compress&cs=tinysrgb&w=800',
                'https://images.pexels.com/photos/2343476/pexels-photo-2343476.jpeg?auto=compress&cs=tinysrgb&w=800'
            ],
            caption: "Between the digital and the divine. We are all just code waiting to be compiled into something beautiful. Draped in the velvet of the void."
        },
        {
            id: 'post-moon-2',
            profileId: 'd2',
            images: [
                'https://images.pexels.com/photos/23181165/pexels-photo-23181165.jpeg?auto=compress&cs=tinysrgb&w=800'
            ],
            caption: "Deconstructing the moment. It’s not about the peak, but the slow, deliberate unraveling of the self. Building sanctuaries out of breath and shadow. Peace is a process."
        }
    ],
    // Sophia's posts (profile ID: d4)
    'd4': [
        {
            id: 'post-sophia-1',
            profileId: 'd4',
            images: [
                'https://images.pexels.com/photos/3219951/pexels-photo-3219951.jpeg?auto=compress&cs=tinysrgb&w=800',
                'https://images.pexels.com/photos/14525238/pexels-photo-14525238.jpeg?auto=compress&cs=tinysrgb&w=800',
                'https://images.pexels.com/photos/4340047/pexels-photo-4340047.jpeg?auto=compress&cs=tinysrgb&w=800'
            ],
            caption: "Red is not just a color; it's a language. It speaks of urgency, of arrival, and the boldness to occupy space without apology. Wearing it is a promise to never fade into the background."
        },
        {
            id: 'post-sophia-2',
            profileId: 'd4',
            images: [
                'https://images.pexels.com/photos/4844099/pexels-photo-4844099.jpeg?auto=compress&cs=tinysrgb&w=800'
            ],
            caption: "Collecting horizons like souvenirs. Every sunset is a different file format, but the feeling is always analog. 🌍"
        }
    ],
    // Maya's posts (profile ID: d5)
    'd5': [
        {
            id: 'post-maya-1',
            profileId: 'd5',
            images: [
                'https://images.pexels.com/photos/1306791/pexels-photo-1306791.jpeg?auto=compress&cs=tinysrgb&w=800'
            ],
            caption: "High altitude frequencies. Even the bass needs a break to listen to the wind. Silence is the heaviest drop."
        }
    ],
    // Roxanne's posts (user's profile ID: me)
    'me': [
        {
            id: 'post-roxanne-1',
            profileId: 'me',
            images: [
                'https://images.pexels.com/photos/4442110/pexels-photo-4442110.jpeg?auto=compress&cs=tinysrgb&w=800',
                'https://images.pexels.com/photos/4442078/pexels-photo-4442078.jpeg?auto=compress&cs=tinysrgb&w=800'
            ],
            caption: "Framing the chaos is an act of resistance. In a world that moves too fast, film forces you to breathe, to wait, and to accept the imperfections. Sometimes the grain tells a better story than the pixel ever could. 🎞️"
        }
    ]
};

// Helper function to get posts for a profile
export const getProfilePosts = (profileId: string): Post[] => {
    return PROFILE_POSTS[profileId] || [];
};
