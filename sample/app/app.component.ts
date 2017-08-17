import { Component } from '@angular/core';

@Component({
  selector: 'ngx-app',
  templateUrl: './app.component.html'
})

export class AppComponent {
  constructor() {
    console.warn('test');
  }
}
