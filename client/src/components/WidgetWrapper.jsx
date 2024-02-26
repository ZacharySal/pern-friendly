import { Box } from "@mui/material";
import { styled } from "@mui/system";

const WidgetWrapper = styled(Box)(({ theme }) => ({
  padding: "1rem 1.5rem 0.75rem 1rem",
  backgroundColor: theme.palette.background.main,
  borderRadius: "0.25rem",
}));

export default WidgetWrapper;
