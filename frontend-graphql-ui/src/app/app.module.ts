import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { RecordListComponent } from './record-list/record-list.component';
import { LoginComponent } from './login/login.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { ProductDialogComponent } from './update/product-dialog/product-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { CardListComponent } from './card-list/card-list.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { UploadComponent } from './upload/upload.component';

@NgModule({
  declarations: [
    AppComponent,
    RecordListComponent,
    LoginComponent,
    ProductDialogComponent,
    HeaderComponent,
    FooterComponent,
    CardListComponent,
    UploadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    FormsModule,
    NoopAnimationsModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    BrowserModule,
    ReactiveFormsModule,
    MatInputModule, // Import MatInputModule for text inputs
    MatSelectModule, // Import MatSelectModule for select inputs
    MatButtonModule, // Import MatButtonModule for buttons
    MatIconModule,
    ScrollingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
