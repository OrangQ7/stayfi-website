import type { FeatureRegion } from "./flexibleCatTemplate";
import type { FeatureColorRole, FeatureRegionPlan } from "./flexibleCatTypes";

export const EXPRESSION_PRESET_IDS = [
  "faceless",
  "yellow_eyes",
  "blue_eyes",
  "green_eyes",
  "odd_yellow_blue",
  "grey_eyes",
  "black_simple",
  "dot_cute",
  "sleepy",
] as const;

export type ExpressionPresetId = (typeof EXPRESSION_PRESET_IDS)[number];

export type ExpressionFeatureCell = {
  row: number;
  col: number;
  feature: FeatureRegion;
  colorRole?: FeatureColorRole;
};

export type ExpressionPresetDefinition = {
  id: ExpressionPresetId;
  label: string;
  description: string;
  cells: ExpressionFeatureCell[];
  defaultFeaturePlan: FeatureRegionPlan;
  previewRoles: FeatureColorRole[];
};

export const DEFAULT_EXPRESSION_PRESET: ExpressionPresetId = "faceless";

const darkNoseMouth: FeatureRegionPlan = {
  LEYE: "eye_black",
  REYE: "eye_black",
  NOSE: "nose_black",
  MOUTH: "mouth_dark",
};

const compactNoseMouthCells: ExpressionFeatureCell[] = [
  { row: 6, col: 9, feature: "NOSE" },
  { row: 6, col: 10, feature: "NOSE" },
  { row: 7, col: 9, feature: "MOUTH" },
  { row: 7, col: 10, feature: "MOUTH" },
];

function verticalColorEyeCells(): ExpressionFeatureCell[] {
  return [
    { row: 5, col: 6, feature: "LEYE" },
    { row: 6, col: 6, feature: "LEYE" },
    { row: 5, col: 7, feature: "LEYE", colorRole: "eye_black" },
    { row: 6, col: 7, feature: "LEYE", colorRole: "eye_black" },
    { row: 5, col: 11, feature: "REYE", colorRole: "eye_black" },
    { row: 6, col: 11, feature: "REYE", colorRole: "eye_black" },
    { row: 5, col: 12, feature: "REYE" },
    { row: 6, col: 12, feature: "REYE" },
    ...compactNoseMouthCells,
  ];
}

const blackSimpleCells: ExpressionFeatureCell[] = [
  { row: 5, col: 6, feature: "LEYE" },
  { row: 6, col: 6, feature: "LEYE" },
  { row: 5, col: 12, feature: "REYE" },
  { row: 6, col: 12, feature: "REYE" },
  ...compactNoseMouthCells,
];

const dotCuteCells: ExpressionFeatureCell[] = [
  { row: 5, col: 6, feature: "LEYE" },
  { row: 5, col: 12, feature: "REYE" },
  { row: 6, col: 9, feature: "NOSE" },
  { row: 6, col: 10, feature: "NOSE" },
  { row: 7, col: 9, feature: "MOUTH" },
  { row: 7, col: 10, feature: "MOUTH" },
];

const sleepyCells: ExpressionFeatureCell[] = [
  { row: 5, col: 6, feature: "LEYE" },
  { row: 5, col: 7, feature: "LEYE" },
  { row: 5, col: 11, feature: "REYE" },
  { row: 5, col: 12, feature: "REYE" },
  { row: 6, col: 9, feature: "NOSE" },
  { row: 6, col: 10, feature: "NOSE" },
  { row: 7, col: 9, feature: "MOUTH" },
  { row: 7, col: 10, feature: "MOUTH" },
];

export const EXPRESSION_PRESETS: ExpressionPresetDefinition[] = [
  {
    id: "faceless",
    label: "无五官",
    description: "只保留毛色和轮廓。",
    cells: [],
    defaultFeaturePlan: darkNoseMouth,
    previewRoles: [],
  },
  {
    id: "yellow_eyes",
    label: "黄眼经典",
    description: "黄色竖眼，加深色鼻嘴。",
    cells: verticalColorEyeCells(),
    defaultFeaturePlan: {
      ...darkNoseMouth,
      LEYE: "eye_yellow",
      REYE: "eye_yellow",
    },
    previewRoles: ["eye_yellow", "eye_black", "nose_black"],
  },
  {
    id: "blue_eyes",
    label: "蓝眼清透",
    description: "蓝色竖眼，加深色鼻嘴。",
    cells: verticalColorEyeCells(),
    defaultFeaturePlan: {
      ...darkNoseMouth,
      LEYE: "eye_blue",
      REYE: "eye_blue",
    },
    previewRoles: ["eye_blue", "eye_black", "nose_black"],
  },
  {
    id: "green_eyes",
    label: "绿眼灵动",
    description: "绿色竖眼，加深色鼻嘴。",
    cells: verticalColorEyeCells(),
    defaultFeaturePlan: {
      ...darkNoseMouth,
      LEYE: "eye_green",
      REYE: "eye_green",
    },
    previewRoles: ["eye_green", "eye_black", "nose_black"],
  },
  {
    id: "odd_yellow_blue",
    label: "异瞳",
    description: "一黄一蓝，加深色鼻嘴。",
    cells: verticalColorEyeCells(),
    defaultFeaturePlan: {
      ...darkNoseMouth,
      LEYE: "eye_yellow",
      REYE: "eye_blue",
    },
    previewRoles: ["eye_yellow", "eye_blue", "nose_black"],
  },
  {
    id: "grey_eyes",
    label: "灰眼柔和",
    description: "灰色竖眼，加深色鼻嘴。",
    cells: verticalColorEyeCells(),
    defaultFeaturePlan: {
      ...darkNoseMouth,
      LEYE: "eye_grey",
      REYE: "eye_grey",
    },
    previewRoles: ["eye_grey", "eye_black", "nose_black"],
  },
  {
    id: "black_simple",
    label: "黑眼经典",
    description: "简洁黑色竖眼。",
    cells: blackSimpleCells,
    defaultFeaturePlan: darkNoseMouth,
    previewRoles: ["eye_black", "nose_black"],
  },
  {
    id: "dot_cute",
    label: "豆豆眼",
    description: "小黑豆眼，表情更软。",
    cells: dotCuteCells,
    defaultFeaturePlan: darkNoseMouth,
    previewRoles: ["eye_black", "mouth_dark"],
  },
  {
    id: "sleepy",
    label: "眯眯眼",
    description: "横向眯眼，适合慵懒表情。",
    cells: sleepyCells,
    defaultFeaturePlan: darkNoseMouth,
    previewRoles: ["eye_black", "mouth_dark"],
  },
];

export const EXPRESSION_PRESET_LABELS: Record<ExpressionPresetId, string> =
  Object.fromEntries(
    EXPRESSION_PRESETS.map((preset) => [preset.id, preset.label]),
  ) as Record<ExpressionPresetId, string>;

export function isExpressionPresetId(value: unknown): value is ExpressionPresetId {
  return (
    typeof value === "string" &&
    EXPRESSION_PRESET_IDS.includes(value as ExpressionPresetId)
  );
}

export function getExpressionPreset(
  id: ExpressionPresetId,
): ExpressionPresetDefinition {
  return (
    EXPRESSION_PRESETS.find((preset) => preset.id === id) ??
    EXPRESSION_PRESETS[0]
  );
}

export function getExpressionFeatureCells(
  id: ExpressionPresetId,
): ExpressionFeatureCell[] {
  return getExpressionPreset(id).cells;
}

export function getExpressionFeaturePlan(
  id: ExpressionPresetId,
): FeatureRegionPlan {
  return { ...getExpressionPreset(id).defaultFeaturePlan };
}
