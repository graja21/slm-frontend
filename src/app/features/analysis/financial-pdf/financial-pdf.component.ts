import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AnalysisResponse, AnalysisService } from '../../../core/services/analysis.service';

@Component({
  selector: 'app-financial-pdf',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './financial-pdf.component.html',
  styleUrl: './financial-pdf.component.css'
})
export class FinancialPdfComponent {
  selectedFile: File | null = null;
  result: AnalysisResponse | null = null;

  loading = false;
  errorMessage = '';
  isDragging = false;

  constructor(private analysisService: AnalysisService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    this.setFile(input.files[0]);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    if (!event.dataTransfer?.files || event.dataTransfer.files.length === 0) return;

    this.setFile(event.dataTransfer.files[0]);
  }

  setFile(file: File): void {
    this.errorMessage = '';
    this.result = null;

    if (file.type !== 'application/pdf') {
      this.selectedFile = null;
      this.errorMessage = 'Please select a valid PDF file.';
      return;
    }

    this.selectedFile = file;
  }

  analyzePdf(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please upload a PDF file first.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.result = null;

    this.analysisService.financialPdfChunked(this.selectedFile).subscribe({
      next: (response) => {
        this.result = response;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'PDF analysis failed. Please check Spring Boot, FastAPI and Ollama.';
        this.loading = false;
      }
    });
  }

  clear(): void {
    this.selectedFile = null;
    this.result = null;
    this.errorMessage = '';
    this.isDragging = false;
  }

  getFileSize(): string {
    if (!this.selectedFile) return '';

    const sizeMb = this.selectedFile.size / (1024 * 1024);
    return `${sizeMb.toFixed(2)} MB`;
  }

  getFinancialData(): any {
    const data = this.result?.result;

    if (!data) return null;

    return data.final_result || data;
  }

  getValue(key: string): string {
    const data = this.getFinancialData();

    if (!data || data[key] === undefined || data[key] === null) {
      return 'Not found';
    }

    return String(data[key]);
  }

  getInvalidChunks(): string {
    const data = this.result?.result;

    if (!data || data.invalid_chunks === undefined || data.invalid_chunks === null) {
      return 'Not found';
    }

    return String(data.invalid_chunks);
  }

  getRawResult(): string {
    if (!this.result?.result) return '';

    return JSON.stringify(this.result.result, null, 2);
  }
}