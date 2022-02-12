/*
Create and Render map on div with zoom and center
*/
class OLMap {
  //Constructor accepts html div id, zoom level and center coordinaes
  constructor(map_div, zoom, center) {
    this.map = new ol.Map({
      target: map_div,
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat(center),
        zoom: zoom
      })
    });
  }
}

// Defining Static Style
let staticStyle = new ol.style.Style({
  // Line and Polygon Style
  stroke: new ol.style.Stroke({
    color: '#0e97fa',
    width: 4
  }),
  fill: new ol.style.Fill({
    color: 'rgba(0, 153, 255, 0.2)'
  }),

  // Point Style
  image: new ol.style.Circle({
    radius: 9,
    fill: new ol.style.Fill({
      color: [0, 153, 255, 1],
    }),
    stroke: new ol.style.Stroke({
      color: [255, 255, 255, 1],
      width: 5
    })
  })
});

// Defining Dynamic Styles
let dynamicStyle = {
  'Point': new ol.style.Style({
    image: new ol.style.Circle({
      radius: 10,
      fill: new ol.style.Fill({
        color: [247, 5, 25, 1],
      }),
      stroke: new ol.style.Stroke({
        color: [5, 74, 247, 1],
        width: 5
      })
    })
  }),
  'LineString': new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: [191, 17, 183, 1],
      width: 10
    })
  }),
  'Polygon': new ol.style.Style({
    // Line and Polygon Style
    stroke: new ol.style.Stroke({
      color: [255, 204, 0, 1],
      width: 10
    }),
    fill: new ol.style.Fill({
      color: [255, 0, 51, 0.4]
    })
  })
}

/*
Create Vector Layer
*/
class VectorLayer{
  //Constructor accepts title of vector layer and map object
  constructor(title, map) {
    this.layer = new ol.layer.Vector({
      title: title,      
      source: new ol.source.Vector({
        projection:map.getView().projection
      }),
      style: staticStyle
    })
  }
}


/*
Create a Draw interaction for LineString and Polygon
*/
class Draw {  
  //Constructor accepts geometry type, map object and vector layer
  constructor(type, map, vector_layer) {
    this.map = map;
    this.vector_layer = vector_layer;
    this.features = [];
    
    //Draw feature
    this.draw = new ol.interaction.Draw({
        type: type,
        stopClick: true,
        source: vector_layer.getSource()
    });
    
    this.map.addInteraction(this.draw);   
  }
}


//Create map and vector layer
let map = new OLMap('map', 9, [-96.6345990807462, 32.81890764151014]).map;
let vector_layer = new VectorLayer('Temp Layer', map).layer
map.addLayer(vector_layer);


//Add Interaction to map depending on your selection
let draw = null;
let drawClick = (e) => {  
  removeInteractions();
  let geomType = e.srcElement.attributes.geomtype.nodeValue;
  //Create interaction
  draw = new Draw(geomType, map, vector_layer);
}

//Add Modify Control to map
let modifyClick = (e) => {  
  //Remove previous interactions
  removeInteractions();

  //Select Features
  let select = new ol.interaction.Select({
    layers: [vector_layer],
    style: (e) => {
      return dynamicStyle[e.getGeometry().getType()];
    }
  });

  //Add Modify Control to map
  let modify = new ol.interaction.Modify({
    features: select.getFeatures()  
  });

  map.addInteraction(select);
  map.addInteraction(modify);
}



//Remove map interactions except default interactions
let removeInteractions = () => {
  let extra_interactions = map.getInteractions().getArray().slice(9);
  let len = extra_interactions.length;
  for (let i in extra_interactions) {
    map.removeInteraction(extra_interactions[i]);
  }  
}


//Clear vector features and overlays and remove any interaction
let clear = () => {
  removeInteractions();
  map.getOverlays().clear();
  vector_layer.getSource().clear();
}

//Bind methods to click events of buttons
let line = document.getElementById('btn1');
line.onclick = drawClick;

let poly = document.getElementById('btn2');
poly.onclick = drawClick;

let point = document.getElementById('btn4');
point.onclick = drawClick;

let modify_btn = document.getElementById('btn5');
modify_btn.onclick = modifyClick;

let clearGraphics = document.getElementById('btn3');
clearGraphics.onclick = clear;
