import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { jsPDF }  from 'jspdf';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private http: HttpClient) { }
  
  columnas: string[] = ['cliente', 'monto_envio', 'nro_orden','direccion', 'borrar', 'seleccionar'];

  datos: any;

  ventaselect: Venta = new Venta(0, "", 0 , "","");

  @ViewChild(MatTable) tabla1!: MatTable<Venta>;
  @ViewChild('tabla1') pdfTable!: ElementRef;

  borrarVenta(id: number) {
    if (confirm("¿Realmente desea eliminar esta venta?")) {
      this.http.delete(`http://192.168.0.9:9090/api/venta/${id}`)
          .subscribe(
              () => {
                  // Éxito: la venta se eliminó en el backend
                  // Puedes manejar aquí cualquier acción adicional que desees en el frontend
                  this.datos = this.datos.filter((venta: any) => venta.id !== id);
                  this.tabla1.renderRows();
              },
              (error) => {
                  // Manejo de errores en caso de que la solicitud al backend falle
                  console.error("Error al eliminar la orden:", error);
                  // Puedes mostrar un mensaje de error al usuario si es necesario
              }
          );
  }
  }

  agregar() {
    // Datos a enviar
    const ventaData = {
      cliente: this.ventaselect.cliente,
      monto_envio: this.ventaselect.monto_envio,
      nro_orden: this.ventaselect.nro_orden,
      direccion: this.ventaselect.direccion

    };

    // Configura las cabeceras si es necesario
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Realiza la solicitud POST directa al backend
    this.http.post('http://192.168.0.9:9090/api/venta', ventaData, { headers })
      .subscribe(
        (data) => {
          // Éxito: la venta se agregó en el backend
          // Puedes manejar aquí cualquier acción adicional que desees en el frontend
          this.datos.push(data); // Agrega los datos a la tabla en el frontend
          this.tabla1.renderRows();
          this.ventaselect = new Venta(0, "", 0, "","");
        },
        (error) => {
          // Manejo de errores en caso de que la solicitud al backend falle
          console.error("Error al agregar la orden:", error);
          // Puedes mostrar un mensaje de error al usuario si es necesario
        }
      );
  }

  editarVenta(venta: Venta) {
    this.http.put<Venta>(`http://192.168.0.9:9090/api/venta/${venta.id}`, venta)
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
          console.error("Error al actualizar la orden:", error);
          // Puedes mostrar un mensaje de error al usuario si es necesario
        }
      );
  }

  seleccionar(venta: Venta) {
    this.ventaselect.id = venta.id; // Asigna el valor del id
    this.ventaselect.cliente = venta.cliente;
    this.ventaselect.monto_envio = venta.monto_envio;
    this.ventaselect.nro_orden = venta.nro_orden;
    this.ventaselect.direccion = venta.direccion;
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
    this.ventaselect = new Venta(0, "", 0, "","");
  }  

  exportarAPDF() {
    const pdf = new jsPDF('p', 'px','legal'); 
    pdf.setFontSize(12);
    
    // Obtén el contenido de la tabla en formato HTML
    const content: Element = this.tabla1['_elementRef'].nativeElement.cloneNode(true); // Hacer una copia del contenido

      // Encuentra las cabeceras de las columnas y elimina las dos últimas
    const headerRows: NodeListOf<Element> = content.querySelectorAll('tr[mat-header-row]');
    headerRows.forEach(headerRow => {
      const headerCells: NodeListOf<Element> = headerRow.querySelectorAll('th[mat-header-cell]');
      if (headerCells.length > 2) {
        headerCells[headerCells.length - 2].remove(); // Elimina la penúltima columna
        headerCells[headerCells.length - 1].remove(); // Elimina la última columna
     }
    });


    // Elimina las columnas que no quieres incluir en el PDF
    const rows = content.querySelectorAll('tr[mat-row]');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td[mat-cell]');
      if (cells.length > 2) { // Ajusta según el número de columnas que quieras incluir
        cells[cells.length - 2].remove(); // Elimina la penúltima columna
        cells[cells.length - 1].remove(); // Elimina la última columna
      }
    });
  
    const contentHtml: string = content.outerHTML;
    console.log('Contenido de la tabla en HTML:', contentHtml);

  
    // Convierte el contenido HTML modificado a PDF
    pdf.html(contentHtml, {
      callback: () => {

        pdf.save('ventas.pdf');
      }
    });
  }
  
  ngOnInit() {
    this.http.get("http://192.168.0.9:9090/api/venta")
      .subscribe(
        resultado => {
          this.datos = resultado;
        }
      );
  }
}


export class Venta {
  constructor(public id: number, public cliente: string, public monto_envio: number, public nro_orden: string, public direccion: string) {
  }
}