import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';

const videos = [
  {
    id: 1,
    title: 'Borovoe - Kazakhstan Nature',
    location: 'Borovoe',
    description: 'Forests, lakes and cliffs of Burabay National Park.',
    embedUrl: 'https://www.youtube.com/embed/xBInF48M0F0',
  },
  {
    id: 2,
    title: 'Charyn Canyon',
    location: 'Charyn',
    description: 'A cinematic view of the Valley of Castles.',
    embedUrl: 'https://www.youtube.com/embed/8ji51v5gNyg',
  },
  {
    id: 3,
    title: 'Kolsai Lakes',
    location: 'Kolsai',
    description: 'Mountain lakes and peaceful landscapes.',
    embedUrl: 'https://www.youtube.com/embed/fphvFT41e5E',
  },
];

const VideoTravel = () => {
  const [search, setSearch] = useState('');

  const filteredVideos = videos.filter((video) =>
    `${video.title} ${video.location} ${video.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <Container sx={{ py: 5, pt: 14 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Video Travel Kazakhstan
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Watch travel videos from Kazakhstan directly on this page.
        </Typography>
      </Box>

      <TextField
        label="Search videos"
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Grid container spacing={3}>
        {filteredVideos.map((video) => (
          <Grid item xs={12} md={6} key={video.id}>
            <Card sx={{ boxShadow: 5, borderRadius: 2, overflow: 'hidden', height: '100%' }}>
              <Box sx={{ position: 'relative', width: '100%', pt: '56.25%', bgcolor: '#0f172a' }}>
                <Box
                  component="iframe"
                  src={video.embedUrl}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    border: 0,
                  }}
                />
              </Box>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {video.title}
                </Typography>
                <Typography variant="caption" color="primary">
                  {video.location}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {video.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredVideos.length === 0 && (
        <Typography textAlign="center" color="text.secondary" sx={{ mt: 6 }}>
          No videos found.
        </Typography>
      )}
    </Container>
  );
};

export default VideoTravel;
