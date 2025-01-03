import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useAppState } from "../../../state/app";
import { DrawerTypes } from "../../drawer/drawers.tsx";

export const Footer = () => {
  const { openSidebar } = useAppState();
  return (
    <Box
      id="footer"
      sx={{
        backgroundColor: "#1c1c1e",
        color: "white",
        p: 1,
        textAlign: "center",

        width: "100%",
        "& a": { color: "rgb(110, 168, 254)" },
      }}
    >
      <Typography variant="body2" sx={{ display: "block", m: 1 }}>
        Unofficial |{" "}
        <Typography
          sx={{
            cursor: "pointer",
            textDecoration: "underline",
            color: "rgb(110, 168, 254)",
          }}
          component="span"
          onClick={(e) => {
            e.preventDefault();
            openSidebar(DrawerTypes.CHANGELOG);
          }}
        >
          v{BUILD_VERSION}
        </Typography>{" "}
        | updated {BUILD_DATE}
      </Typography>
      <Typography variant="caption">
        For any bugs and corrections, please contact:{" "}
        <a
          style={{ display: "inline-block" }}
          href="mailto:support@mesbg-list-builder.com?subject=MESBG List Builder (v2018) - Bug/Correction"
        >
          support@mesbg-list-builder.com
        </a>
      </Typography>
      <Typography variant="body2" sx={{ display: "block", m: 1 }}>
        Developed by <a href="https://github.com/avcordaro">avcordaro</a> &{" "}
        <a href="https://github.com/mhollink">mhollink</a> | © 2024
      </Typography>
    </Box>
  );
};
