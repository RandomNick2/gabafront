import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import { getStoredHotelBookingById, updateStoredHotelBooking } from '../data/mockTours';

const BookingRoom = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [booking, setBooking] = useState(null);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [alert, setAlert] = useState({ open: false, severity: 'info', message: '' });

  useEffect(() => {
    setBooking(getStoredHotelBookingById(bookingId) || null);
  }, [bookingId]);

  const showAlert = (severity, message) => {
    setAlert({ open: true, severity, message });
  };

  const handleCancelBooking = () => {
    const updatedBooking = updateStoredHotelBooking(bookingId, {
      status: 'cancelled',
      payment_status: 'cancelled',
    });
    setBooking(updatedBooking);
    showAlert('success', t('booking_room.booking_cancelled_success'));
  };

  const handlePay = () => {
    if (!cardName.trim() || cardNumber.replace(/\s/g, '').length < 12) {
      showAlert('error', 'Введите имя владельца карты и номер карты');
      return;
    }

    const updatedBooking = updateStoredHotelBooking(bookingId, {
      status: 'confirmed',
      payment_status: 'paid',
      paid_at: new Date().toISOString(),
      payment_method: 'frontend-demo-card',
    });

    setBooking(updatedBooking);
    showAlert('success', 'Оплата успешно выполнена');
  };

  if (!booking) {
    return (
      <>
        <Header />
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 16 }}>{t('booking_room.booking_details_not_found')}</Typography>
        <Footer />
      </>
    );
  }

  const { hotel, room_type, check_in_date, check_out_date, guests_count, total_price, notes, status } = booking;
  const effectiveLang = i18n.language === 'kk' ? 'kz' : i18n.language;
  const hotelAddress = hotel?.[`address_${effectiveLang}`] || hotel?.address_kz || hotel?.address_en || t('booking_room.unknown_address');
  const hotelDescription = hotel?.[`description_${effectiveLang}`] || hotel?.description_kz || hotel?.description_en || t('booking_room.no_description');
  const roomTypeName = room_type?.[`name_${effectiveLang}`] || room_type?.name_kz || room_type?.name_en || t('booking_room.no_name_room');
  const roomTypeDescription = room_type?.[`description_${effectiveLang}`] || room_type?.description_kz || room_type?.description_en || t('booking_room.no_description_room');

  return (
    <>
      <Header />
      <Box sx={{ maxWidth: 1240, margin: 'auto', padding: 3, mt: 14 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4 }}>
          <Typography variant="h4" gutterBottom textAlign="center" fontWeight="bold">
            {t('booking_room.booking_details')}
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">{t('booking_room.hotel_information')}</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box component="img" src={hotel?.image} alt={hotel?.name} sx={{ width: '100%', height: 250, borderRadius: 2, objectFit: 'cover' }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight="bold">{hotel?.name}</Typography>
                <Typography variant="body1" gutterBottom>{hotelDescription}</Typography>
                <Typography variant="body2">{hotelAddress}, {hotel?.city?.name}, {hotel?.country}</Typography>
                <Typography variant="body2">{t('hotel_booking_page.stars')}: {hotel?.stars || 'N/A'}</Typography>
                <Typography variant="body2">{t('hotel_booking_page.price_per_night')}: ₸{Number(hotel?.price_per_night || 0).toLocaleString('kk-KZ')}</Typography>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">{t('booking_room.room_type_heading')}</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box component="img" src={room_type?.image} alt={roomTypeName} sx={{ width: '100%', height: 250, borderRadius: 2, objectFit: 'cover' }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight="bold">{roomTypeName}</Typography>
                <Typography variant="body1" gutterBottom>{roomTypeDescription}</Typography>
                <Typography variant="body2">{t('hotel_detail.max_guests')}: {room_type?.max_guests || 'N/A'}</Typography>
                <Typography variant="body2">{t('hotel_detail.available_rooms')}: {room_type?.available_rooms || 'N/A'}</Typography>
                <Typography variant="body2">{t('hotel_booking_page.price_per_night')}: ₸{Number(room_type?.price_per_night || 0).toLocaleString('kk-KZ')}</Typography>
                <Typography variant="body2">{t('booking_room.breakfast')}: {room_type?.has_breakfast ? t('booking_room.yes') : t('booking_room.no')}</Typography>
                <Typography variant="body2">{t('booking_room.wifi')}: {room_type?.has_wifi ? t('booking_room.yes') : t('booking_room.no')}</Typography>
                <Typography variant="body2">{t('booking_room.tv')}: {room_type?.has_tv ? t('booking_room.yes') : t('booking_room.no')}</Typography>
                <Typography variant="body2">{t('booking_room.air_conditioning')}: {room_type?.has_air_conditioning ? t('booking_room.yes') : t('booking_room.no')}</Typography>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">{t('booking_room.booking_details_heading')}</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2">{t('hotel_booking_page.check_in_date')}: {new Date(check_in_date).toLocaleDateString(effectiveLang === 'kz' ? 'ru-RU' : 'en-US')}</Typography>
                <Typography variant="body2">{t('hotel_booking_page.check_out_date')}: {new Date(check_out_date).toLocaleDateString(effectiveLang === 'kz' ? 'ru-RU' : 'en-US')}</Typography>
                <Typography variant="body2">{t('hotel_booking_page.guests_count')}: {guests_count}</Typography>
                <Typography variant="body2">{t('hotel_booking_page.notes_label')}: {notes || t('booking_room.none')}</Typography>
                <Typography variant="body2">{t('hotel_booking_page.status')}: {status} / {booking.payment_status}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  {t('hotel_booking_page.total_price')}: ₸{Number(total_price).toLocaleString('kk-KZ')}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {status === 'pending' && (
            <>
              <Typography variant="h6" gutterBottom fontWeight="bold">Оплата картой</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Имя на карте" value={cardName} onChange={(event) => setCardName(event.target.value)} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Номер карты" value={cardNumber} onChange={(event) => setCardNumber(event.target.value)} placeholder="4242 4242 4242 4242" />
                </Grid>
              </Grid>
              <Box mt={3} display="flex" gap={2}>
                <Button variant="contained" color="error" size="large" fullWidth sx={{ borderRadius: 2, py: 1.5, fontWeight: 'bold' }} onClick={handleCancelBooking}>
                  {t('hotel_booking_page.cencel')}
                </Button>
                <Button variant="contained" color="success" size="large" fullWidth sx={{ borderRadius: 2, py: 1.5, fontWeight: 'bold' }} onClick={handlePay}>
                  Оплатить
                </Button>
              </Box>
            </>
          )}

          {status === 'confirmed' && (
            <Box mt={3}>
              <Button variant="contained" fullWidth onClick={() => navigate('/my-bookings')}>
                Перейти к моим бронированиям
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
      <Snackbar open={alert.open} autoHideDuration={4000} onClose={() => setAlert({ ...alert, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setAlert({ ...alert, open: false })} severity={alert.severity} sx={{ width: '100%' }} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>
      <Footer />
    </>
  );
};

export default BookingRoom;
