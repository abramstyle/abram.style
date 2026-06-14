// Full-screen triangle vertex shader.
export const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`

// Aurora fragment shader — spine-curtain technique:
// each curtain() = a meandering bottom spine (multi-freq sin + fbm), exponential
// vertical falloff, vertical-ray noise + fold brightening, coloured green->magenta.
// Three stacked curtains are summed, then exposure tone-mapped for a luminous glow.
// A water reflection below the horizon softens the curtains' lower edge.
export const FRAG = `precision highp float;
uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453123); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p);
  float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
  vec2 u=f*f*(3.-2.*f); return mix(mix(a,b,u.x),mix(c,d,u.x),u.y); }
float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.; a*=.5; } return v; }
vec3 curtain(float x,float y,float t,float base,float thick,float rayFreq,float spd,vec3 cLow,vec3 cHigh,float seed){
  float m = 0.0;
  m += 0.060*sin(x*1.7 + t*0.50*spd + seed);
  m += 0.035*sin(x*3.9 - t*0.80*spd + seed*2.0);
  m += 0.130*(fbm(vec2(x*0.8 + t*0.12*spd, seed)) - 0.5);
  float bottom = base + m;
  float dy = y - bottom;
  if(dy < 0.0) return vec3(0.0);
  float vfall = exp(-dy/thick);
  float edge  = smoothstep(0.0, 0.030, dy);
  float r = fbm(vec2(x*rayFreq + t*0.25*spd + seed*5.0, y*1.2));
  r = pow(clamp(r,0.0,1.0), 1.5);
  float rays = mix(0.45, 1.30, r);
  float folds = 0.55 + 0.9*fbm(vec2(x*1.3 + t*0.10*spd + seed*3.0, 5.0));
  float intensity = vfall*edge*rays*folds;
  float h = clamp(dy/(thick*2.2), 0.0, 1.0);
  vec3 col = mix(cLow, cHigh, smoothstep(0.0,1.0,h));
  col += vec3(0.0,0.25,0.35)*exp(-dy/(thick*0.25))*0.5;
  return col*intensity;
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float aspect = u_res.x / u_res.y;
  float x = uv.x * aspect - 0.06*u_mouse.x;
  float y = uv.y;
  float t = u_time;
  float horizon = 0.30;
  vec3 col = mix(vec3(0.020,0.036,0.075), vec3(0.004,0.006,0.020), uv.y);
  col += 0.46 * curtain(x,y,t, 0.34,0.20,  9.0,0.7, vec3(0.05,0.75,0.45), vec3(0.55,0.10,0.78), 1.3);
  col += 0.60 * curtain(x,y,t, 0.42,0.26, 14.0,1.0, vec3(0.10,1.00,0.55), vec3(0.78,0.16,0.70), 4.7);
  col += 0.48 * curtain(x,y,t, 0.52,0.32, 22.0,1.4, vec3(0.20,1.00,0.62), vec3(0.92,0.26,0.50), 9.1);
  float below = smoothstep(horizon+0.05, horizon-0.04, uv.y);
  float depth = clamp((horizon-uv.y)/0.34, 0.0, 1.0);
  float ripple = noise(vec2(uv.x*4.0, (horizon-uv.y)*8.0 + t*0.08));
  float refl = fbm(vec2(uv.x*2.2 + 0.24*ripple + t*0.02, depth*1.6 + t*0.05));
  refl = refl*refl*1.8;
  vec3 reflCol = mix(vec3(0.16,0.95,0.46), vec3(0.80,0.22,0.60), depth);
  vec3 water = vec3(0.012,0.028,0.050);
  water += reflCol * refl * (1.0 - 0.45*depth) * 0.55;
  water += vec3(0.03,0.10,0.09) * (1.0-depth);
  water *= 1.0 - 0.30*depth;
  col = mix(col, water, below);
  float starMask = smoothstep(horizon+0.06, 0.92, y);
  vec2 sp = uv*vec2(aspect,1.0)*230.0;
  vec2 cell = floor(sp);
  float h = hash(cell);
  if(h>0.985){
    float r = hash(cell + 19.3);
    vec2 f = fract(sp)-0.5;
    float tw = 0.45 + 0.55*sin(u_time*(0.6 + r*2.6) + r*6.2831);
    float bright = 0.45 + 0.55*r;
    col += vec3(0.75,0.83,1.0) * smoothstep(0.15,0.0,length(f)) * max(tw,0.0) * bright * starMask * 0.9;
  }
  col = vec3(1.0) - exp(-col * 1.25);
  vec2 q = uv-0.5; q.x*=aspect; col *= 1.0 - 0.40*dot(q,q);
  col += (hash(uv*u_res.xy + u_time) - 0.5) * 0.035;
  gl_FragColor = vec4(col, 1.0);
}`
