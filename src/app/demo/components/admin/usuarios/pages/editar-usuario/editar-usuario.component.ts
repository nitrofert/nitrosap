import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService, Message } from 'primeng/api';
import { InfoUsuario } from 'src/app/demo/api/responseloginws';
import { AdminService } from 'src/app/demo/service/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInterface } from 'src/app/demo/api/users';
import { AuthService } from 'src/app/demo/service/auth.service';


import {MenuItem} from 'primeng/api';
import { Table } from 'primeng/table';
import { PerfilesUsuario, PermisosUsuario } from 'src/app/demo/api/decodeToken';


@Component({
  selector: 'app-editar-usuario',
  providers: [MessageService, ConfirmationService],
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss']
})
export class EditarUsuarioComponent implements OnInit {

  userSelected:any ;

  fullname:  string="";
  email:       string="";
  username:   string="";
  codusersap:  string="";
  password:     string="";
  password2:string = "";
  status: string="";
  perfiles:any[] = [];
  companies:any[] = [];

  submitted: boolean = false;

  items!: MenuItem[];

  messageForm:Message[]=[];
  submitBotton = false;

  estados = [
        { name: 'Activo', code: 'A' },
        { name: 'Inactivo', code: 'I' }
       
    ];

    opciones:any[] = [];

    areas_empresa:any[] = [];
    dependencias_empresa:any[] = [];
    
    areas_user:any[] = [];
    areas_form:any[] = [];
    loading:boolean = false;
    selectedAreasUser!:any;
    selectedAreasForm!:any;

    dependencias_user:any[] = [];
    selectedDependenciasUser!:any;

    dependencias_form:any[] = [];
    selectedDependenciasForm!:any;

    @ViewChild('filter') filter!: ElementRef;

    formularioAreas:boolean = false;
    envioAreas:boolean = false;

    formularioDependencias:boolean = false;
    envioDependencias:boolean = false;

    almacenes_form:any[] = [];
    selectedAlmacenesForm!:any;

    almacenes_empresa:any[] = [];
    almacenes_user:any[] = [];

    selectedAlmacenesUser!:any;


    formularioAlmacenes:boolean = false;
    envioAlmacenes:boolean = false;

  /*infoSessionStr:string = "";
  infoSession:InfoUsuario[]    =  [];
  token:string = "";*/

  infoUsuario!: InfoUsuario;
  perfilesUsuario: PerfilesUsuario[] = [];
  permisosUsuario: PermisosUsuario[] = [];
  permisosPerfilesPagina!:PermisosUsuario[];
  permisosUsuarioPagina!:PermisosUsuario[];
  urlBreadCrumb:string ="";

  displayModal:boolean = false;
  loadingCargue:boolean = false;


  constructor(private rutaActiva: ActivatedRoute,
              private adminService:AdminService,
              private confirmationService: ConfirmationService, 
              private messageService: MessageService,
              private router:Router,
              public authService:AuthService) { }

  ngOnInit(): void {
    this.getPermisosUsuarioPagina();
    this.opciones = [{label: 'No', value: 0}, {label: 'Si', value: 1}];

    this.items = [
      {label: 'Información usuario', icon: 'pi pi-fw pi-user-edit'},
      {label: 'Perfiles', icon: 'pi pi-fw pi-id-card'},
      {label: 'Empresas', icon: 'pi pi-fw pi-building'},
     
  ];
    
    this.userSelected = this.rutaActiva.snapshot.params;
    //console.log((this.userSelected.user));

    /*this.infoSessionStr = localStorage.getItem('infoSession') ||'';
    this.infoSession    =  JSON.parse(this.infoSessionStr);
    this.token = localStorage.getItem('token') || '';*/
    this.getInfoUsuario();
    

  }

  getInfoUsuario(){
    this.adminService.getUserById(this.authService.getToken(),this.userSelected.user)
    .subscribe({
      next:(user =>{
          
          //console.log(user);
          this.fullname = user[0].fullname;
          this.email = user[0].email;
          this.codusersap = user[0].codusersap;
          this.status = user[0].status;
          this.username = user[0].username;
          this.areas_user = user[0].areas || [];
          this.dependencias_user = user[0].dependencias || [];
          this.almacenes_user = user[0].almacenes || [];
          //console.log(  this.dependencias_user);
          this.getPerfiles();
          this.getCompanies();
          this.getAreasEmpresa();
          this.getDependenciasEmpresa();
          this.getAlmacenesEmpresa();
          
          
          //this.messageForm = [{severity:'success', summary:'!Genial¡', detail:`Ha registrado en el menú la opción ${this.title}` , life: 3000}];
      }),
      error:(err =>{
        this.submitBotton = false;
        console.error(err);
      })
    }); 
  }

  getPermisosUsuarioPagina(){
    let url ="";
    this.permisosUsuario = this.authService.getPermisosUsuario();
    //////console.log("URL origen",this.router.url);
    //console.log("URL params",this.rutaActiva.snapshot.params);
    if(this.rutaActiva.snapshot.params['user']){
      let idSolpedSelected = this.rutaActiva.snapshot.params;
      if(this.router.url.indexOf("/"+idSolpedSelected['user'])>=0){
        url = this.router.url.substring(0,this.router.url.indexOf("/"+idSolpedSelected['user']));
      }
      //////console.log("URL con parametros: ",url);
    }else{
      url= this.router.url;
      //////console.log("URL sin parametros: ",url);
    }
    this.urlBreadCrumb = url;
    //this.permisosUsuarioPagina = this.permisosUsuario.filter(item => item.url===url);
    //console.log(this.permisosUsuario);

    this.permisosPerfilesPagina = this.permisosUsuario.filter(item => item.url===url); 
    //console.log(url,this.permisosPerfilesPagina);
    this.permisosUsuarioPagina =  this.authService.permisosPagina(this.permisosPerfilesPagina);
    //console.log(url,this.permisosUsuarioPagina);
  }

  saveUser(){
    this.submitted=true;
    if (!this.fullname || !this.email ||  !this.username || !this.codusersap  || !this.status) {
      //error
      this.messageForm = [{severity:'error', summary:'!Opps¡', detail:'Debe diligenciar los campos resaltados en rojo', life: 3000}];
    }else if(this.password != this.password2){
      this.messageForm = [{ severity: 'error', summary: '!Opps¡', detail: 'Las contraseñas no conciden', life: 3000 }];
    }else{
      this.submitBotton = true;
    
      //Registrar menu
      const newUser:UserInterface = {
        id:this.userSelected.user,
        fullname:this.fullname,
        email:this.email,
        username:this.username,
        status:this.status,
        codusersap:this.codusersap
      }
      
      if(this.password !== ''){
        //console.log(this.password);
        newUser.password = this.password;
      }
      
      this.adminService.updateUser(this.authService.getToken(),newUser)
      .subscribe({
        next:(user =>{
            
            //console.log(user);
            this.messageForm = [{severity:'success', summary:'!Genial¡', detail:`Ha actualizado el usuario ${this.fullname}` , life: 3000}];
        }),
        error:(err =>{
          this.submitBotton = false;
          console.error(err);
        })
      });
      
    }

  }

  getPerfiles(){
    this.adminService.getPerfilesUser(this.authService.getToken(),this.userSelected.user)
          .subscribe({
            next:(perfilesUser =>{
                
                //console.log(perfilesUser);
                this.perfiles = perfilesUser;
                
                //this.messageForm = [{severity:'success', summary:'!Genial¡', detail:`Ha registrado en el menú la opción ${this.title}` , life: 3000}];
            }),
            error:( err =>{
              this.submitBotton = false;
              console.log(err);
            })
          }); 
  }

  setPerfilUser(valor:any,idPerfil:number){
    console.log(valor,idPerfil);
    let perfilUser = {
      id_perfil:idPerfil,
      id_user:this.userSelected.user,
      valor
    }

    console.log(perfilUser);
    this.adminService.setPerfilUser(this.authService.getToken(),perfilUser)
        .subscribe({
          next: (acces) => {
            console.log(acces);
          },
          error: (err) => {
            console.log(err);
          }
        });
  }

  getCompanies(){
    this.adminService.getCompaniesUser(this.authService.getToken(),this.userSelected.user)
    .subscribe({
      next:(companiesUser =>{
          
          //console.log(companiesUser);
          this.companies = companiesUser;
          
          //this.messageForm = [{severity:'success', summary:'!Genial¡', detail:`Ha registrado en el menú la opción ${this.title}` , life: 3000}];
      }),
      error:( err =>{
        this.submitBotton = false;
        console.error(err);
      })
    }); 
  }

  getAreasEmpresa(){
    this.adminService.getAreasEmpresa(this.authService.getToken())
    .subscribe({
      next:(areas) =>{
          
          
          let areas_empresa:any[] = []
          

          for(let area of areas){
            //Eliminar areas duplicadas
            if(areas_empresa.filter(areaemp=>areaemp.U_NF_DIM2_DEP === area.Code).length===0){
                areas_empresa.push({U_NF_DIM2_DEP:area.Code});
            }
          }

          this.areas_empresa = areas_empresa;
          
      },
      error:(err) =>{
        
        console.error(err);
      }
    }); 
  }


  getDependenciasEmpresa(){
    this.adminService.getDependenciasEmpresa(this.authService.getToken())
    .subscribe({
      next:(dependencias) =>{
          
          
          let areas_empresa:any[] = []
          let dependencias_empresa:any[] = []

          /*for(let dependencia of dependencias){
            //Eliminar areas duplicadas
            if(areas_empresa.filter(area=>area.U_NF_DIM2_DEP === dependencia.U_NF_DIM2_DEP).length===0){
                areas_empresa.push({U_NF_DIM2_DEP:dependencia.U_NF_DIM2_DEP});
            }
          }*/

          //this.areas_empresa = areas_empresa;
          this.dependencias_empresa = dependencias;
          //console.log(this.dependencias_empresa,dependencias_empresa);
          
          //this.messageForm = [{severity:'success', summary:'!Genial¡', detail:`Ha registrado en el menú la opción ${this.title}` , life: 3000}];
      },
      error:(err) =>{
        
        console.error(err);
      }
    }); 
  }

  getAlmacenesEmpresa(){
    this.adminService.getAlmacenesEmpresa(this.authService.getToken())
    .subscribe({
      next:(almacenes) =>{
          
          
      

          this.almacenes_empresa = almacenes;
          
          console.log(this.almacenes_empresa);
          
          //this.messageForm = [{severity:'success', summary:'!Genial¡', detail:`Ha registrado en el menú la opción ${this.title}` , life: 3000}];
      },
      error:(err) =>{
        
        console.error(err);
      }
    }); 
  }



  setAccess(valor:number,idCompany:number){
    console.log(this.userSelected);
    this.displayModal = true;
    let accessCompany = {
      id_company:idCompany,
      id_user:this.userSelected.user,
      valor
    }
    console.log(accessCompany);

    this.adminService.setAccess(this.authService.getToken(),accessCompany)
        .subscribe({
          next: (acces) => {
            console.log(acces);
            if(acces.error){
              this.messageService.add({severity:'error', summary: '!Error', detail: acces.messageError});
            }
            this.displayModal = false;
          },
          error: (err) => {
            console.error(err);
            this.messageService.add({severity:'error', summary: '!Error', detail: err});
            this.displayModal = false;
          }
        });
  }

  newArea(){
    
    //console.log(this.areas_user);
    let areas_empresa= this.areas_empresa;
    for(let area_user of this.areas_user){
      areas_empresa = areas_empresa.filter(area => area.U_NF_DIM2_DEP != area_user.area);
    }

    //console.log(areas_empresa);
    this.areas_form = areas_empresa;
    this.formularioAreas = true;
    this.selectedAreasForm = [];

  }

  deleteArea(){
    console.log(this.selectedAreasUser);

    this.confirmationService.confirm({
      message: `Esta usted seguro de eliminar las areas seleccionadas?`,

      accept: () => {
          //Actual logic to perform a confirmation
          this.displayModal = true;
          const data:any = {
              areas: this.selectedAreasUser,
              usuario:this.codusersap,
              userid: this.userSelected.user
          }

          this.adminService.elimnarAreasUsuario(this.authService.getToken(),data)
              .subscribe({
                  next:(result)=>{

                    console.log(result);
                    this.displayModal = false;
                    if(!result.error){
                      this.messageService.add({severity:'success', summary: 'Ok', detail: result.message});
                      this.getInfoUsuario();
                      this.formularioAreas = false;
                    }else{
                      this.messageService.add({severity:'error', summary: '!Error', detail: result.message});
                    }
                  },
                  error:(err)=>{
                    console.error(err);
                  }

              });
          
      }
  });
  }

  newAlmacen(){
    
    console.log(this.almacenes_user);
    let almacenes_empresa= this.almacenes_empresa;
    for(let almacen_user of this.almacenes_user){
      almacenes_empresa = almacenes_empresa.filter(almacen => almacen.U_NF_ALMACEN != almacen_user.store);
    }

    //console.log(areas_empresa);
    this.almacenes_form = almacenes_empresa;
    this.formularioAlmacenes = true;
    this.selectedAlmacenesForm = [];

  }

  deleteAlmacen(){
    console.log(this.selectedAlmacenesUser);

    this.confirmationService.confirm({
      message: `Esta usted seguro de eliminar los almacenes seleccionados?`,

      accept: () => {
          //Actual logic to perform a confirmation
          this.displayModal = true;
          const data:any = {
              almacenes: this.selectedAlmacenesUser,
              usuario:this.codusersap,
              userid: this.userSelected.user
          }

          this.adminService.elimnarAlmacenUsuario(this.authService.getToken(),data)
              .subscribe({
                  next:(result)=>{

                    console.log(result);
                    this.displayModal = false;
                    if(!result.error){
                      this.messageService.add({severity:'success', summary: 'Ok', detail: result.message});
                      this.getInfoUsuario();
                      this.formularioAlmacenes = false;
                    }else{
                      this.messageService.add({severity:'error', summary: '!Error', detail: result.message});
                    }
                  },
                  error:(err)=>{
                    console.error(err);
                  }

              });
          
      }
  });
  }


  newDependencia(){
     console.log(this.dependencias_empresa);
     let dependencias_empresa= this.dependencias_empresa;
     for(let dependencia_user of this.dependencias_user){
        dependencias_empresa = dependencias_empresa.filter(dependencia => (dependencia.U_NF_DIM1_LOC+dependencia.U_NF_DIM2_DEP+dependencia.U_NF_DIM3_VICE!= dependencia_user.location+dependencia_user.dependence+dependencia_user.vicepresidency));
     }
 
     //console.log(dependencias_empresa);
     this.dependencias_form = dependencias_empresa;
     this.formularioDependencias = true;
     this.selectedDependenciasForm = [];
  }

  deleteDependencia(){
    console.log(this.selectedDependenciasUser);
    
    this.confirmationService.confirm({
      message: `Esta usted seguro de eliminar las dependencias seleccionadas?`,

      accept: () => {
          //Actual logic to perform a confirmation
          this.displayModal = true;
          const data:any = {
              dependencias: this.selectedDependenciasUser,
              usuario:this.codusersap,
              userid: this.userSelected.user
          }

          this.adminService.elimnarDependenciasUsuario(this.authService.getToken(),data)
              .subscribe({
                  next:(result)=>{

                    console.log(result);
                    this.displayModal = false;
                    if(!result.error){
                      this.messageService.add({severity:'success', summary: 'Ok', detail: result.message});
                      this.getInfoUsuario();
                      this.formularioDependencias = false;
                    }else{
                      this.messageService.add({severity:'error', summary: '!Error', detail: result.message});
                    }
                  },
                  error:(err)=>{
                    console.error(err);
                  }

              });
          
      }
    });
  }

  RegistrarAreas(){
    console.log(this.selectedAreasForm);
    

    this.confirmationService.confirm({
      message: `Esta usted seguro de registrar las areas seleccionadas?`,

      accept: () => {
          //Actual logic to perform a confirmation
          this.displayModal = true;
          const data:any = {
              areas: this.selectedAreasForm,
              usuario:this.codusersap,
              userid: this.userSelected.user
          }

          this.adminService.adicionarAreasUsuario(this.authService.getToken(),data)
              .subscribe({
                  next:(result)=>{

                    console.log(result);
                    this.displayModal = false;
                    if(!result.error){
                      this.messageService.add({severity:'success', summary: 'Ok', detail: result.message});
                      this.getInfoUsuario();
                      this.formularioAreas = false;
                    }else{
                      this.messageService.add({severity:'error', summary: '!Error', detail: result.message});
                    }
                  },
                  error:(err)=>{
                    console.error(err);
                  }

              });
          
      }
  });
  }

  RegistrarAlmacenes(){
    
    console.log(this.selectedAlmacenesForm);
    

    this.confirmationService.confirm({
      message: `Esta usted seguro de registrar los almacenes seleccionados?`,

      accept: () => {
          //Actual logic to perform a confirmation
          this.displayModal = true;
          const data:any = {
              almacenes: this.selectedAlmacenesForm,
              usuario:this.codusersap,
              userid: this.userSelected.user
          }

          this.adminService.adicionarAlmacenesUsuario(this.authService.getToken(),data)
              .subscribe({
                  next:(result)=>{

                    console.log(result);
                    this.displayModal = false;
                    if(!result.error){
                      this.messageService.add({severity:'success', summary: 'Ok', detail: result.message});
                      this.getInfoUsuario();
                      this.formularioAlmacenes = false;
                    }else{
                      this.messageService.add({severity:'error', summary: '!Error', detail: result.message});
                    }
                  },
                  error:(err)=>{
                    console.error(err);
                  }

              });
          
      }
  });
  }

  RegistrarDependencias(){
    console.log(this.selectedDependenciasForm);
    

    this.confirmationService.confirm({
      message: `Esta usted seguro de registrar las dependencias seleccionadas?`,

      accept: () => {
          //Actual logic to perform a confirmation
          this.displayModal = true;
          const data:any = {
              dependencias: this.selectedDependenciasForm,
              usuario:this.codusersap,
              userid: this.userSelected.user
          }

          this.adminService.adicionarDependenciasUsuario(this.authService.getToken(),data)
              .subscribe({
                  next:(result)=>{

                    console.log(result);
                    this.displayModal = false;
                    if(!result.error){
                      this.messageService.add({severity:'success', summary: 'Ok', detail: result.message});
                      this.getInfoUsuario();
                      this.formularioDependencias = false;
                    }else{
                      this.messageService.add({severity:'error', summary: '!Error', detail: result.message});
                    }
                  },
                  error:(err)=>{
                    console.error(err);
                  }

              });
          
      }
  });
  }

  clear(){
    this.submitBotton = false;
    this.fullname="";
    this.status="";
    this.email="";
    this.username="";
    this.codusersap="";
    this.password="";
    this.password2="";
  }

  formatCurrency(value: number) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  cleart(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

}
