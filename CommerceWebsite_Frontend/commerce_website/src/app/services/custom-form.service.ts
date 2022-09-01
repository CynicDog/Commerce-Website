import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomFormService {

  constructor() { }

  getCreditCardMonths(): Observable<number[]> { 

    return of(); 
  }

  getCreditCardYears(): Observable<number[]> { 

    return of(); 
  }
}
