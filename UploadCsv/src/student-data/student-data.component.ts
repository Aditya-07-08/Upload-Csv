import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStoreService } from '../data-store.service';
import { take } from 'rxjs';
import { Router } from '@angular/router';

interface Employee {
  name: string;
  email: string;
  phoneNumber: string;
  city: string;
  address: string;
  gpa: number;
}

@Component({
  selector: 'app-student-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-data.component.html',
  styleUrl: './student-data.component.css'
})
export class StudentDataComponent {
  uploadedData: string[][] = [];
  employees: Employee[] = [];
  validationSummary = { totalRecords: 0, successCount: 0, failureCount: 0 };
  showSummary = false;

  constructor(private dataStoreService: DataStoreService, private router: Router) {

  }

  columnDefinitions = [
    { name: 'Name', dataType: 'string' },
    { name: 'Email', dataType: 'email' },
    { name: 'Phone number', dataType: 'number' },
    { name: 'City', dataType: 'string' },
    { name: 'Address', dataType: 'string' },
    { name: 'GPA (out of 10)', dataType: 'float' }
  ];

  ngOnInit() {

    this.dataStoreService.studentData.pipe(take(1)).subscribe({
      next: (data) => {
        this.uploadedData = data
      }
    })
    this.processData();
  }




  private processData(): void {
    this.employees = [];
    for (let i = 1; i < this.uploadedData.length; i++) {
      const employee: Employee = {
        name: this.uploadedData[i][0],
        email: this.uploadedData[i][1],
        phoneNumber: this.uploadedData[i][2].toString(),
        city: this.uploadedData[i][3],
        address: this.uploadedData[i][4],
        gpa: parseFloat(this.uploadedData[i][5])
      };
      this.employees.push(employee);
    }


    this.calculateValidationSummary();
  }


  isDataTypeCorrect(cell: any, columnIndex: number): boolean {
    const expectedDataType = this.columnDefinitions[columnIndex].dataType;

    switch (expectedDataType) {
      case 'string':
        return typeof cell === 'string' && cell.trim() !== '';
      case 'email':

        return typeof cell === 'string' && /\S+@\S+\.\S+/.test(cell);
      case 'number':
        return !isNaN(cell) && cell.toString().length === 10;
      case 'float':
        return !isNaN(cell) && parseFloat(cell) >= 0 && parseFloat(cell) <= 10;
      default:
        return false;
    }
  }


  isEmptyValue(cell: any): boolean {
    return cell === '' || cell === null || cell === undefined;
  }


  calculateValidationSummary(): void {
    let successCount = 0;
    let failureCount = 0;

    for (let i = 1; i < this.uploadedData.length; i++) {
      let hasError = false;
      for (let j = 0; j < this.uploadedData[i].length; j++) {
        const cell = this.uploadedData[i][j];
        if (this.isEmptyValue(cell) || !this.isDataTypeCorrect(cell, j)) {
          hasError = true;
          break;
        }
      }
      if (hasError) {
        failureCount++;
      } else {
        successCount++;
      }
    }

    const totalRecords = this.uploadedData.length - 1;
    this.validationSummary = { totalRecords, successCount, failureCount };
    console.log(this.validationSummary)
    this.dataStoreService.validationSummary.next(this.validationSummary)
  }


  proceed(): void {
    this.router.navigate(['/result-page']);
    this.showSummary = !this.showSummary;
  }
}