import { Injectable } from '@angular/core';
import { REDIRECT_OAUTH_PARAMS_NAME } from '@okta/okta-auth-js';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = []; 

  totalPrice: Subject<number> = new BehaviorSubject<number>(0); 
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0); 

  storage: Storage = sessionStorage; 

  constructor() { 
    
    let data = JSON.parse(this.storage.getItem('cartItems')!); 

    if (data != null) { 
      this.cartItems = data; 

      this.computeCartTotals(); 
    }
  }

  setQuantity(theCartItem: CartItem, quantity: number) {

    theCartItem.quantity = quantity; 

    this.computeCartTotals(); 
  }

  remove(theCartItem: CartItem) { 

    const cartItemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id == theCartItem.id); 

    if (cartItemIndex >= 0) { 
      this.cartItems.splice(cartItemIndex, 1); 
      
      this.computeCartTotals(); 
    }
  }

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

    this.persistCartItems(); 
  }

  persistCartItems() { 
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems)); 
  }
}