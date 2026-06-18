import React from 'react';
import { Box, Container, Typography, styled, useTheme } from '@mui/material';
import Grid from '@mui/joy/Grid';
import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import IconButton from '@mui/joy/IconButton';
import TypographyJoy from '@mui/joy/Typography';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getStoredTours, mockLocations } from '../data/mockTours';

const SectionWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  background: 'linear-gradient(135deg, #f0f8ff 0%, #e0ffff 100%)',
  paddingBottom: theme.spacing(8),
  paddingTop: theme.spacing(10),
  overflow: 'hidden',
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(14),
  },
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(4),
  },
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  fontSize: '3.5rem',
  color: theme.palette.primary.dark,
  marginBottom: theme.spacing(1),
  textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
  [theme.breakpoints.down('md')]: {
    fontSize: '2.5rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  },
}));

const StyledSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  color: theme.palette.text.secondary,
  maxWidth: 700,
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
  },
}));

const StyledTourCard = styled(Card)(({ theme }) => ({
  border: 'none',
  boxShadow: theme.shadows[15],
  borderRadius: theme.spacing(3),
  maxWidth: 400,
  mx: 'auto',
  p: theme.spacing(2.5),
  backgroundColor: theme.palette.background.paper,
  transition: 'transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out',
  '&:hover': {
    transform: 'scale(1.08) rotate(1deg)',
    boxShadow: theme.shadows[20],
  },
  position: 'relative',
  cursor: 'pointer',
}));

const TourImageWrapper = styled(AspectRatio)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  overflow: 'hidden',
}));

const TourTitle = styled(TypographyJoy)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  fontSize: '1.3rem',
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(0.5),
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.1rem',
  },
}));

const TourDateLocation = styled(TypographyJoy)(({ theme }) => ({
  fontSize: '0.9rem',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1.5),
}));

const TourPrice = styled(TypographyJoy)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.warning.dark,
}));

const FavoriteToggleButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  color: theme.palette.error.main,
  borderRadius: '50%',
  zIndex: 1,
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    transform: 'scale(1.05)',
  },
}));

const WaveSeparator = styled(Box)(() => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  height: '120px',
  marginTop: '-1px',
  zIndex: 1,
}));

export default function ToursCollection() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const effectiveLang = i18n.language === 'kk' ? 'kz' : i18n.language;
  const featuredTours = getStoredTours().slice(0, 3);

  const handleCardClick = (tourId) => {
    navigate(`/tour/${tourId}`);
  };

  return (
    <SectionWrapper>
      <Container>
        <SectionHeader>
          <StyledTitle component="h2">✨ {t('tour_card.title')}</StyledTitle>
          <StyledSubtitle>{t('tour_card.description')}</StyledSubtitle>
        </SectionHeader>

        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ flexGrow: 1 }}>
          {featuredTours.map((tour) => {
            const localizedTourName = tour[`name_${effectiveLang}`] || tour.name_kz || tour.name_en || t('tours_list_page.no_name');
            const tourLocation = mockLocations.find((loc) => loc.id === tour.location_id);
            const localizedLocationName =
              tourLocation?.[`name_${effectiveLang}`] ||
              tourLocation?.name_en ||
              tourLocation?.name_kz ||
              '—';

            return (
              <Grid key={tour.id} xs={12} sm={6} md={4}>
                <StyledTourCard onClick={() => handleCardClick(tour.id)}>
                  <FavoriteToggleButton aria-label={t('tour_card.add_to_favorites')} variant="plain" color="neutral" size="sm">
                    <FavoriteBorderIcon />
                  </FavoriteToggleButton>
                  <TourImageWrapper minHeight="150px" maxHeight="250px" ratio="16/9">
                    <img src={tour.image} alt={localizedTourName} />
                  </TourImageWrapper>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 1 }}>
                    <Box sx={{ minWidth: 0 }}>
                      <TourTitle>{localizedTourName}</TourTitle>
                      <TourDateLocation>
                        {new Date(tour.date).toLocaleDateString(effectiveLang === 'kz' ? 'ru-RU' : 'en-US')} • {localizedLocationName}
                      </TourDateLocation>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <TourPrice>₸{Number(tour.price).toLocaleString('kk-KZ')}</TourPrice>
                    </Box>
                  </Box>
                  <Button sx={{ mt: 2 }} fullWidth onClick={(event) => { event.stopPropagation(); handleCardClick(tour.id); }}>
                    {t('tour_card.view_details', 'View details')}
                  </Button>
                </StyledTourCard>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      <WaveSeparator>
        <svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{ height: '100%', width: '100%' }}>
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: theme.palette.primary.main, stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#80D0C7', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path d="M-2.54,95.23 C222.63,199.84 369.35,37.02 501.97,99.19 L500.00,150.00 L0.00,150.00 Z" style={{ stroke: 'none', fill: 'url(#waveGradient)' }} />
        </svg>
      </WaveSeparator>
    </SectionWrapper>
  );
}
