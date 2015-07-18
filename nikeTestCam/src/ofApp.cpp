#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup(){
    ofSetFrameRate(60);
    ofBackground(0);
    
    width = ofGetWidth();
    height = ofGetHeight();
    
    camera.initGrabber(width, height);
    camera.setDeviceID(0);
    
    nowImage.allocate(width, height, GL_RGB);
    pastImage.allocate(width, height, GL_RGB);
    nowDisplay.allocate(width, height, GL_RGB);
    pastDisplay.allocate(width, height, GL_RGB);
    
    pixelsBuffer = new unsigned char[width*height*3];
    
    shader.load("","shader.frag");
    
    fbo.allocate(width, height);
}

//--------------------------------------------------------------
void ofApp::update(){
    
    camera.update();
    if (camera.isFrameNew()) {
        unsigned char *pixels = camera.getPixels();
        
        nowImage.loadData(pixels, width, height, GL_RGB);
        pastImage.loadData(pixelsBuffer, width, height, GL_RGB);
        
        for (int i = 0; i < height*width*3; i++){
            pixelsBuffer[i] = pixels[i];
        }
    }
    
    nowDisplay = fbo.getTextureReference();
    
    fbo.begin();
    ofSetColor(255);
    shader.begin();
    shader.setUniform1f("u_time", ofGetElapsedTimef());
    shader.setUniform2f("u_resolution", width, height);
    shader.setUniformTexture("u_nowImage", nowImage, 0);
    shader.setUniformTexture("u_pastImage", pastImage, 1);
    shader.setUniformTexture("u_display", pastDisplay, 2);
    ofRect(0, 0, width, height);
    shader.end();
    fbo.end();
    
    pastDisplay = nowDisplay;
}

//--------------------------------------------------------------
void ofApp::draw(){
    ofScale(-1, 1);
    ofTranslate(-width, 0);
    fbo.draw(0, 0);
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    
}

//--------------------------------------------------------------
void ofApp::keyReleased(int key){
    
}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y ){
    
}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button){
    
}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button){
    
}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button){
    
}

//--------------------------------------------------------------
void ofApp::windowResized(int w, int h){
    
}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg){
    
}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo){
    
}
