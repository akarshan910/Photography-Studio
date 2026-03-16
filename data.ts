import { CollectionItem } from './types';

// Helper to generate images
const getImg = (w: number, h: number, id: number) => `https://picsum.photos/${w}/${h}?random=${id}`;

export const PLAYLIST = [
  {
    id: 1,
    title: 'Ethereal Calm',
    url: 'https://cdn.pixabay.com/audio/2022/10/14/audio_3943329f60.mp3'
  },
  {
    id: 2,
    title: 'Morning Mist',
    url: 'https://cdn.pixabay.com/audio/2024/02/07/audio_c1e2f76694.mp3'
  },
  {
    id: 3,
    title: 'Midnight Echoes',
    url: 'https://cdn.pixabay.com/audio/2023/10/24/audio_9247071d37.mp3'
  },
  {
    id: 4,
    title: 'Silent Journey',
    url: 'https://cdn.pixabay.com/audio/2023/04/21/audio_403c62181d.mp3'
  }
];

export const portfolioData: CollectionItem[] = [
  {
    id: 1,
    title: 'Wanderlust',
    category: 'Travel',
    imageUrl: getImg(800, 1000, 101),
    description: 'A visual journey through the unseen corners of the world, capturing the soul of places and people.',
    groups: [
      {
        id: 101,
        title: 'Kyoto Shadows',
        location: 'Kyoto, Japan',
        date: 'April 2024',
        description: 'Chasing light through the ancient gates of Fushimi Inari and the quiet streets of Gion at dawn.',
        previewImages: [
          { id: 1, url: getImg(800, 1200, 1), orientation: 'portrait' },
          { id: 2, url: getImg(800, 600, 2), orientation: 'landscape' },
          { id: 3, url: getImg(800, 800, 3), orientation: 'portrait' },
        ],
        images: Array.from({ length: 12 }).map((_, i) => ({
          id: 100 + i,
          url: getImg(i % 3 === 0 ? 800 : 1200, i % 3 === 0 ? 1200 : 800, 100 + i),
          caption: 'Street scenes from Kyoto',
          orientation: i % 3 === 0 ? 'portrait' : 'landscape'
        }))
      },
      {
        id: 102,
        title: 'Colors of Rajasthan',
        location: 'Jaipur, India',
        date: 'Nov 2023',
        description: 'Vibrant textiles, ancient forts, and the timeless gaze of the desert.',
        previewImages: [
          { id: 4, url: getImg(800, 1200, 4), orientation: 'portrait' },
          { id: 5, url: getImg(800, 600, 5), orientation: 'landscape' },
          { id: 6, url: getImg(800, 800, 6), orientation: 'portrait' },
        ],
        images: Array.from({ length: 8 }).map((_, i) => ({
          id: 200 + i,
          url: getImg(800, 800, 200 + i),
          caption: 'Jaipur diary',
          orientation: 'portrait'
        }))
      }
    ]
  },
  {
    id: 2,
    title: 'Vows & Veils',
    category: 'Wedding',
    imageUrl: getImg(800, 1000, 102),
    description: 'Documenting love stories with an editorial eye and an honest heart.',
    groups: [
      {
        id: 201,
        title: 'Sarah & James',
        location: 'Lake Como, Italy',
        date: 'June 2024',
        description: 'An intimate elopement on the water, surrounded by mist and mountains.',
        previewImages: [
          { id: 10, url: getImg(800, 1200, 10), orientation: 'portrait' },
          { id: 11, url: getImg(800, 600, 11), orientation: 'landscape' },
          { id: 12, url: getImg(800, 800, 12), orientation: 'portrait' },
        ],
        images: Array.from({ length: 15 }).map((_, i) => ({
          id: 300 + i,
          url: getImg(800, 1000, 300 + i),
          caption: 'Wedding moments',
          orientation: 'portrait'
        }))
      }
    ]
  },
  {
    id: 3,
    title: 'Noir',
    category: 'Editorial',
    imageUrl: getImg(800, 1000, 103),
    description: 'High contrast, black and white studies of form and light.',
    groups: [
      {
        id: 301,
        title: 'Urban Solitude',
        location: 'New York, USA',
        date: 'Jan 2024',
        description: 'The geometry of the city and the isolation within the crowd.',
        previewImages: [
          { id: 20, url: getImg(800, 1200, 20), orientation: 'portrait' },
          { id: 21, url: getImg(800, 600, 21), orientation: 'landscape' },
          { id: 22, url: getImg(800, 800, 22), orientation: 'portrait' },
        ],
        images: Array.from({ length: 10 }).map((_, i) => ({
          id: 400 + i,
          url: getImg(800, 1200, 400 + i),
          caption: 'NYC Noir',
          orientation: 'portrait'
        }))
      }
    ]
  },
];