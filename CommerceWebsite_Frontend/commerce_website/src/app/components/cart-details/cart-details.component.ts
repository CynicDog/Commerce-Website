import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems!: CartItem[]; 

  totalPrice: number = 0; 
  totalQuantity: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.ListCardDetails();
  }

  ListCardDetails() {
    this.cartItems = this.cartService.cartItems; 
    
    this.cartService.totalPrice.subscribe(data => this.totalPrice = data); 
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data); 
    
    this.cartService.computeCartTotals(); 
  }

  setQuantity(cartItem: CartItem, quantity: number) { 
    this.cartService.setQuantity(cartItem, quantity)
  }

  remove(cartItem: CartItem) { 
    this.cartService.remove(cartItem); 
  }
}