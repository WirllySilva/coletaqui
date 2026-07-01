import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { GuideData } from '../../models/guide.model';

@Component({
  selector: 'app-guide-page',
  imports: [CommonModule, FooterComponent],
  templateUrl: './guide-page.component.html',
  styleUrl: './guide-page.component.css',
})
export class GuidePageComponent {
  @Input({ required: true }) data!: GuideData;
}
