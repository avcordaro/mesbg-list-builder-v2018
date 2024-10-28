import { Download, PlaylistAdd, UploadFile } from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import ShareIcon from "@mui/icons-material/Share";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { useEffect, useState } from "react";
import { useDownload } from "../../hooks/download.ts";
import { useAppState } from "../../state/app";
import { useRosterBuildingState } from "../../state/roster-building";
import { ModalTypes } from "../modal/modals.tsx";
import { Warbands } from "./warbands/Warbands.tsx";

export const BuilderMode = () => {
  const [fabBottom, setFabBottom] = useState("16px");
  const [fabOpen, setFabOpen] = useState(false);
  const { downloadProfileCards } = useDownload();
  const { roster } = useRosterBuildingState();
  const { setCurrentModal } = useAppState();

  const updateFabBottom = () => {
    const footerRect = document
      .getElementById("footer")
      ?.getBoundingClientRect();

    setFabBottom(`${Math.max(16, window.innerHeight - footerRect.top + 16)}px`);
  };

  useEffect(() => {
    window.addEventListener("resize", updateFabBottom);
    window.addEventListener("scroll", updateFabBottom);
    return () => {
      window.removeEventListener("resize", updateFabBottom);
      window.removeEventListener("scroll", updateFabBottom);
    };
  }, []);

  useEffect(() => updateFabBottom());

  const actions = [
    {
      icon: <PlaylistAdd />,
      name: "Create new roster",
      callback: () => setCurrentModal(ModalTypes.CREATE_NEW_ROSTER),
      disabled: roster.num_units === 0,
    },
    {
      icon: <SaveIcon />,
      name: "Export roster",
      callback: () => setCurrentModal(ModalTypes.EXPORT_ROSTER),
      disabled: roster.num_units === 0,
    },
    {
      icon: <UploadFile />,
      name: "Import roster",
      callback: () => setCurrentModal(ModalTypes.IMPORT_ROSTER),
      disabled: false,
    },
    {
      icon: <Download />,
      name: "Download profile cards",
      callback: downloadProfileCards,
      disabled: roster.num_units === 0,
    },
    {
      icon: <ShareIcon />,
      name: "Roster summary & sharing",
      callback: () => setCurrentModal(ModalTypes.ROSTER_TABLE),
      disabled: roster.num_units === 0,
    },
  ];

  return (
    <>
      <Warbands />
      <SpeedDial
        ariaLabel="action-buttons"
        sx={{ position: "fixed", bottom: fabBottom, right: 16 }}
        icon={<SpeedDialIcon />}
        open={fabOpen}
        onClick={() => setFabOpen(true)}
        onClose={() => setFabOpen(false)}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            onClick={() => {
              if (!action.disabled) action.callback();
            }}
            FabProps={{ disabled: action.disabled }}
            tooltipTitle={
              <span style={{ whiteSpace: "nowrap" }}> {action.name} </span>
            }
            tooltipOpen
          />
        ))}
      </SpeedDial>
    </>
  );
};
