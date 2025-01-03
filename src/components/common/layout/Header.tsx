import { Handyman, History } from "@mui/icons-material";
import FortIcon from "@mui/icons-material/Fort";
import MenuIcon from "@mui/icons-material/Menu";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SearchIcon from "@mui/icons-material/Search";
import { FormControlLabel, ListItemButton, ListItemIcon } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button, { ButtonProps } from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Fragment, useState } from "react";
import logo from "../../../assets/images/logo.svg";
import title from "../../../assets/images/title-v2018.png";
import { useAppState } from "../../../state/app";
import { useGameModeState } from "../../../state/gamemode";
import { useUserPreferences } from "../../../state/preference";
import { useRecentGamesState } from "../../../state/recent-games";
import { useRosterBuildingState } from "../../../state/roster-building";
import { DrawerTypes } from "../../drawer/drawers.tsx";
import { ModalTypes } from "../../modal/modals.tsx";

const UnitSelectionFocus = () => {
  const {
    roster,
    warriorSelection,
    heroSelection,
    warriorSelectionFocus: [warbandId, warriorId],
  } = useRosterBuildingState();

  if (!warriorSelection) return <></>;

  const warbandIndex = roster.warbands.findIndex(
    (warband) => warband.id === warbandId,
  );
  const warband = roster.warbands.find((warband) => warband.id === warbandId);
  const heroName = warband?.hero?.name
    ? warband.hero.name.split(/[,|\\(]/)[0]?.trim()
    : null;

  const warrior = warband?.units.find((warrior) => warrior.id === warriorId);
  const warriorName = warrior?.name
    ? warrior.name.split(/[,|\\(]/)[0]?.trim()
    : null;

  return (
    <Box sx={{ pt: 1 }}>
      {heroSelection ? (
        <>
          <Typography>Selecting Hero for warband {warbandIndex}</Typography>
        </>
      ) : warriorName ? (
        <>
          <Typography>
            {!heroName
              ? `Selecting replacement for ${warriorName} in warband ${warbandIndex}.`
              : `Selecting replacement for ${warriorName} in ${heroName}'s warband.`}
          </Typography>
        </>
      ) : (
        <>
          <Typography>
            {!heroName
              ? `Selecting unit for warband ${warbandIndex}.`
              : `Selecting unit for ${heroName}'s warband.`}
          </Typography>
        </>
      )}
    </Box>
  );
};

const RosterInfoBar = () => {
  const { roster } = useRosterBuildingState();
  const breakPoint = Math.ceil(roster.num_units / 2);
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box
      id="roster-totals"
      sx={{
        backgroundColor: "#1c1c1e",
        color: "white",
        p: 2,
        textAlign: "center",
        position: "sticky",
        top: 0,
        overflow: "auto",
        zIndex: 1,
      }}
    >
      <Stack
        direction="row"
        spacing={isMobile ? 2 : 4}
        justifyContent="center"
        textAlign="center"
        flexWrap="wrap"
      >
        <Typography variant="body1" component="div">
          Points: <b>{roster.points}</b>
        </Typography>
        <Typography variant="body1" component="div">
          Units: <b>{roster.num_units}</b>
        </Typography>
        <Typography variant="body1" component="div">
          Break Point: <b>{breakPoint}</b>
        </Typography>
        {!isMobile && (
          <>
            <Typography variant="body1" component="div">
              Bows: <b>{roster.bow_count}</b>
            </Typography>
            <Typography variant="body1" component="div">
              Might: <b>{roster.might_total ?? "N/A"}</b>
            </Typography>
          </>
        )}
      </Stack>
      {isMobile && (
        <Stack
          direction="row"
          spacing={isMobile ? 2 : 4}
          justifyContent="center"
          textAlign="center"
          flexWrap="wrap"
        >
          <Typography variant="body1" component="div">
            Bows: <b>{roster.bow_count}</b>
          </Typography>
          <Typography variant="body1" component="div">
            Might: <b>{roster.might_total ?? "N/A"}</b>
          </Typography>
        </Stack>
      )}
      {isTablet && <UnitSelectionFocus />}
    </Box>
  );
};

export const Header = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { roster, allianceLevel } = useRosterBuildingState();
  const { gameMode, gameState, setGameMode, startNewGame } = useGameModeState();
  const { showHistory, setShowHistory } = useRecentGamesState();
  const { setCurrentModal, openSidebar } = useAppState();
  const { useDenseMode, setDenseMode } = useUserPreferences();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleStartGame = () => {
    if (!gameState) {
      // if there is no game present, just start a new game.
      startNewGame(roster, allianceLevel);
      setShowHistory(false);
      return;
    }

    const lastGameUpdate = new Date(gameState.lastUpdated).getTime();
    const currentDate = new Date().getTime();

    const differenceInMillis = currentDate - lastGameUpdate;
    const differenceInDays = differenceInMillis / (1000 * 60 * 60 * 24);

    if (differenceInDays <= 1) {
      // existing game was updated within the last 24h.
      // let's ask if they like to continue their game or start a new one
      setCurrentModal(ModalTypes.CONTINUE_GAME);
    } else {
      // existing is older than one day. No need to continue yesterday's game.
      startNewGame(roster, allianceLevel);
      setShowHistory(false);
    }
  };

  const switchScreen = (screen: "builder" | "game" | "history") => {
    switch (screen) {
      case "builder":
        setGameMode(false);
        setShowHistory(false);
        break;
      case "game":
        handleStartGame();
        break;
      case "history":
        setShowHistory(true);
        break;
    }
  };

  // List of buttons
  const buttons = [
    {
      icon: <Handyman />,
      label: "Builder",
      onClick: () => switchScreen("builder"),
      color: "success" as ButtonProps["color"],
      visible: showHistory || gameMode,
    },
    {
      icon: <FortIcon />,
      label: "Game Mode",
      onClick: () => switchScreen("game"),
      color: "success" as ButtonProps["color"],
      visible: !showHistory && !gameMode,
    },
    {
      icon: <History />,
      label: "Matches",
      onClick: () => switchScreen("history"),
      outlined: true,
      color: "inherit" as ButtonProps["color"],
      visible: true,
    },
    {
      icon: <SearchIcon />,
      label: "Keywords",
      onClick: () => openSidebar(DrawerTypes.KEYWORD_SEARCH),
      outlined: true,
      color: "inherit" as ButtonProps["color"],
      visible: true,
    },
    {
      icon: <OpenInNewIcon />,
      label: "2024 Edition",
      onClick: () =>
        window.open("https://v2024.mesbg-list-builder.com/rosters", "_blank"),
      outlined: true,
      color: "inherit" as ButtonProps["color"],
      visible: true,
    },
  ];

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#1c1c1e" }}>
        <Toolbar>
          {/* Logo */}
          <Button aria-label="logo" sx={{ mr: 2 }} href={window.location.href}>
            <img src={logo} alt="Logo" style={{ height: "50px" }} />
            <img
              src={title}
              alt="MESBG List Builder"
              style={{ maxHeight: "42px", margin: "0 .25rem" }}
            />
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          {/* Right side buttons (hide in mobile) */}
          {!isTablet && (
            <Box sx={{ display: { xs: "none", sm: "flex" } }}>
              {buttons
                .filter((button) => button.visible)
                .map((button, index) => (
                  <Button
                    key={index}
                    sx={{ p: 1, pt: 1, pb: 1, m: 1, minWidth: "144px" }}
                    variant={button.outlined ? "outlined" : "contained"}
                    color={button.color ? button.color : "primary"}
                    onClick={button.onClick}
                    size="small"
                    startIcon={button.icon}
                  >
                    {button.label}
                  </Button>
                ))}
            </Box>
          )}

          {/* Hamburger Menu for Mobile */}
          {isTablet && (
            <>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </>
          )}
        </Toolbar>
        {isMobile && !showHistory && !gameMode && (
          <FormControlLabel
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            control={
              <Switch
                name="Dense UI"
                checked={useDenseMode}
                onChange={(value) => setDenseMode(value.target.checked)}
                sx={{
                  "& .MuiSwitch-track": {
                    backgroundColor: "lightgrey", // background color of the track in unchecked state
                  },
                }}
              />
            }
            label="Use dense UI mode"
          />
        )}
      </AppBar>
      {!showHistory && <RosterInfoBar />}

      {/* Drawer for mobile menu */}
      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            backgroundColor: "#1c1c1e",
            color: "white",
          },
        }}
      >
        <Box
          role="presentation"
          onClick={handleDrawerToggle}
          onKeyDown={handleDrawerToggle}
        >
          <List>
            <ListItem>
              <img
                src={title}
                alt="MESBG List Builder"
                style={{ maxWidth: "400px", width: "100%" }}
              />
            </ListItem>
            <Divider sx={{ m: 2 }} />
            {buttons
              .filter((button) => button.visible)
              .map((button, index) => (
                <Fragment key={index}>
                  <ListItemButton onClick={button.onClick}>
                    {button.icon && (
                      <ListItemIcon sx={{ color: "white" }}>
                        {button.icon}
                      </ListItemIcon>
                    )}
                    <ListItemText
                      primaryTypographyProps={{ fontSize: "1.4rem" }}
                      primary={button.label}
                    />
                  </ListItemButton>
                </Fragment>
              ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};
