import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css',
    '../../../../../assets/vendors/mdi/css/materialdesignicons.min.css',
    '../../../../../assets/vendors/base/vendor.bundle.base.css',
    '../../../../../assets/css/style.css',
  ]
})
export class LoginComponent implements OnInit {
  public loginForm = new FormGroup({
    password: new FormControl(),
    email: new FormControl(),
    remember: new FormControl()
  })

  constructor(
    private _loginService: LoginService,
    private fb: FormBuilder
  ) {
    this.initForm();
   }

  ngOnInit(): void {
    /*
    get('../../../../../assets/vendors/base/vendor.bundle.base.js', () => {});
    get('../../../../../assets/js/off-canvas.js', () => {});
    get('../../../../../assets/js/hoverable-collapse.js', () => {});
    get('../../../../../assets/js/template.js', () => {});
    */
  }

  private initForm(){
    this.loginForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      email:['',[Validators.required, Validators.email]],
      remember:false
    })
  }

  login(){
    this._loginService.login(this.loginForm).subscribe(res => {

    },error=>{
      console.log(error)
    });
  }

}
