import './styles.css';

const STORE_KEY = 'rajniti-save-v1';

const defaultState = {
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
  lastMonthlyExpense: 0,

  completed: [],
  activityHistory: [],
  activeTab: 'Dashboard'
};

let state = loadState();
let activeTab = 'Dashboard';

function loadState() {
  try {
    const saved = localStorage.getItem(STORE_KEY);

    return saved
      ? { ...defaultState, ...JSON.parse(saved) }
      : { ...defaultState };
  } catch {
    return { ...defaultState };
  }
}

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function money(value) {
  return '₹' + Number(value).toLocaleString('en-IN');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
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

function currentDate() {
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  return `Day ${state.day} · ${months[state.month - 1]} · Year ${state.year}`;
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
    'Dashboard',
    'Career',
    'Activities',
    'Party',
    'Constituency',
    'Elections',
    'Government',
    'Relationships',
    'Finance',
    'News',
    'Profile'
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
            <button
              class="nav-item ${activeTab === name ? 'active' : ''}"
              data-tab="${name}">
              <span>${icon(name)}</span>
              ${name}
            </button>
          `).join('')}
        </nav>

        <div class="sidebar-bottom">
          <div class="season-chip">
            <span class="pulse"></span>
            CAREER MODE
            <b>OFFLINE</b>
          </div>
          <small>RAJNITI v1.0 · EARLY ACCESS</small>
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

        <section class="page">
          ${content}
        </section>

      </main>

      <nav class="mobile-nav">
        ${['Dashboard', 'Career', 'Activities', 'Party', 'Profile']
          .map(name => `
            <button
              class="${activeTab === name ? 'active' : ''}"
              data-tab="${name}">
              <span>${icon(name)}</span>
              <small>${name}</small>
            </button>
          `).join('')}
      </nav>

    </div>
  `;
}

function dashboard() {
  return `
    <div class="page-heading">

      <div>
        <div class="eyebrow">YOUR POLITICAL JOURNEY BEGINS</div>

        <h1>
          Good evening,
          <em>${escapeHtml(state.playerName)}</em>
        </h1>

        <p>
          Every great political journey starts with one decision.
        </p>
      </div>

      <div class="date-card">
        <span>SIMULATION DATE</span>
        <b>DAY ${state.day}</b>
        <small>Year ${state.year}</small>
      </div>

    </div>

    ${!state.characterCreated ? `
      <section class="panel character-alert">
        <span class="gold-tag">NEW POLITICAL CAREER</span>
        <h2>Create your politician</h2>
        <p>
          Create your identity before beginning your political journey.
        </p>
        <button class="primary-btn" data-action="create-character">
          CREATE CHARACTER →
        </button>
      </section>
    ` : ''}

    <section class="hero-panel">

      <div class="hero-copy">
        <span class="gold-tag">YOUR STORY STARTS HERE</span>

        <h2>
          From the ground.<br>
          <em>To the top.</em>
        </h2>

        <p>
          Build your reputation, earn public trust,
          grow your influence and shape the future
          of the nation.
        </p>

        <button class="primary-btn" data-tab="Activities">
          EXPLORE POLITICAL ACTIVITIES →
        </button>
      </div>

      <div class="hero-art">
        <div class="orbit orbit-one"></div>
        <div class="orbit orbit-two"></div>
        <div class="parliament">🏛</div>
        <div class="art-caption">
          <b>THE ROAD TO LEADERSHIP</b>
          <small>ONE DECISION AT A TIME</small>
        </div>
      </div>

    </section>

    <div class="section-heading">
      <div>
        <span class="eyebrow">POLITICAL OVERVIEW</span>
        <h2>Your current standing</h2>
      </div>
      <span class="subtle-label">LIVE PROFILE</span>
    </div>

    <div class="stats-grid">
      ${statCard('PERSONAL WEALTH', money(state.money), 'Available funds', '₹')}
      ${statCard('PUBLIC REPUTATION', state.reputation + '/100', 'Your public image', '✦')}
      ${statCard('POLITICAL INFLUENCE', state.influence + '/100', 'Your political reach', '♜')}
      ${statCard('PUBLIC SUPPORT', state.publicSupport + '%', 'Estimated support', '♥')}
    </div>

    <div class="content-grid">

      <section class="panel">
        <div class="panel-head">
          <div>
            <span class="eyebrow">DAILY OBJECTIVE</span>
            <h3>Build your political identity</h3>
          </div>
          <span class="number-badge">01</span>
        </div>

        <p class="panel-description">
          Meet residents, help your community and build public trust.
        </p>

        <button class="secondary-btn full" data-tab="Activities">
          VIEW AVAILABLE ACTIVITIES →
        </button>
      </section>

      <section class="panel profile-panel">
        <span class="eyebrow">YOUR CURRENT POSITION</span>

        <div class="rank-row">
          <div class="rank-emblem">I</div>
          <div>
            <h3>${escapeHtml(state.role)}</h3>
            <p>${escapeHtml(state.party)} · Level ${state.level}</p>
          </div>
        </div>

        <div class="progress-label">
          <span>CAREER EXPERIENCE</span>
          <b>${state.experience}/100 XP</b>
        </div>

        <div class="progress-track">
          <i style="width:${Math.min(100, state.experience)}%"></i>
        </div>

        <div class="profile-meta">
          <span>Age <b>${state.age}</b></span>
          <span>Hometown <b>${escapeHtml(state.hometown)}</b></span>
        </div>
      </section>

    </div>

    <section class="panel" style="margin-top:14px">
      <span class="eyebrow">SIMULATION CALENDAR</span>
      <h3>${currentDate()}</h3>
      <p class="panel-description">
        Actions available today: ${Math.max(0, 2 - state.actionsUsed)} / 2
      </p>
      <button class="secondary-btn" data-action="end-day">
        END DAY & CONTINUE →
      </button>
    </section>
  `;
}

const activities = [
  {
    id: 'community',
    name: 'Community Visit',
    category: 'PUBLIC SERVICE',
    description: 'Visit your neighbourhood, listen to residents and understand local problems.',
    cost: 500,
    xp: 12,
    reputation: 3,
    support: 2,
    influence: 1,
    symbol: '⌂'
  },
  {
    id: 'volunteer',
    name: 'Volunteer Work',
    category: 'GROUND POLITICS',
    description: 'Participate in local volunteer activities and build grassroots connections.',
    cost: 0,
    xp: 15,
    reputation: 2,
    support: 2,
    influence: 2,
    symbol: '✦'
  },
  {
    id: 'meeting',
    name: 'Political Meeting',
    category: 'NETWORKING',
    description: 'Attend a local political meeting and develop political relationships.',
    cost: 300,
    xp: 12,
    reputation: 1,
    support: 0,
    influence: 4,
    symbol: '♜'
  },
  {
    id: 'public',
    name: 'Community Assistance',
    category: 'SOCIAL WORK',
    description: 'Organise a small community assistance programme.',
    cost: 1000,
    xp: 18,
    reputation: 4,
    support: 4,
    influence: 1,
    symbol: '♥'
  },
  {
    id: 'speech',
    name: 'Public Speech',
    category: 'PUBLIC RELATIONS',
    description: 'Address a local gathering and communicate your development priorities.',
    cost: 700,
    xp: 16,
    reputation: 3,
    support: 3,
    influence: 3,
    symbol: '◉'
  },
  {
    id: 'research',
    name: 'Study Local Issues',
    category: 'POLITICAL RESEARCH',
    description: 'Research roads, education, employment and public infrastructure needs.',
    cost: 100,
    xp: 10,
    reputation: 1,
    support: 1,
    influence: 2,
    symbol: '▤'
  }
];

function activityPage() {
  return `
    <div class="page-heading">
      <div>
        <div class="eyebrow">BUILD YOUR POLITICAL CAREER</div>
        <h1>Political <em>activities</em></h1>
        <p>Your actions today shape your political future.</p>
      </div>
    </div>

    <section class="panel" style="margin-bottom:16px">
      <div class="section-heading">
        <div>
          <span class="eyebrow">TODAY'S SCHEDULE</span>
          <h2>${currentDate()}</h2>
        </div>
        <span class="number-badge">${Math.max(0, 2 - state.actionsUsed)} ACTIONS LEFT</span>
      </div>

      <div class="stats-grid" style="grid-template-columns:repeat(2,1fr)">
        ${statCard('AVAILABLE ACTIONS', Math.max(0, 2 - state.actionsUsed), 'Daily action points', '✦')}
        ${statCard('CURRENT FUNDS', money(state.money), 'Available money', '₹')}
      </div>

      <button class="secondary-btn full" data-action="end-day">
        END DAY & START NEXT DAY →
      </button>
    </section>

    <div class="section-heading">
      <div>
        <span class="eyebrow">AVAILABLE ACTIVITIES</span>
        <h2>Choose your next move</h2>
      </div>
    </div>

    <div class="activity-grid">
      ${activities.map(activity => `
        <article class="panel activity-card">

          <div class="activity-card-top">
            <div class="activity-symbol">${activity.symbol}</div>
            <span class="gold-tag">${activity.category}</span>
          </div>

          <h3>${activity.name}</h3>
          <p class="panel-description">${activity.description}</p>

          <div class="activity-cost">
            <span>Activity cost</span>
            <b>${money(activity.cost)}</b>
          </div>

          <div class="activity-rewards">
            <span>+${activity.xp} XP</span>
            <span>+${activity.reputation} Reputation</span>
            <span>+${activity.influence} Influence</span>
            <span>+${activity.support} Support</span>
          </div>

          <button
            class="secondary-btn full"
            data-activity="${activity.id}"
            ${state.actionsUsed >= 2 || !state.characterCreated || state.money < activity.cost ? 'disabled' : ''}>
            ${!state.characterCreated ? 'CREATE CHARACTER FIRST'
              : state.actionsUsed >= 2 ? 'DAILY LIMIT REACHED'
              : state.money < activity.cost ? 'INSUFFICIENT FUNDS'
              : 'PERFORM ACTIVITY →'}
          </button>

        </article>
      `).join('')}
    </div>

    <section class="panel" style="margin-top:16px">
      <span class="eyebrow">RECENT ACTIVITY</span>
      <h3>Political activity history</h3>

      ${state.activityHistory.length
        ? state.activityHistory.slice(0, 8).map(item => `
          <div class="career-step">
            <div class="step-node">✓</div>
            <div>
              <b>${escapeHtml(item.name)}</b>
              <small>${escapeHtml(item.date)}</small>
            </div>
            <span class="current-label">+${item.xp} XP</span>
          </div>
        `).join('')
        : '<p class="panel-description">No activities completed yet. Your political journey is waiting.</p>'}
    </section>
  `;
}

function calculateStartingMoney(background) {
  const values = {
    'Poor': 5000,
    'Lower Middle Class': 25000,
    'Middle Class': 100000,
    'Upper Middle Class': 500000,
    'Wealthy': 2500000
  };

  return values[background] || 25000;
}

function performActivity(id) {
  if (!state.characterCreated) {
    toast('Create your politician first.');
    return;
  }

  if (state.actionsUsed >= 2) {
    toast('No actions left today. End the day first.');
    return;
  }

  const activity = activities.find(item => item.id === id);

  if (!activity) return;

  if (state.money < activity.cost) {
    toast('You do not have enough money.');
    return;
  }

  state.money -= activity.cost;
  state.totalExpenses += activity.cost;

  state.experience += activity.xp;
  state.reputation = Math.min(100, state.reputation + activity.reputation);
  state.influence = Math.min(100, state.influence + activity.influence);
  state.publicSupport = Math.min(100, state.publicSupport + activity.support);

  state.actionsUsed++;
  state.totalActions++;

  state.activityHistory.unshift({
    name: activity.name,
    date: currentDate(),
    xp: activity.xp
  });

  state.activityHistory = state.activityHistory.slice(0, 30);

  saveState();
  render();

  toast(`${activity.name} completed! +${activity.xp} XP`);

  checkPromotion();
}

function checkPromotion() {
  if (
    state.role === 'Political Volunteer' &&
    state.experience >= 100 &&
    state.influence >= 15 &&
    state.publicSupport >= 15
  ) {
    state.role = 'Booth-level Worker';
    state.level = 2;
    state.reputation = Math.min(100, state.reputation + 5);

    saveState();
    render();

    toast('PROMOTION! You are now a Booth-level Worker!');
  }
}

function monthlyExpenses() {
  const costs = {
    'Poor': 1500,
    'Lower Middle Class': 3000,
    'Middle Class': 6000,
    'Upper Middle Class': 15000,
    'Wealthy': 40000
  };

  return costs[state.financialBackground] || 3000;
}

function endDay() {
  if (!state.characterCreated) {
    toast('Create your politician before starting the simulation.');
    return;
  }

  state.day++;
  state.actionsUsed = 0;

  let notification = 'A new day begins. Your actions have been refreshed.';

  if (state.day > 30) {
    state.day = 1;
    state.month++;

    if (state.month > 12) {
      state.month = 1;
      state.year++;
      state.age++;
    }

    const expense = monthlyExpenses();

    state.money -= expense;
    state.lastMonthlyExpense = expense;
    state.totalExpenses += expense;

    notification = `New month! Living expenses: ${money(expense)}`;

    if (state.money < 0) {
      state.money = 0;
    }
  }

  saveState();
  render();
  toast(notification);
}

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
        <p>Your rise is earned through service, strategy and public trust.</p>
      </div>
    </div>

    <section class="panel">
      <span class="eyebrow">CAREER LADDER</span>

      <div class="career-list">
        ${ranks.map((rank, i) => `
          <div class="career-step ${rank === state.role ? 'current' : ''}">
            <div class="step-node">${rank === state.role ? '★' : i + 1}</div>
            <div>
              <b>${rank}</b>
              <small>${rank === state.role ? 'Your current position' : 'Unlock through political progress'}</small>
            </div>
            ${rank === state.role ? '<span class="current-label">CURRENT</span>' : '<span class="locked">LOCKED</span>'}
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function profilePage() {
  return `
    <div class="page-heading">
      <div>
        <div class="eyebrow">YOUR PERSONAL RECORD</div>
        <h1>Politician <em>profile</em></h1>
        <p>Your identity, background and political ambitions.</p>
      </div>
    </div>

    <section class="panel">
      ${state.characterCreated ? `
        <h2>${escapeHtml(state.playerName)}</h2>
        <p>${escapeHtml(state.role)} · ${escapeHtml(state.party)}</p>

        <div class="career-list">
          ${[
            ['Age', state.age],
            ['Gender', state.gender],
            ['State', state.stateName],
            ['Hometown', state.hometown],
            ['Education', state.education],
            ['Occupation', state.occupation],
            ['Family', state.familyBackground],
            ['Financial background', state.financialBackground],
            ['Ideology', state.ideology],
            ['Political ambition', state.ambition],
            ['Personal wealth', money(state.money)]
          ].map(([label, value]) => `
            <div class="career-step">
              <b>${label}</b>
              <span class="current-label">${escapeHtml(value)}</span>
            </div>
          `).join('')}
        </div>

        <button class="secondary-btn" data-action="edit-character">
          EDIT CHARACTER
        </button>
      ` : `
        <h2>No politician created yet</h2>
        <button class="primary-btn" data-action="create-character">
          CREATE CHARACTER →
        </button>
      `}
    </section>
  `;
}

function field(label, name, options, selected) {
  return `
    <div class="creator-field">
      <label for="${name}">${label}</label>
      <select id="${name}" name="${name}" required>
        ${options.map(option => `
          <option value="${escapeHtml(option)}" ${selected === option ? 'selected' : ''}>
            ${escapeHtml(option)}
          </option>
        `).join('')}
      </select>
    </div>
  `;
}

function characterCreation() {
  return `
    <div class="page-heading">
      <div>
        <div class="eyebrow">YOUR LIFE · YOUR POLITICAL FUTURE</div>
        <h1>Create your <em>politician</em></h1>
        <p>Every political career begins with one individual.</p>
      </div>
    </div>

    <form id="character-form" class="panel creator-panel">

      <div class="creator-section">
        <span class="gold-tag">01 · PERSONAL IDENTITY</span>
        <h2>Who are you?</h2>

        <div class="creator-grid">

          <div class="creator-field">
            <label for="playerName">Full name</label>
            <input id="playerName" name="playerName" maxlength="35"
              value="${escapeHtml(state.playerName === 'New Politician' ? '' : state.playerName)}"
              placeholder="Enter politician's name" required>
          </div>

          <div class="creator-field">
            <label for="age">Age</label>
            <input id="age" name="age" type="number" min="18" max="80"
              value="${state.age}" required>
          </div>

          ${field('Gender', 'gender', ['Male', 'Female', 'Other'], state.gender)}

          ${field('State / Union Territory', 'stateName', [
            'Karnataka', 'Kerala', 'Tamil Nadu', 'Andhra Pradesh',
            'Telangana', 'Maharashtra', 'Goa', 'Delhi',
            'Uttar Pradesh', 'Other'
          ], state.stateName)}

          <div class="creator-field">
            <label for="hometown">Hometown / District</label>
            <input id="hometown" name="hometown" maxlength="45"
              value="${escapeHtml(state.hometown === 'Your hometown' ? '' : state.hometown)}"
              placeholder="Enter your hometown" required>
          </div>

          ${field('Education', 'education', [
            'School Student', 'High School Graduate', 'Diploma',
            'Graduate', 'Postgraduate', 'Doctorate', 'Professional Degree'
          ], state.education)}

          ${field('Current occupation', 'occupation', [
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
        <h2>What do you stand for?</h2>

        <div class="creator-grid">
          ${field('Political ideology', 'ideology', [
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
        <button type="submit" class="primary-btn">BEGIN MY POLITICAL JOURNEY →</button>
      </div>

    </form>
  `;
}

function genericPage(name) {
  const descriptions = {
    Party: 'Build your political identity and find your place in the party system.',
    Constituency: 'Understand your community, local needs and public priorities.',
    Elections: 'Prepare for campaigns, candidates, voting and election results.',
    Government: 'Form governments and lead public institutions.',
    Relationships: 'Build alliances, friendships and political networks.',
    Finance: 'Track your personal wealth, income, expenses and campaign funds.',
    News: 'Follow events shaping your political journey.'
  };

  return `
    <div class="page-heading">
      <div>
        <div class="eyebrow">POLITICAL OFFICE</div>
        <h1>${name}</h1>
        <p>${descriptions[name] || 'Manage your political journey.'}</p>
      </div>
    </div>

    <section class="panel coming-panel">
      <div class="coming-icon">${icon(name)}</div>
      <span class="gold-tag">COMING IN DEVELOPMENT</span>
      <h2>${name} system</h2>
      <p>
        This module will be developed with working gameplay,
        connected to your career and saved game.
      </p>
      <button class="secondary-btn" data-tab="Dashboard">
        BACK TO DASHBOARD
      </button>
    </section>
  `;
}

function render() {
  let content;

  if (activeTab === 'Dashboard') {
    content = dashboard();
  } else if (activeTab === 'Career') {
    content = careerPage();
  } else if (activeTab === 'Activities') {
    content = activityPage();
  } else if (activeTab === 'Profile') {
    content = profilePage();
  } else if (activeTab === 'CharacterCreation') {
    content = characterCreation();
  } else if (activeTab === 'Finance') {
    content = genericPage('Finance');
  } else {
    content = genericPage(activeTab);
  }

  document.querySelector('#app').innerHTML = shell(content);
}

function toast(message) {
  const old = document.querySelector('.toast');
  if (old) old.remove();

  const element = document.createElement('div');
  element.className = 'toast';
  element.textContent = message;

  document.body.appendChild(element);
  setTimeout(() => element.remove(), 2800);
}

document.addEventListener('click', event => {
  const tab = event.target.closest('[data-tab]');

  if (tab) {
    activeTab = tab.dataset.tab;
    render();
    return;
  }

  const activityButton = event.target.closest('[data-activity]');

  if (activityButton) {
    performActivity(activityButton.dataset.activity);
    return;
  }

  const action = event.target.closest('[data-action]')?.dataset.action;

  if (action === 'create-character' || action === 'edit-character') {
    activeTab = 'CharacterCreation';
    render();
  }

  if (action === 'end-day') {
    endDay();
  }
});

document.addEventListener('submit', event => {
  if (event.target.id !== 'character-form') return;

  event.preventDefault();

  const data = new FormData(event.target);

  const name = String(data.get('playerName') || '').trim();
  const age = Number(data.get('age'));
  const hometown = String(data.get('hometown') || '').trim();

  if (!name || !hometown || age < 18 || age > 80) {
    toast('Please check your name, hometown and age.');
    return;
  }

  const isNewCharacter = !state.characterCreated;

  state.playerName = name;
  state.age = age;
  state.gender = data.get('gender');
  state.stateName = data.get('stateName');
  state.hometown = hometown;
  state.education = data.get('education');
  state.occupation = data.get('occupation');
  state.familyBackground = data.get('familyBackground');
  state.financialBackground = data.get('financialBackground');
  state.ideology = data.get('ideology');
  state.ambition = data.get('ambition');

  if (isNewCharacter) {
    state.money = calculateStartingMoney(state.financialBackground);
  }

  state.characterCreated = true;

  saveState();
  activeTab = 'Dashboard';
  render();

  toast(
    isNewCharacter
      ? `Political career created! Starting wealth: ${money(state.money)}`
      : 'Character profile updated!'
  );
});

render();
