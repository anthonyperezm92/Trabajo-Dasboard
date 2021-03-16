$(() => {
    // eventos del select
    $("#sel_pais").change(function () {
        render();
    });
    // crear slider y eventos
    var slider = document.getElementById('slider5');
    noUiSlider.create(slider, {
        connect: true,
        step: 1,
        start: [2000, 2014],
        range: {
            min: 2000,
            max: 2014
        }, format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0)
        },
        tooltips: true
    });
    slider.noUiSlider.on('change', function () {
        render();
    });
    // eventos de los combobox
    $(".check-inp").change(function () {
        render();
    });    
})


// Datos base
anios = ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009']
dataArray = []
total = []
poblacion = []
index = 0
// Chart optiones
const options = {
    maintainAspectRatio: false, 
    tooltips: {
        mode: 'index',
        intersect: false,
    },
    elements: {
        rectangle: {
            borderWidth: 1 
        },
        line: {
            borderWidth: 1 
        }
    },
    legend: {
        display: false 
    }
}
const options3 = {
    maintainAspectRatio: false, 
    fill: 'false',
    tooltips: {
        mode: 'index',
        intersect: false, 
    },
    elements: {
        rectangle: {
            borderWidth: 1 
        },
        line: {
            borderWidth: 1 
        }
    },
    legend: {
        display: true 
    }
}

/***************** Grafico de barras *****************/
let grafico_barra = new Chart('graficobarras', {
    type: 'bar',
    data: {
        labels: anios,
        datasets: []
    },
    options: options
})

/***************** Grafica de pie *****************/
let grafico_pie = new Chart('graficopie', {
    type: 'doughnut',
    data: {
        labels: ['Hombres', 'Mujeres'],
        datasets: []
    },
    options: options
})

/***************** Grafico de lineas *****************/
let chartlinea = new Chart('graficolineas', {
    type: 'line',
    data: {
        labels: anios,
        datasets: [
        ]
    },
    options: options3
})

topSelectT2 = d3.select('#sel_pais')
// leer archivo de daros
d3.csv('data.csv')
    .then(function (dataT2) {
        dataT2.forEach(d => {
            d.suicides_no = +d.suicides_no
            d.population = +d.population
            d.year = +d.year
        })

        dataArray = dataT2
        var l = dataT2.map(d => d.country);

        // llenar option del select
        result = l.filter((item, index) => {
            return l.indexOf(item) === index;
        })

        result.forEach(d => {
            topSelectT2.append('option')
                .attr('value', d)
                .text(d)
        })

        App.select2()
        // render inicial
        render();
    })
    .catch(e => {
        console.log('No se tuvo acceso al archivo ' + e.message)
    })

    // funcion render que actualiza las graficas
function render() {
    debugger;
    var numHomb = 0;
    var numMuje = 0;
    // obtener los filtros seleccionados
    var pais = $('#sel_pais').val()
    var anio_min = parseInt(document.getElementById('slider5').noUiSlider.get()[0])
    var anio_max = parseInt(document.getElementById('slider5').noUiSlider.get()[1])
    data = d3.filter(dataArray, d => d.country == pais)
    data = d3.filter(data, d => d.year >= anio_min && d.year <= anio_max)

    var l = data.map(d => d.year);
    label = l.filter((item, index) => {
        return l.indexOf(item) === index;
    })
    anios = label
    datalineas = []
    datapoblacion = []
    datasets = []

    // crear daatset para grafico de lineas
    // filtrar datos si se lecciono check
    if ($('#check-05-14').prop('checked')) {
        data_temp = d3.filter(data, d => d.age == '05-14 years')

        data_homb = d3.filter(data_temp, d => d.sex == 'male')
        numHomb = numHomb + d3.sum(data_homb.map(d => d.suicides_no))

        data_muje = d3.filter(data_temp, d => d.sex == 'female')
        numMuje = numMuje + d3.sum(data_muje.map(d => d.suicides_no))

        var dt = d3.rollup(data_temp, v => d3.sum(v, d => d.suicides_no), d => d.year)
        data1 = Array.from(dt.values()).slice(0)
        if (datalineas.length == 0) {
            datalineas = data1;
        }

        // sumatoria de poblacion
        var dtp = d3.rollup(data_temp, v => d3.sum(v, d => d.population), d => d.year)
        data_pobla = Array.from(dtp.values()).slice(0)
        if (datapoblacion.length == 0) {
            datapoblacion = data_pobla;
        }
        // agregar datos al dataset
        var dat1 = {
            label: '05-14 años',
            backgroundColor: Chart.helpers.color(blue).alpha(0.1).rgbString(),
            borderColor: blue,
            fill: 'false',
            tension: 0,
            pointRadius: 0,
            data: data1
        }
        datasets.push(dat1)
    }
    // filtrar datos si se lecciono check
    if ($('#check-15-24').prop('checked')) {
        data_temp = d3.filter(data, d => d.age == '15-24 years')

        data_homb = d3.filter(data_temp, d => d.sex == 'male')
        numHomb = numHomb + d3.sum(data_homb.map(d => d.suicides_no))

        data_muje = d3.filter(data_temp, d => d.sex == 'female')
        numMuje = numMuje + d3.sum(data_muje.map(d => d.suicides_no))

        var dt = d3.rollup(data_temp, v => d3.sum(v, d => d.suicides_no), d => d.year)

        data2 = Array.from(dt.values()).slice(0)
        if (datalineas.length == 0) {
            datalineas = data2;
        } else {
            datalineas = sumaArrays(datalineas, data2)
        }

        // sumatoria de poblacion
        var dtp = d3.rollup(data_temp, v => d3.sum(v, d => d.population), d => d.year)
        data_pobla = Array.from(dtp.values()).slice(0)
        if (datapoblacion.length == 0) {
            datapoblacion = data_pobla;
        }else {
            datapoblacion = sumaArrays(datapoblacion, data_pobla)
        }
        // agregar datos al dataset
        var dat2 = {
            label: '15-24 años',
            backgroundColor: Chart.helpers.color(yellow).alpha(0.1).rgbString(),
            borderColor: yellow,
            fill: 'false',
            tension: 0,
            pointRadius: 0,
            data: data2
        }
        datasets.push(dat2)
    }
    // filtrar datos si se lecciono check
    if ($('#check-25-34').prop('checked')) {
        data_temp = d3.filter(data, d => d.age == '25-34 years')

        data_homb = d3.filter(data_temp, d => d.sex == 'male')
        numHomb = numHomb + d3.sum(data_homb.map(d => d.suicides_no))

        data_muje = d3.filter(data_temp, d => d.sex == 'female')
        numMuje = numMuje + d3.sum(data_muje.map(d => d.suicides_no))

        var dt = d3.rollup(data_temp, v => d3.sum(v, d => d.suicides_no), d => d.year)

        data3 = Array.from(dt.values()).slice(0)

        if (datalineas.length == 0) {
            datalineas = data3;
        } else {
            datalineas = sumaArrays(datalineas, data3)
        }

        // sumatoria de poblacion
        var dtp = d3.rollup(data_temp, v => d3.sum(v, d => d.population), d => d.year)
        data_pobla = Array.from(dtp.values()).slice(0)
        if (datapoblacion.length == 0) {
            datapoblacion = data_pobla;
        }else {
            datapoblacion = sumaArrays(datapoblacion, data_pobla)
        }
        // agregar datos al dataset
        var dat3 = {
            label: '25-34 años',
            backgroundColor: Chart.helpers.color(pink).alpha(0.1).rgbString(),
            borderColor: pink,
            fill: 'false',
            tension: 0,
            pointRadius: 0,
            data: data3
        }
        datasets.push(dat3)
    }
    // filtrar datos si se lecciono check
    if ($('#check-35-54').prop('checked')) {
        data_temp = d3.filter(data, d => d.age == '35-54 years')

        data_homb = d3.filter(data_temp, d => d.sex == 'male')
        numHomb = numHomb + d3.sum(data_homb.map(d => d.suicides_no))

        data_muje = d3.filter(data_temp, d => d.sex == 'female')
        numMuje = numMuje + d3.sum(data_muje.map(d => d.suicides_no))

        var dt = d3.rollup(data_temp, v => d3.sum(v, d => d.suicides_no), d => d.year)

        data3 = Array.from(dt.values()).slice(0)

        if (datalineas.length == 0) {
            datalineas = data3;
        } else {
            datalineas = sumaArrays(datalineas, data3)
        }

        // sumatoria de poblacion
        var dtp = d3.rollup(data_temp, v => d3.sum(v, d => d.population), d => d.year)
        data_pobla = Array.from(dtp.values()).slice(0)
        if (datapoblacion.length == 0) {
            datapoblacion = data_pobla;
        }else {
            datapoblacion = sumaArrays(datapoblacion, data_pobla)
        }
      // agregar datos al dataset
        var dat3 = {
            label: '35-54 años',
            backgroundColor: Chart.helpers.color(cyan).alpha(0.1).rgbString(),
            borderColor: cyan,
            fill: 'false',
            tension: 0,
            pointRadius: 0,
            data: data3
        }
        datasets.push(dat3)
    }
    // filtrar datos si se lecciono check
    if ($('#check-55-74').prop('checked')) {
        data_temp = d3.filter(data, d => d.age == '55-74 years')

        data_homb = d3.filter(data_temp, d => d.sex == 'male')
        numHomb = numHomb + d3.sum(data_homb.map(d => d.suicides_no))

        data_muje = d3.filter(data_temp, d => d.sex == 'female')
        numMuje = numMuje + d3.sum(data_muje.map(d => d.suicides_no))

        var dt = d3.rollup(data_temp, v => d3.sum(v, d => d.suicides_no), d => d.year)
  
        data3 = Array.from(dt.values()).slice(0)

        if (datalineas.length == 0) {
            datalineas = data3;
        } else {
            datalineas = sumaArrays(datalineas, data3)
        }

        // sumatoria de poblacion
        var dtp = d3.rollup(data_temp, v => d3.sum(v, d => d.population), d => d.year)
        data_pobla = Array.from(dtp.values()).slice(0)
        if (datapoblacion.length == 0) {
            datapoblacion = data_pobla;
        }else {
            datapoblacion = sumaArrays(datapoblacion, data_pobla)
        }
       // agregar datos al dataset
        var dat3 = {
            label: '55-74 años',
            backgroundColor: Chart.helpers.color(purple).alpha(0.1).rgbString(),
            borderColor: purple,
            fill: 'false',
            tension: 0,
            pointRadius: 0,
            data: data3
        }
        datasets.push(dat3)
    }
    // filtrar datos si se lecciono check
    if ($('#check-75').prop('checked')) {
        data_temp = d3.filter(data, d => d.age == '75+ years')

        data_homb = d3.filter(data_temp, d => d.sex == 'male')
        numHomb = numHomb + d3.sum(data_homb.map(d => d.suicides_no))

        data_muje = d3.filter(data_temp, d => d.sex == 'female')
        numMuje = numMuje + d3.sum(data_muje.map(d => d.suicides_no))

        var dt = d3.rollup(data_temp, v => d3.sum(v, d => d.suicides_no), d => d.year)

        data3 = Array.from(dt.values()).slice(0)

        if (datalineas.length == 0) {
            datalineas = data3;
        } else {
            datalineas = sumaArrays(datalineas, data3)
        }

        // sumatoria de poblacion
        var dtp = d3.rollup(data_temp, v => d3.sum(v, d => d.population), d => d.year)
        data_pobla = Array.from(dtp.values()).slice(0)
        if (datapoblacion.length == 0) {
            datapoblacion = data_pobla;
        }else {
            datapoblacion = sumaArrays(datapoblacion, data_pobla)
        }
        // agregar datos al dataset
        var dat3 = {
            label: '75 + años',
            backgroundColor: Chart.helpers.color(brown).alpha(0.1).rgbString(),
            borderColor: brown,
            fill: 'false',
            tension: 0,
            pointRadius: 0,
            data: data3
        }
        datasets.push(dat3)
    }
    poblacion = datapoblacion
    total = datalineas
    index = 0
    delay()
    porHom = 0
    porMuj = 0
// crear datset para grafico de pie
    porHom = (numHomb / (numMuje + numHomb)) * 100
    porMuj = (numMuje / (numMuje + numHomb)) * 100
    porHom = parseFloat(porHom).toFixed(2)
    porMuj = parseFloat(porMuj).toFixed(2)

    $('#num_nombres').text(numHomb);
    $('#por_nombres').text(porHom + '%');

    $('#num_mujeres').text(numMuje);
    $('#por_mujeres').text(porMuj + '%');

    chartlinea.data.labels = label;
    chartlinea.data.datasets = datasets
    chartlinea.update();

    grafico_pie.data.datasets = [{
        data: [porHom, porMuj],
        backgroundColor: [
            Chart.helpers.color(red).alpha(0.5).rgbString(),
            Chart.helpers.color(blue).alpha(0.5).rgbString(),
        ]
    }]
    grafico_pie.update();

    // crear datset para grafico de barras
    grafico_barra.data.labels = label;
    grafico_barra.data.datasets = [{
        label: 'Total por año',
        backgroundColor: Chart.helpers.color(cyan).alpha(0.5).rgbString(),
        borderColor: cyan,
        data: datalineas
    }
    ]
    grafico_barra.update();
}
// funcion para la suma de array
function sumaArrays(array1, array2) {
    var array3 = [];
    var minLength = Math.min(array1.length, array2.length);
    for (var i = 0; i < minLength; i++) {
        array3[i] = array1[i] + array2[i];
    }
    return array3;
}
// funcion de tiempo para atualizar indicadores
function delay(){
    pintarbaner();
    setInterval(function(){ 
        pintarbaner();
     }, 3000);
}
//funcion pintar indicadores
function pintarbaner(){
    var num_pob = (poblacion[index]).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    num_pob = num_pob.substring(0, num_pob.length - 3);

    var num_tot = (total[index]).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    num_tot = num_tot.substring(0, num_tot.length - 3);

    var num_100k = (total[index] / (poblacion[index]/100000)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')

    $('.num_anio').text(anios[index])
    $('#num_pobla').text(num_pob)
    $('#num_promedio').text(num_tot)
    $('#num_100k').text(num_100k)
    if(anios.length - 1 == index){
      index = 0
    }else{
      index ++ 
    }      
}