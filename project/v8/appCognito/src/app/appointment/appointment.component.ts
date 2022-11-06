import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { API, Auth } from 'aws-amplify';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css'],
})
export class AppointmentComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  createAppointment() {
    API.post('api', '/create', {
      body: {
        name: 'Sergio Iván Hidalgo Cáceres',
        date: '2022-11-05 12:17:00',
        countryISO: 'PE',
      },
    });
  }

  logout() {
    Auth.signOut()
      .then((response) => {
        console.log(response);
        this.router.navigate(['/login']);
      })
      .catch(console.log);
  }
}
