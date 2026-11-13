export type Language = 'ar' | 'en';

export type HotelBranchId =
  | 'fakhr_yanbu_1'
  | 'fakhr_yanbu_3'
  | 'fakhr_yanbu_5'
  | 'tim_hotel';

export interface HotelBranch {
  id: HotelBranchId;
  nameAr: string;
  nameEn: string;
  whatsappNumber: string; // Empty string when unconfigured
}

export type DocumentType =
  | 'national_id'
  | 'iqama'
  | 'passport'
  | 'family_register'
  | 'unknown';

export type CalendarType = 'hijri' | 'gregorian' | 'unknown';

export type SexType = 'male' | 'female' | '';

export type VisitPurposeId =
  | 'tourism'
  | 'business'
  | 'family_friends'
  | 'medical'
  | 'hajj_umrah'
  | 'other';

export type BookingSourceId = 'booking_com' | 'reception';

export interface NameParts {
  firstName: string | null;
  fatherName: string | null;
  grandfatherName: string | null;
  familyName: string | null;
}

export interface FamilyMember {
  id: string;
  fullName: string;
  nameParts?: NameParts;
  documentNumber: string;
  sex: SexType;
  dateOfBirth: string;
  birthCalendar: CalendarType;
  relationship: string;
}

export interface ExtractedDocumentData {
  documentType: DocumentType;
  fullName: string | null;
  nameParts: NameParts;
  documentNumber: string | null;
  nationality: string | null;
  sex: SexType | null;
  dateOfBirth: string | null;
  birthCalendar: CalendarType | null;
  expiryDate: string | null;
  expiryCalendar: CalendarType | null;
  versionNumber: string | null;
  familyMembers: Omit<FamilyMember, 'id'>[];
  unreadableFields: string[];
  warnings: string[];
}

export interface GuestFormData {
  fullName: string;
  nameParts: NameParts;
  documentType: DocumentType;
  documentNumber: string;
  nationality: string;
  sex: SexType;
  dateOfBirth: string;
  birthCalendar: CalendarType;
  expiryDate: string;
  expiryCalendar: CalendarType;
  versionNumber: string;
  borderNumber: string;
  borderNumberUnknown: boolean;
  mobileNumber: string;
  // Family register selections
  familyMembers: FamilyMember[];
  primaryMemberId: string | null;
  accompanyingMemberIds: string[];
  // Visit & Booking (always chosen manually by guest)
  purposeOfVisit: VisitPurposeId | '';
  otherPurposeDetail: string;
  bookingSource: BookingSourceId | '';
  bookingReference: string;
}

export interface DocumentImageSlot {
  id: 'front' | 'back';
  file: File;
  previewUrl: string;
  base64: string;
  mimeType: string;
}

export type ValidationFieldKey =
  | keyof GuestFormData
  | 'hotel'
  | 'declaration'
  | 'accompanyingMemberBirthDates'
  | 'accompanyingMemberNames';

export interface ValidationIssue {
  field: ValidationFieldKey;
  messageKey: string;
}

export interface ValidationResult {
  canOpenWhatsApp: boolean;
  isDataComplete: boolean;
  missingRequiredFields: ValidationFieldKey[];
  missingNotesAr: string[];
  missingNotesEn: string[];
}
