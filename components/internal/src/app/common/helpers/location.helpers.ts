import { latLngInGoogleMapsLinkRegex } from '@common/helpers/regex.helpers';

export function getLatLongFromUrl(url: string): { latitude: string; longitude: string } | null {
  const match = url.match(latLngInGoogleMapsLinkRegex);

  if (match) {
    const latitude = match[1];
    const longitude = match[2];
    return { latitude, longitude };
  }

  return null;
}
