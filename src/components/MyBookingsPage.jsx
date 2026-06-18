import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GetAppIcon from '@mui/icons-material/GetApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getStoredHotelBookings, getStoredTourBookings } from '../data/mockTours';
import { UserContext } from '../contexts/UserContext';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const allBookings = [
      ...getStoredTourBookings().map((booking) => ({ ...booking, type: 'tour' })),
      ...getStoredHotelBookings().map((booking) => ({ ...booking, type: 'hotel' })),
    ]
      .filter((booking) => booking.user_id === user?.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    setBookings(allBookings);
  }, [user?.id]);

  const effectiveLang = i18n.language === 'kk' ? 'kz' : i18n.language;

  const getBookingTitle = (booking) =>
    booking.type === 'tour'
      ? booking.tour?.[`name_${effectiveLang}`] || booking.tour?.name_kz || booking.tour?.name_en || t('my_bookings.no_tour_name')
      : `${booking.hotel?.name || t('my_bookings.no_hotel_name')} - ${
          booking.room_type?.[`name_${effectiveLang}`] || booking.room_type?.name_kz || booking.room_type?.name_en || ''
        }`;

  const getBookingLocation = (booking) =>
    booking.type === 'tour'
      ? booking.tour?.location?.[`name_${effectiveLang}`] || booking.tour?.location?.name_kz || booking.tour?.location?.name_en || t('my_bookings.unknown_location')
      : booking.hotel?.[`address_${effectiveLang}`] || booking.hotel?.address_kz || booking.hotel?.address_en || t('my_bookings.unknown_address');

  const getBookingDateRange = (booking) => {
    if (booking.type === 'tour') {
      return new Date(booking.booking_date).toLocaleDateString(effectiveLang === 'kz' ? 'ru-RU' : 'en-US');
    }

    const checkIn = new Date(booking.check_in_date).toLocaleDateString(effectiveLang === 'kz' ? 'ru-RU' : 'en-US');
    const checkOut = new Date(booking.check_out_date).toLocaleDateString(effectiveLang === 'kz' ? 'ru-RU' : 'en-US');
    return `${checkIn} - ${checkOut}`;
  };

  const handleDownloadReceipt = (booking) => {
    const receipt = [
      'QazTour receipt',
      `Booking ID: ${booking.id}`,
      `Tour: ${getBookingTitle(booking)}`,
      `Type: ${booking.type}`,
      `Guests: ${booking.guests_count}`,
      `Total: ${booking.total_price} KZT`,
      `Status: ${booking.status}`,
      `Payment: ${booking.payment_status}`,
    ].join('\n');

    const blob = new Blob([receipt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qaztour-${booking.type}-receipt-${booking.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container sx={{ py: 14 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center" mb={4}>
        {t('my_bookings.my_bookings_title')}
      </Typography>

      {bookings.length > 0 ? (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item xs={12} sm={6} md={4} key={`${booking.type}-${booking.id}`}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: 3, transition: 'transform 0.2s ease-in-out', '&:hover': { transform: 'translateY(-5px)' } }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" fontWeight="bold">
                    {getBookingTitle(booking)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <LocationOnIcon sx={{ mr: 0.5, fontSize: 'inherit' }} /> {getBookingLocation(booking)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <CalendarTodayIcon sx={{ mr: 0.5, fontSize: 'inherit' }} /> {t('my_bookings.date')}: {getBookingDateRange(booking)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <AttachMoneyIcon sx={{ mr: 0.5, fontSize: 'inherit' }} /> {t('my_bookings.total_price')}: {Number(booking.total_price).toLocaleString('kk-KZ')} KZT
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {t('my_bookings.guests')}: {booking.guests_count}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {t('my_bookings.status')}: {booking.status} / {booking.payment_status}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
                    <Button variant="outlined" size="small" onClick={() => navigate(booking.type === 'tour' ? `/booking-tour/${booking.id}` : `/booking-room/${booking.id}`)}>
                      {t('my_bookings.view_details')}
                    </Button>
                    {booking.status === 'confirmed' && (
                      <Button variant="contained" size="small" startIcon={<GetAppIcon />} onClick={() => handleDownloadReceipt(booking)}>
                        {t('my_bookings.download_receipt')}
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mt: 5 }}>
          {t('my_bookings.no_bookings_found')}
        </Typography>
      )}
    </Container>
  );
};

export default MyBookingsPage;
