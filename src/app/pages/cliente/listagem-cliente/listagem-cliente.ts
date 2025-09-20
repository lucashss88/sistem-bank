import { AfterViewInit, Component, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { ClienteService } from '../../../../shared/services/cliente/cliente-service';
import { Cliente } from '../../../../shared/models/cliente';

export interface PageResult<T> {
  items: T[];
  total: number;
}

@Component({
  selector: 'app-listagem-cliente',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './listagem-cliente.html',
  styleUrl: './listagem-cliente.scss'
})
export class ListagemCliente implements AfterViewInit {
  private clienteService = inject(ClienteService);

  displayedColumns: string[] = ['id', 'nome', 'cpf', 'email', 'status', 'funcoes'];

  dataSource = new MatTableDataSource<Cliente>;

  totalClientes = 0;
  pageIndex = 0; 
  pageSize = 5;
  loading = signal(false);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.listarClientes(this.pageIndex + 1, this.pageSize);
  }

  listarClientes(page: number, pageSize: number): void {
    this.loading.set(true);

    this.clienteService.listar_paginado(page, pageSize).subscribe({
      next: (res: PageResult<Cliente> | Cliente[]) => {
        if (Array.isArray(res)) {
          this.dataSource.data = res;
          this.totalClientes = this.pageIndex * this.pageSize + res.length;
        } else {
          this.dataSource.data = res.items;
          this.totalClientes = res.total;
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível carregar a lista de clientes.',
        });
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;         
    this.pageSize = event.pageSize;
    this.listarClientes(this.pageIndex + 1, this.pageSize);
  }

  deletarCliente(id: number): void {
    Swal.fire({
      title: 'Você tem certeza que deseja deletar?',
      text: 'Não tem como reverter essa ação',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'red',
      cancelButtonColor: 'grey',
      confirmButtonText: 'Deletar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.deletar(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Sucesso',
              text: 'Cliente deletado com sucesso!',
              showConfirmButton: false,
              timer: 1500,
            });
            this.listarClientes(this.pageIndex + 1, this.pageSize);
          },
          error: (error) => {
            console.error(error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Erro ao deletar cliente!',
            });
          },
        });
      }
    });
  }

  trackById = (_: number, item: Cliente) => item.id;
}
