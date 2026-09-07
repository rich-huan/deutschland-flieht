/* ===========================================================================
 * Shader der 3D-Deutschlandfahne
 *
 * Die Fahne ist kein flaches Rechteck, sondern ein langes, in sich verdrehtes
 * Tuch, das diagonal ueber die gesamte Breite zieht und an beiden Raendern
 * aus dem Bild laeuft — wie das Tuch in der Referenzvorlage.
 *
 * Die Form entsteht komplett im Vertexshader aus den uv-Koordinaten:
 *   uv.x  Laufrichtung des Bandes (0 = linkes Ende, 1 = rechtes Ende)
 *   uv.y  Querrichtung (0 = Unterkante, 1 = Oberkante)
 *
 * Der Zustand haengt an genau einer Groesse: `uDirty` (0 bis 1), gesteuert
 * vom Scroll-Fortschritt.
 *   uDirty = 0   sauberes Tuch
 *   uDirty = 1   verdreckt, ausgeblichen, ausgefranst, durchloechert
 * ========================================================================= */

export const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uDirty;
  uniform float uLength;
  uniform float uWidth;

  varying vec2  vUv;
  varying vec3  vNormal;
  varying vec3  vTangent;
  varying vec3  vBlick;
  varying float vTwist;

  /* Punkt des Bandes zu gegebenen uv-Koordinaten.
     Mittellinie + um die Laengsachse verdrehte Querrichtung. */
  vec3 punkt(vec2 uv) {
    float t = uv.x;
    float v = uv.y - 0.5;
    float zeit = uTime;

    /* --- Mittellinie ----------------------------------------------------
       Zwei ueberlagerte Schwingungen in Hoehe und Tiefe. Die langsamere
       gibt den grossen Schwung, die schnellere den Stoffcharakter. */
    float x = (t - 0.5) * uLength;
    float y = sin(t * 6.6 + zeit * 0.85) * 0.62
            + sin(t * 14.5 - zeit * 1.35) * 0.16;
    float z = cos(t * 5.0 - zeit * 1.05) * 0.80
            + sin(t * 11.3 + zeit * 0.70) * 0.20;

    /* --- Verdrehung um die Laengsachse -----------------------------------
       Das ist der entscheidende Unterschied zum flachen Rechteck: die
       Querrichtung rotiert entlang des Bandes, dadurch dreht sich das Tuch
       in sich und zeigt abwechselnd Vorder- und Rueckseite.

       Die beiden Frequenzen sind bewusst unharmonisch (3.1 zu 1.37): bei
       ganzzahligen Verhaeltnissen entstehen zwei symmetrische Kniffe links
       und rechts der Mitte, und das Band sieht aus wie eine Schleife statt
       wie ein wehendes Tuch. */
    /* Die Amplitude bleibt bewusst unter 90 Grad: kippt das Band ganz auf
       die Kante, verschwindet es dort zu einer Linie und sieht aus, als
       waere es zusammengekniffen. So bleibt immer die Flaeche sichtbar,
       nur unterschiedlich stark geneigt. */
    float twist = sin(t * 6.0 - zeit * 0.95) * 0.78
                + sin(t * 2.65 + zeit * 0.52) * 0.42;

    /* Ein verschlissenes Tuch haengt schwerer und dreht sich unruhiger. */
    twist *= 1.0 + uDirty * 0.30;

    /* --- Breite ----------------------------------------------------------
       Nahezu konstant. Eine Verjuengung zu den Enden macht aus dem Banner
       eine spitze Blattform; das Band soll aber am Bildrand abgeschnitten
       wirken, nicht dort auslaufen. Die minimale Schwankung nimmt der Kante
       nur die maschinelle Geradheit. */
    float taper = 1.0 - 0.06 * sin(t * 2.3 + zeit * 0.4);
    float w = uWidth * taper;

    vec3 quer = vec3(0.0, cos(twist), sin(twist)) * (v * w);

    return vec3(x, y, z) + quer;
  }

  void main() {
    vUv = uv;

    vec3 pos = punkt(uv);

    /* Normale ueber finite Differenzen. Bei dieser Kombination aus
       Mittellinie und Verdrehung waere die analytische Ableitung unnoetig
       fehleranfaellig. */
    float e = 0.004;
    vec3 dx = punkt(uv + vec2(e, 0.0)) - pos;
    vec3 dy = punkt(uv + vec2(0.0, e)) - pos;
    vNormal = normalize(normalMatrix * normalize(cross(dx, dy)));

    /* Faserrichtung des Gewebes: laengs des Bandes. Sie bestimmt, in
       welche Richtung der Glanz auslaeuft — genau das unterscheidet Satin
       von einer matten Flaeche. */
    vTangent = normalize(normalMatrix * normalize(dx));

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vBlick = normalize(-mv.xyz);

    vTwist = sin(uv.x * 4.6 - uTime * 0.95);

    gl_Position = projectionMatrix * mv;
  }
`;

export const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform float uDirty;
  uniform vec3  uSchwarz;
  uniform vec3  uRot;
  uniform vec3  uGold;

  varying vec2  vUv;
  varying vec3  vNormal;
  varying vec3  vTangent;
  varying vec3  vBlick;
  varying float vTwist;

  /* --- Rauschen ---------------------------------------------------------- */

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    /* --- Schwarz-Rot-Gold ------------------------------------------------
       Die Streifen laufen laengs durch das Band. uv.y = 1 ist oben, also
       von oben nach unten: Schwarz, Rot, Gold. */
    float y = vUv.y;
    vec3 farbe = uGold;
    farbe = mix(farbe, uRot, smoothstep(0.330, 0.337, y));
    farbe = mix(farbe, uSchwarz, smoothstep(0.663, 0.670, y));

    /* --- Gewebe -----------------------------------------------------------
       Feine Koernung in Kett- und Schussrichtung. Das Band ist lang,
       deshalb laengs deutlich hoeher aufgeloest. */
    float kette = noise(vUv * vec2(1400.0, 6.0));
    float schuss = noise(vUv * vec2(6.0, 260.0));
    farbe *= 0.95 + 0.05 * (kette + schuss);

    /* --- Normale mit feinen Falten ----------------------------------------
       Die grosse Wellenform kommt aus dem Vertexshader; hier kommen nur
       die feinen Zuege dazu.

       Entscheidend ist die Form des Rauschens: stark laengs gestreckt
       (Faktor 900 zu 7), sodass duenne, in Faserrichtung verlaufende Zuege
       entstehen. Isotropes Rauschen wuerde runde Flecken erzeugen und die
       Fahne wie ein Tarnmuster aussehen lassen. Die Staerke ist bewusst
       klein — der Glanz soll die Falten zeigen, nicht die Farbe. */
    vec3 n = normalize(vNormal);
    vec3 t = normalize(vTangent);
    if (!gl_FrontFacing) {
      n = -n;
    }
    vec3 bt = normalize(cross(n, t));

    vec2 fs = vec2(900.0, 7.0);
    float e = 0.0016;
    float h0 = fbm(vUv * fs);
    float hx = fbm((vUv + vec2(e, 0.0)) * fs);
    float hy = fbm((vUv + vec2(0.0, e)) * fs);
    n = normalize(n - t * (hx - h0) * 1.1 - bt * (hy - h0) * 2.6);

    /* --- Licht ------------------------------------------------------------ */
    vec3 licht = normalize(vec3(-0.30, 0.62, 0.72));
    vec3 blick = normalize(vBlick);

    /* Stoff streut das Licht in die Tiefe, deshalb ein teilweise
       umgeschlagenes Diffuslicht statt eines harten Terminators. */
    float ndl = dot(n, licht);
    float diffus = mix(max(ndl, 0.0), ndl * 0.5 + 0.5, 0.5);
    float gegen = max(dot(n, normalize(vec3(0.55, -0.35, -0.55))), 0.0);

    /* --- Anisotroper Glanz (Kajiya-Kay) ------------------------------------
       Der entscheidende Punkt fuer glaenzenden Stoff: der Glanz eines
       Gewebes ist nicht rund wie bei Kunststoff, sondern laeuft quer zur
       Faserrichtung in Baendern aus. Genau das macht Satin und Seide
       erkennbar. Dazu ein zweites, breites Band fuer den weichen Schimmer. */
    float tl = dot(t, licht);
    float tv = dot(t, blick);
    float sinTL = sqrt(max(0.0, 1.0 - tl * tl));
    float sinTV = sqrt(max(0.0, 1.0 - tv * tv));
    float basis = max(0.0, sinTL * sinTV - tl * tv);

    float glanzScharf = pow(basis, 34.0);
    float glanzWeich = pow(basis, 7.0);

    /* --- Fresnel ----------------------------------------------------------
       Flach angeschnittener Stoff wirft mehr Licht zurueck. Das gibt dem
       Tuch den seidigen Saum an den weglaufenden Kanten. */
    float fresnel = pow(1.0 - max(dot(n, blick), 0.0), 4.0);

    /* Verschlissener Stoff verliert seinen Glanz — er wird stumpf. */
    float glanzstaerke = 1.0 - uDirty * 0.75;

    /* Sehr zurueckhaltende Verdeckung in den Zuegen. Mehr als das erzeugt
       sichtbare Flecken auf der Flaeche. */
    float ao = mix(0.95, 1.03, h0);

    farbe *= (0.34 + 0.72 * diffus + 0.16 * gegen) * ao;

    vec3 glanzfarbe = mix(vec3(1.0, 0.97, 0.92), farbe * 2.2, 0.4);
    farbe += glanzfarbe * (glanzScharf * 0.85 + glanzWeich * 0.28) * glanzstaerke;
    farbe += vec3(0.62, 0.60, 0.55) * fresnel * 0.22 * glanzstaerke;

    /* Die Rueckseite eines Tuchs ist matter und dunkler — sichtbar
       ueberall dort, wo sich das Band in sich dreht. */
    if (!gl_FrontFacing) {
      farbe *= 0.68;
    }

    /* --- Verschmutzung ----------------------------------------------------
       Grossflaechige Verschmutzung plus feinere Flecken. Das Band ist lang,
       deshalb laengs gestreckt abgetastet. */
    float dreckGrob = fbm(vUv * vec2(9.0, 3.2));
    float dreckFein = fbm(vUv * vec2(28.0, 11.0) + 4.0);

    /* Dosierung: genug, dass die Verschmutzung deutlich sichtbar ist, aber
       nicht so viel, dass Schwarz-Rot-Gold am Ende nicht mehr erkennbar
       waere — die Fahne muss bis zuletzt lesbar bleiben. */
    vec3 dreckton = vec3(0.19, 0.17, 0.13);
    farbe = mix(farbe, dreckton, uDirty * 0.44 * dreckGrob);
    farbe *= 1.0 - uDirty * 0.20 * dreckFein;

    /* Ausbleichen: mit zunehmendem Verschleiss verliert der Stoff Farbe. */
    float luma = dot(farbe, vec3(0.299, 0.587, 0.114));
    farbe = mix(farbe, vec3(luma), uDirty * 0.40);

    /* --- Loecher ----------------------------------------------------------
       Ein langes Banner verschleisst an den Laengskanten zuerst, dazu
       vereinzelte Loecher in der Flaeche. Bewusst zurueckhaltend dosiert:
       am Ende soll eine dreckige, loechrige, aber unverkennbare
       Deutschlandfahne stehen — kein aufgeloester Fetzen. */
    float loch = fbm(vUv * vec2(16.0, 5.5) + 13.0);
    float rand = smoothstep(0.34, 0.5, abs(vUv.y - 0.5));
    float schwelle = uDirty * 0.40 * (0.48 + rand * 0.95);

    if (loch < schwelle) {
      discard;
    }

    /* Ausgefranster, dunkler Saum um jedes Loch und an den Kanten. */
    float saum = smoothstep(schwelle, schwelle + 0.075, loch);
    farbe = mix(farbe * 0.32, farbe, saum);

    /* Leicht transparent: das Band bleibt ein Bildelement und kein Deckel.
       Lettern und Lichtraum scheinen schwach durch, dadurch sitzt die Fahne
       in der Szene statt davor. An den Kanten etwas durchsichtiger als in
       der Mitte — so wirkt der Stoff duenn statt wie Folie. */
    float rand2 = smoothstep(0.5, 0.24, abs(vUv.y - 0.5));
    float alpha = mix(0.80, 0.93, rand2);

    gl_FragColor = vec4(farbe, alpha);
  }
`;
