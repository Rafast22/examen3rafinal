import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, Platform, ToastController } from '@ionic/angular';
import axios from 'axios';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.page.html',
  styleUrls: ['./user-edit.page.scss'],
})
export class UserEditPage implements OnInit {
  
  private activatedRoute = inject(ActivatedRoute);
  private platform = inject(Platform);
  usuarios: any = [];
  accion = 'Agregar Amigo';
  private id:number

  constructor(
    private toastController: ToastController,
    private router: Router
  ) {
    this.id = Number(localStorage.getItem('user_id'))

  }

  ionViewWillEnter(): void {
    //verificar si el usuario no esta logueado
    let token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
  }

  ngOnInit() {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    
    axios
      .get(`http://localhost:3000/friends/listUsers/${this.id}` , config)
      .then((result) => {
        if (result.data.success == true) {
          console.log(result.data.usuarios)
          if (result.data.usuarios != null) {
            this.usuarios = result.data.usuarios;
          } else {
            this.usuarios = {};
          }
        } else {
          console.log(result.data.error);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  getBackButtonText() {
    const isIos = this.platform.is('ios');
    return isIos ? 'Inbox' : '';
  }



  addFriend(id:number){
    let config = {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    };
    var data = {
      friend_id: this.id,
      user_id: id,
    };
    axios
    .post('http://localhost:3000/friends/add', data, config)
    .then(async (result) => {
      if (result.data.success == true) {
        this.presentToast(result.data.message);
        this.router.navigate(['/home/shared']);
      } else {
        this.presentToast(result.data.error);
      }
    })
    .catch(async (error) => {
      this.presentToast(error.message);
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
    });
    await toast.present();
  }

 
}
