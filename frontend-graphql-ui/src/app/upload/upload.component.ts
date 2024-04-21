import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const UPLOAD_FILE = gql`
  mutation singleUpload($file: Upload!) {
    singleUpload(file: $file) {
      filename
      mimetype
    }
  }
`;

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  imageUrl: string | undefined;
  selectedFile: File | undefined;

  constructor(private apollo: Apollo) { }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] as File;
  }

  onUpload(): void {
    if (!this.selectedFile) return;

    this.apollo.mutate({
      mutation: UPLOAD_FILE,
      variables: {
        file: {
          filename: this.selectedFile.name,
          mimetype: this.selectedFile.type,
        }
        
      }
    }).subscribe(({ data }) => {
      let data1: any = data;
      this.imageUrl = `http://localhost:9000/upload/${data1.singleUpload.filename}`;
    });
  }
}
