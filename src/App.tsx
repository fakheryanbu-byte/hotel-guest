import { useEffect, useMemo, useRef, useState } from 'react';
import { DocumentCapture } from './components/DocumentCapture';
import { GuestDataForm } from './components/GuestDataForm';
import { HeaderBar } from './components/HeaderBar';
import { HotelSelector } from './components/HotelSelector';
import { VisitBookingSection } from './components/VisitBookingSection';
import { WhatsAppSubmitSection } from './components/WhatsAppSubmitSection';
import { DEFAULT_HOTELS, mergeHotelConfigs } from './config/hotels';
import { getTranslations } from './i18n';
import type {
  BookingSourceId,
  DocumentImageSlot,
  DocumentType,
  ExtractedDocumentData,
  FamilyMember,
  GuestFormData,
  HotelBranch,
  HotelBranchId,
  Language,
  LockedFormFields,
  VisitPurposeId,
} from './types/guest';
import {
  applyExtractedDataToForm,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  createEmptyGuestForm,
  createEmptyLockedFields,
  deriveLockedFieldsFromExtraction,
  isMemberUnder18,
  selectPrimaryFamilyMember,
  switchDocumentType,
  validateGuestRequest,
} from './utils/documentRules';
import {
  isSupportedImageFile,
  MAX_IMAGE_BYTES,
  prepareImageForUpload,
} from './utils/imageUtils';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const t = getTranslations(lang);

  const [hotels, setHotels] = useState<HotelBranch[]>(DEFAULT_HOTELS);
  const [selectedHotelId, setSelectedHotelId] = useState<HotelBranchId | null>(null);

  const [frontImage, setFrontImage] = useState<DocumentImageSlot | null>(null);
  const [backImage, setBackImage] = useState<DocumentImageSlot | null>(null);
  const [geminiConsent, setGeminiConsent] = useState(false);

  const [isReading, setIsReading] = useState(false);
  const [readSucceeded, setReadSucceeded] = useState(false);
  const [readError, setReadError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [unreadableFields, setUnreadableFields] = useState<string[]>([]);

  const [form, setForm] = useState<GuestFormData>(createEmptyGuestForm);
  const [lockedFields, setLockedFields] = useState<LockedFormFields>(createEmptyLockedFields);
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [preparedMessage, setPreparedMessage] = useState<string | null>(null);
  const [preparedUrl, setPreparedUrl] = useState<string | null>(null);
  const [clearedBanner, setClearedBanner] = useState(false);

  const frontUrlRef = useRef<string | null>(null);
  const backUrlRef = useRef<string | null>(null);

  // Sync HTML lang and dir on language switch without losing any session state
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Fetch configured branch WhatsApp numbers from server config (never hardcoded or fabricated)
  useEffect(() => {
    let active = true;
    fetch('/api/config')
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (active && payload?.hotels) {
          setHotels(mergeHotelConfigs(payload.hotels));
        }
      })
      .catch(() => {
        // Keep defaults if config fetch fails
      });
    return () => {
      active = false;
    };
  }, []);

  // Revoke preview ObjectURLs on unmount
  useEffect(() => {
    return () => {
      if (frontUrlRef.current) URL.revokeObjectURL(frontUrlRef.current);
      if (backUrlRef.current) URL.revokeObjectURL(backUrlRef.current);
    };
  }, []);

  const selectedHotel = useMemo(
    () => hotels.find((h) => h.id === selectedHotelId) ?? null,
    [hotels, selectedHotelId]
  );

  const validation = useMemo(
    () => validateGuestRequest(form, selectedHotel, declarationAccepted),
    [form, selectedHotel, declarationAccepted]
  );

  const missingFieldsSet = useMemo(() => {
    // Highlight missing required document fields right away once form has been populated or submitted
    if (readSucceeded || attemptedSubmit || form.documentType !== 'unknown') {
      return new Set<string>(validation.missingRequiredFields);
    }
    return new Set<string>();
  }, [readSucceeded, attemptedSubmit, form.documentType, validation.missingRequiredFields]);

  const purgeImages = () => {
    if (frontUrlRef.current) URL.revokeObjectURL(frontUrlRef.current);
    if (backUrlRef.current) URL.revokeObjectURL(backUrlRef.current);
    frontUrlRef.current = null;
    backUrlRef.current = null;
    setFrontImage(null);
    setBackImage(null);
  };

  const runAnalysis = async (
    front: DocumentImageSlot | null,
    back: DocumentImageSlot | null,
    mergeWithExisting = false
  ) => {
    if (!front) return;
    setIsReading(true);
    setReadError(null);
    setClearedBanner(false);

    const images = [{ mimeType: front.mimeType, base64: front.base64 }];
    if (back) {
      images.push({ mimeType: back.mimeType, base64: back.base64 });
    }

    try {
      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images }),
      });

      if (response.status === 413) {
        setReadError(t.errFileTooLarge);
        return;
      }

      const contentType = response.headers.get('content-type') ?? '';
      if (!contentType.includes('application/json')) {
        setReadError(t.errServerFailed);
        return;
      }

      const payload = (await response.json().catch(() => null)) as
        | { data?: ExtractedDocumentData; code?: string }
        | null;

      if (!response.ok || !payload || !payload.data || typeof payload.data !== 'object') {
        if (payload?.code === 'FILE_TOO_LARGE') {
          setReadError(t.errFileTooLarge);
        } else if (payload?.code === 'GEMINI_QUOTA_EXCEEDED') {
          setReadError(t.errGeminiQuotaExceeded);
        } else if (response.status === 429 || payload?.code === 'RATE_LIMITED') {
          setReadError(t.errRateLimited);
        } else if (payload?.code === 'GEMINI_NOT_CONFIGURED') {
          setReadError(t.errGeminiNotConfigured);
        } else if (payload?.code === 'GEMINI_AUTH_ERROR') {
          setReadError(t.errGeminiAuth);
        } else {
          setReadError(t.errServerFailed);
        }
        return;
      }

      const extracted = payload.data;
      setForm((prev) => {
        const nextForm = applyExtractedDataToForm(prev, extracted, mergeWithExisting);
        setLockedFields((prevLocks) =>
          deriveLockedFieldsFromExtraction(prevLocks, prev, nextForm, extracted, mergeWithExisting)
        );
        return nextForm;
      });
      setWarnings(Array.isArray(extracted.warnings) ? extracted.warnings : []);
      setUnreadableFields(
        Array.isArray(extracted.unreadableFields) ? extracted.unreadableFields : []
      );
      setReadSucceeded(true);
      // Do not retain any copy of the document photo after reading the data
      purgeImages();
    } catch {
      setReadError(t.errServerFailed);
    } finally {
      setIsReading(false);
    }
  };

  const handleSelectImage = async (slot: 'front' | 'back', file: File) => {
    setReadError(null);
    setClearedBanner(false);

    if (!isSupportedImageFile(file)) {
      setReadError(t.errInvalidFileType);
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setReadError(t.errFileTooLarge);
      return;
    }

    const prepared = await prepareImageForUpload(file);

    const nextSlot: DocumentImageSlot = {
      id: slot,
      file,
      previewUrl: '',
      base64: prepared.base64,
      mimeType: prepared.mimeType,
    };

    if (slot === 'front') {
      if (frontUrlRef.current) URL.revokeObjectURL(frontUrlRef.current);
      frontUrlRef.current = null;
      setFrontImage(nextSlot);
      if (geminiConsent) {
        await runAnalysis(nextSlot, backImage, readSucceeded);
      }
    } else {
      if (backUrlRef.current) URL.revokeObjectURL(backUrlRef.current);
      backUrlRef.current = null;
      setBackImage(nextSlot);
      if (geminiConsent && frontImage) {
        await runAnalysis(frontImage, nextSlot, readSucceeded);
      }
    }
  };

  const handleRemoveImage = (slot: 'front' | 'back') => {
    if (slot === 'front') {
      purgeImages();
      setReadSucceeded(false);
      setReadError(null);
      setWarnings([]);
      setUnreadableFields([]);
      setLockedFields(createEmptyLockedFields());
    } else {
      if (backUrlRef.current) URL.revokeObjectURL(backUrlRef.current);
      backUrlRef.current = null;
      setBackImage(null);
    }
  };

  const handleToggleConsent = (checked: boolean) => {
    setGeminiConsent(checked);
    if (checked && frontImage && !isReading) {
      void runAnalysis(frontImage, backImage, readSucceeded);
    }
  };

  const handleAnalyzeNow = () => {
    if (!geminiConsent) {
      setGeminiConsent(true);
    }
    if (frontImage && !isReading) {
      void runAnalysis(frontImage, backImage, readSucceeded);
    }
  };

  const handleChangeField = <K extends keyof GuestFormData>(
    key: K,
    value: GuestFormData[K]
  ) => {
    setPreparedMessage(null);
    setPreparedUrl(null);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleChangeDocumentType = (nextType: DocumentType) => {
    setPreparedMessage(null);
    setPreparedUrl(null);
    setForm((prev) => switchDocumentType(prev, nextType));
  };

  const handleSelectPrimaryMember = (memberId: string) => {
    setPreparedMessage(null);
    setPreparedUrl(null);
    setForm((prev) => selectPrimaryFamilyMember(prev, memberId));
  };

  const handleToggleAccompanyingMember = (memberId: string) => {
    setPreparedMessage(null);
    setPreparedUrl(null);
    setForm((prev) => {
      const exists = prev.accompanyingMemberIds.includes(memberId);
      return {
        ...prev,
        accompanyingMemberIds: exists
          ? prev.accompanyingMemberIds.filter((id) => id !== memberId)
          : [...prev.accompanyingMemberIds, memberId],
      };
    });
  };

  const handleUpdateFamilyMember = (
    memberId: string,
    patch: Partial<FamilyMember>
  ) => {
    setPreparedMessage(null);
    setPreparedUrl(null);
    setForm((prev) => {
      const updatedMembers = prev.familyMembers.map((m) =>
        m.id === memberId ? { ...m, ...patch } : m
      );
      const next = { ...prev, familyMembers: updatedMembers };
      if (prev.primaryMemberId === memberId && patch.fullName !== undefined) {
        next.fullName = patch.fullName;
      }
      if (prev.primaryMemberId === memberId && patch.documentNumber !== undefined) {
        next.documentNumber = patch.documentNumber;
      }
      if (prev.primaryMemberId === memberId && patch.dateOfBirth !== undefined) {
        next.dateOfBirth = patch.dateOfBirth;
      }
      if (prev.primaryMemberId === memberId && patch.birthCalendar !== undefined) {
        next.birthCalendar = patch.birthCalendar;
      }
      if (prev.primaryMemberId === memberId) {
        const editedPrimary = updatedMembers.find((m) => m.id === memberId);
        if (editedPrimary && isMemberUnder18(editedPrimary)) {
          const fallbackAdult = updatedMembers.find((m) => !isMemberUnder18(m));
          if (fallbackAdult) {
            return selectPrimaryFamilyMember(next, fallbackAdult.id);
          }
          next.primaryMemberId = null;
        }
      }
      return next;
    });
  };

  const handleAddFamilyMember = () => {
    setForm((prev) => {
      const newMember: FamilyMember = {
        id: `member_${Date.now()}`,
        fullName: '',
        documentNumber: '',
        sex: '',
        dateOfBirth: '',
        birthCalendar: 'unknown',
        relationship: '',
      };
      const nextMembers = [...prev.familyMembers, newMember];
      return {
        ...prev,
        familyMembers: nextMembers,
        primaryMemberId: prev.primaryMemberId ?? newMember.id,
      };
    });
  };

  const handleRemoveFamilyMember = (memberId: string) => {
    setForm((prev) => ({
      ...prev,
      familyMembers: prev.familyMembers.filter((m) => m.id !== memberId),
      primaryMemberId: prev.primaryMemberId === memberId ? null : prev.primaryMemberId,
      accompanyingMemberIds: prev.accompanyingMemberIds.filter((id) => id !== memberId),
    }));
  };

  const handleSelectPurpose = (purpose: VisitPurposeId) => {
    setPreparedMessage(null);
    setPreparedUrl(null);
    setForm((prev) => ({
      ...prev,
      purposeOfVisit: purpose,
      otherPurposeDetail: purpose === 'other' ? prev.otherPurposeDetail : '',
    }));
  };

  const handleSelectBookingSource = (source: BookingSourceId) => {
    setPreparedMessage(null);
    setPreparedUrl(null);
    setForm((prev) => ({
      ...prev,
      bookingSource: source,
      bookingReference: source === 'booking_com' ? prev.bookingReference : '',
    }));
  };

  const handlePrepareAndOpenWhatsApp = () => {
    setAttemptedSubmit(true);
    if (!selectedHotel || !validation.canOpenWhatsApp) {
      return;
    }

    const message = buildWhatsAppMessage(form, selectedHotel);
    const url = buildWhatsAppUrl(selectedHotel.whatsappNumber, message);
    if (!url) return;

    // Ensure no copy of any document image remains after sending
    purgeImages();

    setPreparedMessage(message);
    setPreparedUrl(url);

    // Open WhatsApp via safe programmatic link without window.open popup blocks or window.alert
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleClearAll = () => {
    purgeImages();
    setGeminiConsent(false);
    setIsReading(false);
    setReadSucceeded(false);
    setReadError(null);
    setWarnings([]);
    setUnreadableFields([]);
    setForm(createEmptyGuestForm());
    setLockedFields(createEmptyLockedFields());
    setDeclarationAccepted(false);
    setAttemptedSubmit(false);
    setPreparedMessage(null);
    setPreparedUrl(null);
    setSelectedHotelId(null);
    setClearedBanner(true);
  };

  const hasEnteredMobile = Boolean(
    form.mobileNumber.trim() && form.mobileNumber.trim() !== '+966'
  );

  const hasSessionData = Boolean(
    selectedHotelId ||
      frontImage ||
      backImage ||
      form.fullName ||
      form.documentNumber ||
      form.nationality ||
      hasEnteredMobile ||
      form.purposeOfVisit ||
      form.bookingSource
  );

  return (
    <div className="min-h-dvh bg-[#F4EFEA] text-[#2C2C2C]">
      <HeaderBar
        lang={lang}
        t={t}
        onToggleLanguage={() => setLang((prev) => (prev === 'ar' ? 'en' : 'ar'))}
        onClearAll={handleClearAll}
        hasSessionData={hasSessionData}
      />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-5 sm:px-6 sm:pt-8">
        <div className="mb-6">
          <p className="m-0 max-w-2xl text-sm text-[#685F58] sm:text-base">
            {t.appSubtitle}
          </p>
        </div>

        {clearedBanner && (
          <div
            role="status"
            className="mb-5 rounded-2xl border border-[#2C2C2C]/15 bg-[#FAF7F2] px-4 py-3 text-sm font-medium text-[#2C2C2C]"
          >
            {t.clearedSuccess}
          </div>
        )}

        <div className="space-y-5">
          {/* Step 1: Hotel Selection */}
          <HotelSelector
            hotels={hotels}
            selectedHotelId={selectedHotelId}
            onSelectHotel={(id) => {
              setSelectedHotelId(id);
              setPreparedMessage(null);
              setPreparedUrl(null);
              setClearedBanner(false);
            }}
            lang={lang}
            t={t}
          />

          {/* Single-page unified flow: Document photo & Review/Booking/Send */}
          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
            <div className="lg:sticky lg:top-20 lg:col-span-5">
              <DocumentCapture
                frontImage={frontImage}
                backImage={backImage}
                geminiConsent={geminiConsent}
                isReading={isReading}
                readSucceeded={readSucceeded}
                readError={readError}
                warnings={warnings}
                unreadableFields={unreadableFields}
                onSelectImage={handleSelectImage}
                onRemoveImage={handleRemoveImage}
                onToggleConsent={handleToggleConsent}
                onAnalyzeNow={handleAnalyzeNow}
                t={t}
              />
            </div>

            <div className="space-y-5 lg:col-span-7">
              <GuestDataForm
                form={form}
                lockedFields={lockedFields}
                missingFields={missingFieldsSet}
                onChangeField={handleChangeField}
                onChangeDocumentType={handleChangeDocumentType}
                onSelectPrimaryMember={handleSelectPrimaryMember}
                onToggleAccompanyingMember={handleToggleAccompanyingMember}
                onUpdateFamilyMember={handleUpdateFamilyMember}
                onAddFamilyMember={handleAddFamilyMember}
                onRemoveFamilyMember={handleRemoveFamilyMember}
                t={t}
              />

              <VisitBookingSection
                form={form}
                missingFields={missingFieldsSet}
                onSelectPurpose={handleSelectPurpose}
                onChangeOtherPurpose={(val) => handleChangeField('otherPurposeDetail', val)}
                onSelectBookingSource={handleSelectBookingSource}
                onChangeBookingReference={(val) => handleChangeField('bookingReference', val)}
                t={t}
              />

              <WhatsAppSubmitSection
                selectedHotel={selectedHotel}
                validation={validation}
                declarationAccepted={declarationAccepted}
                onToggleDeclaration={(checked) => setDeclarationAccepted(checked)}
                onPrepareAndOpenWhatsApp={handlePrepareAndOpenWhatsApp}
                preparedMessage={preparedMessage}
                preparedUrl={preparedUrl}
                attemptedSubmit={attemptedSubmit}
                t={t}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
