import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CropperService {

  constructor(private http: HttpClient) {}

  public save(url: string, pdata: FormData): Observable<any> {
    return of(this.http.post(url, pdata, {withCredentials: true}));
  }
}
