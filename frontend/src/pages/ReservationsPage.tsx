import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, IconButton, Alert
} from '@mui/material';
import { Add, Check } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface Reservation {
  name: string;
  book: string;
  member: string;
  reservation_date: string;
  fulfilled: number;
}

const emptyReservation: Partial<Reservation> = {
  book: '',
  member: '',
  reservation_date: '',
};

const ReservationsPage: React.FC = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Reservation> | null>(null);

  const canReserve = user?.roles.includes('Member') || user?.roles.includes('Librarian') || user?.roles.includes('Admin');
  const canFulfill = user?.roles.includes('Librarian') || user?.roles.includes('Admin');

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/method/library_management.api.reservation.list_reservations');
      setReservations(res.data.message || res.data);
    } catch (err: any) {
      setError('Failed to fetch reservations');
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const booksRes = await axios.get('/api/method/library_management.api.book.list_books');
      setBooks(booksRes.data.message || booksRes.data);
    } catch {}
  };

  useEffect(() => {
    fetchReservations();
    fetchBooks();
  }, []);

  const handleDialogOpen = () => {
    setEditing({ ...emptyReservation });
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditing(null);
    setError('');
  };

  const handleSave = async () => {
    try {
      await axios.post('/api/method/library_management.api.reservation.create_reservation', {
        book: editing?.book,
        member: user?.name,
      });
      handleDialogClose();
      fetchReservations();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Save failed');
    }
  };

  const handleFulfill = async (name: string) => {
    if (!window.confirm('Mark this reservation as fulfilled?')) return;
    try {
      await axios.put('/api/method/library_management.api.reservation.fulfill_reservation', { name });
      fetchReservations();
    } catch (err: any) {
      setError('Fulfill failed');
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>Reservations</Typography>
      {canReserve && (
        <Button variant="contained" startIcon={<Add />} onClick={handleDialogOpen} sx={{ mb: 2 }}>
          Reserve Book
        </Button>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Book</TableCell>
              <TableCell>Member</TableCell>
              <TableCell>Reservation Date</TableCell>
              <TableCell>Fulfilled</TableCell>
              {canFulfill && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map(res => (
              <TableRow key={res.name}>
                <TableCell>{res.book}</TableCell>
                <TableCell>{res.member}</TableCell>
                <TableCell>{res.reservation_date}</TableCell>
                <TableCell>{res.fulfilled ? 'Yes' : 'No'}</TableCell>
                {canFulfill && (
                  <TableCell>
                    {!res.fulfilled && (
                      <IconButton onClick={() => handleFulfill(res.name)}><Check /></IconButton>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Reserve Book</DialogTitle>
        <DialogContent>
          <Select
            label="Book"
            value={editing?.book || ''}
            onChange={e => setEditing({ ...editing!, book: e.target.value as string })}
            fullWidth
            sx={{ mt: 2 }}
            required
          >
            {books.filter(b => b.status !== 'Available').map(book => (
              <MenuItem key={book.name} value={book.name}>{book.title}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReservationsPage; 