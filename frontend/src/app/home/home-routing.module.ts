import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './home.page';
import { IonicModule } from '@ionic/angular';
import { TopicListPage } from '../topic-list/topic-list.page';

const routes: Routes = [
  {path: '', component: HomePage, children:[
    {path: 'topics', loadChildren:() => import("../topic-list/topic-list.module").then((m)=>m.TopicListPageModule)},
    {path: 'shared', loadChildren:() => import("../user-list/user-list.module").then((m)=>m.UserListPageModule)},
    {path: 'themes', loadChildren:() => import("../theme-list/theme-list.module").then((m)=>m.ThemeListPageModule)},
  ]},
  
];

@NgModule({
  imports: [IonicModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
