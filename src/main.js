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
  familyBackground: 'Middle Class',
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
  completed: [],
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
        ${['Dashboard', 'Career', 'Party', 'Elections', 'Profile']
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
        <small>Year 1 · India</small>
      </div>

    </div>

    ${!state.characterCreated ? `
      <section class="panel character-alert">
        <span class="gold-tag">NEW POLITICAL CAREER</span>
        <h2>Create your politician</h2>
        <p>
          Before entering Indian politics, create your identity,
          choose your background and define your ambition.
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

        <button class="primary-btn" data-action="continue">
          CONTINUE YOUR JOURNEY <span>→</span>
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
      ${statCard('POLITICAL INFLUENCE', state.influence + '/100', 'Your reach in politics', '♜')}
      ${statCard('PUBLIC SUPPORT', state.publicSupport + '%', 'Initial support estimate', '♥')}
    </div>

    <div class="content-grid">

      <section class="panel">
        <div class="panel-head">
          <div>
            <span class="eyebrow">NEXT OBJECTIVE</span>
            <h3>Make your first move</h3>
          </div>
          <span class="number-badge">01</span>
        </div>

        <p class="panel-description">
          Introduce yourself to your community and
          begin building your local identity.
        </p>

        <div class="objective-row">
          <div class="objective-icon">✦</div>
          <div>
            <b>Meet your first 5 residents</b>
            <small>Build trust through local conversations</small>
          </div>
          <span class="reward">+5 XP</span>
        </div>

        <button class="secondary-btn full" data-action="objective">
          ${state.completed.includes('meet')
            ? 'OBJECTIVE COMPLETED'
            : 'START OBJECTIVE'} →
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

    <div class="footer-note">
      RAJNITI is a fictional political career simulation.
    </div>
  `;
}

function field(label, name, options, selected) {
  return `
    <div class="creator-field">
      <label for="${name}">${label}</label>
      <select id="${name}" name="${name}" required>
        ${options.map(option => `
          <option
            value="${escapeHtml(option)}"
            ${selected === option ? 'selected' : ''}>
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
        <p>Every political empire begins with one individual.</p>
      </div>
    </div>

    <form id="character-form" class="panel creator-panel">

      <div class="creator-section">
        <span class="gold-tag">01 · PERSONAL IDENTITY</span>
        <h2>Who are you?</h2>

        <div class="creator-grid">

          <div class="creator-field">
            <label for="playerName">Full name</label>
            <input
              id="playerName"
              name="playerName"
              maxlength="35"
              placeholder="Enter politician's name"
              value="${escapeHtml(state.playerName === 'New Politician' ? '' : state.playerName)}"
              required>
          </div>

          <div class="creator-field">
            <label for="age">Age</label>
            <input
              id="age"
              name="age"
              type="number"
              min="18"
              max="80"
              value="${state.age}"
              required>
          </div>

          ${field('Gender', 'gender',
            ['Male', 'Female', 'Other'], state.gender)}

          ${field('State / Union Territory', 'stateName', [
            'Karnataka', 'Kerala', 'Tamil Nadu', 'Andhra Pradesh',
            'Telangana', 'Maharashtra', 'Goa', 'Delhi',
            'Uttar Pradesh', 'Other'
          ], state.stateName)}

          <div class="creator-field">
            <label for="hometown">Hometown / District</label>
            <input
              id="hometown"
              name="hometown"
              maxlength="45"
              value="${escapeHtml(state.hometown === 'Your hometown' ? '' : state.hometown)}"
              placeholder="Enter your hometown"
              required>
          </div>

          ${field('Education', 'education', [
            'School Student', 'High School Graduate',
            'Diploma', 'Graduate', 'Postgraduate',
            'Doctorate', 'Professional Degree'
          ], state.education)}

          ${field('Current occupation', 'occupation', [
            'Unemployed', 'Student', 'Private Employee',
            'Government Employee', 'Business Owner',
            'Farmer', 'Teacher', 'Lawyer',
            'Social Worker', 'Other'
          ], state.occupation)}

        </div>
      </div>

      <div class="creator-section">
        <span class="gold-tag">02 · FAMILY & FINANCES</span>
        <h2>Your background</h2>

        <div class="creator-grid">

          ${field('Family background', 'familyBackground', [
            'Political Family', 'Business Family',
            'Farmer Family', 'Government Service Family',
            'Working Class Family', 'Ordinary Family'
          ], state.familyBackground)}

          ${field('Financial background', 'financialBackground', [
            'Poor', 'Lower Middle Class', 'Middle Class',
            'Upper Middle Class', 'Wealthy'
          ], state.financialBackground)}

        </div>

        <p class="creator-note">
          Your starting wealth and opportunities will be
          determined by your selected background.
        </p>
      </div>

      <div class="creator-section">
        <span class="gold-tag">03 · POLITICAL IDENTITY</span>
        <h2>What do you stand for?</h2>

        <div class="creator-grid">

          ${field('Political ideology', 'ideology', [
            'Development Focused',
            'Social Welfare Focused',
            'Economic Reform',
            'Environmental Focused',
            'Traditional Values',
            'Centrist',
            'Independent Thinker'
          ], state.ideology)}

          ${field('Ultimate ambition', 'ambition', [
            'Local Leader',
            'Councillor / Panchayat President',
            'MLA',
            'State Minister',
            'Chief Minister',
            'Member of Parliament',
            'Union Minister',
            'Prime Minister'
          ], state.ambition)}

        </div>
      </div>

      <div class="creator-actions">
        <button type="button" class="secondary-btn"
          data-tab="Dashboard">
          CANCEL
        </button>

        <button type="submit" class="primary-btn">
          BEGIN MY POLITICAL JOURNEY →
        </button>
      </div>

    </form>
  `;
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
          <div class="career-step ${i === 1 ? 'current' : ''} ${i === 0 ? 'done' : ''}">
            <div class="step-node">${i === 0 ? '✓' : i + 1}</div>
            <div>
              <b>${rank}</b>
              <small>${i === 1 ? 'Your current position' : 'Unlock through political progress'}</small>
            </div>
            ${i === 1 ? '<span class="current-label">CURRENT</span>' : i > 1 ? '<span class="locked">LOCKED</span>' : ''}
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
        <p>Create your character to view your personal record.</p>
        <button class="primary-btn" data-action="create-character">
          CREATE CHARACTER →
        </button>
      `}
    </section>
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
  } else if (activeTab === 'Profile') {
    content = profilePage();
  } else if (activeTab === 'CharacterCreation') {
    content = characterCreation();
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

document.addEventListener('click', event => {
  const tab = event.target.closest('[data-tab]');

  if (tab) {
    activeTab = tab.dataset.tab;
    render();
    return;
  }

  const action = event.target.closest('[data-action]')?.dataset.action;

  if (action === 'create-character') {
    activeTab = 'CharacterCreation';
    render();
  }

  if (action === 'edit-character') {
    activeTab = 'CharacterCreation';
    render();
  }

  if (action === 'continue') {
    activeTab = 'Career';
    render();
  }

  if (action === 'objective') {
    if (state.completed.includes('meet')) {
      toast('Objective already completed.');
      return;
    }

    state.completed.push('meet');
    state.experience += 5;
    state.reputation = Math.min(100, state.reputation + 2);
    state.publicSupport = Math.min(100, state.publicSupport + 1);

    saveState();
    render();
    toast('Objective completed · +5 XP');
  }
});

document.addEventListener('submit', event => {
  if (event.target.id !== 'character-form') return;

  event.preventDefault();

  const form = event.target;
  const data = new FormData(form);

  const name = String(data.get('playerName') || '').trim();
  const age = Number(data.get('age'));
  const hometown = String(data.get('hometown') || '').trim();

  if (!name || !hometown || age < 18 || age > 80) {
    toast('Please check your name, hometown and age.');
    return;
  }

  const oldMoney = state.money;

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

  if (!state.characterCreated) {
    state.money = calculateStartingMoney(state.financialBackground);
  }

  state.characterCreated = true;

  saveState();

  activeTab = 'Dashboard';
  render();

  toast(
    'Your political identity has been created! Starting wealth: ' +
    money(state.characterCreated ? state.money : oldMoney)
  );
});

render();
