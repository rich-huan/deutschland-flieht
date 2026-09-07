import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Deutschland flieht. — Ein digitales Mahnmal',
    loadComponent: () => import('./pages/landing/landing').then((m) => m.Landing),
  },
  {
    path: 'petition',
    title: 'Petition unterschreiben — Deutschland flieht.',
    loadComponent: () => import('./pages/petition/petition-page').then((m) => m.PetitionPage),
  },
  {
    /* Impressum und Datenschutz sind vor dem Livegang Pflicht.
       Bis dahin fuehren die Footer-Links auf eine ehrliche Platzhalterseite,
       statt ins Leere zu laufen. */
    path: 'impressum',
    title: 'Impressum — Deutschland flieht.',
    loadComponent: () => import('./pages/rechtstext/rechtstext').then((m) => m.Rechtstext),
    data: { art: 'impressum' },
  },
  {
    path: 'datenschutz',
    title: 'Datenschutz — Deutschland flieht.',
    loadComponent: () => import('./pages/rechtstext/rechtstext').then((m) => m.Rechtstext),
    data: { art: 'datenschutz' },
  },
  { path: '**', redirectTo: '' },
];
