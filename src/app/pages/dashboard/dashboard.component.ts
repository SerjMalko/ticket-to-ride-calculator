import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {

  data: Observable<any>;

  constructor(private gameService: GameService) {
  }

  ngOnInit(): void {
    this.loadGameData();
  }

  loadGameData() {
    this.data = this.gameService.loadGameResults();

  }

}
