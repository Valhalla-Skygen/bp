import Member from "../wrappers/member";

export type ActionForm = {
  title?: string;
  body?: string;
  buttons: ActionFormButton[];
  member: Member;
};
export type ActionFormButton = {
  text: string;
  subtext?: string;
  icon?: string;
};

export type ModalForm = {
  title?: string;
  options: (
    | ModalFormSlider
    | ModalFormToggle
    | ModalFormDropdown
    | ModalFormLabel
    | ModalFormHeader
    | ModalFormTextField
  )[];
  member: Member;
};
export type ModalFormSlider = {
  type: "slider";
  label: string;
  min: number;
  max: number;
  step?: number;
  tooltip?: string;
  default?: number;
};
export type ModalFormTextField = {
  type: "textfield";
  label: string;
  ghost: string;
  tooltip?: string;
  default?: string;
};
export type ModalFormDropdown = {
  type: "dropdown";
  label: string;
  options: string[];
  tooltip?: string;
  default?: number;
};
export type ModalFormToggle = {
  type: "toggle";
  label: string;
  tooltip?: string;
  default?: boolean;
};
export type ModalFormLabel = {
  type: "label";
  label: string;
};
export type ModalFormHeader = {
  type: "header";
  header: string;
};

export type ChestFormSizes =
  | "small"
  | "single"
  | "large"
  | "double"
  | "5"
  | "9"
  | "18"
  | "27"
  | "36"
  | "45"
  | "54";
export interface ChestFormItem {
  itemName: string;
  texture: string;
  itemDescription?: string[];
  stackSize?: number;
  enchanted?: boolean;
  durability?: number;
}
export interface ChestFormKey extends ChestFormItem {
  character: string;
}
export interface ChestFormButton extends ChestFormItem {
  slot: number;
}
export type ChestForm = {
  title?: string;
  size: ChestFormSizes;
  member: Member;
  buttons?: ChestFormButton[];
  pattern?: {
    lines: string[];
    keys: ChestFormKey[];
  };
};
