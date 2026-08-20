/* =========================================================
   ADINE POULTRY HEALTH CENTER
   HEALTH MODULE — Vaccination & Medicine
   SUPABASE VERSION
   ========================================================= */

let currentUser = null;
let currentFlock = null;
let currentFarm = null;
let currentHouse = null;
let healthRecords = [];

document.addEventListener("DOMContentLoaded", initHealth);

async function initHealth() {
  try {
    const access = await checkUserAccess();

    if (!access.authenticated) {
      location.href =
        "login.html?message=" +
        encodeURIComponent("ابتدا وارد سامانه شوید.");
      return;
    }

    if (!access.allowed) {
      alert("حساب شما هنوز توسط مدیریت تأیید نشده است.");
      await logoutUser();
      return;
    }

    currentUser = access.user;

    // انتخاب فعلی گله از localStorage (مثل بقیه صفحات)
    const selection = getCurrentSelection();

    if (!selection.flockId) {
      alert("ابتدا یک گله انتخاب کنید.");
      location.href = "flocks.html";
      return;
    }

    // بارگذاری اطلاعات گله از localStorage یا Supabase
    // اگر flocks هنوز در localStorage است:
    const flocks = typeof getFlocks === "function" ? getFlocks() : [];
    currentFlock = flocks.find((f) => f.id === selection.flockId);

    if (!currentFlock) {
      // اگر گله در localStorage نبود، حداقل با flockId ادامه می‌دهیم
      currentFlock = {
        id: selection.flockId,
        farmId: selection.farmId || null,
        houseId: selection.houseId || null,
        flockName: selection.flockName || "گله انتخاب‌شده",
        strain: selection.strain || ""
      };
    }

    const farms = typeof getFarms === "function" ? getFarms() : [];
    const houses = typeof getHouses === "function" ? getHouses() : [];

    currentFarm = farms.find((f) => f.id === currentFlock.farmId) || null;
    currentHouse = houses.find((h) => h.id === currentFlock.houseId) || null;

    const infoEl = document.getElementById("flockInfo");
    if (infoEl) {
      infoEl.textContent = [
        currentFarm?.name || currentFarm?.name || "",
        currentHouse?.name || "",
        currentFlock.flockName || currentFlock.name || "",
        currentFlock.strain || ""
      ]
        .filter(Boolean)
        .join(" | ");
    }

    // تاریخ پیش‌فرض
    const today = todayISO();
    const vDate = document.getElementById("vaccineDate");
    const mStart = document.getElementById("medicineStart");
    if (vDate) vDate.value = today;
    if (mStart) mStart.value = today;

    // محاسبه سن گله
    if (currentFlock.placementDate && vDate) {
      const age = calculateAgeDays(currentFlock.placementDate, today);
      const ageInput = document.getElementById("vaccineAge");
      if (ageInput && age !== null) ageInput.value = age;
    }

    setupForms();
    await loadHealthRecords();
  } catch (err) {
    console.error("Health init error:", err);
    alert("خطا در راه‌اندازی بخش سلامت.");
  }
}

function setupForms() {
  const vaccineForm = document.getElementById("vaccineForm");
  const medicineForm = document.getElementById("medicineForm");

  if (vaccineForm) {
    vaccineForm.addEventListener("submit", saveVaccination);
  }
  if (medicineForm) {
    medicineForm.addEventListener("submit", saveMedicine);
  }
}

/* =========================================================
   LOAD
========================================================= */

async function loadHealthRecords() {
  const tbody = document.getElementById("healthTable");
  if (tbody) {
    tbody.innerHTML = `
      <tr><td colspan="5">در حال دریافت سوابق...</td></tr>
    `;
  }

  const { data, error } = await supabaseClient
    .from("health_records")
    .select("*")
    .eq("owner_id", currentUser.id)
    .eq("flock_id", String(currentFlock.id))
    .order("record_date", { ascending: false });

  if (error) {
    console.error("Load health error:", error);
    if (tbody) {
      tbody.innerHTML = `
        <tr><td colspan="5">خطا در دریافت سوابق: ${escapeHTML(error.message)}</td></tr>
      `;
    }
    return;
  }

  healthRecords = data || [];
  renderHealth();
}

/* =========================================================
   SAVE VACCINATION
========================================================= */

async function saveVaccination(event) {
  event.preventDefault();

  const btn = event.target.querySelector('button[type="submit"]');
  if (btn) {
    btn.disabled = true;
    btn.textContent = "در حال ذخیره...";
  }

  try {
    const payload = {
      owner_id: currentUser.id,
      farm_id: currentFlock.farmId || null,
      house_id: currentFlock.houseId || null,
      flock_id: String(currentFlock.id),
      flock_name: currentFlock.flockName || currentFlock.name || null,
      type: "vaccination",
      record_date: document.getElementById("vaccineDate").value,
      age_days: Number(document.getElementById("vaccineAge").value || 0),
      disease: document.getElementById("vaccineDisease").value || null,
      name: document.getElementById("vaccineName").value.trim(),
      manufacturer: document.getElementById("vaccineManufacturer").value.trim() || null,
      route: document.getElementById("vaccineRoute").value || null,
      notes: document.getElementById("vaccineNotes").value.trim() || null
    };

    if (!payload.name || !payload.record_date) {
      alert("تاریخ و نام واکسن الزامی است.");
      return;
    }

    const { error } = await supabaseClient
      .from("health_records")
      .insert(payload);

    if (error) {
      console.error("Save vaccine error:", error);
      alert("ذخیره واکسیناسیون انجام نشد:\n" + error.message);
      return;
    }

    event.target.reset();
    document.getElementById("vaccineDate").value = todayISO();
    await loadHealthRecords();
    alert("واکسیناسیون با موفقیت ثبت شد.");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "ثبت واکسیناسیون";
    }
  }
}

/* =========================================================
   SAVE MEDICINE
========================================================= */

async function saveMedicine(event) {
  event.preventDefault();

  const btn = event.target.querySelector('button[type="submit"]');
  if (btn) {
    btn.disabled = true;
    btn.textContent = "در حال ذخیره...";
  }

  try {
    const payload = {
      owner_id: currentUser.id,
      farm_id: currentFlock.farmId || null,
      house_id: currentFlock.houseId || null,
      flock_id: String(currentFlock.id),
      flock_name: currentFlock.flockName || currentFlock.name || null,
      type: "medicine",
      record_date: document.getElementById("medicineStart").value,
      end_date: document.getElementById("medicineEnd").value || null,
      name: document.getElementById("medicineName").value.trim(),
      active_ingredient: document.getElementById("medicineActive").value.trim() || null,
      reason: document.getElementById("medicineReason").value.trim() || null,
      route: document.getElementById("medicineRoute").value || null,
      dose: document.getElementById("medicineDose").value.trim() || null,
      duration: document.getElementById("medicineDuration").value.trim() || null,
      notes: document.getElementById("medicineNotes").value.trim() || null
    };

    if (!payload.name || !payload.record_date) {
      alert("تاریخ شروع و نام دارو الزامی است.");
      return;
    }

    const { error } = await supabaseClient
      .from("health_records")
      .insert(payload);

    if (error) {
      console.error("Save medicine error:", error);
      alert("ذخیره درمان انجام نشد:\n" + error.message);
      return;
    }

    event.target.reset();
    document.getElementById("medicineStart").value = todayISO();
    await loadHealthRecords();
    alert("درمان با موفقیت ثبت شد.");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "ثبت درمان";
    }
  }
}

/* =========================================================
   DELETE
========================================================= */

async function deleteHealthRecord(id) {
  if (!confirm("آیا از حذف این رکورد مطمئن هستید؟")) return;

  const { error } = await supabaseClient
    .from("health_records")
    .delete()
    .eq("id", id)
    .eq("owner_id", currentUser.id);

  if (error) {
    console.error("Delete health error:", error);
    alert("حذف انجام نشد:\n" + error.message);
    return;
  }

  await loadHealthRecords();
}

/* =========================================================
   RENDER
========================================================= */

function renderHealth() {
  const table = document.getElementById("healthTable");
  if (!table) return;

  if (!healthRecords.length) {
    table.innerHTML = `
      <tr><td colspan="5">هنوز رکوردی ثبت نشده است.</td></tr>
    `;
    return;
  }

  const diseaseMap = {
    ND: "نیوکاسل",
    IB: "برونشیت عفونی",
    IBD: "گامبورو",
    AI: "آنفلوانزا",
    ILT: "لارنگوتراکئیت",
    Marek: "مارک",
    Other: "سایر"
  };

  const routeMap = {
    water: "آب آشامیدنی",
    spray: "اسپری",
    eye: "قطره چشمی",
    wing: "بال‌زدن",
    injection: "تزریقی",
    feed: "دان",
    oral: "خوراکی",
    other: "سایر"
  };

  table.innerHTML = healthRecords
    .map((r) => {
      const typeLabel = r.type === "vaccination" ? "واکسیناسیون" : "دارو / درمان";
      const item = r.name || "-";
      let note = "-";

      if (r.type === "vaccination") {
        note =
          (r.disease ? diseaseMap[r.disease] || r.disease : "") +
          (r.route ? " | " + (routeMap[r.route] || r.route) : "") +
          (r.notes ? " | " + r.notes : "");
      } else {
        note =
          (r.reason || "") +
          (r.dose ? " | " + r.dose : "") +
          (r.route ? " | " + (routeMap[r.route] || r.route) : "") +
          (r.notes ? " | " + r.notes : "");
      }

      note = note.replace(/^\s*\|\s*|\s*\|\s*$/g, "").trim() || "-";

      return `
        <tr>
          <td>${escapeHTML(r.record_date || "-")}</td>
          <td>${typeLabel}</td>
          <td>${escapeHTML(item)}</td>
          <td>${escapeHTML(note)}</td>
          <td>
            <button type="button" class="btn btn-danger"
              onclick="deleteHealthRecord('${r.id}')">
              حذف
            </button>
          </td>
        </tr>
      `;
    })
    .join("");
}

// برای onclick در HTML
window.deleteHealthRecord = deleteHealthRecord;
