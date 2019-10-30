
/*--------------------------------------------------------------------------------------------------------*/
// Mathematical Objects
/*--------------------------------------------------------------------------------------------------------*/

// Factorials Object
var factorials = {
    
    // Pre-calcuated values: 0 to 10
    y: [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800],
    
    // Calculates factorial of n and stores it in pre-calcuated values
    calc: function(n) {
        if(n >= this.y.length) {
            for(var i = this.y.length; i <= n; i++) {
                this.y.push(math.factorial(i));
            }
        }
        return this.y[n];
    }
};




/*--------------------------------------------------------------------------------------------------------*/
// Binomial Distributions
/*--------------------------------------------------------------------------------------------------------*/

// Binomial Distribution Object
class Binomial {
    
    constructor(n, p) {
        // Properties
        this.n = n;                             // Number of trials
        this.p = p;                             // Probability of success
        this.q = 1 - p;                         // Probability of failure
        this.mean = n * p;                      // Mean
        this.var = n * p * (1 - p);             // Standard deviation
        this.x = [];                            // X values
        this.y = [];                            // Y values: Probability mass function
        this.y2 = [];                           // Y2 values: Acumulative distribution function

        // Calculates distribution values
        this.calc(n, p);
    }
        
    // Calc method -> Calculates distribution
    calc(n, p) {
        var i;                              // Iterator
        var bc;                             // Binomial coefficient
        var n_fact = factorials.calc(n);    // n!
        var cp = 0;                         // Cumulative proability
        var y;                              // Probability value

        this.n = n;
        this.p = p;
        this.q = 1 - p;
        this.mean = n * p;
        this.var = n * p * (1 - p);
        this.x = [];
        this.y = [];
        this.y2 = [];
        for(i = 0; i <= n; i++) {
            this.x.push(i);
            if(i == 0 || i == n) {
                bc = 1;
            } else {
                bc = n_fact / (factorials.calc(i) * factorials.calc(n - i));
            }
            y = bc * math.pow(p, i) * math.pow(this.q, n - i);
            this.y.push(math.round(y, 6));
            cp += y;
            this.y2.push(math.round(cp, 6));
        }
    }
}


// Updates HTML elements and JS objects for a new value of parameter n
function update_bin_n(n) {
    
    document.getElementById('bin-dis-n_lbl_val').innerHTML = n;
}

// Updates HTML elements and JS objects for a new value of parameter p
function update_bin_p(p) {
    
    document.getElementById('bin-dis-p_lbl_val').innerHTML = Number.parseFloat(p).toFixed(2);
}


// Updates Binomial Distribution
function update_bin_dis() {

    var n = parseInt(document.getElementById('bin-dis-n_input').value);
    var p = parseFloat(document.getElementById('bin-dis-p_input').value);

    // Instantiates or updates first binomial distribution object
    if(bin1 === undefined) {
        bin1 = new Binomial(n, p);
    } else {
        bin1.calc(n, p);
    }

    // Updates metrics values
    document.getElementById('bin-dis-mean').innerHTML = bin1.mean.toFixed(2);
    document.getElementById('bin-dis-var').innerHTML = bin1.var.toFixed(2);

    // Updates data table
    update_bin_table();

    // Updates chart
    update_bin_chart(n);
}


// Updates Binomial Chart
function update_bin_chart(n) {

    // Data series
    binChart.data = [
        // PMF data
        {
            name: '$\\text{fmp: }P(X = x)$',
            x: bin1.x,
            y: bin1.y,
            type: 'scatter',
            mode: 'markers',
            marker: {color: 'red', size: 5},
            hoverlabel: {bgcolor: 'white'},
            hovertemplate: '<i>P(X = %{x}) = </i> <b>%{y:.4f}</b><extra></extra>',
        },
        // CDF data
        {
            name: '$\\text{FDA: }P(X \\leqslant x)$',
            x: bin1.x,
            y: bin1.y2,
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'blue', size: 5},
            line: {shape: 'hv', width: 0.8},
            hoverlabel: {bgcolor: 'white'},
            hovertemplate: '<i>P(X <= %{x}) = </i> <b>%{y:.4f}</b><extra></extra>',
        },
        // Mean data
        {
            name: '$\\mu$',
            x: [bin1.mean, bin1.mean],
            y: [0, 1],
            mode: 'lines',
            line: {color: 'green', width: 1, dash: 'dashdot'},
            hoverlabel: {bgcolor: 'white'},
            hovertemplate: '<i>E(X) = </i> <b>' + bin1.mean.toFixed(4) + '<extra></extra>',
        }
    ];
    if(!document.getElementById('bin-dis_pmf_cb').checked) {
        binChart.data[0].visible = false;
    } else if(!document.getElementById('bin-dis_cdf_cb').checked) {
        binChart.data[1].visible = false;
    } else if(!document.getElementById('bin-dis_mean_cb').checked) {
        binChart.data[2].visible = false;
    }

    // Chart settings
    binChart.layout = {
        //title: {text: '$\\text{Función masa de probabilidad: }P(X = x) = p(x)$'},
        //legend: {x: 1, y: 0.5},
        showlegend: false,
        xaxis: {
            title: {text: '$\\text{Número de éxitos: }X$'},
            showgrid: false,
            ticks: 'outside'
        },
        yaxis: {
            title: {text: '$\\text{Probabilidad}$'},
            showgrid: false,
            ticks: 'outside',
            tickformat: '.2f'
        }
    };
    if(n <= 30) {
        binChart.layout.xaxis.autotick = false;
        binChart.layout.xaxis.range = [0, n + 1];
        binChart.layout.xaxis.dtick = 1;
    }
    Plotly.newPlot('bin-chart', binChart.data, binChart.layout);
}


// Updates data table
function update_bin_table() {
    
    var i;
    var j = bin1.x.length;
    var s ='';

    for(i = 0; i < j; i++) {
        s += '<tr>' + 
                '<td>' + bin1.x[i] + '</td>' + 
                '<td>' + bin1.y[i].toFixed(4) + '</td>' + 
                '<td>' + bin1.y2[i].toFixed(4) + '</td>' +
                '<td>' + (1 - bin1.y2[i]).toFixed(4) + '</td>' + 
             '</tr>';
    }
    document.getElementById('bin-dis-tbl_body').innerHTML = s;
}


// Animates Binomial Chart
/*function animate_bin_cart(par) {
    var parRange = [];
    switch(par) {
        case 'n':
            
    }
}*/



/*--------------------------------------------------------------------------------------------------------*/
// Global Variables & Init Function
/*--------------------------------------------------------------------------------------------------------*/

var bin1;               // First binomial distribution instance
var bin2;               // Second binomial distribution instance
var binChart = {        // Binomial distribution chart object
    data: [],
    layout: {},
    toggle: function (cName) {
        switch(cName) {
            case 'pmf':
                if(document.getElementById('bin-dis_pmf_cb').checked) {
                    Plotly.restyle('bin-chart', {visible: true}, 0);
                } else {
                    Plotly.restyle('bin-chart', {visible: false}, 0);
                }
                break;
            case 'cdf':
                if(document.getElementById('bin-dis_cdf_cb').checked) {
                    Plotly.restyle('bin-chart', {visible: true}, 1);
                } else {
                    Plotly.restyle('bin-chart', {visible: false}, 1);
                }
                break;
            case 'mean':
                if(document.getElementById('bin-dis_mean_cb').checked) {
                    Plotly.restyle('bin-chart', {visible: true}, 2);
                } else {
                    Plotly.restyle('bin-chart', {visible: false}, 2);
                }
                break;
        }
    }
};


// Initializes DP application -> Called by onload event 
function initDP() {

    // Updates Binomial Distribution
    update_bin_dis();
    
    // Updates Latex
    update_latex();
}


// Updates Latex
function update_latex() {
    
    MathJax.Hub.Queue(['Typeset',MathJax.Hub,'bin-dis_formula']);
    MathJax.Hub.Queue(['Typeset',MathJax.Hub,'bin-dis_ds_fmp']);
    MathJax.Hub.Queue(['Typeset',MathJax.Hub,'bin-dis_ds_cdf']);
    MathJax.Hub.Queue(['Typeset',MathJax.Hub,'bin-dis_ds_mean']);
    MathJax.Hub.Queue(['Typeset',MathJax.Hub,'bin-dis-mean_lbl']);
    MathJax.Hub.Queue(['Typeset',MathJax.Hub,'bin-dis-var_lbl']);
    MathJax.Hub.Queue(['Typeset',MathJax.Hub,'bin-dis-n_lbl2']);
    MathJax.Hub.Queue(['Typeset',MathJax.Hub,'bin-dis-p_lbl2']);
    MathJax.Hub.Queue(['Typeset',MathJax.Hub,'bin-dis-otbl_f1']);
    MathJax.Hub.Queue(['Typeset',MathJax.Hub,'bin-dis-otbl_f2']);
    MathJax.Hub.Queue(['Typeset',MathJax.Hub,'bin-dis-otbl_f3']);
    MathJax.Hub.Queue(['Typeset',MathJax.Hub,'bin-dis-otbl_f4']);
}