/* ============================================================
   D365 AI Cases — Shared JavaScript
   ============================================================ */

// ---- Scroll-to-Top Button ----
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.scroll-top');
  if (btn) {
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ---- Fade-in on Scroll ----
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // Immediately reveal any fade-in wrapper that contains an agent table
  document.querySelectorAll('.fade-in').forEach(el => {
    if (el.querySelector('.agent-table')) el.classList.add('visible');
  });

  // ---- Agent Table Search ----
  const searchInput = document.getElementById('agentSearch');
  const areaFilter = document.getElementById('areaFilter');
  if (searchInput) {
    const filterTable = () => {
      const q = searchInput.value.toLowerCase();
      const area = areaFilter ? areaFilter.value : '';
      document.querySelectorAll('.agent-table tbody tr').forEach(row => {
        const text = row.textContent.toLowerCase();
        const rowArea = row.dataset.area || '';
        const matchQ = !q || text.includes(q);
        const matchA = !area || rowArea === area;
        row.style.display = matchQ && matchA ? '' : 'none';
      });
    };
    searchInput.addEventListener('input', filterTable);
    if (areaFilter) areaFilter.addEventListener('change', filterTable);
    // Run filter on load to ensure all rows are visible by default
    filterTable();
  }

  // ---- Collapsible Sections ----
  document.querySelectorAll('.collapsible').forEach(el => {
    el.addEventListener('click', () => {
      el.classList.toggle('active');
      const content = el.nextElementSibling;
      if (content) content.style.display = content.style.display === 'none' ? '' : 'none';
    });
  });

  // ---- Expandable deep-dive cards: full-width on open ----
  document.querySelectorAll('.deepdive-summary-card details').forEach(det => {
    det.addEventListener('toggle', () => {
      const card = det.closest('.deepdive-summary-card');
      if (!card) return;
      if (det.open) {
        card.style.gridColumn = '1 / -1';
      } else {
        card.style.gridColumn = '';
      }
      // Re-render any mermaid diagrams inside
      if (det.open && typeof mermaid !== 'undefined') {
        card.querySelectorAll('.mermaid:not([data-processed])').forEach(el => {
          mermaid.run({ nodes: [el] });
        });
      }
    });
  });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});

// ---- Chart.js Color Palette ----
const CHART_COLORS = {
  blue:   '#0078D4',
  purple: '#6B2FA0',
  teal:   '#00B294',
  green:  '#107C10',
  orange: '#FF8C00',
  red:    '#D13438',
  yellow: '#FFB900',
  pink:   '#E3008C',
  navy:   '#003A6C',
  lime:   '#84CC16',
  cyan:   '#06B6D4',
};

const CHART_PALETTE = Object.values(CHART_COLORS);

function getPalette(n) {
  const colors = [];
  for (let i = 0; i < n; i++) colors.push(CHART_PALETTE[i % CHART_PALETTE.length]);
  return colors;
}

// ---- Common chart defaults ----
if (typeof Chart !== 'undefined') {
  Chart.defaults.font.family = "'Segoe UI', sans-serif";
  Chart.defaults.font.size = 13;
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.padding = 16;
  Chart.defaults.animation.duration = 800;
}

// ---- Mermaid.js Initialization ----
if (typeof mermaid !== 'undefined') {
  mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
    themeVariables: {
      primaryColor: '#E8F0FE',
      primaryBorderColor: '#0078D4',
      primaryTextColor: '#111827',
      lineColor: '#6B7280',
      secondaryColor: '#F3E8FF',
      tertiaryColor: '#ECFDF5',
      fontSize: '13px',
      fontFamily: "'Segoe UI', sans-serif",
    },
    flowchart: { htmlLabels: true, curve: 'basis', padding: 12 },
    securityLevel: 'loose',
  });
}
