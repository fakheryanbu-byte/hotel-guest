import type { HotelBranch, HotelBranchId } from '../types/guest';

/**
 * Mandatory hotel branches list.
 * WhatsApp numbers are intentionally empty by default ("لا تخترع أرقاماً")
 * and injected from server configuration (.env / environment variables).
 */
export const DEFAULT_HOTELS: HotelBranch[] = [
  {
    id: 'fakhr_yanbu_1',
    nameAr: 'فخر ينبع 1',
    nameEn: 'Fakhr Yanbu 1',
    whatsappNumber: '',
  },
  {
    id: 'fakhr_yanbu_3',
    nameAr: 'فخر ينبع 3',
    nameEn: 'Fakhr Yanbu 3',
    whatsappNumber: '',
  },
  {
    id: 'fakhr_yanbu_5',
    nameAr: 'فخر ينبع 5',
    nameEn: 'Fakhr Yanbu 5',
    whatsappNumber: '',
  },
  {
    id: 'tim_hotel',
    nameAr: 'فندق تيم',
    nameEn: 'Tim Hotel',
    whatsappNumber: '',
  },
];

export function sanitizeWhatsAppNumber(raw: string | undefined | null): string {
  if (!raw) return '';
  return raw.replace(/[^\d]/g, '');
}

export function mergeHotelConfigs(
  configuredMap: Partial<Record<HotelBranchId, string>> | undefined
): HotelBranch[] {
  return DEFAULT_HOTELS.map((hotel) => ({
    ...hotel,
    whatsappNumber: sanitizeWhatsAppNumber(configuredMap?.[hotel.id] ?? hotel.whatsappNumber),
  }));
}
