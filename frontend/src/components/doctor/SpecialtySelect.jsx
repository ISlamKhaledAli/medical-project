import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    CircularProgress, 
    Box 
} from "@mui/material";
import { fetchSpecialties } from "../../features/doctor/specialtySlice";

const SpecialtySelect = ({ value, onChange }) => {
    const dispatch = useDispatch();
    const { specialties, isLoading } = useSelector((state) => state.specialty);

    useEffect(() => {
        if (specialties.length === 0) {
            dispatch(fetchSpecialties());
        }
    }, [dispatch, specialties.length]);

    if (isLoading && specialties.length === 0) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 1 }}>
                <CircularProgress size={24} />
            </Box>
        );
    }

    return (
        <FormControl fullWidth size="small">
            <InputLabel id="specialty-select-label">Specialty</InputLabel>
            <Select
                labelId="specialty-select-label"
                id="specialty-select"
                value={value}
                label="Specialty"
                onChange={(e) => onChange(e.target.value)}
                sx={{ borderRadius: 2 }}
            >
                <MenuItem value=""><em>All Specialties</em></MenuItem>
                {specialties.map((specialty) => (
                    <MenuItem key={specialty.id || specialty} value={specialty.name || specialty}>
                        {specialty.name || specialty}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default SpecialtySelect;
