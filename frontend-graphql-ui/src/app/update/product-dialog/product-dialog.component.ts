import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.css']
})
export class ProductDialogComponent {
  updateProductForm!: FormGroup;
  mode: 'add' | 'update';
  colors: any = [
    { value: 'Red', viewValue: 'Red' },
    { value: 'Black', viewValue: 'Black' },
    { value: 'Silver', viewValue: 'Silver' }
  ];

  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.mode = data.mode || 'add'; // Default mode is 'add'
  }

  ngOnInit(): void {
    this.createForm();
    if (this.mode === 'update') {
      this.patchValue();
    }
  }

  createForm(): void {
    this.updateProductForm = this.fb.group({
      category: ['', Validators.required],
      productName: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      colors: [[]]
    });
  }

  // Patching values from the data variable
  patchValue() {
    const defaultColors = this.data.product.colors || []
    this.updateProductForm.patchValue({
      category: this.data.product.category,
      productName: this.data.product.productName,
      price: this.data.product.price,
      colors: defaultColors
    });
  }

  onSave(): void {
    if (this.updateProductForm.valid) {
      const updatedProduct = this.updateProductForm.value;
      if (this.mode === 'update') {
        updatedProduct.id = this.data.product.id;
      }
      updatedProduct.colors = updatedProduct.colors.map((color: { value: any; }) => color.value);
      this.dialogRef.close(updatedProduct);
    } else {
      // Handle form validation errors
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
