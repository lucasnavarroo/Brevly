import { useEffect, useState } from 'react';
import type { ShortenedUrl } from '../types';
import { fetchUrls } from '../services/api';
import {
  Card, CardContent, Typography, Stack, Link as MuiLink
} from '@mui/material';

export default function UrlList() {
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);

  const load = async () => {
    const data = await fetchUrls();
    setUrls(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Stack spacing={2} mt={4}>
      {urls.map((link) => (
        <Card key={link.id}>
          <CardContent>
            <Typography variant="body1">
              Original: <MuiLink href={link.originalUrl} target="_blank">{link.originalUrl}</MuiLink>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Encurtada: <MuiLink href={`/links/${link.shortCode}`} target="_blank">{window.location.origin}/links/{link.shortCode}</MuiLink>
            </Typography>
            <Typography variant="caption" display="block">
              Acessos: {link.accessCount}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
