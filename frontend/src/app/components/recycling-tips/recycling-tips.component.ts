import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Tip } from '../../models/tip.model';

@Component({
  selector: 'app-recycling-tips',
  imports: [CommonModule, RouterModule],
  templateUrl: './recycling-tips.component.html',
  styleUrl: './recycling-tips.component.css',
})
export class RecyclingTipsComponent implements OnDestroy {
  private _tips: Tip[] = [];
  currentSlide = 0;
  private autoSlideTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly router: Router,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  @Input() set tips(value: Tip[]) {
    this._tips = value ?? [];
    this.currentSlide = 0;
    this.restartAutoSlide();
  }

  get tips(): Tip[] {
    return this._tips;
  }

  get activeTip(): Tip {
    return this.tips[this.currentSlide] ?? this.tips[0];
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  previous(): void {
    if (this.tips.length) {
      this.currentSlide = (this.currentSlide - 1 + this.tips.length) % this.tips.length;
      this.changeDetector.detectChanges();
      this.restartAutoSlide();
    }
  }

  next(): void {
    if (this.tips.length) {
      this.currentSlide = (this.currentSlide + 1) % this.tips.length;
      this.changeDetector.detectChanges();
      this.restartAutoSlide();
    }
  }

  goTo(index: number): void {
    this.currentSlide = index;
    this.changeDetector.detectChanges();
    this.restartAutoSlide();
  }

  internalRoute(tip: Tip): string | null {
    return tip.internalRoute || null;
  }

  externalLink(tip: Tip): string | null {
    return tip.linkUrl || null;
  }

  detailRoute(tip: Tip): string {
    return `/contents/${tip.id}`;
  }

  openTip(tip: Tip): void {
    const external = this.externalLink(tip);
    if (external) {
      window.open(external, '_blank', 'noopener');
      return;
    }

    void this.router.navigateByUrl(this.internalRoute(tip) || this.detailRoute(tip));
  }

  private restartAutoSlide(): void {
    this.stopAutoSlide();
    if (this.tips.length <= 1) {
      return;
    }

    this.autoSlideTimer = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.tips.length;
      this.changeDetector.detectChanges();
    }, 4000);
  }

  private stopAutoSlide(): void {
    if (this.autoSlideTimer) {
      clearInterval(this.autoSlideTimer);
      this.autoSlideTimer = null;
    }
  }
}
