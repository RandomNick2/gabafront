import React, { useContext, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { Email, Lock, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../contexts/UserContext';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[5],
  backgroundColor: theme.palette.background.paper,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(1, 0),
}));

const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const { login, register } = useContext(UserContext);
  const navigate = useNavigate();
  const theme = useTheme();

  const [tabIndex, setTabIndex] = useState(0);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerFullName, setRegisterFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'info',
    message: '',
  });

  const showMessage = (severity, message) => {
    setSnackbar({ open: true, severity, message });
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();

    try {
      login({ email: loginEmail, password: loginPassword });
      navigate('/profile');
    } catch (error) {
      showMessage('error', error.message || t('login_page.login_failed_credentials'));
    }
  };

  const handleRegisterSubmit = (event) => {
    event.preventDefault();

    try {
      if (!registerFullName.trim() || !registerEmail.trim() || !registerPassword) {
        throw new Error('Заполните имя, email и пароль');
      }
      if (registerPassword !== registerConfirmPassword) {
        throw new Error('Пароли не совпадают');
      }
      if (registerPassword.length < 4) {
        throw new Error('Пароль должен быть минимум 4 символа');
      }

      register({
        name: registerFullName,
        email: registerEmail,
        password: registerPassword,
      });

      showMessage('success', 'Аккаунт создан. Теперь можно войти.');
      setTabIndex(0);
      setLoginEmail(registerEmail);
      setLoginPassword('');
      setRegisterFullName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterConfirmPassword('');
    } catch (error) {
      showMessage('error', error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 14 }}>
      <StyledPaper>
        <Tabs
          value={tabIndex}
          onChange={(event, newValue) => setTabIndex(newValue)}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          sx={{ mb: 2 }}
        >
          <Tab label={t('login_page.login')} />
          <Tab label={t('login_page.register')} />
        </Tabs>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <FormControl variant="standard" sx={{ minWidth: 70 }}>
            <Select
              value={i18n.language}
              onChange={(event) => i18n.changeLanguage(event.target.value)}
              disableUnderline
              sx={{ color: 'black', '& .MuiSelect-icon': { color: 'black' } }}
            >
              <MenuItem value="kk">ҚАЗ</MenuItem>
              <MenuItem value="en">ENG</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Typography variant="h5" textAlign="center" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 2 }}>
          {tabIndex === 0 ? t('login_page.welcome_back') : t('login_page.create_account')}
        </Typography>

        {tabIndex === 0 ? (
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }} onSubmit={handleLoginSubmit}>
            <StyledTextField
              fullWidth
              label={t('login_page.email')}
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
              }}
            />
            <StyledTextField
              fullWidth
              label={t('login_page.password')}
              type="password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
              }}
            />
            <StyledButton variant="contained" fullWidth type="submit">
              {t('login_page.login')}
            </StyledButton>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              Demo: demo@qaztour.local / demo123
            </Typography>
          </Box>
        ) : (
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }} onSubmit={handleRegisterSubmit}>
            <StyledTextField
              fullWidth
              label={t('login_page.full_name')}
              value={registerFullName}
              onChange={(event) => setRegisterFullName(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
              }}
            />
            <StyledTextField
              fullWidth
              label={t('login_page.email')}
              value={registerEmail}
              onChange={(event) => setRegisterEmail(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
              }}
            />
            <StyledTextField
              fullWidth
              label={t('login_page.password')}
              type="password"
              value={registerPassword}
              onChange={(event) => setRegisterPassword(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
              }}
            />
            <StyledTextField
              fullWidth
              label={t('login_page.confirm_password')}
              type="password"
              value={registerConfirmPassword}
              onChange={(event) => setRegisterConfirmPassword(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
              }}
            />
            <StyledButton variant="contained" fullWidth type="submit">
              {t('login_page.register')}
            </StyledButton>
          </Box>
        )}

        <Divider sx={{ my: 3, backgroundColor: theme.palette.divider, opacity: 0.5 }} />
        <Typography variant="body2" textAlign="center" sx={{ color: theme.palette.text.secondary }}>
          {t('login_page.terms_conditions')}
        </Typography>
      </StyledPaper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoginPage;
