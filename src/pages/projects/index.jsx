import React, { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    InputAdornment,
    IconButton,
    Paper,
    Chip,
    LinearProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import AddProjectModal from '../../components/modals/add_project';

const mockProjects = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    title: `Project ${i + 1}`,
    client: `Client ${i + 1}`,
    price: `₹${(i + 1) * 1000000}`,
    startDate: '2025-05-01',
    deadline: '2026-01-01',
    progress: `${(i + 1) * 5 % 100}`,
    status: (i % 3 === 0) ? 'Completed' : (i % 3 === 1 ? 'Ongoing' : 'Pending')
}));

const StatusChip = ({ status }) => {
    const colorMap = {
        Completed: 'success',
        Ongoing: 'warning',
        Pending: 'default'
    };
    return <Chip label={status} color={colorMap[status]} size="small" variant="outlined" />;
};

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'client', headerName: 'Client', flex: 1 },
    { field: 'price', headerName: 'Price', width: 120 },
    { field: 'startDate', headerName: 'Start Date', width: 120 },
    { field: 'deadline', headerName: 'Deadline', width: 120 },
    {
        field: 'progress',
        headerName: 'Progress',
        width: 160,
        renderCell: (params) => (
            <Box sx={{ width: '100%' }}>
                <LinearProgress
                    variant="determinate"
                    value={parseInt(params.row.progress)}
                    sx={{ height: 8, borderRadius: 5 }}
                />
                <Box sx={{ mt: 0.5, textAlign: 'center', fontSize: '12px' }}>{params.row.progress}%</Box>
            </Box>
        )
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 120,
        renderCell: (params) => <StatusChip status={params.value} />
    },
    {
        field: 'actions',
        headerName: 'Actions',
        width: 100,
        renderCell: () => (
            <Box>
                <IconButton size="small" color="primary">
                    <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error">
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Box>
        )
    }
];





export default function ProjectPage() {
    const [projects, setProjects] = useState(mockProjects);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.client.toLowerCase().includes(search.toLowerCase())
    );


    const handleAddProject = (newProjectData) => {
        setProjects(prev => [...prev, {
            id: projects.length + 1,
            ...newProjectData
        }]);
        setOpen(false);
    };

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }} component={Paper}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}
            >
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search project..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }}
                />

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                    size="small"
                >
                    Add Project
                </Button>
            </Box>

            <Paper variant="outlined" sx={{ width: '100%', p: 0, borderRadius: 2 }}>
                <Box sx={{ height: '80vh' }}>
                    <DataGrid
                        rows={filteredProjects}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-row': {
                                borderBottom: '1px solid #e0e0e0'
                            },
                            '& .MuiDataGrid-cell': {
                                py: 1
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#fafafa',
                                borderBottom: '1px solid #ddd'
                            },
                            '& .MuiDataGrid-footerContainer': {
                                borderTop: '1px solid #ddd'
                            }
                        }}
                    />
                </Box>
            </Paper>

            <AddProjectModal
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={handleAddProject}
            />

        </Box>
    );
}
