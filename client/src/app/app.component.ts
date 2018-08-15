import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
//На место элемента <router-outlet> будет рендериться компонент, выбранный для обработки запроса.
@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {

  constructor (private auth: AuthService) {}

  ngOnInit() {
    const potentialToken = localStorage.getItem('auth-token')
    if (potentialToken !== null) {
      this.auth.setToken(potentialToken)
    }
  }
}
