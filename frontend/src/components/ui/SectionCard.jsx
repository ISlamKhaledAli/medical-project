import { Paper, Box, Typography, Divider, Button, alpha, useTheme } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

/**
 * Consistent card wrapper for dashboard sections
 */
const SectionCard = ({ title, children, action, sx = {}, contentSx = {} }) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        ...sx
      }}
    >
      {(title || action) && (
        <>
          <Box 
            sx={{ 
              px: 3, 
              py: 2, 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              bgcolor: "action.hover" 
            }}
          >
            {title && (
              <Typography variant="h6" sx={{ color: "text.primary", fontWeight: 700 }}>
                {title}
              </Typography>
            )}
            {action && (
              typeof action === "object" ? (
                <Button
                  component={action.path ? RouterLink : "button"}
                  to={action.path}
                  onClick={action.onAction}
                  startIcon={action.icon ? <action.icon size={16} /> : null}
                  variant="soft"
                  size="small"
                  sx={{ 
                    borderRadius: 2, 
                    textTransform: "none", 
                    fontWeight: 700,
                    px: 2
                  }}
                >
                  {action.label}
                </Button>
              ) : action
            )}
          </Box>
          <Divider sx={{ opacity: 0.6 }} />
        </>
      )}
      <Box sx={{ p: 3, flexGrow: 1, ...contentSx }}>
        {children}
      </Box>
    </Paper>
  );
};

export default SectionCard;
