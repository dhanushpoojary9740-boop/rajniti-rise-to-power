import './styles.css';

const STORE_KEY = 'rajniti-save-v1';

const defaultState = {
  playerName: 'New Politician',
  age: 21,
  hometown: 'Your hometown',
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

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
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
          ${nav.map(n => `
            <button
              class="nav-item ${activeTab === n ? 'active' : ''}"
              data-tab="${n}"
            >
              <span>${icon(n)}</span>
              ${n}
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
          .map(n => `
            <button
              class="${activeTab === n ? 'active' : ''}"
              data-tab="${n}"
            >
              <span>${icon(n)}</span>
              <small>${n}</small>
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
        <div class="eyebrow">
          YOUR POLITICAL JOURNEY BEGINS
        </div>

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

    <section class="hero-panel">

      <div class="hero-copy">

        <span class="gold-tag">
          YOUR STORY STARTS HERE
        </span>

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
          CONTINUE YOUR JOURNEY
          <span>→</span>
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

      ${statCard(
        'PERSONAL WEALTH',
        money(state.money),
        'Available funds',
        '₹'
      )}

      ${statCard(
        'PUBLIC REPUTATION',
        state.reputation + '/100',
        'Your public image',
        '✦'
      )}

      ${statCard(
        'POLITICAL INFLUENCE',
        state.influence + '/100',
        'Your reach in politics',
        '♜'
      )}

      ${statCard(
        'PUBLIC SUPPORT',
        state.publicSupport + '%',
        'Initial support estimate',
        '♥'
      )}

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
          Introduce yourself to your community
          and begin building your local identity.
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
            : 'START OBJECTIVE'}
          <span>→</span>
        </button>

      </section>

      <section class="panel profile-panel">

        <span class="eyebrow">
          YOUR CURRENT POSITION
        </span>

        <div class="rank-row">

          <div class="rank-emblem">I</div>

          <div>
            <h3>${escapeHtml(state.role)}</h3>
            <p>
              ${escapeHtml(state.party)}
              · Level ${state.level}
            </p>
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
          <span>
            Age <b>${state.age}</b>
          </span>

          <span>
            Hometown <b>${escapeHtml(state.hometown)}</b>
          </span>
        </div>

      </section>

    </div>

    <div class="footer-note">
      RAJNITI is a fictional political career simulation.
      All parties, people and events will be fictional.
    </div>

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
        <div class="eyebrow">
          YOUR PATH TO LEADERSHIP
        </div>

        <h1>
          Political <em>career</em>
        </h1>

        <p>
          Your rise is earned through service,
          strategy and public trust.
        </p>
      </div>

    </div>

    <section class="panel">

      <span class="eyebrow">CAREER LADDER</span>

      <div class="career-list">

        ${ranks.map((r, i) => `
          <div class="career-step
            ${i === 1 ? 'current' : ''}
            ${i < 1 ? 'done' : ''}">

            <div class="step-node">
              ${i < 1 ? '✓' : i + 1}
            </div>

            <div>
              <b>${r}</b>

              <small>
                ${i === 1
                  ? 'Your current starting position'
                  : i === 0
                    ? 'Your journey begins here'
                    : 'Unlock through political progress'}
              </small>
            </div>

            ${i === 1
              ? '<span class="current-label">CURRENT</span>'
              : i > 1
                ? '<span class="locked">LOCKED</span>'
                : ''}

          </div>
        `).join('')}

      </div>

    </section>

  `;
}

function genericPage(name) {

  const descriptions = {
    Party:
      'Build your political identity and find your place in the party system.',

    Constituency:
      'Understand your community, local needs and public priorities.',

    Elections:
      'Prepare for campaigns, candidates, voting and election results.',

    Government:
      'One day, you will form governments and lead public institutions.',

    Relationships:
      'Build alliances, friendships and political networks.',

    Finance:
      'Track your personal wealth, income, expenses and campaign funds.',

    News:
      'Follow the events and decisions shaping your political journey.',

    Profile:
      'Your identity, background and political record.'
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

      <div class="coming-icon">
        ${icon(name)}
      </div>

      <span class="gold-tag">
        COMING IN DEVELOPMENT
      </span>

      <h2>${name} system</h2>

      <p>
        This module is part of the RAJNITI roadmap.
        We'll build it with working gameplay,
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
  } else {
    content = genericPage(activeTab);
  }

  document.querySelector('#app').innerHTML = shell(content);
}

function toast(message) {

  const old = document.querySelector('.toast');

  if (old) {
    old.remove();
  }

  const el = document.createElement('div');

  el.className = 'toast';
  el.textContent = message;

  document.body.appendChild(el);

  setTimeout(() => el.remove(), 2600);
}

document.addEventListener('click', (event) => {

  const tab = event.target.closest('[data-tab]');

  if (tab) {
    activeTab = tab.dataset.tab;
    render();
    return;
  }

  const action =
    event.target.closest('[data-action]')?.dataset.action;

  if (action === 'objective') {

    if (state.completed.includes('meet')) {
      toast('Objective already completed.');
      return;
    }

    state.completed.push('meet');

    state.experience += 5;

    state.reputation = Math.min(
      100,
      state.reputation + 2
    );

    state.publicSupport = Math.min(
      100,
      state.publicSupport + 1
    );

    saveState();
    render();

    toast(
      'Objective completed · +5 XP · Reputation increased'
    );
  }

  if (action === 'continue') {
    activeTab = 'Career';
    render();
  }

});

render();
