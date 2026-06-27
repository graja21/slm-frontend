import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  stats = [
    { label: 'Total Analyses', value: '0', icon: 'bi bi-activity' },
    { label: 'AI Modules', value: '6', icon: 'bi bi-cpu' },
    { label: 'Documents', value: '0', icon: 'bi bi-file-earmark-text' },
    { label: 'Model', value: 'Mistral', icon: 'bi bi-stars' }
  ];

  modules = [
    {
      title: 'Text Classification',
      description: 'Classify text automatically using local SLM models.',
      icon: 'bi bi-diagram-3',
      route: '/classification',
      badge: 'Ready'
    },
    {
      title: 'Summarization',
      description: 'Generate clean summaries from long text or documents.',
      icon: 'bi bi-text-paragraph',
      route: '/analysis/summarization',
      badge: 'Next'
    },
    {
      title: 'PDF Analysis',
      description: 'Upload PDFs and extract intelligent insights.',
      icon: 'bi bi-filetype-pdf',
      route: '/analysis/pdf',
      badge: 'Soon'
    },
    {
      title: 'Financial Analysis',
      description: 'Analyze bank reports and extract financial indicators.',
      icon: 'bi bi-graph-up-arrow',
      route: '/analysis/financial',
      badge: 'Soon'
    },
    {
      title: 'Ask Document',
      description: 'Ask questions using RAG over uploaded documents.',
      icon: 'bi bi-chat-dots',
      route: '/analysis/rag',
      badge: 'Soon'
    },
    {
      title: 'History',
      description: 'View your previous AI analyses and results.',
      icon: 'bi bi-clock-history',
      route: '/history',
      badge: 'Ready'
    }
  ];
}