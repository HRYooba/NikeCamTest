#define DIST_RATE 50.0
#define COLOR_RATE 0.8

uniform vec2 u_resolution; //画面のサイズ
uniform float u_time; //起動してからの時間
uniform sampler2DRect u_nowImage; //現在のカメラ画像
uniform sampler2DRect u_pastImage; //過去のカメラ画像
uniform sampler2DRect u_display; //shaderの画像

void main() {
    vec2 pos = gl_FragCoord.xy;
    
    vec4 col_now = texture2DRect(u_nowImage, pos);
    vec4 col_past = texture2DRect(u_pastImage, pos);
    vec2 dist = u_resolution/2.0 - pos; //中央から今の座標への距離
    vec4 col_display = texture2DRect(u_display, pos);
    
    vec3 diffRGB = col_now.rgb - col_past.rgb; //二つのカメラ画像のRGBの差分
    
    //色の差分が小さいところは除去
    if (length(diffRGB) < 0.2) {
        diffRGB = vec3(0.0, 0.0, 0.0);
    }
    
    vec4 color = vec4(length(diffRGB)*vec3(1.0*COLOR_RATE, 0.05*COLOR_RATE, 0.8*COLOR_RATE), 1.0);
    
    vec4 grad0 = texture2DRect(u_display, pos + dist / DIST_RATE);
    vec4 grad1 = texture2DRect(u_display, pos + vec2(-1.0, 1.0) + dist / DIST_RATE);
    vec4 grad2 = texture2DRect(u_display, pos + vec2(0.0, 1.0) + dist / DIST_RATE);
    vec4 grad3 = texture2DRect(u_display, pos + vec2(1.0, 1.0) + dist / DIST_RATE);
    vec4 grad4 = texture2DRect(u_display, pos + vec2(-1.0, 0.0) + dist / DIST_RATE);
    vec4 grad5 = texture2DRect(u_display, pos + vec2(1.0, 0.0) + dist / DIST_RATE);
    vec4 grad6 = texture2DRect(u_display, pos + vec2(-1.0, -1.0) + dist / DIST_RATE);
    vec4 grad7 = texture2DRect(u_display, pos + vec2(0.0, -1.0) + dist / DIST_RATE);
    vec4 grad8 = texture2DRect(u_display, pos + vec2(1.0, -1.0) + dist / DIST_RATE);
    vec4 colGrad = (grad0 + grad1 + grad2 + grad3 + grad4 + grad5 + grad6 + grad7 + grad8) / 9.0;
    
    if (u_time > 1.0) {
        gl_FragColor = (color + colGrad*1.95) / 2.0;
    } else {
        gl_FragColor = color;
    }
}
