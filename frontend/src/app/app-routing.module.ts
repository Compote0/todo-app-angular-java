import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskSearchComponent } from './components/task/search/task-search.component';

export const routes: Routes = [
    { path: '', component: TaskSearchComponent },
    { path: 'tasks', component: TaskSearchComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
