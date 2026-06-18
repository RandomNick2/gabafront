import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  IconButton,
  Rating,
  Typography,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import PublicIcon from '@mui/icons-material/Public';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getStoredHotels } from '../data/mockTours';

const HotelList = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const effectiveLang = i18n.language === 'kk' ? 'kz' : i18n.language;

  return (
    <Container sx={{ py: 14 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          <ArrowBackIosIcon />
        </IconButton>
        {t('hotel_list.list_hotel')}
      </Typography>

      <Grid container spacing={3}>
        {getStoredHotels().map((hotel) => (
          <Grid item xs={12} sm={6} md={4} key={hotel.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 6, boxShadow: 3, transition: 'transform 0.3s ease-in-out', '&:hover': { transform: 'translateY(-5px)' } }} onClick={() => navigate(`/hotels/${hotel.id}`)}>
              <CardMedia component="img" height="180" image={hotel.image} alt={hotel.name || t('hotel_list.no_name')} sx={{ objectFit: 'cover' }} />
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography gutterBottom variant="h6" component="div" fontWeight="bold">
                  {hotel.name || t('hotel_list.no_name')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <LocationOnIcon sx={{ mr: 0.5, fontSize: 'inherit' }} /> {hotel[`address_${effectiveLang}`] || hotel.address_kz || hotel.address_en || t('hotel_list.unknown_address')}, {hotel.city?.name}, {hotel.country}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {(hotel[`description_${effectiveLang}`] || hotel.description_kz || hotel.description_en || t('hotel_list.no_description')).substring(0, 100)}...
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                  <Rating name={`hotel-rating-${hotel.id}`} value={hotel.rating || 0} precision={0.1} readOnly size="small" />
                  <Typography variant="caption" color="text.secondary" ml={0.5}>({hotel.rating || 0})</Typography>
                </Box>
                <Typography variant="subtitle1" mt={1} fontWeight="bold" color="primary.main">
                  ₸{Number(hotel.price_per_night).toLocaleString('kk-KZ')} / {t('hotel_list.night')}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, pt: 0, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
                {hotel.phone && <Button size="small" color="primary" startIcon={<PhoneIcon />} href={`tel:${hotel.phone}`} sx={{ justifyContent: 'flex-start' }}>{hotel.phone}</Button>}
                {hotel.email && <Button size="small" color="secondary" startIcon={<EmailIcon />} href={`mailto:${hotel.email}`} sx={{ justifyContent: 'flex-start' }}>{hotel.email}</Button>}
                {hotel.website && <Button size="small" color="info" startIcon={<PublicIcon />} href={hotel.website} target="_blank" rel="noopener noreferrer" sx={{ justifyContent: 'flex-start' }}>{t('hotel_list.web_site')}</Button>}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HotelList;
