import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminMaterial, AdminService, UpsertAdminMaterialPayload } from '../../services/admin.service';

@Component({
  selector: 'app-admin-materials',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-materials.component.html',
  styleUrl: './admin-pages.css',
})
export class AdminMaterialsComponent implements OnInit {
  materials: AdminMaterial[] = [];
  editing: AdminMaterial | null = null;
  form: UpsertAdminMaterialPayload = this.emptyForm();
  message = '';
  error = '';

  constructor(
    private readonly adminService: AdminService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  submit(): void {
    this.message = '';
    this.error = '';
    const request = this.editing
      ? this.adminService.updateMaterial(this.editing.id, this.form)
      : this.adminService.createMaterial(this.form);

    request.subscribe({
      next: material => {
        this.materials = this.editing
          ? this.materials.map(item => item.id === material.id ? material : item)
          : [material, ...this.materials].sort((a, b) => a.name.localeCompare(b.name));
        this.message = this.editing ? 'Material atualizado.' : 'Material criado.';
        this.cancelEdit();
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Nao foi possivel salvar o material.';
        this.changeDetector.detectChanges();
      },
    });
  }

  edit(material: AdminMaterial): void {
    this.editing = material;
    this.form = {
      name: material.name,
      description: material.description ?? '',
      hazardous: material.hazardous,
      active: material.active,
    };
  }

  toggle(material: AdminMaterial): void {
    this.adminService.toggleMaterial(material.id).subscribe({
      next: updated => {
        this.materials = this.materials.map(item => item.id === updated.id ? updated : item);
        this.message = updated.active ? 'Material ativado.' : 'Material desativado.';
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Nao foi possivel alterar o status do material.';
        this.changeDetector.detectChanges();
      },
    });
  }

  cancelEdit(): void {
    this.editing = null;
    this.form = this.emptyForm();
  }

  private load(): void {
    this.adminService.materials().subscribe({
      next: materials => {
        this.materials = materials;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Nao foi possivel carregar materiais.';
        this.changeDetector.detectChanges();
      },
    });
  }

  private emptyForm(): UpsertAdminMaterialPayload {
    return { name: '', description: '', hazardous: false, active: true };
  }
}
