import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Select, MenuItem, Grid, FormHelperText, CircularProgress, Box } from '@mui/material';
import ResourceCard from './ResourceCard';

const ResourceList = () => {
  const [resources, setResources] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [radius, setRadius] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchResources = (zip) => {
    setIsLoading(true); // Set isLoading to true before fetch
    console.log(`Searching for zip code: ${zip}, category: ${category}, and radius: ${radius}`);
    const url = 'http://localhost:5000/api/search';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        zip: zip, 
        category: category === 'All' ? 'none' : category,
        radius: radius
      }),
    };

    fetch(url, options)
      .then(response => response.json())
      .then(data => {
        console.log("Search results:", data);
        setResources(Array.isArray(data) ? data : []); // Set resources to the data or an empty array
        setError(null); // Clear previous errors
      })
      .catch(error => {
        setError(`Error fetching resources: ${error}`);
        console.error('Error:', error);
      })
      .finally(() => {
        setIsLoading(false); // Set isLoading to false after fetch completes
      });
  };

  const handleSearch = () => {
    setError(null); // Clear previous errors
    if (!searchQuery) {
      setError('Please enter a search query');
      return;
    }
    console.log("Search query submitted:", searchQuery, "Category:", category, "Radius:", radius);
    setHasSearched(true);
    fetchResources(searchQuery, category, radius);
  };

  if (error) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h4" component="h2" gutterBottom>
          Error: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h2" align="center" gutterBottom>
        Search Community Resources
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={4}>
          <FormHelperText>Type</FormHelperText>
          <Select
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
            variant="outlined"
            sx={{ mt: 1, mb: 1 }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Food Bank">Food Bank</MenuItem>
            <MenuItem value="Animal">Animal</MenuItem>
            <MenuItem value="Substance Abuse">Substance Abuse</MenuItem>
            <MenuItem value="Veteran">Veteran</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={4}>
        <FormHelperText>Enter Zip Code</FormHelperText>
          <TextField
            fullWidth
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mt: 1, mb: 1 }}
          />
        </Grid>
        <Grid item xs={4}>
          <FormHelperText>In Radius</FormHelperText>
          <Select
            fullWidth
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
            variant="outlined"
            sx={{ mt: 1, mb: 1 }}
          >
            <MenuItem value={0}>0 miles</MenuItem>
            <MenuItem value={10}>10 miles</MenuItem>
            <MenuItem value={25}>25 miles</MenuItem>
            <MenuItem value={50}>50 miles</MenuItem>
            <MenuItem value={100}>100 miles</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={handleSearch}
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          >
            Search
          </Button>
        </Grid>
      </Grid>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : hasSearched && resources.length === 0 ? (
        <Typography variant="h6" align="center" gutterBottom>
          No results found
        </Typography>
      ) : (
        resources.map((resource, index) => (
          <ResourceCard key={index} resource={resource} />
        ))
      )}
    </Container>
  );
};

export default ResourceList;