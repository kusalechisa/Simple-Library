import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Stack } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <Box mt={8} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" gutterBottom>Library Dashboard</Typography>
      <Typography variant="subtitle1" gutterBottom>Welcome, {user?.name} ({user?.roles.join(', ')})</Typography>
      <Stack spacing={2} direction="column" width={300} mt={2}>
        <Button variant="contained" onClick={() => navigate('/books')}>Books</Button>
        <Button variant="contained" onClick={() => navigate('/members')}>Members</Button>
        <Button variant="contained" onClick={() => navigate('/loans')}>Loans</Button>
        <Button variant="contained" onClick={() => navigate('/reservations')}>Reservations</Button>
        <Button variant="contained" onClick={() => navigate('/reports')}>Reports</Button>
        <Button variant="outlined" color="secondary" onClick={logout}>Logout</Button>
      </Stack>
    </Box>
  );
};

export default Dashboard; 