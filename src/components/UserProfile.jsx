import React, { useContext, useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import HotelIcon from '@mui/icons-material/Hotel';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaidIcon from '@mui/icons-material/Paid';
import TourIcon from '@mui/icons-material/Tour';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../contexts/UserContext';
import { getStoredHotelBookings, getStoredTourBookings } from '../data/mockTours';

const UserProfile = () => {
  const { user, loading } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const effectiveLang = i18n.language === 'kk' ? 'kz' : i18n.language;

  useEffect(() => {
    const allBookings = [
      ...getStoredTourBookings().map((booking) => ({ ...booking, type: 'tour' })),
      ...getStoredHotelBookings().map((booking) => ({ ...booking, type: 'hotel' })),
    ]
      .filter((booking) => booking.user_id === user?.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    setBookings(allBookings);
  }, [user?.id]);

  const getBookingTitle = (booking) => {
    if (booking.type === 'tour') {
      return booking.tour?.[`name_${effectiveLang}`] || booking.tour?.name_kz || booking.tour?.name_en || t('user_profile.no_name');
    }

    const roomName = booking.room_type?.[`name_${effectiveLang}`] || booking.room_type?.name_kz || booking.room_type?.name_en || '';
    return `${booking.hotel?.name || t('my_bookings.no_hotel_name')} ${roomName ? `- ${roomName}` : ''}`;
  };

  const getBookingLocation = (booking) => {
    if (booking.type === 'tour') {
      return booking.tour?.location?.[`name_${effectiveLang}`] || booking.tour?.location?.name_kz || booking.tour?.location?.name_en || t('my_bookings.unknown_location');
    }

    return booking.hotel?.[`address_${effectiveLang}`] || booking.hotel?.address_kz || booking.hotel?.address_en || t('my_bookings.unknown_address');
  };

  const getBookingDate = (booking) => {
    const locale = effectiveLang === 'kz' ? 'ru-RU' : 'en-US';

    if (booking.type === 'tour') {
      return new Date(booking.booking_date).toLocaleDateString(locale);
    }

    const checkIn = new Date(booking.check_in_date).toLocaleDateString(locale);
    const checkOut = new Date(booking.check_out_date).toLocaleDateString(locale);
    return `${checkIn} - ${checkOut}`;
  };

  const getBookingImage = (booking) => {
    if (booking.type === 'tour') return booking.tour?.image;
    return booking.hotel?.image;
  };

  const openBooking = (booking) => {
    navigate(booking.type === 'tour' ? `/booking-tour/${booking.id}` : `/booking-room/${booking.id}`);
  };

  if (loading) {
    return (
      <Container sx={{ paddingY: 14 }}>
        <Typography textAlign="center">Loading...</Typography>
      </Container>
    );
  }

  if (!user) {
    return (
      <Typography textAlign="center" mt={14}>
        {t('user_profile.no_user_data_available')}
      </Typography>
    );
  }

  const confirmedCount = bookings.filter((booking) => booking.status === 'confirmed').length;
  const pendingCount = bookings.filter((booking) => booking.status === 'pending').length;

  return (
    <Box sx={{ maxWidth: 1100, margin: 'auto', padding: 3, mt: 14 }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3, padding: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: 36 }}>
            {user.name?.charAt(0) || 'D'}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" fontWeight={600}>{user.name}</Typography>
            <Typography variant="body2" color="text.secondary">{user.email}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('user_profile.role')}: {user.role || t('user_profile.not_specified')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
              <Chip label={`Брони: ${bookings.length}`} color="primary" variant="outlined" />
              <Chip label={`Оплачено: ${confirmedCount}`} color="success" variant="outlined" />
              <Chip label={`Ожидает: ${pendingCount}`} color="warning" variant="outlined" />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button component={NavLink} to="/my-bookings" startIcon={<AddIcon />} variant="contained" sx={{ borderRadius: 2 }}>
              Все брони
            </Button>
            <Button component={NavLink} to="/edit-profile" startIcon={<EditIcon />} variant="outlined" sx={{ borderRadius: 2 }}>
              {t('user_profile.edit_profile')}
            </Button>
            {user.role === 'guide' && (
              <Button component={NavLink} to="/guide/tours" variant="contained" color="secondary" sx={{ borderRadius: 2 }}>
                Мои туры гида
              </Button>
            )}
            {user.role === 'hotel_owner' && (
              <Button component={NavLink} to="/owner/hotels" variant="contained" color="secondary" sx={{ borderRadius: 2 }}>
                Мои отели
              </Button>
            )}
          </Box>
        </Box>
      </Card>

      <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <Typography variant="h6" fontWeight={600}>
              Брони отелей и туров
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" onClick={() => navigate('/tours')}>Туры</Button>
              <Button variant="outlined" onClick={() => navigate('/hotels')}>Отели</Button>
            </Box>
          </Box>

          {bookings.length > 0 ? (
            <Grid container spacing={2}>
              {bookings.map((booking) => (
                <Grid item xs={12} md={6} key={`${booking.type}-${booking.id}`}>
                  <Card sx={{ height: '100%', borderRadius: 2, overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: 0 }}>
                    <Box sx={{ display: 'flex', minHeight: 170 }}>
                      <Box
                        component="img"
                        src={getBookingImage(booking)}
                        alt={getBookingTitle(booking)}
                        sx={{ width: 150, objectFit: 'cover', display: { xs: 'none', sm: 'block' } }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mb: 1 }}>
                          <Chip
                            size="small"
                            icon={booking.type === 'tour' ? <TourIcon /> : <HotelIcon />}
                            label={booking.type === 'tour' ? 'Тур' : 'Отель'}
                            color={booking.type === 'tour' ? 'primary' : 'secondary'}
                            variant="outlined"
                          />
                          <Chip
                            size="small"
                            label={`${booking.status} / ${booking.payment_status}`}
                            color={booking.status === 'confirmed' ? 'success' : booking.status === 'cancelled' ? 'error' : 'warning'}
                          />
                        </Box>
                        <Typography variant="subtitle1" fontWeight={700}>{getBookingTitle(booking)}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <LocationOnIcon sx={{ mr: 0.5, fontSize: 'inherit' }} /> {getBookingLocation(booking)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <CalendarTodayIcon sx={{ mr: 0.5, fontSize: 'inherit' }} /> {getBookingDate(booking)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <PaidIcon sx={{ mr: 0.5, fontSize: 'inherit' }} /> ₸{Number(booking.total_price).toLocaleString('kk-KZ')}
                        </Typography>
                        <Divider sx={{ my: 1.5 }} />
                        <Button variant="contained" size="small" onClick={() => openBooking(booking)}>
                          Открыть
                        </Button>
                      </CardContent>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Броней пока нет
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Забронируйте тур или отель, и он сразу появится здесь.
              </Typography>
              <Button variant="contained" onClick={() => navigate('/tours')} sx={{ mr: 1 }}>
                Выбрать тур
              </Button>
              <Button variant="outlined" onClick={() => navigate('/hotels')}>
                Выбрать отель
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfile;
