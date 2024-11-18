import { UUID } from "crypto";
import { getPartners, getTopPartners, disbursePaymentTransaction } from "../../../services/partners";
import { arCategory, enCategory, categoriesIcons, category } from "../models/partner";

const ICON_FOLDER_PATH = "/public/partner/category/";
type Branch = {
  id: UUID;
  partner_id: UUID;
  name: string;
  governorate: string;
  city: string;
  area: string;
  street: string;
  google_maps_link: string;
  location: { latitude: number; longitude: number };
};
export class PartnerUseCase {
  private static getPartnerAddresses(
    branches: Branch[],
  ): { name: string; street: string; city: string; google_maps_link: string; location: object }[] {
    const addresses = [];
    for (const branch of branches) {
      const { name, street, city, google_maps_link, location } = branch;
      addresses.push({ name, street, city, google_maps_link, location });
    }
    return addresses;
  }
  static async getPartnersByCategory(language: string) {
    let categories: { [key: string]: string };
    if (language === "ar") {
      categories = arCategory;
    } else {
      categories = enCategory;
    }

    let partners = await getPartners();
    partners = partners.filter((partner: any) => partner.status === "ACTIVE");
    const categoryPartnersMap: { [key: string]: Array<unknown> } = { ALL: [] };

    for (const partner of partners) {
      const localizedCategories = partner.categories.map((c: string) => categories[c]);
      const partnerObj = {
        id: partner.id,
        name: partner.name,
        addresses: PartnerUseCase.getPartnerAddresses(partner.branches),
        categories: localizedCategories,
      };

      categoryPartnersMap["ALL"].push(partnerObj);

      for (const category of partner.categories) {
        if (categoryPartnersMap[category]) {
          categoryPartnersMap[category].push(partnerObj);
        } else {
          categoryPartnersMap[category] = [partnerObj];
        }
      }
    }

    const data = [];

    for (const category in categoryPartnersMap) {
      data.push({
        name: categories[category],
        partners: categoryPartnersMap[category],
      });
    }
    return data;
  }

  static async getTopPartners(language: string) {
    let categories: { [key: string]: string };
    if (language === "ar") {
      categories = arCategory;
    } else {
      categories = enCategory;
    }
    const topPartners = await getTopPartners();
    const data = [];
    for (const topPartner of topPartners.data) {
      const localizedCategories = topPartner.partner.categories.map((c: string) => categories[c]);
      const partnerObj = {
        id: topPartner.partner.id,
        name: topPartner.partner.name,
        categories: localizedCategories,
        status: topPartner.partner.status,
      };
      data.push(partnerObj);
    }

    return data;
  }

  static async getCategories(language: string,governorateId: number = null) {
    let categories: { [key: string]: string };
    const categoryIcons: { [key: string]: string } = categoriesIcons;
    if (language === "ar") {
      categories = arCategory;
    } else {
      categories = enCategory;
    }

    let partners = await getPartners();
    if(governorateId){
      partners = partners.filter((partner: any) => partner.branches.some((branch: any) => branch.governorate_id === governorateId));
    }

    const categoriesKeys: string[] = [];
    partners.forEach((partner: any) => {
      partner.categories.forEach((category: string) => {
        if (categoriesKeys.indexOf(category) < 0) {
          categoriesKeys.push(category);
        }
      });
    });
    const result: category[] = [];
    categoriesKeys.forEach((key: string) => {
      result.push({
        name: categories[key],
        slug: key,
        icon: ICON_FOLDER_PATH + categoryIcons[key],
      });
    });
    return result;
  }

  static async disbursePayment(data: any) {
    const result = await disbursePaymentTransaction(data);
    return result;
  }
}
