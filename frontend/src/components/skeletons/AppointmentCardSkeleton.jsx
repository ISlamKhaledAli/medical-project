import { Card, CardContent, Box, Skeleton, Chip } from "@mui/material";

const AppointmentCardSkeleton = () => {
    return (
        <Card sx={{ mb: 2, borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <CardContent sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="30%" height={20} sx={{ mb: 0.5 }} />
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                         <Skeleton variant="circular" width={16} height={16} />
                         <Skeleton variant="text" width="20%" height={16} />
                    </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                    <Skeleton variant="rectangular" width={80} height={28} sx={{ borderRadius: 4 }} />
                    <Skeleton variant="text" width={60} height={20} />
                </Box>
            </CardContent>
        </Card>
    );
};

export default AppointmentCardSkeleton;
