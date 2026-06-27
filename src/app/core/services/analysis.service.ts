import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AnalysisResponse {
  id: string;
  analysisType: string;
  model: string;
  inputText: string;
  filename: string | null;
  result: any;
  createdAt: string;
}

export interface HistoryPage {
  content: AnalysisResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {

  private readonly apiUrl = 'http://localhost:8081/api/analysis';

  constructor(private http: HttpClient) {}

  // ===========================
  // Classification
  // ===========================

  classify(text: string, model: string): Observable<AnalysisResponse> {
    return this.http.post<AnalysisResponse>(
      `${this.apiUrl}/classify`,
      {
        text,
        model
      }
    );
  }

  // ===========================
  // Summarization
  // ===========================

  summarize(text: string): Observable<AnalysisResponse> {
    return this.http.post<AnalysisResponse>(
      `${this.apiUrl}/summarize`,
      {
        text
      }
    );
  }

  // ===========================
  // Extraction
  // ===========================

  extract(text: string): Observable<AnalysisResponse> {
    return this.http.post<AnalysisResponse>(
      `${this.apiUrl}/extract`,
      {
        text
      }
    );
  }

  // ===========================
  // Financial Extraction
  // ===========================

  financialExtract(
    text: string,
    model: string
  ): Observable<AnalysisResponse> {

    return this.http.post<AnalysisResponse>(
      `${this.apiUrl}/financial-extract`,
      {
        text,
        model
      }
    );
  }

  // ===========================
  // Ask Document (RAG)
  // ===========================

  askDocument(
    question: string,
    model: string
  ): Observable<AnalysisResponse> {

    return this.http.post<AnalysisResponse>(
      `${this.apiUrl}/ask-document`,
      {
        question,
        model
      }
    );
  }

  // ===========================
  // Financial PDF
  // ===========================

  financialPdfChunked(
    file: File
  ): Observable<AnalysisResponse> {

    const formData = new FormData();

    formData.append(
      'file',
      file
    );

    return this.http.post<AnalysisResponse>(
      `${this.apiUrl}/financial-pdf-chunked`,
      formData
    );
  }

  // ===========================
  // History
  // ===========================

  getHistory(
    page: number = 0,
    size: number = 8,
    analysisType?: string,
    model?: string
  ): Observable<HistoryPage> {

    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (analysisType) {
      params = params.set(
        'analysisType',
        analysisType
      );
    }

    if (model) {
      params = params.set(
        'model',
        model
      );
    }

    return this.http.get<HistoryPage>(
      `${this.apiUrl}/history`,
      {
        params
      }
    );
  }

  // ===========================
  // Delete History
  // ===========================

  deleteHistory(
    id: string
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/history/${id}`
    );
  }

}