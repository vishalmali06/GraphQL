import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ApolloService } from '../services/apollo.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from '../update/product-dialog/product-dialog.component';


interface Product {
  id: string;
  category: string;
  productName: string;
  price: number;
  colors: string[];
}

interface ProductsResponse {
  getPaginatedProducts: any;
}

@Component({
  selector: 'app-record-list',
  templateUrl: './record-list.component.html',
  styleUrls: ['./record-list.component.css']
})
export class RecordListComponent implements OnInit {

  loading = true;
  error: any;
  products: Product[] | undefined;
  pageSize = 10;
  totalRecords = 0;
  pageNumber = 1;
  totalPages = 1;
  pageSizes = [10, 20, 50];

  // File upload properties
  selectedFile: File | undefined;
  fileContent: any;

  constructor(
    private apollo: Apollo,
    private apolloService: ApolloService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.fetchData();
  }

  private readFileContent(file: File): void {
    const reader = new FileReader();

    reader.onload = (e) => {
      // Read the content of the file as a string
      this.fileContent = e.target?.result as string;
    };

    // Start reading the file
    reader.readAsText(file);
  }

  fetchData(): void {
   console.log("=============> 1111"); 
    this.apollo
      .watchQuery<ProductsResponse>({
        query: gql`
        query GetPaginatedProducts($pageNumber: Int, $pageSize: Int) {
          getPaginatedProducts(pageNumber: $pageNumber, pageSize: $pageSize) {
            totalRecords
            products {
              id
              category
              productName
              price
              colors
            }
          }
        }
        `,
        variables: {
          pageNumber: this.pageNumber,
          pageSize: Number(this.pageSize)
        },
      })
      .valueChanges.subscribe(({ data, loading, errors }) => {
        this.loading = loading;
        this.error = errors;
        this.products = data?.getPaginatedProducts?.products;
        this.totalRecords = data?.getPaginatedProducts?.totalRecords;
        this.totalPages = Math.ceil(this.totalRecords / Number(this.pageSize));
      });
  }

  onPageSizeChange(): void {
    this.pageNumber = 1;
    this.fetchData();
  }

  prevPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.fetchData();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.fetchData();
    }
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
    this.readFileContent(event.target.files[0]);
  }

  uploadFile(): void {
    if (this.selectedFile) {
      this.apollo
        .mutate({
          mutation: gql`
          mutation UploadFile($file: Upload!) {
            uploadFile(file: $file) {
              filecontent
              filename
              mimetype
              encoding
            }
          }
          `,
          variables: {
            file: {
              filecontent: this.fileContent,
              filename: this.selectedFile.name,
              mimetype: this.selectedFile.type,
              encoding: this.selectedFile.lastModified
            },
          },
        })
        .subscribe(
          (response: any) => {
            console.log('File uploaded successfully:', response.data.uploadFile);
          },
          (error) => {
            console.error('Error uploading file:', error);
          }
        );
    } else {
      console.log('No file selected for upload.');
    }
  }

  deleteProduct(productId: any): void {
    this.apolloService.deleteProduct(productId).subscribe(
      () => {
        // Remove the deleted product from the products array
        this.products = this.products && this.products.filter(product => product?.id !== productId);
        this.fetchData();
      },
      error => console.error('Error deleting product:', error)
    );
  }

  // Inside your component class
  openProductDialog(mode: 'add' | 'update', product?: any): void {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '400px',
      data: { mode, product }
    });
  
    dialogRef.afterClosed().subscribe(updatedProduct => {
      if (updatedProduct) {
        console.log(updatedProduct);
        if (mode === 'add') {
          this.apolloService.addProduct(updatedProduct).subscribe(
            () => {
              console.log('Product added successfully');
              // Update this.products with the latest data after adding a product
              this.fetchData();
            },
            error => console.error('Error adding product:', error)
          );
        } else if (mode === 'update') {
          this.apolloService.updateProduct(updatedProduct).subscribe(
            () => {
              console.log('Product updated successfully');
              // Update this.products with the latest data after updating a product
              this.fetchData();
            },
            error => console.error('Error updating product:', error)
          );
        }
      }
    });
  }
  

}