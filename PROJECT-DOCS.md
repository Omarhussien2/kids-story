# خيال مصر - Khayal Masr
## دليل المشروع الكامل

---

## 1. نبذة عن المشروع

**خيال مصر** هو منصة ويب عربية لتوليد قصص أطفال مخصصة باستخدام الذكاء الاصطناعي. يقوم الوالدان بإدخال بيانات طفلهما (الاسم، العمر، النوع، التحدي) فيحصلون على قصة فريدة مكتوبة بالعامية المصرية يكون طفلهم هو بطلها. بعدها يمكنهم طلب نسخة مطبوعة فاخرة تُوصَل لهم في المنزل.

---

## 2. المميزات

### مميزات المستخدم
| الميزة | الوصف |
|--------|-------|
| توليد قصص بالذكاء الاصطناعي | قصص مخصصة باسم الطفل وعمره وشخصيته باستخدام Gemini AI |
| كتابة بالعامية المصرية | القصص تُكتَب بلهجة مصرية دافئة ومألوفة للأطفال |
| رفع صورة الطفل | يمكن رفع صورة الطفل لتضمينها في القصة |
| 6 تحديات تعليمية | شجاعة، صدق، مساعدة، نظافة، دراسة، أو تحدي مخصص |
| معاينة القصة فوراً | القصة تظهر مباشرة بعد التوليد مع تنسيق Markdown |
| نظام دفع عبر إنستا باي | تحويل إنستا باي مع رفع صورة الإيصال |
| تتبع حالة الطلب | 4 مراحل: تأليف ← دفع ← طباعة ← شحن |
| مكتبة نماذج | عرض نماذج من القصص السابقة |
| تواصل واتساب | زر تواصل مباشر عبر واتساب |

### مميزات لوحة التحكم (الأدمن)
| الميزة | الوصف |
|--------|-------|
| جدول الطلبات | عرض كل القصص المولّدة مع بيانات الأطفال |
| إحصائيات | إجمالي القصص، بانتظار الدفع، قيد الطباعة، تم التوصيل |
| تحديث حالة الطلب | تغيير حالة كل قصة (ready → paid → printing → shipped) |
| عرض إثبات الدفع | رؤية صورة التحويل المرفقة من العميل |

---

## 3. البنية التقنية

### التقنيات المستخدمة
```
Frontend:  React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion
Backend:   Vercel Serverless Functions (TypeScript)
Database:  Supabase (PostgreSQL) + Supabase Storage
AI:        Google Gemini 2.0 Flash (عبر @google/generative-ai)
Hosting:   Vercel (Static + Serverless)
Payments:  إنستا باي (offline - رفع صورة إيصال)
Contact:   واتساب (رابط مباشر)
```

### هيكل المشروع
```
khayal_masr_project/
│
├── frontend/                    # التطبيق الرئيسي
│   ├── api/
│   │   └── index.ts            # Serverless API (Vercel Functions)
│   │                            #   - توليد القصص (Gemini AI)
│   │                            #   - رفع الصور (Supabase Storage)
│   │                            #   - إدارة المدفوعات
│   │                            #   - لوحة تحكم الأدمن
│   │
│   ├── src/
│   │   ├── App.tsx             # المكوّن الرئيسي + التوجيه بين الصفحات
│   │   ├── api.ts              # طبقة الاتصال بالـ API
│   │   ├── main.tsx            # نقطة الدخول
│   │   ├── index.css           # التنسيقات العامة
│   │   ├── useSSE.ts           # أداة الـ Streaming
│   │   │
│   │   ├── components/ui/      # مكوّنات UI قابلة لإعادة الاستخدام
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── table.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── spinner.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── label.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── switch.tsx
│   │   │   └── empty.tsx
│   │   │
│   │   ├── features/           # مكوّنات الميزات الرئيسية
│   │   │   ├── StoryMagic.tsx       # الـ Wizard + المعرض + نتيجة القصة
│   │   │   ├── AdminDashboard.tsx   # لوحة تحكم الأدمن
│   │   │   ├── LandingPage.tsx      # صفحة هبوط بديلة
│   │   │   ├── StoryBuilder.tsx     # بنّاء قصص بديل (مع streaming)
│   │   │   └── OrderFlow.tsx        # الدفع + تتبع الطلب
│   │   │
│   │   └── lib/
│   │       └── utils.ts        # أدوات مساعدة (cn function)
│   │
│   ├── public/assets/          # الصور والأيقونات
│   │   ├── hero-magical-book.jpg
│   │   ├── hero-egyptian-princess.jpg
│   │   ├── hero-reading-family-2.jpg
│   │   ├── hero-reading-mother-1.jpg
│   │   ├── card-book-open.jpg
│   │   ├── card-book-stack.jpg
│   │   ├── card-character-1.jpg
│   │   ├── bg-paper-texture.jpg
│   │   ├── bg-magical-mesh.jpg
│   │   ├── bg-starry-night.jpg
│   │   ├── texture-paper.jpg
│   │   ├── logo-instapay-eg.png
│   │   ├── logo-vercel.png
│   │   ├── icon-pyramid.svg
│   │   └── manifest.json
│   │
│   ├── vercel.json             # إعدادات Vercel (routing + rewrites)
│   ├── vite.config.ts          # إعدادات Vite
│   ├── tailwind.config.js      # إعدادات Tailwind CSS
│   ├── postcss.config.js       # إعدادات PostCSS
│   ├── package.json            # Dependencies
│   └── index.html              # HTML الرئيسي
│
├── backend/                    # Python Backend (للاستخدام المحلي/التطوير)
│   ├── main.py                 # دوال الـ RPC الأصلية
│   ├── db.py                   # SQLite database initialization
│   ├── requirements.txt        # Python dependencies
│   └── .env.example            # قالب متغيرات البيئة
│
├── schema.sql                  # SQL Schema لـ Supabase
├── screenshots/                # لقطات شاشة للمشروع
├── .gitignore                  # ملفات مستثناة من Git
└── README.md                   # ملف التوثيق
```

---

## 4. قاعدة البيانات

### الجداول (Supabase PostgreSQL)

```sql
-- جدول القصص
stories
├── id                  (SERIAL PRIMARY KEY)
├── child_name          (TEXT)           -- اسم الطفل
├── age                 (INTEGER)        -- العمر
├── gender              (TEXT)           -- النوع (ذكر/أنثى)
├── challenge_type      (TEXT)           -- نوع التحدي
├── custom_challenge_text (TEXT)         -- نص التحدي المخصص
├── content             (TEXT)           -- محتوى القصة المولّدة
├── photo_url           (TEXT)           -- رابط صورة الطفل
├── status              (TEXT)           -- الحالة: generating → ready → paid → printing → shipped
└── created_at          (TIMESTAMP)

-- جدول المدفوعات
payments
├── id                  (SERIAL PRIMARY KEY)
├── story_id            (INTEGER FK)     -- ربط بالقصة
├── screenshot_url      (TEXT)           -- رابط صورة إيصال الدفع
├── amount              (REAL)           -- المبلغ
├── status              (TEXT)           -- pending/confirmed
└── created_at          (TIMESTAMP)

-- جدول النماذج
samples
├── id                  (SERIAL PRIMARY KEY)
├── title               (TEXT)           -- عنوان النموذج
├── file_url            (TEXT)           -- رابط الملف
├── type                (TEXT)           -- نوع الملف (image/pdf)
└── created_at          (TIMESTAMP)
```

### Supabase Storage
- **Bucket:** `khayal-assets` (Public)
- يحتوي على: صور الأطفال + صور إيصالات الدفع

---

## 5. واجهات الـ API

كل الـ API endpoints تمر عبر `POST /api` مع JSON body:

### توليد القصة
```
POST /api
{
  "func": "generate_story_streaming",
  "args": {
    "child_name": "يوسف",
    "age": 5,
    "gender": "ذكر",
    "challenge_type": "شجاعة",
    "custom_text": ""
  }
}
→ Response: { id, content, status, child_name, age, gender, challenge_type, created_at }
```

### رفع صورة الطفل
```
POST /api
{
  "func": "upload_child_photo",
  "args": { "story_id": 1, "image_base64": "data:image/png;base64,..." }
}
→ Response: { ...story with photo_url }
```

### إرسال الدفع
```
POST /api
{
  "func": "submit_payment",
  "args": { "story_id": 1, "screenshot_base64": "data:image/png;base64,...", "amount": 150.0 }
}
→ Response: { ...story with status: "paid" }
```

### تفاصيل القصة
```
POST /api
{
  "func": "get_story_details",
  "args": { "story_id": 1 }
}
→ Response: { ...story + payment info }
```

### جلب النماذج
```
POST /api
{ "func": "get_samples" }
→ Response: [ { id, title, file_url, type, created_at }, ... ]
```

### أدمن: جلب كل الطلبات
```
POST /api
{ "func": "admin_get_orders" }
→ Response: [ { ...story }, ... ]
```

### أدمن: تحديث حالة الطلب
```
POST /api
{
  "func": "admin_update_status",
  "args": { "story_id": 1, "status": "printing" }
}
→ Response: { ...updated story }
```

---

## 6. ورك فلو المستخدم (User Journey)

### المرحلة 1: الصفحة الرئيسية (Landing Page)

```
المستخدم يفتح الموقع
        │
        ▼
┌─────────────────────────────────────┐
│         صفحة خيال مصر               │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  Hero Section               │    │
│  │  "كل طفل هو بطل قصته        │    │
│  │   السحرية"                   │    │
│  │                              │    │
│  │  [اصنع القصة الآن]          │    │
│  │  [شاهد النماذج]             │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  مكتبة خيال (Gallery)       │    │
│  │  عرض نماذج القصص            │    │
│  └─────────────────────────────┘    │
│                                     │
│  Footer: [واتساب] [الإدارة]       │
└─────────────────────────────────────┘
```

### المرحلة 2: معالج إنشاء القصة (3 خطوات)

```
الخطوة 1: رفع صورة الطفل
┌─────────────────────────────┐
│  أهلاً بك في عالم الخيال     │
│                              │
│     ┌──────────────┐        │
│     │  📷 صورة     │        │
│     │  الطفل       │        │
│     └──────────────┘        │
│     [اختر صورة]             │
│                              │
│              [التالي →]      │
└─────────────────────────────┘
              │
              ▼
الخطوة 2: بيانات البطل
┌─────────────────────────────┐
│  بيانات البطل                │
│                              │
│  اسم الطفل: [يوسف        ]  │
│  العمر: [5 سنوات ▼]        │
│  النوع: [ولد] [بنت]         │
│                              │
│  [← السابق]    [التالي →]   │
└─────────────────────────────┘
              │
              ▼
الخطوة 3: موضوع المغامرة
┌─────────────────────────────┐
│  موضوع المغامرة              │
│                              │
│  التحدي:                     │
│  ┌──────────┐ ┌──────────┐  │
│  │ الشجاعة  │ │ الصدق    │  │
│  └──────────┘ └──────────┘  │
│  ┌──────────┐ ┌──────────┐  │
│  │ المساعدة│ │ النظافة  │  │
│  └──────────┘ └──────────┘  │
│  ┌──────────┐ ┌──────────┐  │
│  │ الدراسة │ │ مخصص...  │  │
│  └──────────┘ └──────────┘  │
│                              │
│  [← السابق]  [★ ابتدأ السحر]│
└─────────────────────────────┘
```

### المرحلة 3: توليد القصة

```
┌─────────────────────────────────────┐
│         ✨ جاري تأليف القصة          │
│                                      │
│     🪄 (عصا سحرية متحركة)           │
│                                      │
│     "نجمع النجوم لمغامرتك..."       │
│                                      │
│     ████████████░░░░░ 65%            │
│                                      │
│     جاري تأليف القصة خصيصاً ليوسف... │
└─────────────────────────────────────┘
           │ (10-30 ثانية)
           ▼
┌─────────────────────────────────────┐
│  القصة جاهزة!                        │
└─────────────────────────────────────┘
```

### المرحلة 4: معاينة القصة والدفع

```
┌────────────────────────────────────────────────────────┐
│  تتبع الطلب:                                           │
│  ● تأليف ─── ● دفع ─── ○ طباعة ─── ○ شحن            │
├─────────────────────────────┬──────────────────────────┤
│                             │                          │
│  ┌─────────────────────┐   │   نسخة يوسف              │
│  │                     │   │   التحدي: شجاعة          │
│  │   محتوى القصة       │   │   العمر: 5 سنوات        │
│  │   بالعامية المصرية  │   │                          │
│  │   (Markdown)        │   │   150 EGP                │
│  │                     │   │   شامل الطباعة والتوصيل  │
│  │                     │   │                          │
│  │                     │   │   [اطلب النسخة المطبوعة]  │
│  └─────────────────────┘   │                          │
│                             │   [إنشاء قصة جديدة]      │
└─────────────────────────────┴──────────────────────────┘
```

### المرحلة 5: الدفع عبر إنستا باي

```
┌──────────────────────────────────────────────┐
│           تأكيد الدفع                         │
│                                               │
│  ┌──────────────────────────────────────┐    │
│  │  [إنستا باي Logo]                    │    │
│  │                                       │    │
│  │  عنوان الدفع (IPA):                  │    │
│  │  khayal@instapay                      │    │
│  │                                       │    │
│  │  ┌─────────────┐                     │    │
│  │  │  QR Code    │                     │    │
│  │  └─────────────┘                     │    │
│  └──────────────────────────────────────┘    │
│                                               │
│  أرفق صورة التحويل:                          │
│  ┌──────────────────────────────────────┐    │
│  │   📤 اضغط هنا لرفع الصورة            │    │
│  └──────────────────────────────────────┘    │
│                                               │
│  [رجوع]           [✓ تأكيد إرسال الدفع]      │
└──────────────────────────────────────────────┘
```

### المرحلة 6: بعد الدفع

```
┌──────────────────────────────────────┐
│  ✅ تم تأكيد الطلب                    │
│                                       │
│  جاري المراجعة والبدء في الطباعة     │
│                                       │
│  تتبع: تأليف → دفع → طباعة → شحن    │
└──────────────────────────────────────┘
```

---

## 7. ورك فلو الأدمن

```
الأدمن يضغط "الإدارة" في Footer
        │
        ▼
┌─────────────────────┐
│ أدخل كلمة المرور:   │
│ [**************]    │
└─────────────────────┘
        │ password = ADMIN_PASSWORD
        ▼
┌──────────────────────────────────────────────────────────┐
│  📊 لوحة تحكم خيال مصر                          [تحديث]  │
│                                                           │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │إجمالي   │ │بانتظار  │ │قيد      │ │تم       │       │
│  │القصص: 15│ │الدفع: 3 │ │الطباعة:2│ │التوصيل:8│       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
│                                                           │
│  جدول الطلبات:                                            │
│  ┌─────┬──────┬────────┬────────┬──────────┬────────┐   │
│  │ #   │الاسم │التاريخ │الحالة  │تحديث     │الدفع   │   │
│  ├─────┼──────┼────────┼────────┼──────────┼────────┤   │
│  │ 12  │يوسف  │4/10    │READY   │[▼ تحديد]│عرض صور│   │
│  │ 11  │مريم  │4/9     │PAID    │[▼ تحديد]│عرض صور│   │
│  │ 10  │أحمد  │4/8     │PRINTING│[▼ تحديد]│عرض صور│   │
│  └─────┴──────┴────────┴────────┴──────────┴────────┘   │
│                                                           │
│  [خروج]                                                   │
└──────────────────────────────────────────────────────────┘
```

---

## 8. تدفق البيانات (Data Flow)

```
المستخدم                    Frontend (React)              Vercel Serverless           Supabase          Google Gemini
   │                              │                            │                        │                    │
   │  1. يملأ البيانات            │                            │                        │                    │
   │ ──────────────────────────►  │                            │                        │                    │
   │                              │  2. POST /api              │                        │                    │
   │                              │  {func: "generate_         │                        │                    │
   │                              │   story_streaming"}        │                        │                    │
   │                              │ ────────────────────────►  │                        │                    │
   │                              │                            │  3. INSERT story       │                    │
   │                              │                            │  (status: generating)  │                    │
   │                              │                            │ ──────────────────────►│                    │
   │                              │                            │                        │                    │
   │                              │                            │  4. Generate prompt    │                    │
   │                              │                            │ ──────────────────────────────────────────►│
   │                              │                            │                        │                    │
   │                              │                            │  5. Story content      │                    │
   │                              │                            │ ◄──────────────────────────────────────────│
   │                              │                            │                        │                    │
   │                              │                            │  6. UPDATE story       │                    │
   │                              │                            │  (content + status:    │                    │
   │                              │                            │   ready)               │                    │
   │                              │                            │ ──────────────────────►│                    │
   │                              │                            │                        │                    │
   │                              │  7. Story result           │                        │                    │
   │                              │ ◄────────────────────────  │                        │                    │
   │  8. عرض القصة                │                            │                        │                    │
   │ ◄──────────────────────────  │                            │                        │                    │
   │                              │                            │                        │                    │
   │  9. رفع صورة الدفع           │                            │                        │                    │
   │ ──────────────────────────►  │  10. POST /api             │                        │                    │
   │                              │  {func: "submit_payment"}  │                        │                    │
   │                              │ ────────────────────────►  │                        │                    │
   │                              │                            │  11. Upload to Storage │                    │
   │                              │                            │ ──────────────────────►│                    │
   │                              │                            │                        │                    │
   │                              │                            │  12. INSERT payment    │                    │
   │                              │                            │      UPDATE status=paid│                    │
   │                              │                            │ ──────────────────────►│                    │
```

---

## 9. نظام التخزين المؤقت (Caching)

الـ Frontend يستخدم `sessionStorage` لتخزين نتائج الـ API:

- **مفتاح التخزين:** `rpc:{func_name}:{args_json}`
- **عند الطلب:** يرجع البيانات المخزنة فوراً ثم يحدّثها في الخلفية
- **الإلغاء:** `invalidateCache()` يمسح البيانات بعد العمليات (مثل الدفع أو تحديث الحالة)

---

## 10. حالات القصة (Story Status Lifecycle)

```
generating ──► ready ──► paid ──► printing ──► shipped
    │            │         │          │            │
    │            │         │          │            │
  AI يولّد   القصة     العميل     جاري       وصل الطفل
  القصة      جاهزة    دفع       الطباعة     الكتاب
```

---

## 11. متغيرات البيئة المطلوبة

| المتغير | الوصف | مثال |
|---------|-------|------|
| `SUPABASE_URL` | رابط مشروع Supabase | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | مفتاح Supabase العام | `eyJhbG...` |
| `ADMIN_PASSWORD` | كلمة سر لوحة التحكم | `admin123` |
| `WHATSAPP_NUMBER` | رقم واتساب للتواصل | `201152806034` |
| `NEXTTOKEN_API_KEY` أو `GEMINI_API_KEY` | مفتاح Google Gemini AI | `AIza...` |

---

## 12. التثبيت والتشغيل محلياً

```bash
# 1. استنساخ المشروع
git clone https://github.com/Omarhussien2/kids-story.git
cd kids-story

# 2. إعداد Frontend
cd frontend
npm install

# 3. تشغيل محلي
npm run dev
# الموقع يعمل على: http://localhost:5173

# 4. بناء للإنتاج
npm run build
```

---

## 13. النشر على Vercel

1. ربط GitHub repo بـ Vercel
2. Root Directory = `frontend`
3. Framework = `Vite`
4. Build Command = `npm run build`
5. Output Directory = `dist`
6. إضافة Environment Variables
7. Deploy

---

## 14. الروابط المهمة

| الوصف | الرابط |
|-------|-------|
| GitHub Repo | https://github.com/Omarhussien2/kids-story |
| الموقع على Vercel | https://kids-story-omarhussien2s-projects.vercel.app |
| Supabase Dashboard | https://supabase.com/dashboard |
| Google AI Studio (API Key) | https://aistudio.google.com/apikey |
| Vercel Dashboard | https://vercel.com/omarhussien2s-projects/kids-story |

---

_آخر تحديث: أبريل 2026_
