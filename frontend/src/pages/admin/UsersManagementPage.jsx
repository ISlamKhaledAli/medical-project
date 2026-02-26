import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    Typography, 
    Box, 
    Avatar, 
    Chip, 
    IconButton, 
    Button, 
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    alpha,
    useTheme,
    TextField,
    InputAdornment,
    Tooltip
} from "@mui/material";
import { 
    ShieldCheck, 
    ShieldAlert,
    Search,
    Filter,
    Mail,
    User,
    Shield,
    MoreHorizontal,
    UserMinus,
    UserPlus
} from "lucide-react";
import { fetchUsers, toggleUserStatus } from "../../features/admin/adminSlice";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import TableSkeleton from "../../components/skeletons/TableSkeleton";

const UsersManagementPage = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { users, isLoading } = useSelector((state) => state.admin);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const filteredUsers = useMemo(() => {
        if (!searchQuery) return users;
        return users.filter(u => 
            u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
            u.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [users, searchQuery]);

    const handleToggleStatus = (id, isCurrentlyBlocked) => {
        const targetStatus = isCurrentlyBlocked ? "active" : "blocked";
        dispatch(toggleUserStatus({ id, status: targetStatus }));
    };

    return (
        <Box>
            <PageHeader 
                title="Identity & Access"
                subtitle="Centralized registry for all system actors. Control authentication states, security roles, and platform access."
                breadcrumbs={[
                    { label: "Admin", path: "/admin" },
                    { label: "User Management", active: true }
                ]}
            />

            {isLoading ? (
                <TableSkeleton rows={8} cols={5} />
            ) : (
                <SectionCard 
                    title="System Registry" 
                    subtitle={`${filteredUsers.length} total users identified across all nodes`}
                    headerAction={
                        <TextField 
                            placeholder="Search by identity or email..."
                            size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{ 
                                minWidth: 300,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 3,
                                    bgcolor: alpha(theme.palette.background.default, 0.5),
                                    '& fieldset': { borderColor: 'divider' }
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search size={18} color={theme.palette.text.disabled} />
                                    </InputAdornment>
                                )
                            }}
                        />
                    }
                >
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800, color: "text.secondary", pl: 0 }}>Identity</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>Access Role</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>Lifecycle Status</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>Security State</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800, color: "text.secondary", pr: 0 }}>Management</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUsers.map((user) => {
                                    const isBlocked = user.isBlocked;
                                    const accountStatus = user.status || (user.role === "doctor" ? "pending" : "active");
                                    
                                    return (
                                        <TableRow key={user._id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                            <TableCell sx={{ py: 2.5, pl: 0 }}>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Avatar 
                                                        sx={{ 
                                                            width: 44, 
                                                            height: 44, 
                                                            borderRadius: 2.5,
                                                            bgcolor: user.role === "admin" ? alpha(theme.palette.error.main, 0.1) : alpha(theme.palette.primary.main, 0.1),
                                                            color: user.role === "admin" ? "error.main" : "primary.main",
                                                            fontWeight: 900
                                                        }}
                                                    >
                                                        {user?.fullName?.[0] || user?.name?.[0] || "U"}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                                            {user?.fullName || user?.name || "Anonymous Actor"}
                                                        </Typography>
                                                        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.secondary' }}>
                                                            <Mail size={12} />
                                                            <Typography variant="caption" sx={{ fontWeight: 600 }}>{user.email}</Typography>
                                                        </Stack>
                                                    </Box>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={user.role} 
                                                    size="small" 
                                                    icon={<Shield size={12} />}
                                                    sx={{ 
                                                        textTransform: "uppercase", 
                                                        fontWeight: 800, 
                                                        fontSize: '0.65rem',
                                                        letterSpacing: 0.5,
                                                        borderRadius: 1.5,
                                                        bgcolor: alpha(theme.palette.text.primary, 0.05),
                                                        color: 'text.primary',
                                                        border: '1px solid',
                                                        borderColor: alpha(theme.palette.text.primary, 0.1),
                                                        '& .MuiChip-icon': { color: 'inherit', ml: 1 }
                                                    }} 
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={accountStatus} 
                                                    size="small" 
                                                    sx={{ 
                                                        fontWeight: 800, 
                                                        textTransform: "uppercase",
                                                        fontSize: '0.65rem',
                                                        letterSpacing: 0.5,
                                                        borderRadius: 1.5,
                                                        bgcolor: alpha(
                                                            accountStatus === "active" || accountStatus === "approved" ? theme.palette.success.main : 
                                                            accountStatus === "pending" ? theme.palette.warning.main : theme.palette.error.main, 
                                                            0.1
                                                        ),
                                                        color: (
                                                            accountStatus === "active" || accountStatus === "approved" ? "success.main" : 
                                                            accountStatus === "pending" ? "warning.dark" : "error.main"
                                                        )
                                                    }} 
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {isBlocked ? (
                                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'error.main' }}>
                                                        <ShieldAlert size={14} />
                                                        <Typography variant="caption" sx={{ fontWeight: 800 }}>RESTRICTED</Typography>
                                                    </Stack>
                                                ) : (
                                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'success.main' }}>
                                                        <ShieldCheck size={14} />
                                                        <Typography variant="caption" sx={{ fontWeight: 800 }}>VERIFIED</Typography>
                                                    </Stack>
                                                )}
                                            </TableCell>
                                            <TableCell align="right" sx={{ pr: 0 }}>
                                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                    <Tooltip title={isBlocked ? "Restore Access" : "Revoke Access"}>
                                                        <IconButton 
                                                            onClick={() => handleToggleStatus(user._id, isBlocked)}
                                                            sx={{ 
                                                                borderRadius: 2, 
                                                                bgcolor: alpha(isBlocked ? theme.palette.success.main : theme.palette.error.main, 0.05),
                                                                color: isBlocked ? "success.main" : "error.main",
                                                                "&:hover": { 
                                                                    bgcolor: isBlocked ? "success.main" : "error.main", 
                                                                    color: "white" 
                                                                }
                                                            }}
                                                        >
                                                            {isBlocked ? <UserPlus size={18} /> : <UserMinus size={18} />}
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="View Logs">
                                                        <IconButton 
                                                            sx={{ 
                                                                borderRadius: 2, 
                                                                bgcolor: alpha(theme.palette.text.primary, 0.05),
                                                                color: "text.primary"
                                                            }}
                                                        >
                                                            <MoreHorizontal size={18} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </SectionCard>
            )}
        </Box>
    );
};

export default UsersManagementPage;
