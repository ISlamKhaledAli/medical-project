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
        <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}>
            <Table>
                <TableHead sx={{ bgcolor: "#fafafa" }}>
                    <TableRow>
                        {[...Array(cols)].map((_, i) => (
                            <TableCell key={i}>
                                <Skeleton variant="text" width="60%" height={24} />
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {[...Array(rows)].map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {[...Array(cols)].map((_, colIndex) => (
                                <TableCell key={colIndex}>
                                    <Skeleton variant="text" width={colIndex === 0 ? "80%" : "60%"} height={20} />
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
