import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CustomFormService } from 'src/app/services/custom-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;
  
  totalPrice: number = 0;
  totalQuantity: number = 0; 

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = []; 
  shippingAddressStates: State[] = []; 
  billingAddressStates: State[] = []; 

  constructor(
    private formBuilder: FormBuilder, 
    private cartService: CartService,
    private customFormService: CustomFormService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({ 
      customer: this.formBuilder.group({
        firstName: [''], 
        lastName: [''], 
        email: ['']
      }), 
      
      shippingAddress: this.formBuilder.group({
        street:[''], 
        city:[''], 
        state:[''],
        country:[''], 
        zipCode:['']
      }), 

      billingAddress: this.formBuilder.group({
        street:[''], 
        city:[''], 
        state:[''],
        country:[''], 
        zipCode:['']
      }), 

      creditCard: this.formBuilder.group({
        cardType:[''], 
        nameOnCard:[''], 
        cardNumber:[''],
        securityCode:[''], 
        expirationMonth:[''],
        expirationYear:['']
      }), 

    });

    let startMonth: number = new Date().getMonth() + 1; 
    
    this.customFormService.getCreditCardMonths(startMonth).subscribe(
      data => { 
        this.creditCardMonths = data; 
      }
    );

    this.customFormService.getCreditCardYears().subscribe(
      data => { 
        this.creditCardYears = data; 
      }
    );

    this.customFormService.getCountries().subscribe(
      data => { 
        this.countries = data; 
      }
    )

    this.updateCartStatus();
  }

  updateCartStatus() {
    
    this.cartService.totalPrice.subscribe(data => this.totalPrice = data); 
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);

    this.cartService.computeCartTotals();
  }

  onSubmit() { 
    
  }

  copyShippingAddressToBillingAddress(event) {

     if (event.target.checked) { 
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      this.billingAddressStates = this.shippingAddressStates; 
     }

     else { 
      this.checkoutFormGroup.controls['billingAddress'].reset(); 

      this.billingAddressStates = []; 
     }
  }

  handleMonthsAndYears() { 
    
    const currentYear: number = new Date().getFullYear(); 
    const selectedYear: number = Number(this.checkoutFormGroup.controls['creditCard'].value.expirationYear); 
  
    let startMonth: number; 

    if (currentYear == selectedYear) { 
      startMonth = new Date().getMonth() + 1; 
    }

    else { 
      startMonth = 1; 
    }

    this.customFormService.getCreditCardMonths(startMonth).subscribe(
      data => {

        this.creditCardMonths = data; 
      }
    )
  }

  getStates(formGroupName: string) { 
    const formGroup = this.checkoutFormGroup.get(formGroupName); 
    const countryCode = formGroup?.value.country.code; 

    this.customFormService.getStates(countryCode).subscribe(
      data => { 

        if (formGroupName === 'shippingAddress') { 
          this.shippingAddressStates = data; 
        }

        else { 
          this.billingAddressStates = data; 
        }

        formGroup?.get('state')?.setValue(data[0]); 
      }
    );  
  }
}
