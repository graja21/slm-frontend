import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnalysisResponse, AnalysisService } from '../../../core/services/analysis.service';

@Component({
  selector: 'app-financial-text',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './financial-text.component.html',
  styleUrl: './financial-text.component.css'
})
export class FinancialTextComponent {
  text = `BH BANK a publié ses états financiers pour l'exercice 2025. Le total des actifs s'élève à 1 524 878 KDT, les capitaux propres à 1 373 273 KDT et le résultat net de l'exercice est de 105 849 KDT.`;
  model = 'mistral';

  result: AnalysisResponse | null = null;
  loading = false;
  errorMessage = '';

  constructor(private analysisService: AnalysisService) {}

  analyzeFinancialText(): void {
    const cleanText = this.text.trim();

    if (!cleanText) {
      this.errorMessage = 'Please enter financial text to analyze.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.result = null;

    this.analysisService.financialExtract(cleanText, this.model).subscribe({
      next: (response) => {
        this.result = response;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Financial text analysis failed. Please check backend services.';
        this.loading = false;
      }
    });
  }

  clear(): void {
    this.text = '';
    this.result = null;
    this.errorMessage = '';
  }

  getData(): any {
    const data = this.result?.result;

    if (!data) {
      return null;
    }

    if (data.result && !data.result.error) {
      return data.result;
    }

    return data;
  }

  hasModelJsonError(): boolean {
    return !!this.result?.result?.result?.error;
  }

  getModelError(): string {
    return this.result?.result?.result?.error || '';
  }

  getRawModelResponse(): string {
    return this.result?.result?.result?.raw_response || '';
  }

  getValue(key: string): string {
    const data = this.getData();

    if (!data || data[key] === undefined || data[key] === null) {
      return 'Not found';
    }

    return String(data[key]);
  }

  getRawResult(): string {
    if (!this.result?.result) {
      return '';
    }

    return JSON.stringify(this.result.result, null, 2);
  }
}