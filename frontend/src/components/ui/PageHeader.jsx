import { Box, Typography, Button, Stack, Breadcrumbs, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { ChevronRight as ChevronIcon } from "lucide-react";

/**
 * Shared Page Header component for all views
 */
const PageHeader = ({ 
  title, 
  subtitle, 
  actionLabel, 
  onAction, 
  actionIcon: ActionIcon,
  action,
  breadcrumbs = []
}) => {
  const finalAction = action || (actionLabel ? { label: actionLabel, onAction, icon: ActionIcon } : null);

  return (
    <Box sx={{ mb: 5 }}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs 
          separator={<ChevronIcon size={14} />} 
          sx={{ mb: 1, "& .MuiBreadcrumbs-li": { fontSize: "0.75rem", fontWeight: 600 } }}
        >
          {breadcrumbs.map((crumb, idx) => (
            crumb.path ? (
              <Link
                key={idx}
                component={RouterLink}
                to={crumb.path}
                color="inherit"
                sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}
              >
                {crumb.label}
              </Link>
            ) : (
              <Typography key={idx} color="text.primary" sx={{ fontSize: "inherit", fontWeight: "inherit" }}>
                {crumb.label}
              </Typography>
            )
          ))}
        </Breadcrumbs>
      )}

      <Stack 
        direction={{ xs: "column", sm: "row" }} 
        justifyContent="space-between" 
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={2}
      >
        <Box>
          <Typography variant="h3" sx={{ color: "text.primary", mb: 0.5 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500, opacity: 0.8 }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {finalAction && (
          <Button
            variant="contained"
            disableElevation
            component={finalAction.path ? RouterLink : "button"}
            to={finalAction.path}
            startIcon={finalAction.icon ? <finalAction.icon size={18} /> : null}
            onClick={finalAction.onClick || finalAction.onAction}
            sx={{ 
              borderRadius: 3, 
              px: 3, 
              py: 1.2, 
              fontSize: "0.9rem",
              boxShadow: "0 4px 12px rgba(21, 101, 192, 0.2)"
            }}
          >
            {finalAction.label}
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default PageHeader;
