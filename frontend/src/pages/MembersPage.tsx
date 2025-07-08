import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Alert
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface Member {
  name: string;
  membership_id: string;
  email: string;
  phone: string;
  user: string;
}

const emptyMember: Partial<Member> = {
  name: '',
  membership_id: '',
  email: '',
  phone: '',
  user: '',
};

const MembersPage: React.FC = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Member> | null>(null);

  const canEdit = user?.roles.includes('Librarian') || user?.roles.includes('Admin');

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/method/library_management.api.member.list_members');
      setMembers(res.data.message || res.data);
    } catch (err: any) {
      setError('Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleDialogOpen = (member?: Member) => {
    setEditing(member ? { ...member } : { ...emptyMember });
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditing(null);
    setError('');
  };

  const handleSave = async () => {
    try {
      if (editing?.name && members.find(m => m.name === editing.name)) {
        // Update
        await axios.put('/api/method/library_management.api.member.update_member', {
          name: editing.name,
          membership_id: editing.membership_id,
          email: editing.email,
          phone: editing.phone,
          user: editing.user,
        });
      } else {
        // Create
        await axios.post('/api/method/library_management.api.member.create_member', {
          name: editing?.name,
          membership_id: editing?.membership_id,
          email: editing?.email,
          phone: editing?.phone,
          user: editing?.user,
        });
      }
      handleDialogClose();
      fetchMembers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Save failed');
    }
  };

  const handleDelete = async (name: string) => {
    if (!window.confirm('Delete this member?')) return;
    try {
      await axios.delete('/api/method/library_management.api.member.delete_member', { data: { name } });
      fetchMembers();
    } catch (err: any) {
      setError('Delete failed');
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>Members</Typography>
      {canEdit && (
        <Button variant="contained" startIcon={<Add />} onClick={() => handleDialogOpen()} sx={{ mb: 2 }}>
          Add Member
        </Button>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Membership ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>User</TableCell>
              {canEdit && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map(member => (
              <TableRow key={member.name}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.membership_id}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phone}</TableCell>
                <TableCell>{member.user}</TableCell>
                {canEdit && (
                  <TableCell>
                    <IconButton onClick={() => handleDialogOpen(member)}><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(member.name)}><Delete /></IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{editing?.name && members.find(m => m.name === editing.name) ? 'Edit Member' : 'Add Member'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={editing?.name || ''}
            onChange={e => setEditing({ ...editing!, name: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Membership ID"
            value={editing?.membership_id || ''}
            onChange={e => setEditing({ ...editing!, membership_id: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            type="email"
            value={editing?.email || ''}
            onChange={e => setEditing({ ...editing!, email: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Phone"
            value={editing?.phone || ''}
            onChange={e => setEditing({ ...editing!, phone: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="User (Frappe User)"
            value={editing?.user || ''}
            onChange={e => setEditing({ ...editing!, user: e.target.value })}
            fullWidth
            margin="normal"
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

export default MembersPage; 