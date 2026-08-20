/* =========================================================
   ADINE — HEALTH (Vaccination & Medicine) — SUPABASE
   ========================================================= */

let currentUser = null;
let currentFlock = null;
let currentFarm = null;
let currentHouse = null;
let healthRecords = [];

document.addEventListener("DOMContentLoaded", initHealth);

async function initHealth() {
  try {
    // بررسی وجود supabase
    if (typeof supabaseClient === "undefined") {
      alert("خطا: supabaseClient لود نشده. فایل supabase-config.js را چک کنید.");
      return;
    }

    // اول Session را چک می‌کنیم (قابل‌اطمینان‌تر از getUser)
    const { data: sessionData, error: sessionError } =
      await supabaseClient.auth.getSession();

    if (sessionError) {
      console.error("Session error:", sessionError);
    }

    if (!sessionData?.session) {
      location.href =
        "login.html?message=" +
        encodeURIComponent("ابتدا وارد سامانه شوید.");
      return;
    }

    currentUser = sessionData.session.user;

    // پروفایل اختیاری — اگر نبود بیرون نینداز
    let profile = null;
    try {
      if (typeof getCurrentProfile === "function") {
        profile = await getCurrentProfile();
      }
    } catch (e) {
      console.warn("Profile load warning:", e);
    }

    // انتخاب گله
    const selection =
      typeof getCurrentSelection === "function"
        ? getCurrentSelection()
        : {};

    if (!selection.flockId) {
      alert("ابتدا از بخش «سالن و گله» یک گله انتخاب کنید.");
      location.href = "flocks.html";
      return;
    }

    const flocks =
      typeof getFlocks === "function" ? getFlocks() : [];
    const farms =
      typeof getFarms === "function" ? getFarms() : [];
    const houses =
      typeof getHouses === "function" ? getHouses() : [];

    currentFlock =
      flocks.find((f) => f.id === selection.flockId) || {
        id: selection.flockId,
        farmId: selection.farmId || null,
        houseId: selection.houseId || null,
        flockName: selection.flockName || "گله انتخاب‌شده",
        strain: selection.strain || "",
        placementDate: selection.placementDate || ""
      };

    currentFarm =
      farms.find((f) => f.id === currentFlock.farmId) || null;
    currentHouse =
      houses.find((h) => h.id === currentFlock.houseId) || null;

    const infoEl = document.getElementById("flockInfo");
    if (infoEl) {
      infoEl.textContent = [
        currentFarm?.name || "",
        currentHouse?.name || "",
        currentFlock.flockName || currentFlock.name || "",
        currentFlock.strain || ""
      ]
        .filter(Boolean)
        .join(" | ");
    }

    const today =
      typeof todayISO === "function"
        ? todayISO()
        : new Date().toISOString().slice(0, 10);

    const vDate = document.getElementById("vaccineDate");
    const mStart = document.getElementById("medicineStart");
    if (vDate) vDate.value = today;
    if (mStart) mStart.value = today;

    if (
      currentFlock.placementDate &&
      typeof calculateAgeDays === "function"
    ) {
      const age = calculateAgeDays(
        currentFlock.placementDate,
        today
      );
      const ageInput = document.getElementById("vaccineAge");
      if (ageInput && age !== null) ageInput.value = age;
    }

    setupForms();
    await loadHealthRecords();
  } catch (err) {
    console.error("Health init error:", err);
    alert("خطا در راه‌اندازی بخش سلامت:\n" + (err.message || err));
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

async function loadHealthRecords() {
  const tbody = document.getElementById("healthTable");
  if (tbody) {
    tbody.innerHTML =
      '<tr><td colspan="5">در حال دریافت سوابق...</td></tr>';
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
      tbody.innerHTML =
        "<tr><td colspan=\"5\">خطا در دریافت سوابق: " +
        escapeSafe(error.message) +
        "</td></tr>";
    }
    return;
  }

  healthRecords = data || [];
  renderHealth();
}

async function saveVaccination(event) {
  event.preventDefault();

  const btn = event.target.querySelector('button[type="submit"]');
  if (btn) {
    btn.disabled = true;
    btn.textContent = "در حال ذخیره...";
  }

  try {
    const name = document.getElementById("vaccineName").value.trim();
    const record_date = document.getElementById("vaccineDate").value;

    if (!name || !record_date) {
      alert("تاریخ و نام واکسن الزامی است.");
      return;
    }

    const payload = {
      owner_id: currentUser.id,
      farm_id: currentFlock.farmId || null,
      house_id: currentFlock.houseId || null,
      flock_id: String(currentFlock.id),
      flock_name:
        currentFlock.flockName || currentFlock.name || null,
      type: "vaccination",
      record_date,
      age_days: Number(
        document.getElementById("vaccineAge").value || 0
      ),
      disease:
        document.getElementById("vaccineDisease").value || null,
      name,
      manufacturer:
        document.getElementById("vaccineManufacturer").value.trim() ||
        null,
      route:
        document.getElementById("vaccineRoute").value || null,
      notes:
        document.getElementById("vaccineNotes").value.trim() || null
    };

    const { error } = await supabaseClient
      .from("health_records")
      .insert(payload);

    if (error) {
      console.error("Save vaccine error:", error);
      alert("ذخیره واکسیناسیون انجام نشد:\n" + error.message);
      return;
    }

    event.target.reset();
    document.getElementById("vaccineDate").value =
      typeof todayISO === "function"
        ? todayISO()
        : new Date().toISOString().slice(0, 10);

    await loadHealthRecords();
    alert("واکسیناسیون با موفقیت ثبت شد.");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "ثبت واکسیناسیون";
    }
  }
}

async function saveMedicine(event) {
  event.preventDefault();

  const btn = event.target.querySelector('button[type="submit"]');
  if (btn) {
    btn.disabled = true;
    btn.textContent = "در حال ذخیره...";
  }

  try {
    const name = document.getElementById("medicineName").value.trim();
    const record_date = document.getElementById("medicineStart").value;

    if (!name || !record_date) {
      alert("تاریخ شروع و نام دارو الزامی است.");
      return;
    }

    const payload = {
      owner_id: currentUser.id,
      farm_id: currentFlock.farmId || null,
      house_id: currentFlock.houseId || null,
      flock_id: String(currentFlock.id),
      flock_name:
        currentFlock.flockName || currentFlock.name || null,
      type: "medicine",
      record_date,
      end_date:
        document.getElementById("medicineEnd").value || null,
      name,
      active_ingredient:
        document.getElementById("medicineActive").value.trim() ||
        null,
      reason:
        document.getElementById("medicineReason").value.trim() ||
        null,
      route:
        document.getElementById("medicineRoute").value || null,
      dose:
        document.getElementById("medicineDose").value.trim() || null,
      duration:
        document.getElementById("medicineDuration").value.trim() ||
        null,
      notes:
        document.getElementById("medicineNotes").value.trim() || null
    };

    const { error } = await supabaseClient
      .from("health_records")
      .insert(payload);

    if (error) {
      console.error("Save medicine error:", error);
      alert("ذخیره درمان انجام نشد:\n" + error.message);
      return;
    }

    event.target.reset();
    document.getElementById("medicineStart").value =
      typeof todayISO === "function"
        ? todayISO()
        : new Date().toISOString().slice(0, 10);

    await loadHealthRecords();
    alert("درمان با موفقیت ثبت شد.");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "ثبت درمان";
    }
  }
}

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

function escapeSafe(value) {
  if (typeof escapeHTML === "function") {
    return escapeHTML(value);
  }
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderHealth() {
  const table = document.getElementById("healthTable");
  if (!table) return;

  if (!healthRecords.length) {
    table.innerHTML =
      '<tr><td colspan="5">هنوز رکوردی ثبت نشده است.</td></tr>';
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
      const typeLabel =
        r.type === "vaccination" ? "واکسیناسیون" : "دارو / درمان";
      const item = r.name || "-";
      let note = "-";

      if (r.type === "vaccination") {
        note = [
          r.disease ? diseaseMap[r.disease] || r.disease : "",
          r.route ? routeMap[r.route] || r.route : "",
          r.notes || ""
        ]
          .filter(Boolean)
          .join(" | ");
      } else {
        note = [
          r.reason || "",
          r.dose || "",
          r.route ? routeMap[r.route] || r.route : "",
          r.notes || ""
        ]
          .filter(Boolean)
          .join(" | ");
      }

      if (!note) note = "-";

      return `
        <tr>
          <td>${escapeSafe(r.record_date || "-")}</td>
          <td>${typeLabel}</td>
          <td>${escapeSafe(item)}</td>
          <td>${escapeSafe(note)}</td>
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

window.deleteHealthRecord = deleteHealthRecord;
