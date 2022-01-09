import { Component, OnInit } from '@angular/core';
import { briefHospital, hospitalModel } from '../_services/hospital.model';
import { HospitalService } from '../_services/hospital.service';

import Map from 'ol/Map';
import View from 'ol/View';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat,toLonLat } from 'ol/proj.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import {Circle as CircleStyle, Fill, Stroke, Style, Text,Icon} from 'ol/style';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import { toStringHDMS } from 'ol/coordinate.js';
import Geometry from 'ol/geom/Geometry';
import Cluster from 'ol/source/Cluster';
import { ThisReceiver } from '@angular/compiler';




//HospitalService
@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {
  
  
  vectorSource;
  clusterLayer;
  vectorLayer;
  rasterLayer;
  
  hospitalDetails:hospitalModel={
    x:"",
    y: "",
    fid: "",
    id: "",
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    zip4: "",
    telephone:"",
    type: "",
    status: "",
    population: "",
    county: "",
    countyfips:"" ,
    country: "",
    latitude: 0,
    longitude: 0,
    naicsCode: "",
    naicsDesc: "",
    source: "",
    sourcedate: "",
    valMethod: "",
    valDate: "",
    website: "",
    stateId: "",
    altName: "",
    stFips: "",
    owner: "",
    ttlStaff: "",
    beds: 0,
    trauma:"",
    helipad: ""
};

  constructor(public service:HospitalService) { }
  list:hospitalModel[];
  loading:boolean = false;
 // hospitalDetails: any;
    
  briefList:briefHospital[];
  map:Map;
  ngOnInit(): void {
    
    this.loadList();
    this.initilizeMap2();
    

  }

  checkModal(){
    console.log(this.hospitalDetails)
  }

  AddFeature(){
    this.vectorSource.clear();
    var featureTest=[]
    for (const element of this.list) {
    featureTest.push(new Feature({
      element: element,
      geometry: new Point(fromLonLat([element.longitude, element.latitude]))
    }))  
    };
    console.log(featureTest[1])
    this.vectorSource.addFeatures(featureTest)

  }
  clearMap(){
    this.map.dispose()
    
  }

 loadList(){
    
    this.loading=true;
  this.service.getHospitals().subscribe(res=> {
    this. list=res as hospitalModel[],this.loading=false,console.log("doldu"),this.AddFeature()})

    
  }
  checkList(){
    //  this.list.forEach(element => {
    //   this.vectorSource.addFeature(new Feature({
    //     element: element,
    //     geometry: new Point(fromLonLat([element.longitude, element.latitude]))
    //   }))  
    //   });
    


  }



  initilizeMap2() {


    const container = document.getElementById('popup');
    const content = document.getElementById('popup-content');
    const closer = document.getElementById('popup-closer');


    const overlay = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });

    this.vectorSource = new VectorSource({
      features: [
      ]
    });
    
    /*this.vectorLayer = new VectorLayer({
      source: this.vectorSource
    });
    */

    // for (const element of this.list) {
    // this.vectorSource.addFeature(new Feature({
    //   element: element,
    //   geometry: new Point(fromLonLat([element.longitude, element.latitude]))
    // }))  
    // };
    // this.list.forEach(element => {
    //   this.vectorSource.addFeature(new Feature({
    //     element: element,
    //     geometry: new Point(fromLonLat([element.longitude, element.latitude]))
    //   }))  
    //   });

    const clusterSource = new Cluster({
      distance: 40,
      source: this.vectorSource
    });
    this.clusterLayer = new VectorLayer({
      source: clusterSource
    })

    const styleCache = {};
      this.vectorLayer = new VectorLayer({
        source: clusterSource,
        style: function(feature) {
          const size = feature.get('features').length;
          let style = styleCache[size];
          if (!style) {
            if(size==1){
              style=new Style({
                image: new Icon(({
                  
                  crossOrigin: 'anonymous',
                  src: '/assets/final.png',
                  imgSize: [20, 20]
                }))

              })
            }
              else{style = new Style({
                image: new CircleStyle({
                  radius: 10,
                  stroke: new Stroke({
                    color: '#fff'
                  }),
                  fill: new Fill({
                    color: 'red'
                  })
                }),
                text: new Text(
                  {
                  text: size.toString(),
                  fill: new Fill({
                    color: '#fff'
                  })
                })
              });}
            styleCache[size] = style;
          }
          return style;
        }
      });

    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }), this.vectorLayer
      ],
      overlays: [overlay],
      target: 'map',
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });
    this.map=map;
// pointermove
    map.on('singleclick', (evt: any) => {
      const coordinate = evt.coordinate;

      if(map.hasFeatureAtPixel(evt.pixel)){
        var clickedFeatureClust= map.getFeaturesAtPixel(evt.pixel).pop();
        var clickedFeature =clickedFeatureClust.get("features");
        if(clickedFeature.length==1){
        var clickedHospital:hospitalModel= clickedFeature.pop().get("element");        
        this.hospitalDetails=clickedHospital;
        content.innerHTML = '<h4>'+ clickedHospital.name +'</h4>'+ '<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Launch demo modal</button>'

        overlay.setPosition(coordinate);
        }
 
        
        
      }

      
      


    });
    

    closer.onclick = function () {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    };
  }
  
  

}


