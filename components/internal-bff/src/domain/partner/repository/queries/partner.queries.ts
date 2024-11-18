export const getPartnerByIdQuery = `
  query GetPartnerById($partnerId: uuid) {
    partner(where: { id: { _eq: $partnerId } }) {
      id
      categories
      name
      partner_branches {
        id
        city
        governorate
        location_latitude
        location_longitude
        name
        street
        google_maps_link
      }
    }
  }
`;
