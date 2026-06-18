import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Chip, CircularProgress, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const mapLibreJs = 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js';
const mapLibreCss = 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css';

const destinations = [
  { name: 'Almaty', label: 'Mountains, Medeu, Shymbulak', coordinates: [76.886, 43.238], zoom: 12.8, pitch: 68, bearing: -20 },
  { name: 'Astana', label: 'Baiterek, EXPO, modern center', coordinates: [71.47, 51.16], zoom: 12.8, pitch: 66, bearing: 25 },
  { name: 'Charyn Canyon', label: 'Valley of Castles', coordinates: [79.08, 43.35], zoom: 10.8, pitch: 72, bearing: 35 },
  { name: 'Kolsai Lakes', label: 'Tien Shan mountain lakes', coordinates: [78.32, 42.95], zoom: 10.8, pitch: 70, bearing: -35 },
  { name: 'Turkistan', label: 'Yasawi mausoleum and historic center', coordinates: [68.27, 43.3], zoom: 12.8, pitch: 58, bearing: 10 },
  { name: 'Borovoe', label: 'Lakes, forest and cliffs', coordinates: [70.3, 53.08], zoom: 11.5, pitch: 68, bearing: -25 },
];

const mapStyle = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
    },
  ],
};

const loadMapLibre = () =>
  new Promise((resolve, reject) => {
    if (window.maplibregl) {
      resolve(window.maplibregl);
      return;
    }

    if (!document.querySelector(`link[href="${mapLibreCss}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = mapLibreCss;
      document.head.appendChild(link);
    }

    const existingScript = document.querySelector(`script[src="${mapLibreJs}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.maplibregl));
      existingScript.addEventListener('error', reject);
      return;
    }

    const script = document.createElement('script');
    script.src = mapLibreJs;
    script.async = true;
    script.onload = () => resolve(window.maplibregl);
    script.onerror = reject;
    document.body.appendChild(script);
  });

const makeBox = ([lng, lat], size, height, name, index) => ({
  type: 'Feature',
  properties: { height, name },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [lng - size, lat - size],
      [lng + size, lat - size],
      [lng + size, lat + size],
      [lng - size, lat + size],
      [lng - size, lat - size],
    ]],
  },
  id: `${name}-${index}`,
});

const createLocal3DFeatures = () => ({
  type: 'FeatureCollection',
  features: destinations.flatMap((place, placeIndex) => {
    const baseLng = place.coordinates[0];
    const baseLat = place.coordinates[1];

    return Array.from({ length: placeIndex < 2 ? 18 : 8 }, (_, index) => {
      const row = Math.floor(index / 6);
      const col = index % 6;
      const offsetLng = (col - 2.5) * 0.004;
      const offsetLat = (row - 1) * 0.004;
      const size = placeIndex < 2 ? 0.0011 : 0.0018;
      const height = placeIndex < 2 ? 30 + ((index % 5) * 18) : 16 + ((index % 4) * 12);

      return makeBox(
        [baseLng + offsetLng, baseLat + offsetLat],
        size,
        height,
        place.name,
        index
      );
    });
  }),
});

const Kazakhstan3DMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [activePlace, setActivePlace] = useState(destinations[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const flyToPlace = (place) => {
    setActivePlace(place);
    mapRef.current?.flyTo({
      center: place.coordinates,
      zoom: place.zoom,
      pitch: place.pitch,
      bearing: place.bearing,
      speed: 0.75,
      curve: 1.35,
      essential: true,
    });
  };

  useEffect(() => {
    let mounted = true;

    loadMapLibre()
      .then((maplibregl) => {
        if (!mounted || !mapContainerRef.current) return;

        const map = new maplibregl.Map({
          container: mapContainerRef.current,
          style: mapStyle,
          center: destinations[0].coordinates,
          zoom: destinations[0].zoom,
          pitch: destinations[0].pitch,
          bearing: destinations[0].bearing,
          antialias: true,
          attributionControl: false,
          maxPitch: 85,
        });

        mapRef.current = map;
        map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');
        map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');

        map.on('load', () => {
          if (!mounted) return;

          map.addSource('destination-points', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: destinations.map((place) => ({
                type: 'Feature',
                properties: { name: place.name, label: place.label },
                geometry: { type: 'Point', coordinates: place.coordinates },
              })),
            },
          });

          map.addSource('local-3d-buildings', {
            type: 'geojson',
            data: createLocal3DFeatures(),
          });

          map.addLayer({
            id: 'local-3d-buildings',
            type: 'fill-extrusion',
            source: 'local-3d-buildings',
            paint: {
              'fill-extrusion-color': [
                'interpolate',
                ['linear'],
                ['get', 'height'],
                20,
                '#82c7ff',
                70,
                '#3468d6',
                120,
                '#1d2f73',
              ],
              'fill-extrusion-height': ['get', 'height'],
              'fill-extrusion-base': 0,
              'fill-extrusion-opacity': 0.78,
            },
          });

          map.addLayer({
            id: 'destination-circles',
            type: 'circle',
            source: 'destination-points',
            paint: {
              'circle-radius': 8,
              'circle-color': '#ef4444',
              'circle-stroke-width': 3,
              'circle-stroke-color': '#ffffff',
            },
          });

          map.addLayer({
            id: 'destination-labels',
            type: 'symbol',
            source: 'destination-points',
            layout: {
              'text-field': ['get', 'name'],
              'text-size': 14,
              'text-offset': [0, 1.4],
              'text-anchor': 'top',
            },
            paint: {
              'text-color': '#ffffff',
              'text-halo-color': '#0f172a',
              'text-halo-width': 2,
            },
          });

          map.on('click', 'destination-circles', (event) => {
            const feature = event.features?.[0];
            if (!feature) return;

            const place = destinations.find((item) => item.name === feature.properties.name);
            if (place) flyToPlace(place);
          });

          map.on('mouseenter', 'destination-circles', () => {
            map.getCanvas().style.cursor = 'pointer';
          });

          map.on('mouseleave', 'destination-circles', () => {
            map.getCanvas().style.cursor = '';
          });

          destinations.forEach((place) => {
            new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 18 })
              .setLngLat(place.coordinates)
              .setHTML(`<strong>${place.name}</strong><br/>${place.label}`)
              .addTo(map);
          });

          setTimeout(() => map.resize(), 100);
          setLoading(false);
        });

        map.on('error', (event) => {
          console.warn('MapLibre error:', event?.error || event);
          if (mounted) setLoading(false);
        });

        setTimeout(() => {
          if (mounted && mapRef.current) {
            mapRef.current.resize();
            setLoading(false);
          }
        }, 2500);
      })
      .catch(() => {
        if (!mounted) return;
        setLoading(false);
        setError('MapLibre GL did not load. Check your internet connection.');
      });

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#07111f', pt: 10 }}>
      <Box
        sx={{
          position: 'relative',
          height: { xs: 'calc(100vh - 80px)', md: 'calc(100vh - 88px)' },
          minHeight: 620,
          overflow: 'hidden',
        }}
      >
        <Box
          ref={mapContainerRef}
          sx={{
            position: 'absolute',
            inset: 0,
            '& .maplibregl-canvas': { outline: 'none' },
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            top: { xs: 18, md: 28 },
            left: { xs: 14, md: 28 },
            width: { xs: 'calc(100% - 28px)', md: 380 },
            maxHeight: { xs: '45vh', md: 'calc(100% - 56px)' },
            overflowY: 'auto',
            p: 2,
            borderRadius: 3,
            bgcolor: 'rgba(8, 18, 32, 0.84)',
            color: 'white',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 18px 60px rgba(0,0,0,0.35)',
          }}
        >
          <Chip label="MapLibre GL JS" size="small" sx={{ mb: 1, color: 'white', borderColor: 'rgba(255,255,255,0.4)' }} variant="outlined" />
          <Typography variant="h4" fontWeight={800} sx={{ lineHeight: 1.05, mb: 1 }}>
            3D Kazakhstan Map
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.76)', mb: 2 }}>
            Tilted map, destination markers and local 3D extrusions for a diploma-ready presentation.
          </Typography>

          <Box sx={{ display: 'grid', gap: 1 }}>
            {destinations.map((place) => (
              <Button
                key={place.name}
                variant={activePlace.name === place.name ? 'contained' : 'outlined'}
                startIcon={<LocationOnIcon />}
                onClick={() => flyToPlace(place)}
                sx={{
                  justifyContent: 'flex-start',
                  color: activePlace.name === place.name ? 'white' : 'rgba(255,255,255,0.86)',
                  borderColor: 'rgba(255,255,255,0.24)',
                  textAlign: 'left',
                }}
              >
                <Box>
                  <Typography variant="body2" fontWeight={700}>{place.name}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.75 }}>{place.label}</Typography>
                </Box>
              </Button>
            ))}
          </Box>
        </Box>

        {(loading || error) && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(7,17,31,0.72)',
              color: 'white',
              textAlign: 'center',
              px: 3,
              pointerEvents: error ? 'auto' : 'none',
            }}
          >
            {loading ? (
              <Box>
                <CircularProgress sx={{ color: 'white', mb: 2 }} />
                <Typography>Loading 3D map...</Typography>
              </Box>
            ) : (
              <Typography variant="h6">{error}</Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Kazakhstan3DMap;
