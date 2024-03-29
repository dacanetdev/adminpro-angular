import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/service.index';

import swal from 'sweetalert';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  Role: any;

  usuarios: Usuario[] = [];
  desde: number = 0;

  checkFocus: boolean = false;

  totalRegistros: number = 0;
  
  cargando: boolean = true;

  activarBoton1: boolean = false;
  activarBoton2: boolean = false;

  constructor(public _usuarioService: UsuarioService) { 
    this.Role = this._usuarioService.usuario.role
  }

  ngOnInit() {
    this.cargarUsuarios();
    console.log(this.Role);
  }

  cargarUsuarios(){
    this.cargando = true;
    this._usuarioService.cargarUsuarios(this.desde).subscribe((resp: any) => {
      this.totalRegistros = resp.totalUsuarios;
      this.usuarios = resp.usuarios/*.filter(u => u.email !== this._usuarioService.usuario.email)*/;
      this.cargando = false;
      console.log(resp);
      console.log(this.desde);
    });
  }
  mostrarOtrosUsuarios(cambio: number){

    let valor = this.desde + cambio;
    console.log(valor);
    console.log(this.desde);
    if(valor >= this.totalRegistros){
      this.activarBoton1 = true;
      return;
    }else this.activarBoton1 = false;
    if(valor < 0){
      this.activarBoton2 = true;
      return;
    }else this.activarBoton2 = false;
    this.desde = this.desde + cambio;
    this.cargarUsuarios();
  }
  buscarUsuario(termino: string){
    console.log(termino);
    this._usuarioService.buscarUsuarios(termino).subscribe((res:Usuario[]) => {
      console.log(res);
      this.usuarios = res;
    });
  }
  salioBusqueda(valor: string){
    if(valor.length <= 0){
      this.desde = 0;

      this.cargarUsuarios();
    }else return console.log(valor);
  }
  BorrarUsuario(usuario: Usuario){
    let id = usuario._id;
    if(this._usuarioService.usuario.role == 'USER_ROLE'){
      swal('Importante', 'solo los administradores puede borrar los usuario','info');
      return;
    }
    if(this._usuarioService.usuario._id == usuario._id){
      swal('Importante', 'no se puede borrar','warning');
      return;
    }
    swal({
      title: "Aviso",
      text: "Esta seguro de querer borrar el suaurio "+usuario.nombre,
      icon: "warning",
      buttons: ['No', 'Si'],
      dangerMode: true
    }).then((value) => {
      console.log(value);
      if (value == null) {
        swal("Accion cancelada");
        return;
      }
      this._usuarioService.borrarUsuario(id).subscribe((res: any) => {
        swal( "Usuario Borrado", "usuario "+res.usuario.email+" borrado correctamente","success");
        this.desde = 0;
        this.activarBoton1 = false;
        this.activarBoton2 = false;
        this.cargarUsuarios();
      });
    });
  }
  cambiarUsuario(usuario: Usuario){
    swal({
      title: "Aviso",
      text: "desea guardar cambios "+usuario.nombre,
      icon: "info",
      buttons: ['No', 'Si'],
      dangerMode: true
    }).then((value) => {
      console.log(value);
      if (value == null) {
        swal("Accion cancelada");
        return;
      }
      this._usuarioService.actualizarUsuario(usuario).subscribe(() => {
        swal('Actualizado', usuario.role, 'success');
      });
    });
  }
}
