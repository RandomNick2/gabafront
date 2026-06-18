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
import { createStoredTourBooking, getMockTourById } from '../data/mockTours';

const TourBookingPageContent = ({ id }) => {
  const params = useParams();
  const tourId = id || params.tourId;
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [tour, setTour] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ open: false, severity: 'info', message: '' });

  useEffect(() => {
    const selectedTour = getMockTourById(tourId);
    setTour(selectedTour || null);
    if (selectedTour?.date) {
      setBookingDate(selectedTour.date);
    }
  }, [tourId]);

  const showAlert = (severity, message) => {
    setAlert({ open: true, severity, message });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!tour) return;
    if (!bookingDate) {
      showAlert('error', t('tour_booking_page.please_select_date'));
      return;
    }
    if (guests <= 0) {
      showAlert('error', t('tour_booking_page.invalid_guests_count'));
      return;
    }
    if (tour.volume && guests > tour.volume) {
      showAlert('error', t('tour_booking_page.guests_exceed_limit', { limit: tour.volume }));
      return;
    }
    const currentUserId = localStorage.getItem('userId');
    if (!currentUserId) {
      showAlert('warning', 'Сначала войдите в аккаунт');
      setTimeout(() => navigate('/auth'), 500);
      return;
    }

    setSubmitting(true);
    const booking = createStoredTourBooking({
      user_id: currentUserId,
      tour_id: tour.id,
      booking_date: bookingDate,
      guests_count: guests,
      notes,
      total_price: Number(tour.price) * guests,
      status: 'pending',
    });

    showAlert('success', t('tour_booking_page.booking_successful'));
    setTimeout(() => navigate(`/booking-tour/${booking.id}`), 400);
  };

  if (!tour) {
    return (
      <Typography sx={{ mt: 12, textAlign: 'center' }}>
        {t('tour_booking_page.tour_not_found_info')}
      </Typography>
    );
  }

  const effectiveLang = i18n.language === 'kk' ? 'kz' : i18n.language;
  const tourName = tour[`name_${effectiveLang}`] || tour.name_kz || tour.name_en || t('tour_booking_page.no_name');
  const tourDescription = tour[`description_${effectiveLang}`] || tour.description_kz || tour.description_en || t('tour_booking_page.no_description');
  const tourLocationName = tour.location?.[`name_${effectiveLang}`] || tour.location?.name_kz || tour.location?.name_en || t('tour_booking_page.unknown_location');
  const totalPrice = Number(tour.price) * guests;

  return (
    <>
      <Box sx={{ maxWidth: 1240, margin: 'auto', padding: 3, mt: 14 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4 }}>
          <Typography variant="h4" gutterBottom textAlign="center" fontWeight="bold">
            {t('tour_booking_page.book_tour_title')}
          </Typography>

          <Box mb={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {t('tour_booking_page.tour_information')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box component="img" src={tour.image} alt={tourName} sx={{ width: '100%', height: 250, borderRadius: 2, objectFit: 'cover' }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight="bold">{tourName}</Typography>
                <Typography variant="body1" gutterBottom>{tourDescription}</Typography>
                <Typography variant="body2">{t('tour_booking_page.location')}: {tourLocationName}</Typography>
                <Typography variant="body2">{t('tour_booking_page.price_per_person')}: {Number(tour.price).toLocaleString('kk-KZ')} KZT</Typography>
                <Typography variant="body2">{t('tour_booking_page.max_volume')}: {tour.volume || 'N/A'}</Typography>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {t('tour_booking_page.booking_form_heading')}
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label={t('tour_booking_page.booking_date')} type="date" fullWidth value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label={t('tour_booking_page.number_of_guests')} type="number" fullWidth value={guests} onChange={(e) => setGuests(parseInt(e.target.value, 10) || 1)} inputProps={{ min: 1, max: tour.volume || 100 }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label={t('tour_booking_page.notes_label')} multiline rows={3} fullWidth value={notes} onChange={(e) => setNotes(e.target.value)} />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  {t('tour_booking_page.total_price')}: {totalPrice.toLocaleString('kk-KZ')} KZT
                </Typography>
              </Box>

              <Box mt={3} display="flex" gap={2}>
                <Button variant="contained" fullWidth sx={{ backgroundColor: '#007bff' }} type="submit" disabled={submitting}>
                  {submitting ? t('tour_booking_page.submitting') : t('tour_booking_page.book_now_button')}
                </Button>
                <Button variant="outlined" fullWidth color="inherit" onClick={() => navigate(`/tour/${tour.id}`)}>
                  {t('hotel_booking_page.cencel')}
                </Button>
              </Box>
            </form>
          </Box>
        </Paper>
      </Box>

      <Container>
        <Snackbar open={alert.open} autoHideDuration={3000} onClose={() => setAlert({ ...alert, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={() => setAlert({ ...alert, open: false })} severity={alert.severity} sx={{ width: '100%' }} variant="filled">
            {alert.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default TourBookingPageContent;
