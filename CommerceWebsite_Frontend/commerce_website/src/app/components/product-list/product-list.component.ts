import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];

  currentCategoryId: number = 1;
  previousCategoryId: number = 1;

  searchMode!: boolean; 

  previousKeyword!: string; 
  
  pageNumber: number = 1;
  pageSize: number = 5; 
  totalElements: number = 0; 

  constructor(
    private productService: ProductService, 
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => { this.listProducts(); });
  }

  listProducts() {
    
    this.searchMode = this.route.snapshot.paramMap.has('keyword'); 

    if (this.searchMode) { this.handleSearchedProducts(); }

    else { this.handleListProducts(); } 
  }


  handleSearchedProducts() { 

    const keyword = this.route.snapshot.paramMap.get('keyword')!; 

    if (this.previousKeyword != keyword) { 
      this.pageNumber = 1; 
    }

    this.previousKeyword = keyword; 

    this.productService.getSearchedProductPaginate(this.pageNumber - 1, this.pageSize, keyword).subscribe(
      data => { 

        this.products = data._embedded.products;

        this.pageNumber = data.page.number + 1; 
        this.pageSize = data.page.size; 
        this.totalElements = data.page.totalElements; 
      } 
    ); 
  }

  handleListProducts() { 

    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id'); 

    if (hasCategoryId) { 
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!; 
    } 
    else { 
      this.currentCategoryId = 1; 
    }

    if (this.previousCategoryId != this.currentCategoryId) { 
      this.pageNumber = 1; 
    }

    this.previousCategoryId = this.currentCategoryId; 

    this.productService.getProductListPaginate(this.pageNumber - 1, this.pageSize, this.currentCategoryId).subscribe(
        data => { 

          this.products = data._embedded.products;

          this.pageNumber = data.page.number + 1; 
          this.pageSize = data.page.size; 
          this.totalElements = data.page.totalElements; 
        } 
    );
  }

  updatePageSize(value: string) { 
    this.pageSize = +value; 
    this.pageNumber = 1; 
    
    this.listProducts()
  }
}