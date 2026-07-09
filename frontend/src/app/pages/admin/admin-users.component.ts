import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { UserProfile } from '../../services/user.service';

@Component({
  selector: 'app-admin-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-pages.css',
})
export class AdminUsersComponent implements OnInit {
  users: UserProfile[] = [];
  roleFilter = '';
  error = '';

  constructor(
    private readonly adminService: AdminService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  get filteredUsers(): UserProfile[] {
    return this.roleFilter ? this.users.filter(user => user.role === this.roleFilter) : this.users;
  }

  ngOnInit(): void {
    this.adminService.users().subscribe({
      next: users => {
        this.users = users;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Não foi possível carregar os usuários.';
        this.changeDetector.detectChanges();
      },
    });
  }
}
