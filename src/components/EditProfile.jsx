import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const EditProfile = () => {
  const { user, loading, updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('traveler');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [avatar, setAvatar] = useState('');
  const [alert, setAlert] = useState({ open: false, severity: 'info', message: '' });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setRole(user.role || 'traveler');
      setAvatar(user.avatar || '');
    }
  }, [loading, navigate, user]);

  const showAlert = (severity, message) => {
    setAlert({ open: true, severity, message });
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    try {
      if (!name.trim()) {
        throw new Error('Введите имя');
      }
      if (!email.trim()) {
        throw new Error('Введите email');
      }
      if (password && password.length < 4) {
        throw new Error('Пароль должен быть минимум 4 символа');
      }
      if (password && password !== passwordConfirmation) {
        throw new Error('Пароли не совпадают');
      }

      updateUser({
        name: name.trim(),
        email,
        phone: phone.trim(),
        role,
        avatar,
        ...(password ? { password } : {}),
      });

      setPassword('');
      setPasswordConfirmation('');
      showAlert('success', 'Данные профиля сохранены');
      setTimeout(() => navigate('/profile'), 500);
    } catch (error) {
      showAlert('error', error.message || 'Не удалось сохранить профиль');
    }
  };

  if (loading) {
    return (
      <Typography textAlign="center" mt={14}>
        Loading profile information...
      </Typography>
    );
  }

  if (!user) {
    return (
      <Typography textAlign="center" mt={14}>
        Сначала войдите в аккаунт
      </Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: 640, margin: 'auto', padding: 3, mt: 14 }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3, padding: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={600} textAlign="center" gutterBottom>
            Редактировать профиль
          </Typography>

          <Box textAlign="center" position="relative">
            <Avatar src={avatar} sx={{ width: 100, height: 100, margin: 'auto', bgcolor: 'primary.main', fontSize: 36 }}>
              {name?.charAt(0) || 'U'}
            </Avatar>
            <input accept="image/*" type="file" id="avatar-upload" style={{ display: 'none' }} onChange={handleAvatarChange} />
            <label htmlFor="avatar-upload">
              <IconButton component="span" sx={{ position: 'absolute', bottom: 0, right: '40%', bgcolor: 'white' }}>
                <PhotoCamera />
              </IconButton>
            </label>
          </Box>

          <Grid container spacing={2} mt={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Имя" value={name} onChange={(event) => setName(event.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Телефон" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="role-label">Роль</InputLabel>
                <Select labelId="role-label" label="Роль" value={role} onChange={(event) => setRole(event.target.value)}>
                  <MenuItem value="traveler">Путешественник</MenuItem>
                  <MenuItem value="guide">Гид</MenuItem>
                  <MenuItem value="hotel_owner">Владелец отеля</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Новый пароль" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Подтвердите новый пароль" type="password" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} />
            </Grid>
          </Grid>

          <Box mt={3} display="flex" gap={2}>
            <Button variant="contained" fullWidth sx={{ borderRadius: 2 }} onClick={handleSave}>
              Сохранить
            </Button>
            <Button variant="outlined" fullWidth color="inherit" sx={{ borderRadius: 2 }} onClick={() => navigate('/profile')}>
              Отмена
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Snackbar open={alert.open} autoHideDuration={4000} onClose={() => setAlert({ ...alert, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setAlert({ ...alert, open: false })} severity={alert.severity} sx={{ width: '100%' }} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditProfile;
