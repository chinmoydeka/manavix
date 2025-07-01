import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  Chip,
  OutlinedInput,
  Grid,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  CircularProgress,
  FormHelperText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const dummyClients = ['Client A', 'Client B', 'Client C'];
const dummyMembers = ['Alice', 'Bob', 'Charlie', 'David'];
const dummyMilestones = ['Design', 'Development', 'Testing'];
const dummyAssignees = dummyMembers;

export default function AddProjectModal({ open, onClose, onSubmit }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [projectData, setProjectData] = useState({
    title: '',
    client: '',
    description: '',
    startDate: '',
    deadline: '',
    price: ''
  });
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({
    title: '',
    description: '',
    milestone: '',
    assignTo: '',
    collaborator: '',
    status: 'To Do',
    startDate: '',
    deadline: ''
  });

  const validateStep1 = () => {
    const newErrors = {};
    if (!projectData.title.trim()) newErrors.title = 'Project title is required';
    if (!projectData.client) newErrors.client = 'Client selection is required';
    if (!projectData.startDate) newErrors.startDate = 'Start date is required';
    if (!projectData.deadline) newErrors.deadline = 'Deadline is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (selectedMembers.length === 0) newErrors.members = 'At least one team member is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateTask = () => {
    const newErrors = {};
    if (!task.title.trim()) newErrors.taskTitle = 'Task title is required';
    if (!task.milestone) newErrors.milestone = 'Milestone is required';
    if (!task.assignTo) newErrors.assignTo = 'Assignee is required';
    if (!task.startDate) newErrors.taskStartDate = 'Start date is required';
    if (!task.deadline) newErrors.taskDeadline = 'Deadline is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => setStep(prev => prev - 1);

  const handleAddTask = () => {
    if (!validateTask()) return;
    
    setTasks(prev => [...prev, task]);
    setTask({
      title: '', description: '', milestone: '', assignTo: '', collaborator: '', status: 'To Do', startDate: '', deadline: ''
    });
    setErrors({});
  };

  const handleSaveAndContinue = async () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      handleNext();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const newProject = { ...projectData, members: selectedMembers, tasks };
      await onSubmit(newProject);
    } finally {
      setLoading(false);
    }
  };

  const handleMemberChange = (event) => {
    const { target: { value } } = event;
    setSelectedMembers(typeof value === 'string' ? value.split(',') : value);
    if (errors.members) setErrors({...errors, members: undefined});
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      fullScreen={isMobile}
      scroll="body"
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        p: isMobile ? 1 : 2,
        pr: 1,
        backgroundColor: (theme) => theme.palette.mode === 'light' 
          ? theme.palette.grey[100] 
          : theme.palette.grey[800]
      }}>
        <Typography variant="h6" noWrap sx={{ fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
          Add New Project
        </Typography>
        <IconButton 
          onClick={onClose} 
          sx={{ color: 'text.secondary' }}
          disabled={loading}
          size={isMobile ? 'small' : 'medium'}
        >
          <CloseIcon fontSize={isMobile ? 'small' : 'medium'} />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent dividers sx={{ 
        p: isMobile ? 1 : 2,
        overflowX: 'hidden'
      }}>
        {step === 1 && (
          <Box sx={{ width: '100%', overflow: 'hidden' }}>
            {isMobile ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Project Title *"
                    placeholder="Enter project title"
                    value={projectData.title}
                    onChange={e => {
                      setProjectData({ ...projectData, title: e.target.value });
                      if (errors.title) setErrors({...errors, title: undefined});
                    }}
                    error={!!errors.title}
                    helperText={errors.title}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Client *"
                    placeholder="Select client"
                    value={projectData.client}
                    onChange={e => {
                      setProjectData({ ...projectData, client: e.target.value });
                      if (errors.client) setErrors({...errors, client: undefined});
                    }}
                    error={!!errors.client}
                    helperText={errors.client}
                  >
                    {dummyClients.map(client => (
                      <MenuItem key={client} value={client}>{client}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Description"
                    placeholder="Enter project description"
                    multiline
                    rows={3}
                    value={projectData.description}
                    onChange={e => setProjectData({ ...projectData, description: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Start Date *"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={projectData.startDate}
                    onChange={e => {
                      setProjectData({ ...projectData, startDate: e.target.value });
                      if (errors.startDate) setErrors({...errors, startDate: undefined});
                    }}
                    error={!!errors.startDate}
                    helperText={errors.startDate}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Deadline *"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={projectData.deadline}
                    onChange={e => {
                      setProjectData({ ...projectData, deadline: e.target.value });
                      if (errors.deadline) setErrors({...errors, deadline: undefined});
                    }}
                    error={!!errors.deadline}
                    helperText={errors.deadline}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Price"
                    placeholder="Enter project price"
                    value={projectData.price}
                    onChange={e => setProjectData({ ...projectData, price: e.target.value })}
                  />
                </Grid>
              </Grid>
            ) : (
              <Table sx={{ tableLayout: 'fixed' }}>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ width: '30%', fontWeight: 'bold', borderBottom: 'none', verticalAlign: 'top', pt: '16px' }}>
                      Project Title *
                    </TableCell>
                    <TableCell sx={{ borderBottom: 'none' }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder="Enter project title"
                        value={projectData.title}
                        onChange={e => {
                          setProjectData({ ...projectData, title: e.target.value });
                          if (errors.title) setErrors({...errors, title: undefined});
                        }}
                        error={!!errors.title}
                        helperText={errors.title}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none', verticalAlign: 'top', pt: '16px' }}>Client *</TableCell>
                    <TableCell sx={{ borderBottom: 'none' }}>
                      <TextField
                        select
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder="Select client"
                        value={projectData.client}
                        onChange={e => {
                          setProjectData({ ...projectData, client: e.target.value });
                          if (errors.client) setErrors({...errors, client: undefined});
                        }}
                        error={!!errors.client}
                        helperText={errors.client}
                      >
                        {dummyClients.map(client => (
                          <MenuItem key={client} value={client}>{client}</MenuItem>
                        ))}
                      </TextField>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none', verticalAlign: 'top', pt: '16px' }}>Description</TableCell>
                    <TableCell sx={{ borderBottom: 'none' }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder="Enter project description"
                        multiline
                        rows={3}
                        value={projectData.description}
                        onChange={e => setProjectData({ ...projectData, description: e.target.value })}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none', verticalAlign: 'top', pt: '16px' }}>Dates *</TableCell>
                    <TableCell sx={{ borderBottom: 'none' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Start Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={projectData.startDate}
                            onChange={e => {
                              setProjectData({ ...projectData, startDate: e.target.value });
                              if (errors.startDate) setErrors({...errors, startDate: undefined});
                            }}
                            error={!!errors.startDate}
                            helperText={errors.startDate}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Deadline"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={projectData.deadline}
                            onChange={e => {
                              setProjectData({ ...projectData, deadline: e.target.value });
                              if (errors.deadline) setErrors({...errors, deadline: undefined});
                            }}
                            error={!!errors.deadline}
                            helperText={errors.deadline}
                          />
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none', verticalAlign: 'top', pt: '16px' }}>Price</TableCell>
                    <TableCell sx={{ borderBottom: 'none' }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder="Enter project price"
                        value={projectData.price}
                        onChange={e => setProjectData({ ...projectData, price: e.target.value })}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </Box>
        )}

        {step === 2 && (
          <Box sx={{ p: isMobile ? 0 : 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
              Select Project Members *
            </Typography>
            <FormControl fullWidth error={!!errors.members}>
              <InputLabel id="members-label">Team Members</InputLabel>
              <Select
                labelId="members-label"
                id="members-select"
                multiple
                value={selectedMembers}
                onChange={handleMemberChange}
                input={<OutlinedInput label="Team Members" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                    },
                  }
                }}
              >
                {dummyMembers.map((member) => (
                  <MenuItem key={member} value={member}>
                    {member}
                  </MenuItem>
                ))}
              </Select>
              {errors.members && <FormHelperText>{errors.members}</FormHelperText>}
            </FormControl>
          </Box>
        )}

        {step === 3 && (
          <Box sx={{ p: isMobile ? 0 : 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
              Project Tasks
            </Typography>
            
            {isMobile ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Task Title *"
                    placeholder="Enter task title"
                    value={task.title}
                    onChange={e => {
                      setTask({ ...task, title: e.target.value });
                      if (errors.taskTitle) setErrors({...errors, taskTitle: undefined});
                    }}
                    error={!!errors.taskTitle}
                    helperText={errors.taskTitle}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Description"
                    placeholder="Enter task description"
                    multiline
                    rows={2}
                    value={task.description}
                    onChange={e => setTask({ ...task, description: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Milestone *"
                    value={task.milestone}
                    onChange={e => {
                      setTask({ ...task, milestone: e.target.value });
                      if (errors.milestone) setErrors({...errors, milestone: undefined});
                    }}
                    error={!!errors.milestone}
                    helperText={errors.milestone}
                  >
                    {dummyMilestones.map(ms => (
                      <MenuItem key={ms} value={ms}>{ms}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Status"
                    value={task.status}
                    onChange={e => setTask({ ...task, status: e.target.value })}
                  >
                    {['To Do', 'In Progress', 'Done'].map(st => (
                      <MenuItem key={st} value={st}>{st}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Assign To *"
                    value={task.assignTo}
                    onChange={e => {
                      setTask({ ...task, assignTo: e.target.value });
                      if (errors.assignTo) setErrors({...errors, assignTo: undefined});
                    }}
                    error={!!errors.assignTo}
                    helperText={errors.assignTo}
                  >
                    {dummyAssignees.map(p => (
                      <MenuItem key={p} value={p}>{p}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Collaborator"
                    value={task.collaborator}
                    onChange={e => setTask({ ...task, collaborator: e.target.value })}
                  >
                    {dummyAssignees.map(p => (
                      <MenuItem key={p} value={p}>{p}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Start Date *"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={task.startDate}
                    onChange={e => {
                      setTask({ ...task, startDate: e.target.value });
                      if (errors.taskStartDate) setErrors({...errors, taskStartDate: undefined});
                    }}
                    error={!!errors.taskStartDate}
                    helperText={errors.taskStartDate}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Deadline *"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={task.deadline}
                    onChange={e => {
                      setTask({ ...task, deadline: e.target.value });
                      if (errors.taskDeadline) setErrors({...errors, taskDeadline: undefined});
                    }}
                    error={!!errors.taskDeadline}
                    helperText={errors.taskDeadline}
                  />
                </Grid>
              </Grid>
            ) : (
              <Table sx={{ tableLayout: 'fixed' }}>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ width: '30%', fontWeight: 'bold', borderBottom: 'none', verticalAlign: 'top', pt: '16px' }}>
                      Task Title *
                    </TableCell>
                    <TableCell sx={{ borderBottom: 'none' }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder="Enter task title"
                        value={task.title}
                        onChange={e => {
                          setTask({ ...task, title: e.target.value });
                          if (errors.taskTitle) setErrors({...errors, taskTitle: undefined});
                        }}
                        error={!!errors.taskTitle}
                        helperText={errors.taskTitle}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none', verticalAlign: 'top', pt: '16px' }}>Description</TableCell>
                    <TableCell sx={{ borderBottom: 'none' }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder="Enter task description"
                        multiline
                        rows={2}
                        value={task.description}
                        onChange={e => setTask({ ...task, description: e.target.value })}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none', verticalAlign: 'top', pt: '16px' }}>Milestone & Status</TableCell>
                    <TableCell sx={{ borderBottom: 'none' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            select
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Milestone *"
                            value={task.milestone}
                            onChange={e => {
                              setTask({ ...task, milestone: e.target.value });
                              if (errors.milestone) setErrors({...errors, milestone: undefined});
                            }}
                            error={!!errors.milestone}
                            helperText={errors.milestone}
                          >
                            {dummyMilestones.map(ms => (
                              <MenuItem key={ms} value={ms}>{ms}</MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            select
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Status"
                            value={task.status}
                            onChange={e => setTask({ ...task, status: e.target.value })}
                          >
                            {['To Do', 'In Progress', 'Done'].map(st => (
                              <MenuItem key={st} value={st}>{st}</MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none', verticalAlign: 'top', pt: '16px' }}>Assignment</TableCell>
                    <TableCell sx={{ borderBottom: 'none' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            select
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Assign To *"
                            value={task.assignTo}
                            onChange={e => {
                              setTask({ ...task, assignTo: e.target.value });
                              if (errors.assignTo) setErrors({...errors, assignTo: undefined});
                            }}
                            error={!!errors.assignTo}
                            helperText={errors.assignTo}
                          >
                            {dummyAssignees.map(p => (
                              <MenuItem key={p} value={p}>{p}</MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            select
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Collaborator"
                            value={task.collaborator}
                            onChange={e => setTask({ ...task, collaborator: e.target.value })}
                          >
                            {dummyAssignees.map(p => (
                              <MenuItem key={p} value={p}>{p}</MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none', verticalAlign: 'top', pt: '16px' }}>Dates *</TableCell>
                    <TableCell sx={{ borderBottom: 'none' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Start Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={task.startDate}
                            onChange={e => {
                              setTask({ ...task, startDate: e.target.value });
                              if (errors.taskStartDate) setErrors({...errors, taskStartDate: undefined});
                            }}
                            error={!!errors.taskStartDate}
                            helperText={errors.taskStartDate}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Deadline"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={task.deadline}
                            onChange={e => {
                              setTask({ ...task, deadline: e.target.value });
                              if (errors.taskDeadline) setErrors({...errors, taskDeadline: undefined});
                            }}
                            error={!!errors.taskDeadline}
                            helperText={errors.taskDeadline}
                          />
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}

            <Button 
              variant="outlined" 
              onClick={handleAddTask}
              sx={{ mt: 2 }}
              fullWidth={isMobile}
            >
              Add Task
            </Button>

            {tasks.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Added Tasks ({tasks.length})
                </Typography>
                <Box sx={{ 
                  maxHeight: 200, 
                  overflow: 'auto',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 1
                }}>
                  {tasks.map((t, index) => (
                    <Box key={index} sx={{ 
                      p: 1, 
                      mb: 1, 
                      backgroundColor: 'action.hover',
                      borderRadius: 1
                    }}>
                      <Typography variant="body2">
                        <strong>{t.title}</strong> - {t.milestone} ({t.status})
                      </Typography>
                      <Typography variant="caption" display="block">
                        Assigned to: {t.assignTo} {t.collaborator && `+ ${t.collaborator}`}
                      </Typography>
                      <Typography variant="caption" display="block">
                        Dates: {t.startDate} to {t.deadline}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 2, py: 1 }}>
        {step > 1 && (
          <Button 
            onClick={handleBack} 
            color="inherit"
            disabled={loading}
            size={isMobile ? 'small' : 'medium'}
          >
            Back
          </Button>
        )}
        <Box sx={{ flexGrow: 1 }} />
        {step < 3 ? (
          <Button
            variant="contained"
            onClick={handleSaveAndContinue}
            endIcon={loading ? <CircularProgress size={20} /> : <ArrowForwardIcon />}
            disabled={loading}
            size={isMobile ? 'small' : 'medium'}
          >
            {loading ? 'Saving...' : 'Save & Continue'}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleSubmit}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={loading}
            size={isMobile ? 'small' : 'medium'}
          >
            {loading ? 'Submitting...' : 'Submit Project'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}