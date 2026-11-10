import {
  Component,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  IonContent,
  IonIcon,
} from '@ionic/angular';
import {
  addIcons,
} from 'ionicons';
import {
  arrowBackOutline,
  checkmarkCircleOutline,
  cloudUploadOutline,
  imageOutline,
  informationCircleOutline,
  saveOutline,
  shieldCheckmarkOutline,
  trashOutline,
} from 'ionicons/icons';

@Component({
  selector:
    'app-seller-product-form',
  templateUrl:
    './seller-product-form.page.html',
  styleUrls: [
    './seller-product-form.page.scss',
  ],
  imports: [
    IonContent,
    IonIcon,
    ReactiveFormsModule,
  ],
})
export class SellerProductFormPage
  implements OnInit {
  imagePreviewUrl?: string;

  saving = false;
  saved = false;

  readonly categories = [
    'Polos',
    'Poleras',
    'Casacas',
    'Pantalones',
    'Vestidos',
    'Accesorios',
  ];

  readonly productForm =
    new FormGroup({
      nombre: new FormControl(
        '',
        {
          nonNullable: true,
          validators: [
            Validators.required,
          ],
        },
      ),
      codigo: new FormControl(
        '',
        {
          nonNullable: true,
          validators: [
            Validators.required,
          ],
        },
      ),
      categoria: new FormControl(
        'Polos',
        {
          nonNullable: true,
          validators: [
            Validators.required,
          ],
        },
      ),
      descripcion: new FormControl(
        '',
        {
          nonNullable: true,
        },
      ),
      precio: new FormControl(
        0,
        {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.min(1),
          ],
        },
      ),
      stock: new FormControl(
        0,
        {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.min(0),
          ],
        },
      ),
      marca: new FormControl(
        '',
        {
          nonNullable: true,
        },
      ),
      material: new FormControl(
        '',
        {
          nonNullable: true,
        },
      ),
      tallas: new FormControl(
        '',
        {
          nonNullable: true,
        },
      ),
      colores: new FormControl(
        '',
        {
          nonNullable: true,
        },
      ),
      activo: new FormControl(
        true,
        {
          nonNullable: true,
        },
      ),
      consentimientoIa:
        new FormControl(
          false,
          {
            nonNullable: true,
            validators: [
              Validators.requiredTrue,
            ],
          },
        ),
    });

  constructor(
    private readonly route:
      ActivatedRoute,
    private readonly router:
      Router,
  ) {
    addIcons({
      arrowBackOutline,
      checkmarkCircleOutline,
      cloudUploadOutline,
      imageOutline,
      informationCircleOutline,
      saveOutline,
      shieldCheckmarkOutline,
      trashOutline,
    });
  }

  ngOnInit(): void {
    if (this.isEditMode) {
      this.loadMockProduct();
    }
  }

  get productId(): number | null {
    const value =
      this.route.snapshot.paramMap
        .get('productoId');

    if (!value) {
      return null;
    }

    const productId = Number(value);

    return Number.isInteger(productId)
      ? productId
      : null;
  }

  get isEditMode(): boolean {
    return this.productId !== null;
  }

  get pageTitle(): string {
    return this.isEditMode
      ? 'Editar producto'
      : 'Nuevo producto';
  }

  get submitLabel(): string {
    return this.isEditMode
      ? 'Guardar cambios'
      : 'Registrar producto';
  }

  selectImage(
    input: HTMLInputElement,
  ): void {
    input.click();
  }

  handleImageSelection(
    event: Event,
  ): void {
    const input =
      event.target as HTMLInputElement;

    const file =
      input.files?.[0];

    if (!file) {
      return;
    }

    if (this.imagePreviewUrl) {
      URL.revokeObjectURL(
        this.imagePreviewUrl,
      );
    }

    this.imagePreviewUrl =
      URL.createObjectURL(file);
  }

  removeImage(
    input: HTMLInputElement,
  ): void {
    if (this.imagePreviewUrl) {
      URL.revokeObjectURL(
        this.imagePreviewUrl,
      );
    }

    this.imagePreviewUrl = undefined;
    input.value = '';
  }

  saveProduct(): void {
    if (
      this.productForm.invalid ||
      this.saving
    ) {
      this.productForm
        .markAllAsTouched();

      return;
    }

    this.saving = true;
    this.saved = false;

    window.setTimeout(() => {
      this.saving = false;
      this.saved = true;

      window.setTimeout(() => {
        void this.router.navigate([
          '/vendedor/productos',
        ]);
      }, 900);
    }, 700);
  }

  cancel(): void {
    void this.router.navigate([
      '/vendedor/productos',
    ]);
  }

  private loadMockProduct(): void {
    this.productForm.patchValue({
      nombre:
        'Polo Topitop oversize marrón',
      codigo: 'TOP-001',
      categoria: 'Polos',
      descripcion:
        'Polo oversize de algodón, diseño urbano y acabado suave.',
      precio: 79.9,
      stock: 14,
      marca: 'Topitop',
      material: 'Algodón',
      tallas: 'S, M, L, XL',
      colores:
        'Marrón, Beige',
      activo: true,
      consentimientoIa: true,
    });

    this.imagePreviewUrl =
      'https://qegspgcihjbzgbvgsumz.supabase.co/storage/v1/object/public/productos/9/6c73bfcc-50da-4c6c-8aae-5eb2f902fa65.webp';
  }
}