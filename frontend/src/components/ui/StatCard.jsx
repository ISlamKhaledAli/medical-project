import { Paper, Box, Typography, alpha, useTheme } from "@mui/material";

const StatCard = ({ title, value, icon: Icon, color = "primary", subtitle, trend }) => {
  const theme = useTheme();
  const mainColor = theme.palette[color]?.main || theme.palette.primary.main;
  const lightColor = alpha(mainColor, 0.1);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        gap: 2.5,
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
        border: "1px solid",
        borderColor: "divider",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[3],
          borderColor: alpha(mainColor, 0.2),
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          borderRadius: 3,
          bgcolor: lightColor,
          color: mainColor,
          zIndex: 1,
        }}
      >
        <Icon size={28} strokeWidth={2.5} />
      </Box>

      <Box sx={{ zIndex: 1 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.5, display: "block" }}
        >
          {title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: "text.primary" }}>
            {value}
          </Typography>
          {trend && (
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: (typeof trend === 'string' ? trend.startsWith("+") : trend.isUp) ? "success.main" : "error.main",
                bgcolor: (typeof trend === 'string' ? trend.startsWith("+") : trend.isUp) ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                px: 1,
                py: 0.2,
                borderRadius: 1,
                display: "inline-flex",
                alignItems: "center"
              }}
            >
              {typeof trend === 'string' ? trend : trend.value}
            </Typography>
          )}
        </Box>
        {subtitle && (
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, mt: 0.5, display: "block" }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* Decorative background circle */}
      <Box
        sx={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: "50%",
          bgcolor: lightColor,
          opacity: 0.4,
          zIndex: 0,
        }}
      />
    </Paper>
  );
};

export default StatCard;