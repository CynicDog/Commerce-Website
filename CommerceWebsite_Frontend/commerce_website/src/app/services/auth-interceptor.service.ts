import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { from, lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next)); 
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    
    const endpoint = environment.hufsonian + '/orders'; 
    const securedEndPoints = [ endpoint ];

    if (securedEndPoints.some(url => request.urlWithParams.includes(url))) { 
      const accessToken = await this.oktaAuth.getAccessToken(); 

      request = request.clone({ 
        setHeaders: { 
          Authorization: 'Bearer ' + accessToken  
        }
      }); 
    }

    return lastValueFrom(next.handle(request));
  }
}