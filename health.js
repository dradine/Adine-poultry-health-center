/* =========================================================
   ADINE — HEALTH (Vaccination & Medicine)
   ========================================================= */

let currentUser = null;
let currentFlock = null;
let currentFarm = null;
let currentHouse = null;
let healthRecords = [];

document.addEventListener("DOMContentLoaded", initHealth);

async function waitForSession(maxTries = 8) {
  for (let i = 0; i < maxTries; i++) {
    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
      console.warn("getSession error:", error);
    }

    if (data?.session?.user) {
      return data.session;
    }

    // صبر کوتاه برای بازیابی session از localStorage
    await new Promise((r) => setTimeout(r, 200));
  }
  return null;
}

async function initHealth() {
  try {
    if (typeof window.supabase === "undefined") {
      alert("کتابخانه Supabase لود نشده است.");
      return;
    }

    if (typeof supabaseClient === "undefined") {
      alert("supabase-config.js لود نشده است.");
      return;
    }

    const session = await waitForSession();

    if (!session) {
      console.error("No session found after retries");
      location.href =
        "login.html?message=" +
        encodeURIComponent("نشست شما منقضی شده. دوباره وارد شوید.");
      return;
    }

    currentUser = session.user;
    console.log("Health auth OK:", currentUser.id);

    // ---- انتخاب گله ----
    const selection =
      typeof getCurrentSelection === "function"
        ? getCurrentSelection()
        : {};

    if (!selection.flockId) {
      alert("ابتدا از بخش سالن و گله، یک گله را انتخاب کنید.");
      location.href = "flocks.html";
      return;
    }

    // گله‌ها در Supabase هستند؛ از selection استفاده می‌کنیم
    currentFlock = {
      id: selection.flockId,
      farmId: selection.farmId || null,
      houseId: selection.houseId || null,
      flockName: selection.flockName || "گله انتخاب‌شده",
      strain: selection.strain || "",
      placementDate: selection.placementDate || ""
    };

    // اگر از localStorage هم بود، اطلاعات بیشتر بگیر
    if (typeof getFlocks === "function") {
      const local = getFlocks().find((f) => f.id === selection.flockId);
      if (local) {
        currentFlock = {
          id: local.id,
          farmId: local.farmId || local.farm_id || selection.farmId,
          houseId: local.houseId || local.house_id || selection.houseId,
          flockName: local.flockName || local.name || local.flock_name,
          strain: local.strain || "",
          placementDate: local.placementDate || local.placement_date || ""
        };
      }
    }

    const infoEl = document.getElementById("flockInfo");
    if (infoEl) {
      infoEl.textContent = [
        currentFlock.flockName || "",
        currentFlock.strain || "",
        "شناسه: " + String(currentFlock.id).slice(0, 8)
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
      const age = calculateAgeDays(currentFlock.placementDate, today);
      const ageInput = document.getElementById("vaccineAge");
      if (ageInput && age !== null) ageInput.value = age;
    }

    setupForms();
    await loadHealthRecords();
  } catch (err) {
    console.error("Health init error:", err);
    alert("خطا در بخش سلامت:\n" + (err.message || err));
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
        '<tr><td colspan="5">خطا: ' +
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
      flock_name: currentFlock.flockName || null,
      type: "vaccination",
      record_date,
      age_days: Number(document.getElementById("vaccineAge").value || 0),
      disease: document.getElementById("vaccineDisease").value || null,
      name,
      manufacturer:
        document.getElementById("vaccineManufacturer").value.trim() || null,
      route: document.getElementById("vaccineRoute").value || null,
      notes: document.getElementById("vaccineNotes").value.trim() || null
    };

    const { error } = await supabaseClient
      .from("health_records")
      .insert(payload);

    if (error) {
      alert("ذخیره واکسیناسیون انجام نشد:\n" + error.message);
      return;
    }

    event.target.reset();
    document.getElementById("vaccineDate").value =
      typeof todayISO === "function"
        ? todayISO()
        : new Date().toISOString().slice(0, 10);

    await loadHealthRecords();
    alert("واکسیناسیون ثبت شد.");
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
      flock_name: currentFlock.flockName || null,
      type: "medicine",
      record_date,
      end_date: document.getElementById("medicineEnd").value || null,
      name,
      active_ingredient:
        document.getElementById("medicineActive").value.trim() || null,
      reason: document.getElementById("medicineReason").value.trim() || null,
      route: document.getElementById("medicineRoute").value || null,
      dose: document.getElementById("medicineDose").value.trim() || null,
      duration: document.getElementById("medicineDuration").value.trim() || null,
      notes: document.getElementById("medicineNotes").value.trim() || null
    };

    const { error } = await supabaseClient
      .from("health_records")
      .insert(payload);

    if (error) {
      alert("ذخیره درمان انجام نشد:\n" + error.message);
      return;
    }

    event.target.reset();
    document.getElementById("medicineStart").value =
      typeof todayISO === "function"
        ? todayISO()
        : new Date().toISOString().slice(0, 10);

    await loadHealthRecords();
    alert("درمان ثبت شد.");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "ثبت درمان";
    }
  }
}

async function deleteHealthRecord(id) {
  if (!confirm("حذف این رکورد؟")) return;

  const { error } = await supabaseClient
    .from("health_records")
    .delete()
    .eq("id", id)
    .eq("owner_id", currentUser.id);

  if (error) {
    alert("حذف انجام نشد:\n" + error.message);
    return;
  }

  await loadHealthRecords();
}

function escapeSafe(value) {
  if (typeof escapeHTML === "function") return escapeHTML(value);
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
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
          <td>${escapeSafe(r.name || "-")}</td>
          <td>${escapeSafe(note)}</td>
          <td>
            <button type="button" class="btn btn-danger"
              onclick="deleteHealthRecord('${r.id}')">حذف</button>
          </td>
        </tr>`;
    })
    .join("");
}

window.deleteHealthRecord = deleteHealthRecord;
