import { useEffect, useCallback, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { 
    Grid, 
    Typography, 
    Box, 
    TextField, 
    InputAdornment,
    Paper,
    Button,
    alpha,
    useTheme,
    Chip,
    Stack,
    IconButton
} from "@mui/material";
import { 
    Search as SearchIcon, 
    Filter as FilterIcon, 
    X,
    RotateCcw
} from "lucide-react";
import { fetchDoctors, setFilters, setPage } from "../../features/doctor/doctorSlice";
import { useDebounce } from "../../hooks/useDebounce";
import DoctorCard from "../../components/doctor/DoctorCard";
import SpecialtySelect from "../../components/doctor/SpecialtySelect";
import PaginationControl from "../../components/ui/PaginationControl";
import DoctorCardSkeleton from "../../components/skeletons/DoctorCardSkeleton";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import PageHeader from "../../components/ui/PageHeader";

const DoctorListPage = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const [searchParams, setSearchParams] = useSearchParams();
    const { doctors, isLoading, error, pagination, filters } = useSelector((state) => state.doctor);
    const { isAuthChecking, accessToken } = useSelector((state) => state.auth);
    
    const [searchTerm, setSearchTerm] = useState(filters.name || "");
    const debouncedSearch = useDebounce(searchTerm, 500);
    const [isInitialized, setIsInitialized] = useState(false);
    const abortControllerRef = useRef(null);

    useEffect(() => {
        const name = searchParams.get("name") || "";
        const specialty = searchParams.get("specialty") || "";
        const page = parseInt(searchParams.get("page")) || 1;
        
        setSearchTerm(name);
        dispatch(setFilters({ name, specialty }));
        dispatch(setPage(page));
        setIsInitialized(true);
    }, [dispatch, searchParams]);

    useEffect(() => {
        if (isAuthChecking || !isInitialized || !accessToken) return;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        abortControllerRef.current = new AbortController();
        
        const params = {
            name: debouncedSearch,
            specialty: filters.specialty,
            page: pagination.page,
            limit: pagination.limit
        };

        dispatch(fetchDoctors({ ...params, signal: abortControllerRef.current.signal }));
        
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [dispatch, debouncedSearch, filters.specialty, pagination.page, pagination.limit, isAuthChecking, isInitialized, accessToken]);

    const updateURL = useCallback((newFilters, newPage) => {
        const params = {};
        if (newFilters.name) params.name = newFilters.name;
        if (newFilters.specialty) params.specialty = newFilters.specialty;
        if (newPage > 1) params.page = newPage;
        setSearchParams(params);
    }, [setSearchParams]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        const updatedFilters = { ...filters, name: debouncedSearch };
        if (debouncedSearch !== filters.name) {
            dispatch(setFilters(updatedFilters));
            updateURL(updatedFilters, 1);
        }
    }, [debouncedSearch, dispatch, filters, updateURL]);

    const handleSpecialtyChange = (value) => {
        const updatedFilters = { ...filters, specialty: value };
        dispatch(setFilters(updatedFilters));
        updateURL(updatedFilters, 1);
    };

    const handlePageChange = (newPage) => {
        dispatch(setPage(newPage));
        updateURL(filters, newPage);
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        dispatch(setFilters({ name: "", specialty: "" }));
        updateURL({ name: "", specialty: "" }, 1);
    };

    return (
        <Box>
            <PageHeader 
                title="Find Your Specialist"
                subtitle="Search from our verified list of world-class medical professionals across all specialties."
                breadcrumbs={[
                    { label: "Dashboard", path: "/patient" },
                    { label: "Doctors", active: true }
                ]}
            />

            {/* Premium Filters Bar */}
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 2.5, 
                    mb: 5, 
                    borderRadius: 4, 
                    bgcolor: "background.paper", 
                    border: "1px solid",
                    borderColor: theme.palette.mode === "dark" 
                        ? "rgba(255, 255, 255, 0.08)" 
                        : "divider",
                    boxShadow: theme.palette.mode === "dark" 
                        ? "0 8px 32px rgba(0, 0, 0, 0.4)" 
                        : "0 4px 20px rgba(0, 0, 0, 0.03)",
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2.5,
                    alignItems: "center",
                    position: "sticky",
                    top: 100,
                    zIndex: 10,
                    backdropFilter: "blur(12px)",
                    backgroundColor: alpha(theme.palette.background.paper, 0.9)
                }}
            >
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search by doctor name or expertise..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon size={18} color={theme.palette.text.secondary} />
                            </InputAdornment>
                        ),
                        endAdornment: searchTerm && (
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={() => setSearchTerm("")}>
                                    <X size={14} />
                                </IconButton>
                            </InputAdornment>
                        ),
                        sx: { 
                            borderRadius: 3, 
                            bgcolor: theme.palette.mode === "dark" 
                                ? alpha(theme.palette.background.default, 0.5) 
                                : alpha(theme.palette.background.default, 0.5),
                            "& input::placeholder": {
                                color: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.5)" : "inherit",
                                opacity: 1
                            }
                        }
                    }}
                />
                
                <Box sx={{ width: { xs: "100%", md: 350 } }}>
                    <SpecialtySelect 
                        value={filters.specialty} 
                        onChange={handleSpecialtyChange} 
                    />
                </Box>
                
                <Stack direction="row" spacing={1.5} sx={{ minWidth: "fit-content" }}>
                    <Button 
                        variant="soft" 
                        color="secondary"
                        onClick={handleClearFilters}
                        startIcon={<RotateCcw size={18} />}
                        sx={{ 
                            borderRadius: 3, 
                            textTransform: "none", 
                            fontWeight: 800, 
                            px: 3, 
                            height: 44,
                            bgcolor: "action.hover",
                            color: "text.secondary",
                            border: "1px solid",
                            borderColor: "divider",
                            "&:hover": { bgcolor: "action.selected" }
                        }}
                    >
                        Reset
                    </Button>
                    <Button 
                        variant="contained" 
                        startIcon={<FilterIcon size={18} />}
                        sx={{ 
                            borderRadius: 3, 
                            textTransform: "none", 
                            fontWeight: 800, 
                            px: 4, 
                            height: 44,
                            boxShadow: 0
                        }}
                    >
                        Sort
                    </Button>
                </Stack>
            </Paper>

            <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Found <Box component="span" sx={{ color: "text.primary", fontWeight: 800 }}>{pagination.totalItems || 0}</Box> verified specialists
                </Typography>
                
                {filters.specialty && (
                    <Chip 
                        label={`Showing: ${filters.specialty}`} 
                        onDelete={() => handleSpecialtyChange("")}
                        sx={{ borderRadius: 2, fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05), color: "primary.main" }}
                    />
                )}
            </Box>

            {error && (
                <ErrorState 
                    message={error} 
                    onRetry={() => {
                        const params = {
                            name: debouncedSearch,
                            specialty: filters.specialty,
                            page: pagination.page,
                            limit: pagination.limit
                        };
                        dispatch(fetchDoctors(params));
                    }} 
                />
            )}

            {!error && (
                <Grid container spacing={3.5}>
                    {isLoading ? (
                        [...Array(6)].map((_, index) => (
                            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
                                <DoctorCardSkeleton />
                            </Grid>
                        ))
                    ) : doctors.length > 0 ? (
                        doctors.map((doctor) => (
                            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={doctor._id}>
                                <DoctorCard doctor={doctor} />
                            </Grid>
                        ))
                    ) : (
                        <Grid size={12}>
                            <EmptyState 
                                title="No Specialists Found"
                                message="We couldn't find any doctors matching your search criteria. Try broadening your filters." 
                                onClear={handleClearFilters}
                            />
                        </Grid>
                    )}
                </Grid>
            )}

            {!error && doctors.length > 0 && (
                <Box sx={{ mt: 8 }}>
                    <PaginationControl 
                        count={pagination.totalPages} 
                        page={pagination.page} 
                        onChange={handlePageChange} 
                    />
                </Box>
            )}
        </Box>
    );
};

export default DoctorListPage;
