// <reference types="@angular/localize" />

// src/main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { withInterceptors } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers
  ]
}).catch(err => console.error(err));
