/* ===================================================
   ملف JavaScript: دليل فعاليات الجامعة الافتراضية
   يعمل على كل الصفحات، ويتحقق من وجود العنصر قبل استخدامه
   =================================================== */

// ===== 1) بيانات الفعاليات (وهمية للتجربة) =====
const events = [
  {
    id: 1,
    title: "مهرجان الموسيقى الشرقية",
    date: "2026-11-20",
    time: "19:00",
    place: " القاعة الرئيسية -جامعة اللاذقية",
    category: "موسيقى",
    image: "assets/img/concert.jpg",
    description: "حفل موسيقي يقدمه طلاب الجامعة وفرق الموسيقى الشرقية، في أجواء فنية ممتعة.",
    featured: true
  },
  {
    id: 2,
    title: "معرض الفنون الطلابية",
    date: "2026-11-25",
    time: "10:00",
    place: "المكتبة الرقمية",
    category: "ثقافة",
    image: "assets/img/arts.jpg",
    description: "معرض يضم لوحات ومشاريع فنية لطلاب الجامعة، مع ورش رسم مجانية للمهتمين.",
    featured: true
  },
  {
    id: 3,
    title: "بطولة كرة القدم بين الكليات",
    date: "2026-12-02",
    time: "16:00",
    place: "الملعب الجامعي",
    category: "رياضة",
    image: "assets/img/football.jpg",
    description: "منافسة ودية بين فرق الكليات، تنتهي بحفل توزيع الجوائز على الجميع.",
    featured: true
  },
  {
    id: 4,
    title: "يوم العائلة الجامعي",
    date: "2026-12-10",
    time: "11:00",
    place: "عبر الإنترنت (Zoom)",
    category: "عائلي",
    image: "assets/img/family.jpg",
    description: "يوم مفتوح للطلاب وعائلاتهم، يتضمن مسابقات تعليمية وجلسات تعارف عبر الإنترنت.",
    featured: false
  },
  {
    id: 5,
    title: "ورشة البرمجة للمبتدئين",
    date: "2026-12-15",
    time: "17:30",
    place: "مركز الحاسوب",
    category: "تقنية",
    image: "assets/img/begainers.jpg",
    description: "ورشة تعريفية بأساسيات الويب وبناء أول صفحة بسيطة، لا تحتاج خبرة سابقة.",
    featured: false
  },
  {
    id: 6,
    title: "أمسية الشعر والقصة",
    date: "2027-01-08",
    time: "20:00",
    place: "قاعة المؤتمرات",
    category: "ثقافة",
    image: "assets/img/poem.jpeg",
    description: "أمسية يقرأ فيها طلاب الأدب نصوصهم، يليها نقاش مفتوح مع الحضور.",
    featured: false
  }
];

// ===== 2) دوال مساعدة =====

// تحويل التاريخ من 2026-11-20 إلى نص عربي مقروء
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ar", { year: "numeric", month: "long", day: "numeric" });
}

// إنشاء كرت (Card) لفعالية واحدة، ويُرجع نص HTML
function createCard(ev) {
  return `
    <div class="col-md-6 col-lg-4">
      <div class="card event-card h-100 shadow-sm">
        <img src="${ev.image}" class="card-img-top" alt="${ev.title}">
        <div class="card-body d-flex flex-column">
          <span class="badge bg-warning text-dark align-self-start mb-2">${ev.category}</span>
          <h5 class="card-title">${ev.title}</h5>
          <p class="card-text small text-muted">📅 ${formatDate(ev.date)} &nbsp;·&nbsp; 📍 ${ev.place}</p>
          <p class="card-text">${ev.description.slice(0, 70)}...</p>
          <a href="event.html?id=${ev.id}" class="btn btn-primary btn-sm mt-auto">التفاصيل</a>
        </div>
      </div>
    </div>`;
}

// عرض قائمة من الفعاليات داخل عنصر محدد بالـ id
function renderCards(list, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = list.map(createCard).join("");
}

// ===== 3) السلايدر (الفعاليات البارزة) =====
function initSlider() {
  const slider = document.getElementById("featuredSlider");
  if (!slider) return;

  const featured = events.filter(ev => ev.featured);
  if (featured.length === 0) return;

  // إنشاء الشرائح
  slider.innerHTML = featured.map((ev, index) => `
    <div class="slide ${index === 0 ? "active" : ""}" style="background-image: url('${ev.image}')">
      <div class="slide-caption">
        <h3>${ev.title}</h3>
        <p class="mb-2">📅 ${formatDate(ev.date)} · 📍 ${ev.place}</p>
        <a href="event.html?id=${ev.id}" class="btn btn-warning btn-sm">تفاصيل الفعالية</a>
      </div>
    </div>`).join("");

  const slides = slider.querySelectorAll(".slide");
  let current = 0;

  // إظهار شريحة معينة (مع الدوران عند الوصول للطرفين)
  function showSlide(n) {
    slides.forEach(s => s.classList.remove("active"));
    current = (n + slides.length) % slides.length;
    slides[current].classList.add("active");
  }

  document.getElementById("nextBtn").addEventListener("click", () => showSlide(current + 1));
  document.getElementById("prevBtn").addEventListener("click", () => showSlide(current - 1));

  // تبديل تلقائي كل 5 ثوانٍ
  setInterval(() => showSlide(current + 1), 5000);
}

// ===== 4) الصفحة الرئيسية: أحدث الفعاليات =====
function initHomePage() {
  if (!document.getElementById("latestEvents")) return;

  // ترتيب حسب التاريخ وعرض أول 3 فعاليات
  const latest = [...events].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 3);
  renderCards(latest, "latestEvents");
}

// ===== 5) صفحة كل الفعاليات: البحث والفلترة =====

// تعبئة قائمة المواقع تلقائيًا من بيانات الفعاليات (بدون تكرار)
function fillLocationOptions() {
  const select = document.getElementById("locationFilter");
  const places = [...new Set(events.map(ev => ev.place))];
  places.forEach(place => {
    const option = document.createElement("option");
    option.value = place;
    option.textContent = place;
    select.appendChild(option);
  });
}

function applyFilters() {
  const category = document.getElementById("categoryFilter").value;
  const range = document.getElementById("dateFilter").value;
  const location = document.getElementById("locationFilter").value;
  const search = document.getElementById("searchBox").value.trim();

  const now = new Date();

  const filtered = events.filter(ev => {
    // فلترة حسب التصنيف
    const matchCategory = category === "all" || ev.category === category;

    // فلترة حسب المدة الزمنية (بعد كم يومًا تقع الفعالية)
    const daysLeft = (new Date(ev.date) - now) / (1000 * 60 * 60 * 24);
    const matchDate =
      range === "all" ||
      (range === "week" && daysLeft <= 7) ||
      (range === "month" && daysLeft <= 30) ||
      (range === "later" && daysLeft > 30);

    // فلترة حسب المكان
    const matchLocation = location === "all" || ev.place === location;

    // البحث في العنوان
    const matchSearch = ev.title.includes(search);

    return matchCategory && matchDate && matchLocation && matchSearch;
  });

  renderCards(filtered, "eventsGrid");

  // إظهار رسالة إذا لم توجد نتائج
  document.getElementById("noResults").classList.toggle("d-none", filtered.length > 0);
}

function initEventsPage() {
  const grid = document.getElementById("eventsGrid");
  if (!grid) return;

  fillLocationOptions();

  // إذا جاء المستخدم من زر تصنيف في الصفحة الرئيسية
  const param = new URLSearchParams(window.location.search).get("category");
  if (param) {
    document.getElementById("categoryFilter").value = param;
  }

  // تطبيق الفلترة عند كل تغيير
  document.getElementById("categoryFilter").addEventListener("change", applyFilters);
  document.getElementById("dateFilter").addEventListener("change", applyFilters);
  document.getElementById("locationFilter").addEventListener("change", applyFilters);
  document.getElementById("searchBox").addEventListener("input", applyFilters);

  applyFilters();
}

// ===== 6) صفحة التفاصيل =====
function addToCalendar(ev) {
  // إنشاء ملف ICS بسيط يفتحه التقويم على الجهاز
  const start = ev.date.replace(/-/g, "") + "T" + ev.time.replace(":", "") + "00";
  const content = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    "DTSTART:" + start,
    "SUMMARY:" + ev.title,
    "LOCATION:" + ev.place,
    "DESCRIPTION:" + ev.description,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([content], { type: "text/calendar" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "event.ics";
  link.click();
}

function shareEvent(ev) {
  const url = window.location.href;
  if (navigator.share) {
    navigator.share({ title: ev.title, url: url });
  } else {
    // إذا لم يدعم المتصفح المشاركة، ننسخ الرابط
    navigator.clipboard.writeText(url);
    alert("تم نسخ رابط الفعالية");
  }
}

// نافذة حجز المكان (Modal): تأكيد وهمي للتجربة
function initReserveForm() {
  const form = document.getElementById("reserveForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("reserveName");
    const msg = document.getElementById("reserveAlert");

    if (name.value.trim().length < 3) {
      msg.className = "alert alert-danger";
      msg.textContent = "الرجاء إدخال اسمك الكامل.";
      msg.classList.remove("d-none");
      return;
    }

    msg.className = "alert alert-success";
    msg.textContent = "تم حجز مكانك بنجاح (حجز وهمي للتجربة).";
    msg.classList.remove("d-none");
    form.reset();
  });
}

function initEventDetails() {
  const box = document.getElementById("eventDetails");
  if (!box) return;

  const id = Number(new URLSearchParams(window.location.search).get("id"));
  const ev = events.find(e => e.id === id);

  if (!ev) {
    box.innerHTML = '<div class="alert alert-danger">الفعالية غير موجودة.</div>';
    return;
  }

  document.title = ev.title + " - دليل فعاليات الجامعة الافتراضية";
  document.getElementById("evTitle").textContent = ev.title;
  document.getElementById("evDate").textContent = formatDate(ev.date) + " - " + ev.time;
  document.getElementById("evPlace").textContent = ev.place;
  document.getElementById("evDesc").textContent = ev.description;
  document.getElementById("evImage").src = ev.image;
  document.getElementById("evImage").alt = ev.title;

  // زر أضف للتقويم
  document.getElementById("calendarBtn").addEventListener("click", () => addToCalendar(ev));

  // زر شارك
  document.getElementById("shareBtn").addEventListener("click", () => shareEvent(ev));

  initReserveForm();

  // فعاليات ذات صلة (نفس التصنيف، وليست الفعالية نفسها)
  const related = events.filter(e => e.category === ev.category && e.id !== ev.id).slice(0, 3);
  if (related.length === 0) {
    document.getElementById("relatedGrid").innerHTML = "<p class='text-muted'>لا توجد فعاليات ذات صلة حاليًا.</p>";
  } else {
    renderCards(related, "relatedGrid");
  }
}

// ===== 7) صفحة اتصل بنا: التحقق من النموذج =====
function showAlert(type, message) {
  const box = document.getElementById("formAlert");
  box.className = "alert alert-" + type;   // alert-success أو alert-danger
  box.textContent = message;
  box.classList.remove("d-none");
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // منع إرسال النموذج الافتراضي

    const name = document.getElementById("contactName");
    const email = document.getElementById("contactEmail");
    const message = document.getElementById("contactMessage");

    // 1) التحقق من الاسم
    if (name.value.trim().length < 3) {
      showAlert("danger", "الرجاء إدخال اسم لا يقل عن 3 أحرف.");
      name.focus();
      return;
    }

    // 2) التحقق من صيغة البريد الإلكتروني
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
      showAlert("danger", "صيغة البريد الإلكتروني غير صحيحة.");
      email.focus();
      return;
    }

    // 3) التحقق من طول الرسالة
    if (message.value.trim().length < 10) {
      showAlert("danger", "الرسالة قصيرة جدًا، اكتب 10 أحرف على الأقل.");
      message.focus();
      return;
    }

    // كل شيء صحيح
    showAlert("success", "تم إرسال رسالتك بنجاح، شكرًا لتواصلك معنا!");
    form.reset();
  });
}

// ===== 8) تشغيل الدوال حسب الصفحة الحالية =====
document.addEventListener("DOMContentLoaded", function () {
  initSlider();
  initHomePage();
  initEventsPage();
  initEventDetails();
  initContactForm();
});
