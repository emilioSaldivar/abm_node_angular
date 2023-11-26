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

  columnas: string[] = ['cliente', 'total', 'factura', 'borrar', 'seleccionar'];

  datos: any;

  ventaselect: Venta = new Venta(0, "", 0 , "");

  @ViewChild(MatTable) tabla1!: MatTable<Venta>;

  borrarVenta(id: number) {
    if (confirm("¿Realmente desea eliminar esta venta?")) {
      this.http.delete(`http://192.168.0.5:9090/api/venta/${id}`)
          .subscribe(
              () => {
                  // Éxito: la venta se eliminó en el backend
                  // Puedes manejar aquí cualquier acción adicional que desees en el frontend
                  this.datos = this.datos.filter((venta: any) => venta.id !== id);
                  this.tabla1.renderRows();
              },
              (error) => {
                  // Manejo de errores en caso de que la solicitud al backend falle
                  console.error("Error al eliminar la venta:", error);
                  // Puedes mostrar un mensaje de error al usuario si es necesario
              }
          );
  }
  }

  agregar() {
    // Datos a enviar
    const ventaData = {
      cliente: this.ventaselect.cliente,
      total: this.ventaselect.total,
      factura: this.ventaselect.factura
    };

    // Configura las cabeceras si es necesario
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Realiza la solicitud POST directa al backend
    this.http.post('http://192.168.0.5:9090/api/venta', ventaData, { headers })
      .subscribe(
        (data) => {
          // Éxito: la venta se agregó en el backend
          // Puedes manejar aquí cualquier acción adicional que desees en el frontend
          this.datos.push(data); // Agrega los datos a la tabla en el frontend
          this.tabla1.renderRows();
          this.ventaselect = new Venta(0, "", 0, "");
        },
        (error) => {
          // Manejo de errores en caso de que la solicitud al backend falle
          console.error("Error al agregar la venta:", error);
          // Puedes mostrar un mensaje de error al usuario si es necesario
        }
      );
  }

  editarVenta(venta: Venta) {
    this.http.put<Venta>(`http://192.168.0.5:9090/api/venta/${venta.id}`, venta)
      .subscribe(
        (data) => {
          console.log("Edición exitosa:", data);
          // Éxito: la venta se actualizó en el backend
          // Puedes manejar aquí cualquier acción adicional que desees en el frontend
          // Por ejemplo, cerrar el formulario de edición

          // Encuentra el índice del elemento en this.datos
          const indice = this.datos.findIndex((item: Venta) => item.id === data.id);

          // Actualiza el elemento en this.datos
          this.datos[indice] = data;

          // Renderiza las filas de la tabla
          this.tabla1.renderRows();
        },
        (error) => {
          // Manejo de errores en caso de que la solicitud al backend falle
          console.error("Error al actualizar la venta:", error);
          // Puedes mostrar un mensaje de error al usuario si es necesario
        }
      );
  }

  seleccionar(venta: Venta) {
    this.ventaselect.id = venta.id; // Asigna el valor del id
    this.ventaselect.cliente = venta.cliente;
    this.ventaselect.total = venta.total;
    this.ventaselect.factura = venta.factura;
  }

  guardar() {
    console.log('ventaselect.id = ', this.ventaselect.id);
    if (this.ventaselect.id) {
      // Realizar lógica para actualizar el registro existente
      // Llama a la función para actualizar el registro
      this.editarVenta(this.ventaselect);
    } else {
      // Realizar lógica para agregar un nuevo registro
      // Llama a la función para agregar un nuevo registro
      this.agregar();
    }

    // Restablece el formulario después de la operación
    this.ventaselect = new Venta(0, "", 0, "");
  }

  ngOnInit() {
    this.http.get("http://192.168.0.5:9090/api/venta")
      .subscribe(
        resultado => {
          this.datos = resultado;
        }
      );
  }
}


export class Venta {
  constructor(public id: number, public cliente: string, public total: number, public factura: string) {
  }
}
