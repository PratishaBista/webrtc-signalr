import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "register",
        loadComponent: () =>
            import('./register/register.component').then((x: any) => x.RegisterComponent),
    }
];