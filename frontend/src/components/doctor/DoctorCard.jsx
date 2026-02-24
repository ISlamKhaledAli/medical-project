import { 
    Card, 
    CardContent, 
    Box, 
    Avatar, 
    Typography, 
    Rating, 
    Button,
    Chip
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
    const navigate = useNavigate();

    return (
        <Card 
            sx={{ 
                height: "100%", 
                borderRadius: 4, 
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)", 
                transition: "0.3s", 
                "&:hover": { 
                    transform: "translateY(-8px)", 
                    boxShadow: "0 12px 24px rgba(0,0,0,0.08)" 
                },
                display: "flex",
                flexDirection: "column"
            }}
        >
            <CardContent sx={{ p: 4, flexGrow: 1 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
                    <Avatar 
                        src={doctor.image} 
                        sx={{ 
                            width: 70, 
                            height: 70, 
                            mr: 2.5, 
                            border: "3px solid #fff",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                        }} 
                    />
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: "#1a237e", mb: 0.5 }}>
                            {doctor.name}
                        </Typography>
                        <Chip 
                            label={doctor.specialty} 
                            size="small" 
                            color="primary" 
                            variant="soft" 
                            sx={{ 
                                fontWeight: 700, 
                                bgcolor: "rgba(25, 118, 210, 0.08)",
                                color: "primary.main",
                                mb: 1
                            }} 
                        />
                    </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Rating value={doctor.rating || 4.5} readOnly size="small" precision={0.5} />
                    <Typography variant="caption" sx={{ ml: 1, fontWeight: 700, color: "text.secondary" }}>
                        ({doctor.reviewCount || 120} reviews)
                    </Typography>
                </Box>

                <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                        mb: 4, 
                        display: "-webkit-box", 
                        WebkitLineClamp: 3, 
                        WebkitBoxOrient: "vertical", 
                        overflow: "hidden",
                        lineHeight: 1.6
                    }}
                >
                    {doctor.bio || "Leading specialist with over 10 years of experience in patient-centered care and modern medical practices."}
                </Typography>

                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button 
                        fullWidth 
                        variant="outlined" 
                        onClick={() => navigate(`/doctors/${doctor.id}`)}
                        sx={{ 
                            borderRadius: 2, 
                            textTransform: "none", 
                            fontWeight: 700,
                            borderWidth: 2,
                            "&:hover": { borderWidth: 2 }
                        }}
                    >
                        View Profile
                    </Button>
                    <Button 
                        fullWidth 
                        variant="contained" 
                        onClick={() => navigate(`/book/${doctor.id}`)}
                        sx={{ 
                            borderRadius: 2, 
                            textTransform: "none", 
                            fontWeight: 700,
                            boxShadow: "0 4px 14px rgba(25, 118, 210, 0.25)"
                        }}
                    >
                        Book Now
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default DoctorCard;
