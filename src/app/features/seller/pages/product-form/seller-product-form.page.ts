import {
  ChangeDetectorRef,
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

import {
  SellerProductInput,
} from '@features/seller/models/seller-product.models';
import {
  SellerDemoStoreService,
} from '@features/seller/services/seller-demo-store';
import {
  UiToastService,
} from '@shared/services/ui-toast';

const MAX_IMAGE_SIZE_BYTES =
  10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

/**
 * Lado máximo de la imagen guardada en la demo.
 * Se reduce para no exceder la cuota de
 * localStorage.
 */
const STORED_IMAGE_MAX_SIDE = 640;

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
  processingImage = false;

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
            Validators.minLength(3),
            Validators.maxLength(120),
          ],
        },
      ),
      codigo: new FormControl(
        '',
        {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.maxLength(30),
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
            Validators.pattern(/^\d+$/),
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
    private readonly demoStore:
      SellerDemoStoreService,
    private readonly uiToast:
      UiToastService,
    private readonly changeDetectorRef:
      ChangeDetectorRef,
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
      this.loadProduct();
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

  fieldError(
    field:
      | 'nombre'
      | 'codigo'
      | 'precio'
      | 'stock',
  ): string | undefined {
    const control =
      this.productForm.controls[field];

    if (
      !control.touched ||
      control.valid
    ) {
      return undefined;
    }

    if (control.hasError('required')) {
      return 'Este campo es obligatorio';
    }

    if (control.hasError('duplicate')) {
      return 'Ya tienes un producto con este código';
    }

    if (control.hasError('minlength')) {
      return 'Ingresa al menos 3 caracteres';
    }

    if (control.hasError('maxlength')) {
      return 'El texto es demasiado largo';
    }

    if (control.hasError('min')) {
      return field === 'precio'
        ? 'El precio debe ser mayor o igual a S/ 1'
        : 'El stock no puede ser negativo';
    }

    if (control.hasError('pattern')) {
      return 'Ingresa un número entero';
    }

    return 'Valor no válido';
  }

  async handleImageSelection(
    event: Event,
  ): Promise<void> {
    const input =
      event.target as HTMLInputElement;

    const file =
      input.files?.[0];

    if (!file) {
      return;
    }

    if (
      !ALLOWED_IMAGE_TYPES.includes(file.type)
    ) {
      void this.uiToast.error(
        'Selecciona una imagen JPG, PNG o WebP',
      );
      input.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      void this.uiToast.error(
        'La imagen supera el máximo de 10 MB',
      );
      input.value = '';
      return;
    }

    this.processingImage = true;

    try {
      this.imagePreviewUrl =
        await resizeImageToDataUrl(file);
    } catch {
      void this.uiToast.error(
        'No pudimos procesar la imagen',
      );
    } finally {
      this.processingImage = false;
      input.value = '';
      this.changeDetectorRef.markForCheck();
    }
  }

  removeImage(
    input: HTMLInputElement,
  ): void {
    this.imagePreviewUrl = undefined;
    input.value = '';
  }

  saveProduct(): void {
    if (
      this.saving ||
      this.processingImage
    ) {
      return;
    }

    const codigoControl =
      this.productForm.controls.codigo;

    if (
      codigoControl.value.trim() &&
      this.demoStore.isCodeTaken(
        codigoControl.value,
        this.productId,
      )
    ) {
      codigoControl.setErrors({
        duplicate: true,
      });
    }

    if (this.productForm.invalid) {
      this.productForm
        .markAllAsTouched();

      void this.uiToast.warning(
        'Revisa los campos marcados antes de guardar',
      );

      return;
    }

    this.saving = true;
    this.saved = false;

    const input: SellerProductInput = {
      ...this.productForm.getRawValue(),
      imageUrl:
        this.imagePreviewUrl ?? null,
    };

    try {
      if (this.productId !== null) {
        this.demoStore.updateProduct(
          this.productId,
          input,
        );
      } else {
        this.demoStore.createProduct(input);
      }
    } catch (error) {
      this.saving = false;

      void this.uiToast.error(
        isQuotaError(error)
          ? 'No hay espacio en el almacenamiento local. Usa una imagen más liviana.'
          : 'No pudimos guardar el producto',
      );

      return;
    }

    this.saving = false;
    this.saved = true;

    void this.uiToast.success(
      this.isEditMode
        // MODO DEMO: '... (modo demo)'
        ? 'Cambios guardados correctamente'
        : 'Producto registrado correctamente',
    );

    window.setTimeout(() => {
      void this.router.navigate([
        '/vendedor/productos',
      ]);
    }, 900);
  }

  cancel(): void {
    void this.router.navigate([
      '/vendedor/productos',
    ]);
  }

  private loadProduct(): void {
    const product =
      this.productId !== null
        ? this.demoStore.getProduct(
          this.productId,
        )
        : undefined;

    if (!product) {
      void this.uiToast.warning(
        'El producto no existe o fue eliminado',
      );

      void this.router.navigate([
        '/vendedor/productos',
      ]);

      return;
    }

    this.productForm.patchValue({
      nombre: product.nombre,
      codigo: product.codigo,
      categoria: product.categoria,
      descripcion: product.descripcion,
      precio: product.precio,
      stock: product.stock,
      marca: product.marca,
      material: product.material,
      tallas: product.tallas,
      colores: product.colores,
      activo: product.activo,
      consentimientoIa:
        product.consentimientoIa,
    });

    this.imagePreviewUrl =
      product.imageUrl ?? undefined;
  }
}

function isQuotaError(
  error: unknown,
): boolean {
  return (
    error instanceof DOMException &&
    (error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
  );
}

function resizeImageToDataUrl(
  file: File,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl =
      URL.createObjectURL(file);

    const image = new Image();

    image.onload = () => {
      const scale = Math.min(
        1,
        STORED_IMAGE_MAX_SIDE /
          Math.max(image.width, image.height),
      );

      const canvas =
        document.createElement('canvas');

      canvas.width =
        Math.round(image.width * scale);
      canvas.height =
        Math.round(image.height * scale);

      const context =
        canvas.getContext('2d');

      URL.revokeObjectURL(objectUrl);

      if (!context) {
        reject(new Error('Canvas no disponible'));
        return;
      }

      context.drawImage(
        image,
        0,
        0,
        canvas.width,
        canvas.height,
      );

      resolve(
        canvas.toDataURL('image/jpeg', 0.82),
      );
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Imagen no válida'));
    };

    image.src = objectUrl;
  });
}
