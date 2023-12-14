import { CommonModule, formatDate } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, Platform, ToastController } from '@ionic/angular';

import axios from 'axios';

@Component({
  selector: 'app-theme-edit',
  templateUrl: './theme-edit.page.html',
  styleUrls: ['./theme-edit.page.scss'],
})
export class ThemeEditPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private platform = inject(Platform);
  theme: any = '';
  private id = 0

  accion = 'Agregar Tema';

  constructor(
    private toastController: ToastController,
    private router: Router
  ) {

    this.id = Number(localStorage.getItem('user_id'))

  }

  ngOnInit() {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    //con este comando se recupera el id que se pasa
    const id = this.activatedRoute.snapshot.paramMap.get('id') as string;
    // this.message = this.data.getMessageById(parseInt(id, 10));
    axios
      .get('http://localhost:3000/themes/buscarPorCodigo/' + id, config)
      .then((result) => {
        if (result.data.success == true) {
          if (id !== '0') {
            this.accion = 'Editar Tema';
          }
          if (result.data.theme != null) {
            this.theme = result.data.theme;
          } else {
            this.theme = {};
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

  saveUser() {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    let data:any;
    let requestUrl 
    if(this.theme.id && this.theme.id>0){

       data = {
        id: this.theme.id,
        name: this.theme.name,
        description: this.theme.description,
        keywords: this.theme.keywords,
        owner_user_id: this.id,
      };
      requestUrl = 'update'

    }
    else{

     data = {
      name: this.theme.name,
      description: this.theme.description,
      keywords: this.theme.keywords,
      owner_user_id: this.id,
    };
    requestUrl = 'create'

    }
  
    axios
      .post(`http://localhost:3000/themes/${requestUrl}`, data, config)
      .then(async (result) => {
        if (result.data.success == true) {
          this.presentToast('Tema Guardado');
          this.router.navigate(['/home/themes']);
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
