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
    totalLost: 0
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
let activeTab = 'Dashboard';
let partySection = 'Overview';
if (!Array.isArray(state.reviewedNews)) state.reviewedNews = [];

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
    Profile: '◉'
  };
  return icons[name] || '•';
}

function dateText() {
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
  return `Day ${state.day} · ${months[state.month - 1]} · Year ${state.year}`;
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
    'Constituency', 'Elections', 'Government',
    'Relationships', 'Intelligence', 'Finance', 'News', 'Profile'
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
            <span class="day-pill">DAY ${state.day}</span>
            <button class="avatar" data-tab="Profile">
              ${escapeHtml(state.playerName.slice(0, 1).toUpperCase())}
            </button>
          </div>
        </header>

        <section class="page">${content}</section>
      </main>

      <nav class="mobile-nav">
        ${['Dashboard', 'Career', 'Party', 'Constituency', 'Elections', 'Intelligence', 'Finance', 'News', 'Activities', 'Profile']
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
        <span>SIMULATION CLOCK</span>
        <b>DAY ${state.day}</b>
        <small>${Math.max(0, 2 - state.actionsUsed)} daily actions remaining</small>
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
      <div class="date-card"><span>BRIEFING DATE</span><b>DAY ${state.day}</b><small>${dateText()}</small></div>
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
    <section class="panel intelligence-method"><span class="eyebrow">STRATEGIC NOTE</span><h3>Build your organisation before chasing headline numbers</h3><p class="panel-description">Use constituency outreach, issue surveys, volunteer mobilisation and party-building activities to improve your standing over time.</p><button class="primary-btn" data-tab="Activities">PLAN POLITICAL ACTIVITIES →</button></section>
  `;
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
    <div class="page-heading"><div><div class="eyebrow">RAJNITI NEWS NETWORK</div><h1>Political <em>newsroom</em></h1><p>Follow the fictional events and policy debates shaping your political world.</p></div><div class="date-card"><span>DAILY EDITION</span><b>DAY ${state.day}</b><small>${dateText()}</small></div></div>
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
      <span class="eyebrow">DAILY ACTIONS</span>
      <h3>${Math.max(0, 2 - state.actionsUsed)} / 2 remaining</h3>
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
            ${state.actionsUsed >= 2 || !state.characterCreated || state.money < a.cost ? 'disabled' : ''}>
            ${!state.characterCreated ? 'CREATE CHARACTER FIRST'
              : state.actionsUsed >= 2 ? 'DAILY LIMIT REACHED'
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
  if (state.actionsUsed >= 2) return toast('Daily action limit reached.');

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

function endDay() {
  if (!state.characterCreated) {
    return toast('Create your politician first.');
  }

  state.day++;
  state.actionsUsed = 0;

  let message = 'New day started. Daily actions refreshed.';

  if (state.day > 30) {
    state.day = 1;
    state.month++;

    if (state.month > 12) {
      state.month = 1;
      state.year++;
      state.age++;
    }

    const report = processMonthlyFinances();
    const totalIncome = report.salary + report.businessIncome + report.investmentIncome;
    message = `New month! Income ${money(totalIncome)} · Living expenses ${money(report.expenses)} · Net ${report.net >= 0 ? '+' : '−'}${money(Math.abs(report.net))}`;
  }

  saveState();
  render();
  toast(message);
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
  if (state.actionsUsed >= 2) return toast('No daily actions remaining.');
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
  if (state.actionsUsed >= 2) return toast('No daily actions remaining.');
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
  const remaining = Math.max(0, 2 - state.actionsUsed);

  return `
    <div class="page-heading">
      <div>
        <div class="eyebrow">GRASSROOTS POLITICS · INDIA</div>
        <h1>Constituency <em>command centre</em></h1>
        <p>Build public trust through local service, organisation and development.</p>
      </div>
      <div class="date-card">
        <span>DAILY GROUND ACTIONS</span>
        <b>${remaining} / 2</b>
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
  if (state.actionsUsed >= 2) return toast('Daily action limit reached.');
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
  if (state.actionsUsed >= 2) return toast('Daily action limit reached.');
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
  if (state.actionsUsed >= 2) return toast('Daily action limit reached.');
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
              <button class="secondary-btn full" data-campaign-action="${action.id}" ${active.budget < action.cost || state.actionsUsed >= 2 ? 'disabled' : ''}>${state.actionsUsed >= 2 ? 'DAILY LIMIT REACHED' : active.budget < action.cost ? 'INSUFFICIENT CAMPAIGN FUNDS' : 'RUN CAMPAIGN ACTIVITY →'}</button>
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
  if (state.actionsUsed >= 2) return toast('Daily action limit reached. End the day to continue.');
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

function governmentPage() {
  const assemblyWins = (state.elections?.history || []).filter(item => item.result === 'Won' && String(item.typeName || '').toLowerCase().includes('assembly')).length;
  const hasGovernmentMandate = assemblyWins > 0;
  const cabinet = [
    ['Chief Minister', hasGovernmentMandate ? state.playerName : 'Vacant'],
    ['Finance Minister', hasGovernmentMandate ? 'Appointment pending' : 'Locked'],
    ['Home Minister', hasGovernmentMandate ? 'Appointment pending' : 'Locked'],
    ['Rural Development', hasGovernmentMandate ? 'Appointment pending' : 'Locked'],
    ['Education', hasGovernmentMandate ? 'Appointment pending' : 'Locked'],
    ['Health & Family Welfare', hasGovernmentMandate ? 'Appointment pending' : 'Locked']
  ];
  return `
    <div class="page-heading"><div><div class="eyebrow">PUBLIC ADMINISTRATION</div><h1>Government <em>command</em></h1><p>Track your route from elected representative to state leadership.</p></div><div class="date-card"><span>GOVERNMENT STATUS</span><b>${hasGovernmentMandate ? 'MANDATE WON' : 'NOT FORMED'}</b><small>State administration</small></div></div>
    <section class="panel government-hero"><span class="gold-tag">STATE GOVERNMENT</span><h2>${hasGovernmentMandate ? 'Your government mandate' : 'The path to government'}</h2><p class="panel-description">${hasGovernmentMandate ? 'You have recorded an Assembly election victory. Cabinet formation is the next stage of government management.' : 'Win a State Assembly election to unlock government formation, ministerial appointments, department budgets and public programmes.'}</p><div class="government-unlock-grid"><div><b>${assemblyWins}</b><small>Assembly victories</small></div><div><b>${hasGovernmentMandate ? 'Unlocked' : 'Locked'}</b><small>Cabinet formation</small></div><div><b>${hasGovernmentMandate ? 'Pending' : 'Locked'}</b><small>State budget</small></div></div><button class="primary-btn" data-tab="Elections">${hasGovernmentMandate ? 'REVIEW ELECTION RECORD →' : 'PREPARE FOR ELECTIONS →'}</button></section>
    <div class="command-section-head"><div><span class="eyebrow">CABINET STRUCTURE</span><h2>Government portfolios</h2></div></div>
    <div class="government-cabinet-grid">${cabinet.map(([role, holder]) => `<article class="panel government-portfolio"><span class="eyebrow">MINISTRY PORTFOLIO</span><h3>${role}</h3><b class="${holder === 'Locked' ? 'government-locked' : ''}">${escapeHtml(holder)}</b><small>${hasGovernmentMandate ? 'Portfolio setup available in a future government expansion.' : 'Unlock by winning a State Assembly election.'}</small></article>`).join('')}</div>
    <section class="panel government-note"><span class="eyebrow">ADMINISTRATION TRACKER</span><h3>What becomes available after forming a government?</h3><ul><li>Appoint ministers and assign portfolios.</li><li>Prepare a state budget and allocate department funds.</li><li>Launch education, healthcare and infrastructure schemes.</li><li>Monitor delivery, public satisfaction and government approval.</li></ul></section>
  `;
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
    case 'Elections':
      content = electionPage();
      break;
    case 'Finance':
      content = financePage();
      break;
    case 'Intelligence':
      content = intelligencePage();
      break;
    case 'News':
      content = newsPage();
      break;
    case 'Government':
      content = governmentPage();
      break;
    default:
      content = genericPage(activeTab);
  }

  document.querySelector('#app').innerHTML = shell(content);
}

/* EVENT HANDLERS */

document.addEventListener('click', event => {
  const regionButton = event.target.closest('[data-intel-region]');
  if (regionButton) {
    selectedIntelRegion = regionButton.dataset.intelRegion;
    render();
    return;
  }

  const reviewButton = event.target.closest('[data-review-news]');
  if (reviewButton) {
    const index = Number(reviewButton.dataset.reviewNews);
    if (!Array.isArray(state.reviewedNews)) state.reviewedNews = [];
    if (!state.reviewedNews.includes(index)) state.reviewedNews.push(index);
    saveState();
    render();
    toast('News briefing marked as reviewed.');
    return;
  }

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
