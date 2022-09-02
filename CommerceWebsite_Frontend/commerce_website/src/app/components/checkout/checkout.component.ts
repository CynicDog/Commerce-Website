import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CustomFormService } from 'src/app/services/custom-form.service';
import { CustomValidators } from 'src/app/validators/custom-validators';

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
        firstName: new FormControl ('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]), 
        lastName: new FormControl ('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]), 
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }), 
      
      shippingAddress: this.formBuilder.group({
        street: new FormControl ('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]), 
        city: new FormControl ('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]), 
        zipCode: new FormControl ('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]), 
        state: new FormControl ('', [Validators.required]), 
        country: new FormControl ('', [Validators.required])
      }), 

      billingAddress: this.formBuilder.group({
        street: new FormControl ('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]), 
        city: new FormControl ('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]), 
        zipCode: new FormControl ('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]), 
        state: new FormControl ('', [Validators.required]), 
        country: new FormControl ('', [Validators.required])
      }), 

      creditCard: this.formBuilder.group({
        cardType: new FormControl ('', [Validators.required]), 
        nameOnCard: new FormControl ('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]), 
        cardNumber: new FormControl ('', [Validators.required , Validators.pattern('[0-9]{16}')]), 
        securityCode: new FormControl ('', [Validators.required , Validators.pattern('[0-9]{3}')]), 
        expirationMonth: new FormControl ('', [Validators.required]), 
        expirationYear: new FormControl ('', [Validators.required]), 
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

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }

  get cardType () { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get nameOnCard () { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get cardNumber () { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get securityCode () { return this.checkoutFormGroup.get('creditCard.securityCode'); }
  get expirationMonth () { return this.checkoutFormGroup.get('creditCard.expirationMonth'); }
  get expirationYear () { return this.checkoutFormGroup.get('creditCard.expirationYear'); } 

  updateCartStatus() {
    
    this.cartService.totalPrice.subscribe(data => this.totalPrice = data); 
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);

    this.cartService.computeCartTotals();
  }

  onSubmit() { 

    if (this.checkoutFormGroup.invalid) { 
      this.checkoutFormGroup.markAllAsTouched(); 
    }
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
