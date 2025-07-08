import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography, Box, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert
} from '@mui/material';

const ReportsPage: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [onLoan, setOnLoan] = useState<any[]>([]);
  const [overdue, setOverdue] = useState<any[]>([]);
  const [error, setError] = useState('');

  const fetchReports = async () => {
    try {
      const [onLoanRes, overdueRes] = await Promise.all([
        axios.get('/api/method/library_management.api.loan.report_books_on_loan'),
        axios.get('/api/method/library_management.api.loan.report_overdue_books'),
      ]);
      setOnLoan(onLoanRes.data.message || onLoanRes.data);
      setOverdue(overdueRes.data.message || overdueRes.data);
    } catch (err: any) {
      setError('Failed to fetch reports');
    }
  };

  useEffect(() => { fetchReports(); }, []);

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>Reports</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Books on Loan" />
        <Tab label="Overdue Books" />
      </Tabs>
      {error && <Alert severity="error">{error}</Alert>}
      {tab === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Book</TableCell>
                <TableCell>Member</TableCell>
                <TableCell>Loan Date</TableCell>
                <TableCell>Return Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {onLoan.map((row: any) => (
                <TableRow key={row.name}>
                  <TableCell>{row.book}</TableCell>
                  <TableCell>{row.member}</TableCell>
                  <TableCell>{row.loan_date}</TableCell>
                  <TableCell>{row.return_date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {tab === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Book</TableCell>
                <TableCell>Member</TableCell>
                <TableCell>Loan Date</TableCell>
                <TableCell>Return Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {overdue.map((row: any) => (
                <TableRow key={row.name}>
                  <TableCell>{row.book}</TableCell>
                  <TableCell>{row.member}</TableCell>
                  <TableCell>{row.loan_date}</TableCell>
                  <TableCell>{row.return_date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ReportsPage; 