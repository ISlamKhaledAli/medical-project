import { useEffect, useCallback, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { 
    Container, 
    Grid, 
    Typography, 
    Box, 
    TextField, 
    InputAdornment,
    Paper,
    Button
} from "@mui/material";
import { Search as SearchIcon, FilterList as FilterIcon } from "@mui/icons-material";
import { fetchDoctors, setFilters, setPage } from "../../features/doctor/doctorSlice";
import { useDebounce } from "../../hooks/useDebounce";
import DoctorCard from "../../components/doctor/DoctorCard";
import SpecialtySelect from "../../components/doctor/SpecialtySelect";
import PaginationControl from "../../components/ui/PaginationControl";
import DoctorCardSkeleton from "../../components/skeletons/DoctorCardSkeleton";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import { setGlobalSearchQuery, clearGlobalSearchQuery } from "../../features/ui/uiSlice";

const DoctorListPage = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const { doctors, isLoading, error, pagination, filters } = useSelector((state) => state.doctor);
    const { isAuthChecking, user, accessToken } = useSelector((state) => state.auth);
    const { globalSearchQuery } = useSelector((state) => state.ui);
    
    // Local state for immediate search input feedback - initialize from global search
    const [searchTerm, setSearchTerm] = useState(filters.name || globalSearchQuery || "");
    const debouncedSearch = useDebounce(searchTerm, 500);
    const [isInitialized, setIsInitialized] = useState(false);
    
    // AbortController ref to cancel stale requests
    const abortControllerRef = useRef(null);

    // Effect to sync global search query to local search term
    useEffect(() => {
        if (globalSearchQuery !== searchTerm) {
            setSearchTerm(globalSearchQuery);
        }
    }, [globalSearchQuery]);

    // 1. Sync URL params to Redux state (ONLY ON MOUNT or URL change)
    useEffect(() => {
        const name = searchParams.get("name") || "";
        const specialty = searchParams.get("specialty") || "";
        const page = parseInt(searchParams.get("page")) || 1;
        
        // Initialize local search term from URL or global search
        setSearchTerm(name || globalSearchQuery || "");
        
        dispatch(setFilters({ name: name || globalSearchQuery, specialty }));
        dispatch(setPage(page));
        setIsInitialized(true);
    }, [dispatch, searchParams]); // searchParams change happens only when updateURL or manual URL edit happens

    // 2. Fetch doctors when debounced filters or page change
    useEffect(() => {
        // FETCH GUARDS
        // 1. Wait for auth initialization
        // 2. Wait for URL parameters to be synced to Redux
        // 3. Ensure user is authenticated
        if (isAuthChecking || !isInitialized || !accessToken) return;

        // Cancel previous request if it exists
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        // Create new AbortController
        abortControllerRef.current = new AbortController();
        
        const params = {
            name: debouncedSearch,
            specialty: filters.specialty,
            page: pagination.page,
            limit: pagination.limit
        };

        dispatch(fetchDoctors({ ...params, signal: abortControllerRef.current.signal }));
        
        return () => {
            // Cleanup: abort if component unmounts or effect re-runs
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [dispatch, debouncedSearch, filters.specialty, pagination.page, pagination.limit, isAuthChecking, isInitialized, accessToken]);

    // 3. Update URL when filters or page change
    const updateURL = useCallback((newFilters, newPage) => {
        const params = {};
        if (newFilters.name) params.name = newFilters.name;
        if (newFilters.specialty) params.specialty = newFilters.specialty;
        if (newPage > 1) params.page = newPage;
        setSearchParams(params);
    }, [setSearchParams]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        // Note: URL update only happens after debounce in another effect or here
        // Usually better to update URL only after debounce or on blur to avoid messy URls
    };

    // Effect to update URL when debounced search changes
    useEffect(() => {
        const updatedFilters = { ...filters, name: debouncedSearch };
        // Avoid redundant Redux dispatch if values are the same
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
        dispatch(clearGlobalSearchQuery());
        updateURL({ name: "", specialty: "" }, 1);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 5 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: "#1a237e", mb: 1 }}>
                    Find Your Specialist
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Search from our verified list of world-class medical professionals.
                </Typography>
            </Box>

            {/* Filters Bar */}
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 3, 
                    mb: 4, 
                    borderRadius: 3, 
                    bgcolor: "white", 
                    border: "1px solid rgba(0,0,0,0.05)",
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                    alignItems: "center"
                }}
            >
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search doctor name..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                        sx: { borderRadius: 2 }
                    }}
                />
                <Box sx={{ width: { xs: "100%", md: 300 } }}>
                    <SpecialtySelect 
                        value={filters.specialty} 
                        onChange={handleSpecialtyChange} 
                    />
                </Box>
                <Button 
                    variant="outlined" 
                    startIcon={<FilterIcon />}
                    sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, px: 3, height: 40, whiteSpace: "nowrap" }}
                >
                    Filters
                </Button>
            </Paper>

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
                <Grid container spacing={4}>
                    {isLoading ? (
                        [...Array(6)].map((_, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <DoctorCardSkeleton />
                            </Grid>
                        ))
                    ) : doctors.length > 0 ? (
                        doctors.map((doctor) => (
                            <Grid item xs={12} sm={6} md={4} key={doctor._id}>
                                <DoctorCard doctor={doctor} />
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <EmptyState 
                                message="No doctors found" 
                                subMessage="Try adjusting your search or category filters to find what you're looking for." 
                                onClear={handleClearFilters}
                            />
                        </Grid>
                    )}
                </Grid>
            )}

            {!error && doctors.length > 0 && (
                <PaginationControl 
                    count={pagination.totalPages} 
                    page={pagination.page} 
                    onChange={handlePageChange} 
                />
            )}
        </Container>
    );
};

export default DoctorListPage;
