import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import {
  createStoredHotel,
  deleteStoredHotel,
  getStoredHotels,
  resetStoredHotels,
  updateStoredHotel,
} from '../data/mockTours';

const initialForm = {
  name: '',
  address_en: '',
  address_kz: '',
  address_ru: '',
  description_en: '',
  description_kz: '',
  description_ru: '',
  city: '',
  country: 'Kazakhstan',
  phone: '',
  email: '',
  website: '',
  rating: 4.5,
  stars: 4,
  price_per_night: 30000,
  image: '',
  room_name_en: 'Standard Room',
  room_description_en: 'Comfortable room.',
  room_price: 30000,
  max_guests: 2,
  available_rooms: 5,
};

const OwnerHotels = () => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState({ open: false, severity: 'info', message: '' });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'hotel_owner')) {
      navigate('/profile');
      return;
    }

    setHotels(getStoredHotels());
  }, [loading, navigate, user]);

  const showAlert = (severity, message) => {
    setAlert({ open: true, severity, message });
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => updateField('image', reader.result);
    reader.readAsDataURL(file);
  };

  const refreshHotels = () => setHotels(getStoredHotels());

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.address_en.trim() || !form.description_en.trim()) {
      showAlert('error', 'Заполните название, адрес и описание');
      return;
    }

    if (editingId) {
      updateStoredHotel(editingId, form);
      showAlert('success', 'Данные отеля обновлены');
    } else {
      createStoredHotel({
        ...form,
        owner_id: user.id,
        owner_name: user.name,
      });
      showAlert('success', 'Отель добавлен');
    }

    setForm(initialForm);
    setEditingId(null);
    refreshHotels();
  };

  const handleEdit = (hotel) => {
    setEditingId(hotel.id);
    setForm({
      ...initialForm,
      name: hotel.name || '',
      address_en: hotel.address_en || '',
      address_kz: hotel.address_kz || '',
      address_ru: hotel.address_ru || '',
      description_en: hotel.description_en || '',
      description_kz: hotel.description_kz || '',
      description_ru: hotel.description_ru || '',
      city: hotel.city?.name || '',
      country: hotel.country || 'Kazakhstan',
      phone: hotel.phone || '',
      email: hotel.email || '',
      website: hotel.website || '',
      rating: hotel.rating || 4.5,
      stars: hotel.stars || 4,
      price_per_night: hotel.price_per_night || 30000,
      image: hotel.image || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (hotelId) => {
    setHotels(deleteStoredHotel(hotelId));
    showAlert('success', 'Отель удалён');
  };

  const handleReset = () => {
    setHotels(resetStoredHotels());
    setForm(initialForm);
    setEditingId(null);
    showAlert('success', 'Отели сброшены к demo-данным');
  };

  if (loading) {
    return (
      <Container sx={{ py: 14 }}>
        <Typography textAlign="center">Loading...</Typography>
      </Container>
    );
  }

  if (!user || user.role !== 'hotel_owner') return null;

  return (
    <Container sx={{ py: 14 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Владелец отеля: управление отелями
      </Typography>

      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {editingId ? 'Редактировать отель' : 'Добавить отель'}
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Название" value={form.name} onChange={(e) => updateField('name', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Город" value={form.city} onChange={(e) => updateField('city', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Страна" value={form.country} onChange={(e) => updateField('country', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Address EN" value={form.address_en} onChange={(e) => updateField('address_en', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Address KZ" value={form.address_kz} onChange={(e) => updateField('address_kz', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Address RU" value={form.address_ru} onChange={(e) => updateField('address_ru', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth multiline minRows={3} label="Description EN" value={form.description_en} onChange={(e) => updateField('description_en', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth multiline minRows={3} label="Description KZ" value={form.description_kz} onChange={(e) => updateField('description_kz', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth multiline minRows={3} label="Description RU" value={form.description_ru} onChange={(e) => updateField('description_ru', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth label="Телефон" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth label="Email" value={form.email} onChange={(e) => updateField('email', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth label="Website" value={form.website} onChange={(e) => updateField('website', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={1.5}>
                <TextField fullWidth type="number" label="Звёзды" value={form.stars} onChange={(e) => updateField('stars', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={1.5}>
                <TextField fullWidth type="number" label="Рейтинг" value={form.rating} onChange={(e) => updateField('rating', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth type="number" label="Цена от" value={form.price_per_night} onChange={(e) => updateField('price_per_night', e.target.value)} />
              </Grid>
              {!editingId && (
                <>
                  <Grid item xs={12} md={3}>
                    <TextField fullWidth label="Комната" value={form.room_name_en} onChange={(e) => updateField('room_name_en', e.target.value)} />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField fullWidth type="number" label="Цена комнаты" value={form.room_price} onChange={(e) => updateField('room_price', e.target.value)} />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField fullWidth type="number" label="Гостей" value={form.max_guests} onChange={(e) => updateField('max_guests', e.target.value)} />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField fullWidth type="number" label="Комнат доступно" value={form.available_rooms} onChange={(e) => updateField('available_rooms', e.target.value)} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth multiline minRows={2} label="Описание комнаты" value={form.room_description_en} onChange={(e) => updateField('room_description_en', e.target.value)} />
                  </Grid>
                </>
              )}
              <Grid item xs={12} md={5}>
                <Button variant="outlined" component="label" fullWidth sx={{ height: '100%' }}>
                  Загрузить фото
                  <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                </Button>
              </Grid>
              <Grid item xs={12} md={4}>
                {form.image && <Box component="img" src={form.image} alt="preview" sx={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 2 }} />}
              </Grid>
            </Grid>

            <Box mt={3} display="flex" gap={2} flexWrap="wrap">
              <Button type="submit" variant="contained">
                {editingId ? 'Сохранить изменения' : 'Добавить отель'}
              </Button>
              {editingId && (
                <Button variant="outlined" color="inherit" onClick={() => { setEditingId(null); setForm(initialForm); }}>
                  Отмена редактирования
                </Button>
              )}
              <Button variant="outlined" color="inherit" onClick={handleReset}>
                Сбросить demo-отели
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h6" fontWeight={700} gutterBottom>
        Отели ({hotels.length})
      </Typography>
      <Grid container spacing={2}>
        {hotels.map((hotel) => (
          <Grid item xs={12} md={6} key={hotel.id}>
            <Card sx={{ display: 'flex', height: '100%', borderRadius: 2 }}>
              <CardMedia component="img" image={hotel.image} alt={hotel.name} sx={{ width: 160, objectFit: 'cover' }} />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight={700}>{hotel.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {hotel.city?.name}, {hotel.country} • ₸{Number(hotel.price_per_night).toLocaleString('kk-KZ')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {(hotel.description_en || hotel.description_kz || '').slice(0, 120)}
                </Typography>
                <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                  <Button size="small" variant="outlined" onClick={() => navigate(`/hotels/${hotel.id}`)}>
                    Открыть
                  </Button>
                  <Button size="small" variant="contained" startIcon={<EditIcon />} onClick={() => handleEdit(hotel)}>
                    Изменить
                  </Button>
                  <Button size="small" color="error" variant="contained" startIcon={<DeleteIcon />} onClick={() => handleDelete(hotel.id)}>
                    Удалить
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar open={alert.open} autoHideDuration={4000} onClose={() => setAlert({ ...alert, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setAlert({ ...alert, open: false })} severity={alert.severity} sx={{ width: '100%' }} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default OwnerHotels;
