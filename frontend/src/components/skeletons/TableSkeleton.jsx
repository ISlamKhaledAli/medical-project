import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Skeleton 
} from "@mui/material";

const TableSkeleton = ({ rows = 5, cols = 4 }) => {
    return (
        <TableContainer 
            component={Paper} 
            elevation={0} 
            sx={{ 
                border: "1px solid", 
                borderColor: "divider", 
                borderRadius: 4,
                overflow: "hidden",
                mt: 1
            }}
        >
            <Table>
                <TableHead sx={{ bgcolor: "rgba(0,0,0,0.02)" }}>
                    <TableRow>
                        {[...Array(cols)].map((_, i) => (
                            <TableCell key={i} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
                                <Skeleton variant="text" width="60%" height={24} sx={{ borderRadius: 1 }} />
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {[...Array(rows)].map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {[...Array(cols)].map((_, colIndex) => (
                                <TableCell key={colIndex} sx={{ borderBottom: rowIndex === rows - 1 ? 0 : "1px solid", borderColor: "rgba(0,0,0,0.05)", py: 2 }}>
                                    <Skeleton variant="text" width={colIndex === 0 ? "70%" : "50%"} height={20} sx={{ borderRadius: 1 }} />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableSkeleton;
