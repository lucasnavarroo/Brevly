import { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { createUrl } from '../services/api';

interface Props {
  onCreated: () => void;
}

export default function UrlForm({ onCreated }: Props) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortCode, setShortCode] = useState('');

  const handleSubmit = async () => {
    if (!originalUrl || !shortCode) return;

    await createUrl(originalUrl, shortCode);
    setOriginalUrl('');
    setShortCode('');
    onCreated();
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      mt={4}
      width="100%"
      maxWidth="400px"
      mx="auto"
    >
      <TextField
        label="Link original"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        fullWidth
      />
      <TextField
        label="Link encurtado"
        value={shortCode}
        onChange={(e) => setShortCode(e.target.value)}
        fullWidth
        helperText="Exemplo: google-5 (irá gerar brev.ly/google-5)"
      />
      <Button variant="contained" onClick={handleSubmit}>
        Salvar link
      </Button>
    </Box>
  );
}
