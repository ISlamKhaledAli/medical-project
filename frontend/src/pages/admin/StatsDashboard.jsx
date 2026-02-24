import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    Container, 
    Grid, 
    Paper, 
    Typography, 
    Box, 
    CircularProgress 
} from "@mui/material";
import { 
    People as PeopleIcon, 
    EventNote as ApptIcon, 
    Verified as VerifiedIcon,
    PendingActions as PendingIcon 
} from "@mui/icons-material";
import { fetchStats } from "../../features/admin/adminSlice";

const StatCard = ({ title, value, icon: Icon, color }) => (
    <Paper 
        elevation={0} 
        sx={{ 
            p: 3, 
            borderRadius: 4, 
            border: "1px solid rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
            gap: 2
        }}
    >
        <Box 
            sx={{ 
                p: 1.5, 
                bgcolor: `${color}.light`, 
                borderRadius: 3, 
                color: `${color}.main`,
                display: "flex"
            }}
        >
            <Icon />
        </Box>
        <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{title}</Typography>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>{value}</Typography>
        </Box>
    </Paper>
);

const StatsDashboard = () => {
    const dispatch = useDispatch();
    const { stats, isLoading } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(fetchStats());
    }, [dispatch]);

    if (isLoading && !stats) return <CircularProgress />;

    const data = stats || {
        totalUsers: 120,
        totalAppointments: 450,
        pendingApprovals: 12,
        activeDoctors: 45
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 5 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: "#1a237e", mb: 1 }}>
                    System Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Overview of system performance and active users.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Total Users" value={data.totalUsers} icon={PeopleIcon} color="primary" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Total Appointments" value={data.totalAppointments} icon={ApptIcon} color="success" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Active Doctors" value={data.activeDoctors} icon={VerifiedIcon} color="info" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Pending Approvals" value={data.pendingApprovals} icon={PendingIcon} color="warning" />
                </Grid>
            </Grid>

            {/* Placeholder for charts or recent activity */}
            <Paper 
                elevation={0} 
                sx={{ 
                    mt: 6, 
                    p: 10, 
                    borderRadius: 4, 
                    border: "1px dashed rgba(0,0,0,0.1)", 
                    textAlign: "center" 
                }}
            >
                <Typography variant="h6" color="text.secondary">System Activity Graphs Coming Soon</Typography>
            </Paper>
        </Container>
    );
};

export default StatsDashboard;
