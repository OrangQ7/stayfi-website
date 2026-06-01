export type FaceFeaturePresetId =
  | "none"
  | "blue_classic"
  | "yellow_classic"
  | "green_lively"
  | "odd_eyes"
  | "grey_soft"
  | "black_classic"
  | "bean_eyes"
  | "squint_eyes"
  | "tiny_face";

export type FaceFeatureRole =
  | "left_eye_accent"
  | "left_eye_core"
  | "right_eye_core"
  | "right_eye_accent"
  | "nose"
  | "mouth"
  | "mouth_left"
  | "mouth_right"
  | "blush_left"
  | "blush_right";

export type FaceFeatureCell = {
  row: number;
  col: number;
  role: FaceFeatureRole;
};

export type FaceFeaturePreset = {
  id: FaceFeaturePresetId;
  label: string;
  cells: FaceFeatureCell[];
};

const CLASSIC_EYE_SHAPE: FaceFeatureCell[] = [
  { row: 5, col: 6, role: "left_eye_accent" },
  { row: 6, col: 6, role: "left_eye_accent" },
  { row: 5, col: 7, role: "left_eye_core" },
  { row: 6, col: 7, role: "left_eye_core" },

  { row: 5, col: 11, role: "right_eye_core" },
  { row: 6, col: 11, role: "right_eye_core" },
  { row: 5, col: 12, role: "right_eye_accent" },
  { row: 6, col: 12, role: "right_eye_accent" },

  { row: 6, col: 9, role: "nose" },
  { row: 7, col: 8, role: "mouth" },
  { row: 7, col: 9, role: "mouth" },
  { row: 7, col: 10, role: "mouth" },
  { row: 7, col: 11, role: "mouth" },
];

const BEAN_EYE_SHAPE: FaceFeatureCell[] = [
  { row: 5, col: 7, role: "left_eye_core" },
  { row: 5, col: 11, role: "right_eye_core" },
  { row: 6, col: 9, role: "nose" },
  { row: 6, col: 10, role: "nose" },
];

const SQUINT_EYE_SHAPE: FaceFeatureCell[] = [
  { row: 5, col: 6, role: "left_eye_core" },
  { row: 5, col: 7, role: "left_eye_core" },
  { row: 5, col: 11, role: "right_eye_core" },
  { row: 5, col: 12, role: "right_eye_core" },
  { row: 6, col: 9, role: "nose" },
  { row: 7, col: 9, role: "mouth" },
  { row: 7, col: 10, role: "mouth" },
];

const TINY_FACE_SHAPE: FaceFeatureCell[] = [
  { row: 5, col: 7, role: "left_eye_core" },
  { row: 5, col: 11, role: "right_eye_core" },
  { row: 6, col: 9, role: "nose" },
  { row: 7, col: 10, role: "mouth" },
];

export const FACE_FEATURE_PRESETS: Record<
  FaceFeaturePresetId,
  FaceFeaturePreset
> = {
  none: {
    id: "none",
    label: "无五官",
    cells: [],
  },
  blue_classic: {
    id: "blue_classic",
    label: "蓝眼清透",
    cells: CLASSIC_EYE_SHAPE,
  },
  yellow_classic: {
    id: "yellow_classic",
    label: "黄眼经典",
    cells: CLASSIC_EYE_SHAPE,
  },
  green_lively: {
    id: "green_lively",
    label: "绿眼灵动",
    cells: CLASSIC_EYE_SHAPE,
  },
  odd_eyes: {
    id: "odd_eyes",
    label: "异瞳",
    cells: CLASSIC_EYE_SHAPE,
  },
  grey_soft: {
    id: "grey_soft",
    label: "灰眼柔和",
    cells: CLASSIC_EYE_SHAPE,
  },
  black_classic: {
    id: "black_classic",
    label: "黑眼经典",
    cells: CLASSIC_EYE_SHAPE,
  },
  bean_eyes: {
    id: "bean_eyes",
    label: "豆豆眼",
    cells: BEAN_EYE_SHAPE,
  },
  squint_eyes: {
    id: "squint_eyes",
    label: "眯眯眼",
    cells: SQUINT_EYE_SHAPE,
  },
  tiny_face: {
    id: "tiny_face",
    label: "极简小脸",
    cells: TINY_FACE_SHAPE,
  },
};

export const FACE_FEATURE_PRESET_IDS = Object.keys(
  FACE_FEATURE_PRESETS,
) as FaceFeaturePresetId[];

export function getFaceFeaturePreset(
  id: FaceFeaturePresetId,
): FaceFeaturePreset {
  return FACE_FEATURE_PRESETS[id] ?? FACE_FEATURE_PRESETS.none;
}

export function isFaceFeaturePresetId(
  value: unknown,
): value is FaceFeaturePresetId {
  return (
    typeof value === "string" &&
    FACE_FEATURE_PRESET_IDS.includes(value as FaceFeaturePresetId)
  );
}
