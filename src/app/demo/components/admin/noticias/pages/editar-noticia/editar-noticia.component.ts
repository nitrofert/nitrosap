import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AdminService } from 'src/app/demo/service/admin.service';
import { AuthService } from 'src/app/demo/service/auth.service';

@Component({
  selector: 'app-editar-noticia',
  providers: [MessageService, ConfirmationService],
  templateUrl: './editar-noticia.component.html',
  styleUrls: ['./editar-noticia.component.scss']
})
export class EditarNoticiaComponent implements OnInit {

  noticiaSeleccionada!:any;

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

    this.noticiaSeleccionada = this.rutaActiva.snapshot.params;

    this.getNoticia(this.noticiaSeleccionada);

  }

  getNoticia(noticia:any){
    console.log('noticiaid',noticia);
      this.adminService.getNoticia(this.authService.getToken(),noticia.noticia)
          .subscribe({
              next:(infoNoticia)=>{
                  console.log('infoNoticia',infoNoticia);
                  this.titulo = infoNoticia[0].titulo;
                  this.fechapub = new Date(infoNoticia[0].fechapub);
                  this.fechafinpub = new Date(infoNoticia[0].fechafinpub);
                  this.descripcion = infoNoticia[0].descripcion;
                  this.recurso = infoNoticia[0].recurso;
              },
              error:(err)=> {
                console.error(err);
              },

          });
  }

  guardarNoticia(){
    this.envioFormulario = true;
    if(this.titulo && this.fechafinpub && this.fechapub && this.recurso && this.descripcion){
      let nuevaNoticia = {
        id:this.noticiaSeleccionada.noticia,
        titulo: this.titulo,
        fechapub: this.fechapub,
        fechafinpub: this.fechafinpub,
        descripcion:this.descripcion,
        recurso:this.recurso,
        autor: this.authService.getInfoUsuario().fullname
      }

      this.adminService.updateNoticia(this.authService.getToken(),nuevaNoticia)
          .subscribe({
            next:(noticia)=>{
              console.log('noticia',noticia);
              this.messageService.add({severity:'success', summary: 'Ok', detail: `Se ha actualizado correctamente los datos de la noticia seleccionada`});
              setTimeout(() => {
                //console.log("2 Segundo esperado");
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
