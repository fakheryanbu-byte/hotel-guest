export const ar = {
  appTitle: 'تجهيز بيانات النزيل',
  appSubtitle: 'تحضير بيانات تسجيل الدخول وإرسالها مباشرةً إلى واتساب الفندق',
  langToggle: 'English',
  clearMyData: 'مسح بياناتي',
  clearedSuccess: 'تم مسح جميع البيانات من الجلسة الحالية.',

  // Section 1: Hotel
  sectionHotelTitle: '1. اختيار الفندق',
  sectionHotelDesc: 'اختر الفرع الذي تقيم فيه لإرسال البيانات إلى استقباله مباشرة.',
  branchReady: 'واتساب الاستقبال جاهز',
  branchNotConfigured: 'غير مضبوط',
  branchNotConfiguredBanner:
    'لم يُضبط رقم واتساب الاستقبال لهذا الفرع بعد. تم تعطيل الإرسال لحين ضبط الرقم من إعدادات النظام.',

  // Section 2: Document reading
  sectionDocTitle: '2. قراءة الوثيقة',
  sectionDocDesc: 'استخرج بيانات الهوية أو الإقامة أو جواز السفر أو سجل الأسرة آلياً لتعبئة النموذج — أو أدخلها يدوياً أدناه.',
  docPlaceholderTitle: 'قراءة نصية فورية بدون حفظ',
  docPlaceholderDesc:
    'تُقرأ البيانات الظاهرة لتعبئة النموذج فقط وتُمسح فوراً من الذاكرة، دون عرض أو حفظ أي صورة للهوية.',
  docLoadedHiddenTitle: 'تم تجهيز الملف للقراءة النصية فقط',
  docLoadedHiddenDesc: 'حفاظاً على خصوصيتك، لا تُعرض صورة الوثيقة على الشاشة ولن تبقى أي نسخة منها.',
  frontSideLabel: 'الوجه الأمامي للوثيقة',
  backSideLabel: 'الوجه الخلفي أو صفحة إضافية (اختياري)',
  takePhoto: 'قراءة الوثيقة',
  chooseFromGallery: 'اختيار ملف من الجهاز',
  retakePhoto: 'إعادة القراءة',
  deletePhoto: 'إلغاء',
  addBackSide: 'قراءة الوجه الخلفي / صفحة إضافية',
  geminiPrivacyNotice:
    'تنبيه الخصوصية: تتم قراءة البيانات النصية من الوثيقة مؤقتاً لتعبئة النموذج فقط، ولا يتم عرض صورة الهوية أو حفظ أي نسخة منها نهائياً.',
  geminiConsentLabel: 'أوافق على قراءة بيانات الوثيقة آلياً لتعبئة النموذج دون حفظها.',
  analyzeNowButton: 'استخراج البيانات الآن',
  readingDocument: 'جارٍ قراءة الوثيقة...',
  readingComplete:
    'تمت قراءة البيانات الظاهرة وإزالة الملف من الذاكرة فوراً لحماية خصوصيتك. يرجى مراجعة البيانات واستكمال الحقول الناقصة.',
  readingFailedFallback:
    'تعذرت قراءة الوثيقة بوضوح. يمكنك المحاولة مرة أخرى بإضاءة أوضح أو تعبئة البيانات يدوياً أدناه.',
  authenticityDisclaimer:
    'ملاحظة: القراءة الآلية تساعد في تعبئة النموذج فقط ولا تُعد تحققاً من أصالة الوثيقة.',
  warningsTitle: 'تنبيهات القراءة',
  unreadableFieldsLabel: 'حقول غير واضحة أو ناقصة:',

  // Section 3: Guest data form
  sectionDataTitle: '3. مراجعة البيانات واستكمالها',
  sectionDataDesc: 'جميع الحقول قابلة للتعديل. الحقول المطلوبة المظللة يجب استكمالها قبل الإرسال.',
  missingBadge: 'ناقص',
  requiredMark: '*',
  statusIncompleteData: 'ناقص بيانات',

  fieldFullName: 'الاسم الكامل',
  fieldFullNamePlaceholder: 'الاسم كما يظهر في الوثيقة',
  fieldDocumentType: 'نوع الوثيقة',
  fieldDocumentNumber: 'رقم الوثيقة',
  fieldDocumentNumberPlaceholder: '10XXXXXXXX',
  fieldNationality: 'الجنسية',
  fieldNationalityPlaceholder: 'مثال: سعودي',
  fieldSex: 'الجنس',
  sexSelect: 'اختر الجنس',
  sexMale: 'ذكر',
  sexFemale: 'أنثى',
  fieldDateOfBirth: 'تاريخ الميلاد',
  fieldDatePlaceholder: '1413/02/16 أو 1992-08-15',
  fieldCalendar: 'التقويم',
  calendarSelect: 'اختر التقويم',
  calendarHijri: 'هجري',
  calendarGregorian: 'ميلادي',
  calendarUnknown: 'غير محدد',
  wheelDay: 'اليوم',
  wheelMonth: 'الشهر',
  wheelYear: 'السنة',
  wheelPickerShow: 'عجلة التاريخ',
  wheelPickerHide: 'إخفاء العجلة',
  wheelPickerOpen: 'اختيار بالتمرير',
  wheelApply: 'اعتماد التاريخ',
  wheelCancel: 'إلغاء',
  wheelHint: 'اسحب أو مرّر للأعلى والأسفل لاختيار اليوم والشهر والسنة',
  fieldExpiryDate: 'تاريخ الانتهاء',
  fieldVersionNumber: 'رقم النسخة',
  fieldVersionPlaceholder: '1 / 2',
  versionHelperText: 'رقم النسخة مطلوب للهوية الوطنية والإقامة. إذا لم يظهر، أدخله يدوياً أو اقرأ الوجه الخلفي.',
  fieldBorderNumber: 'رقم الحدود',
  fieldBorderPlaceholder: '30XXXXXXXX',
  borderHelperText: 'تنبيه: رقم الحدود يختلف عن رقم الجواز ورقم التأشيرة.',
  borderUnknownCheckbox: 'لا أعرف رقم الحدود — أطلب مساعدة الاستقبال (ستُرسل الحالة كـ «ناقص بيانات»)',
  fieldMobileNumber: 'رقم الجوال مع رمز الدولة',
  fieldMobilePlaceholder: '+9665XXXXXXXX',
  mobileHelperText: 'المفتاح الدولي 966+ مضاف تلقائياً ويمكنك تعديله لأي دولة أخرى.',

  docTypes: {
    national_id: 'هوية وطنية',
    iqama: 'إقامة',
    passport: 'جواز سفر',
    family_register: 'سجل أسرة',
    unknown: 'غير معروف',
  },

  // Family register
  familySectionTitle: 'أفراد سجل الأسرة',
  familySelectPrimary: 'نزيل رئيسي',
  familyIsPrimary: 'النزيل الرئيسي',
  familyAccompanying: 'مرافق',
  familyAddMember: 'إضافة فرد يدوياً',
  familyRemoveMember: 'إزالة',
  familyMemberName: 'اسم الفرد',
  familyMemberDocNum: 'رقم الهوية',
  familyMemberRelation: 'صلة القرابة',
  familyMemberDob: 'تاريخ الميلاد',
  familyMemberDobRequired: 'يلزم إدخال تاريخ الميلاد للمرافق',
  familyMemberNameRequired: 'يلزم إدخال اسم المرافق',
  familyCardholderBadge: 'صاحب الكرت الرئيسي',
  familyMemberOrderPrefix: 'فرد رقم',
  familyUnder18Badge: 'أقل من 18',
  familyNoMembers: 'لم يُستخرج أفراد تلقائياً؛ يمكنك إضافة المرافقين يدوياً إذا كان هناك مرافقون.',

  // Section 4: Visit & booking
  sectionVisitTitle: '4. سبب الزيارة ومصدر الحجز',
  sectionVisitDesc: 'يُختار يدوياً من قِبل النزيل (لا يُستنتج تلقائياً).',
  fieldPurposeOfVisit: 'سبب الزيارة',
  purposeSettingsNote: 'هذه خيارات تشغيلية قابلة للتعديل من إعدادات التطبيق.',
  fieldOtherPurpose: 'توضيح سبب الزيارة',
  fieldOtherPurposePlaceholder: 'اكتب سبب الزيارة باختصار',
  fieldBookingSource: 'مصدر الحجز',
  fieldBookingReference: 'رقم الحجز (اختياري)',
  fieldBookingReferencePlaceholder: '4189XXXXXX',

  purposes: {
    tourism: 'سياحة',
    business: 'عمل',
    family_friends: 'زيارة عائلية أو أصدقاء',
    medical: 'علاج',
    hajj_umrah: 'حج أو عمرة',
    other: 'أخرى',
  },

  bookingSources: {
    booking_com: 'بوكينج (Booking.com)',
    reception: 'استقبال',
  },

  // Section 5: Declaration & WhatsApp Send
  sectionSendTitle: '5. الإقرار والإرسال إلى واتساب الفندق',
  whatsappPrivacyNotice:
    'عند المتابعة، سيتم تجهيز نص بياناتك وفتحه في محادثة واتساب الفندق لتقوم أنت بمراجعته والضغط على إرسال.',
  declarationText:
    'أقرّ بصحة البيانات المذكورة أعلاه وأوافق على مشاركتها مع الفندق المختار عبر واتساب لاستكمال إجراءات التسجيل.',
  sendToWhatsAppButton: 'إرسال إلى واتساب الفندق',
  photoAttachInstruction:
    'ستفتح رسالة بياناتك النصية في واتساب لمراجعتها وإرسالها، ولا يحتفظ التطبيق بأي صورة أو ملف لوثيقتك.',
  messageReadySuccess: 'تم تجهيز الرسالة. أكمل الإرسال داخل واتساب.',
  fallbackTitle: 'تعذر فتح واتساب تلقائياً؟',
  copyMessageButton: 'نسخ نص الرسالة',
  copiedMessage: 'تم نسخ الرسالة',
  receptionNumberLabel: 'رقم واتساب الاستقبال:',
  validationMissingHeader: 'يرجى استكمال المتطلبات التالية قبل فتح واتساب:',
  incompleteBorderNotice:
    'ملاحظة: سيتم إرسال الطلب بحالة «ناقص بيانات» لعدم توفر رقم الحدود، وسيتولى الاستقبال مساعدتك.',

  // Errors
  errInvalidFileType: 'صيغة الملف غير مدعومة. يرجى اختيار صورة بصيغة JPG أو PNG أو WEBP أو HEIC.',
  errFileTooLarge: 'حجم الصورة يتجاوز الحد المسموح (10 ميجابايت).',
  errGeminiNotConfigured:
    'مفتاح خدمة القراءة (GEMINI_API_KEY) غير مضبوط في إعدادات الخادم (Settings > Secrets). يمكنك إضافته أو استكمال البيانات يدوياً أدناه.',
  errGeminiAuth:
    'تعذر التحقق من صلاحية مفتاح Gemini API في إعدادات الخادم (Settings > Secrets). يرجى مراجعته أو استكمال البيانات يدوياً.',
  errGeminiQuotaExceeded:
    'تم استهلاك حصة القراءة المسموحة لمفتاح Gemini API حالياً. يرجى الانتظار قليلاً أو التحقق من الحصة/الفوترة في Settings > Secrets، أو تعبئة البيانات يدوياً.',
  errServerFailed: 'تعذر الاتصال بخدمة قراءة الوثائق حالياً. يمكنك المحاولة مرة أخرى أو استكمال البيانات يدوياً.',
  errRateLimited: 'تم تجاوز عدد محاولات القراءة المسموح مؤقتاً. يرجى الانتظار قليلاً أو تعبئة البيانات يدوياً.',
  errSelectHotelFirst: 'يرجى اختيار الفندق أولاً.',
};

export type TranslationKeys = typeof ar;
