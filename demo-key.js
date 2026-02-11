// CUCU API Docs — Demo Key Injector
// Replaces YOUR_API_KEY placeholders with a real sandbox demo key at runtime.
// The key is NOT in the MDX files (not in git as visible text).
// Future: fetch rotating key from /api/v1/public/demo-key endpoint.
(function () {
  if (typeof window === 'undefined') return;

  // Demo sandbox key — single source of truth, not scattered across 34 MDX files.
  // TODO: Replace with fetch('https://sandbox.cucu.bo/api/v1/public/demo-key')
  // when the Quarkus rotating key endpoint is implemented.
  var DEMO_KEY = 'sk_test_MuLfItnPAScdhgrOsYn6Y4ur_gdMfCSMXtLciK9P8S8';
  var PLACEHOLDER = 'YOUR_API_KEY';

  function inject() {
    // Find all code elements and replace placeholders
    var codes = document.querySelectorAll('code, pre');
    for (var i = 0; i < codes.length; i++) {
      var el = codes[i];
      if (el.textContent.indexOf(PLACEHOLDER) !== -1) {
        // Walk text nodes to preserve syntax highlighting
        var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
        var node;
        while ((node = walker.nextNode())) {
          if (node.nodeValue.indexOf(PLACEHOLDER) !== -1) {
            node.nodeValue = node.nodeValue.split(PLACEHOLDER).join(DEMO_KEY);
          }
        }
      }
    }
  }

  // Run on page load and on Mintlify's SPA navigation (content changes)
  function setup() {
    inject();

    // Re-inject after Mintlify SPA navigations (DOM mutations)
    var observer = new MutationObserver(function (mutations) {
      var shouldInject = false;
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].addedNodes.length > 0) { shouldInject = true; break; }
      }
      if (shouldInject) {
        // Debounce: wait for Mintlify to finish rendering
        clearTimeout(setup._t);
        setup._t = setTimeout(inject, 200);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
