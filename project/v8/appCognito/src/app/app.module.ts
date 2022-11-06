import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import Amplify from 'aws-amplify';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_SuNc908n7',
    userPoolWebClientId: '60l2q3nb4gsunrtlhs7ua22v7u',
    identityPoolId: 'us-east-1:7f19b657-94aa-490c-9f4f-30d5a2ffce3c',
    authenticationFlowType: 'USER_PASSWORD_AUTH',
  },
  API: {
    endpoints: [
      {
        name: 'api',
        endpoint: 'https://ztqd6ip0o7.execute-api.us-east-1.amazonaws.com/dev',
        region: 'us-east-1',
      },
    ],
  },
});

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    ConfirmComponent,
    LoginComponent,
    AppointmentComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
