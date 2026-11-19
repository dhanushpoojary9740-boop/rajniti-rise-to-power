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

  level: 1,
  experience: 0,
  money: 25000,
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
    'Relationships', 'Finance', 'News', 'Profile'
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
        ${['Dashboard', 'Career', 'Party', 'Activities', 'Profile']
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
  return `
    <div class="page-heading">
      <div>
        <div class="eyebrow">YOUR POLITICAL JOURNEY</div>
        <h1>Welcome, <em>${escapeHtml(state.playerName)}</em></h1>
        <p>${dateText()}</p>
      </div>
      <div class="date-card">
        <span>SIMULATION DATE</span>
        <b>DAY ${state.day}</b>
        <small>Year ${state.year}</small>
      </div>
    </div>

    ${!state.characterCreated ? `
      <section class="panel character-alert">
        <h2>Create your politician</h2>
        <p>Start your journey by creating your political identity.</p>
        <button class="primary-btn" data-action="create-character">
          CREATE CHARACTER →
        </button>
      </section>
    ` : ''}

    <section class="hero-panel">
      <div class="hero-copy">
        <span class="gold-tag">YOUR STORY STARTS HERE</span>
        <h2>From the ground.<br><em>To the top.</em></h2>
        <p>Build your reputation, earn public trust and shape the future of the nation.</p>
        <button class="primary-btn" data-tab="Party">
          EXPLORE POLITICAL PARTIES →
        </button>
      </div>
      <div class="hero-art">
        <div class="orbit orbit-one"></div>
        <div class="orbit orbit-two"></div>
        <div class="parliament">🏛</div>
      </div>
    </section>

    <div class="section-heading">
      <div>
        <span class="eyebrow">POLITICAL OVERVIEW</span>
        <h2>Your current standing</h2>
      </div>
    </div>

    <div class="stats-grid">
      ${statCard('PERSONAL WEALTH', money(state.money), 'Available funds', '₹')}
      ${statCard('REPUTATION', state.reputation + '/100', 'Public image', '✦')}
      ${statCard('INFLUENCE', state.influence + '/100', 'Political reach', '♜')}
      ${statCard('PUBLIC SUPPORT', state.publicSupport + '%', 'Estimated support', '♥')}
    </div>

    <div class="content-grid">
      <section class="panel">
        <span class="eyebrow">POLITICAL AFFILIATION</span>
        <h3>${escapeHtml(state.party)}</h3>
        <p class="panel-description">${escapeHtml(state.partyPosition)}</p>
        <button class="secondary-btn full" data-tab="Party">
          MANAGE PARTY →
        </button>
      </section>

      <section class="panel">
        <span class="eyebrow">YOUR CAREER</span>
        <h3>${escapeHtml(state.role)}</h3>
        <p class="panel-description">Level ${state.level} · ${state.experience} XP</p>
        <button class="secondary-btn full" data-tab="Career">
          VIEW CAREER →
        </button>
      </section>
    </div>

    <section class="panel" style="margin-top:15px">
      <span class="eyebrow">SIMULATION CALENDAR</span>
      <h3>${dateText()}</h3>
      <p class="panel-description">
        Available actions: ${Math.max(0, 2 - state.actionsUsed)} / 2
      </p>
      <button class="secondary-btn" data-action="end-day">
        END DAY →
      </button>
    </section>
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

function createdPartyPage() {
  return `
    <div class="page-heading">
      <div>
        <div class="eyebrow">FOUNDER & PARTY PRESIDENT</div>
        <h1>Your political <em>movement</em></h1>
        <p>You have established your own political organisation.</p>
      </div>
    </div>

    <section class="panel party-headquarters">
      <div class="party-large-emblem">
        ${escapeHtml(state.partyAbbreviation.slice(0, 1))}
      </div>
      <span class="gold-tag">PARTY FOUNDER</span>
      <h2>${escapeHtml(state.party)}</h2>
      <p class="panel-description">${escapeHtml(state.partyIdeology)}</p>

      <div class="party-stat-row">
        <span>Your position</span>
        <b>Founder & President</b>
      </div>
      <div class="party-stat-row">
        <span>Membership</span>
        <b>${state.partyMembers}</b>
      </div>
      <div class="party-stat-row">
        <span>Popularity</span>
        <b>${state.partyPopularity}/100</b>
      </div>
      <div class="party-stat-row">
        <span>Party treasury</span>
        <b>${money(state.partyFunds)}</b>
      </div>
    </section>

    <div class="stats-grid" style="margin-top:15px">
      ${statCard('MEMBERS', state.partyMembers, 'Your organisation', '♟')}
      ${statCard('POPULARITY', state.partyPopularity + '/100', 'Party standing', '✦')}
      ${statCard('TREASURY', money(state.partyFunds), 'Party funds', '₹')}
      ${statCard('YOUR INFLUENCE', state.influence + '/100', 'Political influence', '♜')}
    </div>

    <section class="panel" style="margin-top:15px">
      <span class="eyebrow">GROW YOUR ORGANISATION</span>
      <h3>Organise a membership drive</h3>
      <p class="panel-description">
        Spend ₹1,000 to organise an initial recruitment campaign.
        This increases your fictional party membership and popularity.
      </p>
      <button class="primary-btn" data-action="recruit-members">
        ORGANISE MEMBERSHIP DRIVE · ₹1,000 →
      </button>
    </section>

    <section class="panel" style="margin-top:15px">
      <span class="eyebrow">PARTY TREASURY</span>
      <button class="secondary-btn" data-action="party-donate">
        CONTRIBUTE ₹1,000 →
      </button>
    </section>
  `;
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

    const expense = monthlyExpenses();
    state.money = Math.max(0, state.money - expense);
    state.totalExpenses += expense;

    message = `New month! Living expenses: ${money(expense)}`;
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

  state.partyMembers += 25;
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

  saveState();
  render();
  toast('You are now an independent politician.');
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
    default:
      content = genericPage(activeTab);
  }

  document.querySelector('#app').innerHTML = shell(content);
}

/* EVENT HANDLERS */

document.addEventListener('click', event => {
  const tab = event.target.closest('[data-tab]');

  if (tab) {
    activeTab = tab.dataset.tab;
    render();
    return;
  }

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
  }
});

document.addEventListener('submit', event => {
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
