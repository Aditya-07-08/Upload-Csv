import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {

  studentData: BehaviorSubject<string[][]> = new BehaviorSubject<string[][]>([])
  validationSummary: BehaviorSubject<{ "totalRecords": number, "successCount": number, "failureCount": number }> = new BehaviorSubject<{ "totalRecords": number, "successCount": number, "failureCount": number }>({
    "totalRecords": 0, "successCount": 0, "failureCount": 0
  })
  
  constructor() { }
}
