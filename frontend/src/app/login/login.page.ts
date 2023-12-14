import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, Platform, ToastController } from '@ionic/angular';
import axios from 'axios';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public get isRegister():boolean{
    return this.isNuevoUsuario;
  }


  private activatedRoute = inject(ActivatedRoute);
  private platform = inject(Platform);
  usuario: any = '';
  private isNuevoUsuario:boolean;

  constructor(
    private toastController: ToastController,
    private router: Router
  ) {
    this.usuario = {};
    this.isNuevoUsuario = false;
   }

  ngOnInit() {
    //con este comando se recupera el id que se pasa
    const id = this.activatedRoute.snapshot.paramMap.get('id') as string;
    
  }

  getBackButtonText() {
    const isIos = this.platform.is('ios');
    return isIos ? 'Inbox' : '';
  }

  loginUser() {
    if(!this.onBeforeLogin()) return;
    var data = {
      email: this.usuario.email,
      password: this.usuario.password,
    };
    axios
      .post('http://localhost:3000/user/login', data)
      .then(async (result) => {        
        if (result.data.success == true) {
          this.presentToast('Bienvenido a StudyApp');
          localStorage.setItem('token', result.data.token);
          localStorage.setItem('user_id', result.data.user_id);
          localStorage.setItem('username', result.data.username);
          console.log(result.data.user_id)
          this.router.navigate(['/home']);
        } else {

          this.presentToast(result.data.error + 'error');
        }
      })
      .catch(async (error) => {
        this.presentToast(error.message +'teste');
      });
  }
  async  registerUser() {
    if(!this.onBeforeRegister()) return;
   
    var data = {
      email: this.usuario.email,
      name: this.usuario.nombre,
      last_name: this.usuario.apellido,
      password: this.usuario.password,
    };
    await axios
      .post('http://localhost:3000/user/register', data)
      .then(async (result) => {        
        if (result.data.success == true) {
          console.log('Registrado')
          console.log(result.data)
          this.isNuevoUsuario = false;
          this.presentToast(result.data.message + 'trs')

        } else {
          this.presentToast(result.data.error + ' teste');
          this.usuario.email = '';      
          this.usuario.password = '';          
        }
      })
      .catch(async (error) => {
        this.presentToast(error.message + ' teste');
      });
  }
  clickRegister(){
    this.isNuevoUsuario=true;
  }
  clickLogin(){
    this.isNuevoUsuario=false;
  }

  ionViewWillEnter(): void {
    //verificar si el usuario esta logueado
    let token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/home']);
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
    });
    await toast.present();
  }
  private onBeforeRegister():boolean {
    
    if(!this.usuario.nombre || this.usuario.nombre == '' ) {
      this.presentToast("El nombre es obligatorio")
      return false;
    }
    if(!this.usuario.apellido || this.usuario.apellido == '') {
      this.presentToast("El Apellido es obligatorio")
      return false;
    }
    if(!this.onBeforeLogin()) return false;

    return true
  }
   public get onValidateEmail():boolean{
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(this.usuario.email && this.usuario.email != ''){
      if(!emailRegex.test(this.usuario.email)) {
        return false;
      }
    }
    
    return true;
    
  }

  private onBeforeLogin():boolean {

    if( this.usuario.email  && !this.onValidateEmail) {
      this.presentToast('El email es obligatorio')
      return false;
    }

    if(!this.usuario.password || this.usuario.password == '') {
      this.presentToast('El Password es obligatorio')
      return false;
    }
    return true
  }
}
