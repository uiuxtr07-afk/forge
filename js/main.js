/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const horizontalTabsQuery = window.matchMedia('(max-width: 1024px)');

  /* ── Service link toast ── */
  function initToast() {
    const toast = document.getElementById('service-toast');
    const toastName = document.getElementById('toast-service-name');
    const serviceLinks = document.querySelectorAll('.service-link');
    let toastTimer = null;

    if (!toast || !toastName) return;

    function hideToast() {
      toast.hidden = true;
    }

    function showToast(serviceName) {
      if (toastTimer) clearTimeout(toastTimer);

      toastName.textContent = serviceName;
      toast.hidden = false;

      toastTimer = setTimeout(hideToast, 3000);
    }

    serviceLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        showToast(link.dataset.service || 'Service');
      });
    });

    toast.addEventListener('click', hideToast);
  }

  /* ── Scroll-sync section ── */
  function initScrollSync() {
    const tabList = document.getElementById('scroll-sync-tabs');
    const tabs = Array.from(document.querySelectorAll('.scroll-sync-section__tab'));
    const panels = Array.from(document.querySelectorAll('.scroll-sync-section__block'));

    if (!tabList || tabs.length === 0 || panels.length === 0) return;

    let activeIndex = 0;
    let isProgrammaticScroll = false;
    let scrollUnlockTimer = null;
    const visibleRatios = new Map();

    function isHorizontalTabs() {
      return horizontalTabsQuery.matches;
    }

    function updateTabListOrientation() {
      tabList.setAttribute('aria-orientation', isHorizontalTabs() ? 'horizontal' : 'vertical');
    }

    function setActiveTab(index) {
      activeIndex = index;
      const activeTheme = tabs[index]?.dataset.theme;

      tabs.forEach((tab, i) => {
        const isActive = i === index;
        tab.classList.toggle('scroll-sync-section__tab--active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
      });

      if (activeTheme) {
        tabList.closest('.scroll-sync-section')?.setAttribute('data-active-theme', activeTheme);
      }

      const activeTab = tabs[index];
      if (!activeTab) return;

      const tabListRect = tabList.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();

      if (tabRect.left < tabListRect.left || tabRect.right > tabListRect.right) {
        activeTab.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }

    function scrollToSection(index) {
      const panel = panels[index];
      if (!panel) return;

      setActiveTab(index);
      isProgrammaticScroll = true;

      panel.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });

      if (scrollUnlockTimer) clearTimeout(scrollUnlockTimer);
      scrollUnlockTimer = setTimeout(
        () => {
          isProgrammaticScroll = false;
        },
        prefersReducedMotion ? 0 : 900,
      );
    }

    function handleTabKeyDown(event, index) {
      let nextIndex = index;

      switch (event.key) {
        case 'ArrowDown':
          if (!isHorizontalTabs()) {
            event.preventDefault();
            nextIndex = (index + 1) % tabs.length;
          }
          break;
        case 'ArrowRight':
          if (isHorizontalTabs()) {
            event.preventDefault();
            nextIndex = (index + 1) % tabs.length;
          }
          break;
        case 'ArrowUp':
          if (!isHorizontalTabs()) {
            event.preventDefault();
            nextIndex = (index - 1 + tabs.length) % tabs.length;
          }
          break;
        case 'ArrowLeft':
          if (isHorizontalTabs()) {
            event.preventDefault();
            nextIndex = (index - 1 + tabs.length) % tabs.length;
          }
          break;
        case 'Home':
          event.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          nextIndex = tabs.length - 1;
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          scrollToSection(index);
          return;
        default:
          return;
      }

      if (nextIndex !== index) {
        tabs[nextIndex].focus();
      }
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => scrollToSection(index));
      tab.addEventListener('keydown', (event) => handleTabKeyDown(event, index));
    });

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll) return;

        entries.forEach((entry) => {
          const index = panels.indexOf(entry.target);
          if (index === -1) return;

          if (entry.isIntersecting) {
            visibleRatios.set(index, entry.intersectionRatio);
          } else {
            visibleRatios.delete(index);
          }
        });

        if (visibleRatios.size === 0) return;

        let bestIndex = 0;
        let bestRatio = -1;

        visibleRatios.forEach((ratio, index) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestIndex = index;
          }
        });

        if (bestRatio >= 0.5) {
          setActiveTab(bestIndex);
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '-20% 0px -20% 0px',
      },
    );

    panels.forEach((panel) => observer.observe(panel));

    setActiveTab(0);
    updateTabListOrientation();
    horizontalTabsQuery.addEventListener('change', updateTabListOrientation);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initToast();
    initScrollSync();
  });
})();
