import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import axios from 'axios';

@Component({
  selector: 'app-topic-list',
  templateUrl: './topic-list.page.html',
  styleUrls: ['./topic-list.page.scss'],
})


export class TopicListPage implements OnInit {
  topicos: any = [];
  topicosCompartidosConmigo: any = [];
  textoTopicosCompartidos: string = "Topicos compartidos con el Usuario:"

  public alertButtons = ['Aceptar', 'Cancelar'];
  private user_id:number
  private token:string
  private config:any

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router
  ) {
    this.user_id = Number(localStorage.getItem('user_id'))
    this.token = String(localStorage.getItem('token'));
     this.config = {
      headers: {
        Authorization: this.token,
      },
    };
   }

  ionViewWillEnter(): void {
    //verificar si el usuario no esta logueado
    if (!this.token) {
      this.router.navigate(['/login']);
      return;
    }
    this.getTopics();

  }

  ngOnInit() {
  }

  async confirmDelete(id: string) {
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message: 'Desea eliminar el registro?',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.deleteTopic(id);
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

  getTopics() {
   
    axios
      .get(`http://localhost:3000/topics/listarTipicosUsuario/${this.user_id}` , this.config)
      .then((result) => {
        if (result.data.success == true) {
          this.topicos = result.data.topicos;

        } else {
          console.log(result.data.error);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  deleteTopic(id: any) {
    let config = {
      headers: {
        Authorization: this.token,
      },
    };
    axios
      .delete('http://localhost:3000/topics/delete/' + id, config)
      .then((result) => {
        if (result.data.success == true) {
          this.presentToast('Topico Eliminado');
          this.getTopics();
        } else {
          this.presentToast(result.data.error);
        }
      })
      .catch((error) => {
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

  //Ordenar visualmente
  reorder(event: any) {
    let order = {
      from:0,
      to:0
    }
    const moverItem = this.topicos.splice(event.detail.from, 1)[0];
    this.topicos.splice(event.detail.to, 0, moverItem);
   order.from = event.detail.from
   order.to = event.detail.to
   console.log(event.detail.to, event.detail.from)
    axios
    .post(`http://localhost:3000/topics/saveOrder`, order , this.config)
    .then((result) => {
      if (result.data.success == true) {

      } else {
        console.log(result.data.error);
      }
    })
    .catch((error) => {
      console.log(error.message);
    });
    event.detail.complete();

  }

  sortAZ() {
    this.topicos.sort((a: any, b: any) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }

  sortZA() {
    this.topicos.sort((a: any, b: any) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA > nameB) {
        return -1;
      }
      if (nameA < nameB) {
        return 1;
      }
      return 0;
    });
  }

  sortIdAsc() {
    this.topicos.sort((a: any, b: any) => a.id - b.id);
  }

  sortIdDesc() {
    this.topicos.sort((a: any, b: any) => b.id - a.id);
  }



  editTopic(){
    this.router.navigate(['/topic-edit/0'])
  }
}
