export type FixedTemplateId =
  | "white_cat"
  | "siamese_point"
  | "ragdoll_bicolor"
  | "cow_cat"
  | "blue_golden_shaded"
  | "solid_blue";

export const FIXED_TEMPLATE_LABELS: Record<FixedTemplateId, string> = {
  white_cat: "白猫",
  siamese_point: "暹罗猫",
  ragdoll_bicolor: "布偶猫",
  cow_cat: "奶牛猫",
  blue_golden_shaded: "蓝金渐层",
  solid_blue: "蓝猫",
};

export const BREED_TO_FIXED_TEMPLATE_HINTS: Record<string, FixedTemplateId[]> = {
  siamese: ["siamese_point"],
  seal_point: ["siamese_point"],
  blue_point: ["siamese_point"],
  ragdoll: ["ragdoll_bicolor"],
  bicolor_ragdoll: ["ragdoll_bicolor"],
  cow_cat: ["cow_cat"],
  tuxedo: ["cow_cat"],
  white_cat: ["white_cat"],
  british_shorthair_blue: ["solid_blue"],
  russian_blue: ["solid_blue"],
  blue_cat: ["solid_blue"],
  blue_golden_shaded: ["blue_golden_shaded"],
  golden_shaded: ["blue_golden_shaded"],
};
