import type { TranslationKeys } from './ar';

export const en: TranslationKeys = {
  appTitle: 'Guest Check-In Prep',
  appSubtitle: 'Prepare your hotel registration details and send them directly to hotel WhatsApp',
  langToggle: 'العربية',
  clearMyData: 'Clear my data',
  clearedSuccess: 'All data has been cleared from this session.',

  // Section 1: Hotel
  sectionHotelTitle: '1. Select Hotel',
  sectionHotelDesc: 'Choose your hotel branch so your details go to the right reception desk.',
  branchReady: 'Reception WhatsApp ready',
  branchNotConfigured: 'Not configured',
  branchNotConfiguredBanner:
    'Reception WhatsApp number is not configured for this branch yet. Sending is disabled until configured in system settings.',

  // Section 2: Document reading
  sectionDocTitle: '2. Read Document',
  sectionDocDesc: 'Automatically extract details from your National ID, Iqama, Passport, or Family Register — or fill in the form manually below.',
  docPlaceholderTitle: 'Instant text reading · Zero storage',
  docPlaceholderDesc:
    'Only visible text is read to pre-fill the form and immediately cleared from memory, without displaying or keeping any ID photo.',
  docLoadedHiddenTitle: 'Ready for text-only reading',
  docLoadedHiddenDesc: 'For your privacy, your ID image is not displayed on screen and no copy is kept.',
  frontSideLabel: 'Front side of document',
  backSideLabel: 'Back side or extra page (optional)',
  takePhoto: 'Read Document',
  chooseFromGallery: 'Choose file from device',
  retakePhoto: 'Read again',
  deletePhoto: 'Remove',
  addBackSide: 'Read back side / extra page',
  geminiPrivacyNotice:
    'Privacy notice: Only visible text is temporarily read to pre-fill the form. Your ID image is never displayed or saved permanently.',
  geminiConsentLabel: 'I agree to automatically read document details to fill the form without saving the image.',
  analyzeNowButton: 'Extract Details Now',
  readingDocument: 'Reading document...',
  readingComplete:
    'Visible details extracted and the file was immediately cleared from memory. Please review and complete any missing fields below.',
  readingFailedFallback:
    'Could not read the document clearly. Please try again in clearer lighting or fill in the fields manually below.',
  authenticityDisclaimer:
    'Note: Automated extraction only helps pre-fill the form and does not verify document authenticity.',
  warningsTitle: 'Reading notes',
  unreadableFieldsLabel: 'Unclear or missing fields:',

  // Section 3: Guest data form
  sectionDataTitle: '3. Review & Complete Details',
  sectionDataDesc: 'All fields are editable. Highlighted required fields must be completed before sending.',
  missingBadge: 'Missing',
  requiredMark: '*',
  statusIncompleteData: 'Missing data',

  fieldFullName: 'Full name',
  fieldFullNamePlaceholder: 'Full name as printed on document',
  fieldNamePartsTitle: 'Extracted name parts (optional)',
  fieldFirstName: 'First name',
  fieldFatherName: 'Father name',
  fieldGrandfatherName: 'Grandfather name',
  fieldFamilyName: 'Family name',
  fieldDocumentType: 'Document type',
  fieldDocumentNumber: 'Document number',
  fieldDocumentNumberPlaceholder: '10XXXXXXXX',
  fieldNationality: 'Nationality',
  fieldNationalityPlaceholder: 'e.g. Saudi Arabia',
  fieldSex: 'Sex',
  sexSelect: 'Select sex',
  sexMale: 'Male',
  sexFemale: 'Female',
  fieldDateOfBirth: 'Date of birth',
  fieldDatePlaceholder: '1992-08-15 / 1413/02/16',
  dateHelperText: 'Format: YYYY/MM/DD e.g. 1413/02/16 (Hijri) or 1992-08-15 (Gregorian).',
  fieldCalendar: 'Calendar',
  calendarSelect: 'Select calendar',
  calendarHijri: 'Hijri',
  calendarGregorian: 'Gregorian',
  calendarUnknown: 'Unspecified',
  fieldExpiryDate: 'Expiry date',
  fieldExpiryCalendar: 'Expiry calendar',
  fieldVersionNumber: 'Document version number',
  fieldVersionPlaceholder: '1 / 2',
  versionHelperText:
    'Version number is required for National ID and Iqama. If not visible, enter it manually or read the back side.',
  fieldBorderNumber: 'Border number',
  fieldBorderPlaceholder: '30XXXXXXXX',
  borderHelperText: 'Note: Border number is different from your passport number and visa number.',
  borderUnknownCheckbox:
    "I don't know my border number — request reception assistance (sent marked as Missing data)",
  fieldMobileNumber: 'Mobile number with country code',
  fieldMobilePlaceholder: '+9665XXXXXXXX',
  mobileHelperText: 'International code +966 is pre-filled and can be changed for other countries.',

  docTypes: {
    national_id: 'National ID',
    iqama: 'Iqama (Resident ID)',
    passport: 'Passport',
    family_register: 'Family Register',
    unknown: 'Unknown',
  },

  // Family register
  familySectionTitle: 'Family Register Members',
  familySectionNote:
    'Select the primary guest and only the actual accompanying guests staying at the hotel. Date of birth is required for every guest and accompanying guest, and reception may request an additional document.',
  familySelectPrimary: 'Set as primary guest',
  familyIsPrimary: 'Primary guest',
  familyAccompanying: 'Accompanying guest staying',
  familyAddMember: 'Add member manually',
  familyRemoveMember: 'Remove',
  familyMemberName: 'Member full name',
  familyMemberDocNum: 'Member ID number (if printed)',
  familyMemberRelation: 'Relationship',
  familyMemberDob: 'Date of birth (required if staying)',
  familyMemberDobRequired: 'Date of birth for selected accompanying guests',
  familyMemberNameRequired: 'Full name for selected accompanying guests',
  familyNoMembers: 'No family members extracted automatically; add accompanying guests manually if applicable.',

  // Section 4: Visit & booking
  sectionVisitTitle: '4. Purpose of Visit & Booking Source',
  sectionVisitDesc: 'Selected manually by the guest (never guessed from the document).',
  fieldPurposeOfVisit: 'Purpose of visit',
  purposeSettingsNote: 'These operational categories can be customized in app settings.',
  fieldOtherPurpose: 'Please specify purpose',
  fieldOtherPurposePlaceholder: 'Briefly describe purpose of visit',
  fieldBookingSource: 'Booking source',
  fieldBookingReference: 'Booking reference (optional)',
  fieldBookingReferencePlaceholder: '4189XXXXXX',

  purposes: {
    tourism: 'Tourism',
    business: 'Business',
    family_friends: 'Visiting family or friends',
    medical: 'Medical treatment',
    hajj_umrah: 'Hajj or Umrah',
    other: 'Other',
  },

  bookingSources: {
    booking_com: 'Booking.com',
    reception: 'Reception',
  },

  // Section 5: Declaration & WhatsApp Send
  sectionSendTitle: '5. Declaration & Send to Hotel WhatsApp',
  whatsappPrivacyNotice:
    'When you proceed, your details message will open in the hotel WhatsApp chat so you can review and tap Send.',
  declarationText:
    'I confirm the accuracy of the details above and agree to share them with the selected hotel via WhatsApp for check-in registration.',
  sendToWhatsAppButton: 'Send to hotel WhatsApp',
  photoAttachInstruction:
    'Your text details will open in WhatsApp for review and sending. No copy of your document image is kept in the app.',
  messageReadySuccess: 'Your message is ready. Complete sending in WhatsApp.',
  fallbackTitle: 'WhatsApp did not open automatically?',
  copyMessageButton: 'Copy message',
  copiedMessage: 'Message copied',
  receptionNumberLabel: 'Reception WhatsApp number:',
  validationMissingHeader: 'Please complete the following before opening WhatsApp:',
  incompleteBorderNotice:
    'Note: Your request will be sent marked as "Missing data" because the border number is unavailable; reception will assist you.',

  // Errors
  errInvalidFileType: 'Unsupported image format. Please choose JPG, PNG, WEBP, or HEIC.',
  errFileTooLarge: 'Image size exceeds the 10 MB limit.',
  errGeminiNotConfigured:
    'Document reading key (GEMINI_API_KEY) is not configured in server Settings > Secrets. Add it or fill in the details manually below.',
  errGeminiAuth:
    'Could not authenticate the Gemini API key in Settings > Secrets. Please check the key or fill in the details manually below.',
  errGeminiQuotaExceeded:
    'Gemini API quota has been exceeded for the current key. Please wait briefly, check billing/quota in Settings > Secrets, or fill in the details manually below.',
  errServerFailed: 'Could not reach the document reader right now. Please try again or fill in the details manually.',
  errRateLimited: 'Too many reading attempts. Please wait a moment or fill in the details manually.',
  errSelectHotelFirst: 'Please select a hotel branch first.',
};
