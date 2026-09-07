import { useState } from "react";
import { SparkLayer } from "./effects/SparkLayer";
import { Chronik } from "./components/Chronik";
import { Destinations } from "./components/Destinations";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Manifest } from "./components/Manifest";
import { Masthead } from "./components/Masthead";
import { Numbers } from "./components/Numbers";
import { Petition } from "./components/Petition";
import { Preloader } from "./components/Preloader";
import { Reasons } from "./components/Reasons";
import { Voices } from "./components/Voices";

export default function App() {
  // Der Hero startet erst, wenn der Vorhang der Ladeanimation läuft.
  const [ready, setReady] = useState(false);

  return (
    <div className="page" id="top">
      <a className="skip-link" href="#inhalt">
        Zum Inhalt springen
      </a>

      <Preloader onDone={() => setReady(true)} />

      <SparkLayer />
      <Masthead />

      <main id="inhalt">
        <Hero ready={ready} />
        <Reasons />
        <Numbers />
        <Chronik />
        <Destinations />
        <Voices />
        <Manifest />
        <Petition />
      </main>

      <Footer />
    </div>
  );
}
