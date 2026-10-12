/*
 * El salto a la tienda.
 *
 * Esta página es la que se enlaza desde fuera —un mensaje, un foro, lo que cita
 * un asistente— en vez de la ficha de una tienda: quien la abre desde un móvil
 * salta a la suya, y quien no tiene tienda ve la página.
 *
 * Se carga en la cabecera y sin `defer`, para saltar antes de pintar. La vista
 * previa de WhatsApp no ejecuta JavaScript: lee las etiquetas `og:` y se queda
 * ahí, que es justo lo que hace falta.
 *
 * Es el mismo script que el de EL TOP JOHN (`eltopjohn.github.io`), sin lo del
 * idioma —esta página solo está en español— y sin el contador de visitas.
 */
(function () {
  /*
   * `live` es el interruptor de cada tienda. Con `false` nadie salta a ella y
   * su botón se apaga y dice «muy pronto»: es lo que se toca si la app deja de
   * estar publicada en una.
   */
  var STORES = {
    ios: {
      live: true,
      // Con país: en la App Store solo está publicada en la de España.
      url: 'https://apps.apple.com/es/app/id6769114236',
    },
    android: {
      live: true,
      url: 'https://play.google.com/store/apps/details?id=com.gestiamigos.melajuego',
    },
  };

  var params = new URLSearchParams(location.search);
  var ua = navigator.userAgent || '';

  // --- Robots ---
  // Un buscador lee la página con un navegador de verdad que se presenta como
  // un móvil Android (Googlebot y Bingbot lo hacen). Sin esto saltaría a Google
  // Play como cualquier teléfono y apuntaría la página como una redirección: no
  // la indexaría nunca. A un robot no se le mueve de donde ha entrado.
  //
  // `bot/` y no `bot` a secas: hay móviles de marca Cubot, y su dueño sí salta.
  var robot =
    /bot\/|crawler|spider|headlesschrome|lighthouse|google-inspectiontool|googleother|adsbot|bingpreview|chatgpt-user|perplexity-user|claude-user|facebookexternalhit/i.test(ua) ||
    navigator.webdriver === true;

  // --- De dónde viene la visita ---
  // `?c=reddit` en los enlaces que ponemos nosotros, o el `utm_source` que
  // añaden por su cuenta sitios como ChatGPT. Sin nada es `enlace`. Viaja en
  // `referrer`, que es lo que enseña Play Console en «Adquisición»; la App
  // Store no tiene nada parecido que sirva con pocas descargas.
  var channel = (params.get('c') || params.get('utm_source') || '').toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 40) || 'enlace';
  STORES.android.url += '&referrer=' + encodeURIComponent('utm_source=' + channel);

  // El iPad se presenta como un Mac desde iPadOS 13; lo delata la pantalla táctil.
  var os = /Android/i.test(ua)
    ? 'android'
    : /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
      ? 'ios'
      : 'other';

  // `?stay` deja ver la página desde un móvil que saltaría: para probarla.
  // `replace` y no `href`, o el botón de atrás devolvería aquí y saltaría otra vez.
  var store = STORES[os];
  if (store && store.live && !params.has('stay') && !robot) location.replace(store.url);

  // --- Lo que necesita el DOM cargado ---
  document.addEventListener('DOMContentLoaded', function () {
    // El enlace que vale es el de aquí, que lleva de dónde viene la visita. Y
    // un `<a>` sin `href` no es un enlace: así se apaga el de una tienda en la
    // que la app no está.
    Array.prototype.forEach.call(document.querySelectorAll('[data-store]'), function (el) {
      var s = STORES[el.getAttribute('data-store')];
      if (!s) return;
      if (s.live) {
        el.setAttribute('href', s.url);
        return;
      }
      el.removeAttribute('href');
      el.classList.add('soon');
      var label = el.querySelector('small');
      if (label) label.textContent = 'Muy pronto en';
    });
  });
})();
