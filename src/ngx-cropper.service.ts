import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

@Injectable()
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
  public save(url: string, pdata: FormData) {
    return this.http.post(url, pdata, {withCredentials: true});
  }
}
