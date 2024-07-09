
const botonConvertir = document.getElementById('convertir');
botonConvertir.addEventListener('click', convertir);


let myChart = null;


async function convertir() {
    const monto = document.getElementById('monto').value;
    const cambio = document.getElementById('cambio').value;

    try {
        
        const api = `https://mindicador.cl/api/${cambio}`;
        const response = await fetch(api);
        const data = await response.json();

       
        if (data.serie && data.serie.length > 0) {
            const tasa = data.serie[0].valor; 
            const conversion = monto / tasa; 

            
            const resultado = document.getElementById('resultado');
            resultado.innerHTML = `
                <p>${monto} CLP equivale a aproximadamente ${conversion.toFixed(2)} ${cambio}</p>
            `;

            
            const hoy = new Date();
            const ultimos20Dias = data.serie.filter(serie => {
                const fechaSerie = new Date(serie.fecha);
                return fechaSerie >= new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - 20);
            });

            // Actualizar el gráfico
            await crearOActualizarGrafico(ultimos20Dias);
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


async function crearOActualizarGrafico(series) {
    try {
        const data = series.map(serie => serie.valor);
        const fechas = series.map(serie => {
            const date = new Date(serie.fecha);
            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        });

        
        const ctx = document.getElementById('myChart').getContext('2d');

        
        if (myChart) {
            myChart.destroy();
        }

        
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: fechas,
                datasets: [{
                    label: 'Valor',
                    data: data,
                    borderColor: 'rgba(75, 192, 192, 1)', 
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 20 
                        }
                    },
                    y: {
                        beginAtZero: false, 
                        suggestedMin: Math.min(...data) - 10, 
                        suggestedMax: Math.max(...data) + 10 
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