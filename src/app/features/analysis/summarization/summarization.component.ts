import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnalysisResponse, AnalysisService } from '../../../core/services/analysis.service';

@Component({
  selector: 'app-summarization',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './summarization.component.html',
  styleUrl: './summarization.component.css'
})
export class SummarizationComponent {
  text = '';
  loading = false;
  errorMessage = '';
  result: AnalysisResponse | null = null;

  constructor(private analysisService: AnalysisService) {}

  summarize(): void {
    const cleanText = this.text.trim();

    if (!cleanText) {
      this.errorMessage = 'Please enter text to summarize.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.result = null;

    this.analysisService.summarize(cleanText).subscribe({
      next: (response) => {
        this.result = response;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to summarize text. Please try again.';
        this.loading = false;
      }
    });
  }

  clear(): void {
    this.text = '';
    this.result = null;
    this.errorMessage = '';
  }

  getSummary(): string {
    if (!this.result?.result) {
      return '';
    }

    const data = this.result.result;

    if (data.summary) {
      return data.summary;
    }

    if (data.result) {
      return data.result;
    }

    if (data.response) {
      return data.response;
    }

    return JSON.stringify(data, null, 2);
  }
}