import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { GameModel } from 'src/app/models/game.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {

  data: Observable<Array<GameModel>>;

  constructor(private gameService: GameService, private router: Router) {
  }

  showDetail(data: GameModel) {
    this.router.navigate(['/game-setting', {id: data.id}]);
  }

  ngOnInit(): void {
    this.loadGameData();
  }

  loadGameData() {
    this.data = this.gameService.loadGameResults();

  }

}
