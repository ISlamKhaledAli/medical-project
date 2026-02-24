import { Pagination, Box } from "@mui/material";

const PaginationControl = ({ count, page, onChange }) => {
    if (count <= 1) return null;

    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6, mb: 2 }}>
            <Pagination 
                count={count} 
                page={page} 
                onChange={(_, value) => onChange(value)} 
                color="primary" 
                shape="rounded"
                size="large"
                sx={{
                    "& .MuiPaginationItem-root": {
                        fontWeight: 700,
                        borderRadius: 2
                    }
                }}
            />
        </Box>
    );
};

export default PaginationControl;
