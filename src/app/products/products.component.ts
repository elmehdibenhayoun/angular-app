import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ProductService } from "../services/product.service";
import { Product } from "../model/product.model";
import { Router } from '@angular/router';
import { AppStateService } from '../services/app-state.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {




  constructor(private productService: ProductService,
    private router: Router, public appState: AppStateService) {
  }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    // this.appState.setProductState({
    //   status:"LOADING"
    // });
    this.productService.getProducts(this.appState.productState.keyword,
      this.appState.productState.currentPage,
      this.appState.productState.pageSize)
      .subscribe({
        next: (response) => {
          let products = response.body as Product[];
          let totalProducts: number = parseInt(response.headers.get('x-total-count')!);
          //this.appState.productState.totalProducts;
          let totalPages = Math.floor(totalProducts / this.appState.productState.pageSize);
          if (totalProducts % this.appState.productState.pageSize != 0) {
            ++totalPages;
          }
          this.appState.setProductState({
            products: products,
            totalProducts: totalProducts,
            totalPages: totalPages,
            status:"LOADED"
          })
        },
        error: err => {
          this.appState.setProductState({
            status:"ERROR",
            errorMessage: err
          })
        }
      })

    //this.products=this.productService.getProducts();
  }


  handleCheckProduct(product: Product) {
    this.productService.checkProduct(product).subscribe({
      next: updatedProduct => {
        product.checked = !product.checked;
        //this.getProducts();
      }
    })
  }

  handleDelete(product: Product) {
    if (confirm("Etes vous sûre?"))
      this.productService.deleteProduct(product).subscribe({
        next: value => {
          this.getProducts();
          //this.appState.productState.products = this.appState.productState.products.filter((p: any) => p.id != product.id);

        }
      })
  }


  handleGotoPage(page: number) {
    this.appState.productState.currentPage = page;
    this.getProducts();
  }
  handleEdit(product: Product) {
    this.router.navigateByUrl(`/admin/editProduct/${product.id}`);
  }
}
