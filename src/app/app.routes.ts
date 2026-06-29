import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';
import { ClassificationComponent } from './features/analysis/classification/classification.component';
import { HistoryComponent } from './features/history/history.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { SummarizationComponent } from './features/analysis/summarization/summarization.component';
import { FinancialPdfComponent } from './features/analysis/financial-pdf/financial-pdf.component';
import { AskDocumentComponent } from './features/analysis/ask-document/ask-document.component';
import { ProfileComponent } from './features/profile/profile.component';
import { FinancialTextComponent } from './features/analysis/financial-text/financial-text.component';
import { ExtractionComponent } from './features/analysis/extraction/extraction.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'classification', component: ClassificationComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'analysis/summarization', component: SummarizationComponent },
      { path: 'analysis/financial-pdf', component: FinancialPdfComponent },
      { path: 'analysis/ask-document', component: AskDocumentComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'analysis/financial-text', component: FinancialTextComponent },
      { path: 'analysis/extraction', component: ExtractionComponent },
    ]
  },

  { path: '**', redirectTo: 'login' }
];