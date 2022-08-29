import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; 
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = "http://localhost:8080/api/products"; 

  constructor(private httpClient: HttpClient) { }

  getProductList(categoryId: number): Observable<Product[]> { 

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`; 

    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  } 

  getProductCategories(): Observable<ProductCategory[]> { 

    const categoryUrl = "http://localhost:8080/api/productCategory"; 

    return this.httpClient.get<GetResponseCategory>(categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  } 

  getSearchedProducts(keyword: string): Observable<Product[]> {  

    const searchUrl= `${this.baseUrl}/search/findByNameContaining?name=${keyword}`; 

    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    ); 
  }

  getProduct(productId: number): Observable<Product> {
    
    const productUrl = `${this.baseUrl}/${productId}`; 

    return this.httpClient.get<Product>(productUrl);
  }
}

interface GetResponseProducts { 
  _embedded: { 
    products: Product[]; 
  }
}

interface GetResponseCategory { 
  _embedded: { 
    productCategory: ProductCategory[]; 
  }
}