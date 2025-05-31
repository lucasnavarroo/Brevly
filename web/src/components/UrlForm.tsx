import { useState } from 'react';
import { TextField, Button, Box, Typography, InputAdornment, Alert } from '@mui/material';
import { createUrl } from '../services/api';

interface Props {
  onCreated: () => void;
}

export default function UrlForm({ onCreated }: Props) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateShortCode = (code: string): boolean => {
    const regex = /^[a-zA-Z0-9-_]{3,30}$/;
    return regex.test(code);
  };

  const handleSubmit = async () => {
    setError(null); // limpar erro anterior

    if (!originalUrl || !shortCode) {
      setError('Preencha todos os campos.');
      return;
    }

    if (!validateShortCode(shortCode)) {
      setError('Formato inválido para o link encurtado.');
      return;
    }

    try {
      await createUrl(originalUrl, shortCode);
      setOriginalUrl('');
      setShortCode('');
      onCreated();
    } catch (err: any) {
      setError(err?.error || 'Erro ao criar link.');
    }
  };

  return (
    <Box
      bgcolor="#f5f5fa"
      p={4}
      borderRadius={2}
      boxShadow="0px 0px 10px rgba(0,0,0,0.05)"
    >
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Novo link
      </Typography>

      <TextField
        label="Link original"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Link encurtado"
        value={shortCode}
        onChange={(e) => setShortCode(e.target.value)}
        fullWidth
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              brev.ly/
            </InputAdornment>
          ),
        }}
        helperText="Apenas letras, números, hífen e underline. (3-30 caracteres)"
      />

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        fullWidth
        sx={{
          mt: 3,
          backgroundColor: '#2f49d1',
          '&:hover': { backgroundColor: '#2239b8' },
          textTransform: 'none',
          fontWeight: 'bold'
        }}
        onClick={handleSubmit}
      >
        Salvar link
      </Button>
    </Box>
  );
}
