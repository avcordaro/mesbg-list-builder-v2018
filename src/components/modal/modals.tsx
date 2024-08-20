import { ReactNode } from "react";
import { FaFileImport } from "react-icons/fa";
import { FaHammer } from "react-icons/fa6";
import { BuilderModeModal } from "./modals/BuilderModeModal.tsx";
import { ImportRosterModal } from "./modals/ImportRosterModal.tsx";

export enum MODAL_KEYS {
  BUILDER_MODE = "BUILDER_MODE",
  IMPORT_ROSTER_JSON = "IMPORT_ROSTER_JSON",
}

export type ModalProps = {
  children: ReactNode;
  icon: ReactNode;
  title: string;
};

export const modals = new Map<MODAL_KEYS, ModalProps>([
  [
    MODAL_KEYS.BUILDER_MODE,
    {
      icon: <FaHammer />,
      title: "Back to Builder Mode",
      children: <BuilderModeModal />,
    },
  ],
  [
    MODAL_KEYS.IMPORT_ROSTER_JSON,
    {
      icon: <FaFileImport />,
      title: "Import JSON",
      children: <ImportRosterModal />,
    },
  ],
]);