import { Routes } from '@angular/router';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
    {
        path: "register",
        loadComponent: () =>
            import('./register/register.component').then((x: any) => x.RegisterComponent),
        canActivate: [loginGuard],
    },
    {
        path: "login",
        loadComponent: () =>
            import('./login/login.component').then((x: any) => x.LoginComponent),
        canActivate: [loginGuard],

    }
];