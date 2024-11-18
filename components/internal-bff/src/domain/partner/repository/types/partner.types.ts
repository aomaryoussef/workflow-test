export interface GetPartnerByIdResponse {
  data: {
    partner: PartnerDto[];
  };
}

export type PartnerDto = {
  id: string;
  name: string;
  categories: string[];
  partner_branches: PartnerBranchDto[];
};

export type PartnerBranchDto = {
  id: string;
  name: string;
  city?: string;
  street?: string;
  governorate?: string;
  location_latitude?: string;
  location_longitude?: string;
  google_maps_link?: string;
};
