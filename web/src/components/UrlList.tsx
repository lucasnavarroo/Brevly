import { useEffect, useState } from 'react';
import { fetchUrls, deleteUrl, exportCsv } from '../services/api';
import type { ShortenedUrl } from '../types';
import {
  Box, Typography, Stack, IconButton, Divider, Paper, Link as MuiLink, Button, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function UrlList() {
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [loadingExport, setLoadingExport] = useState(false);

  const load = async () => {
    const data = await fetchUrls();
    setUrls(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (shortCode: string) => {
    await deleteUrl(shortCode);
    load();
  };

  const handleCopy = (shortCode: string) => {
    const fullUrl = `${window.location.origin}/links/${shortCode}`;
    navigator.clipboard.writeText(fullUrl);
  };

  const handleExport = async () => {
    try {
      setLoadingExport(true);
      const { url } = await exportCsv();
      window.open(url, '_blank'); // Abre o CSV em nova aba
    } catch (err) {
      alert('Erro ao exportar CSV.');
    } finally {
      setLoadingExport(false);
    }
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          bgcolor: '#f5f5fa',
          p: 3,
          borderRadius: 2,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">Meus links</Typography>

          <Button variant="outlined" size="small" onClick={handleExport} disabled={loadingExport}>
            {loadingExport ? <CircularProgress size={16} /> : 'Baixar CSV'}
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={2}>
          {urls.map((link) => (
            <Box
              key={link.id}
              display="flex"
              flexWrap="wrap"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="#fff"
              px={2}
              py={1.5}
              borderRadius={1}
              boxShadow="0px 0px 5px rgba(0,0,0,0.05)"
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body1" fontWeight="500" color="#2f49d1" noWrap>
                  <MuiLink
                    component="button"
                    onClick={() => {
                      window.open(`/links/${link.shortCode}`, '_blank');
                      setTimeout(load, 500);
                    }}
                    style={{ wordBreak: 'break-all' }}
                  >
                    {window.location.origin}/links/{link.shortCode}
                  </MuiLink>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {link.originalUrl}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1} mt={{ xs: 1, md: 0 }}>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {link.accessCount} {link.accessCount === 1 ? 'acesso' : 'acessos'}
                </Typography>

                <IconButton
                  onClick={() => handleCopy(link.shortCode)}
                  sx={{
                    backgroundColor: '#f5f5f5',
                    '&:hover': { backgroundColor: '#e0e0e0' },
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                >
                  <ContentCopyIcon sx={{ fontSize: 20, color: '#616161' }} />
                </IconButton>

                <IconButton
                  onClick={() => handleDelete(link.shortCode)}
                  sx={{
                    backgroundColor: '#f5f5f5',
                    '&:hover': { backgroundColor: '#e0e0e0' },
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                >
                  <DeleteIcon sx={{ fontSize: 20, color: '#616161' }} />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}
