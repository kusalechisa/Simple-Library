import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, IconButton, Alert
} from '@mui/material';
import { Add, Undo } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface Loan {
  name: string;
  book: string;
  member: string;
  loan_date: string;
  return_date: string;
  returned: number;
  overdue: number;
}

const emptyLoan: Partial<Loan> = {
  book: '',
  member: '',
  loan_date: '',
  return_date: '',
};

const LoansPage: React.FC = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Loan> | null>(null);

  const canEdit = user?.roles.includes('Librarian') || user?.roles.includes('Admin');

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/method/library_management.api.loan.list_loans');
      setLoans(res.data.message || res.data);
    } catch (err: any) {
      setError('Failed to fetch loans');
    } finally {
      setLoading(false);
    }
  };

  const fetchBooksAndMembers = async () => {
    try {
      const [booksRes, membersRes] = await Promise.all([
        axios.get('/api/method/library_management.api.book.list_books'),
        axios.get('/api/method/library_management.api.member.list_members'),
      ]);
      setBooks(booksRes.data.message || booksRes.data);
      setMembers(membersRes.data.message || membersRes.data);
    } catch {}
  };

  useEffect(() => {
    fetchLoans();
    fetchBooksAndMembers();
  }, []);

  const handleDialogOpen = () => {
    setEditing({ ...emptyLoan });
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditing(null);
    setError('');
  };

  const handleSave = async () => {
    try {
      await axios.post('/api/method/library_management.api.loan.create_loan', {
        book: editing?.book,
        member: editing?.member,
        loan_date: editing?.loan_date,
        return_date: editing?.return_date,
      });
      handleDialogClose();
      fetchLoans();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Save failed');
    }
  };

  const handleReturn = async (name: string) => {
    if (!window.confirm('Mark this loan as returned?')) return;
    try {
      await axios.put('/api/method/library_management.api.loan.return_loan', { name });
      fetchLoans();
    } catch (err: any) {
      setError('Return failed');
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>Loans</Typography>
      {canEdit && (
        <Button variant="contained" startIcon={<Add />} onClick={handleDialogOpen} sx={{ mb: 2 }}>
          Create Loan
        </Button>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Book</TableCell>
              <TableCell>Member</TableCell>
              <TableCell>Loan Date</TableCell>
              <TableCell>Return Date</TableCell>
              <TableCell>Returned</TableCell>
              <TableCell>Overdue</TableCell>
              {canEdit && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map(loan => (
              <TableRow key={loan.name}>
                <TableCell>{loan.book}</TableCell>
                <TableCell>{loan.member}</TableCell>
                <TableCell>{loan.loan_date}</TableCell>
                <TableCell>{loan.return_date}</TableCell>
                <TableCell>{loan.returned ? 'Yes' : 'No'}</TableCell>
                <TableCell>{loan.overdue ? 'Yes' : 'No'}</TableCell>
                {canEdit && (
                  <TableCell>
                    {!loan.returned && (
                      <IconButton onClick={() => handleReturn(loan.name)}><Undo /></IconButton>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Create Loan</DialogTitle>
        <DialogContent>
          <Select
            label="Book"
            value={editing?.book || ''}
            onChange={e => setEditing({ ...editing!, book: e.target.value as string })}
            fullWidth
            sx={{ mt: 2 }}
            required
          >
            {books.filter(b => b.status === 'Available').map(book => (
              <MenuItem key={book.name} value={book.name}>{book.title}</MenuItem>
            ))}
          </Select>
          <Select
            label="Member"
            value={editing?.member || ''}
            onChange={e => setEditing({ ...editing!, member: e.target.value as string })}
            fullWidth
            sx={{ mt: 2 }}
            required
          >
            {members.map(member => (
              <MenuItem key={member.name} value={member.name}>{member.name}</MenuItem>
            ))}
          </Select>
          <TextField
            label="Loan Date"
            type="date"
            value={editing?.loan_date || ''}
            onChange={e => setEditing({ ...editing!, loan_date: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Return Date"
            type="date"
            value={editing?.return_date || ''}
            onChange={e => setEditing({ ...editing!, return_date: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoansPage; 