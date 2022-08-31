import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = []; 

  totalPrice: Subject<number> = new Subject<number>(); 
  totalQuantity: Subject<number> = new Subject<number>(); 

  constructor() { }

  addToCart(theCartItem: CartItem) { 
    let alreadyExistInCart: boolean = false; 
    let existingCartItem!: CartItem;

    if (this.cartItems.length > 0) { 

      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id)!; 

      alreadyExistInCart = (existingCartItem != undefined ); 
    }  

    if (alreadyExistInCart) { 
      existingCartItem.quantity++;  
    }

    else { this.cartItems.push(theCartItem); }

    this.computeCartTotals(); 
  }

  computeCartTotals() {
    let totalPrice: number = 0.00; 
    let totalQuantity: number = 0; 

    for (let tempCartItem of this.cartItems) { 
      totalPrice += tempCartItem.unitPrice * tempCartItem.quantity; 
      totalQuantity += tempCartItem.quantity; 
    }

    this.totalPrice.next(totalPrice); 
    this.totalQuantity.next(totalQuantity); 
  }

}
 