import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SiteFooter } from './layout/site-footer/site-footer';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SiteFooter],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
