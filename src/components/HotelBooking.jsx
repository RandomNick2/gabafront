import React, { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createStoredHotelBooking, getMockHotelById, getMockRoomById } from '../data/mockTours';

const HotelBooking = () => {
  const { hotelId, roomId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [notes, setNotes] = useState('');
  const [alert, setAlert] = useState({ open: false, severity: 'info', message: '' });

  const hotel = getMockHotelById(hotelId);
  const roomType = getMockRoomById(hotelId, roomId);
  const effectiveLang = i18n.language === 'kk' ? 'kz' : i18n.language;

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    return (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
  }, [checkIn, checkOut]);

  const totalPrice = Math.max(0, nights) * Number(roomType?.price_per_night || 0);

  const showAlert = (severity, message) => {
    setAlert({ open: true, severity, message });
  };

  const handleSubmit = () => {
    if (!hotel || !roomType) return;
    if (!checkIn || !checkOut) {
      showAlert('error', t('hotel_booking_page.please_fill_dates'));
      return;
    }
    if (nights <= 0) {
      showAlert('error', t('hotel_booking_page.invalid_dates_selected'));
      return;
    }
    if (Number(guests) < 1 || Number(guests) > Number(roomType.max_guests)) {
      showAlert('error', `Количество гостей должно быть от 1 до ${roomType.max_guests}`);
      return;
    }
    const currentUserId = localStorage.getItem('userId');
    if (!currentUserId) {
      showAlert('warning', 'Сначала войдите в аккаунт');
      setTimeout(() => navigate('/auth'), 500);
      return;
    }

    const booking = createStoredHotelBooking({
      user_id: currentUserId,
      hotel_id: hotel.id,
      room_type_id: roomType.id,
      check_in_date: checkIn,
      check_out_date: checkOut,
      guests_count: Number(guests),
      notes,
      price_total: totalPrice,
      status: 'pending',
    });

    showAlert('success', t('hotel_booking_page.booking_successful'));
    setTimeout(() => navigate(`/booking-room/${booking.id}`), 400);
  };

  if (!hotel || !roomType) {
    return (
      <Typography sx={{ mt: 12, textAlign: 'center' }}>
        {t('hotel_booking_page.notfound_info')}
      </Typography>
    );
  }

  const roomTypeName = roomType[`name_${effectiveLang}`] || roomType.name_kz || roomType.name_en || t('hotel_booking_page.no_name_room');
  const roomTypeDescription = roomType[`description_${effectiveLang}`] || roomType.description_kz || roomType.description_en || t('hotel_booking_page.no_description_room');

  return (
    <>
      <Box sx={{ maxWidth: 1240, margin: 'auto', padding: 3, mt: 14 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4 }}>
          <Typography variant="h4" gutterBottom textAlign="center" fontWeight="bold">
            {t('hotel_booking_page.new_booking')}
          </Typography>

          <Box mb={2}>
            <Typography><strong>{t('hotel_booking_page.hotel_name')}:</strong> {hotel.name}</Typography>
            <Typography><strong>{t('hotel_booking_page.room')}:</strong> {roomTypeName}</Typography>
            <Typography><strong>{t('hotel_booking_page.price_for_night')}:</strong> ₸{Number(roomType.price_per_night).toLocaleString('kk-KZ')}</Typography>
            <Typography><strong>{t('hotel_booking_page.max_guests')}:</strong> {roomType.max_guests}</Typography>
            <Typography><strong>{t('hotel_booking_page.available_rooms')}:</strong> {roomType.available_rooms}</Typography>
            <Typography><strong>{t('hotel_booking_page.description')}:</strong> {roomTypeDescription}</Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label={t('hotel_booking_page.check_in_date')} type="date" fullWidth value={checkIn} onChange={(e) => setCheckIn(e.target.value)} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label={t('hotel_booking_page.check_out_date')} type="date" fullWidth value={checkOut} onChange={(e) => setCheckOut(e.target.value)} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField label={t('hotel_booking_page.number_of_guests')} type="number" fullWidth value={guests} onChange={(e) => setGuests(e.target.value)} inputProps={{ min: 1, max: roomType.max_guests }} />
            </Grid>
            <Grid item xs={12}>
              <TextField label={t('hotel_booking_page.notes_label')} multiline rows={3} fullWidth value={notes} onChange={(e) => setNotes(e.target.value)} />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle1" gutterBottom><strong>{t('hotel_booking_page.booking_summary')}:</strong></Typography>
          <Typography>{t('hotel_booking_page.price_per_night_summary')}: ₸{Number(roomType.price_per_night).toLocaleString('kk-KZ')}</Typography>
          <Typography>{t('hotel_booking_page.nights')}: {Math.max(0, nights) || 0}</Typography>
          <Typography><strong>{t('hotel_booking_page.total_price')}: ₸{Number(totalPrice).toLocaleString('kk-KZ')}</strong></Typography>

          <Box mt={3} display="flex" gap={2}>
            <Button variant="contained" fullWidth sx={{ backgroundColor: '#007bff' }} onClick={handleSubmit}>
              {t('hotel_booking_page.right_now')}
            </Button>
            <Button variant="outlined" fullWidth color="inherit" onClick={() => navigate(`/hotels/${hotel.id}`)}>
              {t('hotel_booking_page.cencel')}
            </Button>
          </Box>
        </Paper>
      </Box>

      <Snackbar open={alert.open} autoHideDuration={4000} onClose={() => setAlert({ ...alert, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setAlert({ ...alert, open: false })} severity={alert.severity} sx={{ width: '100%' }} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default HotelBooking;
