// Drive the @gfx window with a mouse script and report what it changed.
// usage: click fx.jsfx out.bgra|- width height step... [slider=value ...]
// A step is one @gfx frame: "x,y,buttons[,mods[,wheel]]" (buttons: 1 left,
// 4 right; mods: 1 shift, 2 ctrl, 4 alt), or "wait=MS" to let real time pass
// (double-clicks are timed). Prints slider 13-23 values, and which sliders
// the window changed, automated and touched.
#include "ysfx.h"
#include <chrono>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <vector>
static void logr(intptr_t, ysfx_log_level l, const char *m){ fprintf(stderr,"[%s] %s\n", ysfx_log_level_string(l), m); }
static int32_t menu(void*, const char*, int32_t, int32_t){ return 0; }
int main(int argc,char**argv){
  if(argc<5){fprintf(stderr,"usage\n");return 1;}
  ysfx_config_t*c=ysfx_config_new(); ysfx_set_log_reporter(c,&logr);
  ysfx_guess_file_roots(c, argv[1]);
  ysfx_t*fx=ysfx_new(c); ysfx_config_free(c);
  if(!ysfx_load_file(fx,argv[1],0)){fprintf(stderr,"load failed\n");return 2;}
  if(!ysfx_compile(fx,0)){fprintf(stderr,"compile failed\n");return 3;}
  ysfx_set_sample_rate(fx,48000); ysfx_set_block_size(fx,256); ysfx_init(fx);
  for(int i=5;i<argc;i++){ int idx; double v; if(!strchr(argv[i],',')&&strncmp(argv[i],"wait=",5)&&sscanf(argv[i],"%d=%lf",&idx,&v)==2) ysfx_slider_set_value(fx,idx-1,v,true); }
  int w=atoi(argv[3]), h=atoi(argv[4]);
  float z[256]={0}, o1[256], o2[256];
  auto block=[&](){ const float*ins[2]={z,z}; float*outs[2]={o1,o2}; ysfx_process_float(fx,ins,outs,2,2,256); ysfx_midi_event_t mo; while(ysfx_receive_midi(fx,&mo)){} };
  for(int b=0;b<20;b++) block();
  std::vector<uint8_t> px((size_t)w*h*4, 0);
  ysfx_gfx_config_t gc{}; gc.pixel_width=w; gc.pixel_height=h; gc.pixel_stride=4*w; gc.pixels=px.data(); gc.scale_factor=1.0; gc.show_menu=&menu;
  ysfx_gfx_setup(fx,&gc);
  ysfx_gfx_set_window_state(fx,true,true,true);
  uint64_t chg=0, aut=0, tch=0;
  for(int i=5;i<argc;i++){
    int x,y,bt=0,md=0; double wh=0; int ms;
    if(sscanf(argv[i],"wait=%d",&ms)==1){ auto t0=std::chrono::steady_clock::now(); while(std::chrono::steady_clock::now()-t0<std::chrono::milliseconds(ms)){} continue; }
    if(sscanf(argv[i],"%d,%d,%d,%d,%lf",&x,&y,&bt,&md,&wh)<2) continue;
    ysfx_gfx_update_mouse(fx,md,x,y,bt,wh,0); ysfx_gfx_run(fx); block();
    chg|=ysfx_fetch_slider_changes(fx,0); aut|=ysfx_fetch_slider_automations(fx,0); tch|=ysfx_fetch_slider_touches(fx,0);
  }
  ysfx_gfx_update_mouse(fx,0,-1,-1,0,0,0); ysfx_gfx_run(fx);
  for(int s=13;s<=23;s++) printf("%d=%g ", s, ysfx_slider_get_value(fx,s-1));
  printf("\nchanged=%llx automated=%llx touched=%llx visible=%llx\n",(unsigned long long)chg,(unsigned long long)aut,(unsigned long long)tch,(unsigned long long)ysfx_get_slider_visibility(fx,0));
  if(strcmp(argv[2],"-")){ FILE*fo=fopen(argv[2],"wb"); fwrite(px.data(),1,px.size(),fo); fclose(fo); }
  ysfx_free(fx); return 0;
}
