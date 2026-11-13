export const ar = {
  appTitle: 'تجهيز بيانات النزيل',
  appSubtitle: 'تحضير بيانات تسجيل الدخول وإرسالها مباشرةً إلى واتساب الفندق',
  langToggle: 'English',
  clearMyData: 'مسح بياناتي',
  clearedSuccess: 'تم مسح جميع الصور والبيانات من الجلسة الحالية.',

  // Section 1: Hotel
  sectionHotelTitle: '1. اختيار الفندق',
  sectionHotelDesc: 'اختر الفرع الذي تقيم فيه لإرسال البيانات إلى استقباله مباشرة.',
  branchReady: 'واتساب الاستقبال جاهز',
  branchNotConfigured: 'غير مضبوط',
  branchNotConfiguredBanner:
    'لم يُضبط رقم واتساب الاستقبال لهذا الفرع بعد. تم تعطيل الإرسال لحين ضبط الرقم من إعدادات النظام.',

  // Section 2: Document capture
  sectionDocTitle: '2. تصوير الوثيقة',
  sectionDocDesc: 'صوّر الهوية الوطنية أو الإقامة أو جواز السفر أو سجل الأسرة لاستخراج البيانات الظاهرة تلقائياً.',
  frontSideLabel: 'الوجه الأمامي للوثيقة',
  backSideLabel: 'الوجه الخلفي أو صفحة إضافية (اختياري)',
  takePhoto: 'تصوير الوثيقة',
  chooseFromGallery: 'اختيار من الألبوم',
  retakePhoto: 'إعادة التصوير',
  deletePhoto: 'حذف',
  addBackSide: 'إضافة الوجه الخلفي / صفحة إضافية',
  geminiPrivacyNotice:
    'تنبيه الخصوصية: ستُعالج صورة الوثيقة مؤقتاً بواسطة Google Gemini لاستخراج البيانات الظاهرة فقط، ولن تُحفظ الصورة أو البيانات في التخزين الدائم.',
  geminiConsentLabel: 'أوافق على معالجة صورة الوثيقة بواسطة Google Gemini لاستخراج البيانات.',
  analyzeNowButton: 'بدء قراءة الوثيقة',
  readingDocument: 'جارٍ قراءة الوثيقة...',
  readingComplete:
    'تم استخراج البيانات الظاهرة ومسح صورة الوثيقة فوراً لحماية خصوصيتك. يرجى مراجعة البيانات واستكمال الحقول الناقصة.',
  readingFailedFallback:
    'تعذرت قراءة الوثيقة بوضوح. يمكنك إعادة التصوير بإضاءة أفضل أو استكمال البيانات يدوياً أدناه.',
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
  fieldNamePartsTitle: 'أجزاء الاسم المستخرجة (اختياري)',
  fieldFirstName: 'الاسم الأول',
  fieldFatherName: 'اسم الأب',
  fieldGrandfatherName: 'اسم الجد',
  fieldFamilyName: 'اسم العائلة',
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
  dateHelperText: 'أدخل التاريخ بصيغة سنة/شهر/يوم مثل 1413/02/16 (هجري) أو 1992-08-15 (ميلادي).',
  fieldCalendar: 'التقويم',
  calendarSelect: 'اختر التقويم',
  calendarHijri: 'هجري',
  calendarGregorian: 'ميلادي',
  calendarUnknown: 'غير محدد',
  fieldExpiryDate: 'تاريخ الانتهاء',
  fieldExpiryCalendar: 'تقويم الانتهاء',
  fieldVersionNumber: 'رقم النسخة',
  fieldVersionPlaceholder: '1 / 2',
  versionHelperText: 'رقم النسخة مطلوب للهوية الوطنية والإقامة. إذا لم يظهر، أدخله يدوياً أو أضف صورة الوجه الخلفي.',
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
  familySectionNote:
    'اختر النزيل الرئيسي والمرافقين الفعليين فقط. يلزم تسجيل تاريخ الميلاد لكل نزيل ومرافق قبل الإرسال، وقد يطلب الاستقبال وثيقة إضافية لاستكمال التسجيل.',
  familySelectPrimary: 'اختيار كنزيل رئيسي',
  familyIsPrimary: 'النزيل الرئيسي',
  familyAccompanying: 'مرافق فعلي في الإقامة',
  familyAddMember: 'إضافة فرد يدوياً',
  familyRemoveMember: 'إزالة',
  familyMemberName: 'اسم الفرد',
  familyMemberDocNum: 'رقم الهوية / السجل للفرد (إن وجد)',
  familyMemberRelation: 'صلة القرابة',
  familyMemberDob: 'تاريخ الميلاد (إلزامي للمرافق)',
  familyMemberDobRequired: 'يلزم إدخال تاريخ الميلاد للمرافق',
  familyMemberNameRequired: 'يلزم إدخال اسم المرافق',
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
    'ستفتح رسالة بياناتك في واتساب، ولن يحتفظ التطبيق بأي نسخة من الصورة. إذا طلب الاستقبال صورة الوثيقة، أرفقها مباشرة من جهازك داخل المحادثة ثم اضغط إرسال.',
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
