import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import {
  createStoredTour,
  deleteStoredTour,
  getStoredTours,
  mockLocations,
  resetStoredTours,
} from '../data/mockTours';

const initialForm = {
  name_en: '',
  name_kz: '',
  name_ru: '',
  description_en: '',
  description_kz: '',
  description_ru: '',
  location_id: 1,
  category: 'custom',
  duration: 1,
  price: 50000,
  volume: 10,
  date: '',
  image: '',
};

const GuideTours = () => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [alert, setAlert] = useState({ open: false, severity: 'info', message: '' });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'guide')) {
      navigate('/profile');
      return;
    }

    setTours(getStoredTours());
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

  const handleAddTour = (event) => {
    event.preventDefault();

    if (!form.name_en.trim() || !form.description_en.trim() || !form.date) {
      showAlert('error', 'Заполните название, описание и дату');
      return;
    }

    const newTour = createStoredTour({
      ...form,
      guideName: user?.name || 'Guide',
    });
    setTours(getStoredTours());
    setForm(initialForm);
    showAlert('success', `Тур "${newTour.name_en}" добавлен`);
  };

  const handleDeleteTour = (tourId) => {
    setTours(deleteStoredTour(tourId));
    showAlert('success', 'Тур удалён');
  };

  const handleResetTours = () => {
    setTours(resetStoredTours());
    showAlert('success', 'Список туров сброшен');
  };

  if (loading) {
    return (
      <Container sx={{ py: 14 }}>
        <Typography textAlign="center">Loading...</Typography>
      </Container>
    );
  }

  if (!user || user.role !== 'guide') {
    return null;
  }

  return (
    <Container sx={{ py: 14 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Гид: управление турами
      </Typography>

      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Добавить тур
          </Typography>
          <Box component="form" onSubmit={handleAddTour}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Name EN" value={form.name_en} onChange={(e) => updateField('name_en', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Name KZ" value={form.name_kz} onChange={(e) => updateField('name_kz', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Name RU" value={form.name_ru} onChange={(e) => updateField('name_ru', e.target.value)} />
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
                <FormControl fullWidth>
                  <InputLabel id="location-label">Локация</InputLabel>
                  <Select labelId="location-label" label="Локация" value={form.location_id} onChange={(e) => updateField('location_id', e.target.value)}>
                    {mockLocations.map((location) => (
                      <MenuItem key={location.id} value={location.id}>
                        {location.name_en}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth label="Категория" value={form.category} onChange={(e) => updateField('category', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField fullWidth type="number" label="Дней" value={form.duration} onChange={(e) => updateField('duration', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField fullWidth type="number" label="Цена" value={form.price} onChange={(e) => updateField('price', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField fullWidth type="number" label="Мест" value={form.volume} onChange={(e) => updateField('volume', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth type="date" label="Дата" value={form.date} onChange={(e) => updateField('date', e.target.value)} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} md={5}>
                <Button variant="outlined" component="label" fullWidth sx={{ height: '100%' }}>
                  Загрузить фото
                  <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                </Button>
              </Grid>
              <Grid item xs={12} md={4}>
                {form.image && (
                  <Box component="img" src={form.image} alt="preview" sx={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 2 }} />
                )}
              </Grid>
            </Grid>

            <Box mt={3} display="flex" gap={2}>
              <Button type="submit" variant="contained">
                Добавить тур
              </Button>
              <Button variant="outlined" color="inherit" onClick={handleResetTours}>
                Сбросить к demo-турам
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h6" fontWeight={700} gutterBottom>
        Туры ({tours.length})
      </Typography>
      <Grid container spacing={2}>
        {tours.map((tour) => (
          <Grid item xs={12} md={6} key={tour.id}>
            <Card sx={{ display: 'flex', height: '100%', borderRadius: 2 }}>
              <CardMedia component="img" image={tour.image} alt={tour.name_en} sx={{ width: 160, objectFit: 'cover' }} />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight={700}>
                  {tour.name_en || tour.name_kz}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(tour.date).toLocaleDateString()} • ₸{Number(tour.price).toLocaleString('kk-KZ')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {(tour.description_en || tour.description_kz || '').slice(0, 120)}
                </Typography>
                <Box mt={2} display="flex" gap={1}>
                  <Button size="small" variant="outlined" onClick={() => navigate(`/tour/${tour.id}`)}>
                    Открыть
                  </Button>
                  <Button size="small" color="error" variant="contained" startIcon={<DeleteIcon />} onClick={() => handleDeleteTour(tour.id)}>
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

export default GuideTours;
