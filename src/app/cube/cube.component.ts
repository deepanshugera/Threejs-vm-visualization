import { AfterViewInit, Component, ElementRef, Input, ViewChild, OnInit } from '@angular/core';
import * as THREE from 'three';
import * as STATS from 'stats-js';
import {Raycaster} from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import 'imports-loader?THREE=three!three/examples/js/controls/TrackballControls';
import 'imports-loader?THREE=three!three/examples/js/contols/DragControls';

@Component({
  selector: 'geometry-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.css']
})
export class CubeComponent implements AfterViewInit, OnInit {


  @ViewChild('canvas')
  private canvas: ElementRef;
  private controls: THREE.TrackballControls;
  private renderer =  new THREE.WebGLRenderer({antialias: true});
  private stats: STATS;
  private raycaster: THREE.Raycaster;
  private mouse = new THREE.Vector2(); INTERSECTED;
  scene = null;
  camera = null;
  mesh = null;
  hardDiskCube = null;
  private objects = new THREE.Object3D();
  private draggableObjects =[];

  @Input()
  public texture  = '/assets/textures/crate.gif';

  constructor() {
    this.raycaster = new Raycaster();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight));
    this.camera.position.set(100, 0, 100);
    this.createVmCube();
    this.createDiskCube();
  }

  public createVmCube() {

    const textureLoader = new THREE.TextureLoader();

    textureLoader.load('/assets/textures/crate.gif', t => {
      const geometry = new THREE.BoxBufferGeometry(50, 50, 50);
      const material = new THREE.MeshLambertMaterial({ map: t});
      this.mesh = new THREE.Mesh(geometry, material);
      this.mesh.name = 'VM';
      this.objects.add(this.mesh);

    });


    const ambientLight = new THREE.AmbientLight(0xcccccc);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(100, 0, 100);
    this.scene.add(pointLight);
    // this.addStats();
  }

  public createDiskCube() {
      const geometry = new THREE.BoxBufferGeometry(15, 15, 15);
      const material = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
      this.hardDiskCube =new THREE.Mesh(geometry, material);
      this.hardDiskCube.position.x = -110;
      this.hardDiskCube.position.y = 0;
      this.hardDiskCube.name = 'AddDisk';
      this.objects.add(this.hardDiskCube);
      this.draggableObjects.push(this.hardDiskCube);
  }
  public animate() {
    window.requestAnimationFrame(() => this.animate());
    this.scene.add(this.objects);
    TWEEN.update();
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  // public addStats() {
  //   this.stats = new STATS.Stats;
  //   document.body.appendChild(this.stats.domElement);
  // }

  /**
   * Update scene after resizing.
   */
  public onResize(event) {
    this.camera.aspect = window.innerWidth / (window.innerHeight );
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, (window.innerHeight ));
    this.controls.update();
  }

  public onMouseDown(event) {

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera( this.mouse, this.camera );
    const intersects = this.raycaster.intersectObjects( this.objects.children );
    if ( intersects.length > 0 ) {
      console.log('Intersected');
      console.log(intersects);
      if (intersects[0].object.name === 'VM') {
        console.log('Intersected VM');
      } else {
        console.log('Intersected Disk');
      }
    }
    //this.camera.reset();
    // if ( intersects.length > 0 ) {
    //   if ( this.INTERSECTED !== intersects[ 0 ].object ) {
    //     console.log(intersects[0].object)
    //     if ( this.INTERSECTED ) { this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex ); }
    //     this.INTERSECTED = intersects[ 0 ].object;
    //     this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex();
    //     this.INTERSECTED.material.emissive.setHex( 0xff0000 );
    //   }
    // } else {
    //   if ( this.INTERSECTED ) { this.INTERSECTED.material.emissive.setHex( 0xaaaa00 ); }
    //   this.INTERSECTED = null;
    // }
  }

  /* LIFECYCLE */

  /**
   * We need to wait until template is bound to DOM, as we need the view
   * dimensions to create the scene. We could create the cube in a Init hook,
   * but we would be unable to add it to the scene until now.
   */
  public ngAfterViewInit() {

    this.renderer.setSize(window.innerWidth, (window.innerHeight ));
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000);
    this.canvas.nativeElement.appendChild(this.renderer.domElement);
    this.controls = new THREE.TrackballControls(this.camera, this.canvas.nativeElement);
    this.animate();
  }

  public  ngOnInit() {}


}
