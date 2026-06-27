import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnalysisResponse, AnalysisService } from '../../core/services/analysis.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  history: AnalysisResponse[] = [];
  selectedItem: AnalysisResponse | null = null;

  loading = false;
  errorMessage = '';

  page = 0;
  size = 8;
  totalPages = 0;
  totalElements = 0;

  searchTerm = '';
  selectedType = '';
  selectedModel = '';

  analysisTypes = [
    { value: '', label: 'All types' },
    { value: 'classification', label: 'Classification' },
    { value: 'summarization', label: 'Summarization' },
    { value: 'extraction', label: 'Extraction' },
    { value: 'financial_extraction', label: 'Financial Extraction' },
    { value: 'financial_pdf_chunked', label: 'Financial PDF' },
    { value: 'rag_qa', label: 'Ask Document' }
  ];

  models = [
    { value: '', label: 'All models' },
    { value: 'mistral', label: 'Mistral' },
    { value: 'gemma', label: 'Gemma' }
  ];

  constructor(private analysisService: AnalysisService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.loading = true;
    this.errorMessage = '';

    this.analysisService.getHistory(
      this.page,
      this.size,
      this.selectedType,
      this.selectedModel
    ).subscribe({
      next: (response) => {
        this.history = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load history. Please try again.';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.page = 0;
    this.loadHistory();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedType = '';
    this.selectedModel = '';
    this.page = 0;
    this.loadHistory();
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadHistory();
    }
  }

  nextPage(): void {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.loadHistory();
    }
  }

  openDetails(item: AnalysisResponse): void {
    this.selectedItem = item;
  }

  closeDetails(): void {
    this.selectedItem = null;
  }

  deleteItem(item: AnalysisResponse): void {
    if (!confirm('Delete this analysis?')) {
      return;
    }

    this.analysisService.deleteHistory(item.id).subscribe({
      next: () => {
        this.history = this.history.filter((h) => h.id !== item.id);
        this.totalElements--;

        if (this.selectedItem?.id === item.id) {
          this.selectedItem = null;
        }

        if (this.history.length === 0 && this.page > 0) {
          this.page--;
          this.loadHistory();
        }
      },
      error: () => {
        this.errorMessage = 'Unable to delete this analysis.';
      }
    });
  }

  get filteredHistory(): AnalysisResponse[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      return this.history;
    }

    return this.history.filter((item) =>
      item.analysisType?.toLowerCase().includes(term) ||
      item.model?.toLowerCase().includes(term) ||
      item.inputText?.toLowerCase().includes(term) ||
      item.filename?.toLowerCase().includes(term)
    );
  }

  formatType(type: string): string {
    return type.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  getPreview(item: AnalysisResponse): string {
    const text = item.inputText || item.filename || 'No input preview available.';
    return text.length > 150 ? text.slice(0, 150) + '...' : text;
  }

  getResultPreview(item: AnalysisResponse): string {
    if (!item.result) {
      return 'No result available.';
    }

    const keys = ['category', 'summary', 'answer', 'result', 'analysis', 'response'];

    for (const key of keys) {
      if (item.result[key]) {
        const value = item.result[key];
        return typeof value === 'string' ? value : JSON.stringify(value, null, 2);
      }
    }

    return JSON.stringify(item.result, null, 2);
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'classification': return 'bi-diagram-3';
      case 'summarization': return 'bi-text-paragraph';
      case 'financial_extraction': return 'bi-graph-up-arrow';
      case 'financial_pdf_chunked': return 'bi-filetype-pdf';
      case 'rag_qa': return 'bi-chat-dots';
      default: return 'bi-stars';
    }
  }
}