import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  private apiUrl = 'http://localhost:8081/api/analysis';

  constructor(private http: HttpClient) {}

  classify(text: string, model: string): Observable<AnalysisResponse> {
    return this.http.post<AnalysisResponse>(`${this.apiUrl}/classify`, {
      text,
      model
    });
  }
}