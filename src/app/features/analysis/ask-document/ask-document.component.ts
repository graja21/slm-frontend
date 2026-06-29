import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnalysisResponse, AnalysisService } from '../../../core/services/analysis.service';

@Component({
  selector: 'app-ask-document',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ask-document.component.html',
  styleUrl: './ask-document.component.css'
})
export class AskDocumentComponent implements OnInit {
  question = 'Quel est le résultat de l’exercice ?';
  model = 'mistral';

  result: AnalysisResponse | null = null;
  ragStatus: any = null;

  loading = false;
  loadingStatus = false;
  errorMessage = '';

  constructor(private analysisService: AnalysisService) {}

  ngOnInit(): void {
    this.checkRagStatus();
  }

  checkRagStatus(): void {
    this.loadingStatus = true;

    this.analysisService.ragStatus().subscribe({
      next: (status) => {
        this.ragStatus = status;
        this.loadingStatus = false;
      },
      error: () => {
        this.ragStatus = null;
        this.loadingStatus = false;
      }
    });
  }

  askQuestion(): void {
    const cleanQuestion = this.question.trim();

    if (!cleanQuestion) {
      this.errorMessage = 'Please enter a question.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.result = null;

    this.analysisService.askDocument(cleanQuestion, this.model).subscribe({
      next: (response) => {
        this.result = response;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to ask document. Please check if a document is indexed first.';
        this.loading = false;
      }
    });
  }

  clear(): void {
    this.question = '';
    this.result = null;
    this.errorMessage = '';
  }

  getAnswer(): string {
    if (!this.result?.result) {
      return '';
    }

    const data = this.result.result;

    return data.answer || data.response || data.result || JSON.stringify(data, null, 2);
  }

  getStatusLabel(): string {
    if (this.loadingStatus) {
      return 'Checking...';
    }

    if (!this.ragStatus) {
      return 'Unknown';
    }

    if (this.ragStatus.indexed === true || this.ragStatus.ready === true) {
      return 'Indexed';
    }

    return 'Not indexed';
  }

  getStatusClass(): string {
    const label = this.getStatusLabel();

    if (label === 'Indexed') {
      return 'ready';
    }

    if (label === 'Checking...') {
      return 'checking';
    }

    return 'warning';
  }

  getChunksCount(): string {
    if (!this.ragStatus) {
      return 'N/A';
    }

    return String(
      this.ragStatus.chunks ||
      this.ragStatus.chunks_count ||
      this.ragStatus.total_chunks ||
      'N/A'
    );
  }

  getSourceName(): string {
    if (!this.ragStatus) {
      return 'No source detected';
    }

    return (
      this.ragStatus.filename ||
      this.ragStatus.source ||
      this.ragStatus.document ||
      'Indexed document'
    );
  }
}