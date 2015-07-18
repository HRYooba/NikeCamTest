#define PI 3.14159265

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
    vec4 col_display = texture2DRect(u_display, pos + dist / 60.0);
    
    vec3 diffRGB = col_now.rgb - col_past.rgb; //二つのカメラ画像の色の差分
    
    //色の差分が小さいところは除去
    if (length(diffRGB) < 0.1) {
        diffRGB = vec3(0.0, 0.0, 0.0);
    }
    
    vec3 color = length(diffRGB)*vec3(1.0*0.2, 0.0, 0.8*0.2);
    vec3 Tcolor = color + col_display.rgb / 1.04;
    
    if (u_time > 0.05) {
        gl_FragColor = vec4(Tcolor, 1.0);
    } else {
        gl_FragColor = vec4(color, 1.0);
    }
}
