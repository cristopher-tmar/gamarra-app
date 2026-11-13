import {
  ChangeDetectorRef,
  Component,
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
import { finalize } from 'rxjs';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  eyeOffOutline,
  eyeOutline,
  lockClosedOutline,
  mailOutline,
} from 'ionicons/icons';

import {
  getHomeUrlForRole,
} from '@features/auth/guards/role.guard';
import {
  UserRole,
} from '@features/auth/models/auth.models';
import {
  AuthService,
} from '@features/auth/services/auth';
import {
  UiButtonComponent,
} from '@shared/components/ui-button/ui-button.component';
import {
  UiInputComponent,
} from '@shared/components/ui-input/ui-input.component';
import {
  UiToastService,
} from '@shared/services/ui-toast';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    IonContent,
    IonIcon,
    ReactiveFormsModule,
    UiButtonComponent,
    UiInputComponent,
  ],
})
export class LoginPage {
  loading = false;
  showPassword = false;

  readonly loginForm = new FormGroup({
    correo: new FormControl(
      '',
      {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.email,
        ],
      },
    ),
    password: new FormControl(
      '',
      {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(6),
        ],
      },
    ),
  });

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly uiToast: UiToastService,
    private readonly changeDetectorRef:
      ChangeDetectorRef,
  ) {
    addIcons({
      arrowBackOutline,
      eyeOffOutline,
      eyeOutline,
      lockClosedOutline,
      mailOutline,
    });
  }

  get correoError(): string | undefined {
    const control =
      this.loginForm.controls.correo;

    if (
      !control.touched ||
      control.valid
    ) {
      return undefined;
    }

    if (control.hasError('required')) {
      return 'Ingresa tu correo electrónico';
    }

    return 'Ingresa un correo electrónico válido';
  }

  get passwordError():
    string | undefined {
    const control =
      this.loginForm.controls.password;

    if (
      !control.touched ||
      control.valid
    ) {
      return undefined;
    }

    if (control.hasError('required')) {
      return 'Ingresa tu contraseña';
    }

    return 'La contraseña debe tener al menos 6 caracteres';
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  goBack(): void {
    void this.router.navigate([
      '/catalogo',
    ]);
  }

  submit(): void {
    if (
      this.loginForm.invalid ||
      this.loading
    ) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.authService
      .login(this.loginForm.getRawValue())
      .pipe(
        finalize(() => {
          this.loading = false;

          this.changeDetectorRef
            .markForCheck();
        }),
      )
      .subscribe({
        next: (response) => {
          void this.uiToast.success(
            `Bienvenido, ${response.usuario.nombres}`,
          );

          const returnUrl =
            this.getSafeReturnUrl(
              response.usuario.rol,
            );

          void this.router.navigateByUrl(
            returnUrl,
          );
        },
        error: (error) => {
          const message =
            error.error?.message;

          void this.uiToast.error(
            Array.isArray(message)
              ? message[0]
              : message ??
                'No pudimos iniciar sesión',
          );
        },
      });
  }

  showRegisterComingSoon(): void {
    void this.uiToast.info(
      'El registro estará disponible próximamente',
    );
  }

  private getSafeReturnUrl(
    role: UserRole,
  ): string {
    const returnUrl =
      this.activatedRoute.snapshot
        .queryParamMap
        .get('returnUrl');

    if (
      returnUrl === '/mi-cuenta' ||
      returnUrl === '/favoritos'
    ) {
      return returnUrl;
    }

    if (
      role === 'COMERCIANTE' &&
      returnUrl?.startsWith('/vendedor/')
    ) {
      return returnUrl;
    }

    return getHomeUrlForRole(role);
  }
}