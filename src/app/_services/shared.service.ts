import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
	// sidemenuStatus:boolean=false;
	// if(localStorage.getItem('currentUser')){
		
	// }
  private sideMenuStateSource = new BehaviorSubject<boolean>(false);
	sideMenuState = this.sideMenuStateSource.asObservable();

  constructor() {
	  
  console.log('sideMenuState',this.sideMenuState)
  }

	updateSideMenuState(state: boolean) {
			this.sideMenuStateSource.next(state);
	}
}
