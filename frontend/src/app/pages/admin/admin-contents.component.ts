import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminContent, AdminContentType, AdminService, UpsertAdminContentPayload } from '../../services/admin.service';

@Component({
  selector: 'app-admin-contents',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-contents.component.html',
  styleUrl: './admin-pages.css',
})
export class AdminContentsComponent implements OnInit {
  @ViewChild('bodyEditor') bodyEditor?: ElementRef<HTMLDivElement>;
  @ViewChild('imageFileInput') imageFileInput?: ElementRef<HTMLInputElement>;

  contents: AdminContent[] = [];
  editing: AdminContent | null = null;
  form: UpsertAdminContentPayload = this.emptyForm();
  selectedImageFile: File | null = null;
  selectedImagePreview = '';
  message = '';
  error = '';

  types: { value: AdminContentType; label: string }[] = [
    { value: 'TIP', label: 'Dica' },
    { value: 'NEWS', label: 'Notícia' },
    { value: 'VIDEO', label: 'Vídeo' },
    { value: 'CAMPAIGN', label: 'Campanha' },
    { value: 'NOTICE', label: 'Comunicado' },
  ];

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

    const payload = this.normalizedPayload();
    const request = this.editing
      ? this.adminService.updateContent(this.editing.id, payload)
      : this.adminService.createContent(payload);

    request.subscribe({
      next: content => {
        this.saveImageIfNeeded(content);
      },
      error: () => {
        this.error = 'Não foi possível salvar o conteúdo. Confira os dados e tente novamente.';
        this.changeDetector.detectChanges();
      },
    });
  }

  edit(content: AdminContent): void {
    this.editing = content;
    this.clearSelectedImage();
    this.form = {
      title: content.title,
      summary: content.summary,
      type: content.type,
      linkUrl: content.linkUrl ?? '',
      internalRoute: content.internalRoute ?? '',
      imageUrl: content.imageUrl ?? '',
      body: content.body ?? '',
      displayOrder: content.displayOrder,
      active: content.active,
      expiresAt: this.toDateTimeLocal(content.expiresAt),
    };
    setTimeout(() => this.syncEditorFromForm());
  }

  toggle(content: AdminContent): void {
    this.adminService.toggleContent(content.id).subscribe({
      next: updated => {
        this.contents = this.contents.map(item => item.id === updated.id ? updated : item);
        this.message = updated.active ? 'Conteúdo ativado.' : 'Conteúdo desativado.';
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Não foi possível alterar o status do conteúdo.';
        this.changeDetector.detectChanges();
      },
    });
  }

  delete(content: AdminContent): void {
    const confirmed = window.confirm(`Excluir "${content.title}"? Esta ação não pode ser desfeita.`);
    if (!confirmed) {
      return;
    }

    this.adminService.deleteContent(content.id).subscribe({
      next: () => {
        this.contents = this.contents.filter(item => item.id !== content.id);
        this.message = 'Conteúdo excluído.';
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Não foi possível excluir o conteúdo.';
        this.changeDetector.detectChanges();
      },
    });
  }

  cancelEdit(): void {
    this.editing = null;
    this.form = this.emptyForm();
    this.clearSelectedImage();
    setTimeout(() => this.syncEditorFromForm());
  }

  typeLabel(type: AdminContentType): string {
    return this.types.find(item => item.value === type)?.label ?? type;
  }

  format(command: string, value?: string): void {
    this.bodyEditor?.nativeElement.focus();
    document.execCommand(command, false, value);
    this.syncBodyFromEditor();
  }

  syncBodyFromEditor(): void {
    this.form.body = this.bodyEditor?.nativeElement.innerHTML ?? '';
  }

  onImageFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.clearSelectedImage(false);
    this.selectedImageFile = file;

    if (file) {
      this.selectedImagePreview = URL.createObjectURL(file);
    }
  }

  removeImage(content: AdminContent): void {
    this.adminService.removeContentImage(content.id).subscribe({
      next: updated => {
        this.contents = this.contents.map(item => item.id === updated.id ? updated : item);
        if (this.editing?.id === updated.id) {
          this.edit(updated);
        }
        this.message = 'Imagem removida.';
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Não foi possível remover a imagem.';
        this.changeDetector.detectChanges();
      },
    });
  }

  removeEditingImage(): void {
    if (this.editing) {
      this.removeImage(this.editing);
    }
  }

  private load(): void {
    this.adminService.contents().subscribe({
      next: contents => {
        this.contents = this.sorted(contents);
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.error = 'Não foi possível carregar os conteúdos.';
        this.changeDetector.detectChanges();
      },
    });
  }

  private normalizedPayload(): UpsertAdminContentPayload {
    return {
      ...this.form,
      linkUrl: this.blankToNull(this.form.linkUrl),
      internalRoute: this.form.linkUrl || this.form.body ? null : this.editing?.internalRoute ?? null,
      imageUrl: this.selectedImageFile ? null : this.blankToNull(this.form.imageUrl),
      body: this.blankToNull(this.form.body),
      expiresAt: this.form.expiresAt ? new Date(this.form.expiresAt).toISOString() : null,
    };
  }

  private emptyForm(): UpsertAdminContentPayload {
    return {
      title: '',
      summary: '',
      type: 'TIP',
      linkUrl: '',
      internalRoute: '',
      imageUrl: '',
      body: '',
      displayOrder: 0,
      active: true,
      expiresAt: null,
    };
  }

  private syncEditorFromForm(): void {
    if (this.bodyEditor) {
      this.bodyEditor.nativeElement.innerHTML = this.form.body ?? '';
    }
  }

  private saveImageIfNeeded(content: AdminContent): void {
    if (!this.selectedImageFile) {
      this.applySavedContent(content);
      return;
    }

    this.adminService.uploadContentImage(content.id, this.selectedImageFile).subscribe({
      next: updated => this.applySavedContent(updated),
      error: () => {
        this.error = 'Conteúdo salvo, mas não foi possível enviar a imagem.';
        this.applySavedContent(content, false);
      },
    });
  }

  private applySavedContent(content: AdminContent, clearForm = true): void {
    this.contents = this.editing
      ? this.contents.map(item => item.id === content.id ? content : item)
      : [content, ...this.contents];
    this.contents = this.sorted(this.contents);
    this.message = this.editing ? 'Conteúdo atualizado.' : 'Conteúdo criado.';
    if (clearForm) {
      this.cancelEdit();
    }
    this.changeDetector.detectChanges();
  }

  clearSelectedImage(clearInput = true): void {
    if (this.selectedImagePreview) {
      URL.revokeObjectURL(this.selectedImagePreview);
    }
    this.selectedImageFile = null;
    this.selectedImagePreview = '';
    if (clearInput && this.imageFileInput) {
      this.imageFileInput.nativeElement.value = '';
    }
  }

  private sorted(contents: AdminContent[]): AdminContent[] {
    return [...contents].sort((a, b) => a.displayOrder - b.displayOrder || a.title.localeCompare(b.title));
  }

  private blankToNull(value: string | null | undefined): string | null {
    return value && value.trim() ? value.trim() : null;
  }

  private toDateTimeLocal(value: string | null | undefined): string | null {
    if (!value) {
      return null;
    }

    const date = new Date(value);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  }
}
