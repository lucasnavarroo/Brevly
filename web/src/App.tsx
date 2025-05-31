import { useState } from 'react';
import { Container, Box, Grid } from '@mui/material';
import UrlForm from './components/UrlForm';
import UrlList from './components/UrlList';

export default function App() {
  const [reload, setReload] = useState(false);
  const handleReload = () => setReload(!reload);

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 4, md: 8 }, px: { xs: 2, md: 0 } }}>
      <Box mb={4}>
        <img src="/Logo.png" alt="brev.ly" style={{ height: 40 }} />
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={5}>
          <UrlForm onCreated={handleReload} />
        </Grid>

        <Grid item xs={12} md={5}>
          <UrlList key={reload.toString()} />
        </Grid>
      </Grid>
    </Container>
  );
}
