import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    Grid, 
    Typography, 
    Box, 
    alpha,
    useTheme,
    Stack,
    Paper
} from "@mui/material";
import { 
    Users, 
    Calendar as ApptIcon, 
    UserCheck,
    FileSearch,
    PieChart,
    TrendingUp,
    Shield
} from "lucide-react";
import { fetchStats } from "../../features/admin/adminSlice";
import StatCard from "../../components/ui/StatCard";
import SectionCard from "../../components/ui/SectionCard";
import PageHeader from "../../components/ui/PageHeader";
import GlobalLoader from "../../components/ui/GlobalLoader";

const StatsDashboard = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { stats, isLoading } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(fetchStats());
    }, [dispatch]);

    if (isLoading && !stats) return <GlobalLoader message="Loading System Insights..." />;

    const data = stats || {
        totalUsers: 0,
        totalAppointments: 0,
        pendingApprovals: 0,
        activeDoctors: 0
    };

    return (
        <Box>
            <PageHeader 
                title="System Analytics"
                subtitle="Comprehensive overview of platform performance, user growth, and clinical activity."
                breadcrumbs={[{ label: "Admin Console", path: "#" }, { label: "Analytics", active: true }]}
            />

            {/* Performance Metrics */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Platform Users" 
                        value={data.totalUsers} 
                        icon={Users} 
                        color="primary" 
                        duration="Engagement"
                        trend={{ value: "8% increase", isUp: true }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Appointments" 
                        value={data.totalAppointments} 
                        icon={ApptIcon} 
                        color="success" 
                        duration="Operational"
                        trend={{ value: "12% growth", isUp: true }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Active Doctors" 
                        value={data.activeDoctors} 
                        icon={UserCheck} 
                        color="info" 
                        duration="Clinical Capacity"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Pending Audits" 
                        value={data.pendingApprovals} 
                        icon={FileSearch} 
                        color="warning" 
                        subtitle="Awaiting Review"
                    />
                </Grid>
            </Grid>

            {/* Platform Insights Section */}
            <Grid container spacing={4}>
                <Grid item xs={12} lg={8}>
                    <SectionCard title="System Activity & Traffic">
                        <Box 
                            sx={{ 
                                mt: 2, 
                                p: 8, 
                                borderRadius: 4, 
                                border: "1px dashed", 
                                borderColor: "divider", 
                                textAlign: "center",
                                bgcolor: alpha(theme.palette.text.disabled, 0.02)
                            }}
                        >
                            <Stack alignItems="center" spacing={2}>
                                <PieChart size={48} color={theme.palette.text.disabled} opacity={0.5} />
                                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 800 }}>
                                    Activity Visualization Coming Soon
                                </Typography>
                                <Typography variant="body2" color="text.disabled" sx={{ maxWidth: 400, mx: 'auto' }}>
                                    We are integrating advanced charting libraries to provide real-time data visualization of user traffic and appointment heatmaps.
                                </Typography>
                            </Stack>
                        </Box>
                    </SectionCard>
                </Grid>

                <Grid item xs={12} lg={4}>
                    <Stack spacing={3}>
                        <SectionCard title="Platform Integrity">
                            <Stack spacing={2.5} sx={{ mt: 1 }}>
                                {[
                                    { icon: Shield, title: "System Security", status: "Optimal", color: "success" },
                                    { icon: TrendingUp, title: "Database Load", status: "Low (12%)", color: "info" },
                                    { icon: UserCheck, title: "Auth Services", status: "Online", color: "success" }
                                ].map((item, i) => (
                                    <Box key={i} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <Box sx={{ color: `${item.color}.main`, display: 'flex' }}>
                                                <item.icon size={20} />
                                            </Box>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.title}</Typography>
                                        </Stack>
                                        <Typography variant="caption" sx={{ 
                                            px: 1, 
                                            py: 0.5, 
                                            borderRadius: 1, 
                                            bgcolor: alpha(theme.palette[item.color].main, 0.1),
                                            color: `${item.color}.main`,
                                            fontWeight: 800
                                        }}>
                                            {item.status}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </SectionCard>

                        <Paper 
                            sx={{ 
                                p: 3, 
                                borderRadius: 4, 
                                bgcolor: "primary.main", 
                                color: "white",
                                boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`
                            }}
                        >
                            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1.5 }}>Admin Tip</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6, fontWeight: 500 }}>
                                Professional verification of doctors is the key to platform growth. Monitor pending audits regularly to ensure high onboarding speed.
                            </Typography>
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default StatsDashboard;
