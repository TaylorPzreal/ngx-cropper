import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NgxCropperService {

  constructor(private http: Http) {}

  /**
   * save to server
   *
   * @param {string} url
   * @param {FormData} pdata
   * @returns
   * @memberof NgxCropperService
   */
  public save(url: string, pdata: FormData) {
    const headers = new Headers({'Content-Type': undefined});
    return this.http.post(url, pdata, {headers}).map((res: Response) => res.json()).catch((error: Response | any) => {
    let errMsg: string;

    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  });
  }
}
