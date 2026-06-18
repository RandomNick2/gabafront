import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Dialog,
  Divider,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  Rating,
  Typography,
  styled,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import tourImg from './../assets/photos/5ftsj0mn7lkw08ws40k4w4wss.jpg';
import ReviewForm from './ReviewForm';
import { getMockTourById } from '../data/mockTours';

const PriceTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '2rem',
  color: theme.palette.success.main,
}));

const BookButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1),
  fontSize: '1rem',
  fontWeight: 'bold',
}));

const DetailIconText = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginRight: theme.spacing(2),
}));

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const tourData = getMockTourById(id);

    if (!tourData) {
      setError(t('tour_detail_page.tour_data_not_found'));
      setLoading(false);
      return;
    }

    setTour(tourData);
    setReviews(tourData.reviews || []);
    setAverageRating(
      tourData.reviews?.length
        ? tourData.reviews.reduce((sum, review) => sum + review.rating, 0) / tourData.reviews.length
        : 0
    );
    setGalleryImages([tourData.image, ...(tourData.gallery || [])].filter(Boolean));
    setLoading(false);
  }, [id, t]);

  const getImageUrl = (imagePath) => imagePath || tourImg;

  const handleOpen = (img) => {
    setSelectedImage(img);
    setOpen(true);
  };

  const handleNewReview = (newReview) => {
    setReviews((prevReviews) => [newReview, ...prevReviews]);
    setAverageRating((prevRating) => {
      const currentReviewsLength = reviews.length;
      if (currentReviewsLength === 0) return newReview.rating;
      return (prevRating * currentReviewsLength + newReview.rating) / (currentReviewsLength + 1);
    });
  };

  if (loading) {
    return (
      <Container sx={{ paddingY: 14 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !tour) {
    return (
      <Typography variant="h6" sx={{ textAlign: 'center', mt: 5, color: 'error.main' }}>
        {error || t('tour_detail_page.tour_not_found')}
      </Typography>
    );
  }

  const effectiveLang = i18n.language === 'kk' ? 'kz' : i18n.language;
  const tourName = tour[`name_${effectiveLang}`] || tour.name_kz || tour.name_en || t('tour_detail_page.no_name');
  const tourDescription = tour[`description_${effectiveLang}`] || tour.description_kz || tour.description_en || t('tour_detail_page.no_description');
  const locationName = tour.location?.[`name_${effectiveLang}`] || tour.location?.name_kz || tour.location?.name_en || t('tour_detail_page.unknown_location');

  return (
    <>
      <Box sx={{ width: '100%', height: '400px', background: `url(${getImageUrl(tour.image)}) center/cover no-repeat`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textAlign: 'center', position: 'relative' }}>
        <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.5)', p: 3, borderRadius: 2 }}>
          <Typography variant="h3" fontWeight="bold">{tourName}</Typography>
        </Box>
      </Box>

      <Container sx={{ py: 3 }}>
        <Card sx={{ p: 3, boxShadow: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
              <IconButton onClick={() => navigate(-1)}>
                <ArrowBackIosIcon />
              </IconButton>
              <PriceTypography>₸ {Number(tour.price).toLocaleString('kk-KZ')}</PriceTypography>
              {tour.date && (
                <DetailIconText>
                  <AccessTimeIcon sx={{ color: 'gray', mr: 0.5 }} />
                  <Typography variant="body2">{new Date(tour.date).toLocaleDateString(effectiveLang === 'kz' ? 'ru-RU' : 'en-US')}</Typography>
                </DetailIconText>
              )}
              <DetailIconText>
                <LocationOnIcon sx={{ color: 'gray', mr: 1 }} />
                <Typography variant="body2">{t('tour_detail_page.location')}: {locationName}</Typography>
              </DetailIconText>
            </Box>
            <BookButton variant="contained" color="success" onClick={() => navigate('/hotels')}>
              {t('tour_detail_page.hotels_and_reservations')}
            </BookButton>
          </Box>

          <Divider sx={{ my: 2 }} />
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>{t('tour_detail_page.overview')}</Typography>
              <Typography variant="body1" color="text.secondary" paragraph>{tourDescription}</Typography>

              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>{t('tour_detail_page.tour_gallery')}</Typography>
              <ImageList variant="masonry" cols={2} gap={8} sx={{ width: '100%' }}>
                {galleryImages.map((img, index) => (
                  <ImageListItem key={`${img}-${index}`} onClick={() => handleOpen(img)} sx={{ cursor: 'pointer' }}>
                    <img src={getImageUrl(img)} alt={`Gallery ${index + 1}`} loading="lazy" style={{ width: '100%', borderRadius: '8px' }} />
                  </ImageListItem>
                ))}
              </ImageList>

              <Divider sx={{ my: 3 }} />
              <Button variant="contained" color="primary" onClick={() => navigate(`/bookings/create/${id}`)} sx={{ fontSize: '1.2rem', padding: '10px 20px' }}>
                {t('tour_detail_page.booking_and_payment')}
              </Button>

              <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md">
                {selectedImage && <img src={selectedImage} alt="Full Size" style={{ width: '100%', height: '100%' }} />}
              </Dialog>

              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom>{t('tour_detail_page.customer_reviews')}</Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <Rating name="read-only" value={averageRating} precision={0.1} readOnly />
                <Typography variant="body2" color="text.secondary" ml={1}>({reviews.length} {t('tour_detail_page.reviews_count_label')})</Typography>
              </Box>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <Card key={review.id} sx={{ mb: 2, p: 2, borderRadius: 2, boxShadow: 1 }}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Avatar alt="Reviewer Avatar" src={review.user?.avatar} sx={{ width: 30, height: 30, mr: 1 }} />
                      <Typography variant="subtitle2" fontWeight="bold">{review.user?.name || t('tour_detail_page.anonymous')}</Typography>
                      <Rating name="read-only" value={review.rating || 0} readOnly size="small" sx={{ ml: 1 }} />
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                        {new Date(review.created_at).toLocaleDateString(effectiveLang === 'kz' ? 'ru-RU' : 'en-US')}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">{review.content}</Typography>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">{t('tour_detail_page.no_reviews_yet')}</Typography>
              )}

              <Divider sx={{ my: 3 }} />
              <ReviewForm tourId={id} onReviewAdded={handleNewReview} />
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2, mt: 3, boxShadow: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>{t('tour_detail_page.tour_guide')}</Typography>
                <Box display="flex" alignItems="center" flexDirection="column">
                  <Avatar alt="Tour Guide" src={tour.user?.avatar} sx={{ width: 80, height: 80, mb: 1 }} />
                  <Typography variant="subtitle1" fontWeight="bold">{tour.user?.name || t('tour_detail_page.undefined')}</Typography>
                  <Box display="flex" alignItems="center">
                    <Rating name="read-only" value={4.8} precision={0.1} readOnly size="small" sx={{ ml: 0.5 }} />
                    <Typography variant="caption" color="text.secondary" ml={0.5}>4.8</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </>
  );
};

export default TourDetail;
