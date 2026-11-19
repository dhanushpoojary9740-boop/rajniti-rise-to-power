import './styles.css';

const STORE_KEY = 'rajniti-save-v1';

const defaults = {
  characterCreated: false,
  playerName: 'New Politician',
  age: 21,
  gender: 'Male',
  stateName: 'Karnataka',
  hometown: 'Brahmavara',
  education: 'Graduate',
  occupation: 'Unemployed',
  familyBackground: 'Ordinary Family',
  financialBackground: 'Lower Middle Class',
  ideology: 'Development Focused',
  ambition: 'Prime Minister',

  role: 'Political Volunteer',
  party: 'Independent',
  partyId: 'independent',
  partyAbbreviation: 'IND',
  partyIdeology: 'Independent',
  partyPosition: 'Independent Politician',
  partyMembers: 1,
  partyFunds: 0,
  partyPopularity: 0,
  partyCreated: false,
  partyHistory: [],
  partyMemberRecords: [],
  partyLeadership: {},
  partyUnits: [],
  partyElectionHistory: [],

  constituency: {
    state: 'Karnataka',
    district: 'Udupi',
    constituencyName: 'Brahmavara Rural Constituency',
    selectedLocality: 'Brahmavara Town',
    localities: [
      { id: 'brahmavara', name: 'Brahmavara Town', type: 'Town', voters: 18500, support: 8, influence: 3, issue: 'Road maintenance' },
      { id: 'kota', name: 'Kota', type: 'Village Cluster', voters: 12400, support: 6, influence: 2, issue: 'Drinking water supply' },
      { id: 'saligrama', name: 'Saligrama', type: 'Town', voters: 9800, support: 9, influence: 3, issue: 'Public transport' },
      { id: 'hangarakatte', name: 'Hangarakatte', type: 'Village', voters: 6200, support: 5, influence: 1, issue: 'Street lighting' }
    ],
    campaigns: [],
    projects: [],
    resolvedIssues: [],
    totalVoters: 46900
  },

  elections: {
    active: null,
    history: [],
    totalContested: 0,
    totalWon: 0,
    totalLost: 0,
    calendar: {
      local: { intervalMonths: 60, nextAt: 36, label: 'Local body elections' },
      assembly: { intervalMonths: 60, nextAt: 60, label: 'State Assembly elections' },
      'lok-sabha': { intervalMonths: 60, nextAt: 48, label: 'Lok Sabha elections' }
    },
    nominationQueue: []
  },

  finance: {
    businesses: [],
    fixedDeposits: 0,
    totalSalaryEarned: 0,
    totalBusinessIncome: 0,
    totalInvestmentIncome: 0,
    lastMonthlyReport: null,
    history: []
  },

  level: 1,
  experience: 0,
  money: 25000,
  wealthGrant108Claimed: false,
  reputation: 12,
  influence: 3,
  publicSupport: 8,

  day: 1,
  month: 1,
  year: 1,
  actionsUsed: 0,
  totalActions: 0,
  totalExpenses: 0,
  completed: [],
  activityHistory: [],
  reviewedNews: [],
  executiveOffice: { tasks: [], files: [], nextId: 1, lastAiReport: 'Your administrative team is standing by.' },
  government: {
    formed: false,
    chiefMinister: '',
    ministers: {},
    treasury: 50000000,
    departments: { Finance: 20, Home: 15, Education: 20, Health: 20, Infrastructure: 25 },
    schemes: [],
    history: [],
    performance: 50
  },
  media: {
    approval: 42,
    trust: 45,
    reach: 18,
    controversies: [],
    history: [],
    lastBriefingDay: 0
  },
  mapState: 'Karnataka',
  mapDistrict: 'Udupi',
  activeTab: 'Dashboard'
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
    return { ...defaults, ...saved };
  } catch {
    return { ...defaults };
  }
}

let state = loadState();
if (!state.elections || typeof state.elections !== 'object') state.elections = JSON.parse(JSON.stringify(defaults.elections));
if (!state.elections.calendar) state.elections.calendar = JSON.parse(JSON.stringify(defaults.elections.calendar));
if (!Array.isArray(state.elections.nominationQueue)) state.elections.nominationQueue = [];
let activeTab = 'Dashboard';
let partySection = 'Overview';
if (!Array.isArray(state.reviewedNews)) state.reviewedNews = [];
if (!state.media || typeof state.media !== 'object') state.media = JSON.parse(JSON.stringify(defaults.media));
for (const key of ['approval', 'trust', 'reach']) {
  if (!Number.isFinite(Number(state.media[key]))) state.media[key] = defaults.media[key];
}
state.media.approval = Math.max(0, Math.min(100, Number(state.media.approval)));
state.media.trust = Math.max(0, Math.min(100, Number(state.media.trust)));
state.media.reach = Math.max(0, Math.min(100, Number(state.media.reach)));
if (!Array.isArray(state.media.controversies)) state.media.controversies = [];
if (!Array.isArray(state.media.history)) state.media.history = [];


// Upgrade older saves without changing the existing party, wealth or career data.
function migratePartyManagementSave() {
  if (!Array.isArray(state.partyMemberRecords)) state.partyMemberRecords = [];
  if (!state.partyLeadership || typeof state.partyLeadership !== 'object') state.partyLeadership = {};
  if (!Array.isArray(state.partyUnits)) state.partyUnits = [];
  if (!Array.isArray(state.partyElectionHistory)) state.partyElectionHistory = [];

  if (state.partyCreated && state.partyMemberRecords.length === 0) {
    const total = Math.max(1, Number(state.partyMembers) || 1);
    state.partyMemberRecords.push({ id: 'founder', name: state.playerName || 'Party Founder', role: 'Founder & National President', loyalty: 95, experience: 100, joined: 'Founding day', isFounder: true });
    for (let i = 2; i <= total; i++) {
      state.partyMemberRecords.push({ id: 'member-' + i, name: 'Party Member ' + String(i).padStart(3, '0'), role: 'General Member', loyalty: 55 + (i % 35), experience: i % 60, joined: 'Existing membership', isFounder: false });
    }
    state.partyLeadership['Founder & National President'] = 'founder';
    saveState();
  }
}

migratePartyManagementSave();

// Migrate older saves safely into the ground-politics system.
function migrateConstituencySave() {
  const defaultsForConstituency = defaults.constituency;
  if (!state.constituency || typeof state.constituency !== 'object') {
    state.constituency = JSON.parse(JSON.stringify(defaultsForConstituency));
  }
  const c = state.constituency;
  if (!Array.isArray(c.localities) || c.localities.length === 0) c.localities = JSON.parse(JSON.stringify(defaultsForConstituency.localities));
  if (!Array.isArray(c.campaigns)) c.campaigns = [];
  if (!Array.isArray(c.projects)) c.projects = [];
  if (!Array.isArray(c.resolvedIssues)) c.resolvedIssues = [];
  if (!c.state) c.state = state.stateName || 'Karnataka';
  if (!c.district) c.district = c.state === 'Karnataka' ? 'Udupi' : 'Other District';
  if (!c.constituencyName) c.constituencyName = (state.hometown || 'Local') + ' Constituency';
  if (!c.selectedLocality || !c.localities.some(x => x.name === c.selectedLocality)) c.selectedLocality = c.localities[0].name;
  if (!Number.isFinite(c.totalVoters)) c.totalVoters = c.localities.reduce((sum, x) => sum + (Number(x.voters) || 0), 0);
}
migrateConstituencySave();

// Safely add the election system to existing career saves.
function migrateElectionSave() {
  if (!state.elections || typeof state.elections !== 'object') {
    state.elections = JSON.parse(JSON.stringify(defaults.elections));
  }
  if (!Array.isArray(state.elections.history)) state.elections.history = [];
  if (!Number.isFinite(state.elections.totalContested)) state.elections.totalContested = state.elections.history.length;
  if (!Number.isFinite(state.elections.totalWon)) state.elections.totalWon = state.elections.history.filter(x => x.result === 'Won').length;
  if (!Number.isFinite(state.elections.totalLost)) state.elections.totalLost = state.elections.history.filter(x => x.result === 'Lost').length;
  if (state.elections.active && !Array.isArray(state.elections.active.activities)) state.elections.active.activities = [];
}
migrateElectionSave();

// Add the personal economy to existing saves without changing wealth or occupation.
function migrateFinanceSave() {
  if (!state.finance || typeof state.finance !== 'object') state.finance = JSON.parse(JSON.stringify(defaults.finance));
  if (!Array.isArray(state.finance.businesses)) state.finance.businesses = [];
  if (!Array.isArray(state.finance.history)) state.finance.history = [];
  for (const key of ['fixedDeposits', 'totalSalaryEarned', 'totalBusinessIncome', 'totalInvestmentIncome']) {
    if (!Number.isFinite(state.finance[key])) state.finance[key] = 0;
  }
}
migrateFinanceSave();

// RAJNITI 1.0.8: one-time personal wealth grant.
// The flag is saved with the career, so reopening the app or installing later
// updates will never credit this grant a second time.
function applyVersion108WealthGrant() {
  if (state.wealthGrant108Claimed) return;

  const grant = 200000;
  state.money = Math.max(0, Number(state.money) || 0) + grant;
  state.wealthGrant108Claimed = true;

  if (!Array.isArray(state.activityHistory)) state.activityHistory = [];
  state.activityHistory.unshift({
    event: 'One-time personal wealth grant credited: ₹2,00,000',
    date: dateText()
  });
  state.activityHistory = state.activityHistory.slice(0, 50);
  saveState();
}
applyVersion108WealthGrant();

const parties = [
  {
    id: 'national-development',
    name: 'National Development Party',
    abbreviation: 'NDP',
    ideology: 'Development Focused',
    popularity: 76,
    members: 125000,
    description: 'A national party focused on infrastructure, economic growth and employment.',
    colour: '#d6ad60'
  },
  {
    id: 'people-welfare',
    name: 'People Welfare Congress',
    abbreviation: 'PWC',
    ideology: 'Social Welfare Focused',
    popularity: 69,
    members: 98000,
    description: 'A party focused on education, healthcare and social welfare.',
    colour: '#7db99b'
  },
  {
    id: 'reform-front',
    name: 'Progressive Reform Front',
    abbreviation: 'PRF',
    ideology: 'Economic Reform',
    popularity: 62,
    members: 67000,
    description: 'A party promoting economic reforms, entrepreneurship and innovation.',
    colour: '#83a8d8'
  },
  {
    id: 'green-future',
    name: 'Green Future Alliance',
    abbreviation: 'GFA',
    ideology: 'Environmental Focused',
    popularity: 54,
    members: 42000,
    description: 'A party focused on sustainability and environmental protection.',
    colour: '#84bd87'
  },
  {
    id: 'national-values',
    name: 'National Values Front',
    abbreviation: 'NVF',
    ideology: 'Traditional Values',
    popularity: 65,
    members: 81000,
    description: 'A party centred on cultural heritage and traditional values.',
    colour: '#c68eaa'
  }
];

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function money(value) {
  return '₹' + Number(value).toLocaleString('en-IN');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}

function icon(name) {
  const icons = {
    Dashboard: '▦',
    Career: '♜',
    Activities: '✦',
    Party: '⚑',
    Constituency: '⌖',
    Elections: '▤',
    Government: '🏛',
    Relationships: '♧',
    Finance: '₹',
    News: '▣',
    Intelligence: '◈',
    'Public Opinion': '♥',
    'India Map': '⌖',
    'Constituency Intel': '▦',
    Profile: '◉'
  };
  return icons[name] || '•';
}

function dailyActionLimit() {
  const role = String(state.role || 'Ordinary Citizen').toLowerCase();
  if (role.includes('prime minister')) return 12;
  if (role.includes('chief minister')) return 10;
  if (role.includes('minister')) return 8;
  if (role === 'mla' || role.includes('member of parliament')) return 7;
  if (role.includes('councillor') || role.includes('panchayat')) return 7;
  if (role.includes('local party leader')) return 6;
  if (role.includes('party volunteer') || role.includes('booth-level') || role.includes('political volunteer')) return 5;
  return 4;
}

function dateText() {
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
  return `${months[state.month - 1]} · Year ${state.year}`;
}

function toast(message) {
  document.querySelector('.toast')?.remove();

  const element = document.createElement('div');
  element.className = 'toast';
  element.textContent = message;
  document.body.appendChild(element);

  setTimeout(() => element.remove(), 2800);
}

function statCard(label, value, sub, symbol) {
  return `
    <article class="stat-card">
      <div class="stat-top">
        <span>${label}</span>
        <span class="stat-icon">${symbol}</span>
      </div>
      <strong>${value}</strong>
      <small>${sub}</small>
    </article>
  `;
}

function shell(content) {
  const nav = [
    'Dashboard', 'Career', 'Activities', 'Party',
    'Constituency', 'Constituency Intel', 'India Map', 'Elections', 'Executive Office', 'Government', 'Parliament', 'Alliances',
    'Relationships', 'Intelligence', 'Public Opinion', 'Finance', 'News', 'Profile'
  ];

  return `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark">R</div>
          <div>
            <b>RAJNITI</b>
            <small>RISE TO POWER</small>
          </div>
        </div>

        <div class="side-label">POLITICAL OFFICE</div>

        <nav>
          ${nav.map(name => `
            <button class="nav-item ${activeTab === name ? 'active' : ''}"
              data-tab="${name}">
              <span>${icon(name)}</span>${name}
            </button>
          `).join('')}
        </nav>

        <div class="sidebar-bottom">
          <div class="season-chip">
            <span class="pulse"></span> CAREER MODE
            <b>OFFLINE</b>
          </div>
          <small>RAJNITI · POLITICAL SIMULATOR</small>
        </div>
      </aside>

      <main class="main-area">
        <header class="topbar">
          <div class="mobile-brand">
            <span class="brand-mark">R</span>
            <b>RAJNITI</b>
          </div>

          <div class="top-context">
            <span class="live-dot"></span>
            INDIA · CAREER SIMULATION
          </div>

          <div class="top-right">
            <span class="day-pill">${dateText()}</span>
            <button class="avatar" data-tab="Profile">
              ${escapeHtml(state.playerName.slice(0, 1).toUpperCase())}
            </button>
          </div>
        </header>

        <section class="page">${content}</section>
      </main>

      <nav class="mobile-nav">
        ${['Dashboard', 'Career', 'Party', 'Constituency', 'Constituency Intel', 'India Map', 'Elections', 'Executive Office', 'Intelligence', 'Public Opinion', 'Finance', 'News', 'Activities', 'Profile']
          .map(name => `
            <button class="${activeTab === name ? 'active' : ''}"
              data-tab="${name}">
              <span>${icon(name)}</span>
              <small>${name}</small>
            </button>
          `).join('')}
      </nav>
    </div>
  `;
}

/* DASHBOARD */

function dashboard() {
  const localities = state.constituency?.localities || [];
  const averageSupport = localities.length
    ? Math.round(localities.reduce((sum, item) => sum + Number(item.support || 0), 0) / localities.length)
    : Number(state.publicSupport || 0);
  const latestActivity = (state.activityHistory || []).slice(0, 3);

  return `
    <div class="page-heading command-heading">
      <div>
        <div class="eyebrow">NATIONAL POLITICAL COMMAND CENTRE</div>
        <h1>Good ${state.day < 15 ? 'day' : 'evening'}, <em>${escapeHtml(state.playerName)}</em></h1>
        <p>${dateText()} · ${escapeHtml(state.stateName || 'India')} political desk</p>
      </div>
      <div class="date-card">
        <span>MONTHLY SIMULATION CLOCK</span>
        <b>${dateText()}</b>
        <small>${Math.max(0, dailyActionLimit() - state.actionsUsed)} monthly actions remaining</small>
      </div>
    </div>

    ${!state.characterCreated ? `
      <section class="panel character-alert">
        <h2>Create your politician</h2>
        <p>Start your journey by creating your political identity.</p>
        <button class="primary-btn" data-action="create-character">CREATE CHARACTER →</button>
      </section>
    ` : ''}

    <section class="command-hero">
      <div class="command-hero-copy">
        <span class="gold-tag">YOUR POLITICAL BRIEFING</span>
        <h2>From the ground.<br><em>To the top.</em></h2>
        <p>Monitor your organisation, understand local sentiment and plan your next political move.</p>
        <div class="command-hero-actions">
          <button class="primary-btn" data-tab="Constituency">OPEN CONSTITUENCY →</button>
          <button class="secondary-btn" data-action="end-day">ADVANCE ONE DAY</button>
        </div>
      </div>
      <div class="command-hero-seal">
        <div class="command-seal-ring">🇮🇳</div>
        <span>INDIA · CAREER MODE</span>
      </div>
    </section>

    <div class="command-section-head">
      <div><span class="eyebrow">LIVE POLITICAL INDICATORS</span><h2>Your current standing</h2></div>
      <span class="command-live">● SIMULATION DATA</span>
    </div>
    <div class="stats-grid command-stats">
      ${statCard('PERSONAL WEALTH', money(state.money), 'Available personal funds', '₹')}
      ${statCard('REPUTATION', state.reputation + '/100', 'Public image', '✦')}
      ${statCard('POLITICAL INFLUENCE', state.influence + '/100', 'Political reach', '♜')}
      ${statCard('PUBLIC SUPPORT', state.publicSupport + '%', 'Estimated support', '♥')}
    </div>

    <div class="command-main-grid">
      <section class="panel command-panel">
        <div class="command-section-head compact">
          <div><span class="eyebrow">YOUR ORGANISATION</span><h2>Political headquarters</h2></div>
          <span class="command-symbol">⚑</span>
        </div>
        <h3>${escapeHtml(state.party)}</h3>
        <p class="panel-description">${escapeHtml(state.partyPosition)} · ${Number(state.partyMembers || 1).toLocaleString('en-IN')} members</p>
        <div class="command-progress-row"><span>Party popularity</span><b>${Number(state.partyPopularity || 0)}/100</b></div>
        <div class="command-progress"><i style="width:${Math.max(0, Math.min(100, Number(state.partyPopularity || 0)))}%"></i></div>
        <button class="secondary-btn full" data-tab="Party">OPEN PARTY HEADQUARTERS →</button>
      </section>

      <section class="panel command-panel">
        <div class="command-section-head compact">
          <div><span class="eyebrow">GROUND NETWORK</span><h2>Constituency situation</h2></div>
          <span class="command-symbol">⌖</span>
        </div>
        <h3>${escapeHtml(state.constituency?.constituencyName || 'Your constituency')}</h3>
        <p class="panel-description">${escapeHtml(state.constituency?.district || 'District')}, ${escapeHtml(state.constituency?.state || state.stateName || 'India')}</p>
        <div class="command-mini-metrics">
          <div><b>${Number(state.constituency?.totalVoters || 0).toLocaleString('en-IN')}</b><small>Registered voters</small></div>
          <div><b>${averageSupport}%</b><small>Locality support index</small></div>
          <div><b>${localities.length}</b><small>Tracked localities</small></div>
        </div>
        <button class="secondary-btn full" data-tab="Constituency">MANAGE CONSTITUENCY →</button>
      </section>

      <section class="panel command-panel">
        <div class="command-section-head compact">
          <div><span class="eyebrow">POLITICAL INTELLIGENCE</span><h2>Situation analysis</h2></div>
          <span class="command-symbol">◈</span>
        </div>
        <p class="panel-description">Review simulated polling, rival organisations and regional sentiment before your next move.</p>
        <div class="command-alert-line"><span class="command-alert-dot"></span><span>Regional intelligence briefing available</span></div>
        <button class="secondary-btn full" data-tab="Intelligence">OPEN INTELLIGENCE DESK →</button>
      </section>

      <section class="panel command-panel">
        <div class="command-section-head compact">
          <div><span class="eyebrow">NATIONAL NEWSROOM</span><h2>Political developments</h2></div>
          <span class="command-symbol">▤</span>
        </div>
        <p class="panel-description">Follow fictional in-game developments, public issues and policy debates.</p>
        <div class="command-alert-line"><span class="command-alert-dot gold"></span><span>Daily briefing ready to review</span></div>
        <button class="secondary-btn full" data-tab="News">OPEN NEWSROOM →</button>
      </section>
    </div>

    <div class="command-bottom-grid">
      <section class="panel">
        <div class="command-section-head compact">
          <div><span class="eyebrow">CAREER TRACKER</span><h2>Your political journey</h2></div>
        </div>
        <h3>${escapeHtml(state.role)}</h3>
        <p class="panel-description">Level ${state.level} · ${Number(state.experience || 0)} XP · Age ${state.age}</p>
        <div class="command-progress"><i style="width:${Math.max(0, Math.min(100, Number(state.experience || 0) % 100))}%"></i></div>
        <button class="secondary-btn full" data-tab="Career">VIEW CAREER PROGRESSION →</button>
      </section>
      <section class="panel">
        <div class="command-section-head compact">
          <div><span class="eyebrow">RECENT ACTIVITY</span><h2>Political log</h2></div>
        </div>
        ${latestActivity.length ? latestActivity.map(item => `
          <div class="command-log-row"><span class="command-log-dot"></span><div><b>${escapeHtml(item.event || 'Political activity')}</b><small>${escapeHtml(item.date || 'Recorded activity')}</small></div></div>
        `).join('') : '<p class="panel-description">Your political activity history will appear here as you progress.</p>'}
        <button class="secondary-btn full" data-tab="Activities">VIEW ACTIVITY LOG →</button>
      </section>
    </div>

    <section class="panel command-calendar">
      <div><span class="eyebrow">SIMULATION CALENDAR</span><h2>${dateText()}</h2><p class="panel-description">Advance one day to refresh daily actions. Monthly income, business profits, fixed-deposit interest and expenses are processed at month change.</p></div>
      <button class="primary-btn" data-action="end-day">ADVANCE ONE DAY →</button>
    </section>
  `;
}

let selectedIntelRegion = 'National';

function runIntelligenceStrategy(action) {
  if (!state.strategyIntel || typeof state.strategyIntel !== 'object') {
    state.strategyIntel = { actions: 0, history: [], lastAction: '' };
  }
  const intel = state.strategyIntel;
  const actions = {
    ground: { title: 'Ground network assessment', cost: 12000, reputation: 2, support: 2, party: 2, detail: 'Mapped volunteer coverage and identified under-served localities.' },
    alliance: { title: 'Alliance channel assessment', cost: 18000, reputation: 1, support: 1, party: 3, detail: 'Reviewed potential cooperation and coalition compatibility.' },
    media: { title: 'Narrative and media review', cost: 9000, reputation: 2, support: 2, party: 1, detail: 'Prepared a response brief around public concerns and communication risks.' }
  };
  const item = actions[action];
  if (!item) return;
  if (Number(state.money || 0) < item.cost) {
    toast('Insufficient personal funds for this intelligence exercise.');
    return;
  }
  state.money = Number(state.money || 0) - item.cost;
  state.reputation = Math.max(0, Number(state.reputation || 0) + item.reputation);
  state.publicSupport = Math.min(100, Number(state.publicSupport || 0) + item.support);
  state.partyPopularity = Math.min(100, Number(state.partyPopularity || 0) + item.party);
  intel.actions += 1;
  intel.lastAction = item.title;
  intel.history.unshift({ title: item.title, detail: item.detail, date: dateText() });
  intel.history = intel.history.slice(0, 8);
  saveState();
  render();
  toast('Intelligence assessment completed. Strategic indicators updated.');
}

function intelligencePage() {
  const regions = ['National', 'Karnataka', 'Kerala', 'Tamil Nadu', 'Maharashtra', 'Telangana', 'Delhi', 'Uttar Pradesh'];
  const regionIndex = Math.max(0, regions.indexOf(selectedIntelRegion));
  const playerSupport = Math.max(1, Math.min(85, Number(state.publicSupport || 8) + (regionIndex === 0 ? 0 : (regionIndex * 2 - 5))));
  const rivalOne = Math.max(5, 34 - Math.floor(playerSupport / 5) + (regionIndex % 3));
  const rivalTwo = Math.max(5, 27 + (regionIndex % 4) - Math.floor(playerSupport / 8));
  const undecided = Math.max(3, 100 - playerSupport - rivalOne - rivalTwo);
  const localities = state.constituency?.localities || [];
  const trend = playerSupport >= 25 ? 'Positive momentum' : playerSupport >= 12 ? 'Building presence' : 'Early-stage presence';

  return `
    <div class="page-heading">
      <div><div class="eyebrow">POLITICAL INTELLIGENCE BUREAU</div><h1>Intelligence <em>desk</em></h1><p>Study the simulated political landscape and plan your next move.</p></div>
      <div class="date-card"><span>BRIEFING DATE</span><b>${dateText()}</b><small>${dateText()}</small></div>
    </div>
    <section class="panel intelligence-disclaimer"><span class="gold-tag">GAME SIMULATION</span><b>All polling figures, rival organisations and regional indicators on this screen are fictional gameplay estimates.</b><small>They do not represent real political parties, election forecasts or public opinion data.</small></section>
    <section class="panel intelligence-region-panel">
      <div class="command-section-head"><div><span class="eyebrow">REGIONAL MONITOR</span><h2>Select an intelligence region</h2></div><span class="command-symbol">⌖</span></div>
      <div class="intel-region-grid">
        ${regions.map(region => `<button class="intel-region ${selectedIntelRegion === region ? 'selected' : ''}" data-intel-region="${region}">${region}</button>`).join('')}
      </div>
      <div class="intel-region-summary"><div><span class="eyebrow">CURRENT FOCUS</span><h2>${escapeHtml(selectedIntelRegion)}</h2><p class="panel-description">Regional political overview · ${dateText()}</p></div><div class="intel-trend"><b>${trend}</b><small>Player support index</small></div></div>
    </section>
    <div class="command-section-head"><div><span class="eyebrow">SIMULATED POLLING TRACKER</span><h2>Estimated support landscape</h2></div></div>
    <section class="panel intel-poll-panel">
      <div class="intel-poll-row"><div><b>Your movement</b><small>${escapeHtml(state.party || 'Independent')}</small></div><strong>${playerSupport}%</strong></div>
      <div class="intel-poll-track"><i class="player" style="width:${playerSupport}%"></i></div>
      <div class="intel-poll-row"><div><b>Rival organisation A</b><small>Fictional in-game competitor</small></div><strong>${rivalOne}%</strong></div>
      <div class="intel-poll-track"><i class="rival-a" style="width:${rivalOne}%"></i></div>
      <div class="intel-poll-row"><div><b>Rival organisation B</b><small>Fictional in-game competitor</small></div><strong>${rivalTwo}%</strong></div>
      <div class="intel-poll-track"><i class="rival-b" style="width:${rivalTwo}%"></i></div>
      <div class="intel-poll-row"><div><b>Undecided voters</b><small>Uncommitted simulation segment</small></div><strong>${undecided}%</strong></div>
      <div class="intel-poll-track"><i class="undecided" style="width:${undecided}%"></i></div>
      <small class="intel-footnote">Illustrative game values only. Percentages are normalised to 100%.</small>
    </section>
    <div class="command-section-head"><div><span class="eyebrow">LOCAL SENTIMENT</span><h2>Constituency intelligence</h2></div><button class="text-action" data-tab="Constituency">MANAGE LOCALITIES →</button></div>
    <div class="intel-locality-grid">
      ${localities.map(item => `
        <article class="panel intel-locality-card"><span class="eyebrow">${escapeHtml(item.type || 'Locality')}</span><h3>${escapeHtml(item.name)}</h3><div class="intel-locality-stats"><div><b>${Number(item.support || 0)}%</b><small>Support index</small></div><div><b>${Number(item.influence || 0)}/100</b><small>Influence</small></div><div><b>${Number(item.voters || 0).toLocaleString('en-IN')}</b><small>Voters</small></div></div><p class="panel-description">Priority issue: ${escapeHtml(item.issue || 'Community development')}</p></article>
      `).join('')}
    </div>
    <div class="command-section-head"><div><span class="eyebrow">ELECTION STRATEGY ROOM</span><h2>Seat outlook & political risks</h2></div><span class="gold-tag">SIMULATED ESTIMATE</span></div>
    <section class="intel-strategy-grid">
      <article class="panel">
        <span class="eyebrow">CURRENT REGIONAL OUTLOOK</span>
        <h3>${playerSupport >= 40 ? 'Competitive position' : playerSupport >= 22 ? 'Emerging challenger' : 'Organisation-building phase'}</h3>
        <div class="intel-outlook-number">${Math.max(0, Math.min(100, Math.round(playerSupport * 1.35 + Number(state.reputation || 0) * .12)))}<small>/100</small></div>
        <p class="panel-description">Strategic readiness index for ${escapeHtml(selectedIntelRegion)}. This is a gameplay indicator, not a real seat forecast.</p>
      </article>
      <article class="panel">
        <span class="eyebrow">RISK REGISTER</span>
        <h3>${playerSupport < 15 ? 'Weak booth-level presence' : Number(state.reputation || 0) < 25 ? 'Leadership credibility gap' : 'Maintain local momentum'}</h3>
        <p class="panel-description">${playerSupport < 15 ? 'Expand volunteer coverage and listen to local issues before committing campaign resources.' : Number(state.reputation || 0) < 25 ? 'Prioritise transparent delivery and follow-through on public commitments.' : 'Protect constituency relationships and monitor emerging local concerns.'}</p>
      </article>
    </section>
    <div class="command-section-head"><div><span class="eyebrow">AI POLITICAL ADVISER</span><h2>Commission a strategy assessment</h2></div></div>
    <section class="intel-adviser-grid">
      <article class="panel"><span class="eyebrow">FIELD INTELLIGENCE · ₹12,000</span><h3>Ground network assessment</h3><p class="panel-description">Review volunteer coverage, locality priorities and organisation gaps.</p><button class="primary-btn" data-intel-strategy="ground">RUN ASSESSMENT</button></article>
      <article class="panel"><span class="eyebrow">POLITICAL NEGOTIATIONS · ₹18,000</span><h3>Alliance channel assessment</h3><p class="panel-description">Evaluate possible cooperation, partner compatibility and coalition risks.</p><button class="primary-btn" data-intel-strategy="alliance">RUN ASSESSMENT</button></article>
      <article class="panel"><span class="eyebrow">COMMUNICATIONS · ₹9,000</span><h3>Narrative and media review</h3><p class="panel-description">Identify public concerns and prepare a communication response brief.</p><button class="primary-btn" data-intel-strategy="media">RUN ASSESSMENT</button></article>
    </section>
    <section class="panel">
      <div class="command-section-head"><div><span class="eyebrow">CONFIDENTIAL BRIEFING LOG</span><h2>Recent intelligence reports</h2></div></div>
      ${(state.strategyIntel?.history || []).length ? state.strategyIntel.history.map(report => `<div class="intel-report-row"><b>${escapeHtml(report.title)}</b><small>${escapeHtml(report.date || '')}</small><p class="panel-description">${escapeHtml(report.detail)}</p></div>`).join('') : '<p class="panel-description">No commissioned reports yet. Select an assessment above to generate your first briefing.</p>'}
    </section>
    <section class="panel intelligence-method"><span class="eyebrow">STRATEGIC NOTE</span><h3>Build your organisation before chasing headline numbers</h3><p class="panel-description">Use constituency outreach, issue surveys, volunteer mobilisation and party-building activities to improve your standing over time.</p><button class="primary-btn" data-tab="Activities">PLAN POLITICAL ACTIVITIES →</button></section>
  `;
}


/* RAJNITI 1.1.4 — PUBLIC OPINION & MEDIA INFLUENCE */
function publicOpinionPage() {
  const media = state.media;
  const active = media.controversies.filter(item => !item.resolved);
  const localSupport = Math.max(0, Math.min(100, Number(state.publicSupport || 8)));
  const issueMood = [
    { label: 'Development', score: Math.min(95, 42 + Number(state.constituency?.projects?.length || 0) * 7), note: 'Roads, water and local infrastructure' },
    { label: 'Employment', score: Math.max(18, Math.min(90, 48 + (state.occupation !== 'Unemployed' ? 10 : 0))), note: 'Jobs and livelihood opportunities' },
    { label: 'Governance', score: Math.max(20, Math.min(90, 38 + Number(state.reputation || 0) * .35)), note: 'Trust in leadership and administration' },
    { label: 'Public services', score: Math.max(20, Math.min(90, 45 + Number(state.constituency?.resolvedIssues?.length || 0) * 5)), note: 'Healthcare, education and civic services' }
  ];
  const approval = Math.max(0, Math.min(100, Math.round((Number(media.approval) * .55) + (localSupport * .25) + (Number(state.reputation || 0) * .20))));
  const regionNames = [...new Set([state.stateName || 'Karnataka', 'Kerala', 'Tamil Nadu', 'Maharashtra', 'Delhi'])];
  const regional = regionNames.map((name, index) => ({
    name,
    value: Math.max(5, Math.min(95, approval + (index === 0 ? 0 : [0, -5, 3, -8, 6][index])))
  }));
  return `
    <div class="page-heading">
      <div><div class="eyebrow">PUBLIC SENTIMENT & COMMUNICATIONS BUREAU</div><h1>Public <em>opinion</em></h1>
      <p>Track approval, media reach, public mood and political communication.</p></div>
      <div class="date-card"><span>OPINION BRIEFING</span><b>${dateText()}</b><small>${dateText()}</small></div>
    </div>
    <section class="panel po-disclaimer"><span class="gold-tag">OFFLINE GAME SIMULATION</span><b>All ratings, media stories and public mood indicators are fictional gameplay estimates.</b><small>They are not real surveys, news reports or public opinion measurements.</small></section>
    <div class="stats-grid po-stats">
      ${statCard('PUBLIC APPROVAL', approval + '%', 'Overall leadership approval estimate', '♥')}
      ${statCard('PUBLIC TRUST', media.trust + '/100', 'Confidence in your communication', '✦')}
      ${statCard('MEDIA REACH', media.reach + '/100', 'How widely your message travels', '▤')}
      ${statCard('LOCAL SUPPORT', localSupport + '%', 'Current career support indicator', '♟')}
    </div>
    <div class="po-grid">
      <section class="panel">
        <div class="command-section-head"><div><span class="eyebrow">PUBLIC MOOD TRACKER</span><h2>Issue-by-issue sentiment</h2></div><span class="command-symbol">◉</span></div>
        ${issueMood.map(item => `<div class="po-mood-row"><div><span>${item.label}</span><b>${Math.round(item.score)}/100</b></div><i><em style="width:${item.score}%"></em></i><small>${item.note}</small></div>`).join('')}
      </section>
      <section class="panel">
        <div class="command-section-head"><div><span class="eyebrow">MEDIA STRATEGY</span><h2>Choose your response</h2></div><span class="command-symbol">▤</span></div>
        <p class="panel-description">Press conferences cost money and use one daily action. Choose a clear, accountable message.</p>
        <div class="po-action-card"><div><b>Hold a press conference</b><small>Cost ₹1,000 · +trust · +reach</small></div><button class="primary-btn" data-action="media-press">HOLD BRIEFING</button></div>
        <div class="po-action-card"><div><b>Community listening session</b><small>Cost ₹500 · improve public trust</small></div><button class="secondary-btn" data-action="media-listen">LISTEN TO CITIZENS</button></div>
        <div class="po-action-card"><div><b>Publish policy explainer</b><small>Cost ₹750 · expand media reach</small></div><button class="secondary-btn" data-action="media-policy">PUBLISH EXPLAINER</button></div>
      </section>
      <section class="panel">
        <div class="command-section-head"><div><span class="eyebrow">REGIONAL OPINION</span><h2>State-wise approval</h2></div><span class="command-symbol">⌖</span></div>
        ${regional.map(item => `<div class="po-region-row"><span>${escapeHtml(item.name)}</span><b>${item.value}%</b><i><em style="width:${item.value}%"></em></i></div>`).join('')}
        <small class="po-footnote">Regional values are generated estimates based on your current career approval.</small>
      </section>
      <section class="panel">
        <div class="command-section-head"><div><span class="eyebrow">CRISIS MANAGEMENT</span><h2>Public controversies</h2></div><span class="command-symbol">⚑</span></div>
        ${active.length ? active.map(item => `<div class="po-crisis"><b>${escapeHtml(item.title)}</b><p>${escapeHtml(item.description)}</p><button class="secondary-btn" data-media-resolve="${escapeHtml(item.id)}">ISSUE PUBLIC RESPONSE</button></div>`).join('') : '<p class="panel-description">No active controversy. Your communications desk is clear.</p>'}
        <div class="po-footnote">New fictional political situations may arise as the in-game calendar advances.</div>
      </section>
    </div>
    <section class="panel po-history"><div class="command-section-head"><div><span class="eyebrow">COMMUNICATION LOG</span><h2>Recent media activity</h2></div></div>
      ${media.history.length ? media.history.slice(0,6).map(item => `<div class="po-log-row"><span>${escapeHtml(item.event)}</span><small>${escapeHtml(item.date)}</small></div>`).join('') : '<p class="panel-description">No media activity recorded yet. Hold a briefing or publish a policy explainer to begin.</p>'}
    </section>
  `;
}

function recordMediaEvent(event) {
  state.media.history.unshift({ event, date: dateText() });
  state.media.history = state.media.history.slice(0, 30);
}

function mediaAction(type) {
  if (!state.characterCreated) return toast('Create your politician first.');
  if (state.actionsUsed >= dailyActionLimit()) return toast('No monthly actions remaining.');
  const actions = {
    press: { cost: 1000, trust: 7, reach: 9, approval: 3, label: 'Press conference held' },
    listen: { cost: 500, trust: 9, reach: 2, approval: 2, label: 'Community listening session completed' },
    policy: { cost: 750, trust: 3, reach: 10, approval: 2, label: 'Policy explainer published' }
  };
  const action = actions[type];
  if (!action) return;
  if (state.money < action.cost) return toast(`You need ${money(action.cost)}.`);
  state.money -= action.cost;
  state.totalExpenses = Number(state.totalExpenses || 0) + action.cost;
  state.actionsUsed++;
  state.totalActions = Number(state.totalActions || 0) + 1;
  state.media.trust = Math.min(100, state.media.trust + action.trust);
  state.media.reach = Math.min(100, state.media.reach + action.reach);
  state.media.approval = Math.min(100, state.media.approval + action.approval);
  state.reputation = Math.min(100, Number(state.reputation || 0) + 1);
  recordMediaEvent(action.label);
  saveState();
  render();
  toast(`${action.label}. Public confidence improved.`);
}

function resolveMediaControversy(id) {
  const item = state.media.controversies.find(entry => entry.id === id && !entry.resolved);
  if (!item) return;
  if (state.actionsUsed >= dailyActionLimit()) return toast('No monthly actions remaining.');
  if (state.money < 1200) return toast('You need ₹1,200 for a response team.');
  state.money -= 1200;
  state.totalExpenses = Number(state.totalExpenses || 0) + 1200;
  state.actionsUsed++;
  item.resolved = true;
  state.media.trust = Math.min(100, state.media.trust + 8);
  state.media.approval = Math.min(100, state.media.approval + 4);
  state.reputation = Math.min(100, Number(state.reputation || 0) + 2);
  recordMediaEvent('Public response issued: ' + item.title);
  saveState();
  render();
  toast('Crisis response issued. Trust is recovering.');
}

function advanceMediaCycle() {
  if (!state.media || !Array.isArray(state.media.controversies)) return;
  // A rare, fictional event creates a gameplay decision; it never uses real news.
  if (Math.random() < 0.22 && state.media.controversies.filter(item => !item.resolved).length < 2) {
    const events = [
      { title: 'Questions over a delayed local project', description: 'A fictional news panel is asking why a community project has moved slowly.' },
      { title: 'Opposition questions your public statement', description: 'A rival spokesperson challenges the clarity of a recent policy announcement.' },
      { title: 'Residents demand clearer service updates', description: 'A local discussion highlights gaps in public communication and follow-up.' }
    ];
    const event = events[Math.floor(Math.random() * events.length)];
    const id = 'media-' + state.year + '-' + state.month + '-' + state.day + '-' + state.media.controversies.length;
    state.media.controversies.unshift({ id, ...event, resolved: false });
    state.media.approval = Math.max(0, state.media.approval - 3);
    state.media.trust = Math.max(0, state.media.trust - 2);
    recordMediaEvent('Public controversy reported: ' + event.title);
  }
}

function newsPage() {
  const stories = [
    { category: 'PUBLIC SERVICES', title: 'Local infrastructure review announced', summary: 'Residents are discussing road maintenance, drinking water and public transport priorities across several localities.', impact: 'Community issues', tone: 'gold' },
    { category: 'POLICY DEBATE', title: 'Youth employment becomes a major discussion', summary: 'A fictional policy debate is drawing attention to vocational training, entry-level jobs and small-business opportunities.', impact: 'Employment policy', tone: 'blue' },
    { category: 'PARTY POLITICS', title: 'Organisations prepare for the next political cycle', summary: 'Local groups are reviewing membership, volunteer networks and their public communication strategy.', impact: 'Party organisation', tone: 'gold' },
    { category: 'GOVERNANCE', title: 'Public budget priorities under discussion', summary: 'The in-game public debate focuses on balancing infrastructure, education, healthcare and municipal services.', impact: 'Public finance', tone: 'blue' }
  ];
  const reviewed = Array.isArray(state.reviewedNews) ? state.reviewedNews : [];

  return `
    <div class="page-heading"><div><div class="eyebrow">RAJNITI NEWS NETWORK</div><h1>Political <em>newsroom</em></h1><p>Follow the fictional events and policy debates shaping your political world.</p></div><div class="date-card"><span>MONTHLY EDITION</span><b>${dateText()}</b><small>${dateText()}</small></div></div>
    <section class="panel newsroom-banner"><div><span class="gold-tag">EDITORIAL BRIEFING</span><h2>Understand the issue. Shape the response.</h2><p class="panel-description">News stories are part of the offline simulation. Review developments and use them to guide your political priorities.</p></div><div class="newsroom-mark">▤</div></section>
    <div class="newsroom-layout">
      <div class="newsroom-stories">
        ${stories.map((story, index) => `
          <article class="panel newsroom-story">
            <div class="news-story-top"><span class="news-category ${story.tone}">${story.category}</span><small>${dateText()}</small></div>
            <h3>${story.title}</h3><p class="panel-description">${story.summary}</p>
            <div class="news-story-bottom"><span>FOCUS: ${story.impact}</span><button class="news-review ${reviewed.includes(index) ? 'reviewed' : ''}" data-review-news="${index}">${reviewed.includes(index) ? '✓ REVIEWED' : 'MARK AS REVIEWED'}</button></div>
          </article>
        `).join('')}
      </div>
      <aside class="panel newsroom-sidebar"><span class="eyebrow">YOUR POLITICAL PROFILE</span><h3>${escapeHtml(state.role)}</h3><p class="panel-description">${escapeHtml(state.party)}</p><div class="party-stat-row"><span>Reputation</span><b>${state.reputation}/100</b></div><div class="party-stat-row"><span>Influence</span><b>${state.influence}/100</b></div><div class="party-stat-row"><span>Public support</span><b>${state.publicSupport}%</b></div><button class="secondary-btn full" data-tab="Intelligence">REVIEW INTELLIGENCE →</button><button class="secondary-btn full" data-tab="Government">GOVERNMENT DESK →</button></aside>
    </div>
    <section class="panel newsroom-note"><span class="eyebrow">OFFLINE WORLD</span><p class="panel-description">RAJNITI's newsroom uses fictional events generated for gameplay. No live political news or real-world party information is used.</p></section>
  `;
}


/* PARTY SYSTEM */

function partyPage() {
  if (!state.characterCreated) {
    return `
      <div class="page-heading">
        <div>
          <div class="eyebrow">POLITICAL ORGANISATION</div>
          <h1>Political <em>parties</em></h1>
          <p>Create your politician before joining a party.</p>
        </div>
      </div>
      <section class="panel">
        <h2>Character required</h2>
        <button class="primary-btn" data-action="create-character">
          CREATE CHARACTER →
        </button>
      </section>
    `;
  }

  if (state.partyCreated) {
    return createdPartyPage();
  }

  if (state.partyId !== 'independent') {
    return joinedPartyPage();
  }

  return `
    <div class="page-heading">
      <div>
        <div class="eyebrow">POLITICAL ORGANISATION</div>
        <h1>Political <em>parties</em></h1>
        <p>Choose your political organisation or establish your own.</p>
      </div>
    </div>

    <section class="panel party-independent">
      <span class="gold-tag">CURRENT STATUS</span>
      <h2>Independent Politician</h2>
      <p class="panel-description">
        You are currently independent. Join an organisation
        to access its membership and leadership opportunities.
      </p>
      <div class="party-stat-row">
        <span>Political identity</span>
        <b>Independent</b>
      </div>
    </section>

    <div class="section-heading">
      <div>
        <span class="eyebrow">EXISTING ORGANISATIONS</span>
        <h2>Explore political parties</h2>
      </div>
    </div>

    <div class="party-grid">
      ${parties.map(party => `
        <article class="panel party-card">
          <div class="party-card-top">
            <div class="party-emblem">${party.abbreviation.slice(0, 1)}</div>
            <span class="gold-tag">${party.abbreviation}</span>
          </div>
          <h3>${party.name}</h3>
          <p class="panel-description">${party.description}</p>

          <div class="party-stat-row">
            <span>Ideology</span>
            <b>${party.ideology}</b>
          </div>
          <div class="party-stat-row">
            <span>Members</span>
            <b>${party.members.toLocaleString('en-IN')}</b>
          </div>
          <div class="party-stat-row">
            <span>Popularity</span>
            <b>${party.popularity}/100</b>
          </div>

          <button class="secondary-btn full"
            data-join-party="${party.id}">
            APPLY FOR MEMBERSHIP →
          </button>
        </article>
      `).join('')}
    </div>

    <section class="panel create-party-panel">
      <span class="gold-tag">LEAD YOUR OWN MOVEMENT</span>
      <h2>Start your own political party</h2>
      <p class="panel-description">
        Build an organisation from the ground up.
        Choose its name, identity and political direction.
      </p>
      <button class="primary-btn" data-action="show-create-party">
        CREATE A POLITICAL PARTY →
      </button>
      <small>Formation cost: ₹10,000</small>
    </section>
  `;
}

function joinedPartyPage() {
  const party = parties.find(p => p.id === state.partyId);

  const name = party ? party.name : state.party;
  const ideology = party ? party.ideology : state.partyIdeology;
  const members = party ? party.members : state.partyMembers;
  const popularity = party ? party.popularity : state.partyPopularity;

  return `
    <div class="page-heading">
      <div>
        <div class="eyebrow">YOUR POLITICAL ORGANISATION</div>
        <h1>Party <em>headquarters</em></h1>
        <p>Manage your membership and political standing.</p>
      </div>
    </div>

    <section class="panel party-headquarters">
      <div class="party-large-emblem">
        ${escapeHtml(state.partyAbbreviation.slice(0, 1))}
      </div>
      <span class="gold-tag">${escapeHtml(state.partyAbbreviation)}</span>
      <h2>${escapeHtml(name)}</h2>
      <p class="panel-description">${escapeHtml(ideology)}</p>

      <div class="party-stat-row">
        <span>Your position</span>
        <b>${escapeHtml(state.partyPosition)}</b>
      </div>
      <div class="party-stat-row">
        <span>Organisation membership</span>
        <b>${Number(members).toLocaleString('en-IN')}</b>
      </div>
      <div class="party-stat-row">
        <span>Party popularity</span>
        <b>${popularity}/100</b>
      </div>
      <div class="party-stat-row">
        <span>Your party treasury</span>
        <b>${money(state.partyFunds)}</b>
      </div>
    </section>

    <div class="stats-grid" style="margin-top:15px">
      ${statCard('PARTY MEMBERS', Number(members).toLocaleString('en-IN'), 'Organisation size', '♟')}
      ${statCard('PARTY POPULARITY', popularity + '/100', 'Public standing', '✦')}
      ${statCard('YOUR INFLUENCE', state.influence + '/100', 'Personal influence', '♜')}
      ${statCard('PARTY TREASURY', money(state.partyFunds), 'Available party funds', '₹')}
    </div>

    <section class="panel" style="margin-top:15px">
      <span class="eyebrow">MEMBERSHIP DEVELOPMENT</span>
      <h3>Build your position inside the party</h3>
      <p class="panel-description">
        Attend internal meetings and develop your organisational influence.
      </p>
      <button class="primary-btn" data-action="party-meeting">
        ATTEND PARTY MEETING · ₹300 →
      </button>
    </section>

    <section class="panel" style="margin-top:15px">
      <span class="eyebrow">POLITICAL FINANCES</span>
      <h3>Contribute to party funds</h3>
      <p class="panel-description">
        Make a voluntary contribution from your personal wealth.
      </p>
      <button class="secondary-btn" data-action="party-donate">
        CONTRIBUTE ₹1,000 →
      </button>
    </section>

    <section class="panel" style="margin-top:15px">
      <span class="eyebrow">MEMBERSHIP OPTIONS</span>
      <button class="secondary-btn full" data-action="leave-party">
        LEAVE POLITICAL PARTY
      </button>
    </section>
  `;
}

const leadershipPositions = [
  'National Working President', 'National General Secretary',
  'National Treasurer', 'State President', 'District President',
  'Constituency President', 'Block President', 'Booth President'
];

function getPartyMember(id) {
  return state.partyMemberRecords.find(member => member.id === id);
}

function partySectionTabs() {
  return ['Overview', 'Leadership', 'Members', 'Organisation', 'Elections'].map(section => `
    <button class="secondary-btn ${partySection === section ? 'active' : ''}" data-party-section="${section}">${section}</button>
  `).join('');
}

function partyOverviewSection() {
  return `
    <section class="panel">
      <span class="eyebrow">PARTY PERFORMANCE</span>
      <h3>Grow your organisation</h3>
      <p class="panel-description">Run a recruitment campaign to expand membership and improve the party's public standing.</p>
      <button class="primary-btn" data-action="recruit-members">ORGANISE MEMBERSHIP DRIVE · ₹1,000 →</button>
    </section>
    <div class="content-grid" style="margin-top:15px">
      <section class="panel"><span class="eyebrow">LEADERSHIP</span><h3>${Object.keys(state.partyLeadership).length} appointments</h3><p class="panel-description">Build a leadership team from national to booth level.</p><button class="secondary-btn full" data-party-section="Leadership">MANAGE LEADERSHIP →</button></section>
      <section class="panel"><span class="eyebrow">ORGANISATION</span><h3>${state.partyUnits.length} units</h3><p class="panel-description">Create state, district, constituency, block and booth units.</p><button class="secondary-btn full" data-party-section="Organisation">MANAGE UNITS →</button></section>
    </div>
    <section class="panel" style="margin-top:15px"><span class="eyebrow">RECENT PARTY ACTIVITY</span>
      ${state.partyHistory.length ? state.partyHistory.slice(0,6).map(item => `<div class="career-step"><b>${escapeHtml(item.event)}</b><small>${escapeHtml(item.date)}</small></div>`).join('') : '<p class="panel-description">Your party journey starts here.</p>'}
    </section>`;
}

function partyLeadershipSection() {
  const appointments = Object.entries(state.partyLeadership);
  return `
    <section class="panel"><span class="eyebrow">PARTY COMMAND STRUCTURE</span><h2>Leadership appointments</h2>
      <p class="panel-description">Appoint existing members to offices. A member can hold only one leadership position at a time.</p>
      ${appointments.length ? appointments.map(([position, memberId]) => { const member = getPartyMember(memberId); return `<div class="career-step"><div><b>${escapeHtml(position)}</b><small>${escapeHtml(member?.name || 'Vacant')}</small></div>${position !== 'Founder & National President' ? `<button class="secondary-btn" data-remove-position="${escapeHtml(position)}">REMOVE</button>` : '<span class="current-label">FOUNDER</span>'}</div>`; }).join('') : '<p class="panel-description">No appointments yet.</p>'}
    </section>
    <section class="panel" style="margin-top:15px"><span class="eyebrow">APPOINT A LEADER</span><h3>Fill an organisational position</h3>
      <form id="appoint-leader-form" class="creator-grid">
        <div class="creator-field"><label for="leadershipPosition">Position</label><select id="leadershipPosition" name="position">${leadershipPositions.map(position => `<option value="${escapeHtml(position)}">${escapeHtml(position)}</option>`).join('')}</select></div>
        <div class="creator-field"><label for="leadershipMember">Party member</label><select id="leadershipMember" name="memberId">${state.partyMemberRecords.filter(member => !Object.values(state.partyLeadership).includes(member.id)).map(member => `<option value="${escapeHtml(member.id)}">${escapeHtml(member.name)} · Loyalty ${member.loyalty}</option>`).join('')}</select></div>
        <button class="primary-btn" type="submit" ${state.partyMemberRecords.filter(member => !Object.values(state.partyLeadership).includes(member.id)).length === 0 ? 'disabled' : ''}>CONFIRM APPOINTMENT →</button>
      </form>
    </section>`;
}

function partyMembersSection() {
  const members = state.partyMemberRecords;
  return `
    <section class="stats-grid">${statCard('REGISTERED MEMBERS', members.length, 'Individual member profiles', '♟')}${statCard('AVERAGE LOYALTY', members.length ? Math.round(members.reduce((sum,m)=>sum+m.loyalty,0)/members.length) + '/100' : '0/100', 'Organisation loyalty', '✦')}</section>
    <section class="panel" style="margin-top:15px"><span class="eyebrow">RECRUITMENT</span><h3>Add a new party member</h3>
      <form id="add-member-form" class="creator-grid"><div class="creator-field"><label for="newMemberName">Member full name</label><input id="newMemberName" name="memberName" maxlength="40" placeholder="Enter member name" required></div><button class="primary-btn" type="submit">ADD MEMBER · ₹100 →</button></form>
    </section>
    <section class="panel" style="margin-top:15px"><span class="eyebrow">MEMBER DIRECTORY</span><h3>Party members (${members.length})</h3>
      <div class="creator-field"><label for="memberSearch">Search members</label><input id="memberSearch" placeholder="Search by name or position"></div>
      <div id="member-directory">${members.slice(0,100).map(member => `<div class="career-step" data-member-row="${escapeHtml((member.name+' '+member.role).toLowerCase())}"><div><b>${escapeHtml(member.name)}</b><small>${escapeHtml(member.role)} · Loyalty ${member.loyalty}/100 · ${member.experience} XP</small></div>${member.isFounder ? '<span class="current-label">FOUNDER</span>' : `<button class="secondary-btn" data-remove-member="${escapeHtml(member.id)}">REMOVE</button>`}</div>`).join('')}</div>
      ${members.length > 100 ? `<p class="panel-description">Showing first 100 of ${members.length} members. Search is available within the displayed directory.</p>` : ''}
    </section>`;
}

function partyOrganisationSection() {
  const types = ['State', 'District', 'Constituency', 'Block', 'Booth'];
  return `
    <section class="panel"><span class="eyebrow">GRASSROOTS STRUCTURE</span><h2>Organisation units</h2><p class="panel-description">Create local party units and expand your network step by step.</p>
      <form id="party-unit-form" class="creator-grid"><div class="creator-field"><label for="unitType">Unit level</label><select id="unitType" name="unitType">${types.map(type=>`<option>${type}</option>`).join('')}</select></div><div class="creator-field"><label for="unitName">Unit name / area</label><input id="unitName" name="unitName" maxlength="55" placeholder="e.g. Brahmavara Booth 01" required></div><button class="primary-btn" type="submit">CREATE UNIT →</button></form>
    </section>
    <section class="panel" style="margin-top:15px"><span class="eyebrow">YOUR PARTY NETWORK</span><h3>${state.partyUnits.length} organisational units</h3>
      ${state.partyUnits.length ? state.partyUnits.map(unit=>`<div class="career-step"><div><b>${escapeHtml(unit.name)}</b><small>${escapeHtml(unit.type)} Unit · ${escapeHtml(unit.created)}</small></div><button class="secondary-btn" data-remove-unit="${escapeHtml(unit.id)}">REMOVE</button></div>`).join('') : '<p class="panel-description">No units created yet. Start with your home state or local booth.</p>'}
    </section>`;
}

function partyElectionsSection() {
  return `
    <section class="panel"><span class="eyebrow">INTERNAL DEMOCRACY</span><h2>Party internal elections</h2><p class="panel-description">Hold a simulated internal election for an available leadership position. The winner is selected from eligible party members using experience and loyalty.</p>
      <form id="party-election-form" class="creator-grid"><div class="creator-field"><label for="electionPosition">Election position</label><select id="electionPosition" name="position">${leadershipPositions.filter(position=>position!=='National Working President' || !state.partyLeadership[position]).map(position=>`<option value="${escapeHtml(position)}">${escapeHtml(position)}</option>`).join('')}</select></div><button class="primary-btn" type="submit" ${state.partyMemberRecords.length < 2 ? 'disabled' : ''}>HOLD INTERNAL ELECTION →</button></form>
    </section>
    <section class="panel" style="margin-top:15px"><span class="eyebrow">ELECTION RECORD</span><h3>Previous results</h3>
      ${state.partyElectionHistory.length ? state.partyElectionHistory.slice(0,10).map(result=>`<div class="career-step"><div><b>${escapeHtml(result.position)}</b><small>Winner: ${escapeHtml(result.winner)} · ${escapeHtml(result.date)}</small></div><span class="current-label">${result.score} PTS</span></div>`).join('') : '<p class="panel-description">No internal elections have been held.</p>'}
    </section>`;
}

function createdPartyPage() {
  let sectionContent = partyOverviewSection();
  if (partySection === 'Leadership') sectionContent = partyLeadershipSection();
  if (partySection === 'Members') sectionContent = partyMembersSection();
  if (partySection === 'Organisation') sectionContent = partyOrganisationSection();
  if (partySection === 'Elections') sectionContent = partyElectionsSection();
  return `
    <div class="page-heading"><div><div class="eyebrow">FOUNDER & PARTY PRESIDENT</div><h1>Your political <em>movement</em></h1><p>Manage your party, leadership and grassroots organisation.</p></div></div>
    <section class="panel party-headquarters"><div class="party-large-emblem">${escapeHtml(state.partyAbbreviation.slice(0,1))}</div><span class="gold-tag">PARTY FOUNDER</span><h2>${escapeHtml(state.party)}</h2><p class="panel-description">${escapeHtml(state.partyIdeology)}</p>
      <div class="party-stat-row"><span>Your position</span><b>Founder & President</b></div><div class="party-stat-row"><span>Membership</span><b>${state.partyMembers}</b></div><div class="party-stat-row"><span>Popularity</span><b>${state.partyPopularity}/100</b></div><div class="party-stat-row"><span>Party treasury</span><b>${money(state.partyFunds)}</b></div>
    </section>
    <div class="stats-grid" style="margin-top:15px">${statCard('MEMBERS', state.partyMembers, 'Your organisation', '♟')}${statCard('POPULARITY', state.partyPopularity+'/100', 'Party standing', '✦')}${statCard('TREASURY', money(state.partyFunds), 'Party funds', '₹')}${statCard('YOUR INFLUENCE', state.influence+'/100', 'Political influence', '♜')}</div>
    <div class="section-heading" style="margin-top:22px"><div><span class="eyebrow">PARTY ADMINISTRATION</span><h2>Management centre</h2></div></div>
    <div class="content-grid">${partySectionTabs()}</div>
    <div style="margin-top:15px">${sectionContent}</div>
    <section class="panel" style="margin-top:15px"><span class="eyebrow">PARTY TREASURY</span><p class="panel-description">Contribute personal funds to support party operations.</p><button class="secondary-btn" data-action="party-donate">CONTRIBUTE ₹1,000 →</button></section>`;
}

function createPartyPage() {
  return `
    <div class="page-heading">
      <div>
        <div class="eyebrow">BUILD YOUR OWN ORGANISATION</div>
        <h1>Found a political <em>party</em></h1>
        <p>Give your movement an identity and purpose.</p>
      </div>
    </div>

    <form id="party-form" class="panel creator-panel">

      <div class="creator-section">
        <span class="gold-tag">01 · PARTY IDENTITY</span>
        <h2>Name your movement</h2>

        <div class="creator-grid">
          <div class="creator-field">
            <label for="partyName">Political party name</label>
            <input id="partyName" name="partyName"
              maxlength="45" placeholder="Enter party name" required>
          </div>

          <div class="creator-field">
            <label for="partyAbbreviation">Party abbreviation</label>
            <input id="partyAbbreviation" name="partyAbbreviation"
              maxlength="5" placeholder="Example: NDP" required>
          </div>

          ${field('Political ideology', 'partyIdeology', [
            'Development Focused',
            'Social Welfare Focused',
            'Economic Reform',
            'Environmental Focused',
            'Traditional Values',
            'Centrist',
            'Independent Thinker'
          ], state.ideology)}
        </div>
      </div>

      <div class="creator-section">
        <span class="gold-tag">02 · FORMATION COST</span>
        <h2>Establish your party</h2>
        <div class="party-stat-row">
          <span>Formation fee</span>
          <b>₹10,000</b>
        </div>
        <div class="party-stat-row">
          <span>Your available wealth</span>
          <b>${money(state.money)}</b>
        </div>
        <p class="creator-note">
          Your party will initially have one founding member:
          you. You will become its Founder and President.
        </p>
      </div>

      <div class="creator-actions">
        <button type="button" class="secondary-btn" data-tab="Party">
          CANCEL
        </button>
        <button type="submit" class="primary-btn">
          ESTABLISH MY PARTY →
        </button>
      </div>
    </form>
  `;
}

/* CHARACTER CREATION */

function field(label, name, options, selected) {
  return `
    <div class="creator-field">
      <label for="${name}">${label}</label>
      <select id="${name}" name="${name}" required>
        ${options.map(option => `
          <option value="${escapeHtml(option)}"
            ${selected === option ? 'selected' : ''}>
            ${escapeHtml(option)}
          </option>
        `).join('')}
      </select>
    </div>
  `;
}

function characterPage() {
  return `
    <div class="page-heading">
      <div>
        <div class="eyebrow">YOUR LIFE · YOUR POLITICAL FUTURE</div>
        <h1>Create your <em>politician</em></h1>
        <p>Define your background and political ambitions.</p>
      </div>
    </div>

    <form id="character-form" class="panel creator-panel">
      <div class="creator-section">
        <span class="gold-tag">01 · PERSONAL IDENTITY</span>
        <h2>Who are you?</h2>

        <div class="creator-grid">
          <div class="creator-field">
            <label for="playerName">Full name</label>
            <input id="playerName" name="playerName"
              maxlength="35" value="${escapeHtml(state.playerName === 'New Politician' ? '' : state.playerName)}" required>
          </div>
          <div class="creator-field">
            <label for="age">Age</label>
            <input id="age" name="age" type="number"
              min="18" max="80" value="${state.age}" required>
          </div>
          ${field('Gender', 'gender', ['Male', 'Female', 'Other'], state.gender)}
          ${field('State', 'stateName', [
            'Karnataka', 'Kerala', 'Tamil Nadu', 'Andhra Pradesh',
            'Telangana', 'Maharashtra', 'Goa', 'Delhi',
            'Uttar Pradesh', 'Other'
          ], state.stateName)}
          <div class="creator-field">
            <label for="hometown">Hometown</label>
            <input id="hometown" name="hometown"
              value="${escapeHtml(state.hometown)}" required>
          </div>
          ${field('Education', 'education', [
            'School Student', 'High School Graduate', 'Diploma',
            'Graduate', 'Postgraduate', 'Doctorate', 'Professional Degree'
          ], state.education)}
          ${field('Occupation', 'occupation', [
            'Unemployed', 'Student', 'Private Employee',
            'Government Employee', 'Business Owner', 'Farmer',
            'Teacher', 'Lawyer', 'Social Worker', 'Other'
          ], state.occupation)}
        </div>
      </div>

      <div class="creator-section">
        <span class="gold-tag">02 · FAMILY & FINANCES</span>
        <h2>Your background</h2>
        <div class="creator-grid">
          ${field('Family background', 'familyBackground', [
            'Political Family', 'Business Family', 'Farmer Family',
            'Government Service Family', 'Working Class Family',
            'Ordinary Family'
          ], state.familyBackground)}
          ${field('Financial background', 'financialBackground', [
            'Poor', 'Lower Middle Class', 'Middle Class',
            'Upper Middle Class', 'Wealthy'
          ], state.financialBackground)}
        </div>
      </div>

      <div class="creator-section">
        <span class="gold-tag">03 · POLITICAL IDENTITY</span>
        <h2>Your ambitions</h2>
        <div class="creator-grid">
          ${field('Ideology', 'ideology', [
            'Development Focused', 'Social Welfare Focused',
            'Economic Reform', 'Environmental Focused',
            'Traditional Values', 'Centrist', 'Independent Thinker'
          ], state.ideology)}
          ${field('Ultimate ambition', 'ambition', [
            'Local Leader', 'Councillor / Panchayat President',
            'MLA', 'State Minister', 'Chief Minister',
            'Member of Parliament', 'Union Minister', 'Prime Minister'
          ], state.ambition)}
        </div>
      </div>

      <div class="creator-actions">
        <button type="button" class="secondary-btn" data-tab="Dashboard">CANCEL</button>
        <button type="submit" class="primary-btn">BEGIN MY JOURNEY →</button>
      </div>
    </form>
  `;
}

/* ACTIVITIES */

const activities = [
  {
    id: 'community',
    name: 'Community Visit',
    description: 'Meet residents and understand local problems.',
    cost: 500, xp: 12, reputation: 3, support: 2, influence: 1
  },
  {
    id: 'volunteer',
    name: 'Volunteer Work',
    description: 'Participate in grassroots community activities.',
    cost: 0, xp: 15, reputation: 2, support: 2, influence: 2
  },
  {
    id: 'meeting',
    name: 'Political Meeting',
    description: 'Develop political connections.',
    cost: 300, xp: 12, reputation: 1, support: 0, influence: 4
  },
  {
    id: 'public',
    name: 'Community Assistance',
    description: 'Organise a community assistance programme.',
    cost: 1000, xp: 18, reputation: 4, support: 4, influence: 1
  },
  {
    id: 'speech',
    name: 'Public Speech',
    description: 'Address a local gathering.',
    cost: 700, xp: 16, reputation: 3, support: 3, influence: 3
  },
  {
    id: 'research',
    name: 'Study Local Issues',
    description: 'Research infrastructure and public priorities.',
    cost: 100, xp: 10, reputation: 1, support: 1, influence: 2
  }
];

function activitiesPage() {
  return `
    <div class="page-heading">
      <div>
        <div class="eyebrow">BUILD YOUR CAREER</div>
        <h1>Political <em>activities</em></h1>
        <p>Choose how you spend your political day.</p>
      </div>
    </div>

    <section class="panel">
      <span class="eyebrow">MONTHLY ACTIONS</span>
      <h3>${Math.max(0, dailyActionLimit() - state.actionsUsed)} / 2 remaining</h3>
      <p class="panel-description">${dateText()}</p>
      <button class="secondary-btn" data-action="end-day">END DAY →</button>
    </section>

    <div class="activity-grid" style="margin-top:15px">
      ${activities.map(a => `
        <article class="panel activity-card">
          <span class="gold-tag">POLITICAL ACTIVITY</span>
          <h3>${a.name}</h3>
          <p class="panel-description">${a.description}</p>
          <div class="party-stat-row">
            <span>Cost</span><b>${money(a.cost)}</b>
          </div>
          <div class="activity-rewards">
            <span>+${a.xp} XP</span>
            <span>+${a.reputation} Reputation</span>
            <span>+${a.influence} Influence</span>
            <span>+${a.support} Support</span>
          </div>
          <button class="secondary-btn full"
            data-activity="${a.id}"
            ${state.actionsUsed >= dailyActionLimit() || !state.characterCreated || state.money < a.cost ? 'disabled' : ''}>
            ${!state.characterCreated ? 'CREATE CHARACTER FIRST'
              : state.actionsUsed >= dailyActionLimit() ? 'DAILY LIMIT REACHED'
              : state.money < a.cost ? 'INSUFFICIENT FUNDS'
              : 'PERFORM ACTIVITY →'}
          </button>
        </article>
      `).join('')}
    </div>

    <section class="panel" style="margin-top:15px">
      <span class="eyebrow">ACTIVITY HISTORY</span>
      ${state.activityHistory.length
        ? state.activityHistory.slice(0, 8).map(a => `
          <div class="career-step">
            <b>${escapeHtml(a.name)}</b>
            <span class="current-label">+${a.xp} XP</span>
          </div>
        `).join('')
        : '<p class="panel-description">No completed activities yet.</p>'}
    </section>
  `;
}

function performActivity(id) {
  if (!state.characterCreated) return toast('Create your character first.');
  if (state.actionsUsed >= dailyActionLimit()) return toast('Daily action limit reached.');

  const a = activities.find(item => item.id === id);
  if (!a) return;
  if (state.money < a.cost) return toast('Insufficient funds.');

  state.money -= a.cost;
  state.totalExpenses += a.cost;
  state.experience += a.xp;
  state.reputation = Math.min(100, state.reputation + a.reputation);
  state.influence = Math.min(100, state.influence + a.influence);
  state.publicSupport = Math.min(100, state.publicSupport + a.support);
  state.actionsUsed++;
  state.totalActions++;

  if (state.partyId !== 'independent') {
    state.partyPopularity = Math.min(100, state.partyPopularity + 1);
  }

  state.activityHistory.unshift({
    name: a.name,
    date: dateText(),
    xp: a.xp
  });

  state.activityHistory = state.activityHistory.slice(0, 30);

  saveState();
  render();
  toast(`${a.name} completed! +${a.xp} XP`);
}

function monthlyExpenses() {
  return {
    Poor: 1500,
    'Lower Middle Class': 3000,
    'Middle Class': 6000,
    'Upper Middle Class': 15000,
    Wealthy: 40000
  }[state.financialBackground] || 3000;
}

const employmentOptions = [
  { id: 'office-assistant', title: 'Office Assistant', occupation: 'Private Employee', salary: 12000, education: 'School Student', description: 'Entry-level administrative work. No degree required.' },
  { id: 'sales-associate', title: 'Sales Associate', occupation: 'Private Employee', salary: 14000, education: 'School Student', description: 'Retail and customer service work.' },
  { id: 'private-employee', title: 'Private Company Employee', occupation: 'Private Employee', salary: 15000, education: 'High School Graduate', description: 'A regular private-sector position.' },
  { id: 'teacher', title: 'School Teacher', occupation: 'Teacher', salary: 18000, education: 'Graduate', description: 'Teaching and education services.' },
  { id: 'government-employee', title: 'Government Employee', occupation: 'Government Employee', salary: 25000, education: 'Graduate', description: 'A stable public-service career.' },
  { id: 'lawyer', title: 'Junior Advocate', occupation: 'Lawyer', salary: 30000, education: 'Professional Degree', description: 'Legal practice and client representation.' }
];

const businessOptions = [
  { id: 'food-stall', name: 'Food Stall', cost: 8000, monthlyProfit: 1800, description: 'A small local food business.' },
  { id: 'kirana-shop', name: 'Kirana Shop', cost: 15000, monthlyProfit: 3500, description: 'A neighbourhood grocery shop.' },
  { id: 'service-agency', name: 'Service Agency', cost: 30000, monthlyProfit: 6500, description: 'A small local services company.' }
];

function monthlySalary() {
  const occupation = String(state.occupation || 'Unemployed');
  const salaryMap = {
    'Private Employee': 15000,
    'Government Employee': 25000,
    Teacher: 18000,
    Lawyer: 30000
  };
  return salaryMap[occupation] || 0;
}

function monthlyBusinessIncome() {
  return state.finance.businesses.reduce((sum, business) => sum + (Number(business.monthlyProfit) || 0), 0);
}

function applyForJob(form) {
  const data = new FormData(form);
  const job = employmentOptions.find(item => item.id === data.get('job'));
  if (!job) return toast('Choose a valid job.');
  const educationRank = ['School Student', 'High School Graduate', 'Diploma', 'Graduate', 'Postgraduate', 'Doctorate', 'Professional Degree'];
  if (educationRank.indexOf(state.education) < educationRank.indexOf(job.education)) {
    return toast(`This job requires ${job.education} education.`);
  }
  state.occupation = job.occupation;
  state.finance.currentJob = job.title;
  saveState();
  render();
  toast(`${job.title} secured. Monthly salary: ${money(job.salary)}.`);
}

function startBusiness(form) {
  const data = new FormData(form);
  const option = businessOptions.find(item => item.id === data.get('business'));
  const name = String(data.get('businessName') || '').trim();
  if (!option) return toast('Choose a business type.');
  if (name.length < 3) return toast('Enter a business name with at least 3 characters.');
  if (state.money < option.cost) return toast(`You need ${money(option.cost)} to start this business.`);
  state.money -= option.cost;
  state.totalExpenses += option.cost;
  state.finance.businesses.push({ id: 'biz-' + Date.now(), name, type: option.name, monthlyProfit: option.monthlyProfit, founded: dateText(), status: 'Operating' });
  saveState();
  render();
  toast(`${name} opened. Expected monthly profit: ${money(option.monthlyProfit)}.`);
}

function investFixedDeposit(form) {
  const data = new FormData(form);
  const amount = Math.floor(Number(data.get('amount')));
  if (!Number.isFinite(amount) || amount < 1000) return toast('Minimum fixed deposit is ₹1,000.');
  if (amount > state.money) return toast('Insufficient personal wealth.');
  state.money -= amount;
  state.finance.fixedDeposits += amount;
  state.totalExpenses += amount;
  saveState();
  render();
  toast(`${money(amount)} invested in fixed deposit.`);
}

function processMonthlyFinances() {
  const salary = monthlySalary();
  const businessIncome = monthlyBusinessIncome();
  const investmentIncome = Math.floor(state.finance.fixedDeposits * 0.005);
  const expenses = monthlyExpenses();
  const income = salary + businessIncome + investmentIncome;
  state.money += income;
  state.money = Math.max(0, state.money - expenses);
  state.totalExpenses += expenses;
  state.finance.totalSalaryEarned += salary;
  state.finance.totalBusinessIncome += businessIncome;
  state.finance.totalInvestmentIncome += investmentIncome;
  state.finance.lastMonthlyReport = { salary, businessIncome, investmentIncome, expenses, net: income - expenses, date: dateText() };
  state.finance.history.unshift(state.finance.lastMonthlyReport);
  state.finance.history = state.finance.history.slice(0, 24);
  return state.finance.lastMonthlyReport;
}

function financePage() {
  const salary = monthlySalary();
  const businessIncome = monthlyBusinessIncome();
  const investmentIncome = Math.floor(state.finance.fixedDeposits * 0.005);
  const totalIncome = salary + businessIncome + investmentIncome;
  const currentJob = state.finance.currentJob || (salary ? state.occupation : 'Unemployed');
  return `
    <div class="page-heading"><div><div class="eyebrow">PERSONAL ECONOMY</div><h1>Wealth & <em>finances</em></h1><p>Earn, save, invest and build financial independence alongside your political career.</p></div></div>
    <div class="stats-grid finance-stats">
      ${statCard('PERSONAL WEALTH', money(state.money), 'Available cash', '₹')}
      ${statCard('MONTHLY INCOME', money(totalIncome), 'Salary + business + interest', '↗')}
      ${statCard('MONTHLY EXPENSES', money(monthlyExpenses()), 'Based on lifestyle', '↘')}
      ${statCard('FIXED DEPOSITS', money(state.finance.fixedDeposits), 'Invested principal', '▣')}
    </div>
    <section class="panel finance-panel">
      <span class="eyebrow">CAREER STARTER GRANT</span>
      <h2>Personal wealth bonus</h2>
      <div class="finance-line"><span>One-time grant</span><b class="finance-positive">+₹2,00,000</b></div>
      <p class="panel-description">${state.wealthGrant108Claimed ? 'The one-time grant has been credited to your personal wealth. It will not be credited again in future updates.' : 'The one-time grant is pending.'}</p>
    </section>
    <section class="panel finance-panel">
      <span class="eyebrow">EMPLOYMENT & SALARY</span><h2>Your employment</h2>
      <div class="finance-line"><span>Current occupation</span><b>${escapeHtml(currentJob)}</b></div>
      <div class="finance-line"><span>Monthly salary</span><b class="finance-positive">${money(salary)}</b></div>
      <p class="panel-description">Salary is credited automatically at the start of each new in-game month.</p>
      <form id="job-application-form" class="finance-form">
        <label for="jobChoice">Apply for a job</label>
        <select id="jobChoice" name="job" required>${employmentOptions.map(job => `<option value="${job.id}">${job.title} · ${money(job.salary)}/month · ${job.education}+</option>`).join('')}</select>
        <p class="finance-hint">${employmentOptions.map(job => `<span>${job.title}: ${job.description}</span>`).join(' · ')}</p>
        <button class="secondary-btn full" type="submit">APPLY FOR SELECTED JOB →</button>
      </form>
    </section>
    <section class="panel finance-panel">
      <span class="eyebrow">BUSINESS OWNERSHIP</span><h2>Your businesses</h2>
      ${state.finance.businesses.length ? state.finance.businesses.map(b => `<div class="finance-business"><div><b>${escapeHtml(b.name)}</b><small>${escapeHtml(b.type)} · ${escapeHtml(b.status || 'Operating')}</small></div><strong class="finance-positive">${money(b.monthlyProfit)}/mo</strong></div>`).join('') : '<p class="panel-description">You do not own a business yet. Build savings from employment and start one when you can afford it.</p>'}
      <form id="business-form" class="finance-form">
        <label for="businessName">Business name</label><input id="businessName" name="businessName" maxlength="35" placeholder="Example: Dhanush Foods" required>
        <label for="businessChoice">Business type</label>
        <select id="businessChoice" name="business" required>${businessOptions.map(b => `<option value="${b.id}">${b.name} · Setup ${money(b.cost)} · ${money(b.monthlyProfit)}/month</option>`).join('')}</select>
        <button class="secondary-btn full" type="submit">OPEN BUSINESS →</button>
      </form>
    </section>
    <section class="panel finance-panel">
      <span class="eyebrow">SAVINGS & INVESTMENTS</span><h2>Fixed deposit</h2>
      <div class="finance-line"><span>Invested principal</span><b>${money(state.finance.fixedDeposits)}</b></div>
      <div class="finance-line"><span>Estimated monthly interest</span><b class="finance-positive">${money(investmentIncome)}</b></div>
      <p class="panel-description">Simulation rate: 0.5% per in-game month. Interest is credited monthly. Minimum deposit ₹1,000.</p>
      <form id="fixed-deposit-form" class="finance-form"><label for="fdAmount">Deposit amount</label><input id="fdAmount" name="amount" type="number" min="1000" step="500" placeholder="1000" required><button class="primary-btn full" type="submit">INVEST IN FIXED DEPOSIT →</button></form>
    </section>
    <section class="panel finance-panel">
      <span class="eyebrow">MONTHLY CASH FLOW</span><h2>Last monthly statement</h2>
      ${state.finance.lastMonthlyReport ? `<div class="finance-line"><span>Salary received</span><b class="finance-positive">+${money(state.finance.lastMonthlyReport.salary)}</b></div><div class="finance-line"><span>Business profit</span><b class="finance-positive">+${money(state.finance.lastMonthlyReport.businessIncome)}</b></div><div class="finance-line"><span>Investment interest</span><b class="finance-positive">+${money(state.finance.lastMonthlyReport.investmentIncome)}</b></div><div class="finance-line"><span>Living expenses</span><b class="finance-negative">−${money(state.finance.lastMonthlyReport.expenses)}</b></div><div class="finance-line finance-total"><span>Net monthly change</span><b class="${state.finance.lastMonthlyReport.net >= 0 ? 'finance-positive' : 'finance-negative'}">${state.finance.lastMonthlyReport.net >= 0 ? '+' : '−'}${money(Math.abs(state.finance.lastMonthlyReport.net))}</b></div>` : '<p class="panel-description">Your first monthly statement will appear after the next month begins.</p>'}
      ${state.finance.history.slice(0, 6).map(report => `<div class="finance-history"><span>${escapeHtml(report.date)}</span><b class="${report.net >= 0 ? 'finance-positive' : 'finance-negative'}">${report.net >= 0 ? '+' : '−'}${money(Math.abs(report.net))}</b></div>`).join('')}
    </section>
  `;
}

function currentMonthIndex() {
  return Math.max(0, (Number(state.year || 1) - 1) * 12 + (Number(state.month || 1) - 1));
}
function ensureElectionCalendar() {
  if (!state.elections || typeof state.elections !== 'object') state.elections = JSON.parse(JSON.stringify(defaults.elections));
  if (!state.elections.calendar) state.elections.calendar = JSON.parse(JSON.stringify(defaults.elections.calendar));
  if (!Array.isArray(state.elections.nominationQueue)) state.elections.nominationQueue = [];
  return state.elections;
}
function processElectionCalendar() {
  const elections = ensureElectionCalendar();
  const now = currentMonthIndex();
  const types = [
    { id: 'local', label: 'Local Body Election', interval: 60, offset: 36 },
    { id: 'assembly', label: 'State Assembly Election', interval: 60, offset: 60 },
    { id: 'lok-sabha', label: 'Lok Sabha Election', interval: 60, offset: 48 }
  ];
  types.forEach(type => {
    let schedule = elections.calendar[type.id];
    if (!schedule || typeof schedule !== 'object') schedule = elections.calendar[type.id] = { intervalMonths: type.interval, nextAt: type.offset, label: type.label };
    if (!Number.isFinite(Number(schedule.nextAt))) schedule.nextAt = type.offset;
    if (now >= Number(schedule.nextAt) && !elections.nominationQueue.some(item => item.typeId === type.id && item.status === 'Pending')) {
      const members = Array.isArray(state.partyMemberRecords) ? state.partyMemberRecords : [];
      const proposals = members.filter(member => member && member.name).slice(0, 8);
      if (proposals.length) proposals.forEach((member, index) => elections.nominationQueue.push({
        id: `${type.id}-${now}-${index}`, typeId: type.id, typeName: type.label,
        candidateName: member.name, candidateRole: member.role || 'Party member',
        constituency: member.constituency || member.district || state.constituency?.constituencyName || 'Assigned constituency',
        status: 'Pending', aiReason: 'AI party committee proposal. Review eligibility and suitability before approval.',
        createdAt: dateText()
      }));
      else elections.nominationQueue.push({
        id: `${type.id}-${now}-vacant`, typeId: type.id, typeName: type.label,
        candidateName: 'Candidate required', candidateRole: 'Vacant nomination',
        constituency: 'Constituency assignment required', status: 'Pending',
        aiReason: 'No party-member records are available. Add party members before approving nominations.',
        createdAt: dateText()
      });
      schedule.nextAt = now + Number(schedule.intervalMonths || type.interval);
    }
  });
}
function endDay() {
  if (!state.characterCreated) return toast('Create your politician first.');
  state.day = 1;
  state.month = Number(state.month || 1) + 1;
  if (state.month > 12) {
    state.month = 1;
    state.year = Number(state.year || 1) + 1;
    state.age = Number(state.age || 21) + 1;
  }
  state.actionsUsed = 0;
  runAiAdministration();
  advanceMediaCycle();
  const report = processMonthlyFinances();
  processElectionCalendar();
  advanceOfficeMonth();
  const totalIncome = report.salary + report.businessIncome + report.investmentIncome;
  const message = `New month: ${dateText()}. Income ${money(totalIncome)} · Expenses ${money(report.expenses)} · Net ${report.net >= 0 ? '+' : '−'}${money(Math.abs(report.net))}. Election calendar updated.`;
  saveState(); render(); toast(message);
}

/* PARTY ACTIONS */

function joinParty(id) {
  if (!state.characterCreated) return toast('Create your character first.');
  if (state.partyId !== 'independent') return toast('You already belong to a party.');

  const party = parties.find(p => p.id === id);
  if (!party) return;

  state.partyId = party.id;
  state.party = party.name;
  state.partyAbbreviation = party.abbreviation;
  state.partyIdeology = party.ideology;
  state.partyPosition = 'Party Member';
  state.partyMembers = party.members;
  state.partyPopularity = party.popularity;
  state.partyFunds = 0;
  state.partyCreated = false;

  state.partyHistory.unshift({
    event: 'Joined ' + party.name,
    date: dateText()
  });

  saveState();
  activeTab = 'Party';
  render();
  toast(`Welcome to ${party.name}!`);
}

function establishParty(form) {
  if (!state.characterCreated) return toast('Create your politician first.');
  if (state.partyId !== 'independent') return toast('Leave your current party first.');

  const data = new FormData(form);
  const name = String(data.get('partyName') || '').trim();
  const abbreviation = String(data.get('partyAbbreviation') || '').trim().toUpperCase();
  const ideology = String(data.get('partyIdeology') || '');

  if (name.length < 4 || abbreviation.length < 2 || abbreviation.length > 5) {
    return toast('Enter a valid party name and abbreviation.');
  }

  if (state.money < 10000) {
    return toast('You need ₹10,000 to establish your party.');
  }

  state.money -= 10000;
  state.totalExpenses += 10000;

  state.party = name;
  state.partyAbbreviation = abbreviation;
  state.partyIdeology = ideology;
  state.partyId = 'custom-' + Date.now();
  state.partyPosition = 'Founder & President';
  state.partyMembers = 1;
  state.partyFunds = 0;
  state.partyPopularity = 5;
  state.partyCreated = true;
  state.partyMemberRecords = [{ id: 'founder', name: state.playerName, role: 'Founder & National President', loyalty: 95, experience: 100, joined: dateText(), isFounder: true }];
  state.partyLeadership = { 'Founder & National President': 'founder' };
  state.partyUnits = [];
  state.partyElectionHistory = [];

  state.partyHistory.unshift({
    event: 'Founded ' + name,
    date: dateText()
  });

  saveState();
  activeTab = 'Party';
  render();
  toast('Your political party has been established!');
}

function partyMeeting() {
  if (state.partyId === 'independent') return;
  if (state.actionsUsed >= dailyActionLimit()) return toast('No monthly actions remaining.');
  if (state.money < 300) return toast('You need ₹300.');

  state.money -= 300;
  state.totalExpenses += 300;
  state.actionsUsed++;
  state.totalActions++;
  state.experience += 15;
  state.influence = Math.min(100, state.influence + 3);
  state.reputation = Math.min(100, state.reputation + 2);
  state.partyPopularity = Math.min(100, state.partyPopularity + 1);

  saveState();
  render();
  toast('Party meeting completed! +15 XP');
}

function donatePartyFunds() {
  if (state.partyId === 'independent') return;
  if (state.money < 1000) return toast('You need ₹1,000.');

  state.money -= 1000;
  state.partyFunds += 1000;
  state.totalExpenses += 1000;

  saveState();
  render();
  toast('₹1,000 added to party treasury.');
}

function recruitMembers() {
  if (!state.partyCreated) return;
  if (state.actionsUsed >= dailyActionLimit()) return toast('No monthly actions remaining.');
  if (state.money < 1000) return toast('You need ₹1,000.');

  state.money -= 1000;
  state.totalExpenses += 1000;
  state.actionsUsed++;
  state.totalActions++;

  for (let i = 1; i <= 25; i++) {
    const number = state.partyMemberRecords.length + 1;
    state.partyMemberRecords.push({ id: 'member-' + Date.now() + '-' + i, name: 'New Party Member ' + String(number).padStart(3, '0'), role: 'General Member', loyalty: 50 + (i % 30), experience: i % 10, joined: dateText(), isFounder: false });
  }
  state.partyMembers = state.partyMemberRecords.length;
  state.partyPopularity = Math.min(100, state.partyPopularity + 3);
  state.influence = Math.min(100, state.influence + 2);
  state.experience += 10;

  saveState();
  render();
  toast('Membership drive successful! +25 members');
}

function leaveParty() {
  if (!confirm('Are you sure you want to leave your current political party?')) return;

  state.party = 'Independent';
  state.partyId = 'independent';
  state.partyAbbreviation = 'IND';
  state.partyIdeology = 'Independent';
  state.partyPosition = 'Independent Politician';
  state.partyMembers = 1;
  state.partyFunds = 0;
  state.partyPopularity = 0;
  state.partyCreated = false;
  state.partyMemberRecords = [];
  state.partyLeadership = {};
  state.partyUnits = [];
  state.partyElectionHistory = [];

  saveState();
  render();
  toast('You are now an independent politician.');
}

function addPartyMember(form) {
  const data = new FormData(form);
  const name = String(data.get('memberName') || '').trim();
  if (name.length < 2) return toast('Enter a valid member name.');
  if (state.money < 100) return toast('You need ₹100 to register a member.');
  if (state.partyMemberRecords.some(member => member.name.toLowerCase() === name.toLowerCase())) return toast('A member with this name already exists.');
  state.money -= 100; state.totalExpenses += 100;
  state.partyMemberRecords.push({ id: 'member-' + Date.now(), name, role: 'General Member', loyalty: 50, experience: 0, joined: dateText(), isFounder: false });
  state.partyMembers = state.partyMemberRecords.length;
  state.partyHistory.unshift({ event: name + ' joined the party', date: dateText() });
  saveState(); render(); toast(name + ' added to the party.');
}

function appointPartyLeader(form) {
  const data = new FormData(form);
  const position = String(data.get('position') || '');
  const memberId = String(data.get('memberId') || '');
  const member = getPartyMember(memberId);
  if (!member) return toast('Select a valid party member.');
  if (member.isFounder || Object.values(state.partyLeadership).includes(memberId)) return toast('This member already holds a leadership role.');
  state.partyLeadership[position] = memberId;
  member.role = position;
  member.experience = Math.min(100, member.experience + 10);
  state.partyHistory.unshift({ event: member.name + ' appointed as ' + position, date: dateText() });
  saveState(); render(); toast('Leadership appointment confirmed.');
}

function removeLeadershipPosition(position) {
  const memberId = state.partyLeadership[position];
  if (!memberId || position === 'Founder & National President') return;
  const member = getPartyMember(memberId);
  if (member) member.role = 'General Member';
  delete state.partyLeadership[position];
  state.partyHistory.unshift({ event: position + ' position made vacant', date: dateText() });
  saveState(); render(); toast('Leadership position is now vacant.');
}

function removePartyMember(id) {
  const member = getPartyMember(id);
  if (!member || member.isFounder) return toast('The party founder cannot be removed.');
  if (Object.values(state.partyLeadership).includes(id)) return toast('Remove this member from leadership before removing them.');
  if (!confirm('Remove ' + member.name + ' from the party?')) return;
  state.partyMemberRecords = state.partyMemberRecords.filter(item => item.id !== id);
  state.partyMembers = state.partyMemberRecords.length;
  state.partyHistory.unshift({ event: member.name + ' removed from party membership', date: dateText() });
  saveState(); render(); toast('Member removed.');
}

function createPartyUnit(form) {
  const data = new FormData(form);
  const type = String(data.get('unitType') || '');
  const name = String(data.get('unitName') || '').trim();
  if (name.length < 2) return toast('Enter a valid unit name.');
  if (state.partyUnits.some(unit => unit.name.toLowerCase() === name.toLowerCase() && unit.type === type)) return toast('This unit already exists.');
  state.partyUnits.push({ id: 'unit-' + Date.now(), type, name, created: dateText() });
  state.partyHistory.unshift({ event: type + ' unit created: ' + name, date: dateText() });
  state.influence = Math.min(100, state.influence + 1);
  saveState(); render(); toast(type + ' unit created.');
}

function removePartyUnit(id) {
  const unit = state.partyUnits.find(item => item.id === id);
  if (!unit || !confirm('Remove ' + unit.name + '?')) return;
  state.partyUnits = state.partyUnits.filter(item => item.id !== id);
  state.partyHistory.unshift({ event: unit.name + ' unit dissolved', date: dateText() });
  saveState(); render(); toast('Organisation unit removed.');
}

function holdPartyElection(form) {
  if (state.partyMemberRecords.length < 2) return toast('At least two members are required.');
  const data = new FormData(form);
  const position = String(data.get('position') || '');
  const candidates = state.partyMemberRecords.filter(member => !member.isFounder && !Object.entries(state.partyLeadership).some(([role,id]) => id === member.id && role !== position));
  if (!candidates.length) return toast('No eligible candidates for this election.');
  candidates.sort((a,b) => (b.loyalty + b.experience) - (a.loyalty + a.experience));
  const winner = candidates[0];
  const previousId = state.partyLeadership[position];
  const previous = getPartyMember(previousId);
  if (previous && !previous.isFounder) previous.role = 'General Member';
  state.partyLeadership[position] = winner.id;
  winner.role = position;
  winner.loyalty = Math.min(100, winner.loyalty + 5);
  winner.experience = Math.min(100, winner.experience + 10);
  const score = Math.min(99, Math.round((winner.loyalty + winner.experience) / 2));
  state.partyElectionHistory.unshift({ position, winner: winner.name, date: dateText(), score });
  state.partyHistory.unshift({ event: winner.name + ' elected as ' + position, date: dateText() });
  state.experience += 15;
  saveState(); render(); toast(winner.name + ' elected as ' + position + '!');
}

/* CAREER & PROFILE */

function careerPage() {
  const ranks = [
    'Ordinary Citizen',
    'Political Volunteer',
    'Booth-level Worker',
    'Local Party Leader',
    'Councillor / Panchayat Leader',
    'MLA',
    'State Minister',
    'Chief Minister',
    'Member of Parliament',
    'Union Minister',
    'Prime Minister'
  ];

  return `
    <div class="page-heading">
      <div>
        <div class="eyebrow">YOUR PATH TO LEADERSHIP</div>
        <h1>Political <em>career</em></h1>
        <p>Your rise is earned through service and public trust.</p>
      </div>
    </div>
    <section class="panel">
      <span class="eyebrow">CAREER LADDER</span>
      <div class="career-list">
        ${ranks.map((rank, i) => `
          <div class="career-step ${rank === state.role ? 'current' : ''}">
            <div class="step-node">${i + 1}</div>
            <div>
              <b>${rank}</b>
              <small>${rank === state.role ? 'Your current position' : 'Future career milestone'}</small>
            </div>
            ${rank === state.role ? '<span class="current-label">CURRENT</span>' : '<span class="locked">LOCKED</span>'}
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function profilePage() {
  const rows = [
    ['Age', state.age],
    ['Gender', state.gender],
    ['State', state.stateName],
    ['Hometown', state.hometown],
    ['Education', state.education],
    ['Occupation', state.occupation],
    ['Family background', state.familyBackground],
    ['Financial background', state.financialBackground],
    ['Ideology', state.ideology],
    ['Ambition', state.ambition],
    ['Political party', state.party],
    ['Political position', state.partyPosition],
    ['Personal wealth', money(state.money)]
  ];

  return `
    <div class="page-heading">
      <div>
        <div class="eyebrow">YOUR PERSONAL RECORD</div>
        <h1>Politician <em>profile</em></h1>
      </div>
    </div>
    <section class="panel">
      <h2>${escapeHtml(state.playerName)}</h2>
      <p>${escapeHtml(state.role)} · Level ${state.level}</p>
      <div class="career-list">
        ${rows.map(([label, value]) => `
          <div class="career-step">
            <b>${label}</b>
            <span class="current-label">${escapeHtml(value)}</span>
          </div>
        `).join('')}
      </div>
      <button class="secondary-btn" data-action="edit-character">EDIT CHARACTER</button>
    </section>

    <section class="panel" style="margin-top:15px">
      <span class="eyebrow">SAVE DATA PROTECTION</span>
      <h2>Backup & restore your political career</h2>
      <p class="panel-description">
        Export your complete RAJNITI save before changing phones or installing a one-time signing migration.
        Keep the backup text somewhere private. It contains your game progress.
      </p>
      <button class="secondary-btn full" data-action="generate-save-backup">
        GENERATE SAVE BACKUP
      </button>
      <div class="creator-field" style="margin-top:12px">
        <label for="saveBackupData">Backup data</label>
        <textarea id="saveBackupData" rows="7" placeholder="Generate a backup or paste a previous RAJNITI backup here" style="width:100%;box-sizing:border-box"></textarea>
      </div>
      <div class="creator-actions">
        <button class="secondary-btn" data-action="copy-save-backup">COPY BACKUP</button>
        <button class="primary-btn" data-action="restore-save-backup">RESTORE BACKUP</button>
      </div>
      <small class="creator-note">Restoring replaces the current local game save. Only restore a backup you trust.</small>
    </section>
  `;
}

function generateSaveBackup() {
  const backup = {
    app: 'RAJNITI',
    formatVersion: 1,
    exportedAt: new Date().toISOString(),
    save: state
  };
  const field = document.querySelector('#saveBackupData');
  if (!field) return;
  field.value = JSON.stringify(backup);
  field.focus();
  field.select();
  toast('Backup generated. Copy and store it safely.');
}

async function copySaveBackup() {
  const field = document.querySelector('#saveBackupData');
  if (!field || !field.value.trim()) return toast('Generate a backup first.');
  field.focus();
  field.select();
  try {
    await navigator.clipboard.writeText(field.value);
    toast('Backup copied to clipboard.');
  } catch {
    toast('Backup selected. Long-press the text and choose Copy.');
  }
}

function restoreSaveBackup() {
  const field = document.querySelector('#saveBackupData');
  if (!field || !field.value.trim()) return toast('Paste your backup data first.');
  try {
    const parsed = JSON.parse(field.value);
    if (parsed.app !== 'RAJNITI' || !parsed.save || typeof parsed.save !== 'object') {
      return toast('This is not a valid RAJNITI backup.');
    }
    if (!confirm('Restore this backup? Your current local game save will be replaced.')) return;
    state = { ...defaults, ...parsed.save };
    saveState();
    activeTab = 'Dashboard';
    render();
    toast('RAJNITI save restored successfully.');
  } catch {
    toast('Backup data is invalid or incomplete.');
  }
}


/* CONSTITUENCY & GROUND POLITICS */

const constituencyDistricts = {
  Karnataka: ['Udupi', 'Dakshina Kannada', 'Uttara Kannada', 'Shivamogga', 'Chikkamagaluru', 'Hassan', 'Mysuru', 'Bengaluru Urban'],
  Kerala: ['Kasaragod', 'Kannur', 'Wayanad', 'Kozhikode', 'Malappuram', 'Ernakulam', 'Thiruvananthapuram'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Thanjavur', 'Tiruchirappalli'],
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool'],
  Telangana: ['Hyderabad', 'Warangal', 'Karimnagar', 'Nizamabad', 'Khammam'],
  Maharashtra: ['Mumbai', 'Pune', 'Nashik', 'Nagpur', 'Kolhapur'],
  Goa: ['North Goa', 'South Goa'],
  Delhi: ['Central Delhi', 'East Delhi', 'New Delhi', 'South Delhi'],
  'Uttar Pradesh': ['Lucknow', 'Varanasi', 'Kanpur Nagar', 'Prayagraj', 'Gorakhpur'],
  Other: ['Other District']
};

const groundActions = [
  { id: 'public-meeting', name: 'Hold public meeting', description: 'Listen to residents and discuss local priorities.', cost: 700, support: 2, influence: 2, reputation: 2, xp: 15 },
  { id: 'doorstep', name: 'Door-to-door outreach', description: 'Meet households and record community concerns.', cost: 400, support: 2, influence: 1, reputation: 2, xp: 12 },
  { id: 'volunteer-drive', name: 'Volunteer mobilisation', description: 'Organise volunteers for local civic activities.', cost: 900, support: 1, influence: 3, reputation: 2, xp: 16 },
  { id: 'issue-survey', name: 'Local issue survey', description: 'Collect feedback about public services and infrastructure.', cost: 250, support: 1, influence: 2, reputation: 1, xp: 10 }
];

function constituencyPage() {
  const c = state.constituency;
  const districts = constituencyDistricts[c.state] || constituencyDistricts.Other;
  const locality = c.localities.find(x => x.name === c.selectedLocality) || c.localities[0];
  const support = Math.round(c.localities.reduce((sum, x) => sum + Number(x.support || 0), 0) / Math.max(1, c.localities.length));
  const influence = Math.round(c.localities.reduce((sum, x) => sum + Number(x.influence || 0), 0) / Math.max(1, c.localities.length));
  const remaining = Math.max(0, dailyActionLimit() - state.actionsUsed);

  return `
    <div class="page-heading">
      <div>
        <div class="eyebrow">GRASSROOTS POLITICS · INDIA</div>
        <h1>Constituency <em>command centre</em></h1>
        <p>Build public trust through local service, organisation and development.</p>
      </div>
      <div class="date-card">
        <span>DAILY GROUND ACTIONS</span>
        <b>${remaining} / ${dailyActionLimit()}</b>
        <small>${dateText()}</small>
      </div>
    </div>

    <section class="hero-panel ground-hero">
      <div class="hero-copy">
        <span class="gold-tag">YOUR POLITICAL FOUNDATION</span>
        <h2>Win trust.<br><em>Serve the ground.</em></h2>
        <p>Every neighbourhood has its own needs. Listen first, organise responsibly and track the results of your work.</p>
      </div>
      <div class="hero-art"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="parliament">⌖</div></div>
    </section>

    <section class="panel ground-panel">
      <div class="section-heading">
        <div><span class="eyebrow">YOUR ELECTORAL AREA</span><h2>Constituency setup</h2></div>
        <span class="gold-tag">SIMULATION REGION</span>
      </div>
      <form id="constituency-setup-form" class="creator-grid">
        <div class="creator-field">
          <label for="groundState">State / Union Territory</label>
          <select id="groundState" name="groundState">
            ${Object.keys(constituencyDistricts).map(x => `<option value="${escapeHtml(x)}" ${x === c.state ? 'selected' : ''}>${escapeHtml(x)}</option>`).join('')}
          </select>
        </div>
        <div class="creator-field">
          <label for="groundDistrict">District</label>
          <select id="groundDistrict" name="groundDistrict">
            ${districts.map(x => `<option value="${escapeHtml(x)}" ${x === c.district ? 'selected' : ''}>${escapeHtml(x)}</option>`).join('')}
          </select>
        </div>
        <div class="creator-field">
          <label for="constituencyName">Constituency name</label>
          <input id="constituencyName" name="constituencyName" maxlength="55" value="${escapeHtml(c.constituencyName)}" required>
        </div>
        <div class="creator-field creator-submit">
          <label>&nbsp;</label>
          <button class="secondary-btn full" type="submit">SAVE CONSTITUENCY →</button>
        </div>
      </form>
      <p class="creator-note">This is a fictional gameplay constituency. Population and support figures are simulation values, not official election data or real constituency boundaries.</p>
    </section>

    <div class="stats-grid ground-stats">
      ${statCard('ESTIMATED VOTERS', Number(c.totalVoters).toLocaleString('en-IN'), 'Fictional game population', '♟')}
      ${statCard('AVERAGE LOCAL SUPPORT', support + '%', 'Across your localities', '♥')}
      ${statCard('GROUND INFLUENCE', influence + '/100', 'Local organisational reach', '⚑')}
      ${statCard('DEVELOPMENT PROJECTS', c.projects.length, 'Projects started', '⌂')}
    </div>

    <section class="panel ground-panel">
      <div class="section-heading">
        <div><span class="eyebrow">LOCAL POLITICAL MAP</span><h2>Villages, towns & wards</h2></div>
        <span class="gold-tag">${c.localities.length} LOCAL AREAS</span>
      </div>
      <div class="locality-grid">
        ${c.localities.map(x => `
          <button class="locality-card ${x.name === c.selectedLocality ? 'selected' : ''}" data-select-locality="${escapeHtml(x.name)}">
            <span class="locality-type">${escapeHtml(x.type)}</span>
            <b>${escapeHtml(x.name)}</b>
            <span>${Number(x.voters).toLocaleString('en-IN')} estimated voters</span>
            <div class="mini-progress"><i style="width:${Math.max(0, Math.min(100, Number(x.support)))}%"></i></div>
            <small>Public support <strong>${Number(x.support)}%</strong></small>
          </button>
        `).join('')}
      </div>
    </section>

    <section class="panel ground-panel">
      <span class="eyebrow">SELECTED LOCALITY</span>
      <h2>${escapeHtml(locality.name)}</h2>
      <p class="panel-description">${escapeHtml(locality.type)} · ${Number(locality.voters).toLocaleString('en-IN')} estimated voters</p>
      <div class="ground-metrics">
        <div><small>PUBLIC SUPPORT</small><b>${locality.support}%</b></div>
        <div><small>LOCAL INFLUENCE</small><b>${locality.influence}/100</b></div>
        <div><small>PRIORITY ISSUE</small><b>${escapeHtml(locality.issue)}</b></div>
      </div>
      <div class="issue-box">
        <span class="gold-tag">COMMUNITY PRIORITY</span>
        <h3>${escapeHtml(locality.issue)}</h3>
        <p class="panel-description">Address this issue through a development project and transparent follow-up.</p>
        <button class="secondary-btn" data-action="resolve-local-issue" ${remaining === 0 || state.money < 1500 ? 'disabled' : ''}>START ISSUE RESOLUTION · ₹1,500</button>
      </div>
    </section>

    <section class="panel ground-panel">
      <div class="section-heading">
        <div><span class="eyebrow">GROUND OPERATIONS</span><h2>Choose your next move</h2></div>
        <span class="gold-tag">${remaining} ACTIONS LEFT</span>
      </div>
      <div class="activity-grid">
        ${groundActions.map(a => `
          <article class="activity-card ground-action-card">
            <span class="gold-tag">GROUND ACTIVITY</span>
            <h3>${a.name}</h3>
            <p class="panel-description">${a.description}</p>
            <div class="party-stat-row"><span>Cost</span><b>${money(a.cost)}</b></div>
            <div class="activity-rewards"><span>+${a.support} Support</span><span>+${a.influence} Influence</span><span>+${a.xp} XP</span></div>
            <button class="secondary-btn full" data-ground-action="${a.id}" ${remaining === 0 || state.money < a.cost ? 'disabled' : ''}>TAKE ACTION →</button>
          </article>
        `).join('')}
      </div>
    </section>

    <section class="panel ground-panel">
      <div class="section-heading">
        <div><span class="eyebrow">LOCAL DEVELOPMENT</span><h2>Development projects</h2></div>
      </div>
      <form id="development-project-form" class="creator-grid">
        <div class="creator-field">
          <label for="projectType">Project category</label>
          <select id="projectType" name="projectType">
            <option>Road repair proposal</option>
            <option>Drinking water initiative</option>
            <option>Street lighting proposal</option>
            <option>Public transport improvement</option>
            <option>School facility improvement</option>
            <option>Waste management initiative</option>
            <option>Public health camp</option>
          </select>
        </div>
        <div class="creator-field">
          <label for="projectName">Project title</label>
          <input id="projectName" name="projectName" maxlength="60" placeholder="Enter project title" required>
        </div>
        <div class="creator-field">
          <label for="projectCost">Estimated campaign cost</label>
          <select id="projectCost" name="projectCost">
            <option value="2000">₹2,000</option>
            <option value="5000">₹5,000</option>
            <option value="10000">₹10,000</option>
          </select>
        </div>
        <div class="creator-field creator-submit">
          <label>&nbsp;</label>
          <button class="primary-btn full" type="submit">START DEVELOPMENT PROJECT →</button>
        </div>
      </form>
      <p class="creator-note">These are simulated political campaign and planning expenses, not government procurement or public funds.</p>
      ${c.projects.length ? c.projects.slice().reverse().map(p => `
        <div class="career-step">
          <div><b>${escapeHtml(p.name)}</b><small>${escapeHtml(p.category)} · ${escapeHtml(p.locality)}</small></div>
          <span class="current-label">${escapeHtml(p.status)}</span>
        </div>
      `).join('') : '<p class="panel-description">No development projects started yet.</p>'}
    </section>

    <section class="panel ground-panel">
      <span class="eyebrow">GROUND ACTIVITY RECORD</span>
      <h2>Recent constituency work</h2>
      ${c.campaigns.length ? c.campaigns.slice(0, 10).map(x => `
        <div class="career-step">
          <div><b>${escapeHtml(x.action)}</b><small>${escapeHtml(x.locality)} · ${escapeHtml(x.date)}</small></div>
          <span class="current-label">+${x.support} support</span>
        </div>
      `).join('') : '<p class="panel-description">Your ground activities will appear here.</p>'}
      <button class="secondary-btn" data-action="end-day">END DAY & REFRESH ACTIONS →</button>
    </section>
  `;
}

function saveConstituencySetup(form) {
  const data = new FormData(form);
  const nextState = String(data.get('groundState'));
  const nextDistrict = String(data.get('groundDistrict'));
  const name = String(data.get('constituencyName') || '').trim();
  if (!name) return toast('Enter a constituency name.');
  state.constituency.state = nextState;
  state.constituency.district = nextDistrict;
  state.constituency.constituencyName = name;
  saveState();
  render();
  toast('Constituency details saved.');
}

function performGroundAction(id) {
  if (!state.characterCreated) return toast('Create your politician first.');
  if (state.actionsUsed >= dailyActionLimit()) return toast('Daily action limit reached.');
  const action = groundActions.find(x => x.id === id);
  if (!action) return;
  if (state.money < action.cost) return toast('Insufficient personal funds.');
  const c = state.constituency;
  const locality = c.localities.find(x => x.name === c.selectedLocality) || c.localities[0];
  state.money -= action.cost;
  state.totalExpenses += action.cost;
  state.actionsUsed++;
  state.totalActions++;
  locality.support = Math.min(100, Number(locality.support) + action.support);
  locality.influence = Math.min(100, Number(locality.influence) + action.influence);
  state.publicSupport = Math.min(100, state.publicSupport + 1);
  state.reputation = Math.min(100, state.reputation + action.reputation);
  state.influence = Math.min(100, state.influence + action.influence);
  state.experience += action.xp;
  c.campaigns.unshift({ action: action.name, locality: locality.name, date: dateText(), support: action.support });
  c.campaigns = c.campaigns.slice(0, 40);
  saveState();
  render();
  toast(`${action.name} completed in ${locality.name}.`);
}

function resolveLocalIssue() {
  if (!state.characterCreated) return toast('Create your politician first.');
  if (state.actionsUsed >= dailyActionLimit()) return toast('Daily action limit reached.');
  if (state.money < 1500) return toast('You need ₹1,500.');
  const c = state.constituency;
  const locality = c.localities.find(x => x.name === c.selectedLocality) || c.localities[0];
  state.money -= 1500;
  state.totalExpenses += 1500;
  state.actionsUsed++;
  state.totalActions++;
  locality.support = Math.min(100, locality.support + 4);
  locality.influence = Math.min(100, locality.influence + 2);
  state.reputation = Math.min(100, state.reputation + 3);
  state.publicSupport = Math.min(100, state.publicSupport + 2);
  state.experience += 20;
  c.resolvedIssues.push({ locality: locality.name, issue: locality.issue, date: dateText() });
  c.campaigns.unshift({ action: 'Issue resolution initiative: ' + locality.issue, locality: locality.name, date: dateText(), support: 4 });
  locality.issue = ['Road maintenance', 'Drinking water supply', 'Public transport', 'Street lighting', 'Waste management'][c.resolvedIssues.length % 5];
  saveState();
  render();
  toast('Issue resolution initiative started.');
}

function startDevelopmentProject(form) {
  if (!state.characterCreated) return toast('Create your politician first.');
  const data = new FormData(form);
  const name = String(data.get('projectName') || '').trim();
  const category = String(data.get('projectType') || '');
  const cost = Number(data.get('projectCost'));
  if (name.length < 4) return toast('Enter a project title with at least 4 characters.');
  if (state.actionsUsed >= dailyActionLimit()) return toast('Daily action limit reached.');
  if (state.money < cost) return toast('Insufficient personal funds.');
  const locality = state.constituency.localities.find(x => x.name === state.constituency.selectedLocality) || state.constituency.localities[0];
  state.money -= cost;
  state.totalExpenses += cost;
  state.actionsUsed++;
  state.totalActions++;
  state.experience += 18;
  state.reputation = Math.min(100, state.reputation + 3);
  locality.support = Math.min(100, locality.support + 3);
  state.constituency.projects.push({
    name, category, cost, locality: locality.name,
    status: 'Proposal initiated', date: dateText()
  });
  saveState();
  render();
  toast('Development proposal added to your record.');
}

/* ELECTION CAMPAIGN & ELECTORAL POLITICS */

const electionTypes = [
  { id: 'local', name: 'Local Body Election', level: 'Local', voters: 46900, baseSupport: 8, minInfluence: 0, minReputation: 0, winRole: 'Councillor / Panchayat Leader', deposit: 1500 },
  { id: 'assembly', name: 'State Assembly Election', level: 'State', voters: 850000, baseSupport: 5, minInfluence: 18, minReputation: 22, winRole: 'MLA', deposit: 5000 },
  { id: 'lok-sabha', name: 'Lok Sabha Election', level: 'National', voters: 1600000, baseSupport: 3, minInfluence: 35, minReputation: 45, winRole: 'Member of Parliament', deposit: 10000 }
];

const campaignActions = [
  { id: 'door-to-door', name: 'Door-to-door campaign', description: 'Meet voters and discuss local priorities.', cost: 500, score: 5, support: 2, influence: 1, xp: 12 },
  { id: 'public-rally', name: 'Organise public rally', description: 'Hold a public gathering and present your agenda.', cost: 1200, score: 9, support: 3, influence: 2, xp: 18 },
  { id: 'manifesto-drive', name: 'Manifesto outreach', description: 'Explain your policy commitments to residents.', cost: 800, score: 7, support: 2, influence: 1, xp: 15 },
  { id: 'volunteer-network', name: 'Mobilise volunteers', description: 'Coordinate volunteers for lawful voter outreach.', cost: 1000, score: 8, support: 1, influence: 3, xp: 16 },
  { id: 'public-debate', name: 'Public policy debate', description: 'Present your proposals and answer public questions.', cost: 600, score: 6, support: 2, influence: 2, xp: 14 }
];

function electionCandidates() {
  const candidates = [{ id: 'player', name: state.playerName || 'Player Candidate', role: state.role || 'Political Volunteer' }];
  (state.partyMemberRecords || []).forEach(member => {
    if (member && member.id !== 'founder' && member.name) candidates.push({ id: member.id, name: member.name, role: member.role || 'Party Member' });
  });
  return candidates;
}

function electionPage() {
  const e = state.elections;
  const active = e.active;
  const candidateList = electionCandidates();
  const totalVoters = Number(state.constituency.totalVoters) || 46900;
  const averageSupport = Math.round((state.constituency.localities || []).reduce((sum, item) => sum + Number(item.support || 0), 0) / Math.max(1, (state.constituency.localities || []).length));
  const winRate = e.totalContested ? Math.round(e.totalWon / e.totalContested * 100) : 0;

  const electionCalendar = ensureElectionCalendar();
  const pendingNominations = electionCalendar.nominationQueue.filter(item => item.status === 'Pending');
  const electionScheduleHtml = Object.entries(electionCalendar.calendar).map(([id, item]) =>
    `<div class="finance-history"><span>${escapeHtml(item.label || id)}</span><b>${Math.max(0, Number(item.nextAt || 0) - currentMonthIndex())} months</b></div>`
  ).join('');
  const nominationHtml = pendingNominations.length ? pendingNominations.map(item =>
    `<div class="finance-history nomination-card"><span><b>${escapeHtml(item.typeName)}</b><br>${escapeHtml(item.candidateName)} · ${escapeHtml(item.constituency)}<br><small>${escapeHtml(item.candidateRole || 'Party member')} · ${escapeHtml(item.aiReason)}</small></span><div class="nomination-actions"><button class="secondary-btn" data-nomination-action="approve" data-nomination-id="${escapeHtml(item.id)}">Approve</button><button class="secondary-btn" data-nomination-action="replace" data-nomination-id="${escapeHtml(item.id)}">Replace</button><button class="secondary-btn" data-nomination-action="reject" data-nomination-id="${escapeHtml(item.id)}">Reject</button></div></div>`
  ).join('') : '<p class="panel-description">No AI candidate proposals are awaiting your review.</p>';

  return `
    <div class="page-heading">
      <div>
        <div class="eyebrow">DEMOCRATIC COMPETITION</div>
        <h1>Election <em>command centre</em></h1>
        <p>Prepare your candidate, campaign responsibly and face the ballot.</p>
      </div>
    </div>

    <div class="stats-grid election-stats">
      ${statCard('ELECTIONS CONTESTED', e.totalContested, 'Career record', '▤')}
      ${statCard('ELECTIONS WON', e.totalWon, 'Successful contests', '★')}
      ${statCard('WIN RATE', winRate + '%', 'Based on completed contests', '✦')}
      ${statCard('LOCAL SUPPORT', averageSupport + '%', 'Across your localities', '♥')}
    </div>

    <section class="panel">
      <span class="gold-tag">RECURRING ELECTION CALENDAR</span>
      <h2>Upcoming election cycles</h2>
      ${electionScheduleHtml}
      <h2>AI candidate nomination review</h2>
      <p class="panel-description">Review every proposed candidate before the party submits a nomination. Approving records party approval; it does not claim that an official filing has occurred.</p>
      <div class="election-metrics">
        <div><small>PENDING REVIEW</small><b>${pendingNominations.length}</b></div>
        <div><small>APPROVED BY YOU</small><b>${electionCalendar.nominationQueue.filter(item => item.status === 'Approved').length}</b></div>
        <div><small>REJECTED</small><b>${electionCalendar.nominationQueue.filter(item => item.status === 'Rejected').length}</b></div>
      </div>
      ${nominationHtml}
    </section>

    ${active ? `
      <section class="panel election-active-panel">
        <span class="gold-tag">CAMPAIGN IN PROGRESS</span>
        <h2>${escapeHtml(active.typeName)}</h2>
        <p class="panel-description">Candidate: <b>${escapeHtml(active.candidateName)}</b> · ${escapeHtml(active.candidateId === 'player' ? 'You are contesting' : 'Party candidate')}</p>
        <div class="election-metrics">
          <div><small>CAMPAIGN SCORE</small><b>${active.campaignScore}/100</b></div>
          <div><small>CAMPAIGN FUNDS</small><b>${money(active.budget)}</b></div>
          <div><small>ESTIMATED SUPPORT</small><b>${active.estimatedSupport}%</b></div>
        </div>
        <div class="mini-progress"><i style="width:${Math.min(100, active.campaignScore)}%"></i></div>
        <div class="section-heading"><div><span class="eyebrow">CAMPAIGN OPERATIONS</span><h3>Choose your next move</h3></div></div>
        <div class="activity-grid">
          ${campaignActions.map(action => `
            <article class="panel activity-card election-action-card">
              <h3>${action.name}</h3>
              <p class="panel-description">${action.description}</p>
              <div class="party-stat-row"><span>Campaign cost</span><b>${money(action.cost)}</b></div>
              <div class="activity-rewards"><span>+${action.score} campaign score</span><span>+${action.support}% support potential</span></div>
              <button class="secondary-btn full" data-campaign-action="${action.id}" ${active.budget < action.cost || state.actionsUsed >= dailyActionLimit() ? 'disabled' : ''}>${state.actionsUsed >= dailyActionLimit() ? 'DAILY LIMIT REACHED' : active.budget < action.cost ? 'INSUFFICIENT CAMPAIGN FUNDS' : 'RUN CAMPAIGN ACTIVITY →'}</button>
            </article>
          `).join('')}
        </div>
        <section class="panel manifesto-panel">
          <span class="eyebrow">YOUR ELECTION MANIFESTO</span>
          <p>${escapeHtml(active.manifesto)}</p>
          <div class="party-stat-row"><span>Campaign activities completed</span><b>${active.activities.length}</b></div>
          <button class="primary-btn full" data-action="hold-election" ${active.activities.length < 2 ? 'disabled' : ''}>GO TO POLLING & COUNTING →</button>
          ${active.activities.length < 2 ? '<small class="creator-note">Complete at least two campaign activities before polling day.</small>' : ''}
        </section>
      </section>
    ` : `
      <section class="panel election-start-panel">
        <span class="gold-tag">NEXT ELECTORAL OPPORTUNITY</span>
        <h2>Prepare to contest an election</h2>
        <p class="panel-description">Choose an election level, candidate and campaign plan. Higher offices require stronger political standing.</p>
        <form id="start-election-form" class="creator-panel election-form">
          <div class="creator-grid">
            <div class="creator-field">
              <label for="electionType">Election type</label>
              <select id="electionType" name="electionType" required>
                ${electionTypes.map(type => `<option value="${type.id}">${type.name} · ${type.level}</option>`).join('')}
              </select>
            </div>
            <div class="creator-field">
              <label for="electionCandidate">Candidate</label>
              <select id="electionCandidate" name="candidateId" required>
                ${candidateList.map(candidate => `<option value="${escapeHtml(candidate.id)}">${escapeHtml(candidate.name)} · ${escapeHtml(candidate.role)}</option>`).join('')}
              </select>
            </div>
            <div class="creator-field">
              <label for="campaignBudget">Campaign budget</label>
              <select id="campaignBudget" name="campaignBudget" required>
                <option value="5000">₹5,000 · Starter</option>
                <option value="10000">₹10,000 · Standard</option>
                <option value="20000">₹20,000 · Strong</option>
                <option value="40000">₹40,000 · Major campaign</option>
              </select>
            </div>
          </div>
          <div class="creator-field">
            <label for="electionManifesto">Election manifesto summary</label>
            <textarea id="electionManifesto" name="manifesto" rows="4" maxlength="320" placeholder="Describe your priorities: roads, water, education, healthcare and jobs..." required></textarea>
          </div>
          <div class="election-note"><b>Constituency:</b> ${escapeHtml(state.constituency.constituencyName)} · ${escapeHtml(state.constituency.district)}, ${escapeHtml(state.constituency.state)}<br><b>Estimated local voters:</b> ${totalVoters.toLocaleString('en-IN')}<br><b>Party:</b> ${escapeHtml(state.party)}</div>
          <button type="submit" class="primary-btn full">LAUNCH ELECTION CAMPAIGN →</button>
        </form>
      </section>
    `}

    <section class="panel" style="margin-top:16px">
      <span class="eyebrow">ELECTION HISTORY</span>
      <h3>Your electoral record</h3>
      ${e.history.length ? e.history.slice(0, 10).map(item => `
        <div class="career-step election-history-row">
          <div><b>${escapeHtml(item.typeName)}</b><small>${escapeHtml(item.candidateName)} · ${escapeHtml(item.date)}</small></div>
          <span class="${item.result === 'Won' ? 'current-label' : 'locked'}">${item.result.toUpperCase()}</span>
        </div>
      `).join('') : '<p class="panel-description">You have not contested an election yet. Your first contest can begin here.</p>'}
    </section>
  `;
}

function startElection(form) {
  if (!state.characterCreated) return toast('Create your politician profile first.');
  if (state.elections.active) return toast('An election campaign is already active.');
  const data = new FormData(form);
  const type = electionTypes.find(item => item.id === String(data.get('electionType')));
  const candidate = electionCandidates().find(item => item.id === String(data.get('candidateId')));
  const budget = Number(data.get('campaignBudget'));
  const manifesto = String(data.get('manifesto') || '').trim();
  if (!type || !candidate || manifesto.length < 20) return toast('Choose a candidate and write a manifesto of at least 20 characters.');
  if (state.influence < type.minInfluence || state.reputation < type.minReputation) {
    return toast(`This election requires influence ${type.minInfluence} and reputation ${type.minReputation}. Build your political standing first.`);
  }
  if (!Number.isFinite(budget) || budget < 5000 || state.money < budget + type.deposit) {
    return toast(`You need ${money(budget + type.deposit)} for the selected campaign and deposit.`);
  }
  state.money -= budget + type.deposit;
  state.totalExpenses += budget + type.deposit;
  const localitySupport = (state.constituency.localities || []).reduce((sum, item) => sum + Number(item.support || 0), 0) / Math.max(1, state.constituency.localities.length);
  const estimatedSupport = Math.max(1, Math.min(85, Math.round(localitySupport + state.reputation * 0.18 + state.influence * 0.12 + (state.partyPopularity || 0) * 0.08)));
  state.elections.active = {
    id: 'election-' + Date.now(), typeId: type.id, typeName: type.name, level: type.level,
    candidateId: candidate.id, candidateName: candidate.name, manifesto,
    budget, initialBudget: budget, deposit: type.deposit,
    campaignScore: 0, estimatedSupport, activities: [],
    opponentName: ['Arjun Rao', 'Meera Kulkarni', 'Ravi Shetty', 'Ananya Menon', 'Vikram Desai'][state.elections.totalContested % 5],
    started: dateText(), constituency: state.constituency.constituencyName
  };
  saveState();
  render();
  toast('Election campaign launched. Build support before polling day.');
}

function runCampaignAction(id) {
  const active = state.elections.active;
  const action = campaignActions.find(item => item.id === id);
  if (!active || !action) return;
  if (state.actionsUsed >= dailyActionLimit()) return toast('Daily action limit reached. End the day to continue.');
  if (active.budget < action.cost) return toast('Not enough campaign funds.');
  active.budget -= action.cost;
  active.campaignScore = Math.min(100, active.campaignScore + action.score);
  active.estimatedSupport = Math.min(90, active.estimatedSupport + action.support);
  active.activities.push({ name: action.name, date: dateText(), cost: action.cost });
  state.actionsUsed++;
  state.totalActions++;
  state.experience += action.xp;
  state.influence = Math.min(100, state.influence + action.influence);
  state.reputation = Math.min(100, state.reputation + Math.max(1, Math.floor(action.support / 2)));
  state.publicSupport = Math.min(100, state.publicSupport + action.support);
  if (active.candidateId === 'player') {
    const locality = state.constituency.localities.find(item => item.name === state.constituency.selectedLocality) || state.constituency.localities[0];
    if (locality) locality.support = Math.min(100, Number(locality.support || 0) + action.support);
  }
  saveState();
  render();
  toast(`${action.name} completed.`);
}

function holdElection() {
  const active = state.elections.active;
  if (!active) return toast('No active election campaign.');
  if (active.activities.length < 2) return toast('Complete at least two campaign activities first.');
  const type = electionTypes.find(item => item.id === active.typeId);
  const totalVoters = type.id === 'local' ? Number(state.constituency.totalVoters) || type.voters : type.voters;
  const turnoutRate = Math.min(0.78, 0.48 + active.campaignScore / 250 + active.estimatedSupport / 500);
  const turnout = Math.round(totalVoters * turnoutRate);
  const candidateShare = Math.max(5, Math.min(85, active.estimatedSupport * 0.48 + active.campaignScore * 0.32 + state.reputation * 0.12 + state.influence * 0.08));
  const opponentShare = Math.max(5, Math.min(80, 100 - candidateShare - 8));
  const otherShare = Math.max(0, 100 - candidateShare - opponentShare);
  const candidateVotes = Math.round(turnout * candidateShare / 100);
  const opponentVotes = Math.round(turnout * opponentShare / 100);
  const otherVotes = Math.max(0, turnout - candidateVotes - opponentVotes);
  const won = candidateVotes > opponentVotes;
  const result = {
    id: active.id, typeName: active.typeName, candidateName: active.candidateName,
    candidateId: active.candidateId, constituency: active.constituency,
    date: dateText(), result: won ? 'Won' : 'Lost', totalVoters, turnout,
    candidateVotes, opponentVotes, otherVotes, opponentName: active.opponentName,
    candidateShare: Math.round(candidateVotes / Math.max(1, turnout) * 100),
    campaignScore: active.campaignScore, manifesto: active.manifesto
  };
  state.elections.history.unshift(result);
  state.elections.history = state.elections.history.slice(0, 30);
  state.elections.totalContested++;
  if (won) {
    state.elections.totalWon++;
    state.reputation = Math.min(100, state.reputation + 8);
    state.influence = Math.min(100, state.influence + 10);
    state.publicSupport = Math.min(100, state.publicSupport + 8);
    state.experience += 100;
    if (active.candidateId === 'player') {
      state.role = type.winRole;
      state.level = Math.max(state.level, type.id === 'local' ? 2 : type.id === 'assembly' ? 5 : 8);
    }
    if (state.partyId !== 'independent') state.partyPopularity = Math.min(100, state.partyPopularity + 8);
  } else {
    state.elections.totalLost++;
    state.reputation = Math.max(0, state.reputation - 2);
    state.experience += 25;
  }
  if (state.partyId !== 'independent' && state.partyFunds >= 0) {
    state.partyElectionHistory.push({ event: `${result.result} ${active.typeName}`, date: dateText() });
  }
  state.elections.active = null;
  saveState();
  render();
  showElectionResult(result);
}

function showElectionResult(result) {
  const message = result.result === 'Won' ? 'Congratulations! Your candidate has won the election.' : 'Your candidate did not win this election. Review the result and prepare for the next contest.';
  const overlay = document.createElement('div');
  overlay.className = 'election-result-overlay';
  overlay.innerHTML = `
    <section class="panel election-result-card">
      <span class="gold-tag">OFFICIAL SIMULATION RESULT</span>
      <h2 class="${result.result === 'Won' ? 'result-won' : 'result-lost'}">${result.result === 'Won' ? 'ELECTION WON' : 'ELECTION LOST'}</h2>
      <p class="panel-description">${message}</p>
      <div class="election-result-score">
        <div><small>${escapeHtml(result.candidateName)}</small><b>${result.candidateVotes.toLocaleString('en-IN')}</b><span>${result.candidateShare}% votes</span></div>
        <div><small>${escapeHtml(result.opponentName)}</small><b>${result.opponentVotes.toLocaleString('en-IN')}</b><span>Opposition votes</span></div>
      </div>
      <div class="party-stat-row"><span>Total turnout</span><b>${result.turnout.toLocaleString('en-IN')} / ${result.totalVoters.toLocaleString('en-IN')}</b></div>
      <button class="primary-btn full" data-action="close-election-result">CONTINUE →</button>
    </section>`;
  document.body.appendChild(overlay);
}

const governmentPortfolios = [
  'Finance', 'Home Affairs', 'Education', 'Health & Family Welfare',
  'Rural Development', 'Infrastructure', 'Agriculture'
];

function governmentMandateCount() {
  return (state.elections?.history || []).filter(item =>
    item.result === 'Won' && String(item.typeName || item.type || '').toLowerCase().includes('assembly')
  ).length;
}

function ensureGovernmentState() {
  if (!state.government || typeof state.government !== 'object') {
    state.government = JSON.parse(JSON.stringify(defaults.government));
  }
  const g = state.government;
  if (!g.ministers) g.ministers = {};
  if (!g.departments) g.departments = JSON.parse(JSON.stringify(defaults.government.departments));
  if (!Array.isArray(g.schemes)) g.schemes = [];
  if (!Array.isArray(g.history)) g.history = [];
  if (!Number.isFinite(Number(g.treasury))) g.treasury = 50000000;
  if (!Number.isFinite(Number(g.performance))) g.performance = 50;
  return g;
}

function formGovernment() {
  const g = ensureGovernmentState();
  if (governmentMandateCount() < 1) return toast('Win a State Assembly election before forming a government.');
  if (g.formed) return toast('Your state government is already formed.');
  g.formed = true;
  g.chiefMinister = state.playerName;
  g.history.unshift({ day: state.day, month: state.month, year: state.year, event: 'State government formed' });
  saveState(); render(); toast('Your state government has been formed!');
}

function appointMinister(portfolio) {
  const g = ensureGovernmentState();
  if (!g.formed) return toast('Form your government first.');
  if (!governmentPortfolios.includes(portfolio)) return;
  const candidates = ['Ananya Rao', 'Vikram Shetty', 'Meera Nair', 'Arjun Deshmukh', 'Kavita Sharma', 'Rahul Menon', 'Sanjay Patil'];
  const used = Object.values(g.ministers);
  const candidate = candidates.find(name => !used.includes(name)) || 'Independent Expert';
  g.ministers[portfolio] = candidate;
  g.history.unshift({ day: state.day, month: state.month, year: state.year, event: `${portfolio} Minister appointed` });
  saveState(); render(); toast(`${candidate} appointed to ${portfolio}.`);
}

function allocateDepartment(department, delta) {
  const g = ensureGovernmentState();
  if (!g.formed) return toast('Form your government first.');
  const current = Number(g.departments[department] || 0);
  const next = Math.max(5, Math.min(50, current + delta));
  const total = Object.entries(g.departments).reduce((sum, [key, value]) => sum + (key === department ? next : Number(value || 0)), 0);
  if (total > 100) return toast('Department allocations cannot exceed 100%. Reduce another department first.');
  g.departments[department] = next;
  saveState(); render();
}

function launchGovernmentScheme() {
  const g = ensureGovernmentState();
  if (!g.formed) return toast('Form your government first.');
  const cost = 5000000;
  if (g.treasury < cost) return toast('Insufficient government treasury for this programme.');
  const schemes = [
    ['Rural Road Improvement', 'Infrastructure'],
    ['School Modernisation Mission', 'Education'],
    ['Primary Health Centre Upgrade', 'Health'],
    ['Village Drinking Water Programme', 'Rural Development'],
    ['Farmer Support and Irrigation Plan', 'Agriculture']
  ];
  const available = schemes.find(([name]) => !g.schemes.some(item => item.name === name));
  if (!available) return toast('All available starter programmes have already been launched.');
  g.treasury -= cost;
  g.schemes.unshift({ name: available[0], department: available[1], cost, status: 'In progress', day: state.day, month: state.month, year: state.year });
  g.performance = Math.min(100, Number(g.performance) + 4);
  state.reputation = Math.min(100, Number(state.reputation || 0) + 2);
  if (state.media) state.media.approval = Math.min(100, Number(state.media.approval || 0) + 2);
  g.history.unshift({ day: state.day, month: state.month, year: state.year, event: `${available[0]} launched` });
  saveState(); render(); toast(`${available[0]} launched. ₹50 lakh allocated.`);
}

function governmentPage() {
  const g = ensureGovernmentState();
  const wins = governmentMandateCount();
  const formed = !!g.formed;
  const totalAllocation = Object.values(g.departments).reduce((sum, value) => sum + Number(value || 0), 0);
  const ministries = governmentPortfolios.map(portfolio => `
    <article class="panel government-portfolio">
      <span class="eyebrow">MINISTRY PORTFOLIO</span><h3>${escapeHtml(portfolio)}</h3>
      <b>${escapeHtml(g.ministers[portfolio] || (portfolio === 'Finance' && formed ? 'Appointment pending' : 'Vacant'))}</b>
      <button class="secondary-btn" data-gov-appoint="${escapeHtml(portfolio)}" ${!formed ? 'disabled' : ''}>${g.ministers[portfolio] ? 'REPLACE MINISTER' : 'APPOINT MINISTER'}</button>
    </article>`).join('');
  const departments = Object.entries(g.departments).map(([name, value]) => `
    <div class="gov-budget-row"><div><b>${escapeHtml(name)}</b><strong>${Number(value)}%</strong></div>
      <div class="gov-budget-track"><i style="width:${Math.max(0,Math.min(100,Number(value)))}%"></i></div>
      <div class="gov-budget-actions"><button data-gov-budget="${escapeHtml(name)}" data-delta="-5" ${!formed || value <= 5 ? 'disabled' : ''}>−5%</button><button data-gov-budget="${escapeHtml(name)}" data-delta="5" ${!formed || totalAllocation >= 100 ? 'disabled' : ''}>+5%</button></div>
    </div>`).join('');
  return `
    <div class="page-heading"><div><div class="eyebrow">PUBLIC ADMINISTRATION</div><h1>Government <em>command</em></h1><p>Form a cabinet, manage public funds and deliver state programmes.</p></div><div class="date-card"><span>GOVERNMENT STATUS</span><b>${formed ? 'GOVERNMENT FORMED' : wins ? 'MANDATE AVAILABLE' : 'NOT FORMED'}</b><small>${wins} Assembly victory/victories</small></div></div>
    <section class="panel government-hero"><span class="gold-tag">STATE ADMINISTRATION</span><h2>${formed ? 'Your state government' : wins ? 'You have an Assembly mandate' : 'The path to government'}</h2>
      <p class="panel-description">${formed ? `Chief Minister: ${escapeHtml(g.chiefMinister || state.playerName)}. Build your cabinet and deliver programmes.` : 'Win a State Assembly election to unlock government formation, ministerial appointments and administration.'}</p>
      <div class="government-unlock-grid"><div><b>${money(g.treasury)}</b><small>Government treasury</small></div><div><b>${Number(g.performance)}%</b><small>Administration performance</small></div><div><b>${Object.keys(g.ministers).length}/${governmentPortfolios.length}</b><small>Ministers appointed</small></div></div>
      <button class="primary-btn" data-action="gov-form" ${!wins || formed ? 'disabled' : ''}>${formed ? 'GOVERNMENT FORMED' : 'FORM STATE GOVERNMENT'}</button>
    </section>
    <div class="command-section-head"><div><span class="eyebrow">COUNCIL OF MINISTERS</span><h2>Cabinet formation</h2></div></div>
    <div class="government-cabinet-grid">${ministries}</div>
    <section class="panel gov-budget-panel"><div class="command-section-head"><div><span class="eyebrow">PUBLIC FINANCE</span><h2>Department allocations</h2></div><b>${totalAllocation}% allocated</b></div>
      <p class="panel-description">Adjust each department in 5% steps. Total allocation cannot exceed 100%.</p>${departments}
    </section>
    <section class="panel gov-scheme-panel"><div class="command-section-head"><div><span class="eyebrow">PUBLIC DELIVERY</span><h2>Government programmes</h2></div><b>${g.schemes.length} launched</b></div>
      <p class="panel-description">Launch a state programme using ₹50 lakh from the government treasury.</p><button class="primary-btn" data-action="gov-scheme" ${!formed ? 'disabled' : ''}>LAUNCH NEXT PUBLIC PROGRAMME</button>
      ${g.schemes.length ? g.schemes.map(item => `<div class="gov-scheme-row"><div><b>${escapeHtml(item.name)}</b><small>${escapeHtml(item.department)} · ${escapeHtml(item.status)}</small></div><strong>${money(item.cost)}</strong></div>`).join('') : '<p class="panel-description">No programmes launched yet.</p>'}
    </section>
    <section class="panel government-note"><span class="eyebrow">RECENT GOVERNMENT ACTIVITY</span><h3>Administration record</h3>
      ${g.history.length ? g.history.slice(0,8).map(item => `<div class="gov-scheme-row"><b>${escapeHtml(item.event)}</b><small>Year ${item.year}, Month ${item.month}, Day ${item.day}</small></div>`).join('') : '<p class="panel-description">Government decisions will appear here.</p>'}
    </section>
    <p class="ci-disclaimer">Government treasury, cabinet candidates and programme outcomes are fictional gameplay simulations. They do not represent real government budgets or officials.</p>
  `;
}

function executiveRoleScope() {
  const role = String(state.role || 'Political Volunteer');
  if (/Prime Minister|Union Minister|Member of Parliament/.test(role)) return { level: 'National', authority: 'Union Government and Parliament', pool: [
    ['Review national employment programme', 'Review programme outcomes with the Labour Ministry.', 'employment', 3],
    ['Prepare parliamentary question brief', 'Identify a national policy gap and prepare a parliamentary brief.', 'parliament', 2],
    ['Review railway connectivity proposal', 'Assess connectivity needs and project readiness.', 'infrastructure', 3],
    ['Coordinate disaster-response review', 'Review preparedness with national and state agencies.', 'governance', 2],
    ['Evaluate public healthcare mission', 'Review access, staffing and service delivery.', 'health', 3],
    ['Hold constituency development consultation', 'Collect local priorities and send them to the relevant ministry.', 'constituency', 2],
    ['Review national education outcomes', 'Examine school access and learning support.', 'education', 3],
    ['Resolve inter-ministry coordination issue', 'Bring responsible ministries together around a stalled matter.', 'governance', 2]
  ] };
  if (/Chief Minister|State Minister|MLA/.test(role)) return { level: 'State', authority: role === 'Chief Minister' ? 'State-wide executive leadership' : role === 'State Minister' ? 'Assigned ministry portfolio' : 'Your elected constituency and Assembly', pool: [
    ['Review district hospital staffing', 'Review vacancies and service pressure with the Health Department.', 'health', 3],
    ['Inspect a delayed road project', 'Require a progress report and corrective timeline.', 'infrastructure', 3],
    ['Resolve school facility shortage', 'Coordinate a targeted education response.', 'education', 3],
    ['Review drinking water supply plan', 'Prioritise affected localities and monitor supply.', 'water', 3],
    ['Hold district collector performance review', 'Review targets, delays and citizen grievances.', 'governance', 2],
    ['Prepare Assembly question on unemployment', 'Use current employment concerns to prepare an oversight brief.', 'parliament', 2],
    ['Review farmer support implementation', 'Check delivery gaps in agriculture support.', 'agriculture', 3],
    ['Conduct public grievance hearing', 'Hear a set of citizen cases and direct follow-up.', 'public', 2],
    ['Review state budget utilisation', 'Identify underused allocations and priority needs.', 'budget', 2],
    ['Resolve inter-department project delay', 'Coordinate departments to unblock a stalled project.', 'governance', 3]
  ] };
  if (/Councillor|Panchayat/.test(role)) return { level: 'Local', authority: 'Your local body and elected area', pool: [
    ['Inspect drainage blockage', 'Visit the affected ward and arrange a civic response.', 'sanitation', 3],
    ['Resolve streetlight outage', 'Coordinate repair and confirm public safety coverage.', 'infrastructure', 2],
    ['Hold drinking-water quality meeting', 'Review complaints and arrange testing or supply follow-up.', 'water', 3],
    ['Review local waste collection route', 'Address missed collections and route gaps.', 'sanitation', 2],
    ['Meet self-help group representatives', 'Collect livelihood and market-access priorities.', 'public', 2],
    ['Inspect anganwadi facility', 'Review basic facilities and service needs.', 'health', 2],
    ['Resolve local road safety concern', 'Escalate a dangerous crossing or damaged road section.', 'infrastructure', 3],
    ['Review ward-level school needs', 'Identify urgent facility and access issues.', 'education', 2]
  ] };
  if (/Party Leader|Booth-level/.test(role)) return { level: 'Party', authority: 'Your party organisation and assigned area', pool: [
    ['Recruit booth volunteers', 'Expand local volunteer capacity and voter outreach.', 'party', 3],
    ['Resolve party unit coordination dispute', 'Meet unit representatives and restore coordination.', 'party', 2],
    ['Prepare local membership drive', 'Plan a targeted recruitment activity.', 'party', 3],
    ['Review booth-level public concerns', 'Collect issues and submit them to elected representatives.', 'public', 2],
    ['Train new campaign volunteers', 'Improve local organisation and campaign readiness.', 'party', 2],
    ['Organise policy discussion meeting', 'Explain party priorities and gather feedback.', 'party', 2],
    ['Coordinate a community service activity', 'Build trust through a practical local initiative.', 'public', 2]
  ] };
  return { level: 'Grassroots', authority: 'Your assigned political area', pool: [
    ['Conduct door-to-door listening visit', 'Record residents’ top concerns and submit a report.', 'public', 2],
    ['Help a resident navigate a public service', 'Assist with a service issue and record the outcome.', 'public', 2],
    ['Prepare a local issue evidence report', 'Document a specific problem with location and impact.', 'constituency', 2],
    ['Organise a neighbourhood clean-up', 'Coordinate residents around a visible civic improvement.', 'sanitation', 2],
    ['Support a youth employment awareness camp', 'Connect young residents with available opportunities.', 'employment', 2],
    ['Attend a community association meeting', 'Bring local concerns to the party unit.', 'party', 1],
    ['Map accessibility barriers', 'Identify public access issues for elderly and disabled residents.', 'infrastructure', 2]
  ] };
}


function generateMonthlyOfficeTasks() {
  const office = state.executiveOffice;
  const scope = executiveRoleScope();
  const history = new Set((office.taskHistory || []).slice(-24).map(item => typeof item === 'string' ? item : item.title));
  const activeTitles = new Set(office.tasks.filter(t => t.status === 'Pending' || t.status === 'In progress').map(t => t.title));
  const seed = Number(state.year || 1) * 17 + Number(state.month || 1) * 7 + (office.taskHistory || []).length + office.tasks.length;
  const available = scope.pool.filter(item => !history.has(item[0]) && !activeTitles.has(item[0]));
  const pool = available.length >= 2 ? available : scope.pool.filter(item => !activeTitles.has(item[0]));
  const chosen = [];
  for (let i = 0; i < Math.min(3, pool.length); i++) chosen.push(pool[(seed + i * 3) % pool.length]);
  chosen.forEach((item, i) => {
    const category = item[2];
    const budgetBands = {
      public: [1500, 3500, 6000], party: [2500, 5000, 9000],
      infrastructure: [8000, 15000, 30000], water: [5000, 10000, 20000],
      health: [5000, 12000, 25000], education: [4000, 10000, 18000],
      employment: [3000, 7000, 15000], agriculture: [4000, 9000, 18000],
      sanitation: [2500, 6000, 12000], budget: [0, 2500, 5000],
      parliament: [1000, 2500, 5000], governance: [1500, 4000, 8000],
      constituency: [1500, 4000, 7500]
    };
    const budgets = budgetBands[category] || [1500, 3500, 7000];
    const budget = budgets[(seed + i) % budgets.length];
    const duration = [1, 2, 3, 4][(seed + i * 2) % 4];
    const impact = Math.max(1, Number(item[3]) || 1);
    const resourceMap = {
      infrastructure: 'Engineering staff, site inspection, contractor coordination, materials and transport',
      water: 'Water-board engineers, testing kits, tanker or pipeline coordination and local representatives',
      health: 'Health officers, facility staff, medical supply review and district health data',
      education: 'School inspectors, education officers, facility audit and community consultation',
      party: 'Party organisers, booth volunteers, meeting venue, communications and membership records',
      public: 'Field staff, local representatives, public meeting venue and grievance register',
      employment: 'Employment office, training partners, local employers and outreach material',
      agriculture: 'Agriculture officers, farmer groups, field visit and scheme-delivery records',
      sanitation: 'Municipal/panchayat sanitation team, equipment, route map and resident feedback',
      parliament: 'Policy research brief, parliamentary staff and constituency evidence',
      governance: 'Department heads, performance data, review meeting and follow-up orders',
      budget: 'Finance officials, expenditure statements and department utilisation reports',
      constituency: 'Local issue register, field coordinators and resident consultation'
    };
    const usesMap = {
      infrastructure: 'Inspect the work, identify the bottleneck and issue a time-bound corrective plan.',
      water: 'Identify affected localities, validate supply gaps and coordinate a practical service response.',
      health: 'Prioritise service gaps and obtain a measurable improvement plan from health officials.',
      education: 'Identify the facility or access gap and secure a responsible follow-up plan.',
      party: 'Strengthen party organisation, improve volunteer coordination and expand local capacity.',
      public: 'Hear residents, record actionable issues and ensure each issue reaches the responsible office.',
      employment: 'Connect residents with training, vacancies or livelihood support and review outcomes.',
      agriculture: 'Identify delivery gaps and coordinate farmer-facing support with agriculture officials.',
      sanitation: 'Resolve a visible civic service gap and verify the improvement with residents.',
      parliament: 'Prepare evidence, define the issue and use the appropriate parliamentary channel.',
      governance: 'Review accountability, assign corrective action and monitor the responsible department.',
      budget: 'Check spending against outcomes and recommend reallocation or corrective controls.',
      constituency: 'Document the local issue, identify the responsible authority and follow through.'
    };
    const riskMap = {
      infrastructure: 'Contractor delay, cost escalation or poor-quality work may reduce the result.',
      water: 'Supply constraints or seasonal shortages may limit immediate improvement.',
      health: 'Staff shortages or procurement delays may slow service improvements.',
      education: 'Staffing and infrastructure constraints may delay implementation.',
      party: 'Internal disagreement or weak volunteer participation may reduce organisational gains.',
      public: 'Unresolved expectations or poor follow-up may reduce public confidence.',
      employment: 'Limited vacancies or low training participation may reduce outcomes.',
      agriculture: 'Weather, market prices or delayed scheme delivery may affect results.',
      sanitation: 'Equipment failure or irregular collection may cause the issue to recur.',
      parliament: 'The issue may require cross-party support or government response.',
      governance: 'Inter-department coordination or weak accountability may delay action.',
      budget: 'Incorrect estimates may create funding gaps or reduce programme delivery.',
      constituency: 'The issue may fall partly outside your authority and require escalation.'
    };
    office.tasks.push({
      id: office.nextId++, title: item[0], detail: item[1], impactType: category, impact: impact,
      assignedBy: i === 0 ? 'Political Office' : 'Chief of Staff', level: scope.level,
      status: 'Pending', due: `${dateText()} · review by month-end`, createdAt: dateText(),
      assignedMonth: dateText(), budgetRequired: budget, estimatedDuration: duration, monthsRemaining: duration,
      fundingSource: state.partyId !== 'independent' && category === 'party' ? 'Party organisation funds' : 'Personal / office allocation',
      resources: resourceMap[category] || 'Relevant officers, field staff, records and coordination support',
      expectedUse: usesMap[category] || 'Address the issue within your current authority and report measurable progress.',
      expectedOutcome: `${category} indicator improves by approximately ${impact} game points if completed successfully.`,
      expectedPartyImpact: category === 'party' ? 3 : (category === 'public' || category === 'constituency' ? 2 : 1),
      expectedReputationImpact: category === 'public' || category === 'governance' || category === 'health' ? 2 : 1,
      risk: riskMap[category] || 'Delays or incomplete follow-up may reduce public confidence.',
      carryForwardCount: 0, monthsWorked: 0, progress: 0, decisionHistory: []
    });
  });
}

function advanceOfficeMonth() {
  const office = ensureExecutiveOffice();
  office.tasks.forEach(task => {
    if (task.status === 'Pending' || task.status === 'In progress') {
      task.carryForwardCount = Number(task.carryForwardCount || 0) + 1;
      task.monthsRemaining = Math.max(0, Number(task.monthsRemaining || task.estimatedDuration || 1) - 1);
      if (task.status === 'In progress') {
        task.monthsWorked = Number(task.monthsWorked || 0) + 1;
        task.progress = Math.min(90, Number(task.progress || 0) + Math.max(10, Math.round(100 / Math.max(1, Number(task.estimatedDuration || 1)))));
      }
      task.due = `Carried forward · ${task.carryForwardCount} month(s)`;
      task.lastReviewed = dateText();
      task.decisionHistory = Array.isArray(task.decisionHistory) ? task.decisionHistory : [];
      task.decisionHistory.push({ date: dateText(), decision: task.status === 'In progress' ? 'Continued in progress' : 'Kept pending' });
    }
  });
  office.tasks = office.tasks.filter(task => task.status !== 'Completed' && task.status !== 'Rejected');
  generateMonthlyOfficeTasks();
  office.lastAiReport = `Monthly review: ${office.tasks.filter(task => task.carryForwardCount > 0).length} unfinished responsibilities carried forward. ${office.tasks.filter(task => task.createdAt === dateText()).length} new assignments issued for ${dateText()}.`;
}


function ensurePoliticalRelationships() {
  if (!state.politicalRelationships || typeof state.politicalRelationships !== 'object') state.politicalRelationships = {};
  const rel = state.politicalRelationships;
  if (!Array.isArray(rel.people)) rel.people = [
    { id:'party-chief', name:'Arjun Rao', role:'State Party President', type:'Party leadership', loyalty:68, trust:62, influence:82, note:'Controls key party organisation decisions.' },
    { id:'senior-minister', name:'Meera Kulkarni', role:'Senior Minister', type:'Cabinet', loyalty:74, trust:70, influence:76, note:'Influential in cabinet and policy discussions.' },
    { id:'young-mla', name:'Kiran Shetty', role:'Young MLA', type:'Party colleague', loyalty:58, trust:55, influence:42, note:'Wants a larger role in the party.' },
    { id:'opposition-leader', name:'Dev Malhotra', role:'Opposition Leader', type:'Opposition', loyalty:35, trust:30, influence:78, note:'Can cooperate on public-interest issues, but challenges your leadership.' },
    { id:'coalition-partner', name:'Ravi Deshmukh', role:'Regional Party Leader', type:'Coalition partner', loyalty:61, trust:57, influence:65, note:'Coalition support depends on consultation and commitments.' }
  ];
  rel.people.forEach(person => {
    ['loyalty','trust','influence'].forEach(key => { person[key] = Math.max(0, Math.min(100, Number(person[key] ?? 50))); });
  });
  if (!Number.isFinite(Number(rel.stability))) rel.stability = 65;
  if (!Number.isFinite(Number(rel.oppositionPressure))) rel.oppositionPressure = 35;
  if (!Array.isArray(rel.history)) rel.history = [];
  rel.history = rel.history.slice(0, 30);
  return rel;
}

function updatePoliticalRelationshipsMonthly() {
  const rel = ensurePoliticalRelationships();
  rel.people.forEach(person => {
    if (person.type === 'Opposition') {
      person.trust = Math.max(0, person.trust - 1);
      rel.oppositionPressure = Math.min(100, Math.max(0, rel.oppositionPressure + (person.influence > 70 ? 1 : 0)));
    } else if (person.trust < person.loyalty) {
      person.trust = Math.min(person.loyalty, person.trust + 1);
    }
  });
  const averageLoyalty = rel.people.filter(p => p.type !== 'Opposition').reduce((sum,p) => sum + p.loyalty, 0) / Math.max(1, rel.people.filter(p => p.type !== 'Opposition').length);
  rel.stability = Math.max(0, Math.min(100, Math.round(averageLoyalty * 0.65 + (100 - rel.oppositionPressure) * 0.35)));
}

function recordRelationshipEvent(rel, person, text) {
  rel.history.unshift({ date: dateText(), person: person.name, event: text });
  rel.history = rel.history.slice(0, 30);
}

function ensureExecutiveOffice() {
  if (!state.executiveOffice) state.executiveOffice = { tasks: [], files: [], nextId: 1, lastAiReport: 'Administrative teams are ready.' };
  const office = state.executiveOffice;
  if (!Array.isArray(office.tasks)) office.tasks = [];
  if (!Array.isArray(office.files)) office.files = [];
  // Clean up duplicate legacy assignments from earlier versions while preserving unique task records.
  const seenTaskTitles = new Set();
  office.tasks = office.tasks.filter(task => {
    const key = String(task.title || '').trim().toLowerCase();
    if (!key) return false;
    if (seenTaskTitles.has(key)) return false;
    seenTaskTitles.add(key);
    return true;
  }).slice(-45);
  if (!Number.isFinite(Number(office.nextId))) office.nextId = office.tasks.reduce((max, task) => Math.max(max, Number(task.id) || 0), 0) + 1;
  if (!office.taskHistory || !Array.isArray(office.taskHistory)) office.taskHistory = office.tasks.filter(task => task.status === 'Completed').map(task => task.title);
  if (!office.tasks.length && !office.initialMonthlyAssignmentsCreated) {
    generateMonthlyOfficeTasks();
    office.initialMonthlyAssignmentsCreated = true;
  }

  if (!Array.isArray(office.projects)) office.projects = [];
  if (!Array.isArray(office.crises)) office.crises = [];
  if (!Array.isArray(office.decisionHistory)) office.decisionHistory = [];
  if (!office.consequenceMetrics) office.consequenceMetrics = { approvals: 0, rejections: 0, returns: 0, delayedProjects: 0, completedProjects: 0 };
  ['approvals','rejections','returns','delayedProjects','completedProjects'].forEach(key => { if (!Number.isFinite(Number(office.consequenceMetrics[key]))) office.consequenceMetrics[key] = 0; });
  if (!office.files.length && (/Chief Minister|State Minister|Prime Minister|Union Minister/.test(state.role || ''))) {
    office.files.push({ id: office.nextId++, title: 'Department performance and funding review', from: 'Chief Secretary', summary: 'Review the latest department report and proposed administrative priorities.', recommendation: 'Approve a monitored four-month implementation plan', status: 'Pending', department: 'General Administration', responsibleOfficer: 'Department Secretary', projectTitle: 'Priority Department Improvement Programme', budgetRequired: 40000, monthlyInstalment: 10000, durationMonths: 4, impact: { reputation: 2, publicSupport: 2, party: 1, rejectionReputation: 2, rejectionPublic: 2, rejectionParty: 1 } });
  }
  return office;
}

function executiveOfficePage() {
  const office = ensureExecutiveOffice();
  const scope = executiveRoleScope();
  const pending = office.files.filter(f => f.status === 'Pending');
  const tasks = office.tasks;
  return `
    <div class="page-heading"><div><div class="eyebrow">EXECUTIVE OFFICE · ${escapeHtml(scope.level.toUpperCase())} LEVEL</div><h1>My <em>office</em></h1><p>Work is assigned according to your current post. Officials and AI teams handle routine administration.</p></div><div class="date-card"><span>CURRENT POST</span><b>${escapeHtml(state.role || 'Political Volunteer')}</b><small>${escapeHtml(scope.authority)}</small></div></div>
    <section class="panel"><span class="eyebrow">YOUR RESPONSIBILITY</span><h2>What only you must handle</h2><p class="panel-description">Your authority is limited to: ${escapeHtml(scope.authority)}. You are not expected to manage every district or department personally.</p><div class="government-unlock-grid"><div><b>${tasks.filter(t=>t.status==='Pending'||t.status==='In progress').length}</b><small>Assigned tasks</small></div><div><b>${pending.length}</b><small>Files awaiting signature</small></div><div><b>AI</b><small>Routine administration</small></div></div></section>
    <section class="panel"><div class="command-section-head"><div><span class="eyebrow">PERSONAL WORK QUEUE</span><h2>My assigned work</h2><p class="panel-description">New assignments arrive monthly. You choose: take responsibility, keep pending for a later month, or reject. Unfinished work is carried forward; only your completion decision closes a mission.</p></div></div>${tasks.length ? tasks.map(t=>`<article class="panel office-task-card"><div class="command-section-head"><div><span class="gold-tag">${escapeHtml(t.level || scope.level)} · ${escapeHtml(t.status)}</span><h3>${escapeHtml(t.title)}</h3></div><b>${Number(t.carryForwardCount || 0) ? `Carried ${Number(t.carryForwardCount)}×` : 'New'}</b></div><p>${escapeHtml(t.detail || 'Assigned responsibility')}</p><div class="task-detail-grid"><div><small>FUNDS REQUIRED</small><b>${money(Number(t.budgetRequired || 0))}</b><small>${escapeHtml(t.fundingSource || 'Office allocation')}</small></div><div><small>TIME REQUIRED</small><b>${Number(t.estimatedDuration || 1)} months</b></div><div><small>TIME LEFT</small><b>${Number(t.monthsRemaining ?? t.estimatedDuration ?? 1)} months</b></div><div><small>ASSIGNED BY</small><b>${escapeHtml(t.assignedBy)}</b></div><div><small>PARTY IMPACT</small><b>+${Number(t.expectedPartyImpact || 1)}</b></div><div><small>REPUTATION IMPACT</small><b>+${Number(t.expectedReputationImpact || 1)}</b></div></div><p><b>Resources required:</b> ${escapeHtml(t.resources || 'Staff coordination and field work')}</p><p><b>How to use this assignment:</b> ${escapeHtml(t.expectedUse || '')}</p><p><b>Expected outcome:</b> ${escapeHtml(t.expectedOutcome || 'A measurable improvement in the relevant game system.')}</p><p><b>Risk:</b> ${escapeHtml(t.risk || 'Delay may reduce public confidence.')}</p><p><b>Progress:</b> ${Number(t.progress || 0)}% · ${Number(t.monthsWorked || 0)} month(s) worked</p><small>Assigned ${escapeHtml(t.createdAt || dateText())} · ${escapeHtml(t.due || 'This month')}</small><div class="gov-budget-actions">${t.status==='Pending'?`<button class="primary-btn" data-office-task="${t.id}">TAKE RESPONSIBILITY</button>`:''}${t.status==='In progress'?`<button class="primary-btn" data-office-complete="${t.id}">COMPLETE & REPORT</button>`:''}<button class="secondary-btn" data-office-keep="${t.id}">KEEP PENDING</button><button class="secondary-btn" data-office-reject="${t.id}">REJECT TASK</button></div></article>`).join('') : '<p class="panel-description">No work is currently assigned.</p>'}</section>
    <section class="panel"><span class="eyebrow">COMPLETED WORK ARCHIVE</span><h2>Completed and closed missions</h2>${office.taskHistory && office.taskHistory.length ? office.taskHistory.slice(-8).reverse().map(item=>`<div class="finance-history"><span><b>${escapeHtml(typeof item === 'string' ? item : item.title)}</b><small>${escapeHtml(typeof item === 'string' ? 'Legacy record' : (item.completedAt ? `Completed · ${item.completedAt}` : item.rejectedAt ? `Rejected · ${item.rejectedAt}` : 'Archived'))}</small></span><small>${escapeHtml(typeof item === 'string' ? '' : (item.impactSummary || ''))}</small></div>`).join('') : '<p class="panel-description">Completed missions will appear here.</p>'}</section>
    <section class="panel"><div class="command-section-head"><div><span class="eyebrow">SIGNATURE DESK</span><h2>Pending for my approval</h2></div><b>${pending.length} pending</b></div>${pending.length ? pending.map(f=>`<article class="panel government-portfolio"><span class="gold-tag">OFFICIAL FILE · ${escapeHtml(f.from)}</span><h3>${escapeHtml(f.title)}</h3><p class="panel-description">${escapeHtml(f.summary)}</p><p><b>AI / officer recommendation:</b> ${escapeHtml(f.recommendation)}</p><div class="gov-budget-actions"><button class="primary-btn" data-office-decision="approve" data-office-file="${f.id}">APPROVE & SIGN</button><button class="secondary-btn" data-office-decision="return" data-office-file="${f.id}">RETURN FOR REVISION</button><button class="secondary-btn" data-office-decision="reject" data-office-file="${f.id}">REJECT</button></div></article>`).join('') : '<p class="panel-description">No important files require your signature right now. Routine work is being handled by the administration.</p>'}</section>
    <section class="panel"><span class="eyebrow">MONTHLY PROJECT OVERSIGHT</span><h2>Approved projects & instalments</h2>${office.projects.length ? office.projects.slice(-8).reverse().map(project=>`<article class="panel government-portfolio"><div class="command-section-head"><h3>${escapeHtml(project.title)}</h3><b>${escapeHtml(project.status)}</b></div><p>${escapeHtml(project.department)} · Officer: ${escapeHtml(project.officer)}</p><div class="task-detail-grid"><div><small>TOTAL BUDGET</small><b>${money(project.totalBudget)}</b></div><div><small>SPENT</small><b>${money(project.spent)}</b></div><div><small>PROGRESS</small><b>${Number(project.progress)}%</b></div><div><small>MONTHS LEFT</small><b>${Number(project.monthsRemaining)}</b></div></div><p>${escapeHtml(project.lastReport || '')}</p></article>`).join('') : '<p class="panel-description">Approved projects will appear here with budgets and monthly officer reports.</p>'}</section>
    <section class="panel"><span class="eyebrow">URGENT POLITICAL & ADMINISTRATIVE MATTERS</span><h2>Situation desk</h2>${office.crises.filter(item=>item.status==='Pending').length ? office.crises.filter(item=>item.status==='Pending').map(item=>`<article class="panel government-portfolio"><span class="gold-tag">${escapeHtml(item.category)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.detail)}</p><div class="gov-budget-actions"><button class="primary-btn" data-office-crisis="respond" data-crisis-id="${item.id}">ISSUE RESPONSE</button><button class="secondary-btn" data-office-crisis="delegate" data-crisis-id="${item.id}">DELEGATE TO AI</button></div></article>`).join('') : '<p class="panel-description">No urgent matters are awaiting your decision.</p>'}</section>
    <section class="panel"><div class="command-section-head"><div><span class="eyebrow">POLITICAL RELATIONSHIPS</span><h2>Power & influence network</h2><p class="panel-description">Trust and loyalty shape party unity, cabinet cooperation and coalition stability. Your choices have lasting political consequences.</p></div></div>${(()=>{const rel=ensurePoliticalRelationships();return `<div class="government-unlock-grid"><div><b>${rel.stability}</b><small>Political stability</small></div><div><b>${rel.oppositionPressure}</b><small>Opposition pressure</small></div><div><b>${rel.people.filter(p=>p.type!=='Opposition'&&p.loyalty>=65).length}</b><small>Strong supporters</small></div></div>${rel.people.map(p=>`<article class="panel government-portfolio"><div class="command-section-head"><div><span class="gold-tag">${escapeHtml(p.type)}</span><h3>${escapeHtml(p.name)}</h3><small>${escapeHtml(p.role)}</small></div><b>${p.loyalty>=70?'Reliable':p.loyalty>=50?'Uncertain':'At risk'}</b></div><p>${escapeHtml(p.note)}</p><div class="task-detail-grid"><div><small>LOYALTY</small><b>${p.loyalty}/100</b></div><div><small>TRUST</small><b>${p.trust}/100</b></div><div><small>INFLUENCE</small><b>${p.influence}/100</b></div></div><div class="gov-budget-actions"><button class="primary-btn" data-relationship-action="consult" data-relationship-id="${escapeHtml(p.id)}">CONSULT</button><button class="secondary-btn" data-relationship-action="negotiate" data-relationship-id="${escapeHtml(p.id)}">${p.type==='Opposition'?'SEEK COOPERATION':p.type==='Coalition partner'?'RENEW COMMITMENT':'BUILD ALLIANCE'}</button></div></article>`).join('')}<h3>Recent political interactions</h3>${rel.history.slice(0,5).map(h=>`<div class="finance-history"><span><b>${escapeHtml(h.person)}</b><small>${escapeHtml(h.date)}</small></span><small>${escapeHtml(h.event)}</small></div>`).join('')||'<p class="panel-description">Your meetings and negotiations will be recorded here.</p>'}`})()}</section>
    <section class="panel"><span class="eyebrow">DECISION CONSEQUENCES</span><h2>Your leadership record</h2><div class="government-unlock-grid"><div><b>${office.consequenceMetrics.approvals}</b><small>Approved</small></div><div><b>${office.consequenceMetrics.rejections}</b><small>Rejected</small></div><div><b>${office.consequenceMetrics.delayedProjects}</b><small>Delayed instalments</small></div><div><b>${office.consequenceMetrics.completedProjects}</b><small>Projects completed</small></div></div>${office.decisionHistory.slice(0,5).map(item=>`<div class="finance-history"><span><b>${escapeHtml(item.title)}</b><small>${escapeHtml(item.date)} · ${escapeHtml(item.decision)}</small></span><small>Reputation ${item.reputation} · Party ${item.partyPopularity}</small></div>`).join('')}</section>
    <section class="panel"><span class="eyebrow">AI ADMINISTRATION REPORT</span><h2>Work handled automatically</h2><p class="panel-description">${escapeHtml(office.lastAiReport || 'Your administrative teams are monitoring routine operations.')}</p><p class="ci-disclaimer">AI decisions are simulated gameplay. Major decisions outside your authority are not sent to you for approval. Critical decisions within your authority appear on this signature desk.</p></section>
  `;
}

function applyOfficeTaskImpact(task) {
  const amount = Math.max(1, Number(task.impact) || 1);
  const type = task.impactType || 'public';
  const c = state.constituency || (state.constituency = { localities: [], projects: [], campaigns: [], resolvedIssues: [], totalVoters: 0 });
  if (!Array.isArray(c.localities)) c.localities = [];
  if (type === 'public') {
    state.publicSupport = Math.min(100, Number(state.publicSupport || 0) + amount);
    state.reputation = Math.min(100, Number(state.reputation || 0) + 1);
    c.localities.forEach(item => item.support = Math.min(100, Number(item.support || 0) + 1));
  } else if (type === 'party') {
    state.partyPopularity = Math.min(100, Number(state.partyPopularity || 0) + amount);
    state.influence = Math.min(100, Number(state.influence || 0) + 1);
    state.partyMemberRecords = Array.isArray(state.partyMemberRecords) ? state.partyMemberRecords : [];
  } else if (type === 'infrastructure') {
    state.infrastructureScore = Math.min(100, Number(state.infrastructureScore || 40) + amount);
    c.projects = Array.isArray(c.projects) ? c.projects : [];
    const project = c.projects.find(item => /road|infrastructure|street/i.test(item.name || item.title || ''));
    if (project) project.progress = Math.min(100, Number(project.progress || 0) + amount * 5);
  } else if (type === 'water') {
    state.waterScore = Math.min(100, Number(state.waterScore || 40) + amount);
    c.localities.slice(0, 1).forEach(item => item.support = Math.min(100, Number(item.support || 0) + 2));
  } else if (type === 'health') {
    state.healthScore = Math.min(100, Number(state.healthScore || 40) + amount);
    state.government.performance = Math.min(100, Number(state.government?.performance || 50) + 1);
  } else if (type === 'education') {
    state.educationScore = Math.min(100, Number(state.educationScore || 40) + amount);
    state.government.performance = Math.min(100, Number(state.government?.performance || 50) + 1);
  } else if (type === 'employment' || type === 'agriculture') {
    state.livelihoodScore = Math.min(100, Number(state.livelihoodScore || 40) + amount);
    state.publicSupport = Math.min(100, Number(state.publicSupport || 0) + 1);
  } else if (type === 'sanitation') {
    state.sanitationScore = Math.min(100, Number(state.sanitationScore || 40) + amount);
    state.reputation = Math.min(100, Number(state.reputation || 0) + 1);
  } else if (type === 'budget') {
    state.government.performance = Math.min(100, Number(state.government?.performance || 50) + amount);
  } else if (type === 'parliament' || type === 'governance') {
    state.influence = Math.min(100, Number(state.influence || 0) + amount);
    state.reputation = Math.min(100, Number(state.reputation || 0) + 1);
  } else if (type === 'constituency') {
    state.publicSupport = Math.min(100, Number(state.publicSupport || 0) + amount);
    if (c.localities.length) c.localities[0].support = Math.min(100, Number(c.localities[0].support || 0) + amount);
  }
  task.impactApplied = true;
  task.impactSummary = `${type} improved by ${amount} points`;
  if (!Array.isArray(c.resolvedIssues)) c.resolvedIssues = [];
  if (['water','sanitation','infrastructure','health','education'].includes(type)) {
    c.resolvedIssues.push({ title: task.title, category: type, date: dateText(), impact: amount });
    c.resolvedIssues = c.resolvedIssues.slice(-50);
  }
}
function updateOfficeTask(id, complete) {
  const office = ensureExecutiveOffice();
  const task = office.tasks.find(t => t.id === Number(id));
  if (!task) return;
  if (!complete) {
    task.status = 'In progress';
    task.acceptedAt = dateText();
    saveState(); render(); toast('You accepted responsibility. Complete it before the deadline.');
    return;
  }
  const cost = Math.max(0, Number(task.budgetRequired || 0));
  if (Number(state.money || 0) < cost) return toast(`Insufficient funds. Required: ${money(cost)}.`);
  state.money -= cost;
  state.totalExpenses = Number(state.totalExpenses || 0) + cost;
  task.status = 'Completed';
  if (!task.impactApplied) {
    applyOfficeTaskImpact(task);
    state.experience = Number(state.experience || 0) + 12;
    state.reputation = Math.min(100, Number(state.reputation || 0) + Number(task.expectedReputationImpact || 1));
    state.partyPopularity = Math.min(100, Number(state.partyPopularity || 0) + Number(task.expectedPartyImpact || 1));
    task.impactApplied = true;
    task.completedAt = dateText();
    task.impactSummary = `${task.impactType} improved; party popularity +${Number(task.expectedPartyImpact || 1)} and reputation +${Number(task.expectedReputationImpact || 1)}; funds used ${money(cost)}`;
    office.taskHistory.push({ title: task.title, completedAt: dateText(), impactSummary: task.impactSummary });
    office.taskHistory = office.taskHistory.slice(-50);
  }
  office.tasks = office.tasks.filter(item => item.id !== task.id);
  saveState(); render();
  toast(`Mission completed and archived. Funds used: ${money(cost)}.`);
}

function rejectOfficeTask(id) {
  const office = ensureExecutiveOffice();
  const task = office.tasks.find(item => item.id === Number(id));
  if (!task) return;
  task.status = 'Rejected';
  task.rejectedAt = dateText();
  office.taskHistory.push({ title: task.title, rejectedAt: dateText(), impactSummary: `Rejected by player; reputation −1${state.partyId !== 'independent' ? ', party popularity −1' : ''}` });
  office.taskHistory = office.taskHistory.slice(-50);
  office.tasks = office.tasks.filter(item => item.id !== task.id);
  state.reputation = Math.max(0, Number(state.reputation || 0) - 1);
  if (state.partyId !== 'independent') state.partyPopularity = Math.max(0, Number(state.partyPopularity || 0) - 1);
  saveState(); render(); toast('Assignment rejected. Your office recorded the decision.');
}

function decideOfficeFile(id, decision) {
  const office = ensureExecutiveOffice();
  const file = office.files.find(f => f.id === Number(id) && f.status === 'Pending');
  if (!file) return;
  const impact = file.impact || {};
  const amount = Math.max(1, Number(impact.reputation || 1));
  file.status = decision === 'approve' ? 'Approved & signed' : decision === 'reject' ? 'Rejected' : 'Returned for revision';
  file.decidedOn = dateText();
  file.decisionBy = state.characterName || 'Player';
  if (decision === 'approve') {
    office.consequenceMetrics.approvals++;
    state.reputation = Math.min(100, Number(state.reputation || 0) + amount);
    state.publicSupport = Math.min(100, Number(state.publicSupport || 0) + Number(impact.publicSupport || 1));
    if (state.partyId !== 'independent') state.partyPopularity = Math.min(100, Number(state.partyPopularity || 0) + Number(impact.party || 1));
    if (file.budgetRequired) {
      const project = {
        id: office.nextId++, title: file.projectTitle || file.title, department: file.department || file.from,
        totalBudget: Number(file.budgetRequired), spent: 0, instalment: Number(file.monthlyInstalment || Math.max(1, Math.ceil(Number(file.budgetRequired) / 4))),
        progress: 0, duration: Number(file.durationMonths || 4), monthsRemaining: Number(file.durationMonths || 4),
        status: 'Ongoing', officer: file.responsibleOfficer || file.from, createdAt: dateText(), lastReport: 'Approved; awaiting first monthly officer report.'
      };
      office.projects.push(project);
    }
    office.lastAiReport = `You approved “${file.title}”. The responsible office has been instructed to execute it and submit monthly progress reports.`;
  } else if (decision === 'reject') {
    office.consequenceMetrics.rejections++;
    state.reputation = Math.max(0, Number(state.reputation || 0) - Number(impact.rejectionReputation || 1));
    if (state.partyId !== 'independent') state.partyPopularity = Math.max(0, Number(state.partyPopularity || 0) - Number(impact.rejectionParty || 1));
    state.publicSupport = Math.max(0, Number(state.publicSupport || 0) - Number(impact.rejectionPublic || 1));
    office.lastAiReport = `You rejected “${file.title}”. The department has been notified; affected stakeholders may react negatively.`;
  } else {
    office.consequenceMetrics.returns++;
    state.reputation = Math.max(0, Number(state.reputation || 0) - 1);
    file.status = 'Returned for revision';
    file.revisionRequested = true;
    office.lastAiReport = `You returned “${file.title}” for revision. The submitting officer must provide revised costings and evidence next month.`;
  }
  const record = { title: file.title, decision, date: dateText(), summary: decision === 'approve' ? 'Approved; execution and monthly reporting required.' : decision === 'reject' ? 'Rejected; stakeholder confidence may be affected.' : 'Returned for revised information.', reputation: Number(state.reputation || 0), partyPopularity: Number(state.partyPopularity || 0) };
  office.decisionHistory.unshift(record);
  office.decisionHistory = office.decisionHistory.slice(0, 40);
  saveState(); render(); toast(`File ${file.status.toLowerCase()}.`);
}

function runAiAdministration() {
  const office = ensureExecutiveOffice();
  const pending = office.tasks.filter(task => task.status === 'Pending').length;
  const active = office.tasks.filter(task => task.status === 'In progress').length;
  const reports = [];
  office.projects.forEach(project => {
    if (project.status !== 'Ongoing') return;
    const due = Math.min(Number(project.instalment || 0), Math.max(0, Number(project.totalBudget || 0) - Number(project.spent || 0)));
    if (due > 0 && Number(state.government?.treasury || 0) >= due) {
      state.government.treasury -= due;
      project.spent += due;
      project.progress = Math.min(100, Number(project.progress || 0) + Math.ceil(100 / Math.max(1, Number(project.duration || 4))));
      project.monthsRemaining = Math.max(0, Number(project.monthsRemaining || 1) - 1);
      project.lastReport = `${project.officer} reports ${project.progress}% completion; ${money(due)} instalment released.`;
      reports.push(project.lastReport);
      if (project.progress >= 100 || project.spent >= project.totalBudget) {
        project.status = 'Completed'; project.progress = 100; office.consequenceMetrics.completedProjects++;
        state.reputation = Math.min(100, Number(state.reputation || 0) + 2);
        state.publicSupport = Math.min(100, Number(state.publicSupport || 0) + 2);
      }
    } else {
      project.monthsRemaining = Math.max(0, Number(project.monthsRemaining || 1) - 1);
      project.lastReport = `Funding instalment delayed for ${project.officer}; project progress is on hold.`;
      office.consequenceMetrics.delayedProjects++;
      reports.push(project.lastReport);
    }
  });
  if (office.crises.filter(item => item.status === 'Pending').length < 2 && Math.random() < 0.28) {
    const crisisPool = [
      ['Unexpected price rise in essential goods','Public','Public support may fall if no response is announced.'],
      ['Opposition questions a delayed public project','Political','Party reputation may be affected by the response.'],
      ['Department faces staff shortage','Administration','Service delivery may deteriorate without intervention.'],
      ['Local water supply disruption','Public service','Affected locality satisfaction may decline.'],
      ['Party unit reports internal disagreement','Party','Member loyalty and party unity may weaken.']
    ];
    const item = crisisPool[Math.floor(Math.random() * crisisPool.length)];
    office.crises.unshift({ id: office.nextId++, title: item[0], category: item[1], detail: item[2], status: 'Pending', createdAt: dateText() });
    office.crises = office.crises.slice(0, 20);
  }
  updatePoliticalRelationshipsMonthly();
  office.lastAiReport = `AI administration monitored ${pending} pending assignments and ${active} active assignments. ${reports.slice(0, 2).join(' ')} Routine district operations continue automatically.`;
}

function genericPage(name) {
  const descriptions = {
    Constituency: 'Understand your local community and constituency.',
    Elections: 'Prepare for campaigns, candidates and elections.',
    Government: 'Manage institutions and public administration.',
    Relationships: 'Build friendships, alliances and political networks.',
    Finance: 'Manage wealth, expenses and political funds.',
    News: 'Follow developments in your political world.'
  };

  return `
    <div class="page-heading">
      <div>
        <div class="eyebrow">POLITICAL OFFICE</div>
        <h1>${name}</h1>
        <p>${descriptions[name] || ''}</p>
      </div>
    </div>
    <section class="panel coming-panel">
      <span class="gold-tag">IN DEVELOPMENT</span>
      <h2>${name} system</h2>
      <p class="panel-description">
        This module will be connected to your political career.
      </p>
      <button class="secondary-btn" data-tab="Dashboard">BACK TO DASHBOARD</button>
    </section>
  `;
}


/* INDIA POLITICAL & DEVELOPMENT ATLAS — RAJNITI 1.2.2
   District names and LGD codes are loaded from the user-supplied LGD extract
   dated 12 October 2026. Simulated development indicators remain fictional. */
import indiaDistrictData from './data/india-districts.json';

const indiaAtlas = indiaDistrictData.regions;
const atlasDistrictTotal = indiaDistrictData.sourceDistrictCount;
const atlasStateTotal = indiaAtlas.reduce((sum, region) => sum + region.states.length, 0);

function getAtlasState(name) {
  for (const region of indiaAtlas) {
    const found = region.states.find(item => item.name === name);
    if (found) return found;
  }
  return indiaAtlas.find(region => region.region === 'South').states.find(item => item.name === 'Karnataka');
}


function atlasDistrictProfile(stateName, districtName) {
  const key = `${stateName}|${districtName}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  const score = (n) => 25 + ((hash >>> n) % 66);
  return {
    development: score(2),
    employment: score(5),
    infrastructure: score(8),
    education: score(11),
    healthcare: score(14),
    water: score(17),
    priorities: [
      ['Roads & transport', score(3)],
      ['Healthcare access', score(6)],
      ['Education facilities', score(9)],
      ['Water & sanitation', score(12)],
      ['Employment opportunities', score(15)]
    ].sort((a, b) => a[1] - b[1]).slice(0, 3)
  };
}

function indiaMapPage() {
  const selectedState = getAtlasState(state.mapState || state.constituency?.state || 'Karnataka');
  const selectedDistrict = selectedState.districts.includes(state.mapDistrict)
    ? state.mapDistrict
    : selectedState.districts[0];
  const profile = atlasDistrictProfile(selectedState.name, selectedDistrict);
  const districtProjects = Array.isArray(state.atlasProjects)
    ? state.atlasProjects.filter(item => item.state === selectedState.name && item.district === selectedDistrict)
    : [];
  const currentFocus = state.constituency?.state === selectedState.name
    && state.constituency?.district === selectedDistrict;
  const trackedVoters = currentFocus
    ? Number(state.constituency?.totalVoters || 0)
    : 0;
  const localities = currentFocus && Array.isArray(state.constituency?.localities)
    ? state.constituency.localities.length
    : 0;

  return `
    <div class="page-heading india-atlas-heading">
      <div>
        <div class="eyebrow">NATIONAL POLITICAL GEOGRAPHY · OFFLINE SIMULATION</div>
        <h1>India <em>state atlas</em></h1>
        <p>Browse the national district directory by state and search the official LGD district names.</p>
      </div>
      <div class="date-card">
        <span>ATLAS COVERAGE</span>
        <b>${atlasStateTotal} states / UTs</b>
        <small>${atlasDistrictTotal.toLocaleString('en-IN')} LGD district records</small>
      </div>
    </div>

    <div class="india-atlas-layout">
      <section class="panel atlas-map-panel">
        <div class="command-section-head">
          <div><span class="eyebrow">INDIA · REGIONAL SELECTOR</span><h2>Choose your state</h2></div>
          <span class="command-symbol">⌖</span>
        </div>
        <p class="panel-description">District names are loaded from the supplied Ministry of Panchayati Raj LGD extract (12 Oct 2026). The extract contains 781 district records across 35 administrative units. Chandigarh is retained from the previous atlas because it is absent from this extract. Development indicators are simulated, not official statistics.</p>
        <div class="atlas-region-grid">
          ${indiaAtlas.map(region => `
            <section class="atlas-region">
              <div class="atlas-region-title">${escapeHtml(region.region)} INDIA</div>
              <div class="atlas-state-grid">
                ${region.states.map(item => `
                  <button class="atlas-state-button ${selectedState.name === item.name ? 'selected' : ''}"
                    data-map-state="${escapeHtml(item.name)}" title="${escapeHtml(item.name)}">
                    ${escapeHtml(item.name)}
                  </button>
                `).join('')}
              </div>
            </section>
          `).join('')}
        </div>
        <div class="atlas-legend"><span><i class="atlas-dot selected-dot"></i> Selected region</span><span><i class="atlas-dot"></i> Available region</span></div>
      </section>

      <div class="atlas-detail-column">
        <section class="panel atlas-state-detail">
          <span class="gold-tag">${escapeHtml(selectedState.name.toUpperCase())}</span>
          <h2>${escapeHtml(selectedState.name)}</h2>
          <p class="panel-description">Regional political overview and district selection.</p>
          <div class="atlas-stat-grid">
            <div><small>PLAYER INFLUENCE</small><b>${Math.max(0, Math.min(100, Number(state.influence || 0)))}/100</b></div>
            <div><small>PUBLIC SUPPORT</small><b>${Math.max(0, Math.min(100, Number(state.publicSupport || 0)))}%</b></div>
            <div><small>TRACKED VOTERS</small><b>${trackedVoters.toLocaleString('en-IN')}</b></div>
            <div><small>LOCALITIES TRACKED</small><b>${localities}</b></div>
          </div>
          <div class="atlas-note">Player influence and public support are your current career-wide simulation values. Voter and locality counts appear only when this district matches your active constituency.</div>
        </section>

        <section class="panel atlas-district-panel">
          <div class="command-section-head compact">
            <div><span class="eyebrow">DISTRICT DIRECTORY</span><h2>Select a district</h2></div>
            <span class="command-symbol">▦</span>
          </div>
          <label class="atlas-search-label" for="atlasDistrictSearch">SEARCH DISTRICTS IN ${escapeHtml(selectedState.name.toUpperCase())}</label>
          <input id="atlasDistrictSearch" class="atlas-district-search" type="search" placeholder="Type a district name..." autocomplete="off">
          <div class="atlas-directory-meta">${selectedState.districts.length} districts in this directory</div>
          <div class="atlas-district-list" id="atlasDistrictList">
            ${selectedState.districts.map(district => `
              <button class="atlas-district-button ${selectedDistrict === district ? 'selected' : ''}"
                data-map-district="${escapeHtml(district)}">
                <span>${escapeHtml(district)}</span><b>${selectedDistrict === district ? 'SELECTED' : 'OPEN'}</b>
              </button>
            `).join('')}
          </div>
          <div class="atlas-selected-summary">
            <span class="eyebrow">CURRENT ATLAS SELECTION</span>
            <strong>${escapeHtml(selectedDistrict)}, ${escapeHtml(selectedState.name)}</strong>
            <p class="panel-description">Use this selection as your active political constituency region. Existing localities and election records will be preserved.</p>
            <button class="primary-btn full" data-map-focus="1">SET AS POLITICAL FOCUS →</button>
          </div>
        </section>

        <section class="panel atlas-development-panel">
          <div class="command-section-head compact">
            <div><span class="eyebrow">DISTRICT DEVELOPMENT INTELLIGENCE</span><h2>Development profile</h2></div>
            <span class="command-symbol">⌂</span>
          </div>
          <div class="atlas-development-score"><strong>${profile.development}</strong><span>/100 development index</span></div>
          <div class="atlas-indicator-grid">
            ${[['Employment',profile.employment],['Infrastructure',profile.infrastructure],['Education',profile.education],['Healthcare',profile.healthcare],['Water & sanitation',profile.water]].map(([label,value]) => `
              <div class="atlas-indicator"><div><span>${label}</span><b>${value}/100</b></div><div class="atlas-meter"><i style="width:${value}%"></i></div></div>
            `).join('')}
          </div>
          <p class="atlas-data-note">These are fictional, deterministic gameplay indicators for each district, not official government statistics.</p>
        </section>

        <section class="panel atlas-priority-panel">
          <div class="command-section-head compact">
            <div><span class="eyebrow">DEVELOPMENT NEEDS</span><h2>Priority areas</h2></div>
            <span class="command-symbol">⚑</span>
          </div>
          ${profile.priorities.map(([label,value],index) => `
            <div class="atlas-priority-row"><span class="priority-rank">${index+1}</span><div><b>${label}</b><small>Needs attention · simulated score ${value}/100</small></div><span class="priority-level">${value < 45 ? 'HIGH' : 'MEDIUM'}</span></div>
          `).join('')}
          <button class="primary-btn full" data-atlas-project="1">＋ START DEVELOPMENT PROJECT</button>
        </section>

        <section class="panel atlas-project-panel">
          <div class="command-section-head compact"><div><span class="eyebrow">LOCAL DEVELOPMENT</span><h2>Active projects (${districtProjects.length})</h2></div></div>
          ${districtProjects.length ? districtProjects.map(item => `
            <div class="atlas-project-row"><div><b>${escapeHtml(item.name)}</b><small>${escapeHtml(item.category)} · ${money(item.budget)} · ${item.progress}% complete</small></div><span class="priority-level">${escapeHtml(item.status)}</span></div>
          `).join('') : '<p class="panel-description">No projects started in this district yet. Start a project to record a development commitment.</p>'}
        </section>
      </div>
    </div>
  `;
}



/* RAJNITI 1.1.3 — CONSTITUENCY INTELLIGENCE */
function constituencyIntelligencePage() {
  const c = state.constituency || {};
  const areas = Array.isArray(c.localities) ? c.localities : [];
  const voters = Math.max(0, Number(c.totalVoters || areas.reduce((n, a) => n + Number(a.voters || 0), 0)));
  const support = areas.length
    ? Math.round(areas.reduce((n, a) => n + Number(a.support || 0), 0) / areas.length)
    : Math.max(0, Number(state.publicSupport || 0));
  const influence = areas.length
    ? Math.round(areas.reduce((n, a) => n + Number(a.influence || 0), 0) / areas.length)
    : Math.max(0, Number(state.influence || 0));
  const development = Math.max(10, Math.min(100, Math.round(
    42 + (Number(c.projects?.length || 0) * 7) + (Number(c.resolvedIssues?.length || 0) * 5)
    + (areas.length ? areas.reduce((n, a) => n + (Number(a.support || 0) * 0.7), 0) / areas.length : 0)
  )));
  const male = Math.round(voters * 0.515);
  const female = Math.max(0, voters - male);
  const youth = Math.round(voters * 0.235);
  const middle = Math.round(voters * 0.485);
  const senior = Math.max(0, voters - youth - middle);
  const rival = Math.max(5, Math.min(95, 58 - Math.round(support * .7) + (state.partyCreated ? 5 : 0)));
  const playerStrength = Math.max(0, Math.min(100, Math.round(support * .65 + influence * .35)));
  const seatWon = (state.elections?.history || []).filter(x => x.result === 'Won' || x.won === true).length;
  const seatLost = (state.elections?.history || []).filter(x => x.result === 'Lost' || x.won === false).length;
  const history = Array.isArray(state.elections?.history) ? state.elections.history.slice(-5).reverse() : [];
  const issues = areas.map(a => a.issue).filter(Boolean);
  const issueCounts = [...new Set(issues)].map(issue => ({ issue, count: issues.filter(x => x === issue).length }));
  const priorities = issueCounts.length ? issueCounts : [
    { issue: 'Roads and public transport', count: 3 },
    { issue: 'Drinking water and sanitation', count: 2 },
    { issue: 'Jobs and local livelihoods', count: 2 }
  ];
  const comparison = [
    { name: c.constituencyName || 'Your constituency', voters, support, influence, development, player: playerStrength },
    { name: 'Regional comparison profile', voters: Math.round(voters * 1.12), support: Math.max(10, support - 4), influence: Math.max(8, influence - 3), development: Math.max(25, development - 8), player: Math.max(10, playerStrength - 6) }
  ];
  const bar = (label, value, tone='gold') => `<div class="ci-bar-row"><div><span>${escapeHtml(label)}</span><b>${value}%</b></div><i><em class="${tone}" style="width:${Math.max(0, Math.min(100, value))}%"></em></i></div>`;

  return `
    <div class="page-heading">
      <div><div class="eyebrow">ELECTORAL RESEARCH · OFFLINE SIMULATION</div>
        <h1>Constituency <em>intelligence</em></h1>
        <p>A decision dashboard for voter composition, local development, political influence and electoral history.</p>
      </div>
      <div class="date-card"><span>ACTIVE CONSTITUENCY</span><b>${escapeHtml(c.district || 'Not set')}</b><small>${escapeHtml(c.state || state.stateName || 'India')}</small></div>
    </div>

    <section class="panel ci-overview">
      <div><span class="gold-tag">YOUR CURRENT ELECTORAL AREA</span><h2>${escapeHtml(c.constituencyName || 'Constituency not configured')}</h2>
        <p>${escapeHtml(c.district || 'District not set')}, ${escapeHtml(c.state || state.stateName || 'India')} · ${areas.length} tracked local areas</p></div>
      <div class="ci-overview-score"><small>DEVELOPMENT INDEX</small><strong>${development}<i>/100</i></strong><span>Game simulation estimate</span></div>
    </section>

    <div class="stats-grid ci-top-stats">
      ${statCard('ESTIMATED VOTERS', voters.toLocaleString('en-IN'), 'Current saved constituency total', '♟')}
      ${statCard('PUBLIC SUPPORT', support + '%', 'Average across tracked localities', '♥')}
      ${statCard('POLITICAL INFLUENCE', influence + '/100', 'Average locality influence score', '⚑')}
      ${statCard('DEVELOPMENT INDEX', development + '/100', 'Projects, issue resolution and support', '⌂')}
    </div>

    <div class="ci-grid">
      <section class="panel">
        <div class="command-section-head"><div><span class="eyebrow">VOTER COMPOSITION</span><h2>Demographic estimate</h2></div><span class="command-symbol">♙</span></div>
        <p class="panel-description">Illustrative in-game estimates, not official voter-roll or census figures.</p>
        <div class="ci-demographic-grid">
          <div><small>MALE</small><b>${male.toLocaleString('en-IN')}</b><span>${voters ? Math.round(male/voters*100) : 0}%</span></div>
          <div><small>FEMALE</small><b>${female.toLocaleString('en-IN')}</b><span>${voters ? Math.round(female/voters*100) : 0}%</span></div>
          <div><small>YOUTH · 18–29</small><b>${youth.toLocaleString('en-IN')}</b><span>${voters ? Math.round(youth/voters*100) : 0}%</span></div>
          <div><small>ADULT · 30–59</small><b>${middle.toLocaleString('en-IN')}</b><span>${voters ? Math.round(middle/voters*100) : 0}%</span></div>
          <div><small>SENIOR · 60+</small><b>${senior.toLocaleString('en-IN')}</b><span>${voters ? Math.round(senior/voters*100) : 0}%</span></div>
        </div>
      </section>

      <section class="panel">
        <div class="command-section-head"><div><span class="eyebrow">POLITICAL LANDSCAPE</span><h2>Influence & rival strength</h2></div><span class="command-symbol">⚖</span></div>
        ${bar('Your ground strength', playerStrength)}
        ${bar('Rival organisation estimate', rival, 'blue')}
        ${bar('Development performance', development, 'green')}
        <div class="ci-footnote">Rival strength is a gameplay estimate derived from current support. It does not represent a real party survey.</div>
      </section>

      <section class="panel">
        <div class="command-section-head"><div><span class="eyebrow">PUBLIC PRIORITIES</span><h2>Local development needs</h2></div><span class="command-symbol">⌖</span></div>
        ${priorities.slice(0,5).map((item, i) => `<div class="ci-priority"><span class="ci-priority-rank">0${i+1}</span><div><b>${escapeHtml(item.issue)}</b><small>${item.count} tracked ${item.count === 1 ? 'area' : 'areas'}</small></div></div>`).join('')}
        <div class="ci-footnote">${Number(c.projects?.length || 0)} projects started · ${Number(c.resolvedIssues?.length || 0)} issues marked resolved.</div>
      </section>

      <section class="panel">
        <div class="command-section-head"><div><span class="eyebrow">SEAT PERFORMANCE</span><h2>Election record</h2></div><span class="command-symbol">▤</span></div>
        <div class="ci-seat-grid"><div><small>CONTESTED</small><b>${Number(state.elections?.totalContested || history.length)}</b></div><div><small>WON</small><b>${Number(state.elections?.totalWon || seatWon)}</b></div><div><small>LOST</small><b>${Number(state.elections?.totalLost || seatLost)}</b></div></div>
        ${history.length ? history.map(item => `<div class="ci-history-row"><span>${escapeHtml(item.type || item.electionType || 'Election')}</span><b>${escapeHtml(item.result || (item.won ? 'Won' : 'Recorded'))}</b></div>`).join('') : '<p class="panel-description">No constituency election results have been recorded yet. Contest an election to build this history.</p>'}
      </section>

      <section class="panel ci-comparison-panel">
        <div class="command-section-head"><div><span class="eyebrow">REGIONAL BENCHMARK</span><h2>Constituency comparison</h2></div><span class="command-symbol">⇄</span></div>
        <p class="panel-description">Compare your saved constituency with a generated regional benchmark profile.</p>
        <div class="ci-compare-head"><b>METRIC</b><b>${escapeHtml(comparison[0].name)}</b><b>${escapeHtml(comparison[1].name)}</b></div>
        ${[['Voters','voters'],['Public support','support'],['Influence','influence'],['Development','development']].map(([label,key]) => `<div class="ci-compare-row"><span>${label}</span><b>${Number(comparison[0][key]).toLocaleString('en-IN')}${key==='voters'?'': '%'}</b><b>${Number(comparison[1][key]).toLocaleString('en-IN')}${key==='voters'?'': '%'}</b></div>`).join('')}
      </section>
    </div>
    <p class="ci-disclaimer">Simulation notice: voter demographics, development index, rival strength and regional benchmark are generated gameplay estimates. They are not official demographic, constituency boundary, polling or election-seat data.</p>
  `;
}



function ensureAllianceState() {
  if (!state.alliances || typeof state.alliances !== 'object') {
    state.alliances = { partners: [], rivalCoalition: [], history: [], seatSharing: {}, stability: 50, coalitionName: 'National Progress Coalition' };
  }
  const a = state.alliances;
  for (const key of ['partners', 'rivalCoalition', 'history']) if (!Array.isArray(a[key])) a[key] = [];
  if (!a.seatSharing || typeof a.seatSharing !== 'object') a.seatSharing = {};
  a.stability = Math.max(0, Math.min(100, Number(a.stability) || 50));
  return a;
}
const allianceParties = [
  { id: 'regional-development', name: 'Regional Development Front', seats: 12, demand: 'Infrastructure portfolio' },
  { id: 'farmers-united', name: 'Farmers United Party', seats: 9, demand: 'Agriculture portfolio' },
  { id: 'people-first', name: 'People First Movement', seats: 7, demand: 'Rural welfare commitments' },
  { id: 'green-citizens', name: 'Green Citizens League', seats: 6, demand: 'Environment portfolio' },
  { id: 'workers-voice', name: 'Workers Voice Party', seats: 8, demand: 'Employment policy commitments' }
];
function alliancesPage() {
  const a = ensureAllianceState();
  const p = ensureParliamentState();
  const totalPartnerSeats = a.partners.reduce((n, x) => n + Number(x.seats || 0), 0);
  const majority = Math.floor(p.seats / 2) + 1;
  const options = allianceParties.filter(x => !a.partners.some(y => y.id === x.id));
  return `<section class="page-heading"><span class="eyebrow">COALITION STRATEGY</span><h1>Political Alliances</h1><p>Negotiate partnerships, share seats and maintain coalition confidence.</p></section>
  <div class="stats-grid">${statCard('Coalition partners',a.partners.length,'Active partners','⚑')}${statCard('Partner seats',totalPartnerSeats,'Illustrative seats','▤')}${statCard('Coalition stability',a.stability+'%','Partner confidence index','◇')}${statCard('Majority target',majority,'Illustrative house model','🏛')}</div>
  <div class="dashboard-grid"><section class="panel"><span class="eyebrow">YOUR COALITION</span><h2>${escapeHtml(a.coalitionName)}</h2><p>Current party seats: ${p.rulingSeats}. Partner seats: ${totalPartnerSeats}. Combined strength: ${p.rulingSeats+totalPartnerSeats} / ${p.seats}.</p>
  <label class="field-label">Coalition name</label><input id="coalitionName" class="text-input" maxlength="50" value="${escapeHtml(a.coalitionName)}"><button class="primary-btn" data-alliance-action="rename">SAVE COALITION NAME</button>
  <p><b>${p.rulingSeats+totalPartnerSeats >= majority ? 'Majority secured' : 'Majority not secured'}</b></p></section>
  <section class="panel"><span class="eyebrow">NEGOTIATION DESK</span><h2>Invite a party</h2>${options.map(x=>`<div class="history-row alliance-option"><div><b>${escapeHtml(x.name)}</b><small>${x.seats} seats · Demand: ${escapeHtml(x.demand)}</small></div><button class="secondary-btn" data-alliance-join="${x.id}">NEGOTIATE</button></div>`).join('') || '<p class="muted">All available parties have been approached.</p>'}</section></div>
  <section class="panel"><span class="eyebrow">CABINET BARGAINING</span><h2>Partner agreements</h2>${a.partners.length ? a.partners.map(x=>`<div class="history-row"><div><b>${escapeHtml(x.name)}</b><small>${x.seats} seats · ${escapeHtml(x.demand)}</small></div><span>${escapeHtml(x.status || 'Agreement active')}</span><button class="text-btn" data-alliance-withdraw="${x.id}">REMOVE</button></div>`).join('') : '<p class="muted">No coalition partners yet. Invite parties to begin negotiations.</p>'}
  <div class="alliance-actions"><button class="secondary-btn" data-alliance-action="confidence">REVIEW COALITION CONFIDENCE</button><button class="secondary-btn" data-alliance-action="seat-sharing">SIGN SEAT-SHARING AGREEMENT</button><button class="secondary-btn" data-alliance-action="rival">SIMULATE OPPOSITION ALLIANCE</button></div></section>
  <section class="panel"><span class="eyebrow">DIPLOMATIC RECORD</span><h2>Alliance history</h2>${a.history.length ? a.history.slice().reverse().map(x=>`<div class="history-row"><b>${escapeHtml(x.event)}</b><small>${escapeHtml(x.date)}</small></div>`).join('') : '<p class="muted">No alliance negotiations recorded.</p>'}</section>`;
}
function allianceAction(action, id='') {
  const a = ensureAllianceState(), p = ensureParliamentState();
  if (action === 'join') {
    const party = allianceParties.find(x=>x.id===id);
    if (!party || a.partners.some(x=>x.id===id)) return;
    a.partners.push({...party, status:'Agreement active'});
    a.stability = Math.min(100, a.stability+5);
    a.history.push({event:`Alliance agreement signed with ${party.name}`,date:dateText()});
    toast(`${party.name} joined your coalition.`);
  } else if (action === 'withdraw') {
    const party = a.partners.find(x=>x.id===id);
    if (!party) return;
    a.partners = a.partners.filter(x=>x.id!==id);
    a.stability = Math.max(0,a.stability-12);
    a.history.push({event:`${party.name} withdrew from coalition`,date:dateText()});
    toast('Coalition partner removed.');
  } else if (action === 'rename') {
    const value = document.querySelector('#coalitionName')?.value.trim();
    if (!value) { toast('Enter a coalition name.'); return; }
    a.coalitionName = value;
    a.history.push({event:`Coalition renamed to ${value}`,date:dateText()});
  } else if (action === 'confidence') {
    const strength = p.rulingSeats + a.partners.reduce((n,x)=>n+Number(x.seats||0),0);
    a.stability = Math.max(0,Math.min(100, Math.round((strength/p.seats)*100)));
    a.history.push({event:`Coalition confidence reviewed: ${a.stability}% stability`,date:dateText()});
    toast(`Coalition stability: ${a.stability}%`);
  } else if (action === 'seat-sharing') {
    a.history.push({event:'Seat-sharing agreement signed with current coalition partners',date:dateText()});
    a.stability = Math.min(100,a.stability+3);
    toast('Seat-sharing agreement recorded.');
  } else if (action === 'rival') {
    if (!a.rivalCoalition.length) a.rivalCoalition = [{name:'United Opposition Front',seats:Math.min(35,Math.max(12, p.oppositionSeats))}];
    a.history.push({event:'Opposition parties announced the United Opposition Front',date:dateText()});
    toast('Opposition alliance simulation updated.');
  }
  saveState(); render();
}

function ensureParliamentState() {
  if (!state.parliament || typeof state.parliament !== 'object') {
    state.parliament = { seats: 224, rulingSeats: 0, oppositionSeats: 0, bills: [], sessions: 0, questions: 0, confidence: 'Not tested', alliances: [], history: [] };
  }
  const p = state.parliament;
  for (const key of ['bills','alliances','history']) if (!Array.isArray(p[key])) p[key] = [];
  p.seats = Number(p.seats) || 224;
  p.rulingSeats = Math.max(0, Number(p.rulingSeats) || governmentMandateCount() || 0);
  p.oppositionSeats = Math.max(0, Number(p.oppositionSeats) || Math.max(0, p.seats-p.rulingSeats));
  return p;
}
function parliamentPage() {
  const p = ensureParliamentState();
  const majority = Math.floor(p.seats/2)+1;
  const billRows = p.bills.length ? p.bills.slice().reverse().map(b => `<div class="history-row"><b>${escapeHtml(b.title)}</b><span>${escapeHtml(b.status)}</span><small>${escapeHtml(b.date)}</small></div>`).join('') : '<p class="muted">No bills introduced yet.</p>';
  return `<section class="page-heading"><span class="eyebrow">LEGISLATIVE POLITICS</span><h1>Parliament & Legislature</h1><p>Run sessions, debate legislation and test the government's majority.</p></section>
  <div class="stats-grid">${statCard('Total seats',p.seats,'Illustrative Assembly model','▤')}${statCard('Ruling seats',p.rulingSeats,`Majority needed: ${majority}`,'🏛')}${statCard('Opposition seats',p.oppositionSeats,'Opposition benches','⚑')}${statCard('Sessions held',p.sessions,'Legislative sessions','◷')}</div>
  <div class="dashboard-grid"><section class="panel"><span class="eyebrow">LEGISLATIVE SESSION</span><h2>House Business</h2><p>Open a session to conduct Question Hour and legislative business.</p><button class="primary-btn" data-parliament-action="session">OPEN LEGISLATIVE SESSION</button><button class="secondary-btn" data-parliament-action="question">CONDUCT QUESTION HOUR</button><button class="secondary-btn" data-parliament-action="confidence">TEST CONFIDENCE</button><p><b>Government confidence:</b> ${escapeHtml(p.confidence)}</p></section>
  <section class="panel"><span class="eyebrow">INTRODUCE LEGISLATION</span><h2>New Bill</h2><input id="parliamentBillTitle" class="text-input" maxlength="70" placeholder="Enter bill title"><select id="parliamentBillType" class="text-input"><option>Development Bill</option><option>Education Bill</option><option>Healthcare Bill</option><option>Infrastructure Bill</option><option>Finance Bill</option><option>Welfare Bill</option></select><button class="primary-btn" data-parliament-action="bill">INTRODUCE BILL</button></section></div>
  <section class="panel"><span class="eyebrow">BILL REGISTER</span><h2>Legislative Records</h2>${billRows}</section>
  <section class="panel"><span class="eyebrow">COALITION MANAGEMENT</span><h2>Alliance Partners</h2><button class="secondary-btn" data-parliament-action="alliance">NEGOTIATE ALLIANCE</button>${p.alliances.map(a=>`<div class="history-row"><b>${escapeHtml(a.name)}</b><span>+${a.seats} seats</span></div>`).join('')}</section>`;
}
function parliamentAction(action) {
  const p = ensureParliamentState();
  if (action === 'session') { p.sessions++; p.history.push({event:'Session opened',date:dateText()}); toast('Legislative session opened.'); }
  if (action === 'question') { p.questions++; p.history.push({event:'Question Hour conducted',date:dateText()}); toast('Question Hour completed.'); }
  if (action === 'confidence') { p.confidence = p.rulingSeats >= Math.floor(p.seats/2)+1 ? 'Majority maintained' : 'Government at risk'; toast(p.confidence); }
  if (action === 'bill') {
    const title = document.querySelector('#parliamentBillTitle')?.value.trim();
    const type = document.querySelector('#parliamentBillType')?.value || 'Development Bill';
    if (!title) { toast('Enter a bill title first.'); return; }
    const passed = p.rulingSeats >= Math.floor(p.seats/2)+1;
    p.bills.push({title, type, status: passed ? 'Passed by simulated house' : 'Introduced – majority not secured', date:dateText()});
    toast(passed ? 'Bill passed in the simulation.' : 'Bill introduced; majority is not secured.');
  }
  if (action === 'alliance') {
    const name = `Regional Alliance ${p.alliances.length+1}`;
    const seats = 5;
    p.alliances.push({name,seats});
    p.rulingSeats += seats;
    p.oppositionSeats = Math.max(0,p.oppositionSeats-seats);
    toast(`${name} added: +${seats} simulated seats.`);
  }
  saveState(); render();
}


/* MAIN RENDER */

function render() {
  let content;

  switch (activeTab) {
    case 'Dashboard':
      content = dashboard();
      break;
    case 'Party':
      content = partyPage();
      break;
    case 'CreateParty':
      content = createPartyPage();
      break;
    case 'CharacterCreation':
      content = characterPage();
      break;
    case 'Activities':
      content = activitiesPage();
      break;
    case 'Career':
      content = careerPage();
      break;
    case 'Profile':
      content = profilePage();
      break;
    case 'Constituency':
      content = constituencyPage();
      break;
    case 'Constituency Intel':
      content = constituencyIntelligencePage();
      break;
    case 'India Map':
      content = indiaMapPage();
      break;
    case 'Elections':
      content = electionPage();
      break;
    case 'Finance':
      content = financePage();
      break;
    case 'Intelligence':
      content = intelligencePage();
      break;
    case 'Public Opinion':
      content = publicOpinionPage();
      break;
    case 'News':
      content = newsPage();
      break;
    case 'Executive Office':
      content = executiveOfficePage();
      break;
    case 'Government':
      content = governmentPage();
      break;
    case 'Parliament':
      content = parliamentPage();
      break;
    case 'Alliances':
      content = alliancesPage();
      break;
    default:
      content = genericPage(activeTab);
  }

  document.querySelector('#app').innerHTML = shell(content);
}

/* EVENT HANDLERS */

document.addEventListener('input', event => {
  if (event.target && event.target.id === 'atlasDistrictSearch') {
    const query = event.target.value.trim().toLocaleLowerCase('en-IN');
    document.querySelectorAll('#atlasDistrictList [data-map-district]').forEach(button => {
      button.hidden = !button.dataset.mapDistrict.toLocaleLowerCase('en-IN').includes(query);
    });
  }
});

document.addEventListener('click', event => {
  const nominationButton = event.target.closest('[data-nomination-action]');
  if (nominationButton) {
    const elections = ensureElectionCalendar();
    const nomination = elections.nominationQueue.find(item => String(item.id) === nominationButton.dataset.nominationId);
    if (!nomination || nomination.status !== 'Pending') return toast('This nomination is no longer pending.');
    const decision = nominationButton.dataset.nominationAction;
    if (decision === 'replace') {
      const members = (state.partyMemberRecords || []).filter(member => member && member.name && member.name !== nomination.candidateName);
      if (!members.length) return toast('Recruit another party member before replacing this candidate.');
      const options = members.map((member, index) => `${index + 1}. ${member.name} · ${member.role || 'Party member'}`).join('\n');
      const answer = prompt(`Choose replacement candidate number:\n${options}`);
      if (answer === null) return;
      const selected = members[Number(answer) - 1];
      if (!selected) return toast('Invalid candidate selection.');
      nomination.candidateName = selected.name;
      nomination.candidateRole = selected.role || 'Party member';
      nomination.constituency = selected.constituency || selected.district || nomination.constituency;
      nomination.aiReason = 'Replacement selected by the party leader for final review.';
      nomination.updatedAt = dateText();
      saveState(); render(); toast('Candidate proposal replaced. Review and approve it when ready.');
      return;
    }
    if (decision === 'approve') {
      nomination.status = 'Approved';
      nomination.approvedAt = dateText();
      nomination.approvedBy = state.characterName || 'Player';
      nomination.submissionStatus = 'Party-approved · official filing not yet simulated';
      toast('Party nomination approved. It is recorded for the election workflow.');
    } else {
      nomination.status = 'Rejected';
      nomination.rejectedAt = dateText();
      toast('Candidate proposal rejected.');
    }
    saveState(); render();
    return;
  }

  const officeKeep = event.target.closest('[data-office-keep]');
  if (officeKeep) {
    const task = ensureExecutiveOffice().tasks.find(item => item.id === Number(officeKeep.dataset.officeKeep));
    if (task) { task.status = 'Pending'; task.lastPlayerDecision = dateText(); task.decisionHistory = Array.isArray(task.decisionHistory) ? task.decisionHistory : []; task.decisionHistory.push({ date: dateText(), decision: 'Kept pending by player' }); saveState(); render(); toast('Task remains pending. It will carry forward at the next monthly review.'); }
    return;
  }
  const officeReject = event.target.closest('[data-office-reject]');
  if (officeReject) { rejectOfficeTask(officeReject.dataset.officeReject); return; }
  const officeStart = event.target.closest('[data-office-task]');
  if (officeStart) { updateOfficeTask(officeStart.dataset.officeTask, false); return; }
  const officeComplete = event.target.closest('[data-office-complete]');
  if (officeComplete) { updateOfficeTask(officeComplete.dataset.officeComplete, true); return; }

  const crisisButton = event.target.closest('[data-office-crisis]');
  if (crisisButton) {
    const office = ensureExecutiveOffice();
    const crisis = office.crises.find(item => item.id === Number(crisisButton.dataset.crisisId) && item.status === 'Pending');
    if (!crisis) return;
    if (crisisButton.dataset.officeCrisis === 'respond') {
      crisis.status = 'Resolved by player';
      state.reputation = Math.min(100, Number(state.reputation || 0) + 2);
      state.publicSupport = Math.min(100, Number(state.publicSupport || 0) + 2);
      if (state.partyId !== 'independent') state.partyPopularity = Math.min(100, Number(state.partyPopularity || 0) + 1);
      crisis.outcome = 'Player issued a response; public confidence improved.';
    } else {
      crisis.status = 'Delegated to AI';
      crisis.outcome = 'AI administration assigned the matter to the responsible officials.';
      state.reputation = Math.min(100, Number(state.reputation || 0) + 1);
    }
    crisis.decidedAt = dateText();
    saveState(); render(); toast(crisis.outcome);
    return;
  }

  const relationshipButton = event.target.closest('[data-relationship-action]');
  if (relationshipButton) {
    const rel = ensurePoliticalRelationships();
    const person = rel.people.find(item => item.id === relationshipButton.dataset.relationshipId);
    if (!person) return;
    const action = relationshipButton.dataset.relationshipAction;
    if (action === 'consult') {
      person.trust = Math.min(100, person.trust + 5);
      if (person.type !== 'Opposition') person.loyalty = Math.min(100, person.loyalty + 2);
      recordRelationshipEvent(rel, person, 'Held a consultation and discussed political priorities.');
      toast(`Consultation completed with ${person.name}. Trust improved.`);
    } else if (action === 'negotiate') {
      if (person.type === 'Opposition') {
        person.trust = Math.min(100, person.trust + 8);
        rel.oppositionPressure = Math.max(0, rel.oppositionPressure - 5);
        recordRelationshipEvent(rel, person, 'Opened cross-party talks on a public-interest issue.');
        toast('Cross-party cooperation improved; opposition pressure eased.');
      } else if (person.type === 'Coalition partner') {
        person.trust = Math.min(100, person.trust + 7);
        person.loyalty = Math.min(100, person.loyalty + 5);
        rel.stability = Math.min(100, rel.stability + 4);
        recordRelationshipEvent(rel, person, 'Renewed coalition commitment through private negotiations.');
        toast('Coalition commitment strengthened.');
      } else {
        person.trust = Math.min(100, person.trust + 6);
        person.loyalty = Math.min(100, person.loyalty + 5);
        recordRelationshipEvent(rel, person, 'Reached a private political understanding and strengthened party ties.');
        toast('Party alliance strengthened.');
      }
    }
    const allies = rel.people.filter(p => p.type !== 'Opposition');
    rel.stability = Math.max(0, Math.min(100, Math.round(allies.reduce((sum,p)=>sum+p.loyalty,0)/Math.max(1,allies.length)*0.65+(100-rel.oppositionPressure)*0.35)));
    saveState(); render(); return;
  }

  const mapStateButton = event.target.closest('[data-map-state]');
  if (mapStateButton) {
    state.mapState = mapStateButton.dataset.mapState;
    const selected = getAtlasState(state.mapState);
    state.mapDistrict = selected.districts[0];
    saveState();
    render();
    return;
  }

  const mapDistrictButton = event.target.closest('[data-map-district]');
  if (mapDistrictButton) {
    state.mapDistrict = mapDistrictButton.dataset.mapDistrict;
    saveState();
    render();
    return;
  }

  const atlasProjectButton = event.target.closest('[data-atlas-project]');
  if (atlasProjectButton) {
    if (!Array.isArray(state.atlasProjects)) state.atlasProjects = [];
    const choices = ['Road improvement', 'Primary healthcare centre', 'School facility upgrade', 'Drinking water project', 'Employment & skills centre'];
    const category = prompt(`Choose project category:\n${choices.map((x,i)=>`${i+1}. ${x}`).join('\n')}\nEnter 1-${choices.length}`);
    if (category === null) return;
    const selected = choices[Number(category)-1];
    if (!selected) { toast('Choose a valid project category.'); return; }
    const rawBudget = prompt('Enter project budget in rupees (example: 2500000):', '2500000');
    if (rawBudget === null) return;
    const budget = Math.floor(Number(rawBudget));
    if (!Number.isFinite(budget) || budget <= 0) { toast('Enter a valid positive project budget.'); return; }
    state.atlasProjects.push({
      id: `atlas-${Date.now()}`,
      state: state.mapState,
      district: state.mapDistrict,
      name: selected,
      category: selected,
      budget,
      progress: 0,
      status: 'Planned',
      createdAt: new Date().toISOString()
    });
    saveState();
    render();
    toast('Development project added to the selected district.');
    return;
  }

  const mapFocusButton = event.target.closest('[data-map-focus]');
  if (mapFocusButton) {
    if (!state.constituency) state.constituency = { state: 'Karnataka', district: 'Udupi', localities: [], campaigns: [], projects: [], resolvedIssues: [], totalVoters: 0 };
    state.constituency.state = state.mapState;
    state.constituency.district = state.mapDistrict;
    state.stateName = state.mapState;
    saveState();
    activeTab = 'Constituency';
    render();
    toast('Political focus updated. Existing locality and election records were preserved.');
    return;
  }

  const regionButton = event.target.closest('[data-intel-region]');
  if (regionButton) {
    selectedIntelRegion = regionButton.dataset.intelRegion;
    render();
    return;
  }

  const strategyAction = event.target.closest('[data-intel-strategy]');
  if (strategyAction) {
    runIntelligenceStrategy(strategyAction.dataset.intelStrategy);
    return;
  }

  const reviewButton = event.target.closest('[data-review-news]');
  if (reviewButton) {
    const index = Number(reviewButton.dataset.reviewNews);
    if (!Array.isArray(state.reviewedNews)) state.reviewedNews = [];
if (!state.media || typeof state.media !== 'object') state.media = JSON.parse(JSON.stringify(defaults.media));
for (const key of ['approval', 'trust', 'reach']) {
  if (!Number.isFinite(Number(state.media[key]))) state.media[key] = defaults.media[key];
}
state.media.approval = Math.max(0, Math.min(100, Number(state.media.approval)));
state.media.trust = Math.max(0, Math.min(100, Number(state.media.trust)));
state.media.reach = Math.max(0, Math.min(100, Number(state.media.reach)));
if (!Array.isArray(state.media.controversies)) state.media.controversies = [];
if (!Array.isArray(state.media.history)) state.media.history = [];

    if (!state.reviewedNews.includes(index)) state.reviewedNews.push(index);
    saveState();
    render();
    toast('News briefing marked as reviewed.');
    return;
  }

  const mediaResolve = event.target.closest('[data-media-resolve]');
  if (mediaResolve) { resolveMediaControversy(mediaResolve.dataset.mediaResolve); return; }

  const tab = event.target.closest('[data-tab]');

  if (tab) {
    activeTab = tab.dataset.tab;
    render();
    return;
  }

  const selectedLocality = event.target.closest('[data-select-locality]');
  if (selectedLocality) {
    state.constituency.selectedLocality = selectedLocality.dataset.selectLocality;
    saveState();
    render();
    return;
  }

  const groundAction = event.target.closest('[data-ground-action]');
  if (groundAction) { performGroundAction(groundAction.dataset.groundAction); return; }

  const campaignAction = event.target.closest('[data-campaign-action]');
  if (campaignAction) { runCampaignAction(campaignAction.dataset.campaignAction); return; }

  const partyNav = event.target.closest('[data-party-section]');
  if (partyNav) { partySection = partyNav.dataset.partySection; render(); return; }

  const removePosition = event.target.closest('[data-remove-position]');
  if (removePosition) { removeLeadershipPosition(removePosition.dataset.removePosition); return; }
  const removeMember = event.target.closest('[data-remove-member]');
  if (removeMember) { removePartyMember(removeMember.dataset.removeMember); return; }
  const removeUnit = event.target.closest('[data-remove-unit]');
  if (removeUnit) { removePartyUnit(removeUnit.dataset.removeUnit); return; }

  const join = event.target.closest('[data-join-party]');
  if (join) {
    joinParty(join.dataset.joinParty);
    return;
  }

  const activity = event.target.closest('[data-activity]');
  if (activity) {
    performActivity(activity.dataset.activity);
    return;
  }

  const allianceJoin = event.target.closest('[data-alliance-join]');
  if (allianceJoin) { allianceAction('join', allianceJoin.dataset.allianceJoin); return; }
  const allianceWithdraw = event.target.closest('[data-alliance-withdraw]');
  if (allianceWithdraw) { allianceAction('withdraw', allianceWithdraw.dataset.allianceWithdraw); return; }
  const allianceButton = event.target.closest('[data-alliance-action]');
  if (allianceButton) { allianceAction(allianceButton.dataset.allianceAction); return; }

  const parliamentButton = event.target.closest('[data-parliament-action]');
  if (parliamentButton) { parliamentAction(parliamentButton.dataset.parliamentAction); return; }

  const appointButton = event.target.closest('[data-gov-appoint]');
  if (appointButton) { appointMinister(appointButton.dataset.govAppoint); return; }
  const budgetButton = event.target.closest('[data-gov-budget]');
  if (budgetButton) { allocateDepartment(budgetButton.dataset.govBudget, Number(budgetButton.dataset.delta)); return; }

  const officeDecision = event.target.closest('[data-office-decision]');
  if (officeDecision) { decideOfficeFile(officeDecision.dataset.officeFile, officeDecision.dataset.officeDecision); return; }

  const action = event.target.closest('[data-action]')?.dataset.action;

  switch (action) {
    case 'create-character':
    case 'edit-character':
      activeTab = 'CharacterCreation';
      render();
      break;
    case 'show-create-party':
      activeTab = 'CreateParty';
      render();
      break;
    case 'end-day':
      endDay();
      break;
    case 'gov-form':
      formGovernment();
      break;
    case 'gov-scheme':
      launchGovernmentScheme();
      break;
    case 'media-press':
      mediaAction('press');
      break;
    case 'media-listen':
      mediaAction('listen');
      break;
    case 'media-policy':
      mediaAction('policy');
      break;
    case 'party-meeting':
      partyMeeting();
      break;
    case 'party-donate':
      donatePartyFunds();
      break;
    case 'recruit-members':
      recruitMembers();
      break;
    case 'leave-party':
      leaveParty();
      break;
    case 'generate-save-backup':
      generateSaveBackup();
      break;
    case 'copy-save-backup':
      copySaveBackup();
      break;
    case 'restore-save-backup':
      restoreSaveBackup();
      break;
    case 'resolve-local-issue':
      resolveLocalIssue();
      break;
    case 'hold-election':
      holdElection();
      break;
    case 'close-election-result':
      document.querySelector('.election-result-overlay')?.remove();
      activeTab = 'Elections';
      render();
      break;
  }
});

document.addEventListener('change', event => {
  if (event.target.id === 'groundState') {
    const stateName = event.target.value;
    const districtSelect = document.querySelector('#groundDistrict');
    const districts = constituencyDistricts[stateName] || constituencyDistricts.Other;
    if (districtSelect) {
      districtSelect.innerHTML = districts.map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('');
    }
  }
});

document.addEventListener('input', event => {
  if (event.target.id === 'memberSearch') {
    const query = event.target.value.trim().toLowerCase();
    document.querySelectorAll('[data-member-row]').forEach(row => { row.style.display = row.dataset.memberRow.includes(query) ? '' : 'none'; });
  }
});

document.addEventListener('submit', event => {
  if (event.target.id === 'appoint-leader-form') { event.preventDefault(); appointPartyLeader(event.target); }
  if (event.target.id === 'add-member-form') { event.preventDefault(); addPartyMember(event.target); }
  if (event.target.id === 'party-unit-form') { event.preventDefault(); createPartyUnit(event.target); }
  if (event.target.id === 'party-election-form') { event.preventDefault(); holdPartyElection(event.target); }
  if (event.target.id === 'constituency-setup-form') { event.preventDefault(); saveConstituencySetup(event.target); }
  if (event.target.id === 'development-project-form') { event.preventDefault(); startDevelopmentProject(event.target); }
  if (event.target.id === 'start-election-form') { event.preventDefault(); startElection(event.target); }
  if (event.target.id === 'job-application-form') { event.preventDefault(); applyForJob(event.target); }
  if (event.target.id === 'business-form') { event.preventDefault(); startBusiness(event.target); }
  if (event.target.id === 'fixed-deposit-form') { event.preventDefault(); investFixedDeposit(event.target); }

  if (event.target.id === 'character-form') {
    event.preventDefault();

    const data = new FormData(event.target);
    const name = String(data.get('playerName') || '').trim();
    const age = Number(data.get('age'));
    const hometown = String(data.get('hometown') || '').trim();

    if (!name || !hometown || age < 18 || age > 80) {
      return toast('Check your name, hometown and age.');
    }

    const isNew = !state.characterCreated;

    for (const key of [
      'playerName', 'gender', 'stateName', 'hometown',
      'education', 'occupation', 'familyBackground',
      'financialBackground', 'ideology', 'ambition'
    ]) {
      state[key] = String(data.get(key));
    }

    state.age = age;

    if (isNew) {
      state.money = {
        Poor: 5000,
        'Lower Middle Class': 25000,
        'Middle Class': 100000,
        'Upper Middle Class': 500000,
        Wealthy: 2500000
      }[state.financialBackground] || 25000;
    }

    state.characterCreated = true;
    saveState();
    activeTab = 'Dashboard';
    render();
    toast('Political profile saved!');
  }

  if (event.target.id === 'party-form') {
    event.preventDefault();
    establishParty(event.target);
  }
});

render();
