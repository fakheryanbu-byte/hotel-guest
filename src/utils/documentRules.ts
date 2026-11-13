import { ar } from '../i18n/ar';
import { en } from '../i18n/en';
import { sanitizeWhatsAppNumber } from '../config/hotels';
import type {
  CalendarType,
  DocumentType,
  ExtractedDocumentData,
  FamilyMember,
  GuestFormData,
  HotelBranch,
  SexType,
  ValidationResult,
} from '../types/guest';

export interface FieldVisibility {
  showVersionNumber: boolean;
  requireVersionNumber: boolean;
  showBorderNumber: boolean;
  requireBorderNumber: boolean;
  showExpiryDate: boolean;
  showFamilyMembers: boolean;
}

export const DEFAULT_SAUDI_NATIONALITY = 'سعودي';
export const DEFAULT_SAUDI_DIAL_CODE = '+966';

export function isSaudiOnlyDocumentType(docType: DocumentType): boolean {
  return docType === 'national_id' || docType === 'family_register';
}

export function toAsciiDigits(value: string): string {
  return value
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
}

export function normalizeMobileInput(raw: string): string {
  const ascii = toAsciiDigits(raw).trim();
  if (!ascii) return '';
  const compact = ascii.replace(/[\s\-()]/g, '');

  if (compact.startsWith('00966')) {
    const rest = compact.slice(5).replace(/^0+/, '');
    return `+966${rest}`;
  }
  if (compact.startsWith('+9660') && compact.length >= 13) {
    return `+966${compact.slice(5)}`;
  }
  if (/^9660?5\d{8}$/.test(compact)) {
    const rest = compact.slice(3).replace(/^0+/, '');
    return `+966${rest}`;
  }
  if (/^05\d{8}$/.test(compact)) {
    return `+966${compact.slice(1)}`;
  }
  if (/^5\d{8}$/.test(compact)) {
    return `+966${compact}`;
  }
  return ascii;
}

export function normalizeDateInput(raw: string): {
  formatted: string;
  inferredCalendar: CalendarType | null;
} {
  const ascii = toAsciiDigits(raw).trim();
  if (!ascii) {
    return { formatted: '', inferredCalendar: null };
  }

  let formatted = ascii;
  const digitsOnly = ascii.replace(/[^\d]/g, '');

  // Format pure 8-digit inputs like 14130216 or 19920815 or 15081992
  if (/^\d{8}$/.test(ascii)) {
    const first4 = Number(digitsOnly.slice(0, 4));
    const last4 = Number(digitsOnly.slice(4, 8));
    if (first4 >= 1300 && first4 <= 1550) {
      formatted = `${digitsOnly.slice(0, 4)}/${digitsOnly.slice(4, 6)}/${digitsOnly.slice(6, 8)}`;
    } else if (first4 >= 1900 && first4 <= 2100) {
      formatted = `${digitsOnly.slice(0, 4)}-${digitsOnly.slice(4, 6)}-${digitsOnly.slice(6, 8)}`;
    } else if (last4 >= 1300 && last4 <= 1550) {
      formatted = `${digitsOnly.slice(4, 8)}/${digitsOnly.slice(2, 4)}/${digitsOnly.slice(0, 2)}`;
    } else if (last4 >= 1900 && last4 <= 2100) {
      formatted = `${digitsOnly.slice(4, 8)}-${digitsOnly.slice(2, 4)}-${digitsOnly.slice(0, 2)}`;
    }
  }

  // Infer calendar from 4-digit year anywhere in formatted string
  const parts = formatted.split(/[/-]/).map((p) => Number(p));
  let inferredCalendar: CalendarType | null = null;
  for (const part of parts) {
    if (part >= 1300 && part <= 1550) {
      inferredCalendar = 'hijri';
      break;
    }
    if (part >= 1900 && part <= 2100) {
      inferredCalendar = 'gregorian';
      break;
    }
  }

  return { formatted, inferredCalendar };
}

export function createEmptyGuestForm(): GuestFormData {
  return {
    fullName: '',
    nameParts: {
      firstName: null,
      fatherName: null,
      grandfatherName: null,
      familyName: null,
    },
    documentType: 'unknown',
    documentNumber: '',
    nationality: '',
    sex: '',
    dateOfBirth: '',
    birthCalendar: 'unknown',
    expiryDate: '',
    expiryCalendar: 'unknown',
    versionNumber: '',
    borderNumber: '',
    borderNumberUnknown: false,
    mobileNumber: DEFAULT_SAUDI_DIAL_CODE,
    familyMembers: [],
    primaryMemberId: null,
    accompanyingMemberIds: [],
    purposeOfVisit: '',
    otherPurposeDetail: '',
    bookingSource: '',
    bookingReference: '',
  };
}

export function getFieldVisibility(docType: DocumentType): FieldVisibility {
  switch (docType) {
    case 'national_id':
    case 'iqama':
      return {
        showVersionNumber: true,
        requireVersionNumber: true,
        showBorderNumber: false,
        requireBorderNumber: false,
        showExpiryDate: true,
        showFamilyMembers: false,
      };
    case 'passport':
      return {
        showVersionNumber: false,
        requireVersionNumber: false,
        showBorderNumber: true,
        requireBorderNumber: true,
        showExpiryDate: true,
        showFamilyMembers: false,
      };
    case 'family_register':
      return {
        showVersionNumber: false,
        requireVersionNumber: false,
        showBorderNumber: false,
        requireBorderNumber: false,
        showExpiryDate: false,
        showFamilyMembers: true,
      };
    case 'unknown':
    default:
      return {
        showVersionNumber: false,
        requireVersionNumber: false,
        showBorderNumber: false,
        requireBorderNumber: false,
        showExpiryDate: true,
        showFamilyMembers: false,
      };
  }
}

/**
 * Updates documentType and clears any fields that do not apply to the new type.
 */
export function switchDocumentType(
  current: GuestFormData,
  nextType: DocumentType
): GuestFormData {
  const vis = getFieldVisibility(nextType);

  let nextNationality = current.nationality;
  if (isSaudiOnlyDocumentType(nextType) && !nextNationality.trim()) {
    nextNationality = DEFAULT_SAUDI_NATIONALITY;
  } else if (nextType === 'iqama' && nextNationality.trim() === DEFAULT_SAUDI_NATIONALITY) {
    nextNationality = '';
  }

  const nextMobile = current.mobileNumber.trim()
    ? current.mobileNumber
    : DEFAULT_SAUDI_DIAL_CODE;

  return {
    ...current,
    documentType: nextType,
    nationality: nextNationality,
    mobileNumber: nextMobile,
    versionNumber: vis.showVersionNumber ? current.versionNumber : '',
    borderNumber: vis.showBorderNumber ? current.borderNumber : '',
    borderNumberUnknown: vis.showBorderNumber ? current.borderNumberUnknown : false,
    expiryDate: vis.showExpiryDate ? current.expiryDate : '',
    expiryCalendar: vis.showExpiryDate ? current.expiryCalendar : 'unknown',
    primaryMemberId: vis.showFamilyMembers ? current.primaryMemberId : null,
    accompanyingMemberIds: vis.showFamilyMembers ? current.accompanyingMemberIds : [],
  };
}

/**
 * Maps validated Gemini extraction onto editable GuestFormData,
 * preserving manual selections (visit purpose, booking source, mobile) if already entered.
 */
export function applyExtractedDataToForm(
  current: GuestFormData,
  extracted: ExtractedDocumentData | null | undefined,
  mergeMissingOnly = false
): GuestFormData {
  if (!extracted || typeof extracted !== 'object') {
    return current;
  }
  const incomingType = extracted.documentType ?? 'unknown';
  const nextType =
    mergeMissingOnly && current.documentType !== 'unknown' && incomingType === 'unknown'
      ? current.documentType
      : incomingType !== 'unknown'
        ? incomingType
        : current.documentType;

  const vis = getFieldVisibility(nextType);

  const familyMembers: FamilyMember[] = (extracted.familyMembers ?? []).map((m, idx) => {
    const normalizedDob = normalizeDateInput(m.dateOfBirth ?? '');
    const rawCal = (m.birthCalendar ?? 'unknown') as CalendarType;
    return {
      id: `member_${idx + 1}`,
      fullName: m.fullName ?? '',
      nameParts: m.nameParts,
      documentNumber: m.documentNumber ?? '',
      sex: (m.sex === 'male' || m.sex === 'female' ? m.sex : '') as SexType,
      dateOfBirth: normalizedDob.formatted || (m.dateOfBirth ?? ''),
      birthCalendar:
        rawCal !== 'unknown'
          ? rawCal
          : (normalizedDob.inferredCalendar ?? 'unknown'),
      relationship: m.relationship ?? '',
    };
  });

  const pickStr = (incoming: string | null | undefined, existing: string) => {
    const clean = incoming ?? '';
    return mergeMissingOnly ? (existing || clean) : clean;
  };

  let resolvedNationality = pickStr(extracted.nationality, current.nationality);
  if (isSaudiOnlyDocumentType(nextType) && !resolvedNationality.trim()) {
    resolvedNationality = DEFAULT_SAUDI_NATIONALITY;
  }

  const incomingCal = (extracted.birthCalendar ?? 'unknown') as CalendarType;
  const incomingExpCal = (extracted.expiryCalendar ?? 'unknown') as CalendarType;
  const incomingSex = (extracted.sex === 'male' || extracted.sex === 'female'
    ? extracted.sex
    : '') as SexType;

  const updated: GuestFormData = {
    ...current,
    documentType: nextType,
    fullName: pickStr(extracted.fullName, current.fullName),
    nameParts: mergeMissingOnly
      ? {
          firstName: current.nameParts.firstName ?? extracted.nameParts?.firstName ?? null,
          fatherName: current.nameParts.fatherName ?? extracted.nameParts?.fatherName ?? null,
          grandfatherName:
            current.nameParts.grandfatherName ?? extracted.nameParts?.grandfatherName ?? null,
          familyName: current.nameParts.familyName ?? extracted.nameParts?.familyName ?? null,
        }
      : extracted.nameParts ?? {
          firstName: null,
          fatherName: null,
          grandfatherName: null,
          familyName: null,
        },
    documentNumber: pickStr(extracted.documentNumber, current.documentNumber),
    nationality: resolvedNationality,
    sex: mergeMissingOnly ? current.sex || incomingSex : incomingSex,
    dateOfBirth: pickStr(extracted.dateOfBirth, current.dateOfBirth),
    birthCalendar:
      mergeMissingOnly && current.birthCalendar !== 'unknown' ? current.birthCalendar : incomingCal,
    expiryDate: vis.showExpiryDate ? pickStr(extracted.expiryDate, current.expiryDate) : '',
    expiryCalendar: vis.showExpiryDate
      ? mergeMissingOnly && current.expiryCalendar !== 'unknown'
        ? current.expiryCalendar
        : incomingExpCal
      : 'unknown',
    versionNumber: vis.showVersionNumber ? pickStr(extracted.versionNumber, current.versionNumber) : '',
    borderNumber: mergeMissingOnly && vis.showBorderNumber ? current.borderNumber : '',
    borderNumberUnknown: mergeMissingOnly && vis.showBorderNumber ? current.borderNumberUnknown : false,
    mobileNumber: current.mobileNumber.trim() ? current.mobileNumber : DEFAULT_SAUDI_DIAL_CODE,
    familyMembers:
      mergeMissingOnly && current.familyMembers.length > 0 && familyMembers.length === 0
        ? current.familyMembers
        : familyMembers,
    primaryMemberId:
      nextType === 'family_register'
        ? mergeMissingOnly && current.primaryMemberId
          ? current.primaryMemberId
          : familyMembers.length > 0
            ? familyMembers[0].id
            : null
        : null,
    accompanyingMemberIds: mergeMissingOnly ? current.accompanyingMemberIds : [],
  };

  // Fill any missing primary guest fields from the primary family member when available
  if (nextType === 'family_register' && updated.familyMembers.length > 0) {
    const primary =
      updated.familyMembers.find((m) => m.id === updated.primaryMemberId) ??
      updated.familyMembers[0];
    if (!updated.fullName && primary.fullName) updated.fullName = primary.fullName;
    if (!updated.dateOfBirth && primary.dateOfBirth) updated.dateOfBirth = primary.dateOfBirth;
    if (updated.birthCalendar === 'unknown' && primary.birthCalendar !== 'unknown') {
      updated.birthCalendar = primary.birthCalendar;
    }
    if (!updated.sex && primary.sex) updated.sex = primary.sex;
    if (!updated.documentNumber && primary.documentNumber) {
      updated.documentNumber = primary.documentNumber;
    }
  }

  return updated;
}

/**
 * Selects a primary guest from extracted family members without copying
 * the main record holder's document number onto other members.
 */
export function selectPrimaryFamilyMember(
  current: GuestFormData,
  memberId: string
): GuestFormData {
  const member = current.familyMembers.find((m) => m.id === memberId);
  if (!member) return current;

  return {
    ...current,
    primaryMemberId: memberId,
    accompanyingMemberIds: current.accompanyingMemberIds.filter((id) => id !== memberId),
    fullName: member.fullName || current.fullName,
    nameParts: member.nameParts ?? current.nameParts,
    documentNumber: member.documentNumber || '',
    sex: member.sex || current.sex,
    dateOfBirth: member.dateOfBirth || current.dateOfBirth,
    birthCalendar:
      member.birthCalendar && member.birthCalendar !== 'unknown'
        ? member.birthCalendar
        : current.birthCalendar,
  };
}

export function isValidMobileNumber(raw: string): boolean {
  const normalized = normalizeMobileInput(raw);
  const digits = normalized.replace(/[^\d]/g, '');
  if (digits.startsWith('966')) {
    // Saudi numbers require country code 966 + 9 subscriber digits (12 digits total; allow 11-13)
    return digits.length >= 11 && digits.length <= 13;
  }
  // International numbers require country code + subscriber digits (8-15 digits)
  return digits.length >= 8 && digits.length <= 15;
}

export function validateGuestRequest(
  form: GuestFormData,
  selectedHotel: HotelBranch | null,
  declarationAccepted: boolean
): ValidationResult {
  const missing: ValidationResult['missingRequiredFields'] = [];
  const missingNotesAr: string[] = [];
  const missingNotesEn: string[] = [];

  if (!selectedHotel || !sanitizeWhatsAppNumber(selectedHotel.whatsappNumber)) {
    missing.push('hotel');
  }

  if (!form.fullName.trim()) {
    missing.push('fullName');
  }
  if (!form.documentType || form.documentType === 'unknown') {
    missing.push('documentType');
  }
  if (!form.documentNumber.trim()) {
    missing.push('documentNumber');
  }
  if (!form.nationality.trim()) {
    missing.push('nationality');
  }
  if (!form.dateOfBirth.trim()) {
    missing.push('dateOfBirth');
  }
  if (!form.birthCalendar || form.birthCalendar === 'unknown') {
    missing.push('birthCalendar');
  }
  if (!isValidMobileNumber(form.mobileNumber)) {
    missing.push('mobileNumber');
  }

  const vis = getFieldVisibility(form.documentType);

  if (vis.requireVersionNumber && !form.versionNumber.trim()) {
    missing.push('versionNumber');
  }

  let isDataComplete = true;
  if (vis.requireBorderNumber) {
    if (!form.borderNumber.trim() && !form.borderNumberUnknown) {
      missing.push('borderNumber');
    } else if (!form.borderNumber.trim() && form.borderNumberUnknown) {
      isDataComplete = false;
      missingNotesAr.push('ناقص بيانات: رقم الحدود غير متوفر (طلب مساعدة الاستقبال)');
      missingNotesEn.push('Missing data: Border number unavailable (reception assistance requested)');
    }
  }

  if (!form.purposeOfVisit) {
    missing.push('purposeOfVisit');
  } else if (form.purposeOfVisit === 'other' && !form.otherPurposeDetail.trim()) {
    missing.push('otherPurposeDetail');
  }

  if (!form.bookingSource) {
    missing.push('bookingSource');
  }

  if (!declarationAccepted) {
    missing.push('declaration');
  }

  if (form.documentType === 'family_register') {
    const selectedAccompanying = form.familyMembers.filter(
      (m) => m.id !== form.primaryMemberId && form.accompanyingMemberIds.includes(m.id)
    );
    if (selectedAccompanying.some((m) => !m.fullName.trim())) {
      missing.push('accompanyingMemberNames');
    }
    if (selectedAccompanying.some((m) => !m.dateOfBirth.trim())) {
      missing.push('accompanyingMemberBirthDates');
    }

    missingNotesAr.push('سجل الأسرة: قد يطلب الاستقبال وثيقة إضافية لاستكمال التسجيل');
    missingNotesEn.push('Family Register: reception may request an additional document to complete registration');
  }

  return {
    canOpenWhatsApp: missing.length === 0,
    isDataComplete,
    missingRequiredFields: missing,
    missingNotesAr,
    missingNotesEn,
  };
}

function formatCalendarLabel(cal: CalendarType): string {
  if (cal === 'hijri') return `${ar.calendarHijri} / ${en.calendarHijri}`;
  if (cal === 'gregorian') return `${ar.calendarGregorian} / ${en.calendarGregorian}`;
  return `${ar.calendarUnknown} / ${en.calendarUnknown}`;
}

function formatSexLabel(sex: SexType): string {
  if (sex === 'male') return `${ar.sexMale} / ${en.sexMale}`;
  if (sex === 'female') return `${ar.sexFemale} / ${en.sexFemale}`;
  return '';
}

export function buildWhatsAppMessage(
  form: GuestFormData,
  hotel: HotelBranch,
  extraNotes: string[] = []
): string {
  const vis = getFieldVisibility(form.documentType);
  const docTypeLabel = `${ar.docTypes[form.documentType]} / ${en.docTypes[form.documentType]}`;

  const purposeLabel = form.purposeOfVisit
    ? form.purposeOfVisit === 'other'
      ? `${ar.purposes.other} / ${en.purposes.other}: ${form.otherPurposeDetail.trim()}`
      : `${ar.purposes[form.purposeOfVisit]} / ${en.purposes[form.purposeOfVisit]}`
    : '';

  const bookingSourceLabel = form.bookingSource
    ? `${ar.bookingSources[form.bookingSource]} / ${en.bookingSources[form.bookingSource]}`
    : '';

  const lines: string[] = [
    'طلب تجهيز بيانات نزيل / Guest registration request',
    '',
    `الفندق / Hotel: ${hotel.nameAr} / ${hotel.nameEn}`,
    `الاسم / Name: ${form.fullName.trim()}`,
    `نوع الوثيقة / Document type: ${docTypeLabel}`,
    `رقم الوثيقة / Document number: ${form.documentNumber.trim()}`,
    `الجنسية / Nationality: ${form.nationality.trim()}`,
  ];

  const sexText = formatSexLabel(form.sex);
  if (sexText) {
    lines.push(`الجنس / Sex: ${sexText}`);
  }

  lines.push(
    `تاريخ الميلاد والتقويم / Date of birth and calendar: ${form.dateOfBirth.trim()} (${formatCalendarLabel(form.birthCalendar)})`
  );

  if (vis.showExpiryDate && form.expiryDate.trim()) {
    const expCal =
      form.expiryCalendar && form.expiryCalendar !== 'unknown'
        ? ` (${formatCalendarLabel(form.expiryCalendar)})`
        : '';
    lines.push(`تاريخ الانتهاء / Expiry date: ${form.expiryDate.trim()}${expCal}`);
  }

  if (vis.showVersionNumber && form.versionNumber.trim()) {
    lines.push(`رقم النسخة / Version number: ${form.versionNumber.trim()}`);
  }

  if (vis.showBorderNumber) {
    if (form.borderNumber.trim()) {
      lines.push(`رقم الحدود / Border number: ${form.borderNumber.trim()}`);
    } else if (form.borderNumberUnknown) {
      lines.push(
        'رقم الحدود / Border number: غير متوفر — ناقص بيانات (طلب مساعدة الاستقبال) / Unavailable — Missing data (reception assistance requested)'
      );
    }
  }

  lines.push(`الجوال / Mobile: ${form.mobileNumber.trim()}`);
  lines.push(`سبب الزيارة / Purpose of visit: ${purposeLabel}`);
  lines.push(`مصدر الحجز / Booking source: ${bookingSourceLabel}`);

  if (form.bookingSource === 'booking_com' && form.bookingReference.trim()) {
    lines.push(`مرجع الحجز / Booking reference: ${form.bookingReference.trim()}`);
  }

  if (form.documentType === 'family_register') {
    const accompanying = form.familyMembers.filter(
      (m) =>
        m.id !== form.primaryMemberId &&
        form.accompanyingMemberIds.includes(m.id) &&
        m.fullName.trim()
    );
    if (accompanying.length > 0) {
      const formattedCompanions = accompanying
        .map((m) => {
          const parts = [m.fullName.trim()];
          if (m.relationship.trim()) parts.push(m.relationship.trim());
          if (m.documentNumber.trim()) parts.push(`ID: ${m.documentNumber.trim()}`);
          if (m.dateOfBirth.trim()) {
            const cal =
              m.birthCalendar && m.birthCalendar !== 'unknown'
                ? ` (${formatCalendarLabel(m.birthCalendar)})`
                : '';
            parts.push(`DOB: ${m.dateOfBirth.trim()}${cal}`);
          }
          return parts.join(' - ');
        })
        .join(' | ');
      lines.push(`المرافقون / Accompanying guests: ${formattedCompanions}`);
    }
  }

  const notes: string[] = [...extraNotes];
  if (vis.showBorderNumber && !form.borderNumber.trim() && form.borderNumberUnknown) {
    notes.push('حالة الطلب: ناقص بيانات (رقم الحدود غير متوفر) / Status: Missing data (border number unavailable)');
  }
  if (form.documentType === 'family_register') {
    notes.push('سجل الأسرة: قد يطلب الاستقبال وثيقة إضافية / Family register: reception may request additional ID');
  }

  if (notes.length > 0) {
    lines.push(`النواقص أو الملاحظات / Missing information or notes: ${notes.join(' ؛ ')}`);
  }

  return lines.join('\n');
}

export function buildWhatsAppUrl(whatsappNumber: string, message: string): string {
  const digits = sanitizeWhatsAppNumber(whatsappNumber);
  if (!digits) return '';
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
