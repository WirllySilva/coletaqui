import { CommonModule, Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Tip } from '../../models/tip.model';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-content-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './content-detail.component.html',
  styleUrl: './content-detail.component.css',
})
export class ContentDetailComponent implements OnInit {
  content: Tip | null = null;
  error = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly contentService: ContentService,
    private readonly location: Location,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const contentId = this.route.snapshot.paramMap.get('contentId');
    if (!contentId) {
      this.error = 'Conteúdo não encontrado.';
      return;
    }

    this.contentService.show(contentId).subscribe({
      next: content => {
        this.content = content;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Não foi possível carregar este conteúdo.';
        this.changeDetector.detectChanges();
      },
    });
  }

  back(): void {
    this.location.back();
  }
}
