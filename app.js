/* ==========================================================================
   SOLARIA ENERGY - INTERACTIVE APPLICATION LOGIC & AI ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initCalculatorEngine();
  initPortfolioFilters();
  initFaqAccordion();
  initMobileMenu();
});

/* --------------------------------------------------------------------------
   1. DARK / LIGHT THEME TOGGLE
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const htmlElem = document.documentElement;

  // Load saved preference
  const savedTheme = localStorage.getItem('solaria-theme') || 'dark';
  htmlElem.setAttribute('data-theme', savedTheme);

  themeBtn.addEventListener('click', () => {
    const currentTheme = htmlElem.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlElem.setAttribute('data-theme', newTheme);
    localStorage.setItem('solaria-theme', newTheme);
  });
}

/* --------------------------------------------------------------------------
   2. LIVE AI SOLAR SAVINGS CALCULATOR ENGINE
   -------------------------------------------------------------------------- */
function initCalculatorEngine() {
  const billSlider = document.getElementById('calc-bill-slider');
  const roofSlider = document.getElementById('calc-roof-area');
  const sectorSelect = document.getElementById('calc-sector');
  const citySelect = document.getElementById('calc-city');

  if (!billSlider) return;

  function updateCalculations() {
    const bill = parseInt(billSlider.value);
    const roofArea = parseInt(roofSlider.value);
    const sector = sectorSelect.value;

    // Display formatted values
    document.getElementById('bill-val-display').innerText = `₹${bill.toLocaleString('en-IN')}`;
    document.getElementById('roof-val-display').innerText = `${roofArea} sq.ft`;

    // Calculation Logic:
    // Estimated kW needed = Monthly Bill / 1400 (Avg units per month per kW)
    let systemKw = Math.round((bill / 1400) * 10) / 10;
    if (systemKw < 1) systemKw = 1;

    // Constrain by roof area (1 kW requires approx 80 sq.ft)
    const maxKwByRoof = Math.floor(roofArea / 75 * 10) / 10;
    if (systemKw > maxKwByRoof && maxKwByRoof > 0.5) {
      systemKw = maxKwByRoof;
    }

    const panelCount = Math.ceil((systemKw * 1000) / 450); // 450W TOPCon panels

    // Annual Savings (approx 90% of electricity bill)
    const annualSavings = Math.round(bill * 12 * 0.90);

    // PM Surya Ghar Subsidy Calculation (For Residential)
    let subsidy = 0;
    if (sector === 'residential') {
      if (systemKw <= 1) subsidy = 30000;
      else if (systemKw <= 2) subsidy = 60000;
      else subsidy = 78000; // Capped at ₹78,000 max for 3kW+
    } else if (sector === 'agricultural') {
      subsidy = Math.round(systemKw * 45000); // PM-KUSUM Agri scheme
    }

    // Cost estimation (approx ₹60,000 per kW before subsidy)
    const grossCost = Math.round(systemKw * 58000);
    const netCost = Math.max(0, grossCost - subsidy);

    // Payback Period (Years)
    let paybackYears = 2.2;
    if (annualSavings > 0) {
      paybackYears = Math.round((netCost / annualSavings) * 10) / 10;
      if (paybackYears < 1.8) paybackYears = 1.8;
    }

    // Lifetime 25-Year Savings
    const lifetimeSavings = Math.round(annualSavings * 25);
    const treesPlanted = Math.round(systemKw * 24);

    // Update DOM
    document.getElementById('out-system-size').innerText = `${systemKw} kW`;
    document.getElementById('out-panels-count').innerText = panelCount;
    document.getElementById('out-annual-savings').innerText = `₹${annualSavings.toLocaleString('en-IN')}`;
    document.getElementById('out-subsidy').innerText = `₹${subsidy.toLocaleString('en-IN')}`;
    document.getElementById('out-net-cost').innerText = `₹${netCost.toLocaleString('en-IN')}`;
    document.getElementById('out-payback').innerText = `${paybackYears} Years`;
    document.getElementById('out-lifetime-savings').innerText = `₹${lifetimeSavings.toLocaleString('en-IN')}`;
    document.getElementById('out-trees').innerText = `${treesPlanted} Trees / Yr`;
  }

  billSlider.addEventListener('input', updateCalculations);
  roofSlider.addEventListener('input', updateCalculations);
  sectorSelect.addEventListener('change', updateCalculations);
  citySelect.addEventListener('change', updateCalculations);

  // Initial Run
  updateCalculations();
}

/* --------------------------------------------------------------------------
   3. MULTI-VIEW PAGE ROUTER
   -------------------------------------------------------------------------- */
function switchView(viewId) {
  const views = document.querySelectorAll('.view-page');
  views.forEach(view => view.classList.remove('active'));

  const targetView = document.getElementById(viewId);
  if (targetView) {
    targetView.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update nav active link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => link.classList.remove('active'));
}

function scrollToSection(sectionId) {
  setTimeout(() => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }, 100);
}

/* --------------------------------------------------------------------------
   4. SOLUTION TABS SWITCHER
   -------------------------------------------------------------------------- */
function openSolutionTab(evt, tabId) {
  const contents = document.querySelectorAll('.tab-content');
  contents.forEach(content => content.classList.remove('active'));

  const buttons = document.querySelectorAll('.services-tabs .tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
  evt.currentTarget.classList.add('active');
}

/* --------------------------------------------------------------------------
   5. PORTFOLIO CATEGORY FILTERS
   -------------------------------------------------------------------------- */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.portfolio-filter-buttons .filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. INTERACTIVE INSTALLATION MAP PIN SELECTOR
   -------------------------------------------------------------------------- */
const mapData = {
  coimbatore: {
    name: 'Coimbatore Regional Hub (HQ)',
    installs: '6,420+ Roofs',
    capacity: '240.5 MW',
    reduction: '94.8%',
    landmark: 'KPR Textile Park & 4,200 Residential Rooftops in Peelamedu & Avinashi Road.'
  },
  chennai: {
    name: 'Chennai Metro Regional Hub',
    installs: '3,850+ Roofs',
    capacity: '120.2 MW',
    reduction: '92.4%',
    landmark: 'Commercial Tech Parks in OMR & Residential Villas in ECR and Anna Nagar.'
  },
  madurai: {
    name: 'Madurai & Southern Hub',
    installs: '2,140+ Roofs',
    capacity: '85.4 MW',
    reduction: '96.1%',
    landmark: 'Cold Storage Plants & Textile Processing Units in Madurai Outer Belt.'
  },
  salem: {
    name: 'Salem & Erode Industrial Hub',
    installs: '2,900+ Roofs',
    capacity: '95.8 MW',
    reduction: '95.2%',
    landmark: 'Steel Ancillaries & Powerloom Industry Rooftops across Salem & Erode.'
  },
  bengaluru: {
    name: 'Bengaluru Tech & Commercial Hub',
    installs: '1,650+ Roofs',
    capacity: '60.0 MW',
    reduction: '91.8%',
    landmark: 'Corporate Offices & Green Villa Communities in Whitefield & Electronic City.'
  }
};

function selectMapPin(cityKey) {
  const pins = document.querySelectorAll('.map-pin');
  pins.forEach(pin => pin.classList.remove('active'));

  const selectedPin = document.querySelector(`.pin-${cityKey}`);
  if (selectedPin) selectedPin.classList.add('active');

  const data = mapData[cityKey];
  if (data) {
    document.getElementById('pin-city-name').innerText = data.name;
    document.getElementById('pin-install-count').innerText = data.installs;
    document.getElementById('pin-capacity').innerText = data.capacity;
    document.getElementById('pin-reduction').innerText = data.reduction;
    document.getElementById('pin-landmark').innerText = data.landmark;
  }
}

/* --------------------------------------------------------------------------
   7. FAQ ACCORDION LOGIC
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  // Handled inline via toggleFaq function
}

function toggleFaq(elem) {
  const item = elem.parentElement;
  item.classList.toggle('active');
}

/* --------------------------------------------------------------------------
   8. AI CHATBOT & ASSISTANT ENGINE
   -------------------------------------------------------------------------- */
function toggleChatbot() {
  const win = document.getElementById('chat-window');
  win.classList.toggle('active');
}

function sendQuickChat(msgText) {
  appendChatMessage(msgText, 'user-msg');

  setTimeout(() => {
    let botReply = "Thank you for reaching out! Our senior solar engineer will assist you.";
    if (msgText.includes('Subsidy')) {
      botReply = "Under PM Surya Ghar Muft Bijli Yojana, residential rooftops get up to ₹78,000 direct bank transfer subsidy for 3kW systems!";
    } else if (msgText.includes('cost')) {
      botReply = "A standard 3kW TOPCon system costs ₹1,96,000 gross. After ₹78,000 govt subsidy, your net cost is only ₹1,18,000!";
    } else if (msgText.includes('survey')) {
      botReply = "Great! Please fill out the lead form on our page or reply with your phone number for a free engineering site visit in Coimbatore!";
    }
    appendChatMessage(botReply, 'bot-msg');
  }, 600);
}

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  appendChatMessage(text, 'user-msg');
  input.value = '';

  setTimeout(() => {
    appendChatMessage("Thanks for your query! One of our solar advisors in Coimbatore is reviewing your request. Feel free to book a free survey!", 'bot-msg');
  }, 700);
}

function handleChatKeyPress(e) {
  if (e.key === 'Enter') sendChatMessage();
}

function appendChatMessage(text, msgClass) {
  const box = document.getElementById('chat-messages');
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg ${msgClass}`;
  msgDiv.innerText = text;
  box.appendChild(msgDiv);
  box.scrollTop = box.scrollHeight;
}

/* --------------------------------------------------------------------------
   9. PROPOSAL MODAL LOGIC
   -------------------------------------------------------------------------- */
function triggerProposalModal() {
  const modal = document.getElementById('proposal-modal');
  const report = document.getElementById('modal-report-content');

  const systemKw = document.getElementById('out-system-size').innerText;
  const annualSavings = document.getElementById('out-annual-savings').innerText;
  const subsidy = document.getElementById('out-subsidy').innerText;
  const netCost = document.getElementById('out-net-cost').innerText;

  report.innerHTML = `
    <div style="background: rgba(255,183,3,0.1); padding: 1rem; border-radius: 12px; margin-bottom: 1rem;">
      <h4 style="color: var(--color-gold); margin-bottom: 0.5rem;">Recommended System: ${systemKw}</h4>
      <p style="font-size: 0.9rem;">Gross Cost: ₹${(parseInt(netCost.replace(/[^0-9]/g, '')) + parseInt(subsidy.replace(/[^0-9]/g, ''))).toLocaleString('en-IN')}</p>
      <p style="font-size: 0.9rem; color: var(--color-green);">PM Govt Subsidy: ${subsidy}</p>
      <h3 style="margin-top: 0.5rem;">Effective Net Cost: ${netCost}</h3>
    </div>
    <ul style="font-size: 0.88rem; list-style: none; margin-bottom: 1rem;">
      <li>✅ <strong>Annual Energy Savings:</strong> ${annualSavings}</li>
      <li>✅ <strong>Panels:</strong> Tier-1 N-Type TOPCon 30-Year Performance Guarantee</li>
      <li>✅ <strong>Net Metering:</strong> End-to-End TANGEDCO Approval Included</li>
      <li>✅ <strong>0% EMI Option:</strong> Starting at ₹3,799 / month</li>
    </ul>
  `;

  modal.classList.add('active');
}

function closeProposalModal() {
  document.getElementById('proposal-modal').classList.remove('active');
}

function submitModalSurvey() {
  closeProposalModal();
  scrollToSection('contact');
}

/* --------------------------------------------------------------------------
   10. LEAD FORM HANDLER & STORAGE LOGIC
   -------------------------------------------------------------------------- */
function handleLeadSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('lead-name').value;
  const phone = document.getElementById('lead-phone').value;
  const pincode = document.getElementById('lead-pincode').value;
  const bill = document.getElementById('lead-bill').value;
  const propType = document.getElementById('lead-type').value;

  const leadId = '#SOL-' + Math.floor(1000 + Math.random() * 9000);
  const newLead = {
    id: leadId,
    name: name,
    phone: phone,
    location: pincode,
    bill: bill,
    propertyType: propType,
    date: new Date().toLocaleDateString(),
    status: 'New Assessment Lead'
  };

  // Save lead in localStorage database
  const existingLeads = JSON.parse(localStorage.getItem('solaria_leads') || '[]');
  existingLeads.unshift(newLead);
  localStorage.setItem('solaria_leads', JSON.stringify(existingLeads));

  // Render lead into Admin CRM Portal table dynamically
  renderLeadInAdminTable(newLead);

  alert(`✅ Assessment Booked!\nThank you, ${name}.\nYour Lead ID is ${leadId}.\nSaved locally in Solaria CRM Database & Admin Portal.\nOur Coimbatore engineering team will call you at ${phone} within 2 hours.`);
  document.getElementById('lead-form').reset();
}

function renderLeadInAdminTable(lead) {
  const tbody = document.querySelector('.admin-table tbody');
  if (tbody) {
    const row = document.createElement('tr');
    row.style.background = 'rgba(255,183,3,0.15)';
    row.innerHTML = `
      <td><strong>${lead.id}</strong></td>
      <td>${lead.name}</td>
      <td>${lead.location}</td>
      <td>${lead.propertyType} (${lead.bill})</td>
      <td><span class="badge-gold">Live Lead Received</span></td>
      <td><button class="btn btn-sm btn-primary" onclick="alert('Contacting ${lead.phone}...')">Call Lead</button></td>
    `;
    tbody.insertBefore(row, tbody.firstChild);
  }
}

function selectPackage(packageName) {
  scrollToSection('contact');
  const typeSelect = document.getElementById('lead-type');
  if (typeSelect) {
    typeSelect.value = "Independent House";
  }
}

/* --------------------------------------------------------------------------
   11. AI ROOF IMAGE ANALYZER SIMULATOR
   -------------------------------------------------------------------------- */
function triggerRoofUpload() {
  const input = document.getElementById('roof-file-input');
  if (input) input.click();
}

function handleRoofUpload(event) {
  const file = event.target.files[0];
  if (file) {
    runAiRoofAnalysis('Custom Uploaded Roof', 520, 4.8, 'Very Low (97% Sun Harvest)');
  }
}

function analyzeSampleRoof(roofType) {
  if (roofType === 'villa') {
    runAiRoofAnalysis('Residential Luxury Villa', 600, 5.5, 'Low (96% Sun Harvest)');
  } else if (roofType === 'factory') {
    runAiRoofAnalysis('Commercial Textile Factory', 12500, 110.0, 'Zero Shading (99% Sun Harvest)');
  } else if (roofType === 'farm') {
    runAiRoofAnalysis('Agricultural Farm Land', 400, 7.5, 'Optimal Open Sun');
  }
}

function runAiRoofAnalysis(label, area, kw, risk) {
  const loader = document.getElementById('ai-loader');
  const box = document.getElementById('ai-result-box');

  if (loader && box) {
    loader.style.display = 'block';
    box.style.opacity = '0.3';

    setTimeout(() => {
      loader.style.display = 'none';
      box.style.opacity = '1';

      document.getElementById('ai-roof-area').innerText = `${area.toLocaleString('en-IN')} Sq. Ft`;
      document.getElementById('ai-rec-kw').innerText = `${kw} kW TOPCon`;
      document.getElementById('ai-shadow-risk').innerText = risk;

      let subsidyText = "₹78,000 Direct Bank Credit";
      if (kw > 50) subsidyText = "40% Accelerated Tax Depreciation";
      document.getElementById('ai-subsidy-est').innerText = subsidyText;
    }, 1200);
  }
}

/* --------------------------------------------------------------------------
   12. MOBILE MENU OVERLAY CONTROLLER
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('mobile-open');
    });

    // Close mobile menu when clicking any nav link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        navMenu.classList.remove('mobile-open');
      }
    });
  }
}


