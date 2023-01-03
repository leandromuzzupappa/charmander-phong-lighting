varying vec3 vNormal;

uniform vec3 uDirectionalLight;

float hue2rgb(float f1,float f2,float hue){
    if(hue<0.)
    hue+=1.;
    else if(hue>1.)
    hue-=1.;
    float res;
    if((6.*hue)<1.)
    res=f1+(f2-f1)*6.*hue;
    else if((2.*hue)<1.)
    res=f2;
    else if((3.*hue)<2.)
    res=f1+(f2-f1)*((2./3.)-hue)*6.;
    else
    res=f1;
    return res;
}

vec3 hsl2rgb(vec3 hsl){
    vec3 rgb;
    
    if(hsl.y==0.){
        rgb=vec3(hsl.z);// Luminance
    }else{
        float f2;
        
        if(hsl.z<.5)
        f2=hsl.z*(1.+hsl.y);
        else
        f2=hsl.z+hsl.y-hsl.y*hsl.z;
        
        float f1=2.*hsl.z-f2;
        
        rgb.r=hue2rgb(f1,f2,hsl.x+(1./3.));
        rgb.g=hue2rgb(f1,f2,hsl.x);
        rgb.b=hue2rgb(f1,f2,hsl.x-(1./3.));
    }
    return rgb;
}

vec3 hsl2rgb(float h,float s,float l){
    return hsl2rgb(vec3(h,s,l));
}

void main(){
    
    float pi=3.14159265359;
    
    // ambient light (global ilumination)
    vec3 ambient=vec3(.5);
    
    // Diffuse lighting (lambertian)
    // lightColor, lightSource, normal, diffuseStrength
    vec3 normal=normalize(vNormal);
    vec3 lightColor=vec3(1.,1.,1.);
    vec3 lightSource=uDirectionalLight;
    
    float diffuseStrength=max(0.,dot(lightSource,normal));
    vec3 diffuse=diffuseStrength*lightColor+2.;
    
    // Specular light
    // lightColor, lightSource, normal, specularStrength, viewSource
    vec3 cameraSource=vec3(.5,-1.,-1.);
    vec3 viewSource=normalize(cameraSource);
    vec3 reflectSource=normalize(reflect(-lightSource,normal));
    
    float specularStrength=max(.5,dot(viewSource,reflectSource));
    specularStrength=pow(specularStrength,200.);
    vec3 specular=specularStrength*lightColor;
    
    // Lighting
    vec3 lighting=vec3(0.,0.,0.);
    lighting=ambient*.4*diffuse*10.5*specular*3.5;
    
    // Color
    vec3 modelColor=vec3(.9,.2,.05);
    vec3 color=modelColor*lighting;
    
    gl_FragColor=vec4(color,1.);
    
}