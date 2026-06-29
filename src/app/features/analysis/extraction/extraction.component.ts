import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnalysisResponse, AnalysisService } from '../../../core/services/analysis.service';

@Component({
  selector: 'app-extraction',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './extraction.component.html',
  styleUrl: './extraction.component.css'
})
export class ExtractionComponent {
  text = `Le 15 mars 2026, la société SLM AI Platform basée à Tunis a présenté une solution d'analyse documentaire utilisant Angular, Spring Boot, FastAPI et Ollama. Le projet a été développé par l'équipe de stage pour améliorer l'automatisation des analyses.`;
  result: AnalysisResponse | null = null;

  loading = false;
  errorMessage = '';

  constructor(private analysisService: AnalysisService) {}

  extract(): void {
    const cleanText = this.text.trim();

    if (!cleanText) {
      this.errorMessage = 'Please enter text to extract information.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.result = null;

    this.analysisService.extract(cleanText).subscribe({
      next: (response) => {
        this.result = response;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Extraction failed. Please check backend services.';
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
    return this.result?.result?.result || this.result?.result || null;
  }

  getArray(key: string): any[] {
    const data = this.getData();

    if (!data || !Array.isArray(data[key])) {
      return [];
    }

    return data[key];
  }

  getRawResult(): string {
    if (!this.result?.result) {
      return '';
    }

    return JSON.stringify(this.result.result, null, 2);
  }
}