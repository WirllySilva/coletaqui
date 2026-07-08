import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-schedule-options',
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './schedule-options.component.html',
  styleUrl: './schedule-options.component.css',
})
export class ScheduleOptionsComponent {}
