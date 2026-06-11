import { toClassName, loadCSS } from '../../scripts/aem.js';

let tabsStyleLoaded;

function getTabDefinition(section, fallbackIdx = 0) {
  const tabId = String(section.dataset?.tabId || '').trim();
  if (!tabId) return null;

  const title = String(section.dataset?.tabTitle || tabId).trim() || `Tab ${fallbackIdx + 1}`;
  return {
    id: toClassName(tabId) || `tab-${fallbackIdx + 1}`,
    title,
    section,
  };
}

function collectTabSections(currSection) {
  const tabDefs = [];
  let next = currSection.nextElementSibling;

  while (next?.classList.contains('section')) {
    const tabDef = getTabDefinition(next, tabDefs.length);
    if (!tabDef) break;
    tabDefs.push(tabDef);
    next = next.nextElementSibling;
  }

  return tabDefs;
}

function findTabGroups(main) {
  const sections = [...main.querySelectorAll('.section[data-tab-id]')]
    .filter((s) => !s.closest('.tabs-wrapper'));
  return sections.length ? [sections] : [];
}

function updateTabState(tabDefs, selectedId, tabButtons, tabPanels) {
  tabDefs.forEach((tabDef) => {
    const isSelected = tabDef.id === selectedId;
    const button = tabButtons[tabDef.id];
    const panel = tabPanels[tabDef.id];

    if (button) {
      button.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      button.classList.toggle('is-active', isSelected);
    }

    if (panel) {
      panel.setAttribute('aria-hidden', isSelected ? 'false' : 'true');
    }
  });
}

function scrollActiveTab(button, tabList) {
  // Center the active tab, showing equal peeks of adjacent tabs
  const listRect = tabList.getBoundingClientRect();
  const btnRect = button.getBoundingClientRect();
  const btnStart = btnRect.left - listRect.left + tabList.scrollLeft;
  const offset = btnStart - (tabList.clientWidth - button.offsetWidth) / 2;
  tabList.scrollLeft = Math.max(0, offset);
}

function buildTabsUI(tabDefs, tabsContainer, sectionId = '') {
  const hash = window.location.hash.replace('#', '').toLowerCase();
  const selectedId = tabDefs.find((tabDef) => tabDef.id === hash)?.id || tabDefs[0]?.id;

  const tabsWrapper = document.createElement('div');
  tabsWrapper.className = 'tabs-wrapper';

  const tabList = document.createElement('div');
  tabList.className = 'tabs-list';
  tabList.setAttribute('role', 'tablist');
  tabList.setAttribute('aria-orientation', 'horizontal');

  const tabContent = document.createElement('div');
  tabContent.className = 'tabs-content';

  const tabButtons = {};
  const tabPanels = {};

  tabDefs.forEach((tabDef) => {
    const baseId = `${tabDef.id}${sectionId ? `-${sectionId}` : ''}`;
    const buttonId = `desktop-${baseId}`;
    const panelId = `desktop-panel-${baseId}`;
    const isSelected = tabDef.id === selectedId;

    const button = document.createElement('button');
    button.className = 'tabs-tab';
    button.id = buttonId;
    button.type = 'button';
    button.role = 'tab';
    button.setAttribute('aria-controls', panelId);
    button.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    button.classList.toggle('is-active', isSelected);
    button.textContent = tabDef.title;

    const panel = document.createElement('div');
    panel.className = 'tab';
    panel.id = panelId;
    panel.role = 'tabpanel';
    panel.setAttribute('aria-labelledby', buttonId);
    panel.setAttribute('aria-hidden', isSelected ? 'false' : 'true');
    panel.append(tabDef.section);

    button.addEventListener('click', () => {
      updateTabState(tabDefs, tabDef.id, tabButtons, tabPanels);
      scrollActiveTab(button, tabList);
      window.history.pushState({}, '', `${window.location.pathname}#${tabDef.id}`);
    });

    tabButtons[tabDef.id] = button;
    tabPanels[tabDef.id] = panel;
    tabList.append(button);
    tabContent.append(panel);
  });

  tabsWrapper.append(tabList, tabContent);

  // Scroll the initially selected tab into view on load
  const activeButton = tabButtons[selectedId];
  if (activeButton) {
    requestAnimationFrame(() => scrollActiveTab(activeButton, tabList));
  }

  return tabsWrapper;
}

function buildTabsFromSections(tabSections) {
  if (!tabSections.length) return;
  const first = tabSections[0];
  const parent = first.parentNode;
  if (!parent) return;

  const tabDefs = tabSections
    .map((section, index) => getTabDefinition(section, index))
    .filter(Boolean);
  if (!tabDefs.length) return;

  tabDefs.forEach((def) => def.section.classList.remove('tabs'));

  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'section tabs';
  parent.insertBefore(tabsContainer, first);

  const tabsUI = buildTabsUI(tabDefs, tabsContainer, first.id || '');
  tabsContainer.append(tabsUI);
}

function buildTabSwitching(tabList, tabContent) {
  tabList.querySelectorAll('[role="tab"]').forEach((button) => {
    button.addEventListener('click', () => {
      tabList.querySelectorAll('[role="tab"]').forEach((btn) => {
        btn.setAttribute('aria-selected', 'false');
        btn.classList.remove('is-active');
      });
      tabContent.querySelectorAll('[role="tabpanel"]').forEach((p) => {
        p.setAttribute('aria-hidden', 'true');
      });
      button.setAttribute('aria-selected', 'true');
      button.classList.add('is-active');
      const panelId = button.getAttribute('aria-controls');
      const panel = tabContent.querySelector(`#${panelId}`);
      if (panel) panel.setAttribute('aria-hidden', 'false');
    });
  });
}

function splitByHeadings(container) {
  const columns = [];
  let current = null;
  [...container.children].forEach((el) => {
    if (el.tagName === 'H3') {
      current = document.createElement('div');
      current.className = 'process-column';
      current.append(el);
      columns.push(current);
    } else if (current) {
      current.append(el);
    }
  });
  return columns;
}

function decorateInline(block) {
  const isProcess = block.classList.contains('process') || block.classList.contains('(process)');
  if (isProcess) block.classList.add('process');
  const rows = [...block.children];
  if (!rows.length) return;

  const tabList = document.createElement('div');
  tabList.className = 'tabs-list';
  tabList.setAttribute('role', 'tablist');

  const tabContent = document.createElement('div');
  tabContent.className = 'tabs-content';

  rows.forEach((row, idx) => {
    const cols = [...row.children];
    const titleCol = cols[0];
    const contentCol = cols[1];
    const title = titleCol?.textContent?.trim() || `Tab ${idx + 1}`;
    const id = toClassName(title);

    const button = document.createElement('button');
    button.className = 'tabs-tab';
    button.type = 'button';
    button.role = 'tab';
    button.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
    button.setAttribute('aria-controls', `panel-${id}`);
    if (idx === 0) button.classList.add('is-active');
    button.textContent = title;

    const panel = document.createElement('div');
    panel.className = 'tab';
    panel.id = `panel-${id}`;
    panel.role = 'tabpanel';
    panel.setAttribute('aria-labelledby', button.id);
    panel.setAttribute('aria-hidden', idx === 0 ? 'false' : 'true');
    if (contentCol) panel.append(...contentCol.children);

    if (isProcess) {
      const hr = panel.querySelector('hr');
      let afterContent = null;
      if (hr) {
        afterContent = document.createElement('div');
        afterContent.className = 'tab-insights';
        let sibling = hr.nextElementSibling;
        while (sibling) {
          const next = sibling.nextElementSibling;
          afterContent.append(sibling);
          sibling = next;
        }
        hr.remove();
      }

      const columns = splitByHeadings(panel);
      if (columns.length > 1) {
        const grid = document.createElement('div');
        grid.className = 'process-grid';
        columns.forEach((col, colIdx) => {
          const icon = document.createElement('img');
          icon.src = `/icons/workflow-${colIdx + 1}.svg`;
          icon.alt = `Step ${colIdx + 1}`;
          icon.className = 'process-step-icon';
          icon.width = 48;
          icon.height = 48;
          col.prepend(icon);
          grid.append(col);
        });
        panel.replaceChildren(grid);
      }

      if (afterContent) {
        const cards = [];
        let currentCard = null;
        [...afterContent.children].forEach((el) => {
          if (el.tagName === 'H4') return;
          const hasPicture = el.querySelector('picture');
          const hasStrongLink = el.querySelector('strong a');
          if (hasPicture || hasStrongLink) {
            if (hasPicture) {
              currentCard = document.createElement('div');
              currentCard.className = 'insight-card';
              currentCard.append(el);
              cards.push(currentCard);
            } else if (hasStrongLink && currentCard) {
              currentCard.append(el);
            } else if (hasStrongLink) {
              currentCard = document.createElement('div');
              currentCard.className = 'insight-card';
              currentCard.append(el);
              cards.push(currentCard);
            }
          } else if (currentCard) {
            currentCard.append(el);
          }
        });
        const heading = afterContent.querySelector('h4');
        afterContent.replaceChildren();
        if (heading) afterContent.append(heading);
        cards.forEach((card) => afterContent.append(card));
        panel.append(afterContent);
      }
    }

    tabList.append(button);
    tabContent.append(panel);
  });

  block.replaceChildren(tabList, tabContent);
  buildTabSwitching(tabList, tabContent);
}

export default function decorate(block) {
  const rows = [...block.children];
  const isInline = rows.length > 0 && rows[0].children.length === 2
    && rows[0].children[0].querySelector('p')
    && !rows[0].closest('[data-tab-id]');

  if (isInline) {
    decorateInline(block);
    return;
  }

  const currSection = block.closest('.section');
  if (!currSection) return;

  const tabDefs = collectTabSections(currSection);
  if (!tabDefs.length) return;

  currSection.classList.add('tabs');
  tabDefs.forEach((def) => def.section.classList.remove('tabs'));

  const tabsUI = buildTabsUI(tabDefs, currSection, currSection.id || '');
  block.replaceChildren(tabsUI);
}

export async function createTabs(main) {
  if (!main) return;
  if (!tabsStyleLoaded) {
    tabsStyleLoaded = loadCSS(`${window.hlx.codeBasePath}/blocks/tabs/tabs.css`);
  }
  await tabsStyleLoaded;
  const tabGroups = findTabGroups(main);
  tabGroups.forEach((group) => buildTabsFromSections(group));
}
