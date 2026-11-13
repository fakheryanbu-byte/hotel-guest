import { AlertCircle, Plus, Trash2, UserCheck, Users } from 'lucide-react';
import type { TranslationKeys } from '../i18n/ar';
import type {
  CalendarType,
  DocumentType,
  FamilyMember,
  GuestFormData,
  SexType,
} from '../types/guest';
import {
  getFieldVisibility,
  normalizeDateInput,
  normalizeMobileInput,
  toAsciiDigits,
} from '../utils/documentRules';

interface GuestDataFormProps {
  form: GuestFormData;
  missingFields: Set<string>;
  onChangeField: <K extends keyof GuestFormData>(key: K, value: GuestFormData[K]) => void;
  onChangeDocumentType: (nextType: DocumentType) => void;
  onSelectPrimaryMember: (memberId: string) => void;
  onToggleAccompanyingMember: (memberId: string) => void;
  onUpdateFamilyMember: (memberId: string, patch: Partial<FamilyMember>) => void;
  onAddFamilyMember: () => void;
  onRemoveFamilyMember: (memberId: string) => void;
  t: TranslationKeys;
}

export function GuestDataForm({
  form,
  missingFields,
  onChangeField,
  onChangeDocumentType,
  onSelectPrimaryMember,
  onToggleAccompanyingMember,
  onUpdateFamilyMember,
  onAddFamilyMember,
  onRemoveFamilyMember,
  t,
}: GuestDataFormProps) {
  const vis = getFieldVisibility(form.documentType);

  const hasNameParts = Boolean(
    form.nameParts.firstName ||
      form.nameParts.fatherName ||
      form.nameParts.grandfatherName ||
      form.nameParts.familyName
  );

  const inputClass = (fieldKey: string) =>
    `min-h-[48px] w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#2C2C2C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C58B6D] ${
      missingFields.has(fieldKey)
        ? 'border-[#C58B6D] bg-[#E8A588]/15'
        : 'border-[#2C2C2C]/15 bg-[#FFFFFF]'
    }`;

  const renderLabel = (label: string, fieldKey: string, required = false) => (
    <div className="mb-1.5 flex items-center justify-between gap-2">
      <label className="text-sm font-semibold text-[#2C2C2C]">
        {label}
        {required && <span className="ms-1 text-[#8C5338]">{t.requiredMark}</span>}
      </label>
      {missingFields.has(fieldKey) && (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#8C5338]">
          <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{t.missingBadge}</span>
        </span>
      )}
    </div>
  );

  return (
    <section
      aria-labelledby="data-section-title"
      className="rounded-2xl border border-[#2C2C2C]/10 bg-[#FAF7F2] p-4 shadow-[var(--shadow-card)] sm:rounded-3xl sm:p-6"
    >
      <div className="mb-5">
        <h2
          id="data-section-title"
          className="text-lg font-bold text-[#2C2C2C] sm:text-xl"
        >
          {t.sectionDataTitle}
        </h2>
        <p className="mt-1 text-sm text-[#685F58]">{t.sectionDataDesc}</p>
      </div>

      <div className="space-y-4">
        {/* Document Type */}
        <div>
          {renderLabel(t.fieldDocumentType, 'documentType', true)}
          <select
            value={form.documentType}
            onChange={(e) => onChangeDocumentType(e.target.value as DocumentType)}
            className={inputClass('documentType')}
          >
            <option value="unknown">{t.docTypes.unknown}</option>
            <option value="national_id">{t.docTypes.national_id}</option>
            <option value="iqama">{t.docTypes.iqama}</option>
            <option value="passport">{t.docTypes.passport}</option>
            <option value="family_register">{t.docTypes.family_register}</option>
          </select>
        </div>

        {/* Family Register Member Selection */}
        {vis.showFamilyMembers && (
          <div className="border-y border-[#2C2C2C]/10 py-4">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <h3 className="flex items-center gap-2 text-base font-bold text-[#2C2C2C]">
                  <Users className="h-4 w-4 text-[#8C5338]" aria-hidden="true" />
                  <span>{t.familySectionTitle}</span>
                </h3>
                <p className="mt-1 text-xs text-[#685F58]">{t.familySectionNote}</p>
              </div>
              <button
                type="button"
                onClick={onAddFamilyMember}
                className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-xl border border-[#2C2C2C]/15 bg-[#F4EFEA] px-3 py-2 text-xs font-semibold text-[#2C2C2C] hover:bg-[#E8A588]/20"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>{t.familyAddMember}</span>
              </button>
            </div>

            {form.familyMembers.length === 0 ? (
              <p className="m-0 rounded-xl bg-[#F4EFEA] p-3 text-xs text-[#685F58]">
                {t.familyNoMembers}
              </p>
            ) : (
              <div className="divide-y divide-[#2C2C2C]/10">
                {form.familyMembers.map((member) => {
                  const isPrimary = form.primaryMemberId === member.id;
                  const isAccompanying =
                    !isPrimary && form.accompanyingMemberIds.includes(member.id);

                  return (
                    <div key={member.id} className="space-y-2.5 py-3 first:pt-0 last:pb-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onSelectPrimaryMember(member.id)}
                            className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                              isPrimary
                                ? 'bg-[#2C2C2C] text-[#FAF7F2]'
                                : 'border border-[#2C2C2C]/15 bg-[#F4EFEA] text-[#2C2C2C] hover:bg-[#E8A588]/25'
                            }`}
                          >
                            <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>{isPrimary ? t.familyIsPrimary : t.familySelectPrimary}</span>
                          </button>

                          {!isPrimary && (
                            <label className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border border-[#2C2C2C]/15 bg-[#F4EFEA]/70 px-3 py-2 text-xs font-semibold text-[#2C2C2C]">
                              <input
                                type="checkbox"
                                checked={isAccompanying}
                                onChange={() => onToggleAccompanyingMember(member.id)}
                                className="h-4 w-4 accent-[#C58B6D]"
                              />
                              <span>{t.familyAccompanying}</span>
                            </label>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveFamilyMember(member.id)}
                          className="inline-flex min-h-[44px] items-center gap-1 rounded-xl px-2.5 py-2 text-xs font-medium text-[#9E3B33] hover:bg-[#9E3B33]/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{t.familyRemoveMember}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <input
                          type="text"
                          value={member.fullName}
                          onChange={(e) =>
                            onUpdateFamilyMember(member.id, { fullName: e.target.value })
                          }
                          placeholder={t.familyMemberName}
                          className={`min-h-[44px] rounded-xl border px-3 py-2 text-xs text-[#2C2C2C] ${
                            isAccompanying && !member.fullName.trim()
                              ? 'border-[#C58B6D] bg-[#E8A588]/15'
                              : 'border-[#2C2C2C]/15 bg-[#FFFFFF]'
                          }`}
                        />
                        <input
                          type="text"
                          dir="ltr"
                          value={member.documentNumber}
                          onChange={(e) =>
                            onUpdateFamilyMember(member.id, {
                              documentNumber: toAsciiDigits(e.target.value),
                            })
                          }
                          placeholder={t.familyMemberDocNum}
                          className="ltr-field tabular-nums min-h-[44px] rounded-xl border border-[#2C2C2C]/15 bg-[#FFFFFF] px-3 py-2 text-xs text-[#2C2C2C]"
                        />
                        <input
                          type="text"
                          value={member.relationship}
                          onChange={(e) =>
                            onUpdateFamilyMember(member.id, { relationship: e.target.value })
                          }
                          placeholder={t.familyMemberRelation}
                          className="min-h-[44px] rounded-xl border border-[#2C2C2C]/15 bg-[#FFFFFF] px-3 py-2 text-xs text-[#2C2C2C]"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div>
                          <div className="mb-1 flex items-center justify-between gap-2">
                            <span className="text-[11px] font-semibold text-[#685F58]">
                              {t.familyMemberDob}
                              {isAccompanying && (
                                <span className="ms-1 text-[#8C5338]">{t.requiredMark}</span>
                              )}
                            </span>
                            {isAccompanying && !member.dateOfBirth.trim() && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8C5338]">
                                <AlertCircle className="h-3 w-3" aria-hidden="true" />
                                <span>{t.missingBadge}</span>
                              </span>
                            )}
                          </div>
                          <input
                            type="text"
                            dir="ltr"
                            value={member.dateOfBirth}
                            onChange={(e) =>
                              onUpdateFamilyMember(member.id, {
                                dateOfBirth: toAsciiDigits(e.target.value),
                              })
                            }
                            onBlur={() => {
                              const { formatted, inferredCalendar } = normalizeDateInput(
                                member.dateOfBirth
                              );
                              const patch: Partial<FamilyMember> = {};
                              if (formatted !== member.dateOfBirth) {
                                patch.dateOfBirth = formatted;
                              }
                              if (member.birthCalendar === 'unknown' && inferredCalendar) {
                                patch.birthCalendar = inferredCalendar;
                              }
                              if (Object.keys(patch).length > 0) {
                                onUpdateFamilyMember(member.id, patch);
                              }
                            }}
                            placeholder={t.fieldDatePlaceholder}
                            className={`ltr-field tabular-nums min-h-[44px] w-full rounded-xl border px-3 py-2 text-xs text-[#2C2C2C] ${
                              isAccompanying && !member.dateOfBirth.trim()
                                ? 'border-[#C58B6D] bg-[#E8A588]/15'
                                : 'border-[#2C2C2C]/15 bg-[#FFFFFF]'
                            }`}
                          />
                        </div>

                        <div>
                          <span className="mb-1 block text-[11px] font-semibold text-[#685F58]">
                            {t.fieldCalendar}
                          </span>
                          <select
                            value={member.birthCalendar}
                            onChange={(e) =>
                              onUpdateFamilyMember(member.id, {
                                birthCalendar: e.target.value as CalendarType,
                              })
                            }
                            className="min-h-[44px] w-full rounded-xl border border-[#2C2C2C]/15 bg-[#FFFFFF] px-3 py-2 text-xs text-[#2C2C2C]"
                          >
                            <option value="unknown">{t.calendarSelect}</option>
                            <option value="hijri">{t.calendarHijri}</option>
                            <option value="gregorian">{t.calendarGregorian}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Full Name */}
        <div>
          {renderLabel(t.fieldFullName, 'fullName', true)}
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => onChangeField('fullName', e.target.value)}
            placeholder={t.fieldFullNamePlaceholder}
            className={inputClass('fullName')}
          />
        </div>

        {/* Optional Extracted Name Parts (never enforced if absent) */}
        {hasNameParts && (
          <div className="rounded-2xl border border-[#2C2C2C]/10 bg-[#F4EFEA]/70 p-3">
            <div className="mb-2 text-xs font-semibold text-[#685F58]">
              {t.fieldNamePartsTitle}
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {form.nameParts.firstName && (
                <div>
                  <span className="block text-[11px] text-[#685F58]">{t.fieldFirstName}</span>
                  <span className="text-xs font-semibold text-[#2C2C2C]">
                    {form.nameParts.firstName}
                  </span>
                </div>
              )}
              {form.nameParts.fatherName && (
                <div>
                  <span className="block text-[11px] text-[#685F58]">{t.fieldFatherName}</span>
                  <span className="text-xs font-semibold text-[#2C2C2C]">
                    {form.nameParts.fatherName}
                  </span>
                </div>
              )}
              {form.nameParts.grandfatherName && (
                <div>
                  <span className="block text-[11px] text-[#685F58]">{t.fieldGrandfatherName}</span>
                  <span className="text-xs font-semibold text-[#2C2C2C]">
                    {form.nameParts.grandfatherName}
                  </span>
                </div>
              )}
              {form.nameParts.familyName && (
                <div>
                  <span className="block text-[11px] text-[#685F58]">{t.fieldFamilyName}</span>
                  <span className="text-xs font-semibold text-[#2C2C2C]">
                    {form.nameParts.familyName}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Document Number + Nationality */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            {renderLabel(t.fieldDocumentNumber, 'documentNumber', true)}
            <input
              type="text"
              dir="ltr"
              inputMode="text"
              value={form.documentNumber}
              onChange={(e) => onChangeField('documentNumber', toAsciiDigits(e.target.value))}
              placeholder={t.fieldDocumentNumberPlaceholder}
              className={`${inputClass('documentNumber')} ltr-field tabular-nums`}
            />
          </div>

          <div>
            {renderLabel(t.fieldNationality, 'nationality', true)}
            <input
              type="text"
              value={form.nationality}
              onChange={(e) => onChangeField('nationality', e.target.value)}
              placeholder={t.fieldNationalityPlaceholder}
              className={inputClass('nationality')}
            />
          </div>
        </div>

        {/* Sex + Date of Birth + Calendar */}
        <div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              {renderLabel(t.fieldSex, 'sex', false)}
              <select
                value={form.sex}
                onChange={(e) => onChangeField('sex', e.target.value as SexType)}
                className={inputClass('sex')}
              >
                <option value="">{t.sexSelect}</option>
                <option value="male">{t.sexMale}</option>
                <option value="female">{t.sexFemale}</option>
              </select>
            </div>

            <div>
              {renderLabel(t.fieldDateOfBirth, 'dateOfBirth', true)}
              <input
                type="text"
                dir="ltr"
                value={form.dateOfBirth}
                onChange={(e) => onChangeField('dateOfBirth', toAsciiDigits(e.target.value))}
                onBlur={() => {
                  const { formatted, inferredCalendar } = normalizeDateInput(form.dateOfBirth);
                  if (formatted !== form.dateOfBirth) {
                    onChangeField('dateOfBirth', formatted);
                  }
                  if (form.birthCalendar === 'unknown' && inferredCalendar) {
                    onChangeField('birthCalendar', inferredCalendar);
                  }
                }}
                placeholder={t.fieldDatePlaceholder}
                className={`${inputClass('dateOfBirth')} ltr-field tabular-nums`}
              />
            </div>

            <div>
              {renderLabel(t.fieldCalendar, 'birthCalendar', true)}
              <select
                value={form.birthCalendar}
                onChange={(e) =>
                  onChangeField('birthCalendar', e.target.value as CalendarType)
                }
                className={inputClass('birthCalendar')}
              >
                <option value="unknown">{t.calendarSelect}</option>
                <option value="hijri">{t.calendarHijri}</option>
                <option value="gregorian">{t.calendarGregorian}</option>
              </select>
            </div>
          </div>
          <p className="m-0 mt-1.5 text-xs text-[#685F58]">{t.dateHelperText}</p>
        </div>

        {/* Expiry Date (when applicable) */}
        {vis.showExpiryDate && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              {renderLabel(t.fieldExpiryDate, 'expiryDate', false)}
              <input
                type="text"
                dir="ltr"
                value={form.expiryDate}
                onChange={(e) => onChangeField('expiryDate', toAsciiDigits(e.target.value))}
                onBlur={() => {
                  const { formatted, inferredCalendar } = normalizeDateInput(form.expiryDate);
                  if (formatted !== form.expiryDate) {
                    onChangeField('expiryDate', formatted);
                  }
                  if (form.expiryCalendar === 'unknown' && inferredCalendar) {
                    onChangeField('expiryCalendar', inferredCalendar);
                  }
                }}
                placeholder={t.fieldDatePlaceholder}
                className={`${inputClass('expiryDate')} ltr-field tabular-nums`}
              />
            </div>

            <div>
              {renderLabel(t.fieldExpiryCalendar, 'expiryCalendar', false)}
              <select
                value={form.expiryCalendar}
                onChange={(e) =>
                  onChangeField('expiryCalendar', e.target.value as CalendarType)
                }
                className={inputClass('expiryCalendar')}
              >
                <option value="unknown">{t.calendarSelect}</option>
                <option value="hijri">{t.calendarHijri}</option>
                <option value="gregorian">{t.calendarGregorian}</option>
              </select>
            </div>
          </div>
        )}

        {/* Version Number (National ID & Iqama) */}
        {vis.showVersionNumber && (
          <div>
            {renderLabel(t.fieldVersionNumber, 'versionNumber', vis.requireVersionNumber)}
            <input
              type="text"
              dir="ltr"
              inputMode="numeric"
              value={form.versionNumber}
              onChange={(e) => onChangeField('versionNumber', toAsciiDigits(e.target.value))}
              placeholder={t.fieldVersionPlaceholder}
              className={`${inputClass('versionNumber')} ltr-field tabular-nums`}
            />
            <p className="m-0 mt-1.5 text-xs text-[#685F58]">{t.versionHelperText}</p>
          </div>
        )}

        {/* Border Number (Passport only) */}
        {vis.showBorderNumber && (
          <div className="rounded-2xl border border-[#C58B6D]/40 bg-[#E8A588]/10 p-3.5">
            {renderLabel(t.fieldBorderNumber, 'borderNumber', !form.borderNumberUnknown)}
            <input
              type="text"
              dir="ltr"
              inputMode="numeric"
              disabled={form.borderNumberUnknown}
              value={form.borderNumber}
              onChange={(e) => onChangeField('borderNumber', toAsciiDigits(e.target.value))}
              placeholder={t.fieldBorderPlaceholder}
              className={`${inputClass('borderNumber')} ltr-field tabular-nums disabled:opacity-50`}
            />
            <p className="m-0 mt-1.5 text-xs font-medium text-[#8C5338]">
              {t.borderHelperText}
            </p>
            <label className="mt-2.5 flex min-h-[44px] cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={form.borderNumberUnknown}
                onChange={(e) => {
                  const checked = e.target.checked;
                  onChangeField('borderNumberUnknown', checked);
                  if (checked) {
                    onChangeField('borderNumber', '');
                  }
                }}
                className="h-5 w-5 shrink-0 accent-[#C58B6D]"
              />
              <span className="text-xs font-semibold text-[#2C2C2C] sm:text-sm">
                {t.borderUnknownCheckbox}
              </span>
            </label>
          </div>
        )}

        {/* Mobile Number */}
        <div>
          {renderLabel(t.fieldMobileNumber, 'mobileNumber', true)}
          <input
            type="tel"
            dir="ltr"
            inputMode="tel"
            value={form.mobileNumber}
            onChange={(e) => onChangeField('mobileNumber', toAsciiDigits(e.target.value))}
            onBlur={() => {
              const normalized = normalizeMobileInput(form.mobileNumber);
              if (normalized !== form.mobileNumber) {
                onChangeField('mobileNumber', normalized);
              }
            }}
            placeholder={t.fieldMobilePlaceholder}
            className={`${inputClass('mobileNumber')} ltr-field tabular-nums`}
          />
          <p className="m-0 mt-1.5 text-xs text-[#685F58]">{t.mobileHelperText}</p>
        </div>
      </div>
    </section>
  );
}
