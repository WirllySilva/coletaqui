import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Tip } from '../../models/tip.model';

@Component({
  selector: 'app-recycling-tips',
  imports: [CommonModule, RouterModule],
  templateUrl: './recycling-tips.component.html',
  styleUrl: './recycling-tips.component.css',
})
export class RecyclingTipsComponent {
  @Input() tips: Tip[] = [];
  currentSlide = 0;

  get activeTip(): Tip {
    return this.tips[this.currentSlide] ?? this.tips[0];
  }

  previous(): void {
    if (this.tips.length) {
      this.currentSlide = (this.currentSlide - 1 + this.tips.length) % this.tips.length;
    }
  }

  next(): void {
    if (this.tips.length) {
      this.currentSlide = (this.currentSlide + 1) % this.tips.length;
    }
  }

  goTo(index: number): void {
    this.currentSlide = index;
  }
}
