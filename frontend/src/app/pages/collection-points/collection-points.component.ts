import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { CollectionPoint, UserService } from '../../services/user.service';

@Component({
  selector: 'app-collection-points',
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './collection-points.component.html',
  styleUrl: './collection-points.component.css',
})
export class CollectionPointsComponent implements OnInit {
  points: CollectionPoint[] = [];
  isLoading = true;
  error = '';

  constructor(
    private readonly userService: UserService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.userService.listCollectionPoints().subscribe({
      next: points => {
        this.points = points;
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Não foi possível carregar os pontos de coleta.';
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
    });
  }

  materials(point: CollectionPoint): string[] {
    if (!point.materials) {
      return [];
    }

    return point.materials.split(',').map(material => material.trim()).filter(Boolean);
  }
}
