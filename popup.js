(function () {
  var STORAGE_KEY = 'buttondown_subscribed';
  var SHOW_DELAY = 4000;

  if (localStorage.getItem(STORAGE_KEY)) return;

  var overlay = document.createElement('div');
  overlay.className = 'email-popup-overlay';
  overlay.id = 'email-popup-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.innerHTML =
    '<div class="email-popup" id="email-popup">' +
      '<button class="email-popup-close" id="email-popup-close" aria-label="Close">&#x2715;</button>' +
      '<p class="email-popup-eyebrow">Chamber Logs</p>' +
      '<h2 class="email-popup-heading">Get new posts by email.</h2>' +
      '<form class="email-form email-popup-form" id="email-popup-form">' +
        '<input type="email" name="email" placeholder="your@email.com" class="email-input" required />' +
        '<button type="submit" class="email-submit">Subscribe</button>' +
      '</form>' +
      '<p class="email-popup-note">Already subscribed? No worries — just close this.</p>' +
    '</div>';
  document.body.appendChild(overlay);

  var popup = document.getElementById('email-popup');
  var closeBtn = document.getElementById('email-popup-close');
  var form = document.getElementById('email-popup-form');

  var footerForm = document.querySelector('.email-capture form');
  var buttondownUrl = footerForm ? footerForm.getAttribute('action') : null;

  function showPopup() {
    overlay.classList.add('open');
  }

  function closePopup() {
    overlay.classList.remove('open');
  }

  closeBtn.addEventListener('click', closePopup);

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closePopup();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePopup();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = form.querySelector('input[type="email"]').value;

    localStorage.setItem(STORAGE_KEY, '1');

    if (buttondownUrl && buttondownUrl.indexOf('buttondown') !== -1) {
      var data = new FormData();
      data.append('email', email);
      fetch(buttondownUrl, { method: 'POST', body: data }).catch(function () {});
    }

    popup.innerHTML = '<p class="email-popup-success">You\'re in. New posts will find you.</p>';
    setTimeout(closePopup, 2200);
  });

  var triggered = false;
  function trigger() {
    if (triggered) return;
    triggered = true;
    window.removeEventListener('scroll', onScroll);
    showPopup();
  }

  function onScroll() {
    if (window.scrollY > 100) trigger();
  }

  window.addEventListener('scroll', onScroll);
  setTimeout(trigger, SHOW_DELAY);
})();
