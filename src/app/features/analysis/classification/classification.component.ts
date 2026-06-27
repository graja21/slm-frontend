import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnalysisService, AnalysisResponse } from '../../../core/services/analysis.service';

@Component({
  selector: 'app-classification',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './classification.component.html',
  styleUrl: './classification.component.css'
})
export class ClassificationComponent {

  text = 'La banque a publié ses états financiers avec une hausse du total actif.';
  model = 'mistral';

  result: AnalysisResponse | null = null;
  loading = false;
  errorMessage = '';

  constructor(private analysisService: AnalysisService) {}

  classify(): void {
    this.errorMessage = '';
    this.result = null;
    this.loading = true;

    this.analysisService.classify(this.text, this.model).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Classification failed. Please check the backend services.';
        this.loading = false;
      }
    });
  }
}