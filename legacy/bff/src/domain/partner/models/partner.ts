export const enCategory: { [key: string]: string } = {
  ALL: "All",
  ELECTRONICS: "Home Appliances",
  FASHION: "Fashion",
  HOME_WARE: "Home ware",
  FURNITURE: "Furniture",
  FINISHING: "Finishing",
  CERAMICS_AND_SANITARY_WARE: "Ceramics & sanitary ware",
  AUTO_SPARE_PARTS: "Auto spare parts",
  BABY_AND_TOYS: "Baby & toys",
  JEWELRY: "Jewelry",
  SUPERMARKETS: "Supermarkets",
  EVENT_PLANNING: "Event planning",
  EDUCATION: "Education",
  MOTORCYCLES: "Motorcycles",
  TOURISM_AND_ENTERTAINMENT: "Tourism & Entertainment",
  MEDICAL: "Medical",
  ACCESSORIES: "Accessories",
  WEDDING_HALLS: "Wedding Halls",
  OPTICS: "Optics",
  SPORTS: "Sports",
  MOBILE: "Mobile & Electronics",
  SHOPPING_HUBS: "Shopping Hubs"
};

export const arCategory: { [key: string]: string } = {
  ALL: "الكل",
  ELECTRONICS: "أجهزة منزلية",
  HOME_WARE: "أدوات منزلية",
  FASHION: "أزياء وملابس",
  FURNITURE: "أثاث وديكور",
  FINISHING: "تشطيبات",
  CERAMICS_AND_SANITARY_WARE: "سيراميك وأدوات صحية",
  AUTO_SPARE_PARTS: "قطع غيار سيارات",
  BABY_AND_TOYS: "أطفال وألعاب",
  JEWELRY: "مجوهرات",
  SUPERMARKETS: "بقالة وسوبر ماركت",
  EVENT_PLANNING: "أفراح ومناسبات",
  EDUCATION: "تعليم",
  MOTORCYCLES: "موتوسيكلات",
  TOURISM_AND_ENTERTAINMENT: "سياحة و ترفيه",
  MEDICAL: "خدمات طبية",
  ACCESSORIES: "إكسسوارات",
  WEDDING_HALLS: "قاعات أفراح",
  OPTICS: "بصريات",
  SPORTS: "رياضة",
  MOBILE: "موبايلات والكترونيات",
  SHOPPING_HUBS: "مراكز تسوق"
};

export const categoriesIcons: { [key: string]: string } = {
  ALL: "",
  ELECTRONICS: "electronics.svg",
  FASHION: "fashion.svg",
  FURNITURE: "furniture.svg",
  FINISHING: "finishing.svg",
  HOME_WARE: "homeware.svg",
  CERAMICS_AND_SANITARY_WARE: "ceramics.svg",
  AUTO_SPARE_PARTS: "automotive.svg",
  BABY_AND_TOYS: "kids.svg",
  JEWELRY: "jewelry.svg",
  SUPERMARKETS: "grocery.svg",
  EVENT_PLANNING: "events.svg",
  EDUCATION: "school.svg",
  MOTORCYCLES: "motorcycle.svg",
  TOURISM_AND_ENTERTAINMENT: "tourism.svg",
  MEDICAL: "medical.svg",
  ACCESSORIES: "accessories.svg",
  WEDDING_HALLS: "weddinghalls.svg",
  OPTICS: "optics.svg",
  SPORTS: "sports.svg",
  MOBILE: "mobile.svg",
  SHOPPING_HUBS: "hubs.svg"
};

export type category = {
  name: string;
  slug?:string;
  icon: string;
};
