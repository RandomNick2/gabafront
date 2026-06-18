import tourImg from '../assets/photos/5ftsj0mn7lkw08ws40k4w4wss.jpg';
import mountainImg from '../assets/photos/traveller-bag-mountains-isolation-1151553.jpg';
import cityImg from '../assets/photos/5118759.jpg';

const BOOKINGS_KEY = 'qaztour_tour_bookings';
const HOTEL_BOOKINGS_KEY = 'qaztour_hotel_bookings';
const TOURS_KEY = 'qaztour_tours';
const HOTELS_KEY = 'qaztour_hotels';

export const mockLocations = [
  { id: 1, name_kz: 'Алматы', name_en: 'Almaty', name_ru: 'Алматы' },
  { id: 2, name_kz: 'Астана', name_en: 'Astana', name_ru: 'Астана' },
  { id: 3, name_kz: 'Түркістан', name_en: 'Turkistan', name_ru: 'Туркестан' },
  { id: 4, name_kz: 'Ақтау', name_en: 'Aktau', name_ru: 'Актау' },
];

export const mockTours = [
  {
    id: 1,
    name_kz: 'Алматы таулары және Шымбұлақ',
    name_en: 'Almaty Mountains and Shymbulak',
    name_ru: 'Горы Алматы и Шымбулак',
    description_kz: 'Іле Алатауы, Медеу, Шымбұлақ және қала панорамасы бар жайлы тур.',
    description_en: 'A scenic tour through Ile Alatau, Medeu, Shymbulak and Almaty viewpoints.',
    description_ru: 'Живописный тур по Иле-Алатау, Медеу, Шымбулаку и смотровым площадкам Алматы.',
    location_id: 1,
    location: mockLocations[0],
    category: 'nature',
    duration: 2,
    price: 85000,
    volume: 18,
    date: '2026-06-22',
    image: mountainImg,
    gallery: [mountainImg, tourImg],
    reviews: [
      { id: 1, rating: 5, content: 'Отличный гид и красивые виды.', created_at: '2026-05-20', user: { name: 'Aigerim' } },
      { id: 2, rating: 4, content: 'Маршрут насыщенный, всё понравилось.', created_at: '2026-05-28', user: { name: 'Daniyar' } },
    ],
    user: { name: 'QazTour Guide' },
  },
  {
    id: 2,
    name_kz: 'Астана city tour',
    name_en: 'Astana City Tour',
    name_ru: 'Обзорный тур по Астане',
    description_kz: 'Бәйтерек, EXPO, Хан Шатыр және Есіл жағалауы бойынша қалалық маршрут.',
    description_en: 'A city route through Baiterek, EXPO, Khan Shatyr and the Ishim embankment.',
    description_ru: 'Городской маршрут: Байтерек, EXPO, Хан Шатыр и набережная Есиля.',
    location_id: 2,
    location: mockLocations[1],
    category: 'city',
    duration: 1,
    price: 45000,
    volume: 25,
    date: '2026-06-28',
    image: cityImg,
    gallery: [cityImg, tourImg],
    reviews: [
      { id: 3, rating: 5, content: 'Удобный формат для первого знакомства с городом.', created_at: '2026-04-18', user: { name: 'Miras' } },
    ],
    user: { name: 'Aventra Team' },
  },
  {
    id: 3,
    name_kz: 'Түркістан мұрасы',
    name_en: 'Turkistan Heritage',
    name_ru: 'Наследие Туркестана',
    description_kz: 'Қожа Ахмет Ясауи кесенесі, тарихи орындар және ұлттық ас дәмі.',
    description_en: 'Khoja Ahmed Yasawi mausoleum, historic sites and local cuisine.',
    description_ru: 'Мавзолей Ходжи Ахмеда Ясави, исторические места и национальная кухня.',
    location_id: 3,
    location: mockLocations[2],
    category: 'culture',
    duration: 3,
    price: 120000,
    volume: 16,
    date: '2026-07-05',
    image: tourImg,
    gallery: [tourImg, cityImg],
    reviews: [],
    user: { name: 'Heritage Guide' },
  },
  {
    id: 4,
    name_kz: 'Маңғыстау және Бозжыра',
    name_en: 'Mangystau and Bozzhyra',
    name_ru: 'Мангистау и Бозжыра',
    description_kz: 'Бозжыра шатқалы, Шерқала және Каспий маңы табиғаты бойынша экспедиция.',
    description_en: 'An expedition to Bozzhyra canyon, Sherkala and Caspian landscapes.',
    description_ru: 'Экспедиция к урочищу Бозжыра, Шеркале и каспийским пейзажам.',
    location_id: 4,
    location: mockLocations[3],
    category: 'adventure',
    duration: 5,
    price: 260000,
    volume: 12,
    date: '2026-07-14',
    image: mountainImg,
    gallery: [mountainImg, tourImg, cityImg],
    reviews: [
      { id: 4, rating: 5, content: 'Очень атмосферное путешествие.', created_at: '2026-05-10', user: { name: 'Sara' } },
    ],
    user: { name: 'Mangystau Pro' },
  },
];

export const getStoredTours = () => {
  try {
    const storedTours = JSON.parse(localStorage.getItem(TOURS_KEY) || 'null');
    return Array.isArray(storedTours) ? storedTours : mockTours;
  } catch {
    return mockTours;
  }
};

const saveStoredTours = (tours) => {
  localStorage.setItem(TOURS_KEY, JSON.stringify(tours));
};

export const getMockTourById = (id) =>
  getStoredTours().find((tour) => String(tour.id) === String(id));

export const createStoredTour = (tourData) => {
  const tours = getStoredTours();
  const location = mockLocations.find((loc) => String(loc.id) === String(tourData.location_id)) || mockLocations[0];
  const newTour = {
    id: Date.now(),
    name_kz: tourData.name_kz || tourData.name_en,
    name_en: tourData.name_en,
    name_ru: tourData.name_ru || tourData.name_en,
    description_kz: tourData.description_kz || tourData.description_en,
    description_en: tourData.description_en,
    description_ru: tourData.description_ru || tourData.description_en,
    location_id: Number(tourData.location_id),
    location,
    category: tourData.category || 'custom',
    duration: Number(tourData.duration) || 1,
    price: Number(tourData.price) || 0,
    volume: Number(tourData.volume) || 1,
    date: tourData.date,
    image: tourData.image || mockTours[0].image,
    gallery: tourData.image ? [tourData.image] : [],
    reviews: [],
    user: { name: tourData.guideName || 'Guide' },
    created_at: new Date().toISOString(),
  };

  saveStoredTours([newTour, ...tours]);
  return newTour;
};

export const deleteStoredTour = (id) => {
  const nextTours = getStoredTours().filter((tour) => String(tour.id) !== String(id));
  saveStoredTours(nextTours);
  return nextTours;
};

export const resetStoredTours = () => {
  saveStoredTours(mockTours);
  return mockTours;
};

export const addStoredTourReview = (tourId, reviewData) => {
  const tours = getStoredTours();
  const review = {
    id: Date.now(),
    rating: Number(reviewData.rating) || 5,
    content: reviewData.content,
    created_at: new Date().toISOString(),
    user_id: reviewData.user_id,
    user: {
      name: reviewData.user_name || 'Traveler',
      avatar: reviewData.user_avatar || '',
    },
  };

  const updatedTours = tours.map((tour) =>
    String(tour.id) === String(tourId)
      ? { ...tour, reviews: [review, ...(tour.reviews || [])] }
      : tour
  );

  saveStoredTours(updatedTours);
  return review;
};

export const getStoredTourBookings = () => {
  try {
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveStoredTourBookings = (bookings) => {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
};

export const createStoredTourBooking = (payload) => {
  const tour = getMockTourById(payload.tour_id);
  const bookings = getStoredTourBookings();
  const booking = {
    ...payload,
    id: Date.now(),
    type: 'tour',
    tour,
    payment_status: 'unpaid',
    created_at: new Date().toISOString(),
  };

  saveStoredTourBookings([booking, ...bookings]);
  return booking;
};

export const getStoredTourBookingById = (id) =>
  getStoredTourBookings().find((booking) => String(booking.id) === String(id));

export const updateStoredTourBooking = (id, updates) => {
  const bookings = getStoredTourBookings();
  const updatedBookings = bookings.map((booking) =>
    String(booking.id) === String(id) ? { ...booking, ...updates } : booking
  );

  saveStoredTourBookings(updatedBookings);
  return updatedBookings.find((booking) => String(booking.id) === String(id));
};

export const mockHotels = [
  {
    id: 1,
    name: 'Almaty Grand Hotel',
    address_kz: 'Достық даңғылы, 52',
    address_en: '52 Dostyk Avenue',
    address_ru: 'проспект Достык, 52',
    description_kz: 'Қала ортасындағы тауға көрінісі бар жайлы қонақүй.',
    description_en: 'A comfortable city hotel with mountain views in central Almaty.',
    description_ru: 'Комфортный отель в центре Алматы с видом на горы.',
    city: { name: 'Almaty' },
    country: 'Kazakhstan',
    phone: '+7 727 555 10 10',
    email: 'stay@almatygrand.local',
    website: 'https://example.com/almaty-grand',
    rating: 4.7,
    stars: 4,
    price_per_night: 38000,
    image: cityImg,
    room_types: [
      {
        id: 101,
        name_kz: 'Стандарт бөлме',
        name_en: 'Standard Room',
        name_ru: 'Стандартный номер',
        description_kz: 'Екі адамға арналған жайлы бөлме.',
        description_en: 'A comfortable room for two guests.',
        description_ru: 'Уютный номер для двух гостей.',
        price_per_night: 38000,
        max_guests: 2,
        available_rooms: 8,
        image: cityImg,
        has_breakfast: true,
        has_wifi: true,
        has_tv: true,
        has_air_conditioning: true,
      },
      {
        id: 102,
        name_kz: 'Люкс',
        name_en: 'Suite',
        name_ru: 'Люкс',
        description_kz: 'Қонақ бөлмесі және кең жатын аймағы бар нөмір.',
        description_en: 'A spacious suite with a lounge and bedroom area.',
        description_ru: 'Просторный люкс с гостиной и спальной зоной.',
        price_per_night: 72000,
        max_guests: 3,
        available_rooms: 3,
        image: mountainImg,
        has_breakfast: true,
        has_wifi: true,
        has_tv: true,
        has_air_conditioning: true,
      },
    ],
  },
  {
    id: 2,
    name: 'Astana Skyline',
    address_kz: 'Тұран даңғылы, 18',
    address_en: '18 Turan Avenue',
    address_ru: 'проспект Туран, 18',
    description_kz: 'Іскерлік сапарлар мен демалысқа арналған заманауи отель.',
    description_en: 'A modern hotel for business trips and leisure stays.',
    description_ru: 'Современный отель для деловых поездок и отдыха.',
    city: { name: 'Astana' },
    country: 'Kazakhstan',
    phone: '+7 7172 555 20 20',
    email: 'hello@astanaskyline.local',
    website: 'https://example.com/astana-skyline',
    rating: 4.5,
    stars: 4,
    price_per_night: 32000,
    image: tourImg,
    room_types: [
      {
        id: 201,
        name_kz: 'Бизнес бөлме',
        name_en: 'Business Room',
        name_ru: 'Бизнес номер',
        description_kz: 'Жұмыс үстелі, Wi-Fi және таңғы ас қосылған.',
        description_en: 'Includes a work desk, Wi-Fi and breakfast.',
        description_ru: 'Рабочий стол, Wi-Fi и завтрак включены.',
        price_per_night: 32000,
        max_guests: 2,
        available_rooms: 10,
        image: tourImg,
        has_breakfast: true,
        has_wifi: true,
        has_tv: true,
        has_air_conditioning: true,
      },
      {
        id: 202,
        name_kz: 'Отбасылық бөлме',
        name_en: 'Family Room',
        name_ru: 'Семейный номер',
        description_kz: 'Төрт адамға дейін орналаса алатын кең бөлме.',
        description_en: 'A larger room for up to four guests.',
        description_ru: 'Просторный номер для размещения до четырёх гостей.',
        price_per_night: 56000,
        max_guests: 4,
        available_rooms: 5,
        image: cityImg,
        has_breakfast: true,
        has_wifi: true,
        has_tv: true,
        has_air_conditioning: true,
      },
    ],
  },
  {
    id: 3,
    name: 'Caspian Aktau Resort',
    address_kz: 'Каспий жағалауы, 7',
    address_en: '7 Caspian Coast',
    address_ru: 'Каспийское побережье, 7',
    description_kz: 'Теңіз жағасындағы демалысқа арналған тыныш курорт.',
    description_en: 'A calm seaside resort for a Caspian getaway.',
    description_ru: 'Спокойный курорт у моря для отдыха на Каспии.',
    city: { name: 'Aktau' },
    country: 'Kazakhstan',
    phone: '+7 7292 555 30 30',
    email: 'booking@caspianresort.local',
    website: 'https://example.com/caspian-resort',
    rating: 4.8,
    stars: 5,
    price_per_night: 64000,
    image: mountainImg,
    room_types: [
      {
        id: 301,
        name_kz: 'Теңіз көрінісі',
        name_en: 'Sea View Room',
        name_ru: 'Номер с видом на море',
        description_kz: 'Каспий теңізіне көрінісі бар нөмір.',
        description_en: 'A room with a view of the Caspian Sea.',
        description_ru: 'Номер с видом на Каспийское море.',
        price_per_night: 64000,
        max_guests: 2,
        available_rooms: 6,
        image: mountainImg,
        has_breakfast: true,
        has_wifi: true,
        has_tv: true,
        has_air_conditioning: true,
      },
    ],
  },
];

export const getStoredHotels = () => {
  try {
    const storedHotels = JSON.parse(localStorage.getItem(HOTELS_KEY) || 'null');
    return Array.isArray(storedHotels) ? storedHotels : mockHotels;
  } catch {
    return mockHotels;
  }
};

const saveStoredHotels = (hotels) => {
  localStorage.setItem(HOTELS_KEY, JSON.stringify(hotels));
};

export const getMockHotelById = (id) =>
  getStoredHotels().find((hotel) => String(hotel.id) === String(id));

export const getMockRoomById = (hotelId, roomId) =>
  getMockHotelById(hotelId)?.room_types.find((room) => String(room.id) === String(roomId));

export const createStoredHotel = (hotelData) => {
  const hotels = getStoredHotels();
  const baseRoomPrice = Number(hotelData.room_price || hotelData.price_per_night) || 30000;
  const newHotel = {
    id: Date.now(),
    name: hotelData.name,
    address_kz: hotelData.address_kz || hotelData.address_en,
    address_en: hotelData.address_en,
    address_ru: hotelData.address_ru || hotelData.address_en,
    description_kz: hotelData.description_kz || hotelData.description_en,
    description_en: hotelData.description_en,
    description_ru: hotelData.description_ru || hotelData.description_en,
    city: { name: hotelData.city || 'Kazakhstan' },
    country: hotelData.country || 'Kazakhstan',
    phone: hotelData.phone || '',
    email: hotelData.email || '',
    website: hotelData.website || '',
    rating: Number(hotelData.rating) || 4.5,
    stars: Number(hotelData.stars) || 4,
    price_per_night: Number(hotelData.price_per_night) || baseRoomPrice,
    image: hotelData.image || mockHotels[0].image,
    owner_id: hotelData.owner_id,
    owner_name: hotelData.owner_name,
    room_types: [
      {
        id: Date.now() + 1,
        name_kz: hotelData.room_name_kz || hotelData.room_name_en || 'Standard Room',
        name_en: hotelData.room_name_en || 'Standard Room',
        name_ru: hotelData.room_name_ru || hotelData.room_name_en || 'Standard Room',
        description_kz: hotelData.room_description_kz || hotelData.room_description_en || 'Comfortable room.',
        description_en: hotelData.room_description_en || 'Comfortable room.',
        description_ru: hotelData.room_description_ru || hotelData.room_description_en || 'Comfortable room.',
        price_per_night: baseRoomPrice,
        max_guests: Number(hotelData.max_guests) || 2,
        available_rooms: Number(hotelData.available_rooms) || 5,
        image: hotelData.image || mockHotels[0].image,
        has_breakfast: true,
        has_wifi: true,
        has_tv: true,
        has_air_conditioning: true,
      },
    ],
    created_at: new Date().toISOString(),
  };

  saveStoredHotels([newHotel, ...hotels]);
  return newHotel;
};

export const updateStoredHotel = (id, updates) => {
  const hotels = getStoredHotels();
  const updatedHotels = hotels.map((hotel) =>
    String(hotel.id) === String(id)
      ? {
          ...hotel,
          ...updates,
          city: { name: updates.city || hotel.city?.name || 'Kazakhstan' },
          price_per_night: Number(updates.price_per_night) || hotel.price_per_night,
          rating: Number(updates.rating) || hotel.rating,
          stars: Number(updates.stars) || hotel.stars,
          updated_at: new Date().toISOString(),
        }
      : hotel
  );

  saveStoredHotels(updatedHotels);
  return updatedHotels.find((hotel) => String(hotel.id) === String(id));
};

export const deleteStoredHotel = (id) => {
  const nextHotels = getStoredHotels().filter((hotel) => String(hotel.id) !== String(id));
  saveStoredHotels(nextHotels);
  return nextHotels;
};

export const resetStoredHotels = () => {
  saveStoredHotels(mockHotels);
  return mockHotels;
};

export const getStoredHotelBookings = () => {
  try {
    return JSON.parse(localStorage.getItem(HOTEL_BOOKINGS_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveStoredHotelBookings = (bookings) => {
  localStorage.setItem(HOTEL_BOOKINGS_KEY, JSON.stringify(bookings));
};

export const createStoredHotelBooking = (payload) => {
  const hotel = getMockHotelById(payload.hotel_id);
  const room_type = getMockRoomById(payload.hotel_id, payload.room_type_id);
  const bookings = getStoredHotelBookings();
  const booking = {
    ...payload,
    id: Date.now(),
    type: 'hotel',
    hotel,
    room_type,
    total_price: payload.price_total,
    payment_status: 'unpaid',
    created_at: new Date().toISOString(),
  };

  saveStoredHotelBookings([booking, ...bookings]);
  return booking;
};

export const getStoredHotelBookingById = (id) =>
  getStoredHotelBookings().find((booking) => String(booking.id) === String(id));

export const updateStoredHotelBooking = (id, updates) => {
  const bookings = getStoredHotelBookings();
  const updatedBookings = bookings.map((booking) =>
    String(booking.id) === String(id) ? { ...booking, ...updates } : booking
  );

  saveStoredHotelBookings(updatedBookings);
  return updatedBookings.find((booking) => String(booking.id) === String(id));
};
