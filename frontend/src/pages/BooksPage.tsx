import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, IconButton, Alert
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface Book {
  name: string;
  title: string;
  author: string;
  publish_date: string;
  isbn: string;
  status: string;
}

const emptyBook: Partial<Book> = {
  title: '',
  author: '',
  publish_date: '',
  isbn: '',
  status: 'Available',
};

const BooksPage: React.FC = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Book> | null>(null);

  const canEdit = user?.roles.includes('Librarian') || user?.roles.includes('Admin');

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/method/library_management.api.book.list_books');
      setBooks(res.data.message || res.data);
    } catch (err: any) {
      setError('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleDialogOpen = (book?: Book) => {
    setEditing(book ? { ...book } : { ...emptyBook });
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditing(null);
    setError('');
  };

  const handleSave = async () => {
    try {
      if (editing?.name) {
        // Update
        await axios.put('/api/method/library_management.api.book.update_book', {
          name: editing.name,
          title: editing.title,
          author: editing.author,
          publish_date: editing.publish_date,
          isbn: editing.isbn,
          status: editing.status,
        });
      } else {
        // Create
        await axios.post('/api/method/library_management.api.book.create_book', {
          title: editing?.title,
          author: editing?.author,
          publish_date: editing?.publish_date,
          isbn: editing?.isbn,
        });
      }
      handleDialogClose();
      fetchBooks();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Save failed');
    }
  };

  const handleDelete = async (name: string) => {
    if (!window.confirm('Delete this book?')) return;
    try {
      await axios.delete('/api/method/library_management.api.book.delete_book', { data: { name } });
      fetchBooks();
    } catch (err: any) {
      setError('Delete failed');
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>Books</Typography>
      {canEdit && (
        <Button variant="contained" startIcon={<Add />} onClick={() => handleDialogOpen()} sx={{ mb: 2 }}>
          Add Book
        </Button>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Publish Date</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>Status</TableCell>
              {canEdit && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map(book => (
              <TableRow key={book.name}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.publish_date}</TableCell>
                <TableCell>{book.isbn}</TableCell>
                <TableCell>{book.status}</TableCell>
                {canEdit && (
                  <TableCell>
                    <IconButton onClick={() => handleDialogOpen(book)}><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(book.name)}><Delete /></IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{editing?.name ? 'Edit Book' : 'Add Book'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={editing?.title || ''}
            onChange={e => setEditing({ ...editing!, title: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Author"
            value={editing?.author || ''}
            onChange={e => setEditing({ ...editing!, author: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Publish Date"
            type="date"
            value={editing?.publish_date || ''}
            onChange={e => setEditing({ ...editing!, publish_date: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="ISBN"
            value={editing?.isbn || ''}
            onChange={e => setEditing({ ...editing!, isbn: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          {editing?.name && (
            <Select
              label="Status"
              value={editing.status}
              onChange={e => setEditing({ ...editing!, status: e.target.value as string })}
              fullWidth
              sx={{ mt: 2 }}
            >
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="On Loan">On Loan</MenuItem>
              <MenuItem value="Reserved">Reserved</MenuItem>
            </Select>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BooksPage; 