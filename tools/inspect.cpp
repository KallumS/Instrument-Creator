// Dump plugin memory after playing a note for N blocks.
// usage: inspect fx.jsfx note blocks addr count [slider=value ...]
#include "ysfx.h"
#include <cstdio>
#include <cstdlib>
#include <vector>
static void logr(intptr_t, ysfx_log_level l, const char *m){ fprintf(stderr,"[%s] %s\n", ysfx_log_level_string(l), m); }
int main(int argc,char**argv){
  if(argc<6){fprintf(stderr,"usage\n");return 1;}
  ysfx_config_t*c=ysfx_config_new(); ysfx_set_log_reporter(c,&logr);
  ysfx_guess_file_roots(c, argv[1]);
  ysfx_t*fx=ysfx_new(c); ysfx_config_free(c);
  if(!ysfx_load_file(fx,argv[1],0)||!ysfx_compile(fx,ysfx_compile_no_gfx)){fprintf(stderr,"load/compile failed\n");return 2;}
  ysfx_set_sample_rate(fx,48000); ysfx_set_block_size(fx,256); ysfx_init(fx);
  for(int i=6;i<argc;i++){ int idx; double v; if(sscanf(argv[i],"%d=%lf",&idx,&v)==2) ysfx_slider_set_value(fx,idx-1,v,true); }
  int note=atoi(argv[2]), blocks=atoi(argv[3]); long addr=atol(argv[4]); int cnt=atoi(argv[5]);
  float z[256]={0}, o1[256], o2[256];
  uint8_t on[3]={0x90,(uint8_t)note,100};
  for(int b=0;b<blocks;b++){
    if(b==0){ ysfx_midi_event_t me; me.bus=0; me.offset=0; me.size=3; me.data=on; ysfx_send_midi(fx,&me); }
    const float*ins[2]={z,z}; float*outs[2]={o1,o2}; ysfx_process_float(fx,ins,outs,2,2,256);
    ysfx_midi_event_t mo; while(ysfx_receive_midi(fx,&mo)){}
  }
  std::vector<ysfx_real> buf(cnt); ysfx_read_vmem(fx,(uint32_t)addr,buf.data(),cnt);
  for(int i=0;i<cnt;i++) printf("%ld: %.6g\n", addr+i, buf[i]);
  ysfx_free(fx); return 0;
}
