import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  constructor(private http: HttpClient) { }

  columnas: string[] = ['cliente', 'monto_envio', 'nro_orden', 'direccion', 'borrar', 'seleccionar'];

  datos: any;

  ordenSelect: Orden = new Orden(0, "", 0, "", "");

  @ViewChild(MatTable) tabla1!: MatTable<Orden>;

  borrarOrden(id: number) {
    if (confirm("¿Realmente desea eliminar esta orden?")) {
      this.http.delete(`http://192.168.0.5:9090/api/orden/${id}`)
          .subscribe(
              () => {
                  // Éxito: la orden se eliminó en el backend
                  this.datos = this.datos.filter((orden: any) => orden.id !== id);
                  this.tabla1.renderRows();
              },
              (error) => {
                  // Manejo de errores en caso de que la solicitud al backend falle
                  console.error("Error al eliminar la orden:", error);
              }
          );
  }
  }

  agregar() {
    // Datos a enviar
    const ordenData = {
      cliente: this.ordenSelect.cliente,
      monto_envio: this.ordenSelect.monto_envio,
      nro_orden: this.ordenSelect.nro_orden,
      direccion: this.ordenSelect.direccion
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Realiza la solicitud POST directa al backend
    this.http.post('http://192.168.0.5:9090/api/orden', ordenData, { headers })
      .subscribe(
        (data) => {
          // Éxito: la orden se agregó en el backend
          this.datos.push(data); // Agrega los datos a la tabla en el frontend
          this.tabla1.renderRows();
          this.ordenSelect = new Orden(0, "", 0, "", "");
        },
        (error) => {
          // Manejo de errores en caso de que la solicitud al backend falle
          console.error("Error al agregar la orden:", error);
        }
      );
  }

  editarOrden(orden: Orden) {
    this.http.put<Orden>(`http://192.168.0.5:9090/api/orden/${orden.id}`, orden)
      .subscribe(
        (data) => {
          console.log("Edición exitosa:", data);
          // Éxito: la orden se actualizó en el backend

          // Encuentra el índice del elemento en this.datos
          const indice = this.datos.findIndex((item: Orden) => item.id === data.id);

          // Actualiza el elemento en this.datos
          this.datos[indice] = data;

          // Renderiza las filas de la tabla
          this.tabla1.renderRows();
        },
        (error) => {
          // Manejo de errores en caso de que la solicitud al backend falle
          console.error("Error al actualizar la orden:", error);
        }
      );
  }

  seleccionar(orden: Orden) {
    this.ordenSelect.id = orden.id; // Asigna el valor del id
    this.ordenSelect.cliente = orden.cliente;
    this.ordenSelect.monto_envio = orden.monto_envio;
    this.ordenSelect.nro_orden = orden.nro_orden;
    this.ordenSelect.direccion = orden.direccion;
  }

  guardar() {
    console.log('ordenSelect.id = ', this.ordenSelect.id);
    if (this.ordenSelect.id) {
      // Llama a la función para actualizar el registro
      this.editarOrden(this.ordenSelect);
    } else {
      // Llama a la función para agregar un nuevo registro
      this.agregar();
    }

    // Restablece el formulario después de la operación
    this.ordenSelect = new Orden(0, "", 0, "", "");
  }

  ngOnInit() {
    this.http.get("http://192.168.0.5:9090/api/orden")
      .subscribe(
        resultado => {
          this.datos = resultado;
        }
      );
  }
}


export class Orden {
  constructor(public id: number, public cliente: string, public monto_envio: number, public nro_orden: string, public direccion: string) {
  }
}
