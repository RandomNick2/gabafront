import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  IconButton,
  Rating,
  Typography,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import PublicIcon from '@mui/icons-material/Public';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getMockHotelById } from '../data/mockTours';

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const hotel = getMockHotelById(id);
  const effectiveLang = i18n.language === 'kk' ? 'kz' : i18n.language;

  if (!hotel) {
    return (
      <Container sx={{ py: 14 }}>
        <Typography variant="h6">{t('hotel_detail.hotel_not_found')}</Typography>
      </Container>
    );
  }

  const hotelAddress = hotel[`address_${effectiveLang}`] || hotel.address_kz || hotel.address_en || t('hotel_detail.unknown_address');
  const hotelDescription = hotel[`description_${effectiveLang}`] || hotel.description_kz || hotel.description_en || t('hotel_detail.no_description');

  return (
    <Container sx={{ py: 14 }}>
      <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        <ArrowBackIosIcon />
      </IconButton>
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardMedia component="img" alt={hotel.name} height="400" image={hotel.image} sx={{ objectFit: 'cover' }} />
        <CardContent sx={{ p: 3 }}>
          <Typography gutterBottom variant="h4" component="h2" fontWeight="bold">{hotel.name}</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <LocationOnIcon sx={{ mr: 0.5, fontSize: 'inherit' }} /> {hotelAddress}, {hotel.city?.name}, {hotel.country}
          </Typography>
          <Box display="flex" alignItems="center" mb={1}>
            <Rating name={`hotel-rating-${hotel.id}`} value={parseFloat(hotel.rating) || 0} precision={0.1} readOnly />
            <Typography variant="body2" color="text.secondary" ml={0.5}>({hotel.rating || 0})</Typography>
          </Box>
          <Typography variant="body1" paragraph>{hotelDescription}</Typography>
          <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
            ₸{Number(hotel.price_per_night).toLocaleString('kk-KZ')} / {t('hotel_detail.night')}
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom fontWeight="bold">{t('hotel_detail.room_types_heading')}</Typography>
          {hotel.room_types.map((room) => {
            const roomName = room[`name_${effectiveLang}`] || room.name_kz || room.name_en || t('hotel_detail.no_name_room');
            const roomDescription = room[`description_${effectiveLang}`] || room.description_kz || room.description_en || t('hotel_detail.no_description_room');

            return (
              <Card key={room.id} sx={{ boxShadow: 3, borderRadius: 2, mb: 2 }}>
                <CardMedia component="img" alt={roomName} height="200" image={room.image} sx={{ objectFit: 'cover' }} />
                <CardContent sx={{ p: 2 }}>
                  <Typography gutterBottom variant="h6" component="h2" fontWeight="bold">{roomName}</Typography>
                  <Typography variant="subtitle1" color="text.secondary" fontWeight="bold">
                    ₸{Number(room.price_per_night).toLocaleString('kk-KZ')} / {t('hotel_detail.night')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>{t('hotel_detail.max_guests')}: {room.max_guests}</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>{roomDescription}</Typography>
                  <Typography variant="body2" color="text.secondary">{t('hotel_detail.available_rooms')}: {room.available_rooms}</Typography>
                </CardContent>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="contained" color="primary" onClick={() => navigate(`/hotel-booking/${hotel.id}/room/${room.id}`)}>
                    {t('hotel_detail.book_now_button')}
                  </Button>
                </Box>
              </Card>
            );
          })}

          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
            {hotel.phone && <Button color="primary" startIcon={<PhoneIcon />} href={`tel:${hotel.phone}`} fullWidth={false}>{hotel.phone}</Button>}
            {hotel.email && <Button color="secondary" startIcon={<EmailIcon />} href={`mailto:${hotel.email}`} fullWidth={false}>{hotel.email}</Button>}
            {hotel.website && <Button color="info" startIcon={<PublicIcon />} href={hotel.website} target="_blank" rel="noopener noreferrer" fullWidth={false}>{t('hotel_detail.web_site')}</Button>}
          </Box>
        </CardContent>
      </Card>
      <Divider sx={{ my: 4 }} />
    </Container>
  );
};

export default HotelDetail;
