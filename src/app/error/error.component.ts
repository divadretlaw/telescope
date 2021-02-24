import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  message: string;

  private subscription: Subscription
  
  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    this.subscription = this.activatedRoute.queryParamMap.subscribe(params => {
      switch (params.get('reason') || 'default') {
        case 'rocket':
          this.message = 'Rocket is unavailable.';
          break;
        default:
          this.message = 'Unknown error.';
          break;
      }    
    });
  }

  ngOnInit(): void {
  }

  public goBack() {
    this.router.navigateByUrl("/");
  }

}
