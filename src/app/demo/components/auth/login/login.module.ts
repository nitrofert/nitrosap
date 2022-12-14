import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';

import { LoginRoutingModule } from './login-routing.module';
import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';

/*import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {MessageModule} from 'primeng/message';
import {MessagesModule} from 'primeng/messages';*/

@NgModule({
    imports: [
        CommonModule,
        LoginRoutingModule,
        /*ButtonModule,
        CheckboxModule,
        InputTextModule,*/
        FormsModule,
        /*PasswordModule,
        DropdownModule,
        MessageModule,
        MessagesModule*/
        PrimengModule
    ],
    declarations: [LoginComponent]
})
export class LoginModule { }
