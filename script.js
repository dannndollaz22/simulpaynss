/* ==========================================================================
   HONDA MOTORCYCLE SIMULATION CALCULATOR ENGINE
   Full Data & Calculation Logic for Credit, Cash, and Custom Simulation
   ========================================================================== */

// 1. Official Honda Motor Product Catalog & Prices (From NSS Malang Price List 2026)
const HONDA_CATALOG = [
  // BEBEK / CUB
  { id: 'revo-fit', name: 'REVO FIT', category: 'Bebek', otr: 19825000 },
  { id: 'revo-x', name: 'REVO X', category: 'Bebek', otr: 21575000 },
  { id: 'supra-x-125-cw', name: 'SUPRA X 125 CW', category: 'Bebek', otr: 24300000 },
  { id: 'supra-gtr-150', name: 'NEW SUPRA GTR150 XCLUSIVE', category: 'Bebek', otr: 29425000 },

  // MATIC / SCOOTER
  { id: 'beat-cbs', name: 'BEAT SPORTY CBS', category: 'Matic', otr: 21850000 },
  { id: 'beat-iss-deluxe', name: 'BEAT SPORTY CBS ISS DELUXE', category: 'Matic', otr: 22750000 },
  { id: 'beat-smartkey', name: 'BEAT SPORTY DLX SMART KEY', category: 'Matic', otr: 23250000 },
  { id: 'beat-street', name: 'BEAT STREET', category: 'Matic', otr: 22750000 },
  { id: 'genio-cbs-bk', name: 'GENIO CBS (BK)', category: 'Matic', otr: 23000000 },
  { id: 'genio-cbs-pd', name: 'GENIO CBS (PH/PD)', category: 'Matic', otr: 23200000 },
  { id: 'genio-iss', name: 'GENIO CBS ISS', category: 'Matic', otr: 23550000 },
  { id: 'scoopy-energetic', name: 'SCOOPY ENERGETIC/FASHION', category: 'Matic', otr: 25425000 },
  { id: 'scoopy-prestige', name: 'SCOOPY PRESTIGE/STYLISH', category: 'Matic', otr: 26275000 },
  { id: 'vario-125-cbs', name: 'NEW VARIO 125 CBS', category: 'Matic', otr: 26825000 },
  { id: 'vario-125-iss', name: 'NEW VARIO 125 CBS ISS', category: 'Matic', otr: 28650000 },
  { id: 'vario-125-street', name: 'NEW VARIO 125 STREET', category: 'Matic', otr: 29075000 },
  { id: 'vario-125-visor', name: 'NEW VARIO 125 STREET + VISOR', category: 'Matic', otr: 29200000 },
  { id: 'stylo-160-cbs', name: 'STYLO 160 CBS', category: 'Matic', otr: 32125000 },
  { id: 'stylo-160-cbs-sp', name: 'STYLO 160 CBS SPECIAL COLOR', category: 'Matic', otr: 34125000 },
  { id: 'stylo-160-abs', name: 'STYLO 160 ABS', category: 'Matic', otr: 35125000 },
  { id: 'stylo-160-abs-sp', name: 'STYLO 160 ABS SPECIAL COLOR', category: 'Matic', otr: 36825000 },
  { id: 'vario-160-cbs', name: 'VARIO 160 CBS (BK/RD/BL)', category: 'Matic', otr: 29975000 },
  { id: 'vario-160-cbs-wh', name: 'VARIO 160 CBS (BK/WH)', category: 'Matic', otr: 30225000 },
  { id: 'vario-160-abs', name: 'VARIO 160 ABS', category: 'Matic', otr: 32875000 },
  { id: 'vario-evo-160-cbs', name: 'VARIO EVO 160 CBS', category: 'Matic', otr: 30125000 },
  { id: 'vario-evo-160-nitro', name: 'VARIO EVO 160 CBS NITRO', category: 'Matic', otr: 30375000 },
  { id: 'vario-evo-160-abs', name: 'VARIO EVO 160 ABS', category: 'Matic', otr: 33125000 },
  { id: 'pcx-160-cbs', name: 'NEW PCX 160 CBS', category: 'Matic', otr: 36400000 },
  { id: 'pcx-160-abs', name: 'NEW PCX 160 ABS', category: 'Matic', otr: 40375000 },
  { id: 'pcx-160-roadsync', name: 'NEW PCX 160 ABS ROADSYNC', category: 'Matic', otr: 43175000 },
  { id: 'adv-160-cbs', name: 'NEW ADV 160 CBS', category: 'Matic', otr: 38925000 },
  { id: 'adv-160-abs', name: 'NEW ADV 160 ABS', category: 'Matic', otr: 42125000 },
  { id: 'adv-160-roadsync', name: 'NEW ADV 160 ABS ROADSYNC', category: 'Matic', otr: 43775000 },

  // SPORT
  { id: 'sonic-150r', name: 'SONIC 150R', category: 'Sport', otr: 29675000 },
  { id: 'cb150-verza', name: 'CB150 VERZA CW', category: 'Sport', otr: 27150000 },
  { id: 'cb150x-std', name: 'CB150X STD', category: 'Sport', otr: 36125000 },
  { id: 'cbr150r-std', name: 'CBR150R STD', category: 'Sport', otr: 41325000 },
  { id: 'cbr150r-abs', name: 'CBR150R ABS', category: 'Sport', otr: 45375000 },
  { id: 'crf150l', name: 'CRF150L', category: 'Sport', otr: 40475000 },

  // EV ELECTRIC
  { id: 'icon-e', name: 'ICON E (ELECTRIC)', category: 'EV', otr: 28450000 },
  { id: 'cuv-e', name: 'CUV E (ELECTRIC)', category: 'EV', otr: 55100000 }
];

// 2. Global Application State
let selectedMotor = HONDA_CATALOG.find(m => m.id === 'scoopy-prestige') || HONDA_CATALOG[0];
let activeTab = 'manual'; // 'manual', 'cash'

// Manual State
let manualDpPercent = 20; // Default 20%
let manualDpAmount = Math.round((selectedMotor.otr * 0.2) / 50000) * 50000;
let manualDpDiscount = 500000; // Promo diskon DP
let manualTac1 = 0;
let manualTac2 = 0;

// Cash State
let cashDiscount = 500000; // Diskon tunai promo
let cashDpBooking = 500000; // DP tanda jadi cash

// Kredit State
let activeLeasing = 'fif'; // 'fif', 'oto', 'bca'
let kreditTac1 = 0;
let kreditTac2 = 0;

// Helper: Format Currency Rupiah
function formatRupiah(num) {
  if (isNaN(num) || num === null) return 'Rp 0';
  return 'Rp ' + Math.round(num).toLocaleString('id-ID');
}

// Helper: Parse Currency Number from String
function parseCurrency(str) {
  if (typeof str === 'number') return str;
  return parseInt(str.replace(/[^0-9]/g, ''), 10) || 0;
}

// Helper: Format Input Value while preserving cursor position
function formatInputWithCursor(e, num) {
  if (e.target.value.trim() === '') {
    e.target.value = '';
    return;
  }
  const cursor = e.target.selectionStart || 0;
  const oldLen = e.target.value.length;
  e.target.value = num.toLocaleString('id-ID');
  const newLen = e.target.value.length;
  const newCursor = Math.max(0, cursor + (newLen - oldLen));
  try { e.target.setSelectionRange(newCursor, newCursor); } catch (err) {}
}

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
  initMotorSelector();
  initCategoryFilters();
  initTabNavigation();
  initManualListeners();
  initCashListeners();
  initKreditListeners();
  initPriceListTable();

  // Initial Calculation Run
  updateMotorSelection(selectedMotor.id);
});

/* --------------------------------------------------------------------------
   MOTOR SELECTOR & FILTER LOGIC
   -------------------------------------------------------------------------- */
function initMotorSelector() {
  const selectEl = document.getElementById('motor-select');
  if (!selectEl) return;

  selectEl.innerHTML = '';
  HONDA_CATALOG.forEach(motor => {
    const opt = document.createElement('option');
    opt.value = motor.id;
    opt.textContent = `${motor.name} - ${formatRupiah(motor.otr)}`;
    selectEl.appendChild(opt);
  });

  selectEl.value = selectedMotor.id;

  selectEl.addEventListener('change', (e) => {
    updateMotorSelection(e.target.value);
  });
}

function initCategoryFilters() {
  const catPills = document.querySelectorAll('.cat-pill');
  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const cat = pill.getAttribute('data-cat');
      filterMotorDropdown(cat);
    });
  });
}

function filterMotorDropdown(category) {
  const selectEl = document.getElementById('motor-select');
  if (!selectEl) return;

  selectEl.innerHTML = '';
  const filtered = category === 'all' 
    ? HONDA_CATALOG 
    : HONDA_CATALOG.filter(m => m.category === category);

  filtered.forEach(motor => {
    const opt = document.createElement('option');
    opt.value = motor.id;
    opt.textContent = `${motor.name} - ${formatRupiah(motor.otr)}`;
    selectEl.appendChild(opt);
  });

  if (filtered.length > 0) {
    selectEl.value = filtered[0].id;
    updateMotorSelection(filtered[0].id);
  }
}

function updateMotorSelection(motorId) {
  const motor = HONDA_CATALOG.find(m => m.id === motorId);
  if (!motor) return;

  selectedMotor = motor;

  // Update Preview UI Elements
  document.querySelectorAll('.selected-motor-name').forEach(el => el.textContent = motor.name);
  document.querySelectorAll('.selected-motor-category').forEach(el => el.textContent = motor.category);
  document.querySelectorAll('.selected-motor-otr').forEach(el => {
    if (el.tagName.toLowerCase() === 'input') {
      el.value = formatRupiah(motor.otr);
    } else {
      el.textContent = formatRupiah(motor.otr);
    }
  });

  // Recalculate DP based on 20% default if needed
  manualDpAmount = Math.round((motor.otr * (manualDpPercent / 100)) / 50000) * 50000;
  
  // Update Inputs
  const dpInput = document.getElementById('manual-dp-input');
  const dpRange = document.getElementById('manual-dp-range');
  if (dpInput) dpInput.value = manualDpAmount.toLocaleString('id-ID');
  if (dpRange) {
    dpRange.min = Math.round(motor.otr * 0.1);
    dpRange.max = Math.round(motor.otr * 0.7);
    dpRange.value = manualDpAmount;
  }

  // Update All Active Calculations
  calculateManual();
  calculateCash();
  if (typeof calculateKredit === 'function') calculateKredit();
}

/* --------------------------------------------------------------------------
   TAB NAVIGATION
   -------------------------------------------------------------------------- */
function initTabNavigation() {
  const tabs = document.querySelectorAll('.nav-tab');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      document.getElementById(`tab-${targetId}`).classList.add('active');

      activeTab = targetId;

      // Update calculations and WA link for the new tab mode
      calculateManual();
      calculateCash();
      if (typeof calculateKredit === 'function') calculateKredit();
    });
  });
}

/* --------------------------------------------------------------------------
   FEATURE 1: MANUAL CALCULATOR LOGIC
   -------------------------------------------------------------------------- */
function initManualListeners() {
  const dpInput = document.getElementById('manual-dp-input');
  const dpRange = document.getElementById('manual-dp-range');
  const discountInput = document.getElementById('manual-discount-input');
  const tac1Input = document.getElementById('manual-tac1-input');
  const tac2Input = document.getElementById('manual-tac2-input');

  // DP Chips (10%, 15%, 20%, 25%, 30%)
  document.querySelectorAll('.dp-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.dp-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const pct = parseFloat(btn.getAttribute('data-pct'));
      manualDpPercent = pct;
      manualDpAmount = Math.round((selectedMotor.otr * (pct / 100)) / 50000) * 50000;

      if (dpInput) dpInput.value = manualDpAmount.toLocaleString('id-ID');
      if (dpRange) dpRange.value = manualDpAmount;

      calculateManual();
    });
  });

  // Manual DP Input (Isi manual, hasil otomatis)
  if (dpInput) {
    dpInput.addEventListener('input', (e) => {
      manualDpAmount = parseCurrency(e.target.value);
      formatInputWithCursor(e, manualDpAmount);
      if (dpRange) dpRange.value = manualDpAmount;
      calculateManual();
    });
  }

  // DP Range Slider
  if (dpRange) {
    dpRange.addEventListener('input', (e) => {
      manualDpAmount = parseInt(e.target.value, 10);
      if (dpInput) dpInput.value = manualDpAmount.toLocaleString('id-ID');
      calculateManual();
    });
  }

  // Discount Input
  if (discountInput) {
    discountInput.addEventListener('input', (e) => {
      manualDpDiscount = parseCurrency(e.target.value);
      formatInputWithCursor(e, manualDpDiscount);
      calculateManual();
    });
  }

  if (tac1Input) {
    tac1Input.addEventListener('input', (e) => {
      manualTac1 = parseCurrency(e.target.value);
      formatInputWithCursor(e, manualTac1);
      calculateManual();
    });
  }

  if (tac2Input) {
    tac2Input.addEventListener('input', (e) => {
      manualTac2 = parseCurrency(e.target.value);
      formatInputWithCursor(e, manualTac2);
      calculateManual();
    });
  }
}

function calculateManual() {
  const otr = selectedMotor.otr;
  const rawDp = manualDpAmount;
  const netDp = Math.max(0, rawDp - manualDpDiscount);

  const totalTac = manualTac1 + manualTac2;
  const tax = totalTac * 0.12;
  const voucher = 225000;
  const finalTotal = Math.max(0, totalTac - tax - voucher);

  // Update Results UI
  const finalEl = document.getElementById('manual-result-final');
  const netDpEl = document.getElementById('manual-result-netdp');
  const totalTacEl = document.getElementById('manual-result-totaltac');
  const taxEl = document.getElementById('manual-result-tax');
  const voucherEl = document.getElementById('manual-result-voucher');

  if (finalEl) finalEl.textContent = formatRupiah(finalTotal);
  if (netDpEl) netDpEl.textContent = formatRupiah(netDp);
  if (totalTacEl) totalTacEl.textContent = formatRupiah(totalTac);
  if (taxEl) taxEl.textContent = '- ' + formatRupiah(tax);
  if (voucherEl) voucherEl.textContent = '- ' + formatRupiah(voucher);
}

/* --------------------------------------------------------------------------
   FEATURE 2: CASH / TUNAI LOGIC
   -------------------------------------------------------------------------- */
function initCashListeners() {
  const discInput = document.getElementById('cash-discount-input');
  const bookingInput = document.getElementById('cash-booking-input');

  if (discInput) {
    discInput.addEventListener('input', (e) => {
      cashDiscount = parseCurrency(e.target.value);
      formatInputWithCursor(e, cashDiscount);
      calculateCash();
    });
  }

  if (bookingInput) {
    bookingInput.addEventListener('input', (e) => {
      cashDpBooking = parseCurrency(e.target.value);
      formatInputWithCursor(e, cashDpBooking);
      calculateCash();
    });
  }
}

function calculateCash() {
  const otr = selectedMotor.otr;
  const finalPriceToPay = Math.max(0, otr - cashDiscount);
  const remainingOnDelivery = Math.max(0, finalPriceToPay - cashDpBooking);

  const finalEl = document.getElementById('cash-result-final');
  const otrEl = document.getElementById('cash-result-otr');
  const discEl = document.getElementById('cash-result-disc');
  const bookingEl = document.getElementById('cash-result-booking');
  const remainEl = document.getElementById('cash-result-remain');

  if (finalEl) finalEl.textContent = formatRupiah(finalPriceToPay);
  if (otrEl) otrEl.textContent = formatRupiah(otr);
  if (discEl) discEl.textContent = formatRupiah(cashDiscount);
  if (bookingEl) bookingEl.textContent = formatRupiah(cashDpBooking);
  if (remainEl) remainEl.textContent = formatRupiah(remainingOnDelivery);
}

/* --------------------------------------------------------------------------
   FEATURE 3: KREDIT LEASING LOGIC
   -------------------------------------------------------------------------- */
function getSubsidiDealer(motor) {
  const name = motor.name.toLowerCase();
  const cat = motor.category.toLowerCase();
  
  if (name.includes('beat')) return 1100000;
  if (name.includes('scoopy')) return 900000;
  if (name.includes('vario 125') || name.includes('v125')) return 900000;
  if (name.includes('vario 160') || name.includes('vario evo 160') || name.includes('v160')) return 1000000;
  if (name.includes('pcx')) return 1000000;
  if (name.includes('stylo')) return 900000;
  if (name.includes('adv')) return 1500000;
  
  if (cat === 'sport') return 1150000;
  if (cat === 'bebek' || cat === 'cub' || name.includes('cup')) return 650000;
  
  return 0; // Default
}

function initKreditListeners() {
  const tac1Input = document.getElementById('kredit-tac1-input');
  const tac2Input = document.getElementById('kredit-tac2-input');
  
  document.querySelectorAll('.leasing-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.leasing-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeLeasing = btn.getAttribute('data-leasing');
      
      const tac2Group = document.getElementById('kredit-tac2-group');
      const tac2Row = document.getElementById('kredit-row-tac2');
      const formulaDesc = document.getElementById('kredit-formula-desc');
      
      if(activeLeasing === 'fif') {
        if(tac2Group) tac2Group.style.display = 'flex';
        if(tac2Row) tac2Row.style.display = 'table-row';
        if(formulaDesc) formulaDesc.textContent = 'Rumus: TAC 1 - TAC 2 - Pajak 12% - Voucher 225.000 + Subsidi Dealer';
      } else {
        if(tac2Group) tac2Group.style.display = 'none';
        if(tac2Row) tac2Row.style.display = 'none';
        if(formulaDesc) formulaDesc.textContent = 'Rumus: TAC 1 - Pajak 12% - Voucher 225.000 + Subsidi Dealer';
      }
      
      calculateKredit();
    });
  });

  if (tac1Input) {
    tac1Input.addEventListener('input', (e) => {
      kreditTac1 = parseCurrency(e.target.value);
      formatInputWithCursor(e, kreditTac1);
      calculateKredit();
    });
  }

  if (tac2Input) {
    tac2Input.addEventListener('input', (e) => {
      kreditTac2 = parseCurrency(e.target.value);
      formatInputWithCursor(e, kreditTac2);
      calculateKredit();
    });
  }
}

function calculateKredit() {
  const subsidi = getSubsidiDealer(selectedMotor);
  const voucher = 225000;
  let finalResult = 0;
  let tax = 0;
  
  if(activeLeasing === 'fif') {
    tax = (kreditTac1 - kreditTac2) * 0.12;
    finalResult = kreditTac1 - kreditTac2 - tax - voucher + subsidi;
  } else {
    // OTO & BCA
    tax = kreditTac1 * 0.12;
    finalResult = kreditTac1 - tax - voucher + subsidi;
  }
  
  finalResult = Math.max(0, finalResult);

  const finalEl = document.getElementById('kredit-result-final');
  const tac1El = document.getElementById('kredit-res-tac1');
  const tac2El = document.getElementById('kredit-res-tac2');
  const taxEl = document.getElementById('kredit-res-tax');
  const voucherEl = document.getElementById('kredit-res-voucher');
  const subsidiEl = document.getElementById('kredit-res-subsidi');

  if (finalEl) finalEl.textContent = formatRupiah(finalResult);
  if (tac1El) tac1El.textContent = formatRupiah(kreditTac1);
  if (tac2El) tac2El.textContent = formatRupiah(kreditTac2);
  if (taxEl) taxEl.textContent = '- ' + formatRupiah(tax);
  if (voucherEl) voucherEl.textContent = '- ' + formatRupiah(voucher);
  if (subsidiEl) subsidiEl.textContent = '+ ' + formatRupiah(subsidi);
}

/* --------------------------------------------------------------------------
   PRICE LIST TABLE LOGIC
   -------------------------------------------------------------------------- */
function initPriceListTable() {
  const tbody = document.getElementById('honda-table-body');
  const searchInput = document.getElementById('table-search-input');
  if (!tbody) return;

  function renderTable(items) {
    tbody.innerHTML = '';
    items.forEach((m, idx) => {
      const estDp = Math.round((m.otr * 0.15) / 50000) * 50000;
      const loan = m.otr - estDp;
      const estInst = Math.round(((loan * 1.6) / 36) / 1000) * 1000;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="font-bold text-slate-900 text-center">${idx + 1}</td>
        <td>
          <div class="font-black text-slate-900">${m.name}</div>
          <div class="text-xs text-slate-500">${m.category}</div>
        </td>
        <td class="font-black text-red-600 text-right">${formatRupiah(m.otr)}</td>
        <td class="font-bold text-slate-700 text-right">${formatRupiah(estDp)}</td>
        <td class="text-center">
          <button class="btn-table-calc" onclick="updateMotorSelection('${m.id}'); window.scrollTo({top: 0, behavior: 'smooth'});">
            Simulasikan
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderTable(HONDA_CATALOG);

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = HONDA_CATALOG.filter(m => m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q));
      renderTable(filtered);
    });
  }
}


