import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
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
import { getStoredTourBookingById, updateStoredTourBooking } from '../data/mockTours';

const BookingTourDetail = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [alert, setAlert] = useState({ open: false, severity: 'info', message: '' });

  useEffect(() => {
    setBooking(getStoredTourBookingById(bookingId) || null);
    setLoading(false);
  }, [bookingId]);

  const showAlert = (severity, message) => {
    setAlert({ open: true, severity, message });
  };

  const handleCancelBooking = () => {
    const updatedBooking = updateStoredTourBooking(bookingId, {
      status: 'cancelled',
      payment_status: 'cancelled',
    });
    setBooking(updatedBooking);
    showAlert('success', t('booking_tour_detail.booking_cancelled_success'));
  };

  const handlePay = () => {
    if (!cardName.trim() || cardNumber.replace(/\s/g, '').length < 12) {
      showAlert('error', 'Введите имя владельца карты и номер карты');
      return;
    }

    const updatedBooking = updateStoredTourBooking(bookingId, {
      status: 'confirmed',
      payment_status: 'paid',
      paid_at: new Date().toISOString(),
      payment_method: 'frontend-demo-card',
    });

    setBooking(updatedBooking);
    showAlert('success', 'Оплата успешно выполнена');
  };

  if (loading) {
    return (
      <Container sx={{ paddingY: 14 }}>
        <Typography textAlign="center">{t('common.loading')}</Typography>
      </Container>
    );
  }

  if (!booking) {
    return (
      <>
        <Header />
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 16 }}>
          {t('booking_tour_detail.booking_details_not_found')}
        </Typography>
        <Footer />
      </>
    );
  }

  const { tour, booking_date, guests_count, total_price, notes, status } = booking;
  const effectiveLang = i18n.language === 'kk' ? 'kz' : i18n.language;
  const tourName = tour?.[`name_${effectiveLang}`] || tour?.name_kz || tour?.name_en || t('booking_tour_detail.no_name');
  const tourDescription = tour?.[`description_${effectiveLang}`] || tour?.description_kz || tour?.description_en || t('booking_tour_detail.no_description');
  const tourLocationName = tour?.location?.[`name_${effectiveLang}`] || tour?.location?.name_kz || tour?.location?.name_en || t('booking_tour_detail.unknown_location');

  return (
    <>
      <Header />
      <Box sx={{ maxWidth: 1240, margin: 'auto', padding: 3, mt: 14 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4 }}>
          <Typography variant="h4" gutterBottom textAlign="center" fontWeight="bold">
            {t('booking_tour_detail.booking_details')}
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {t('tour_booking_page.tour_information')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box component="img" src={tour?.image} alt={tourName} sx={{ width: '100%', height: 250, borderRadius: 2, objectFit: 'cover' }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight="bold">{tourName}</Typography>
                <Typography variant="body1" gutterBottom>{tourDescription}</Typography>
                <Typography variant="body2">{t('tour_booking_page.location')}: {tourLocationName}</Typography>
                <Typography variant="body2">{t('tour_booking_page.price_per_person')}: {Number(tour?.price || 0).toLocaleString('kk-KZ')} KZT</Typography>
                <Typography variant="body2">{t('tour_booking_page.max_volume')}: {tour?.volume || 'N/A'}</Typography>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {t('hotel_booking_page.booking_details_heading')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2">{t('tour_booking_page.booking_date')}: {new Date(booking_date).toLocaleDateString(effectiveLang === 'kz' ? 'ru-RU' : 'en-US')}</Typography>
                <Typography variant="body2">{t('hotel_booking_page.guests_count')}: {guests_count}</Typography>
                <Typography variant="body2">{t('tour_booking_page.notes_label')}: {notes || t('create_post_page.none')}</Typography>
                <Typography variant="body2">{t('hotel_booking_page.status')}: {status}</Typography>
                <Typography variant="body2">Payment: {booking.payment_status}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  {t('tour_booking_page.total_price')}: {Number(total_price).toLocaleString('kk-KZ')} KZT
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {status === 'pending' && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Оплата картой
              </Typography>
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
            <Box mt={3} display="flex" gap={2}>
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

export default BookingTourDetail;
