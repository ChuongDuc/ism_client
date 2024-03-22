import { Box, Typography, Stack } from '@mui/material';
import { UploadIllustration } from '../../assets';

// ----------------------------------------------------------------------

export default function BlockContent() {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      direction={{ xs: 'column', md: 'row' }}
      sx={{ width: 1, textAlign: { xs: 'center', md: 'left' } }}
    >
      <UploadIllustration sx={{ width: 220 }} />

      <Box sx={{ p: 3 }}>
        <Typography gutterBottom variant="h5">
          Kéo hoặc chọn files
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Kéo files vào đây hoặc click &nbsp;
          <Typography variant="body2" component="span" sx={{ color: 'primary.main', textDecoration: 'underline' }}>
            duyệt
          </Typography>
          &nbsp; file từ máy tính
        </Typography>
      </Box>
    </Stack>
  );
}
