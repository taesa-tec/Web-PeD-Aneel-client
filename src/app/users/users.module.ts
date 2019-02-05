import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { NewUserComponent } from './new-user/new-user.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { UserStatusPipe } from './user-status.pipe';
import { EditUserComponent } from './edit-user/edit-user.component';
import { FormComponent } from './form/form.component';
import { MeComponent } from './me/me.component';


@NgModule({
    declarations: [NewUserComponent, ListUsersComponent, UserStatusPipe, EditUserComponent, FormComponent, MeComponent],
    imports: [
        SharedModule,
    ],
    exports: [NewUserComponent, ListUsersComponent, MeComponent]
})
export class UsersModule { }
