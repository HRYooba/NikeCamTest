//数値が大きいほどオーラの進む量が大きい
#define DIST_RATE 50.0
//数値が小さいほど色が薄くなる
#define COLOR_RATE 0.8
//現在の周りの平均値をとるときの（MATRIX_RATE×MATRIX_RATE）
#define MATRIX_RATE 0.3

uniform vec2 u_resolution; //画面のサイズ
uniform float u_time; //起動してからの時間
uniform sampler2DRect u_nowImage; //現在のカメラ画像
uniform sampler2DRect u_pastImage; //過去のカメラ画像
uniform sampler2DRect u_display; //shaderの画像

void main() {
    //現在の座標を読み込む
    vec2 pos = gl_FragCoord.xy;
    //中央から今の座標への距離
    vec2 dist = u_resolution/2.0 - pos;
    
    //各種テクスチャの読み込み
    vec4 col_now = texture2DRect(u_nowImage, pos);
    vec4 col_past = texture2DRect(u_pastImage, pos);
    vec4 col_display = texture2DRect(u_display, pos);
    
    //二つのカメラ画像のRGBの差分
    vec3 diffRGB = col_now.rgb - col_past.rgb;
    
    //色の差分が小さいところは除去
    if (length(diffRGB) < 0.2) {
        diffRGB = vec3(0.0, 0.0, 0.0);
    }
    //色の差分から緑っぽい色に変換
    vec4 color = vec4(length(diffRGB)*vec3(1.0, 0.05, 0.8)*COLOR_RATE, 1.0);
    
    //現在の周りの平均値を取る
    vec4 gradSum = vec4(0.0, 0.0, 0.0, 0.0);
    for(float i =-MATRIX_RATE; i<=MATRIX_RATE; i+=MATRIX_RATE) {
        for (float j=-MATRIX_RATE; j<=MATRIX_RATE; j+=MATRIX_RATE) {
            gradSum += texture2DRect(u_display, pos + vec2(j, i) + dist / DIST_RATE);
        }
    }
    vec4 colGrad = gradSum / 9.0;
    
    //pixelの色を決定
    if (u_time > 1.0) {
        gl_FragColor = (color + colGrad * 1.9) / 2.0;
    } else {
        gl_FragColor = color;
    }
}
