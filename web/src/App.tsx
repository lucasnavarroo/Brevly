import { Container, Typography } from '@mui/material';
import UrlForm from './components/UrlForm';
import UrlList from './components/UrlList';
import { useState } from 'react';

function App() {
  const [reload, setReload] = useState(false);

  const handleReload = () => setReload((r) => !r);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Encurtador de URL
      </Typography>
      <UrlForm onCreated={handleReload} />
      <UrlList key={reload.toString()} />
    </Container>
  );
}

export default App;
