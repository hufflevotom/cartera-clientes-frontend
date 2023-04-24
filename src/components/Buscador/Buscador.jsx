import { Button, DatePicker, Input, Select } from "antd";

/* (HuffleVotom)
 *   Opciones es un objeto que contiene la siguiente estructura:
 *   {
 *   	buscar: string (Se usa para el campo de busqueda general)
 *   	avanzado: boolean (Se usa para mostrar u ocultar los campos avanzados)
 * 		filtros: boolean (Se usa para ocultar el botón de cambiar a filtros avanzados)
 * 		aditionalOption:
 *   	opciones: Arreglo que puede contener 3 tipos de objetos:
 *   		input: {
 *   			criterio: string (Se usa para identificar el campo y enviar como parametro al backend)
 *   			placeholder: string
 *   			value: string or null
 *   		}
 *   		date: {
 *   			date: true
 * 				rango: 0 or 1 (Se usa en caso de que sea un rango de fechas, 0 para fecha inicio, 1 para fecha fin)
 *   			criterio: string
 *   			placeholder: string
 *   			value: moment instance or null
 *   		}
 *   		select: {
 *   			select: true
 *   			criterio: string
 *   			placeholder: string
 *   			value: string, number or null
 *   			options: [
 *   				{ label: string, value: string or number }
 *   			],
 *   		}
 *   }
 */

function Buscador({
  opciones,
  setOpciones,
  buscar,
  paginacion,
  reset,
  aditionalOption,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        gap: "20px",
        marginBottom: "20px",
      }}
    >
      {opciones.avanzado ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "start",
            gap: "10px",
          }}
        >
          {opciones.opciones.map((item, index) => {
            if (item.select)
              return (
                <Select
                  key={item.criterio + index}
                  placeholder={item.placeholder}
                  value={item.value}
                  onChange={(e) => {
                    const opcionesTemp = opciones;
                    opcionesTemp.opciones[index].value = e;
                    setOpciones({ ...opcionesTemp });
                  }}
                  options={item.options}
                  style={{
                    width: `calc(95%/${
                      opciones.opciones.length < 3
                        ? opciones.opciones.length
                        : 3
                    })`,
                  }}
                />
              );
            if (item.date)
              return (
                <DatePicker
                  key={item.criterio + index}
                  placeholder={item.placeholder}
                  value={item.value}
                  onChange={(e) => {
                    const opcionesTemp = opciones;
                    opcionesTemp.opciones[index].value = e;
                    setOpciones({ ...opcionesTemp });
                  }}
                  style={{
                    width: `calc(95%/${
                      opciones.opciones.length < 3
                        ? opciones.opciones.length
                        : 3
                    })`,
                  }}
                />
              );
            return (
              <Input
                key={item.criterio + index}
                placeholder={item.placeholder}
                value={item.value}
                onChange={(e) => {
                  const opcionesTemp = opciones;
                  opcionesTemp.opciones[index].value = e.target.value;
                  setOpciones({ ...opcionesTemp });
                }}
                onPressEnter={() => buscar(paginacion, opciones.avanzado)}
                style={{
                  width: `calc(95%/${
                    opciones.opciones.length < 3 ? opciones.opciones.length : 3
                  })`,
                }}
              />
            );
          })}
        </div>
      ) : (
        <Input
          placeholder="Buscar"
          value={opciones.buscar}
          onChange={(e) => setOpciones({ ...opciones, buscar: e.target.value })}
          onPressEnter={() => buscar(paginacion, opciones.avanzado)}
        />
      )}
      <div
        style={{
          width: "auto",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          type="primary"
          onClick={() => buscar(paginacion, opciones.avanzado)}
          style={{ margin: 0 }}
        >
          Buscar
        </Button>
        {opciones.filtros !== true && (
          <Button
            type="text"
            onClick={() =>
              setOpciones({ ...opciones, avanzado: !opciones.avanzado })
            }
            style={{ margin: 0 }}
          >
            {opciones.avanzado ? "Ocultar" : "Mostrar"} opciones
          </Button>
        )}
        <Button
          type="text"
          onClick={() => {
            setOpciones({
              ...reset,
              opciones: reset.opciones.map((i) => ({ ...i, value: null })),
            });
            buscar(paginacion);
          }}
          style={{ margin: 0 }}
        >
          Limpiar
        </Button>
        {aditionalOption && aditionalOption}
      </div>
    </div>
  );
}

export default Buscador;
