import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Box, Container, Typography, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getStoredTours } from '../data/mockTours';

const calculateAverageRating = (reviews = []) => {
  if (!reviews.length) return 0;
  return reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length;
};

const TopRatedToursCarousel = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const effectiveLang = i18n.language === 'kk' ? 'kz' : i18n.language;

  const topRatedTours = [...getStoredTours()]
    .sort((a, b) => calculateAverageRating(b.reviews) - calculateAverageRating(a.reviews))
    .slice(0, 5);

  const settings = {
    dots: true,
    infinite: topRatedTours.length > 3,
    speed: 500,
    slidesToShow: isMobile ? 1 : isTablet ? 2 : 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true,
    centerPadding: isMobile ? '10px' : isTablet ? '20px' : '70px',
    responsive: [
      { breakpoint: theme.breakpoints.values.md, settings: { slidesToShow: 2, centerPadding: '40px' } },
      { breakpoint: theme.breakpoints.values.sm, settings: { slidesToShow: 1, centerPadding: '10px' } },
    ],
  };

  return (
    <Container sx={{ paddingBottom: 5, paddingTop: 5, textAlign: 'center' }}>
      <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 'bold', mb: 2 }}>
        {t('homepage.top_rated_tours')}
      </Typography>
      <Typography variant="body1" sx={{ color: 'gray', mb: 4, fontSize: isMobile ? '0.9rem' : '1rem' }}>
        {t('homepage.explore_highest_rated_tours')}
      </Typography>

      <Slider {...settings}>
        {topRatedTours.map((tour) => {
          const tourName = tour[`name_${effectiveLang}`] || tour.name_kz || tour.name_en;

          return (
            <motion.div
              key={tour.id}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              style={{ padding: '15px', textAlign: 'center', cursor: 'pointer' }}
              onClick={() => navigate(`/tour/${tour.id}`)}
            >
              <Box
                sx={{
                  overflow: 'hidden',
                  borderRadius: '100px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  transition: '0.3s',
                  '&:hover': { boxShadow: '0 8px 16px rgba(0,0,0,0.3)' },
                  margin: '0 10px',
                }}
              >
                <motion.img
                  src={tour.image}
                  alt={tourName}
                  style={{ width: '100%', height: isMobile ? '180px' : '220px', objectFit: 'cover' }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </Box>
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold', fontSize: isMobile ? '1rem' : '1.1rem' }}>
                {tourName}
              </Typography>
              <Typography variant="body2" sx={{ color: 'gray', marginTop: '5px', fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                {t('tours_list_page.rating')}: {calculateAverageRating(tour.reviews).toFixed(1)}
              </Typography>
            </motion.div>
          );
        })}
      </Slider>
    </Container>
  );
};

export default TopRatedToursCarousel;
