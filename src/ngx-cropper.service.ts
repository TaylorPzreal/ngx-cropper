import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NgxCropperService {

  constructor(private http: HttpClient) {}

  /**
   * save to server
   *
   * @param {string} url
   * @param {FormData} pdata
   * @returns
   * @memberof NgxCropperService
   */
  public save(url: string, pdata: FormData): Observable<any> {
    return this.http.post(url, pdata, {withCredentials: true});
  }
}
