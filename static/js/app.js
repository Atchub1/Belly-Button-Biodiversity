function buildMetadata(firstSample) {

  //Function that builds the metadata panel

  // Fetch the metadata for a sample
  d3.json(`/metadata/${firstSample}`).then(function(data) {
    // console.log(data)
    // select the panel with id of `#sample-metadata`
    let panel = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    panel.selectAll("p").remove();
    for (let [key, value] of Object.entries(data)) {
      panel.append('p')
      .text(`${key}: ${value}`);
  
      // console.log(`${key}: ${value}`);
    }; 
  })
};



function buildCharts(sample) {

  //Fetch the sample data for the plots
  d3.json(`/samples/${sample}`)
    //Build a Bubble Chart using the sample data
    .then(function(response) {
      // console.log(response);
    let trace = {
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_labels, 
      mode: 'markers',
      marker: {
        color: response.otu_ids,
        size: response.sample_values
        }
    };

    
    let plotData = [trace];

    let layoutBubble = {
      xaxis: {title: 'otu_ids'},
      yaxis: {title: 'sample values'},
      height: 400,
      width: 700
    };
    
    Plotly.newPlot('bubble', plotData, layoutBubble, {response:true});
    
    
    //Build a Pie Chart
      let topSample_values = response.sample_values.slice(0,10);
      let topOtu_ids = response.otu_ids.slice(0,10);
      let topOtu_lables = response.otu_labels.slice(0,10);

      let tracePie = {
        labels: topOtu_ids,
        values: topSample_values,
        hovertext: topOtu_lables,
        type: 'pie'
      };

      let plotPieData = [tracePie];
    
      
      let layoutPie = {
        width: 500,
        height: 500
      }

      Plotly.newPlot('pie', plotPieData, layoutPie, {response:true});



  })}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
