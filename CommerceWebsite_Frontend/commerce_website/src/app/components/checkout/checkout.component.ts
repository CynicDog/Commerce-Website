import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormControlStatus, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { CustomFormService } from 'src/app/services/custom-form.service';
import { CustomValidators } from 'src/app/validators/custom-validators';
import { environment } from 'src/environments/environment';
import { __classPrivateFieldIn } from 'tslib';

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

  storage: Storage = sessionStorage;

  formControlStatus: FormControlStatus;

  // Stripe(publishableKey, options?) creates an instance of the `Stripe` object, which is an entrypoint to the rest of Stripe SDK. 
  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo: PaymentInfo = new PaymentInfo();

  cardElement: any;
  displayError: any;

  isDisabled: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private customFormService: CustomFormService,
    private checkoutService: CheckoutService,
    private router: Router) { }

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

  get cardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get nameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get cardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get securityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }
  get expirationMonth() { return this.checkoutFormGroup.get('creditCard.expirationMonth'); }
  get expirationYear() { return this.checkoutFormGroup.get('creditCard.expirationYear'); }

  ngOnInit(): void {

    const email = JSON.parse(this.storage.getItem("userEmail"));

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        email: new FormControl(email, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),

      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required])
      }),

      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required])
      }),

      creditCard: this.formBuilder.group({}),
    });

    this.customFormService.getCountries().subscribe(
      data => {
        this.countries = data;
      }
    )

    this.updateCartStatus();
    this.setupStripePaymentForm();
  }

  setupStripePaymentForm() {

    // stripe.elements(options?) method creates an `Elements` instance, which manages a group of elements. 
    var elements = this.stripe.elements();

    // elements.create('payment', options?) creates an instance of the `Payment Element`. `Payment Element` is an embeddable component for securely collecting payment details.
    this.cardElement = elements.create('card', { hidePostalCode: true });

    this.cardElement.mount('#card-element');

    // element.on() method is triggered when the `Element` is fully rendered and can accept event handler calls such as `change`, `ready`, `focus`, etc.
    this.cardElement.on('change', (event) => {
      this.displayError = document.getElementById('card-errors');

      // `event.complete` is an event object properties whose boolean value is true if all required fields for the selected payment method have been filled with potentially valid inputs. 
      if (event.complete) { this.displayError.textContent = ""; }
      else if (event.error) { this.displayError.textContent = event.error.message; }
    });
  }

  updateCartStatus() {

    this.cartService.totalPrice.subscribe(data => this.totalPrice = data);
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);
  }

  onSubmit() {

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }

    let order = new Order();

    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItems = this.cartService.cartItems;
    let orderItems: OrderItem[] = cartItems.map(item => new OrderItem(item));

    let purchase = new Purchase();

    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    console.log(this.checkoutFormGroup.controls['shippingAddress'].value);
    console.log(this.checkoutFormGroup.controls['billingAddress'].value);

    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    purchase.shippingAddress.state = JSON.parse(JSON.stringify(purchase.shippingAddress.state)).name;
    purchase.shippingAddress.country = JSON.parse(JSON.stringify(purchase.shippingAddress.country)).name;

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    purchase.billingAddress.state = JSON.parse(JSON.stringify(purchase.billingAddress.state)).name;
    purchase.billingAddress.country = JSON.parse(JSON.stringify(purchase.billingAddress.country)).name;

    purchase.order = order;
    purchase.orderItems = orderItems;

    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = "USD";
    this.paymentInfo.receiptEmail = purchase.customer.email;

    if (!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {

      this.isDisabled = true; 

      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement,
                billing_details: {
                  email: purchase.customer.email,
                  name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                  address: {
                    line1: purchase.billingAddress.street,
                    city: purchase.billingAddress.city,
                    state: purchase.billingAddress.state,
                    postal_code: purchase.billingAddress.zipCode,
                    country: this.billingAddressCountry.value.code
                  }
                }
              }
            }, { handleActions: false })
            .then(function (result) {
              if (result.error) { alert(`There was an error: ${result.error.message}`); this.isDisabled = false; }
              else {
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: response => {
                    alert(`Your order has been received. Order Trackign Number: ${response.orderTrackingNumber}`);
                    this.resetCart();
                    this.isDisabled = false;
                  },
                  error: error => { alert(`There was an error: ${error}`); this.isDisabled = false; }
                })
              }
            }.bind(this));
        }
      );
    } else { this.checkoutFormGroup.markAllAsTouched(); }
  }

  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();

    this.checkoutFormGroup.reset();

    this.router.navigateByUrl("/products");
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

