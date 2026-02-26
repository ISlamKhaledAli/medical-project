import { 
    Card, 
    CardContent, 
    Box, 
    Avatar, 
    Typography, 
    Rating, 
    Button,
    alpha,
    useTheme,
    Stack,
    Divider
} from "@mui/material";
import { 
    Star, 
    Clock, 
    MapPin, 
    Award,
    Calendar,
    ChevronRight,
    User
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <Card 
            sx={{ 
                height: "100%", 
                borderRadius: 4, 
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 4px 12px rgba(0,0,0,0.02)", 
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", 
                overflow: "hidden",
                "&:hover": { 
                    transform: "translateY(-6px)", 
                    boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
                    borderColor: "primary.light"
                },
                display: "flex",
                flexDirection: "column",
                position: "relative",
                flex: "1 1 auto"
            }}
        >
            {/* Experience Badge */}
            <Box 
                sx={{ 
                    position: "absolute", 
                    top: 16, 
                    right: 16, 
                    zIndex: 1,
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    color: "secondary.dark",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5
                }}
            >
                <Award size={14} />
                <Typography variant="caption" sx={{ fontWeight: 800 }}>
                    {doctor.experienceYears || "8+"} Yrs Exp
                </Typography>
            </Box>

            <CardContent sx={{ p: 3, flexGrow: 1 }}>
                <Stack direction="row" spacing={2.5} sx={{ mb: 3 }}>
                    <Avatar 
                        src={doctor.image} 
                        variant="rounded"
                        sx={{ 
                            width: 80, 
                            height: 80, 
                            borderRadius: 3,
                            bgcolor: "primary.main",
                            boxShadow: "0 8px 16px rgba(21, 101, 192, 0.1)"
                        }} 
                    >
                        <User size={40} />
                    </Avatar>
                    
                    <Box sx={{ pt: 0.5, flexGrow: 1, minWidth: 0 }}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontWeight: 900, 
                                lineHeight: 1.2, 
                                mb: 0.8,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                wordBreak: "break-word"
                            }}
                        >
                            Dr. {doctor.user?.fullName || doctor.user?.name}
                        </Typography>
                        <Typography 
                            variant="subtitle2" 
                            sx={{ 
                                fontWeight: 800, 
                                color: "primary.main",
                                textTransform: "uppercase",
                                letterSpacing: 1,
                                fontSize: "0.7rem"
                            }}
                        >
                            {doctor.specialty?.name || doctor.specialty || "General Practitioner"}
                        </Typography>
                    </Box>
                </Stack>

                <Stack spacing={1.5} sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Rating 
                            value={doctor.rating || 4.8} 
                            readOnly 
                            size="small" 
                            precision={0.5} 
                            icon={<Star fontSize="inherit" fill="currentColor" />}
                            emptyIcon={<Star fontSize="inherit" />}
                        />
                        <Typography variant="caption" sx={{ fontWeight: 800, color: "text.primary" }}>
                            {doctor.rating || 4.8}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            ({doctor.reviewCount || "150+"} reviews)
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
                        <MapPin size={16} />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {doctor.hospitalName || "City Medical Center"}
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
                        <Clock size={16} />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            Available: Mon - Fri, 09:00 - 17:00
                        </Typography>
                    </Box>
                </Stack>

                <Divider sx={{ mb: 2.5, opacity: 0.6 }} />

                <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                        mb: 3, 
                        display: "-webkit-box", 
                        WebkitLineClamp: 2, 
                        WebkitBoxOrient: "vertical", 
                        overflow: "hidden",
                        lineHeight: 1.6,
                        fontWeight: 500,
                        height: 40
                    }}
                >
                    {doctor.bio || "Leading specialist providing personalized care with advanced clinical techniques."}
                </Typography>

                <Stack direction="row" spacing={1.5}>
                    <Button 
                        fullWidth 
                        variant="outlined" 
                        onClick={() => navigate(`/patient/doctors/${doctor._id}`)}
                        sx={{ 
                            borderRadius: 2.5, 
                            textTransform: "none", 
                            fontWeight: 800,
                            py: 1,
                            borderWidth: 1.5,
                            "&:hover": { borderWidth: 1.5 }
                        }}
                    >
                        Profile
                    </Button>
                    <Button 
                        fullWidth 
                        variant="contained" 
                        endIcon={<ChevronRight size={16} />}
                        onClick={() => navigate(`/patient/book/${doctor._id}`)}
                        sx={{ 
                            borderRadius: 2.5, 
                            textTransform: "none", 
                            fontWeight: 800,
                            py: 1,
                            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.15)}`
                        }}
                    >
                        Book
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default DoctorCard;
