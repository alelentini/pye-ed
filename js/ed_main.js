// Decimal digits
var DEC_DIGITS = 2;

// Sample data
var sample = {};


// App initialization
function initED() {
    
    // Renders cells with Latex
    MathJax.Hub.Typeset();
}


// Calculates descriptive statistics
function calculateSample() {
    
    // If exists data
    if(document.getElementById('input-data').value != '') {

        // Process sample
        sample.data   = document.getElementById('input-data').value.replace(/ /g, '').split(',').map(x => parseFloat(x));
        sample.n      = sample.data.length;
        sample.min    = math.min(sample.data);
        sample.max    = math.max(sample.data);
        sample.range  = sample.max - sample.min;
        sample.mean   = math.mean(sample.data);
        sample.median = math.median(sample.data);
        sample.mode   = math.mode(sample.data);
        sample.var    = math.variance(sample.data);
        sample.std    = math.std(sample.data);
        sample.q1     = math.quantileSeq(sample.data, 0.25, false);
        sample.q2     = math.quantileSeq(sample.data, 0.5, false);
        sample.q3     = math.quantileSeq(sample.data, 0.75, false);

        // Updates Summary metric table
        updateSummMetrics();

        // Updates charts
        updateCharts();
    }    
}


// Updates Summary metric table
function updateSummMetrics() {

    var rows = document.getElementById('summMetrics-tbl_body').rows;

    rows[0].cells[2].innerHTML  = sample.n;                              // n
    rows[2].cells[2].innerHTML  = sample.min.toFixed(DEC_DIGITS);        // Min
    rows[3].cells[2].innerHTML  = sample.max.toFixed(DEC_DIGITS);        // Max
    rows[4].cells[2].innerHTML  = sample.range.toFixed(DEC_DIGITS);      // Range
    rows[5].cells[2].innerHTML  = sample.std.toFixed(DEC_DIGITS);        // Standard Deviation
    rows[6].cells[2].innerHTML  = sample.var.toFixed(DEC_DIGITS);        // Variance
    rows[8].cells[2].innerHTML  = sample.mean.toFixed(DEC_DIGITS);       // Mean
    rows[9].cells[2].innerHTML  = sample.median.toFixed(DEC_DIGITS);     // Median
    //rows[10].cells[2].innerHTML = sample.mode.join('; ');               // Mode
    rows[12].cells[2].innerHTML = sample.q1.toFixed(DEC_DIGITS);         // Cuartile 1
    rows[13].cells[2].innerHTML = sample.q2.toFixed(DEC_DIGITS);         // Cuartile 2
    rows[14].cells[2].innerHTML = sample.q3.toFixed(DEC_DIGITS);         // Cuartile 3
    
    // Shows table
    document.getElementById('summMetrics').classList.remove('d-none');
}


// Updates charts
function updateCharts() {
    

    // Chart data: Box-plot
    var data = [{
        x: sample.data,
        text: [],
        boxpoints: 'all',
        jitter: 0.3,
        pointpos: -1.8,
        type: 'box',
        boxmean: 'sd',
        marker: {color: 'rgb(10,140,208)'},
        name: '',
        hovertemplate: '<i>Observación:</i> <b>%{text}</b>' +
                       '<br><i>Valor:</i> <b>%{x}</b>',
        hoverlabel: {bgcolor: 'white', font: {color: 'black'}}
    }];
    for(var i = 0; i < sample.data.length; i++) {
        data[0].text.push(i + 1);
    }

    // Chart data: Histogram
    data[1] = {
        x: sample.data,
        type: 'histogram',
        marker: {color: 'rgba(10,140,208,0.7)', line: {color: 'rgba(10,140,208,1)', width: 2}},
        opacity: 0.75,
        xbins: {start: math.floor(sample.min), end: math.ceil(sample.max), size: (math.ceil(sample.max) - math.floor(sample.min)) / math.ceil(math.sqrt(sample.n))},
        name: '',
        hovertemplate: '<i>Intervalo de clase:</i> <b>%{x}</b>' +
                       '<br><i>Observaciones:</i> <b>%{y}</b>',
        hoverlabel: {bgcolor: 'white', font: {color: 'black'}}
    };
    
    // Charts Layout
    var layout = [
        // Chart 1: Box-plot
        {
            autosize: false, 
            height: 200, 
            margin: {b: 20, t: 0, p: 5},
            xaxis: {range: [math.floor(sample.min), math.ceil(sample.max)]}
        },
        
        // Chart 2: Histogram
        {
            autosize: false, 
            height: 300, 
            margin: {b: 20, t: 2, p: 5},
            xaxis: {range: [math.floor(sample.min), math.ceil(sample.max)]}
        }
    ];

    Plotly.newPlot('chart0', [data[0]], layout[0], {displayModeBar: false});
    Plotly.newPlot('chart1', [data[1]], layout[1], {displayModeBar: false});

    // Shows charts
    document.getElementById('chart0').classList.remove('d-none');
    document.getElementById('chart1').classList.remove('d-none');
    document.getElementById('chart1_fnote').classList.remove('d-none');
}