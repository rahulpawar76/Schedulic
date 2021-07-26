import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private sideMenuStateSource = new BehaviorSubject<boolean>(false);
	sideMenuState = this.sideMenuStateSource.asObservable();

  constructor() {}

	updateSideMenuState(state: boolean) {
			this.sideMenuStateSource.next(state);
	}
}
