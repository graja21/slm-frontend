import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AnalysisService, AnalysisResponse } from '../../../core/services/analysis.service';

@Component({
  selector: 'app-classification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './classification.component.html',
  styleUrl: './classification.component.css'
})
export class ClassificationComponent {
  text = 'La banque a publié ses états financiers avec une hausse du total actif.';
  model = 'mistral';
  result: AnalysisResponse | null = null;

  constructor(private analysisService: AnalysisService) {}

  classify(): void {
    this.analysisService.classify(this.text, this.model).subscribe({
      next: (res) => this.result = res,
      error: (err) => console.error(err)
    });
  }
}