export type FixedOutputTemplateId =
  | "cow_cat_dark"
  | "white_cat"
  | "cow_cat_grey"
  | "solid_blue"
  | "cream_cat"
  | "blue_golden_shaded"
  | "ragdoll_bicolor"
  | "siamese_point";

export type FixedOutputTemplate = {
  id: FixedOutputTemplateId;
  label: string;
  src: string;
  description: string;
};

export const FIXED_OUTPUT_TEMPLATE_IDS = [
  "cow_cat_dark",
  "white_cat",
  "cow_cat_grey",
  "solid_blue",
  "cream_cat",
  "blue_golden_shaded",
  "ragdoll_bicolor",
  "siamese_point",
] as const satisfies readonly FixedOutputTemplateId[];

export const FIXED_OUTPUT_TEMPLATES: Record<
  FixedOutputTemplateId,
  FixedOutputTemplate
> = {
  cow_cat_dark: {
    id: "cow_cat_dark",
    label: "奶牛猫",
    src: "/fixed-templates/cow-cat-dark.jpg",
    description:
      "深色大块花纹，脸中心、胸腹、脚部留白。只适合高对比奶牛花，不适合柔和渐层或重点色。",
  },
  white_cat: {
    id: "white_cat",
    label: "白猫",
    src: "/fixed-templates/white-cat.jpg",
    description:
      "全身白色或几乎全白，只保留粉色耳内和脚底。轻微光影和奶油反光不算花纹。",
  },
  cow_cat_grey: {
    id: "cow_cat_grey",
    label: "灰奶牛猫",
    src: "/fixed-templates/cow-cat-grey.jpg",
    description:
      "灰色大块加白色区域，花块边界明显。适合灰白奶牛花，不适合蓝金渐层的柔和压色。",
  },
  solid_blue: {
    id: "solid_blue",
    label: "蓝猫",
    src: "/fixed-templates/solid-blue.jpg",
    description:
      "整体统一蓝灰色或冷灰色，允许边缘和尾巴略深，但没有白斑、奶油底或重点色面罩。",
  },
  cream_cat: {
    id: "cream_cat",
    label: "乳白猫",
    src: "/fixed-templates/cream-cat.jpg",
    description:
      "整体乳白、象牙白或浅奶油色，允许很淡的米灰阴影。明显脸侧色块或白色中线更接近布偶双色。",
  },
  blue_golden_shaded: {
    id: "blue_golden_shaded",
    label: "蓝金渐层",
    src: "/fixed-templates/blue-golden-shaded.jpg",
    description:
      "奶油金或暖金底色，头顶、背部、脸侧、尾巴有蓝灰或灰褐色柔和压色。尾巴或耳边偏深不等于暹罗。",
  },
  ragdoll_bicolor: {
    id: "ragdoll_bicolor",
    label: "布偶猫",
    src: "/fixed-templates/ragdoll-bicolor.jpg",
    description:
      "白色中线、白口鼻、白胸腹明显，两侧脸、耳朵或尾巴有米灰、浅棕、暖棕色块。不是完整深色面罩。",
  },
  siamese_point: {
    id: "siamese_point",
    label: "暹罗猫",
    src: "/fixed-templates/siamese-point.jpg",
    description:
      "真正重点色：浅身体，同时脸部完整深面罩、双耳、脚掌、尾巴都明显变深。只有脸侧阴影或蓝眼睛不算。",
  },
};

export function isFixedOutputTemplateId(
  value: unknown,
): value is FixedOutputTemplateId {
  return (
    typeof value === "string" &&
    FIXED_OUTPUT_TEMPLATE_IDS.includes(value as FixedOutputTemplateId)
  );
}
