/* Contact: the enquiry form opens the visitor's email app with the details filled in. */
(function () {
  var TO = 'tijaniuthmanbooks@gmail.com';
  document.querySelectorAll('[data-mail]').forEach(function (a) {
    a.href = 'mailto:' + TO;
    if (a.hasAttribute('data-show')) { a.textContent = TO; }
  });
  document.querySelectorAll('form[data-enquiry]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var g = function (n) { var el = f.elements[n]; return el ? el.value.trim() : ''; };
      var body = ['Name: ' + g('name'), 'Email: ' + g('email'), 'Service: ' + g('service'),
        'Book title and genre: ' + g('book'), '', g('message')].join('\n');
      var subject = 'Enquiry: ' + (g('service') || 'Kindle listing') + ' (' + g('name') + ')';
      window.location.href = 'mailto:' + TO + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      var ok = f.querySelector('.sent'); if (ok) { ok.hidden = false; }
    });
  });
})();
