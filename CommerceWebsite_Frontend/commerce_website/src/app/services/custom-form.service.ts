import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class CustomFormService {

  private countryUrl = 'http://localhost:8080/api/countries';
  private stateyUrl = 'http://localhost:8080/api/states';

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]> { 

    return this.httpClient.get<GetResponseCountries>(this.countryUrl).pipe(
      map(response => response._embedded.countries)
    )
  }

  getStates(countryCode: string): Observable<State[]> { 

    return this.httpClient.get<GetResponseStates>(this.stateyUrl + 
      `/search/findByCountryCode?code=${countryCode}`).pipe(
      map(response => response._embedded.states)
    )
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> { 

    let data: number[] = []; 

    for (let month: number = startMonth; month <= 12; month++) { 
      data.push(month); 
    }

    return of(data); 
  }

  getCreditCardYears(): Observable<number[]> { 

    const startYear: number = new Date().getFullYear(); 
    const endYear: number = startYear + 10; 

    let data: number[] = []; 

    for (let year: number = startYear; year <= endYear ; year++) { 
      data.push(year)
    }

    return of(data); 
  }
}

interface GetResponseCountries { 
  _embedded: { 
    countries: Country[]; 
  }
}

interface GetResponseStates { 
  _embedded: { 
    states: State[]; 
  }
}
