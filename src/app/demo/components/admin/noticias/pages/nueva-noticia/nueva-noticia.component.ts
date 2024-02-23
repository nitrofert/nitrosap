import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AdminService } from 'src/app/demo/service/admin.service';
import { AuthService } from 'src/app/demo/service/auth.service';

@Component({
  selector: 'app-nueva-noticia',
  providers: [MessageService, ConfirmationService],
  templateUrl: './nueva-noticia.component.html',
  styleUrls: ['./nueva-noticia.component.scss']
})
export class NuevaNoticiaComponent implements OnInit {

  titulo:string = '';
  fechapub:Date = new Date();
  fechafinpub:Date = new Date();
  envioFormulario:boolean = false;
  descripcion:string = '';
  recurso:string = '';


  constructor(public authService: AuthService,
    private adminService:AdminService,
    private router:Router,
    private messageService: MessageService,
    private rutaActiva: ActivatedRoute,
    
    ) {

     }

     ngOnInit(): void {

     }

     guardarNoticia(){
      this.envioFormulario = true;
      if(this.titulo && this.fechafinpub && this.fechapub && this.recurso && this.descripcion){
        let nuevaNoticia = {
          titulo: this.titulo,
          fechapub: this.fechapub,
          fechafinpub: this.fechafinpub,
          descripcion:this.descripcion,
          recurso:this.recurso,
          autor: this.authService.getInfoUsuario().fullname
        }

        this.adminService.saveNoticia(this.authService.getToken(),nuevaNoticia)
            .subscribe({
              next:(noticia)=>{
                console.log('noticia',noticia);
                this.messageService.add({severity:'success', summary: 'Ok', detail: `Se ha cargado correctamente los datos de la noticia`});
                setTimeout(() => {
                  console.log("2 Segundo esperado");
                  this.router.navigate(['/portal/admin/noticias']);
                }, 2000);
              },
              error:(err)=> {
                console.error(err);
                this.messageService.add({severity:'error', summary: '!Error', detail: 'Ocurrio un error al momento de registrar la noticia'+err.sqlMessage});
              },
            })
      }else{
        this.messageService.add({severity:'error', summary: '!Error', detail: 'Debe diligenciar los campos resaltados en rojo'});
      }
     }

}
