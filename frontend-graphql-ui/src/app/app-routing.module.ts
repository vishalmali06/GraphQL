import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RecordListComponent } from './record-list/record-list.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'products', component: RecordListComponent },
  // Add other routes as needed
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route to redirect to login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }