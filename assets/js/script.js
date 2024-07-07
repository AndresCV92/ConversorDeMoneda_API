// Obtener referencia al botón y vincular el evento click
const botonConvertir = document.getElementById('convertir');
botonConvertir.addEventListener('click', convertir);

// Función para convertir la moneda
async function convertir() {
    const monto = document.getElementById('monto').value;
    const cambio = document.getElementById('cambio').value;

    try {
        // Obtener las tasas de cambio utilizando la API de mindicador.cl
        const api = `https://mindicador.cl/api/${cambio}`;
        const response = await fetch(api);
        const data = await response.json();

        // Verificar si la moneda seleccionada es válida y obtener la tasa de cambio
        if (data.serie && data.serie.length > 0) {
            const tasa = data.serie[0].valor; 
            const conversion = monto / tasa; 

            // Mostrar el resultado de la conversión
            const resultado = document.getElementById('resultado');
            resultado.innerHTML = `
                <p>${monto} CLP equivale a aproximadamente ${conversion.toFixed(2)} ${cambio}</p>
            `;

            // Llamar a la función para crear el gráfico
            await crearGrafico(data.serie);
        } else {
            throw new Error("La moneda seleccionada no es válida o no se encontraron datos.");
        }
    } catch (error) {
        console.error('Error al obtener las tasas de cambio:', error);
        const resultado = document.getElementById('resultado');
        resultado.innerHTML = `
            <p>Error al obtener las tasas de cambio. Por favor, inténtalo de nuevo más tarde.</p>
        `;
    }
}

// Función para crear el gráfico utilizando Chart.js
async function crearGrafico(series) {
    try {
        const data = series.map(serie => serie.valor);
        const fechas = series.map(serie => serie.fecha);
        const ctx = document.getElementById('myChart').getContext('2d');

        // Crear el gráfico
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: fechas,
                datasets: [{
                    label: 'Valor',
                    data: data,
                    borderColor: 'rgba(75, 192, 192, 1)', // Color de la línea
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error al crear el gráfico:', error);
        const resultado = document.getElementById('resultado');
        resultado.innerHTML = `
            <p>Error al crear el gráfico. Por favor, inténtalo de nuevo más tarde.</p>
        `;
    }
}