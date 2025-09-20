import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../../models/cliente';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  api = `${environment.api}/clientes/`;

  constructor(private clienteHttp: HttpClient) { }

  inserir(novoCliente: Cliente): Observable<Cliente> {
    return this.clienteHttp.post<Cliente>(
      this.api, novoCliente
    );
  }

  listar(): Observable<Cliente[]> {
    return this.clienteHttp.get<Cliente[]>(this.api);
  }

  listar_paginado(page: number, pageSize: number): Observable<Cliente[]> {
    return this.clienteHttp.get<Cliente[]>(`${this.api}?page=${page}&pageSize=${pageSize}`);
  } 

  deletar(idCliente: number): Observable<object> {
    return this.clienteHttp.delete(`${this.api}${idCliente}`);
  }

  pesquisarPorId(idCliente: number): Observable<Cliente> {
    return this.clienteHttp.get<Cliente>(`${this.api}${idCliente}`);
  }

  atualizar(cliente: Cliente): Observable<Cliente> {
    return this.clienteHttp.put<Cliente>(`${this.api}${cliente.id}`, cliente);
  }
}
