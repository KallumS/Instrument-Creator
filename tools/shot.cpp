// Headless screenshot of a JSFX's @gfx: writes raw BGRA pixels.
// usage: shot fx.jsfx out.bgra width height mouse_x mouse_y [slider=value ...]
// Runs one second of audio with a held note first, so meters have something to show.
// SHOT_SCALE=2 in the environment draws as on a Retina screen (gfx_ext_retina = 2);
// SHOT_CLICK=1 clicks once at the mouse position first (menus return nothing).
#include "ysfx.h"
#include <cstdio>
#include <cstdlib>
#include <vector>
static void logr(intptr_t, ysfx_log_level l, const char *m){ fprintf(stderr,"[%s] %s\n", ysfx_log_level_string(l), m); }
static int32_t menu(void*, const char*, int32_t, int32_t){ return 0; }
int main(int argc,char**argv){
  if(argc<7){fprintf(stderr,"usage\n");return 1;}
  ysfx_config_t*c=ysfx_config_new(); ysfx_set_log_reporter(c,&logr);
  ysfx_guess_file_roots(c, argv[1]);
  ysfx_t*fx=ysfx_new(c); ysfx_config_free(c);
  if(!ysfx_load_file(fx,argv[1],0)){fprintf(stderr,"load failed\n");return 2;}
  if(!ysfx_compile(fx,0)){fprintf(stderr,"compile failed\n");return 3;}
  ysfx_set_sample_rate(fx,48000); ysfx_set_block_size(fx,256); ysfx_init(fx);
  for(int i=7;i<argc;i++){ int idx; double v; if(sscanf(argv[i],"%d=%lf",&idx,&v)==2) ysfx_slider_set_value(fx,idx-1,v,true); }
  int w=atoi(argv[3]), h=atoi(argv[4]), mx=atoi(argv[5]), my=atoi(argv[6]);
  float z[256]={0}, o1[256], o2[256];
  uint8_t on[3]={0x90,60,100};
  for(int b=0;b<190;b++){
    if(b==0){ ysfx_midi_event_t me; me.bus=0; me.offset=0; me.size=3; me.data=on; ysfx_send_midi(fx,&me); }
    const float*ins[2]={z,z}; float*outs[2]={o1,o2}; ysfx_process_float(fx,ins,outs,2,2,256);
    ysfx_midi_event_t mo; while(ysfx_receive_midi(fx,&mo)){}
  }
  std::vector<uint8_t> px((size_t)w*h*4, 0);
  ysfx_gfx_config_t gc{}; gc.pixel_width=w; gc.pixel_height=h; gc.pixel_stride=4*w; gc.pixels=px.data(); gc.scale_factor=getenv("SHOT_SCALE")?atof(getenv("SHOT_SCALE")):1.0; gc.show_menu=&menu;
  ysfx_gfx_setup(fx,&gc);
  ysfx_gfx_set_window_state(fx,true,true,true);
  // SHOT_CLICK=1: click once at the mouse position before the last frame
  bool clk=getenv("SHOT_CLICK")!=nullptr;
  for(int k=0;k<4;k++){ ysfx_gfx_update_mouse(fx,0,mx,my,(clk&&k==1)?ysfx_button_left:0,0,0); ysfx_gfx_run(fx); }
  FILE*fo=fopen(argv[2],"wb"); fwrite(px.data(),1,px.size(),fo); fclose(fo);
  ysfx_free(fx); return 0;
}
