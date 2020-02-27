import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//import { SettingsComponent } from '../settings.component';

import { AuthenticationService } from '@app/_services';

@Component({
  selector: 'settings-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  constructor(
    
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    //private settingsComponent:SettingsComponent
  ) { }

  ngOnInit() {
  }


}
