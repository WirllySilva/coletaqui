import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { RankingEntry } from '../../services/schedule.service';

@Component({
  selector: 'app-admin-ranking',
  imports: [CommonModule],
  templateUrl: './admin-ranking.component.html',
  styleUrl: './admin-pages.css',
})
export class AdminRankingComponent implements OnInit {
  entries: RankingEntry[] = [];
  isLoading = true;
  error = '';

  constructor(
    private readonly adminService: AdminService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.adminService.ranking().subscribe({
      next: entries => {
        this.entries = entries;
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Não foi possível carregar o ranking.';
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
    });
  }
}
