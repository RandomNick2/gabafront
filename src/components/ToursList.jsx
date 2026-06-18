import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  ImageListItem,
  InputLabel,
  MenuItem,
  Rating,
  Select,
  Slider,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import tourImg from './../assets/photos/5ftsj0mn7lkw08ws40k4w4wss.jpg';
import { getStoredTours, mockLocations } from '../data/mockTours';

const ToursList = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [locations, setLocations] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [selectedDuration, setSelectedDuration] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const effectiveLang = currentLang === 'kk' ? 'kz' : currentLang;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialDate = searchParams.get('date') || '';
  const initialPeople = searchParams.get('people') || '';
  const initialStartDate = searchParams.get('startDate') || '';
  const initialEndDate = searchParams.get('endDate') || '';

  useEffect(() => {
    setLoading(true);

    const preparedTours = getStoredTours().filter((tour) => {
      const name = tour[`name_${effectiveLang}`] || tour.name_en || tour.name_kz || '';
      const description = tour[`description_${effectiveLang}`] || tour.description_en || tour.description_kz || '';
      const matchesInitialSearch = initialSearch
        ? `${name} ${description}`.toLowerCase().includes(initialSearch.toLowerCase())
        : true;
      const matchesInitialDate = initialDate ? tour.date === initialDate : true;
      const matchesInitialPeople = initialPeople ? tour.volume >= Number(initialPeople) : true;

      return matchesInitialSearch && matchesInitialDate && matchesInitialPeople;
    });

    const prices = preparedTours.map((tour) => Number(tour.price));
    const nextMaxPrice = prices.length ? Math.max(...prices) : 500000;

    setLocations(mockLocations);
    setTours(preparedTours);
    setMaxPrice(nextMaxPrice);
    setPriceRange([0, nextMaxPrice]);
    setLoading(false);
  }, [effectiveLang, initialDate, initialPeople, initialSearch]);

  useEffect(() => {
    const filtered = tours.filter((tour) => {
      const name = tour[`name_${effectiveLang}`] || tour.name_en || tour.name_kz || '';
      const description = tour[`description_${effectiveLang}`] || tour.description_en || tour.description_kz || '';
      const matchesSearch = searchQuery
        ? `${name} ${description}`.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesDuration = selectedDuration
        ? selectedDuration === '1-3'
          ? tour.duration >= 1 && tour.duration <= 3
          : selectedDuration === '4-7'
            ? tour.duration >= 4 && tour.duration <= 7
            : tour.duration > 7
        : true;
      const matchesPrice = Number(tour.price) >= priceRange[0] && Number(tour.price) <= priceRange[1];
      const matchesPeople = initialPeople ? tour.volume >= Number(initialPeople) : true;
      const matchesDateRange =
        initialStartDate && initialEndDate
          ? new Date(tour.date) >= new Date(initialStartDate) && new Date(tour.date) <= new Date(initialEndDate)
          : true;

      return matchesSearch && matchesDuration && matchesPrice && matchesPeople && matchesDateRange;
    });

    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'price') {
        comparison = Number(a.price) - Number(b.price);
      } else if (sortBy === 'location') {
        const locationA = locations.find((loc) => loc.id === a.location_id);
        const locationB = locations.find((loc) => loc.id === b.location_id);
        comparison = (locationA?.[`name_${effectiveLang}`] || '').localeCompare(locationB?.[`name_${effectiveLang}`] || '');
      } else if (sortBy === 'date') {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'name') {
        comparison = (a[`name_${effectiveLang}`] || a.name_kz || '').localeCompare(b[`name_${effectiveLang}`] || b.name_kz || '');
      } else if (sortBy === 'rating') {
        comparison = calculateAverageRating(a.reviews) - calculateAverageRating(b.reviews);
      }

      return sortDirection === 'asc' ? comparison : comparison * -1;
    });

    setFilteredTours(sorted);
  }, [
    tours,
    locations,
    effectiveLang,
    initialEndDate,
    initialPeople,
    initialStartDate,
    priceRange,
    searchQuery,
    selectedDuration,
    sortBy,
    sortDirection,
  ]);

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  };

  const getImageUrl = (imagePath) => imagePath || tourImg;

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDuration('');
    setPriceRange([0, maxPrice || 500000]);
    navigate('/tours');
  };

  const handleSortChange = (event) => {
    const value = event.target.value;
    if (value === sortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(value);
      setSortDirection('asc');
    }
  };

  const localizedLocations = locations.map((loc) => ({
    ...loc,
    localizedName: loc[`name_${effectiveLang}`] || loc.name_en || loc.name_kz || loc.name,
  }));

  if (loading) {
    return (
      <Container sx={{ paddingY: 14 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
          <Typography ml={2}>{t('common.loading_tours')}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Box marginBottom={3}>
        <img style={{ width: '100%', borderRadius: '10px' }} src={tourImg} alt={t('tours_list_page.tour_banner_alt')} />
      </Box>
      <Container sx={{ paddingX: isMobile ? 1 : 3 }}>
        <Grid container spacing={isMobile ? 1 : 3}>
          <Grid item xs={12} md={3} sx={{ position: isMobile ? 'static' : 'sticky', top: isMobile ? 'auto' : 80, height: isMobile ? 'auto' : '100vh' }}>
            <Card sx={{ boxShadow: '0 6px 10px rgba(0, 0, 0, 0.2)', padding: isMobile ? 1 : 2, borderRadius: '15px' }}>
              <CardContent>
                <TextField fullWidth label={t('tours_list_page.search_tours')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} margin="normal" size={isMobile ? 'small' : 'medium'} />
                <FormControl fullWidth margin="normal" size={isMobile ? 'small' : 'medium'}>
                  <InputLabel id="duration-select-label">{t('tours_list_page.duration_days')}</InputLabel>
                  <Select labelId="duration-select-label" value={selectedDuration} onChange={(e) => setSelectedDuration(e.target.value)} label={t('tours_list_page.duration_days')}>
                    <MenuItem value="">{t('tours_list_page.all_durations')}</MenuItem>
                    <MenuItem value="1-3">1-3 {t('tours_list_page.days')}</MenuItem>
                    <MenuItem value="4-7">4-7 {t('tours_list_page.days')}</MenuItem>
                    <MenuItem value="7+">7+ {t('tours_list_page.days')}</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <Typography variant="body1" sx={{ mb: 1, fontSize: isMobile ? '0.85rem' : '1rem' }}>
                    {t('tours_list_page.price_range')}: ₸{priceRange[0]} - ₸{priceRange[1]}
                  </Typography>
                  <Slider value={priceRange} onChange={(event, newValue) => setPriceRange(newValue)} valueLabelDisplay="auto" min={0} max={maxPrice} step={10000} valueLabelFormat={(value) => `₸${value}`} />
                </FormControl>
                <FormControl fullWidth margin="normal" size={isMobile ? 'small' : 'medium'}>
                  <InputLabel id="sort-by-label">{t('tours_list_page.sort_by')}</InputLabel>
                  <Select labelId="sort-by-label" value={sortBy} onChange={handleSortChange} label={t('tours_list_page.sort_by')}>
                    <MenuItem value="">{t('tours_list_page.default')}</MenuItem>
                    <MenuItem value="name">{t('tours_list_page.name')}</MenuItem>
                    <MenuItem value="price">{t('tours_list_page.price')}</MenuItem>
                    <MenuItem value="date">{t('tours_list_page.date')}</MenuItem>
                    <MenuItem value="location">{t('tours_list_page.location')}</MenuItem>
                    <MenuItem value="rating">{t('tours_list_page.rating')}</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={9} container spacing={isMobile ? 1 : 3}>
            {filteredTours.length > 0 ? (
              filteredTours.map((tour) => (
                <Grid item xs={12} sm={6} md={4} key={tour.id}>
                  <Card sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)', borderRadius: '15px', overflow: 'hidden', transition: 'transform 0.3s ease-in-out', '&:hover': { transform: 'scale(1.05)', boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)' } }} onClick={() => navigate(`/tour/${tour.id}`)}>
                    <ImageListItem sx={{ mb: 0 }}>
                      <img src={getImageUrl(tour.image)} alt={tour[`name_${effectiveLang}`] || tour.name_en || tour.name_kz || t('tours_list_page.no_name')} style={{ width: '100%', height: isMobile ? '150px' : '200px', objectFit: 'cover', borderRadius: '10px' }} onError={(e) => { e.target.onerror = null; e.target.src = tourImg; }} />
                    </ImageListItem>
                    <CardContent sx={{ paddingTop: 0, paddingBottom: 1 }}>
                      <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="bold">
                        {tour[`name_${effectiveLang}`] || tour.name_kz || tour.name_en || t('tours_list_page.no_name')}
                      </Typography>
                      <Typography variant={isMobile ? 'body2' : 'subtitle2'} color="text.secondary">
                        {localizedLocations.find((loc) => loc.id === tour.location_id)?.localizedName || t('tours_list_page.unknown_location')}
                      </Typography>
                      <Typography variant={isMobile ? 'caption' : 'body2'} color="text.secondary" sx={{ mt: 0.5, mb: 1, height: isMobile ? 'auto' : '60px', overflow: 'hidden' }}>
                        {(tour[`description_${effectiveLang}`] || tour.description_kz || tour.description_en || t('tours_list_page.no_description')).slice(0, 90)}
                      </Typography>
                      <Box display="flex" alignItems="center" mb={0.5}>
                        <Rating name={`tour-rating-${tour.id}`} value={calculateAverageRating(tour.reviews)} precision={0.1} readOnly size="small" />
                        <Typography variant="caption" color="text.secondary" ml={0.5}>({tour.reviews?.length || 0})</Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {t('tours_list_page.date')}: {new Date(tour.date).toLocaleDateString(effectiveLang === 'kz' ? 'ru-RU' : 'en-US')}
                      </Typography>
                      <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ color: '#ff9800', fontWeight: 'bold', mt: 1 }}>
                        ₸{Number(tour.price).toLocaleString('kk-KZ')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Container sx={{ paddingY: 14 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                  <Typography variant="h6" color="text.secondary">{t('tours_list_page.no_tours_found')}</Typography>
                  {tours.length > 0 && <Button variant="contained" sx={{ mt: 2 }} onClick={handleClearFilters}>{t('tours_list_page.clear_filters', 'Clear filters')}</Button>}
                </Box>
              </Container>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ToursList;
