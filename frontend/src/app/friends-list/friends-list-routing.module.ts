import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FriendsListPage } from './friends-list.page';
import { IonicModule } from '@ionic/angular';

const routes: Routes = [
  {
    path: '',
    component: FriendsListPage
  }
];

@NgModule({
  imports: [IonicModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FriendsListPageRoutingModule {}
