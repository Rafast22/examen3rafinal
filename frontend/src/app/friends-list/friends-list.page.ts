import { Component, OnInit, inject } from '@angular/core';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.page.html',
  styleUrls: ['./friends-list.page.scss'],
})
export class FriendsListPage implements OnInit {
  usuarios: any = [];
  usuario: any = '';
  resDelete = '';
  private platform = inject(Platform);
  isAlertOpen = false;
  public alertButtons = ['Aceptar', 'Cancelar'];
  private id:number

  constructor(    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router) { 
    this.id = Number(localStorage.getItem('user_id'));

  }

  ionViewWillEnter(): void {
    //verificar si el usuario no esta logueado
    let token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.getUsers();
  }
  ngOnInit() {
  }

  deleteUser(id: any) {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    axios
      .delete('http://localhost:3000/friends/delete/' + id, config)
      .then((result) => {
        if (result.data.success == true) {
          this.presentToast('Amigo Eliminado');
          this.getUsers();
        } else {
          this.presentToast(result.data.error);
        }
      })
      .catch((error) => {
        this.presentToast(error.message);
      });
  }


  async confirmDelete(id: string) {
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message: 'Desea eliminar este amigo!?',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.deleteUser(id);
          },
        },
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Cancelado');
          },
        },
      ],
    });
    await alert.present();
  }
  getBackButtonText() {
    const isIos = this.platform.is('ios');
    return isIos ? 'Inbox' : '';
  }
  getUsers() {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    axios
      .get(`http://localhost:3000/friends/list/${this.id}`, config)
      .then((result) => {
        if (result.data.success == true) {
          this.usuarios = result.data.usuarios;
        } else {
          console.log(result.data.error);
        }
      })
      .catch((error) => {
        console.log(error.message);
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
