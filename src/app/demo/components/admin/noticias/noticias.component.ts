import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AdminService } from 'src/app/demo/service/admin.service';
import { AuthService } from 'src/app/demo/service/auth.service';

@Component({
  selector: 'app-noticias',
  providers: [MessageService, ConfirmationService],
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.scss']
})
export class NoticiasComponent  implements OnInit {

  noticiaSeleccionada:any[]= [];
  urlBreadCrumb:string ="";
  loading:boolean = true;

  noticias:any[]= [];


  @ViewChild('filter') filter!: ElementRef;
  

  constructor(private adminService:AdminService,
    private router:Router,
    public authService: AuthService) { }

    ngOnInit(): void {
      this.urlBreadCrumb = this.router.url;
      this.getNoticias();
    }

    getNoticias(){
        this.adminService.getNoticias(this.authService.getToken())
            .subscribe({
                next:(noticias)=>{
                  console.log(noticias);
                    this.noticias = noticias;
                    this.loading = false;
                },
                error:(err)=> {
                  console.error(err);
                },
            });
    }

    nuevaNoticia(){
    
      this.router.navigate(['/portal/admin/noticias/nuevo']);
    }
  
    editarNoticia(){
      
      this.router.navigate(['/portal/admin/noticias/editar',this.noticiaSeleccionada[0].id]);
    }
  
    formatCurrency(value: number) {
      return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
  
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
  
    clear(table: Table) {
      table.clear();
      this.filter.nativeElement.value = '';
    }

    

}
