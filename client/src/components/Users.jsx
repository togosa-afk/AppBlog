import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { useUsers } from '../store/userStore'
import { Link } from 'react-router-dom'

const Users = () => {
  const users = useUsers()

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Users
      </Typography>
      <TableContainer component={Paper} elevation={2}>
        <Table aria-label="users and their blogs">
          <TableHead sx={{ backgroundColor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'primary.contrastText', fontWeight: 700 }}>
                Name
              </TableCell>
              <TableCell sx={{ color: 'primary.contrastText', fontWeight: 700 }}>
                Username
              </TableCell>
              <TableCell sx={{ color: 'primary.contrastText', fontWeight: 700 }}>
                Blogs created
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.userName} hover>
                <TableCell>
                  <Link
                    component={Link}
                    to={`/users/${user.id || user.userName}`}
                    underline="hover"
                    sx={{ fontWeight: 600 }}
                  >
                    {user.name}
                  </Link>
                </TableCell>
                <TableCell>{user.userName}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{user.blogsCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}

export default Users
