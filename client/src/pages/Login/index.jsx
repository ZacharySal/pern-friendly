import { Alert, Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import Form from "../../pages/Login/form";

const LoginPage = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const theme = useTheme();
  const isDesktopScreen = useMediaQuery("(min-width: 768px)");
  return (
    <Box className="min-w-screen">
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          Friendly
        </Typography>
      </Box>

      <Box
        width={isDesktopScreen ? "50%" : "90%"}
        p="2rem"
        m="5rem auto"
        borderRadius="1.5rem"
        className="max-w-[750px]"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" marginBottom="0.25rem" variant="h5" sx={{}}>
          Welcome to Friendly!
        </Typography>
        <Typography
          fontWeight="400"
          marginBottom="1.5rem"
          variant="h6"
          color={theme.palette.neutral.medium}
        >
          Please login to continue, or use our demo account.
        </Typography>

        {errorMsg && (
          <Alert severity="error" sx={{ fontSize: "inherit", mb: "1.5rem" }}>
            {errorMsg}
          </Alert>
        )}
        <Form setErrorMsg={setErrorMsg} />
      </Box>
    </Box>
  );
};

export default LoginPage;
