# La página de MeLaJuego

Servida con **GitHub Pages** en `https://melajuego.github.io/`. Es el enlace
que se pone fuera —un mensaje, un foro, un correo a prensa— en vez de la ficha
de una tienda, y lo que leen los buscadores y los asistentes cuando alguien
pregunta por un juego así. El repo se llama `melajuego.github.io` dentro de la
organización `melajuego` a propósito: es el único nombre que Pages sirve en la
raíz.

## Por qué existe

En octubre de 2026, al mirar de dónde venían las descargas en la App Store, 11
de 40 llegaban desde ChatGPT, sin haber hecho nada: era la segunda fuente,
detrás de la búsqueda de la propia tienda. Un asistente no ordena por
valoraciones ni por descargas, que es donde una app pequeña pierde siempre: casa
lo que le preguntan con lo que lee. Hasta ahora solo podía leer la ficha de la
tienda; esta página le dice lo mismo con frases que se entienden solas, y manda
a cada móvil a su tienda.

Es hermana de la de EL TOP JOHN (`eltopjohn/eltopjohn.github.io`) y está hecha
igual. Dos diferencias: esta solo está en español, así que es un `index.html`
escrito a mano y no sale de una plantilla; y **no cuenta visitas** (ver más
abajo).

## Qué hay

| Fichero | Para qué |
| --- | --- |
| `index.html` | La página. |
| `assets/go.js` | El salto a la tienda y de dónde viene la visita. |
| `assets/styles.css` | Los colores de la app. Sin fuentes de fuera. |
| `assets/og.jpg` | La imagen de la vista previa (1200 × 630). |
| `assets/shot-*.jpg` | Tres capturas de la ficha de la tienda, a 600 px. |
| `assets/icon-512.png` | El icono de la app. De él salen `icon-180.png` y `favicon.png`. |
| `tools/imagenes.js` | Rehace la vista previa y los iconos pequeños. |
| `sitemap.xml`, `robots.txt` | Para los buscadores. |
| `e116…c61e.txt` | La clave de IndexNow, para avisar a Bing. |
| `.nojekyll` | Que Pages sirva los ficheros tal cual. |

## De dónde sale lo que dice

De la ficha pública de las tiendas: el texto, las capturas y el icono. El repo
del juego no estaba en la máquina donde se montó esto, así que **nada se
actualiza solo**: si cambian las categorías, el número de preguntas, cuántos
pueden jugar o lo que es gratis, se cambia aquí a mano, en `index.html` (en el
texto y en los datos estructurados de la cabecera, que dicen lo mismo).

## Lo que hay que tocar

**1. La dirección, solo si la web se muda.** `https://melajuego.github.io` va
escrita en `index.html`, `sitemap.xml` y `robots.txt`.

**2. `live`, si la app deja de estar en una tienda.** En `assets/go.js`. Con
`false`, nadie salta a esa tienda y su botón se apaga y dice «muy pronto».

**3. El enlace de la App Store, si se publica fuera de España.** Hoy lleva el
país (`/es/`) porque la app solo está en la tienda española: sin él, quien lo
abre desde otro país —o un buscador— se encuentra una página que no existe. Si
se abre a más países, se quita y Apple manda a cada uno a la suya.

## De dónde viene cada visita

Cualquier enlace que pongamos nosotros lleva `?c=` con el sitio:

```
https://melajuego.github.io/?c=reddit
```

`go.js` se lo pasa a Google Play en `referrer`, y sale en Play Console, en
«Adquisición». Sin `?c=` cuenta como `enlace`. Si la visita trae un
`utm_source` —ChatGPT se lo pone a los enlaces que cita—, vale igual.

**La página no cuenta visitas por su cuenta.** La de EL TOP JOHN sí: apunta
cada una en su base de datos, sin cookie ni identificador, porque la App Store
no desglosa una fuente hasta que junta un mínimo de descargas. Aquí falta lo
primero, que es decirlo en la política de privacidad
(`carcanye.github.io/privacy-melajuego`). Cuando esté dicho, es copiar la tabla
y el trozo de `go.js` de allí.

## Buscadores y asistentes

- **A un robot no se le mueve.** Googlebot y Bingbot leen la página con un
  navegador que se presenta como un móvil Android: si saltaran a la tienda como
  cualquier teléfono, apuntarían la página como una redirección. `go.js` los
  reconoce y los deja donde han entrado.
- **Datos estructurados** en la cabecera: qué es, cuántos juegan, dónde se
  instala y que es gratis.
- **Las preguntas frecuentes** están escritas para que cada respuesta se
  entienda sola, que es como la copia un asistente.

Una página nueva sin nadie que la enlace puede tardar semanas en aparecer. Tras
publicar un cambio que importe:

```bash
curl "https://api.indexnow.org/indexnow?url=https://melajuego.github.io/&key=e116690ba19c47eacc7b528f9929c61e"
```

Eso avisa a Bing, que por lo que se ha medido desde fuera es de donde más tira
ChatGPT (OpenAI no lo documenta). Google no lo escucha: ahí hay que dar de alta
la página en Search Console (propiedad de «prefijo de URL», verificada con la
etiqueta `<meta>` que te da, pegada en la cabecera de `index.html`) y mandarle
`sitemap.xml`. En Bing Webmaster Tools se puede importar de Search Console, y es
donde se ve si la ha indexado.

## Probarla

```bash
python3 -m http.server 8000
```

Desde un móvil con tienda, la página salta nada más abrirse. Para verla sin que
salte, `?stay`: `http://…/?stay`.

La vista previa solo se puede probar publicada. WhatsApp la guarda por enlace:
si cambias la imagen y sigue saliendo la vieja, añade algo al final (`/?v=2`)
para forzar que la vuelva a leer.

## Publicarla

Subir a `main`. En `Settings` → `Pages` tiene que estar *Deploy from a branch*,
**main**, carpeta **/ (root)**.

## Rehacer las imágenes

Cuando cambie el icono o el lema:

```bash
node tools/imagenes.js
```

Necesita `playwright-core` con un Chromium. En la máquina de desarrollo no hay
navegador: vale el que monta `scripts/store-screenshots/setup.sh` del repo de
EL TOP JOHN, cargando antes su `env.sh`.
