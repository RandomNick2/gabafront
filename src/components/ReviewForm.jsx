import React, { useContext, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Rating,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../contexts/UserContext';
import { addStoredTourReview } from '../data/mockTours';

const ReviewForm = ({ tourId, onReviewAdded }) => {
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const showMessage = (severity, message) => {
    setSnackbar({ open: true, severity, message });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!user) {
      showMessage('warning', 'Сначала войдите в аккаунт');
      setTimeout(() => navigate('/auth'), 500);
      return;
    }

    if (!content.trim()) {
      showMessage('error', 'Напишите отзыв');
      return;
    }

    const review = addStoredTourReview(tourId, {
      content: content.trim(),
      rating,
      user_id: user.id,
      user_name: user.name,
      user_avatar: user.avatar,
    });

    setContent('');
    setRating(5);
    onReviewAdded(review);
    showMessage('success', 'Отзыв сохранён');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {t('tour_detail_page.write_review')}
      </Typography>

      <Rating
        name="rating"
        value={rating}
        onChange={(event, newValue) => setRating(newValue || 5)}
        size="large"
        sx={{ mb: 2 }}
      />

      <TextField
        label={t('tour_detail_page.your_review')}
        multiline
        rows={4}
        fullWidth
        value={content}
        onChange={(event) => setContent(event.target.value)}
        sx={{ mb: 2 }}
      />

      <Button type="submit" variant="contained" color="primary">
        {t('tour_detail_page.submit')}
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReviewForm;
