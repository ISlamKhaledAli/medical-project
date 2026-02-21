import { Card, CardContent, Box, Skeleton, Grid } from "@mui/material";

const DoctorCardSkeleton = () => {
    return (
        <Card sx={{ height: "100%", borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Skeleton variant="circular" width={64} height={64} sx={{ mr: 2 }} />
                    <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
                        <Skeleton variant="text" width="60%" height={20} />
                    </Box>
                </Box>
                <Box sx={{ mb: 3 }}>
                    <Skeleton variant="text" width="100%" height={16} />
                    <Skeleton variant="text" width="90%" height={16} />
                </Box>
                <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 2 }} />
            </CardContent>
        </Card>
    );
};

export default DoctorCardSkeleton;
