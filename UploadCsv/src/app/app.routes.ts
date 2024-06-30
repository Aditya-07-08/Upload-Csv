import { Routes } from '@angular/router';
import { StudentDataComponent } from '../student-data/student-data.component';
import { UploadFileComponent } from '../upload-file/upload-file.component';
import { ResultPageComponent } from '../result-page/result-page.component';

export const routes: Routes = [ { path: '', redirectTo: '/upload-csv', pathMatch: 'full' },
    { path: 'Student-data', component: StudentDataComponent },
    { path: 'upload-csv', component: UploadFileComponent },
    { path: 'result-page', component: ResultPageComponent }];
