import { CommonModule, formatDate } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, Platform, ToastController } from '@ionic/angular';

import axios from 'axios';

@Component({
  selector: 'app-topic-edit',
  templateUrl: './topic-edit.page.html',
  styleUrls: ['./topic-edit.page.scss'],
})
export class TopicEditPage implements OnInit {
  
  private activatedRoute = inject(ActivatedRoute);
  private platform = inject(Platform);
  topic: any = '';
  accion = 'Agregar Topico';
  private id = 0
  constructor(
    private toastController: ToastController,
    private router: Router
  ) {
    this.id = Number(localStorage.getItem('user_id')) ;

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
    const id = this.activatedRoute.snapshot.paramMap.get('id') as string;

    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    axios
      .get(`http://localhost:3000/topics/listarTipicosUsuario/${id}`, config)
      .then((result) => {
        if (result.data.success == true) {
          if (this.id > 0) {
            this.accion = 'Editar Topico';
          }
          if (result.data.topic != null) {
            this.topic = result.data.topic;
          } else {
            this.topic = {};
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

  saveTopic() {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };

    let  data = {}
    let requestUrl = ''
    if(this.topic.id &&  this.topic.id > 0){
       data = {
        id: this.topic.id,
        name: this.topic.name,
        order: this.topic.order,
        priority: this.topic.priority,
        color: this.topic.color,
        owner_user_id: this.id
      };
      requestUrl = 'update'

    }
    else{
       data = {
        name: this.topic.name,
        owner_user_id: this.id
      };
      requestUrl = 'create'
    }

    axios
      .post(`http://localhost:3000/topics/${requestUrl}`, data, config)
      .then(async (result) => {
        if (result.data.success == true) {
          this.presentToast('Topico Guardado');
          this.router.navigate(['/home/topics']);
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
