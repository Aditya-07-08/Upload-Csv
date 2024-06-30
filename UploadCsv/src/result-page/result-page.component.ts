import { Component, OnInit } from '@angular/core';
import { DataStoreService } from '../data-store.service';

@Component({
  selector: 'app-result-page',
  standalone: true,
  imports: [],
  templateUrl: './result-page.component.html',
  styleUrl: './result-page.component.css'
})
export class ResultPageComponent implements OnInit {
  validationSummary!: { "totalRecords": number, "successCount": number, "failureCount": number }
  showSummary: boolean = false;
  constructor(private dataStoreService: DataStoreService) {
  }

  ngOnInit(): void {
    this.dataStoreService.validationSummary.subscribe({
      next: (data) => {
        this.validationSummary = data
      }
    })
  }
  toggleSummary() {

    this.showSummary = !this.showSummary; // Toggle showSummary flag
  }
}
