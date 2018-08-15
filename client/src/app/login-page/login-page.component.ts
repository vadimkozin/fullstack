import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AuthService } from '../shared/services/auth.service';
import { User } from '../shared/interfaces';
import { MaterialService } from '../shared/classes/material.service';

// entry: qwerty@mail.ru/123456

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  
  form: FormGroup
  aSub: Subscription

  constructor(private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })

    this.route.queryParams.subscribe((params:Params) => {
      if (params['registered']) {
        MaterialService.toast('Теперь вы можете зайти в систему используя свои данные')
      } else if (params['accessDenied']) {
        MaterialService.toast('Для начала авторизуйтесь в системе')
      } else if (params['sessionFailed']) {
        MaterialService.toast('Сессия истекла. Пожалуйста войдите еще раз')
      }
    })
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }

  onSubmit () {

    console.log("form.value:", this.form.value);
    
    this.form.disable()

    this.aSub = this.auth.login(<User>this.form.value).subscribe(
      () => { 
        console.log('Login success')
        this.router.navigate(['/overview'])
      },
      error => {
        MaterialService.toast(error.error.message) 
        //console.warn(error)
        this.form.enable()
      }
    )
    

  }
}
