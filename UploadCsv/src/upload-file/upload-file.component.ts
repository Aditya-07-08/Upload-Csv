import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DataStoreService } from '../data-store.service';

@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.css'
})
export class UploadFileComponent {
  @ViewChild('fileInput', { static: true }) fileInputElement!: ElementRef;
  uploadedData: string[][] = [];
  csvUrl: string = '';
  csvData: string[][] = [];
  expectedHeaders: string[] = ['Name', 'Email', 'PhoneNumber', 'City', 'Address', 'Gpa'];
  constructor(private router: Router, private http: HttpClient, private dataStoreService: DataStoreService) { }

  onFileSelected(event: Event) {

    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];
    const reader: FileReader = new FileReader();
    // Validate file selected
    if (!file) {
      alert('No file selected');
      return;
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      alert('Invalid file type. Please upload a CSV file.');
      return;
    }

    reader.onload = (e: any) => {
      const data: string = e.target.result;
      const allTextLines: string[] = data.split(/\r\n|\n/);
      const nonEmptyData = allTextLines.filter(line => line.trim() !== '');
      const headers = nonEmptyData[0].split(',');

      //Data format Validate
      if (!this.validateDataFormat(headers)) {
        alert('Invalid data format');
        return;
      }

      this.uploadedData = nonEmptyData.map(line => line.split(','));

      this.dataStoreService.studentData.next(this.uploadedData)
      this.router.navigate(['/Student-data']);
    };

    reader.readAsText(file);
  }

  fetchCsv(): void {
    if (!this.csvUrl) {
      alert('CSV URL is not provided');
      return;
    }

    this.http.get(this.csvUrl, { responseType: 'text' }).subscribe({
      next: (data) => {
        const allTextLines: string[] = data.split(/\r\n|\n/);
        const nonEmptyData = allTextLines.filter(line => line.trim() !== '');
        const headers = nonEmptyData[0].split(',');

        //Data format Validate
        if (!this.validateDataFormat(headers)) {
          alert('Invalid data format');
          return;
        }
        this.uploadedData = nonEmptyData.map(line => line.split(','));
        this.dataStoreService.studentData.next(this.uploadedData)
        this.router.navigate(['/Student-data']);
      },
      error: () => {
        console.error('Error fetching CSV:');
      }
    }
    );
  }

  validateDataFormat(headers: string[]): boolean {
    if (headers.length !== this.expectedHeaders.length) {
      return false;
    }
    for (let i = 0; i < headers.length; i++) {
      if (headers[i].trim() !== this.expectedHeaders[i]) {
        return false;
      }
    }
    return true;
  }

}
